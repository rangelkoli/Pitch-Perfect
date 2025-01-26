"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Play, Square } from "lucide-react";

interface WebcamContentProps {
  onStart?: () => void;
}

export function WebcamContent({ onStart }: WebcamContentProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreamActive(true);
      }
    } catch (err) {
      console.error("Error accessing the webcam", err);
    }
  };

  const stopWebcam = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsStreamActive(false);
  };

  const toggleWebcam = () => {
    if (isStreamActive) {
      stopWebcam();
    } else {
      startWebcam();
    }
  };

  const startStreaming = useCallback(() => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    const stream = videoRef.current.srcObject as MediaStream;
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      recordedChunksRef.current = []; // Clear the chunks
      await sendClipForAnalysis(blob);

      if (recording) {
        // Restart the recording for the next 6-second clip
        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 6000);
      }
    };

    // Start the first recording
    mediaRecorder.start();
    setRecording(true);
    setTimeout(() => mediaRecorder.stop(), 6000);
  }, [recording]);

  const stopStreaming = () => {
    setRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const sendClipForAnalysis = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("video", blob, "clip.webm");

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log(response);

      const { data } = response;
      setAnalysisResult(data);
    } catch (error) {
      console.error("Error sending video clip for analysis:", error);
    }
  };

  useEffect(() => {
    if (onStart) {
      onStart();
    }
  }, [onStart]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (recording) {
      interval = setInterval(() => {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state === "inactive"
        ) {
          startStreaming();
        }
      }, 6000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [recording, startStreaming]);

  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <video
        ref={videoRef}
        autoPlay
        muted
        className='w-full h-full object-cover'
      />
      <div className='mt-2 space-x-2'>
        <Button onClick={toggleWebcam}>
          {isStreamActive ? (
            <VideoOff className='mr-2 h-4 w-4' />
          ) : (
            <Video className='mr-2 h-4 w-4' />
          )}
          {isStreamActive ? "Stop Webcam" : "Start Webcam"}
        </Button>
        {isStreamActive && (
          <Button onClick={recording ? stopStreaming : startStreaming}>
            {recording ? (
              <Square className='mr-2 h-4 w-4' />
            ) : (
              <Play className='mr-2 h-4 w-4' />
            )}
            {recording ? "Stop Streaming" : "Start Streaming"}
          </Button>
        )}
      </div>
      {analysisResult && (
        <div className='mt-4 p-4 bg-gray-800 rounded-lg overflow-auto max-h-40'>
          <h2 className='text-white font-bold mb-2'>Analysis Result:</h2>
          <pre className='text-white text-sm'>
            {JSON.stringify(analysisResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

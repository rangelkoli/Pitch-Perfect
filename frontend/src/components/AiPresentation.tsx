import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
const WebcamStream: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]); // Stores chunks of recorded video

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const startStreaming = () => {
    if (!videoRef.current) return;

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
        // Restart the recording for the next 1-second clip
        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 6000);
      }
    };

    // Start the first recording
    mediaRecorder.start();
    setRecording(true);
    setTimeout(() => mediaRecorder.stop(), 6000);
  };

  const stopStreaming = () => {
    setRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setTimeout(() => startStreaming(), 1000);
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
          withCredentials: true, // Add this line to include credentials in the request
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
    startWebcam();
  }, []);

  return (
    <div className='flex justify-center flex-col '>
      <h1>Webcam Stream</h1>
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />
      {!recording ? (
        <button onClick={startStreaming}>Start Streaming</button>
      ) : (
        <button onClick={stopStreaming}>Stop Streaming</button>
      )}
      {analysisResult && (
        <div>
          <h2>Analysis Result:</h2>
          <div>{JSON.stringify(analysisResult, null, 2)}</div>
        </div>
      )}
    </div>
  );
};

export default WebcamStream;

"use client";

import { useState, useEffect, useCallback } from "react";
import { Window } from "./window";
import { PresentationContent } from "./presentation-content";
import { WebcamContent } from "./webcam-content";
import { ScriptContent } from "./script-content";
import { ScoreboardPage } from "./scoreboard-page";
import { Button } from "@/components/ui/button";

type WindowType = "presentation" | "webcam" | "script";

interface WindowState {
  type: WindowType;
  position: "large" | "small";
  content: React.ReactNode;
}

interface FeedbackItem {
  category: string;
  score: number;
  feedback: string;
}

export function PresentationLayout() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isFinished, setIsFinished] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const startScript = useCallback(() => {
    console.log("Starting script");
    // Implement script start logic here
  }, []);

  useEffect(() => {
    setWindows([
      {
        type: "presentation",
        position: "large",
        content: <PresentationContent />,
      },
      {
        type: "webcam",
        position: "small",
        content: (
          <WebcamContent
            onAnalysis={handleAnalysis}
            onVideoRecorded={handleVideoRecorded}
          />
        ),
      },
      {
        type: "script",
        position: "small",
        content: <ScriptContent onStart={startScript} />,
      },
    ]);
  }, [startScript]);

  const handleAnalysis = useCallback((analysisResult: any) => {
    // Process the analysis result and update feedbackData
    // This is a placeholder implementation. You should adapt this to your actual AI analysis output
    const newFeedbackItem: FeedbackItem = {
      category: "Speech Clarity",
      score: Math.random() * 10,
      feedback:
        "Your speech was clear and well-paced. Consider varying your tone to emphasize key points.",
    };
    setFeedbackData((prev) => [...prev, newFeedbackItem]);
  }, []);

  const handleVideoRecorded = useCallback((url: string) => {
    setVideoUrl(url);
  }, []);

  const handleMaximize = (windowType: WindowType) => {
    setWindows((prev) => {
      const newWindows = [...prev];
      const clickedWindowIndex = newWindows.findIndex(
        (w) => w.type === windowType
      );
      const largeWindowIndex = newWindows.findIndex(
        (w) => w.position === "large"
      );

      if (clickedWindowIndex === largeWindowIndex) {
        return prev;
      }

      newWindows[clickedWindowIndex].position = "large";
      newWindows[largeWindowIndex].position = "small";

      return newWindows;
    });
  };

  const startPresentation = () => {
    setIsStarted(true);
  };

  const finishPresentation = () => {
    setIsFinished(true);
  };

  const backToPresentation = () => {
    setIsFinished(false);
  };

  useEffect(() => {
    if (isStarted && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isStarted && countdown === 0) {
      startScript();
    }
  }, [isStarted, countdown, startScript]);

  const largeWindow = windows.find((w) => w.position === "large");
  const smallWindows = windows.filter((w) => w.position === "small");

  if (!isStarted) {
    return (
      <div className='h-screen w-full bg-zinc-900 flex items-center justify-center'>
        <Button onClick={startPresentation} size='lg'>
          Start Presentation
        </Button>
      </div>
    );
  }

  if (countdown > 0) {
    return (
      <div className='h-screen w-full bg-zinc-900 flex items-center justify-center'>
        <div className='text-white text-6xl font-bold'>{countdown}</div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <ScoreboardPage
        onBack={backToPresentation}
        feedbackData={feedbackData}
        videoUrl={videoUrl || ""}
      />
    );
  }

  return (
    <div className='h-screen w-full bg-zinc-900 p-4'>
      <div className='relative h-full w-full grid gap-4 grid-rows-[1fr_auto]'>
        {/* Large Window */}
        {largeWindow && (
          <Window
            key={largeWindow.type}
            title={largeWindow.type}
            isLarge={true}
            onMaximize={() => handleMaximize(largeWindow.type)}
            className='w-full h-full'
            content={largeWindow.content}
          />
        )}

        {/* Bottom Windows */}
        <div className='grid grid-cols-2 gap-4'>
          {smallWindows.map((window) => (
            <Window
              key={window.type}
              title={window.type}
              onMaximize={() => handleMaximize(window.type)}
              className='aspect-video'
              content={window.content}
            />
          ))}
        </div>
      </div>
      <Button onClick={finishPresentation} className='mt-4'>
        Finish Presentation
      </Button>
    </div>
  );
}

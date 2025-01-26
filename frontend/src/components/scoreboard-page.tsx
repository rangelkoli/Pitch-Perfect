"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FeedbackItem {
  category: string;
  score: number;
  feedback: string;
}

interface ScoreboardPageProps {
  onBack: () => void;
  feedbackData: FeedbackItem[];
  videoUrl: string;
}

export function ScoreboardPage({
  onBack,
  feedbackData,
  videoUrl,
}: ScoreboardPageProps) {
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    const totalScore = feedbackData.reduce((sum, item) => sum + item.score, 0);
    setOverallScore(Math.round((totalScore / feedbackData.length) * 10) / 10);
  }, [feedbackData]);

  return (
    <div className='h-screen w-full bg-zinc-900 p-8 overflow-auto'>
      <Button variant='ghost' onClick={onBack} className='mb-4'>
        <ArrowLeft className='mr-2 h-4 w-4' /> Back to Presentation
      </Button>
      <h1 className='text-3xl font-bold text-white mb-6'>
        Presentation Scoreboard
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <Card className='col-span-full'>
          <CardHeader>
            <CardTitle>Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-5xl font-bold text-center'>
              {overallScore}/10
            </div>
            <Progress value={overallScore * 10} className='mt-4' />
          </CardContent>
        </Card>

        <Card className='col-span-full md:col-span-1 md:row-span-2'>
          <CardHeader>
            <CardTitle>Presentation Video</CardTitle>
          </CardHeader>
          <CardContent>
            <video src={videoUrl} controls className='w-full h-auto' />
          </CardContent>
        </Card>

        <Card className='col-span-full md:col-span-1 md:row-span-2'>
          <CardHeader>
            <CardTitle>Detailed Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={feedbackData[0]?.category}>
              <TabsList className='grid grid-cols-2 mb-4'>
                {feedbackData.map((item, index) => (
                  <TabsTrigger key={index} value={item.category}>
                    {item.category}
                  </TabsTrigger>
                ))}
              </TabsList>
              {feedbackData.map((item, index) => (
                <TabsContent key={index} value={item.category}>
                  <h3 className='text-lg font-semibold mb-2'>
                    {item.category}
                  </h3>
                  <div className='text-3xl font-bold mb-2'>
                    {item.score}/100
                  </div>
                  <Progress value={item.score * 10} className='mb-4' />
                  <p>{item.feedback}</p>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {feedbackData.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{item.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold mb-2'>{item.score}/10</div>
              <Progress value={item.score * 10} className='mb-4' />
              <p className='line-clamp-3'>{item.feedback}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

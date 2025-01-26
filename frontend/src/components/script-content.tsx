"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, Play } from "lucide-react";

interface ScriptContentProps {
  onStart?: () => void;
}

export function ScriptContent({ onStart }: ScriptContentProps) {
  const [script, setScript] = useState("");
  const [isScriptStarted, setIsScriptStarted] = useState(false);

  const handleSave = () => {
    console.log("Saving script:", script);
  };

  const handleStartScript = () => {
    setIsScriptStarted(true);
    console.log("Starting script:", script);
  };

  useEffect(() => {
    if (onStart) {
      onStart();
    }
  }, [onStart]);

  return (
    <div className='flex flex-col h-full p-4'>
      <Textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder='Enter your script here...'
        className='flex-grow mb-4 resize-none text-white bg-zinc-700'
      />
      <div className='flex justify-between'>
        <Button onClick={handleSave}>
          <Save className='mr-2 h-4 w-4' /> Save Script
        </Button>
        <Button onClick={handleStartScript} disabled={isScriptStarted}>
          <Play className='mr-2 h-4 w-4' /> Start Script
        </Button>
      </div>
    </div>
  );
}

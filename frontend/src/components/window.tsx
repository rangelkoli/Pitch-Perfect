"use client";

import { Maximize, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WindowProps {
  title: string;
  isLarge?: boolean;
  onMaximize?: () => void;
  className?: string;
  content: React.ReactNode;
}

export function Window({
  title,
  isLarge = false,
  onMaximize,
  className,
  content,
}: WindowProps) {
  return (
    <div
      className={cn(
        "relative bg-zinc-800 rounded-lg overflow-hidden transition-all duration-300",
        className
      )}
    >
      <div className='absolute top-2 right-2 flex gap-2 z-10'>
        <Button
          variant='ghost'
          size='icon'
          className='h-6 w-6 text-white hover:bg-white/20'
          onClick={onMaximize}
        >
          <Maximize className='h-4 w-4' />
        </Button>
        {/* <Button
          variant='ghost'
          size='icon'
          className='h-6 w-6 text-white hover:bg-white/20'
        >
          <X className='h-4 w-4' />
        </Button> */}
      </div>
      <div className='h-full overflow-auto'>{content}</div>
    </div>
  );
}

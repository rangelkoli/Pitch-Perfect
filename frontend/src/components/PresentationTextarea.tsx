import { Textarea } from "./ui/textarea";
import { useId } from "react";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

function PresentationTextArea() {
  const id = useId();
  return (
    <div className='group relative min-w-[300px]'>
      {/* <label
        htmlFor={id}
        className='origin-start absolute top-0 block translate-y-2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:-translate-y-1/2 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+textarea:not(:placeholder-shown)]:pointer-events-none has-[+textarea:not(:placeholder-shown)]:-translate-y-1/2 has-[+textarea:not(:placeholder-shown)]:cursor-default has-[+textarea:not(:placeholder-shown)]:text-xs has-[+textarea:not(:placeholder-shown)]:font-medium has-[+textarea:not(:placeholder-shown)]:text-foreground'
      >
        <span className='inline-flex bg-background px-2'>
          Textarea with label animation
        </span>
      </label> */}
      <TextareaAutosize
        className='w-full h-full min-h-[400px] p-3 border-2 border-blue-500 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-300'
        placeholder='Enter your presentation text here...'
      />
    </div>
  );
}

export default PresentationTextArea;

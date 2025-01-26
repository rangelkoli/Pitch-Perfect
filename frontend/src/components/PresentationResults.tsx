import React from "react";
import Editor from "react-simple-wysiwyg";
import { useState } from "react";
import { usePresentationStore } from "@/stores/presentation";
const PresentationResults = () => {
  const script = usePresentationStore((state) => state.script);
  const [html, setHtml] = useState(script || "");
  function onChange(e: any) {
    usePresentationStore.setState({ script: e.target.value });
    setHtml(e.target.value);
  }

  return (
    <div className='w-full min-h-screen bg-black max-w-7xl pt-20'>
      <Editor value={html} onChange={onChange} className='w-full' />
    </div>
  );
};

export default PresentationResults;

import React, { useState } from "react";
import {
  BtnBold,
  BtnItalic,
  Editor,
  EditorProvider,
  Toolbar,
} from "react-simple-wysiwyg";
import WebcamStream from "./AiPresentation";
const PresentationPractice = () => {
  const [html, setHtml] = useState("");
  function onChange(e: any) {
    setHtml(e.target.value);
  }
  return (
    <div className='min-w-screen min-h-screen bg-black'>
      <div className='min-h-screen bg-black p-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12'>
          <div className='bg-white rounded-lg shadow-md p-6 text-black'>
            <WebcamStream />
          </div>

          <div className='bg-white rounded-lg shadow-md p-6 h-full  overflow-hidden'>
            <EditorProvider>
              <Editor
                value={html}
                onChange={onChange}
                color='black'
                className='text-black p-2 h-full'
              >
                <Toolbar></Toolbar>
              </Editor>
            </EditorProvider>
          </div>
        </div>
        <div className='fixed bottom-0 p-4 w-full bg-white'>asd</div>
      </div>
    </div>
  );
};

export default PresentationPractice;

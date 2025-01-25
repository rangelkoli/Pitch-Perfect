import React from "react";
import Editor from "react-simple-wysiwyg";
import { useState } from "react";

const PresentationResults = () => {
  const [html, setHtml] = useState("my <b>HTML</b>");
  function onChange(e: any) {
    setHtml(e.target.value);
  }

  return (
    <div>
      <Editor value={html} onChange={onChange} />
    </div>
  );
};

export default PresentationResults;

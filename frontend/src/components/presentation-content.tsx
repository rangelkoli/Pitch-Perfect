import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

export function PresentationContent() {
  const [pptUrl, setPptUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPptUrl(url);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='flex flex-col items-center justify-center h-full'>
      {!pptUrl ? (
        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-4 text-white'>
            Upload Presentation
          </h2>
          <Input
            type='file'
            accept='.ppt,.pptx'
            onChange={handleFileChange}
            className='hidden'
            ref={fileInputRef}
          />
          <Button onClick={handleUploadClick}>
            <Upload className='mr-2 h-4 w-4' /> Upload PPT
          </Button>
        </div>
      ) : (
        <div className='w-full h-full'>
          {/* <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(
              pptUrl
            )}&embedded=true`}
            className='w-full h-full border-none'
            title='Presentation Viewer'
          /> */}
        </div>
      )}
    </div>
  );
}

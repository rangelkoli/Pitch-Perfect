import React from "react";
import PresentationTextArea from "./PresentationTextarea";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import axios from "axios";

const PresentationFileUpload = () => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [text, setText] = React.useState("");
  const handleFileAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmitButton = async () => {
    // Handle submit button click
    console.log("Submit button clicked!");

    // toast.success("Presentation submitted successfully!", {
    //   position: "top-center",
    //   autoClose: 2000,
    //   hideProgressBar: true,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    // });

    try {
      const response = await axios
        .post(
          "http://127.0.0.1:5000/generate_presentation_script",
          {
            // Add file data here
            text: text,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(response);
          return response;
        });
      console.log("Presentation script generated successfully:", response.data);
    } catch (error) {
      console.error("Error generating presentation script:", error);
    }
  };

  return (
    <div className='max-w-7xl w-full'>
      <div className='flex flex-col md:flex-row min-h-[400px] gap-4 max-w-7xl w-full mt-20'>
        <div className='flex-1 flex flex-col'>
          <div className='flex-1 rounded-lg overflow-hidden'>
            <div className='h-full'>
              <div
                className='relative h-full rounded-lg border-2 border-blue-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer'
                onClick={handleFileAreaClick}
              >
                <div className='flex flex-col items-center p-4 text-center'>
                  <img
                    alt='File Icon'
                    className='mb-3 w-16 h-16'
                    src='https://img.icons8.com/dusk/64/000000/file.png'
                  />
                  <span className='block text-gray-500 font-semibold'>
                    Drag &amp; drop your files here
                  </span>
                  <span className='block text-gray-400 font-normal mt-1'>
                    or click to upload
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  name='file-upload'
                  className='hidden'
                  type='file'
                  onChange={(e) => {
                    // Handle file change
                    console.log("File selected:", e.target.files?.[0]?.name);

                    toast.success("File uploaded successfully!", {
                      position: "top-center",
                      autoClose: 2000,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Divider with OR for desktop */}
        <div className='hidden md:flex flex-col items-center justify-center'>
          <div className='w-px bg-gray-300 h-1/3'></div>
          <div className='text-gray-500 my-2 text-sm font-medium'>OR</div>
          <div className='w-px bg-gray-300 h-1/3'></div>
        </div>

        {/* Horizontal Divider with OR for mobile */}
        <div className='md:hidden flex items-center w-full'>
          <div className='flex-1 h-px bg-gray-300'></div>
          <div className='text-gray-200 mx-2 text-sm font-medium'>OR</div>
          <div className='flex-1 h-px bg-gray-300'></div>
        </div>

        <div className='flex-1'>
          <PresentationTextArea
            text={text}
            onChange={(event) => {
              console.log("Text changed!");
              setText(event.target.value);
            }}
          />
        </div>
      </div>
      <Button
        className='mt-4 w-full '
        onClick={() => {
          handleSubmitButton();
        }}
      >
        Upload File
      </Button>
      {text}
    </div>
  );
};

export default PresentationFileUpload;

import React from "react";
import TextareaAutosize from "react-textarea-autosize";

const PresentationFileUpload = () => {
  return (
    <div className='flex md:flex-row sm:flex-col'>
      <div className=' rounded-lg overflow-hidden '>
        <div className='md:flex'>
          <div className='w-full p-3'>
            <div className='relative h-48 rounded-lg border-2 border-blue-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out'>
              <div className='absolute flex flex-col items-center'>
                <img
                  alt='File Icon'
                  className='mb-3'
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
                name=''
                className='h-full w-full opacity-0 cursor-pointer'
                type='file'
              />
            </div>
          </div>
        </div>
      </div>
      {/* Divider */}
      <div className='relative flex py-5 items-center'>
        <div className='flex-grow border-t border-gray-400'></div>
        <span className='flex-shrink mx-4 text-gray-400'>Content</span>
        <div className='flex-grow border-t border-gray-400'></div>
      </div>
      <div>
        <TextareaAutosize
          minRows={3}
          minLength={20}
          className='w-80 h-48 bg-foreground text-foreground p-4 rounded-lg shadow-lg border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        />
      </div>
    </div>
  );
};

export default PresentationFileUpload;

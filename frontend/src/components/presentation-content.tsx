"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PresentationContent() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 5;

  const nextSlide = () =>
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 1));

  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <h2 className='text-2xl font-bold mb-4 text-white'>
        Slide {currentSlide}
      </h2>
      <div className='flex justify-between w-full px-4'>
        <Button onClick={prevSlide} disabled={currentSlide === 1}>
          <ChevronLeft className='mr-2 h-4 w-4' /> Previous
        </Button>
        <Button onClick={nextSlide} disabled={currentSlide === totalSlides}>
          Next <ChevronRight className='ml-2 h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}

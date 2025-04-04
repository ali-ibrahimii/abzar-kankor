import React from "react";
import Navbar from "../../components/Navbar";
import Link from 'next/link'
import { Button } from "@/components/ui/button"


const page = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">

      <video
      loop muted autoPlay playsInline
      className="absolute left-0 top-0 w-full h-screen object-cover "
      src="background.mp4"></video>


        {/* start main page  */}
        
      <div className="px-32">
        <div className="absolute top-0 left-0 w-full z-50">
          <Navbar />
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent z-20" />
        <div className="absolute top-0 left-0 px-38 z-10 flex flex-col items-start justify-center h-full text-white">
          <h1 className="text-5xl font-bold font-[roboto]">Abzar Kankor</h1>
          <p className="mt-4 text-md w-5/12 font-[roboto] text-[13px]">
            Experience knowledge in a modern, interactive, and intelligent 
            way with Abzar Kankor. From smart flashcards to comprehensive 
            educational resources, everything you need for success is here.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-0"></div>
        <Button className='absolute bottom-2 font-[roboto] rounded-full bg-white text-black font-normal z-50 hover:bg-gray-200' asChild>
          <Link className='cursor-pointer' href="/flashcard">Start Learning</Link>
        </Button>
      </div>

          {/* end main page  */}

          <div>

          </div>
          
    </div>
  );
};

export default page;

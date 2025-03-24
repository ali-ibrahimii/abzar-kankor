import React from "react";
import Navbar from "../../components/Navbar";
import Link from 'next/link'
import { Button } from "@/components/ui/button"


const page = () => {
  return (
    <div className="p-50 relative w-full h-screen overflow-hidden">

        {/* start main page  */}
        
      <div className="px-32">
        <video 
          src="/background.mp4" 
          className="absolute top-0 left-0 w-full h-full object-cover" 
          autoPlay loop muted 
        />
        <div className="absolute bottom-0 left-0 w-full h- bg-gradient-to-t from-black to-transparent z-20" />
        <div className="absolute top-0 left-0 w-full z-10">
          <Navbar />
        </div>
        <div className="absolute top-0 left-0 px-38 z-10 flex flex-col items-start justify-center h-full text-white">
          <h1 className="text-5xl font-bold font-[roboto]">Abzar Kankor</h1>
          <p className="mt-4 text-md w-5/12 font-[roboto] text-[13px]">
            Experience knowledge in a modern, interactive, and intelligent 
            way with Abzar Kankor. From smart flashcards to comprehensive 
            educational resources, everything you need for success is here.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-0"></div>
        <Button className='absolute bottom-2 font-[roboto] rounded-full bg-white text-black hover:bg-transparent hover:border-2 font-normal cursor-pointer' asChild>
          <Link className='cursor-pointer' href="/flashcard">Start Learning</Link>
        </Button>
      </div>

          {/* end main page  */}
          
    </div>
  );
};

export default page;

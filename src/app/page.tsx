"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavigationMenuDemo } from "@/components/NavigationMenu";
import Info from "@/components/Info";

const page = () => {
  return (
    <div className="relative w-full overflow-x-hidden flex flex-col">
      {/* navbar */}
      <div className="fixed top-0 left-0 z-50 w-full">
        <NavigationMenuDemo />
      </div>

      {/* background image */}
      <div className="fixed top-0 left-0 w-full h-screen -z-10">
        <img className="w-full h-full object-cover" src="background.jpg" alt="background" />
      </div>

      {/* hero section */}
      <div className="relative flex flex-col md:flex-row justify-between items-center w-full min-h-screen text-white px-6 md:px-35 py-20 md:py-0">
        {/* text */}
        <div className="flex flex-col items-start text-black max-w-md mb-8 md:mb-0">
          <span className="px-4 py-1 bg-amber-600 rounded-full mb-4">
            <p className="text-blue-600">Digital Growth</p>
          </span>
          <h1 className="text-[3em] md:text-[4em] font-bold leading-tight">Abzar Kankor</h1>
          <p className="mb-4 text-lg">The most newest technology in the country</p>

          <div className="flex gap-3">
            <Button className="rounded-full bg-transparent text-black border-2 hover:bg-black hover:text-white transition-all duration-300" asChild>
              <Link href="/DownloadApp">Download App</Link>
            </Button>
            <Button className="rounded-full bg-black text-white border-2 hover:bg-transparent hover:text-black transition-all duration-300" asChild>
              <Link href="/GetStart">Get Start</Link>
            </Button>
          </div>
        </div>

        {/* image */}
        <div className="w-full md:w-2/5 flex justify-center">
          <img className="w-4/5 md:w-full object-contain" src="main-background.png" alt="background" />
        </div>
      </div>

      {/* info section - comes after scrolling */}
      <div className="w-full flex justify-center py-10">
        <Info />
      </div>
    </div>
  );
};

export default page;

"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"


const Navbar = () => {

    const pathname = usePathname();
    
  return (
    <nav className='container relative px-25 py-5 mx-auto z-50'>
        <div className='flex justify-around text-white'>

            {/* start menubar */}
            
            <div className='space-x-12 font-[roboto] text-5xl flex items-center justify-center'>

                {/* logo */}
                
                <Link href="/">
                    <h1 className='font-bold font-[roboto] text-2xl '>Logo</h1>
                </Link>

                {/* navigation */}
                
                <Link
                    className={`relative text-[13px] after:content-[''] after:absolute after:left-0 after:-bottom-[5px] after:w-full after:h-[5px] after:rounded-full after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 ${pathname === '/flashCards' ? 'after:scale-x-100' : ''}`}
                    href="/">
                    Home
                </Link>
                <Link
                    className={`relative text-[13px] after:content-[''] after:absolute after:left-0 after:-bottom-[5px] after:w-full after:h-[5px] after:rounded-full after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 ${pathname === '/flashCards' ? 'after:scale-x-100' : ''}`}
                    href="/flashCards">
                    Flash Cards
                </Link>
                <Link
                    className={`relative text-[13px] after:content-[''] after:absolute after:left-0 after:-bottom-[5px] after:w-full after:h-[5px] after:rounded-full after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 ${pathname === '/flashCards' ? 'after:scale-x-100' : ''}`}
                    href="/ai-learning">
                    Ai Learning
                </Link>
                <Link
                    className={`relative text-[13px] after:content-[''] after:absolute after:left-0 after:-bottom-[5px] after:w-full after:h-[5px] after:rounded-full after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 ${pathname === '/flashCards' ? 'after:scale-x-100' : ''}`}
                    href="/library">
                    Library
                </Link>
                <Link
                    className={`relative text-[13px] after:content-[''] after:absolute after:left-0 after:-bottom-[5px] after:w-full after:h-[5px] after:rounded-full after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 ${pathname === '/flashCards' ? 'after:scale-x-100' : ''}`}
                    href="/contact">
                    Contact
                </Link>
                
            </div>

            {/* end menubar */}


            {/* start navbar btn */}
            
            <div className='flex flex-row items-center space-x-2'>
                {/* login btn */}
                <Button className='cursor-pointer font-[roboto] rounded-full bg-white text-black hover:bg-transparent hover:border-2 border-2 hover:text-white font-normal transition-all duration-300' asChild>
                    <Link className='' href="/login">Login</Link>
                </Button>
                {/* register btn */}
                <Button className='cursor-pointer rounded-full font-[roboto] bg-transparent border-2 text-white hover:bg-white hover:border-2 hover:text-black font-normal transition-all duration-300' asChild>
                    <Link className='' href="/login">Register</Link>
                </Button>
            </div>

            {/* end navbar btn */}

        </div>
    </nav>
  )
}

export default Navbar
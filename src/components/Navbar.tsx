
"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"


const Navbar = () => {

    const pathname = usePathname();
    
  return (
    <nav className='w-full h-auto py-5 z-50 text-white relative'>
        <div className='flex items-center justify-around'>

            {/* start menubar */}
            
            <div className='space-x-12 font-[roboto] text-5xl flex items-center justify-center'>

                {/* logo */}
                
                <Link href="/">
                    <h1 className='font-bold font-[roboto] text-2xl'>Logo</h1>
                </Link>

                {/* navigation */}
                
                <Link
                    className={`relative text-[13px] after:content-[''] after:absolute after:left-0 after:-bottom-[5px] after:w-full after:h-[2px] after:rounded-full after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 ${pathname === '/' ? 'after:scale-x-50' : ''}`}
                    href="/">
                    Home
                </Link>
                <Link
                    className={`relative text-[13px] after:content-[''] after:absolute after:left-0 after:-bottom-[5px] after:w-full after:h-[2px] after:rounded-full after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 ${pathname === '/flashCards' ? 'after:scale-x-100' : ''}`}
                    href="/flashCards">
                    Flash Cards
                </Link>
                <Link
                    className={`relative text-[13px] after:content-[''] after:absolute after:left-0 after:-bottom-[5px] after:w-full after:h-[2px] after:rounded-full after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 ${pathname === '/school' ? 'after:scale-x-100' : ''}`}
                    href="/school">
                    School
                </Link>
                <Link
                    className={`relative text-[13px] after:content-[''] after:absolute after:left-0 after:-bottom-[5px] after:w-full after:h-[2px] after:rounded-full after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 ${pathname === '/ai-learning' ? 'after:scale-x-100' : ''}`}
                    href="/ai-learning">
                    Ai Learning
                </Link>
                
                <Link
                    className={`relative text-[13px] after:content-[''] after:absolute after:left-0 after:-bottom-[5px] after:w-full after:h-[2px] after:rounded-full after:bg-white after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 ${pathname === '/contact' ? 'after:scale-x-100' : ''}`}
                    href="/contact">
                    Contact
                </Link>
                
            </div>

            {/* end menubar */}


            {/* start navbar btn */}
            
            <div className='flex flex-row items-center space-x-2'>
                {/* login btn */}
                <Button className='cursor-pointer font-[roboto] rounded-full bg-white text-black hover:bg-transparent hover:border-2 border-2 hover:text-white font-normal transition-all duration-300' asChild>
                    <Link className='text-[13px]' href="/login">Login</Link>
                </Button>
                {/* register btn */}
                <Button className='cursor-pointer rounded-full font-[roboto] bg-transparent border-2 text-white hover:bg-white hover:border-2 hover:text-black font-normal transition-all duration-300' asChild>
                    <Link className='text-[13px]' href="/login">Register</Link>
                </Button>
            </div>

            {/* end navbar btn */}

        </div>
    </nav>
  )
}

export default Navbar
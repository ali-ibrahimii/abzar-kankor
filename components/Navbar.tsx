import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"


const Navbar = () => {
  return (
    <nav className='container px-25 py-5 mx-auto z-10'>
        <div className='flex justify-around text-white'>
            {/* left menu */}
            <h1 className='font-bold font-[roboto] text-2xl '>Logo</h1>
            <div className='space-x-12 font-[roboto] font-normal flex items-center justify-center'>
                <Link className='text-[13px]' href="/">Home</Link>
                <Link className='text-[13px]' href="/flashCards">Flash Cards</Link>
                <Link className='text-[13px]' href="/library">Library</Link>
                <Link className='text-[13px]' href="/school">School</Link>
                <Link className='text-[13px]' href="/ai-learning">Ai Learning</Link>
                <Link className='text-[13px]' href="/contact">Contact</Link>
            </div>

            {/* right menu */}
            
            <div className='flex flex-row items-center space-x-2'>
                <Button className='font-[roboto] rounded-full bg-white text-black hover:bg-transparent hover:border-2 font-normal cursor-pointer' asChild>
                    <Link className='cursor-pointer' href="/login">Login</Link>
                </Button>
                <Button className='rounded-full font-[roboto] bg-transparent border-2 text-white hover:bg-black font-normal cursor-pointer' asChild>
                    <Link className='cursor-pointer' href="/login">Register</Link>
                </Button>
            </div>
        </div>
    </nav>
  )
}

export default Navbar
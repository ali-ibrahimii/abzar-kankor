import React from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react';
import { Button } from "@/components/ui/button"


const Navbar = () => {
  return (
    <nav className='container px-25 py-5 mx-auto z-10'>
        <div className='flex justify-between text-white'>
            {/* left menu */}
            <div className='space-x-12 flex items-center justify-center'>
                <h1 className='font-bold text-lg'>Logo</h1>
                <Link className='' href="/">Home</Link>
                <Link className='' href="/flashcards">flashcards</Link>
                <Link className='' href="/library">Library</Link>
                <Link className='' href="/school">School</Link>
                <Link className='' href="/ai-learning">Ai Learning</Link>
                <Link className='' href="/contact">Contact</Link>
                <Link className='' href="/about">About</Link>
            </div>

            {/* right menu */}
            
            <div className='flex flex-row items-center'>
                <Icon icon="ic:baseline-account-circle" width="38" height="38"  style={{color: '#fff'}} />
                <hr className='w-8 transform rotate-90' />
                <Button className='bg-white text-black hover:bg-gray-100 cursor-pointer' asChild>
                    <Link className='cursor-pointer' href="/login">Login</Link>
                </Button>
            </div>
        </div>
    </nav>
  )
}

export default Navbar
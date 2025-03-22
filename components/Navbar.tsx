import React from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react';
import { Button } from "@/components/ui/button"


const Navbar = () => {
  return (
    <nav className='container p-5 border mx-auto'>
        <div className='flex justify-between'>
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
            <div className='flex flex-row items-center'>
                <Icon icon="ic:baseline-account-circle" width="38" height="38"  style={{color: '#000'}} />
                <hr className='w-12 transform rotate-90' />
                <Button asChild>
                    <Link href="/login">Sign in</Link>
                </Button>
            </div>
        </div>
    </nav>
  )
}

export default Navbar
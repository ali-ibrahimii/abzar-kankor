import React from 'react'
import Navbar from '../../components/Navbar'

const page = () => {
  return (
    <div className='p-50 relative w-full mb-96 h-screen overflow-hidden bg-black'>
        <video src="/background.mp4" 
        className='absolute top-0 left-0 w-full h-full object-cover'
        autoPlay
        loop
        muted
        />

        <div className="absolute bottom-0 left-0 w-full h-45 bg-gradient-to-t from-black to-transparent z-20" />


‍‍‍‍       <div className="absolute top-0 left-0 w-full z-10">
            <Navbar />
        </div>

        <div className="relative z-10 flex flex-col items-start justify-center h-full text-white">
          <h1 className="text-5xl font-bold">Abzar Kankor</h1>
          <p className="mt-4 text-lg">The best educational app on the country</p>
        </div>
        
        <div className='absolute top-0 left-0 w-full h-full bg-black/50 z-0'></div>

        <div className=''></div>
    </div>
  )
}

export default page
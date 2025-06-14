import React from 'react'
import MagicButton from './ui/MagicButton'
import { FaLocationArrow } from 'react-icons/fa'
import { socialMedia } from '@/data'

const Footer = () => {
    return (
        <footer className='w-full  pb-10 mb-[100px] md:mb-5' id='contacts'>
            {/* <div className='w-full absolute left-0 -bottom-72 min-h-96'>
                <img src="/footer-grid.svg" alt="grid" className='w-full h-full opacity-30 ' />
            </div> */}
            <div className='py-10 relative flex flex-col items-center'>
                <h1 className='heading lg:max-w-[45vw]'>
                    Ready to take
                    <span className="text-purple-300"> your digital presence </span>
                    to the next level?
                </h1>
                <p className='text-center text-white md:mt-10 my-5 font-semibold '>Reach out to me today and let &apos; s discuss how we can work together to achieve your goals.</p>
                <a href="mailto:kusumbaphanisrikar@gmail.com">
                    <MagicButton
                        title='Let&apos;s Connect'
                        icon={<FaLocationArrow />}
                        postion='right'
                    />
                </a>
            </div>
            <div className='flex mt-16 md:flex-row flex-col justify-between items-center relative z-10 max-w-7xl w-full mx-auto px-5'>
                <p className='md:text-base text-sm md:font-normal font-light items-center'>Copyright © 2025 Phani Srikar </p>
                <div className="flex items-center md:gap-3 gap-6">
          {socialMedia.map((info) => (
            <div
              key={info.id}
              className="w-10 h-10 my-2 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
            >
              <a href={info.link}>
                <img src={info.img} alt="icons" width={20} height={20} />
              </a>
            </div>
          ))}
        </div>
            </div>
        </footer>
    )
}

export default Footer

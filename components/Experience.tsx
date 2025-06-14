import { workExperience } from '@/data'
import React from 'react'
import { Button } from './ui/MovingBorders'

const Experience = () => {
  return (
    <div className="py-15 relative lg:scale-85" id="testimonials">
      <h1 className="heading">
        My
        <span className="text-purple-300"> Work Experience </span>
      </h1>
      <div className="w-full mt-12 grid lg:grid-cols-4 md:grid-cols-1 gap-20 lg:scale-90">
        {workExperience.map((card)=>
        <Button
        key={card.id}
        duration={Math.floor(Math.random()*10000)+10000}
        borderRadius='1.75rem'
        className='flex-1 text-white border-neutral-200 dark:border-slate-700/50 border-[0.25px]  '
        >
            <div 
            className='flex flex-col lg:flex-row lg:items-center p-4 py-10 md:p-5 lg:p-10 gap-2 '
            >
                <img src={card.thumbnail} alt={card.thumbnail} className='lg:w-32 md:w-20 w-16 ' />
                <div className='lg:ms-5'>
                    <h1 className='text-start text-xl md:text-2xl font-bold'>
                        {card.title}
                    </h1>
                    <p className='text-start mt-3 font-semibold text-white-100'>
                        {card.desc}
                    </p>
                </div>
            </div>
        </Button>
        
        )}
        </div>
      
    </div>
  )
}

export default Experience

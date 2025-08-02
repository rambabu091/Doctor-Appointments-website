import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const Contact = () => {
  return (
    <div>
       <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          CONTACT  <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-20 text-sm'>
        <img  className="w-full md:max-w-[360px]" src={assets.contact_image}></img>
        <div className="flex flex-col justify-center  gap-6 items-start ">
          <p className="text-lg text-gray-600 font-semibold">Our OFFICE</p>
           <p className='text-gray-500'>54709 Willms Station <br></br>Suite 350, Washington, USA</p>
            <p className='text-gray-500'>Tel: (415) 555-0132 <br></br> Email: greatstackdev@gmail.com</p>
             <p className="text-gray-600 text-lg font-semibold"> Careers at PRESCRIPTO</p>
              <p className='text-gray-500'>Learn more about our teams and job openings.</p>
              <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>
    </div>
  )
}

export default Contact

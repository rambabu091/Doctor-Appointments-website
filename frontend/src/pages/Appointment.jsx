import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import { assets } from '../assets/assets_frontend/assets';
import RelatedDoctor from '../components/RelatedDoctor.jsx';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currency, backendUrl,token,getAllDoctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [docInfo, setDocInfo] = useState(null);

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId);
    setDocInfo(docInfo);
    console.log(docInfo);
  };

  const getAvailableSlots = async () => {
    setDocSlot([]);
    let today = new Date();
    
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // Set end time to 9 PM on the same day
      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      // Set start time
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        timeSlots.push({
          dateTime: new Date(currentDate),
          time: formattedTime,
        });

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlot(prev => [...prev, timeSlots]);
    }
  };

  
 // Add booking logic here
  const bookAppointment = async () => {
    if(!token){
      toast.warn("Please login to book appointment")
      return navigate('/login');

    }
    try {
      const date=docSlot[slotIndex][0].dateTime;
      let day=date.getDate();
      let month=date.getMonth()+1;
      let year=date.getFullYear();
      const slotDate=`${day}-${month}-${year}`;
      const {data}= await axios.post(backendUrl+'/api/user/book-appointment',{docId,slotDate,slotTime},{headers:{token}});
      if(data.success){
        toast.success(data.message);
         getAllDoctors();
         navigate('/my-appoinment')
      }else{
        toast.error(data.message);
      }



    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }


  }

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  useEffect(() => {
    console.log('Available slots:', docSlot);
  }, [docSlot]);

  if (!docInfo) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading doctor information...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Doctor Info */}
      <div className='flex flex-col gap-4 sm:flex-row'>
        <div>
          <img 
            className='bg-primary w-full sm:max-w-72 rounded-lg' 
            src={docInfo?.image} 
            alt={`Dr. ${docInfo?.name}`} 
          />
        </div>
        
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo?.name} 
            <img className='w-5' src={assets.verified_icon} alt="Verified" />
          </p>
          
          <div className='flex items-center gap-2 text-sm text-gray-600 mt-1'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>
              {docInfo.experience}
            </button>
          </div>
          
          <div>
            <p className='flex items-center gap-2 font-medium text-sm text-gray-900 mt-3'>
              About 
              <img src={assets.info_icon} alt="Info" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>
              {docInfo.about}
            </p>
          </div>
          
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: 
            <span className='text-gray-600'> {currency}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>
        
        {/* Date Selection */}
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {docSlot.length > 0 && docSlot.map((item, index) => (
            <div
              onClick={() => setSlotIndex(index)}
              key={index}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'
              }`}
            >
              <p>{item[0] && item[0].dateTime.toLocaleDateString('en-US', { weekday: 'short' })}</p>
              <p>{item[0] && item[0].dateTime.getDate()}</p>
            </div>
          ))}
        </div>

        {/* Time Selection */}
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlot.length > 0 && docSlot[slotIndex] && docSlot[slotIndex].map((item, index) => (
            <p
              onClick={() => setSlotTime(item.time)}
              key={index}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'
              }`}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>

        {/* Book Appointment Button */}
        <button
          onClick={bookAppointment}
          className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 hover:bg-primary/90 transition-colors'
        >
          Book an appointment
        </button>
      </div>
      <RelatedDoctor docId={docId} speciality={docInfo.speciality}/>
    </div>
  );
};

export default Appointment;

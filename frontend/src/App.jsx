import React from 'react'
import './index.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Doctor from './pages/Doctor.jsx'; 
import MyProfile from './pages/MyProfile.jsx';
import MyAppointment from './pages/MyAppointment.jsx';
import Appointment from './pages/Appointment.jsx';
import Login from './pages/Login.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import NavBar from './components/NavBar.jsx';
import Footer from './components/Footer.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
    <ToastContainer />
    <NavBar />
    
      <Routes>
        <Route path='/' element={<Home />} />
         <Route path="/doctor" element={<Doctor />} />  
        <Route path='/doctor/:speciality' element={<Doctor/>} />
        <Route path='/my-appointment' element={<MyAppointment />} />

      <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appoinment' element={<MyAppointment />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
      </Routes>
      <Footer />
    
    </div>
  )
}

export default App


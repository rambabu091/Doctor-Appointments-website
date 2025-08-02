import validator from "validator";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";
import DoctorModel from "../models/doctorsModel.js";
import jwt from "jsonwebtoken"; 
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorsModel.js";





const addDoctor = async (req,res)=>{

    try{
        const{name,email,password,speciality,degree,experience,about,fees,address}=req.body;
        const image=req.file;
        console.log(image,{name,email,password,speciality,degree,experience,about,fees,address})
        
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !image  ){
            return res.json({success:false,message:"All fields are required"});
        }

        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Invalid email"});

        }
        if(password.length<8){
            return res.json({success:false,message:"Password is not strong enough"});

        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const uploadImage=await cloudinary.uploader.upload(image.path,{resource_type:'image'});
        const imageUrl=uploadImage.secure_url;

        const doctorData={
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now(),
            
            

            
        }

        const newDoctor=new DoctorModel(doctorData);
        await newDoctor.save();
        return res.json({success:true,message:"Doctor added successfully"});

        


    }catch(error){

        console.log(error);
        return res.json({success:false,message:error.message});
    }
}

    //api for admin login

    const adminLogin=async(req,res)=>{
        try{
            const{email,password}=req.body;
            if(email==process.env.ADMIN_EMAIL && password==process.env.ADMIN_PASSWORD){
                const token=jwt.sign(email+password,process.env.JWT_SECRET);
                res.json({success:true,message:"Admin logged in successfully",token});
            }
            else{
                return res.json({success:false,message:"Invalid credentials"}); 
            }
        }
        catch(error){
            console.log(error)
            res.json({success:false,message:error.message});
        }
    }

//api to get all doctors data list to admin panel

const getAllDoctors=async(req,res)=>{
    try {
        const doctors=await DoctorModel.find({}).select("-password");
        res.json({success:true,doctors});
        
    } catch (error) {
        console.log(error)
            res.json({success:false,message:error.message});
        
    }
}

//Api to get all appointment list 
const appointmentsAdmin=async(req,res)=>{
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})


    } catch (error) {
       console.log(error)
            res.json({success:false,message:error.message});
         
    }
}


//API for Appointment cancellation

const appointmentCancel=async(req,res)=>{
    try {
        
    const {appointmentId}=req.body;
    const appointmentData=await appointmentModel.findById(appointmentId);

  
    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
    //releasing doctor slot

    const {docId,slotDate,slotTime}=appointmentData;
    const docData=await DoctorModel.findById(docId);
    let slots_booked=docData.slots_booked;
    slots_booked[slotDate]=slots_booked[slotDate].filter(time=>time!==slotTime);
    await DoctorModel.findByIdAndUpdate(docId,{slots_booked});
    res.json({success:true,message:"Appointment cancelled successfully"});

    } catch (error) {
        console.error(error);
        res.json({success:false,message:error.message});
    }
    

}

//API to get data to dashboard for admin panel
const adminDashboard=async(req,res)=>{
    try {
        const appointments=await appointmentModel.find({});
        const doctors =await doctorModel.find({});
        const user = await userModel.find({});
       const dashData={
        doctors:doctors.length,
        patients:user.length,
        appointment:appointments.length,
        latestAppointments:appointments.reverse().slice(0,5)
       
       }
       res.json({success:true,dashData});
        

    } 

    
        catch(error){
             console.error(error);
        res.json({success:false,message:error.message});
        }
    }

    //Api to delete doctor from admin panel
 const deleteDoctor = async (req, res) => {
    try {
        const { docId } = req.body;

        if (!docId) {
            return res.status(400).json({ success: false, message: "Doctor ID is required" });
        }

        const deletedDoctor = await DoctorModel.findByIdAndDelete(docId);

        if (!deletedDoctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        res.json({ success: true, message: "Doctor deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};




        


export  {addDoctor,adminLogin,getAllDoctors,appointmentsAdmin,appointmentCancel,adminDashboard,deleteDoctor};
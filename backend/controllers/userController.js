import validator from "validator";
import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from "cloudinary";
import DoctorModel from "../models/doctorsModel.js";
import AppointmentModel from "../models/appointmentModel.js";
import razorpay from 'razorpay';
import appointmentModel from "../models/appointmentModel.js";






//API to register new user
const registerUser=async(req,res)=>{
    try {
        const{name,email,password}=req.body;    
        if(!name || !email || !password){
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
            const userData={
                name,
                email,
                password:hashedPassword,

            }
       

            const newUser=new UserModel(userData);
            const user = await newUser.save();   
             const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
            return res.json({success:true,message:"User registered successfully",token});
        } catch (error) {
            console.log(error)
             res.json({success:false,message:error.message});
        
        }
}

//API to login user
const loginUser=async(req,res)=>{

    try {
       const{email,password}=req.body;
       const user =await UserModel.findOne({email});
       if(!user){
         return res.json({success:false,message:"User not found"});
       }
       const isMatch=await bcrypt.compare(password,user.password);
       if(isMatch){
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
         res.json({success:true,message:"User logged in successfully",token});
       }
       else{
         res.json({success:false,message:"Invalid credentials"});
       }
    } catch (error) {
         console.log(error)
             res.json({success:false,message:error.message});
    }
} 


//API to get user profile data 
const getProfile=async(req,res)=>{

 try {
   const userId = req.userId;
    const userData= await UserModel.findById(userId).select("-password");
    res.json({success:true,userData});
  

    
 } catch (error) {
    console.log(error)
             res.json({success:false,message:error.message});
 }
}

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;  // From auth middleware
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized user" });
    }
    
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    // Validate required fields
    if (!name || !phone || !dob || !gender) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Parse address safely
    let parsedAddress = address;
    if (typeof address === "string") {
      try {
        parsedAddress = JSON.parse(address);
      } catch {
        return res.status(400).json({ success: false, message: "Invalid address format" });
      }
    }

    // Build update object
    const updateData = {
      name,
      phone,
      dob,
      gender,
      address: parsedAddress,
    };

    // If an image file is included, upload to Cloudinary and add to update
    if (imageFile) {
      const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = uploadResult.secure_url;
    }

    // Update user in DB (returning updated document)
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Success response with updated user data (optional)
    res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//API to book appointment

const bookAppointment=async(req,res)=>{
    try {
        const userId = req.userId;
        const {docId,slotDate,slotTime,}=req.body;
        const docData=await DoctorModel.findById(docId).select("-password");
        if(!docData.available){
            return res.json({success:false,message:"Doctor is not available"});

        }
       let slots_booked = docData.slots_booked ;
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:"Slot not available"});
            } else{
            slots_booked[slotDate].push(slotTime);
        
        }
        }else{
            slots_booked[slotDate]=[];
            slots_booked[slotDate].push(slotTime);
        
        }
        const userData=await UserModel.findById(userId).select("-password");
        delete docData.slots_booked;

       
        const appointmentData={
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            date:Date.now(),
            slotDate,
            slotTime,
           
        }
        const newAppointment=new AppointmentModel(appointmentData);
        await newAppointment.save();
        // save new slot data in doctor data

        await DoctorModel.findByIdAndUpdate(docId, {slots_booked},{
            new:true,
        });
        res.json({success:true,message:"Appointment booked successfully"});

       

         
    } catch (error) {
        console.error( error);
    res.status(500).json({ success: false, message: error.message });
    }

    

    
}

//API to get user appointment
const listAppointment = async (req, res) => {
  try {
    // Get userId from authenticated request (set by middleware)
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Find appointments for this user
    const appointments = await AppointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}


//API for cancel the appointment

const cancelAppointment=async(req,res)=>{
    try {
        const userId = req.userId;
    const {appointmentId}=req.body;
    const appointmentData=await AppointmentModel.findById(appointmentId);

    if(appointmentData.userId!==userId){
        return res.json({success:false,message:"You are not authorized to cancel this appointment"});
    }
    await AppointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
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

//API to payment
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const paymentRazoarpay= async(req,res)=>{
    try {
       const {appointmentId}=req.body
   const appointmentData=await appointmentModel.findById(appointmentId);
   if(!appointmentData ||appointmentData.cancelled){
    return res.json({success:false,message:"Appointment not found"});
   }
   // create option of razorpay

   const options={
    amount:appointmentData.amount*100,
    currency:"INR",
    receipt:appointmentId,
   }
   const order= await razorpayInstance.orders.create(options);
   res.json({success:true,order}); 
    } catch (error) {
       console.error(error);
        res.json({success:false,message:error.message}); 
    }
    


   
}

//API verify payment

const verifyRazorpay=async(req,res)=>{
    try {
        const {razorpay_order_id}=req.body;
        const orderInfo =await razorpayInstance.orders.fetch(razorpay_order_id);
        

        if(orderInfo.status==='paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
            res.json({success:true,message:"Payment verified"});
        }else{
            res.json({success:false,message:"Payment failed"});
        }
        
        

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}


export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazoarpay,verifyRazorpay};
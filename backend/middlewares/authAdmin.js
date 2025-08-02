import jwt from "jsonwebtoken";

const authAdmin=(req,res,next)=>{
 try{
    const {atoken}=req.headers;
    if(!atoken){
        return res.json({success:false,message:'not authrozied Login again'})
 }
    const decoded=jwt.verify(atoken,process.env.JWT_SECRET);
   if(decoded !== process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD){
    return res.json({success:false,message:'not authrozied Login again'})
   }
   
    next();
   

}
 catch(error){
    console.log(error)
    res.json({success:false,message:error.message});
 
 }

}

export default authAdmin;
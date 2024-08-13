import jwt from "jsonwebtoken"

const generateTokenandsetCookie=(userId,res)=>{
  const token=jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:'15d'
  })
  res.cookie("jwt",token,{
    maxAge:15*24*60*60*1000 ,//in millisecond
    httpOnly:true,//prevent XSS attack also known as cross site scripting attack
    sameSite:"strict" ,//prevent CSRF attack cross site request forgery attack
    secure: process.env.NODE_ENV !=="development"//    
  })
}

export default generateTokenandsetCookie;
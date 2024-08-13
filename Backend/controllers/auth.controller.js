import bcryptjs from "bcryptjs"
import User from "../models/user.model.js"
import generateTokenandsetCookie from "../utils/generateToken.js"

export const signup=async(req,res)=>{
    try {
        const {fullname,username,password,confirmPassword,gender}=req.body

        if(password!==confirmPassword){
           return res.status(400).json({error:"Password do not match"})

        }

        const user= await User.findOne({username})
        if(user){
            return res.status(400).json({error:"Username already exists"})
        }
        //hashing of password
        
        const salt= await bcryptjs.genSalt(10)
        const hashedpassword= await bcryptjs.hash(password,salt)

        //avatar based on username
        const boyProfilepic=`https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilepic=`https://avatar.iran.liara.run/public/girl?username=${username}`

        const newuser= new User({
            fullname,
            username,
            password:hashedpassword,
            gender,
            profilePic: gender==="male" ? boyProfilepic:girlProfilepic
        })
        
        if(newuser){
            // generate JWT token 
        generateTokenandsetCookie(newuser._id,res);    
        await newuser.save()
        res.status(201).json({
            _id:newuser._id,
            fullname:newuser.fullname,
            username:newuser.username,
            profilePic:newuser.profilePic
        })
    }else{
        res.status(400).json({error:"Invalid user data"})
    }

    } catch (error) {
        res.status(500).json({error:"Internal Server Error"})
    }
}


export const login=async(req,res)=>{
    try {
        const {username,password}=req.body
        const user= await User.findOne({username})
        
        const isPasswordCorrect= await bcryptjs.compare(password,user.password || "")
        

        if(!user ||!isPasswordCorrect){
            return res.status(400).json({error:"Invalid credentials"})
        }

        generateTokenandsetCookie(user._id,res);
        res.status(201).json({
            _id:user._id,
            fullname:user.fullname,
            username:user.username,
            profilePic:user.profilePic
        })

    } catch (error) {
        res.status(500).json({error:"Internal Server Error"})
    }
}


export const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        return res.status(200).json({message:"logout successful"})
    } catch (error) {
        res.status(500).json({error:"Internal Server Error"})
    }
}


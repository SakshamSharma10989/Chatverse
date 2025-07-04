
import { useState } from "react"
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext.jsx";

const useSignup = () => {
   const[loading,setLoading]=useState(false);
   const {setAuthUser}=useAuthContext()
   const signup=async({fullname,username,password,confirmPassword,gender})=>{
    const success= handleInputErrors({fullname,username,password,confirmPassword,gender})
    if(!success) {return;}

    setLoading(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullname, username, password, confirmPassword, gender }),
            credentials: "include", // 🔥 crucial for sending cookies
        });


        const data=await res.json();
        console.log(data)
        if(data.error){
            throw new Error(data.error)
        }
        localStorage.setItem("chat-user",JSON.stringify(data))
        setAuthUser(data)
    } catch (error) {
        toast.error(error.message)
    }finally{
        setLoading(false)
    }
   }
   return {loading,signup}
}

export default useSignup

function handleInputErrors({fullname,username,password,confirmPassword,gender}){
    if(!fullname || !username || !password || !confirmPassword || !gender){
          toast.error("Please fill in all fields")
          return false
    }
    if(password!==confirmPassword){
        toast.error("Password does not match")
        return false
    }
    if(password.length<6){
        toast.error('Password must be 6 character')
        return false
    }

    return true
}
import mongoose from "mongoose"

const connectToMongo=async()=>{
    try {
        let data=await mongoose.connect(process.env.MONGODB_URL)
    console.log(`MongoDB Connected: ${data.connection.host}`);
    } catch (error) {
        console.log(error)
        throw new Error("Cannot connect to mongoDB")
    }
    
}

export default connectToMongo;
import mongoose from "mongoose"

export async function connecMongoDB() {
    let connection_path=process.env.DB_CONNECTION+process.env.DB_NAME||'mongodb+srv://YR2142:214276065@yealrabinprojectdb.h5sryxq.mongodb.net/Project_shop';
    try{
        let connect=await mongoose.connect(connection_path);
        console.log("connected to dataBase:  "+connect.connection.name )
    }catch(err){
        console.log("there is an error in the connection to dataBase")
        console.log(err)
        process.exit(1)
    }
}

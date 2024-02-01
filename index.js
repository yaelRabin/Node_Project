import { config } from "dotenv";
import cors from 'cors'
import express from "express"
//--------
import errorsHandler from './middlewares/errorsHandlerMiddleware.js'
import userRouter from './routes/user.js'
import producRouter from './routes/product.js'
import orderRouter from './routes/order.js'
import {connecMongoDB} from './config/connectToDB.js'



config(); //let to do process.___
const app=express(); //create dataBase
app.use(express.json())  //let access to the body of the request
app.use(cors({origin:'http://localhost:500',methods:"DELETE"}))
connecMongoDB() 

// app.use((req,res)=>{
//     res.json(req.body);
// })
app.use('/api/users',userRouter);
app.use('/api/products',producRouter)
app.use('/api/orders',orderRouter)

app.use(errorsHandler)
app.use((req,res)=>{
    res.status(404).send('sorry, the page not found!!')
})


let port=process.env.PORT||5000
app.listen(port,()=>{console.log(`listening on port ${port}`)})

import express from 'express'

import auth from '../middlewares/auth.js'
import authAdamin from '../middlewares/authAdmin.js'
import {addOrder,getAllOrders,deleteOrder,getAllOrdersOfUser,updateOrderStatus} from '../controllers/order.js'


const router=express.Router()
router.use('/',(req,res,next)=>{
    console.log('entet to routes orders file')
    next()
})
router.get('/',authAdamin,getAllOrders)
router.get('/user',auth,getAllOrdersOfUser)
router.post('/',auth,addOrder)
router.put('/:id',authAdamin,updateOrderStatus)
router.delete('/:id',auth,deleteOrder)





export default router
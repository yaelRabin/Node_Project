import express from  "express"
//----
import {getAllUsers,addUser,login, deleteById, getById} from '../controllers/user.js'
import authAdamin from '../middlewares/authAdmin.js'


const router=express.Router();

router.use((req,res,next)=>{
    console.log("enter to the routes")
    next()
})

router.get('/',authAdamin,getAllUsers);
router.get('/:id',authAdamin,getById)
router.post('/',addUser)
router.post('/login',login)
router.delete('/:id',authAdamin,deleteById)
// router.put('/:id',editUser)
 
router.use((req,res)=>{
    return res.status(404).json({type:"request error",message:"the page not found"})
})
export default router;
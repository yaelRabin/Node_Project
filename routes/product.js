import express from 'express'
import  {getAllProducts,addProduct,deleteProduct,editProduct,getProductById} from '../controllers/product.js'
import authAdamin from '../middlewares/authAdmin.js'


const router=express.Router()

router.use((req,res,next)=>{
    console.log('enter to product router')
    next()
})

router.get('/',getAllProducts)
router.get('/:id',getProductById)
router.post('/',authAdamin,addProduct)
router.put('/:id',authAdamin,editProduct)
router.delete('/:id',authAdamin,deleteProduct)

export default router;


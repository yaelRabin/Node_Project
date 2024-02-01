import Joi from "joi";
import mongoose from "mongoose";
import { Product } from "./product.js";


const productInOrderSchema = mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    amount: Number
})

async function productInOrderValidator(req_productInOrder) {
    const schema = Joi.object({
        productId: Joi.string().required(),
        amount: Joi.number().required()
    })
    const result = schema.validate(req_productInOrder);
    if (result.error)
        return { error: result.error.details[0].message };
    if (!mongoose.isValidObjectId(req_productInOrder.productId))
        return {error:'invalid productId'}
    let product = await Product.findById(req_productInOrder.productId)
    if (!product)
        return { error: 'product not exist' }
    console.log(product)
    if (product.amountStock < req_productInOrder.amount)
        return { error: 'We dont have enough for the amount you wanted' }
    return result;
}

const orderModel = mongoose.Schema({
    orderDate: { type: Date, default: Date.now() },
    dueDate: Date,
    address: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [productInOrderSchema],
    isInWay: { type: Boolean, default: false }
})
const Order = mongoose.model('orders', orderModel)


function orderValidator(req_order) {
    const schema = Joi.object({
        dueDate: Joi.date().greater('now').required(),
        address: Joi.string().required(),
        products: Joi.array().items().required()
    });

    return schema.validate(req_order);
}


export { Order, orderValidator, productInOrderValidator }




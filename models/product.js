import mongoose from "mongoose";
import Joi from "joi"


async function codeForProduct() {
    let arr = await Product.find({})
    if (arr.length == 0)
        return 200
    return arr[arr.length - 1].code + 1
}

let productSchema = mongoose.Schema({
    code: Number,
    name: String,
    price: Number,
    weight: Number,
    imgUrl: String,
    addingDate: Date,
    description: String,
    amountStock:Number
})
productSchema.pre('save', async function (next) {
    this.code = await codeForProduct();
    this.addingDate = Date.now()
    next();
});

const Product = mongoose.model("products", productSchema);

function productValidator(_product) {
    const schema = Joi.object({
        name: Joi.string().min(4).max(30).required(),
        price: Joi.number().min(1).required(),
        weight: Joi.number().min(25).required(),
        imgUrl: Joi.string(),
        description: Joi.string(),
        amountStock:Joi.number().min(0).max(500)
    })
    return schema.validate(_product)
}
function editedProductValidator(_product) {
    const schema = Joi.object({
        name: Joi.string().min(4).max(30),
        price: Joi.number().min(1),
        weight: Joi.number().min(25),
        imgUrl: Joi.string(),
        description: Joi.string(),
        amountStock:Joi.number().min(0).max(500)
    })
    return schema.validate(_product)
}

export { Product, productValidator,editedProductValidator}
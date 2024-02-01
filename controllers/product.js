import mongoose, { isValidObjectId } from 'mongoose';

import { Product, productValidator, editedProductValidator } from "../models/product.js";

async function getAllProducts(req, res) {
    let { price, amountStock, weight, name } = req.query
    let perPage = req.query.perPage || 3
    let numPage = req.query.numPage || 1
    try {
        let filter = {}
        if (price) {
            if (price[0] == '-')
                filter.price = { $lte: +price.substring(1) }
            if (price[0] == '=')
                filter.price = +price.substring(1)
            if (price[0] == '^')
                filter.price = { $gt: +price.substring(1) }
        }
        if (amountStock)
            filter.amountStock = amountStock
        if (weight)
            filter.weight = weight
        if (name)
            filter.name = new RegExp(name)
        if (amountStock)
            filter.amountStock = amountStock
        console.log(filter)
        let products = await Product.find(filter)
            .skip((numPage - 1) * perPage).limit(perPage)
        return res.json(products)
    }
    catch (error) {
        res.status(400).json({ type: 'getAllProducts process failed', message: error.message })
    }
}
async function getProductById(req, res) {
    let { id } = req.params
    // if (!id)
    //     return res.status(400).json({ type: 'error with find product', message: 'missing product id' })
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ type: 'error with find product', message: 'invalid product id' })
    try {
        let product = await Product.findById(id)
        if (!product)
            return res.status(404).json({ type: 'error with find product', message: 'product not found in the system' })
        return res.json(product)
    }
    catch (error) {
        res.status(400).json({ type: 'getProductById process failed', message: error.message })
    }

}

async function addProduct(req, res) {
    try {
        let product = productValidator(req.body)
        if (product.error)
            return res.status(400).json({ type: 'invalid product', message: product.error.details[0].message })
        let { name, imgUrl } = req.body
        let sameProduct = await Product.findOne({ $or: [{ name }, { imgUrl }] })
        if (sameProduct)
            return res.status(409).json({ type: 'conflict error', message: 'there is same product in the system (with such name or img)' })
        let newProduct = await Product.create(product.value)
        return res.json(newProduct)
    }
    catch (error) {
        console.log(error.message)
        res.status(400).json({ type: 'adding product process failed', message: error.message })
    }
}
async function deleteProduct(req, res) {
    let { id } = req.params
    if (!id)
        return res.status(400).json({ type: 'error with delete product', message: 'missing product code' })
    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({ type: 'error with delete product', message: 'id is not valid object' })
        let product = await Product.findByIdAndDelete(id)
        if (!product)
            return res.status(404).json({ type: 'cant delete this product', message: 'product not fount in the system' })
        return res.json(product)
    }
    catch (error) {
        res.status(400).json({ type: 'delete-product process  failed', message: error.message })
    }

}

async function editProduct(req, res) {
    let { id } = req.params
    if (!id)
        return res.status(400).json({ type: 'cant edit product', message: 'missing product id' })
    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({ type: 'cant edit product', message: 'id is not valid object' })
        if (!req.body)
            return res.status(400).json({ type: 'cant edit product', message: 'missing fields to edit' })
        let productToEdit = await Product.findById(id)
        if (!productToEdit)
            return res.status(404).json({ type: 'cant edit product', message: 'product to edit not found' })
        let newProduct = editedProductValidator(req.body)
        if (newProduct.error)
            return res.status(400).json({ type: 'cant edit product', message: newProduct.error.details[0].message })
        await Product.findByIdAndUpdate(id, newProduct.value)
        let editedProduct = await Product.findById(id)
        res.json(editedProduct)
    }
    catch (error) {
        res.status(400).json({ type: 'edit-product process failed', message: error.message })
    }
}




export { getAllProducts, addProduct, deleteProduct, editProduct, getProductById };

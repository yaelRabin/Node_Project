import { Order, orderValidator, productInOrderValidator } from '../models/order.js'
import { Product } from '../models/product.js'
import { isValidObjectId } from 'mongoose';

async function getAllOrders(req, res) {
    try {
        let allOrders = await Order.find()
        return res.json(allOrders)
    }
    catch (error) {
        res.status(400).json({ type: 'getAllOrders process throw an error', message: error.message })
    }
}
async function getAllOrdersOfUser(req, res) {
    try {
        let { _id } = req.userToken
        let ordersOfUser = await Order.find({ userId: _id })
        if (ordersOfUser.length == 0)
            return res.status(404).json({ type: 'getAllOrdersOfUser process failed', message: 'user has no orders' })
        res.json(ordersOfUser)
    }
    catch (error) {
        return res.status(400).json({ type: 'getAllOrdersOfUser process throw an error', message: error.message })
    }

}

async function addOrder(req, res) {
    try {
        let token = req.userToken
        let order = req.body
        order.dueDate = new Date(order.dueDate);
        console.log(order.dueDate)
        let productsInOrder = order.products
        for (const item of productsInOrder) {
            let validationResult = await productInOrderValidator(item)
            if (validationResult.error) {
                let errType = 'one details of product ' + (productsInOrder.findIndex(x => x.productId === item.productId) + 1) + ' are wrong'
                return res.status(400).json({ type: errType, message: validationResult.error })
            }
        }
        let newOrder = orderValidator(order)
        if (newOrder.error)
            return res.status(400).json({ type: 'invalid order', message: newOrder.error.details[0].message })
        newOrder = newOrder.value
        newOrder.userId = token._id
        newOrder = await Order.create(newOrder)
        decAmountStock(newOrder)
        res.json(newOrder)
    }
    catch (error) {
        res.status(400).json({ type: 'adding product process throw an error', message: error.message })
    }
}
async function decAmountStock(newOrder) {  ///when new order added
    try {
        for (const item of newOrder.products) {
            let { amountStock } = await Product.findById(item.productId)
            await Product.findByIdAndUpdate(item.productId, { amountStock: amountStock - item.amount })
        }
    }
    catch (error) {
        return res.send("error in update amountStock")
    }

}
async function updateOrderStatus(req, res) {
    try {
        let { id } = req.params
        if (!isValidObjectId(id))
            return res.status(400).json({ type: 'updateOrderStatus process failed', message: 'invalid order id' })
        let order = await Order.findById(id)
        if (!order)
            return res.status(404).json({ type: 'updateOrderStatus process failed', message: 'order not found' })
        if (order.isInWay)
            return res.status(400).json({ type: 'updateOrderStatus process failed', message: 'order status already updated' })
        await Order.findByIdAndUpdate(id, { isInWay: true })
        let updatedOrder = await Order.findById(id)
        res.json(updatedOrder)
    }
    catch (error) {
        return res.status(400).json({ type: 'updateOrderStatus process throw an error', message: error.message })
    }

}

async function deleteOrder(req, res) {
    try {
        let orderId = req.params.id
        if (!isValidObjectId(orderId))
            return res.status(400).json({ type: 'deleteOrder process failed', message: 'invalid order id' })
        let order = await Order.findById(orderId)
        if (!order)
            return res.status(404).json({ type: 'deleteOrder process failed', message: 'order not found' })
        if (req.userToken.role != 'ADMIN' && req.userToken._id != order.userId)
            return res.status(403).json({ type: 'deleteOrder process failed by forbidden error', message: 'delete order is not permitted for user' })
        if (order.isInWay)
            return res.status(400).json({ type: 'deleteOrder process failed by refusal', message: 'sorry,we cant delete the order, its already on its way to you' })
        let deletedOrder = await Order.findByIdAndDelete(orderId)
        incAmountStock(deletedOrder)
        res.json(deletedOrder)
    }
    catch (error) {
        return res.status(400).json({ type: 'deleteOrder process throw an error', message: error.message })
    }
}
async function incAmountStock(deletedOrder) {  ///when  order deleted
    try {
        for (const item of deletedOrder.products) {
            let { amountStock } = await Product.findById(item.productId)
            await Product.findByIdAndUpdate(item.productId, { amountStock: amountStock + item.amount })
        }
    }
    catch (error) {
        return res.send("error in update amountStock")
    }

}
export { addOrder, getAllOrders, deleteOrder, getAllOrdersOfUser, updateOrderStatus }
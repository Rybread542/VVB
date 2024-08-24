const { getProductByID, getProductPrice } = require("../db/fetch-product")
const { bundleIDToBundle } = require("./id_gen")

async function cartTotals(db, cartItems) {

    let tax = 0.00
    let total = 0.00
    let sub = 0.00
    const delivery = 5.99
    if(cartItems){
        const pricePromises = await Promise.all(cartItems.map(async (item) => {
            const price = await getProductPrice(db, item.product_id)
            return price*item.quantity
        }))
        
        sub = pricePromises.reduce((sum, price) => sum + price, 0)

        tax = sub*0.0805
        total = sub+tax+delivery
    }

    return {sub, tax, delivery, total}
}

async function parseCart(db, cartItems) {
    const parsed = Promise.all(cartItems.map(async item => {
        const productData = await getProductByID(db, item.product_id)
        return {
            key: item.id,
            cart_id: item.cart_id,
            product_id: item.product_id,
            quantity: item.quantity,
            name: productData.product_name,
            isBundle: item.bundle_id ? true:false,
            ...(item.bundle_id && {bundle_id: item.bundle_id,
                                   bundleItems: bundleIDToBundle(item.bundle_id)
            })
        }
    }))

    return parsed
}

module.exports = {parseCart, cartTotals}
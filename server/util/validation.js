const { bundleIDToBundle } = require("./id_gen")

const sanitizeCartQuantities = async(db, cart_id) => {
    const query = `DELETE from cart_items WHERE cart_id = ? AND quantity <= 0`
    await db.run(query, [cart_id])
}

const sanitizeQuantityInput = (input) => {
    if (input === '' || !isNaN(input) && Number.isInteger(parseFloat(input)) && parseInt(input) >= 0) {
        return input
    }

    return 1
}

const checkBundleQuantities = async (bundle_id, product_id, db) => {
    const product = await db.get('SELECT product_name FROM products WHERE product_id = ?', [product_id])
    const product_name = product.product_name
    
    const bundle = bundleIDToBundle(bundle_id)

    const count = bundle.reduce((sum, item) => sum + item.qty, 0)
    const check = product_name.includes('Half') ? 6:12

    return count === check
}

module.exports = {sanitizeCartQuantities, sanitizeQuantityInput, checkBundleQuantities}


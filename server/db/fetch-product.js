const sqlite3 = require('sqlite3').verbose()
const { open } = require('sqlite')
const { sanitizeCartQuantities, sanitizeQuantityInput } = require('../util/validation')

const dbInit = async () => {
    return await open({
        filename: './db/vvb.db',
        driver: sqlite3.Database,
    })
}

const productRowToObject = (row) => {
    return {
        product_id: row.product_id,
        product_name: row.product_name,
        product_type: row.product_type,
        product_description: row.product_description,
        product_price: (row.product_price/100),
        product_isBundle: row.product_isBundle ? true:false,
        product_img: row.product_img
        }
}

const getProductByID = async (db, id) => {
    const query = `SELECT
                    *
                   FROM products
                   WHERE product_id = ?`
    
    const row = await db.get(query, [id])

    return row
}

const getIDByName = async (db, name) => {
    const query = `SELECT
                    product_id
                    FROM products
                    WHERE product_name = ?`
    const product_id = await db.get(query, [name])
    return product_id
}

const getProductCategory = async(db, cat) => {
    const query = `SELECT
                    *
                   FROM products
                   WHERE product_type = ?`

    let products = []

    const rowsCount = await db.each(query, [cat], (err, row) => {
        if(err){
            console.log(err)
        }

        else {
            products.push(productRowToObject(row))
        }
    })

    return products
    
}

const getAllProducts = async (db) => {
    const query = `SELECT 
                    *
                   FROM products`

    let products = []

    const rowsCount = await db.each(query, (err, row) => {
        if(err){
            console.log(err)
        }

        else {
            products.push(productRowToObject(row))
        }
    })

    return products
}

const getProductPrice = async (db,id) => {
    const query = `SELECT
                       product_price
                   FROM products
                   WHERE product_id = ?`

    const row = await db.get(query, [id])
    return row.product_price/100
}

const getCart = async (db, cart_id) => {
    await sanitizeCartQuantities(db, cart_id)
    const query = `SELECT
                    *
                   FROM cart_items
                   WHERE cart_id = ?`

    const cart = await db.all(query, [cart_id])
    return cart
}

const productInCart = async(db, cart_id, product_id, bundle_id) => {
    const query = `SELECT
                    *
                   FROM cart_items
                   WHERE cart_id = ?
                   AND ${bundle_id ? `bundle_id` : `product_id`} = ?`

    const isInCart = await db.get(query, [cart_id, bundle_id ? bundle_id:product_id])
    console.log('isInCart: ', isInCart)
    return isInCart
    
}

const updateCartQuantity = async(db, cart_id, product_id, bundle_id, quantity) => {
    const query = `UPDATE
                    cart_items
                   SET quantity = quantity + ?
                   WHERE cart_id = ?
                   AND ${bundle_id ? `bundle_id` : `product_id`} = ?`

    await db.run(query, [quantity, cart_id, bundle_id ? bundle_id:product_id])

    if (await checkZeroQuantity(db, product_id, bundle_id)) {
        await removeItem(db, product_id, bundle_id)
    }
}

const setCartQuantity = async(db, cart_id, product_id, bundle_id, quantity) => {
    const query = `UPDATE
                    cart_items
                   SET quantity = ?
                   WHERE cart_id = ?
                   AND ${bundle_id ? `bundle_id` : `product_id`} = ?`

    const newQuantity = sanitizeQuantityInput(quantity)

    await db.run(query, [newQuantity, cart_id, bundle_id ? bundle_id:product_id])

    if (await checkZeroQuantity(db, cart_id, product_id, bundle_id)) {
        await removeItem(db, cart_id, product_id, bundle_id)
    }
}

const checkZeroQuantity = async(db, cart_id, product_id, bundle_id) => {
    const query = `SELECT quantity FROM cart_items WHERE cart_id = ? AND ${bundle_id ? `bundle_id` : `product_id`} = ?`;
    const result = await db.get(query, [cart_id, bundle_id ? bundle_id : product_id]);
    return (result && result.quantity <= 0)
}

const removeItem = async(db, cart_id, product_id, bundle_id) => {
    const query = `DELETE FROM cart_items WHERE cart_id = ? AND ${bundle_id ? `bundle_id` : `product_id`} = ?`;
    await db.run(query, [cart_id, bundle_id ? bundle_id : product_id]);
}

const addNewItemToCart = async(db, cart_id, product_id, bundle_id, quantity) => {
    const query = `INSERT INTO cart_items (cart_id, product_id, bundle_id, quantity)
    VALUES (?, ?, ?, ?)`

    await db.run(query, [cart_id, product_id, bundle_id ? bundle_id:null, quantity])
    console.log('db: added to cart')
}

const addNewOrder = async(db, cart_id, formData) => {
    const query = `INSERT INTO orders (cart_id, name, email, phone, addr)
                VALUES (?, ?, ?, ?, ?)`

    await db.run(query, [cart_id, 
                        formData.name,
                        formData.email,
                        formData.phone,
                        formData.address]
                )

    console.log('added NEW ORDER to db')
    
}

module.exports = {
    dbInit,
    getProductByID,
    getIDByName,
    getProductPrice,
    getProductCategory,
    getAllProducts,
    getCart,
    productInCart,
    updateCartQuantity,
    addNewItemToCart,
    setCartQuantity,
    removeItem
}


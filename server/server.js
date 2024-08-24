const express = require('express')
const cors = require('cors')
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session)
const stripe = require('stripe')('sk_test_51Pk7HwRxCXx34TCH6ZEgC3FiPRremzJPG39m7IMqnsh62fx2YNfEWNO3jtRPFTtFashvWXJVFygim6rqr2IOlltx00GlMMyyOP')
const sqlite = require('./db/fetch-product.js')
const { cartTotals, parseCart } = require('./util/cart_parse.js')
const { generateCartID, generateBundleID } = require('./util/id_gen.js')
const validate = require('./util/validation.js')
const mailer = require('./util/mailer.js')
require('dotenv').config()

const app = express()

const DOMAIN = process.env.ORIGIN_DOMAIN
const PORT = process.env.LISTEN_PORT


const corsOptions = {
    origin: DOMAIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
}
app.use(express.json())

app.use(session({
    store: new SQLiteStore({
        db: 'sessions.sqlite',
        dir: './db',
        table: 'sessions'
    }),
    secret: process.env.DB_SQLITE_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false,
            httpOnly:false
    }
}))

app.use((req, res, next) => {
    if(!req.session.cart_id){
        req.session.cart_id = generateCartID()
        console.log('generated session ID: ', req.session.cart_id)
    }
    else{

        console.log('current session: ', req.session.cart_id)
    }
    
    next()
})

app.use((req, res, next) => {
    console.log('request: ', req.method, req.url)
    next()
})


app.use(cors(corsOptions))
app.use(express.static('public'))


const orderFormData = {}

let db
(async () => {
    console.log('opening db')
    db = await sqlite.dbInit()
})()


app.post("/create-checkout-session" , async (req, res) => {
   try { 
    const items = req.body.items
    let lineItems = []

    items.forEach(item => {
        lineItems.push(
            {
                price: item.product_id,
                quantity: item.quantity
            }
        )
    })

    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: `${DOMAIN}/checkout-success`,
        cancel_url: `${DOMAIN}/checkout-cancel`,
        automatic_tax: {enabled: true}
    })

    const stripeID = session.id
    console.log('storing session ID: ', stripeID)
    orderFormData[stripeID] = req.body.formData

    res.json({ url: session.url, stripeID: stripeID })
    }

    catch(error) {
        console.log('Error with Stripe session: ', error)
        res.status(500).send({message: 
            'There was an error fetching the checkout session. Please try again.'
        })
    }

})

app.post("/mailer/order-confirmed", async (req, res) => {
    try {
        const orderData = orderFormData[req.body.sessionID]
                            
        const emailContent = mailer.formatNewOrderEmailVVB(orderData)
        console.log('emailcontent ', emailContent)

        mailer.sendMail(emailContent)

        console.log('sent order email')
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ error: 'Failed to reset session' });
            }
 
        })
            res.clearCookie('connect.sid');
    }  

    catch(error) {
        console.error('Error sending: ', error)
        res.status(500).json({message: 'couldnt send email'})
    }

})

app.post("/mailer/contact-form", (req, res) => {
    try {
        const {emailFrom, nameFrom, message} = req.body

        const emailTo = 'vinyl.vanilla.bakery@gmail.com'
        const subject = `[MESSAGE] New message from ${nameFrom}`
        const text = `New message from ${nameFrom}, at ${emailFrom}:\n` + message
        sendMail(emailTo, subject, text)
        res.status(200).json({message: 'order email sent'})
    }

    catch(error) {
        console.error('Error sending: ', error)
        res.status(500).json({message: 'couldnt send email'})
    }
})

app.get("/data/product/all", async (req, res) => {
    try {

        const products = await sqlite.getAllProducts(db)

        res.json(products)
    }

    catch(e) {
        console.log('error fetching product data: ', e)
    }
})

app.get("/data/product/store-data", async (req, res) => {
    try {

        const cookie = await sqlite.getProductCategory(db, 'Cookie')
        const bar = await sqlite.getProductCategory(db, 'Bar')
        const loaf = await sqlite.getProductCategory(db, 'Loaf')

        const products = {
            cookie: cookie,
            bar: bar,
            loaf: loaf
        }

        res.json(products)
    }

    catch(e) {
        console.log('error fetching product data: ', e)
    }
})

app.get("/data/product/item/:id", async (req, res) => {
    try {
        const id = req.params.id

        const product = await sqlite.getProductByID(db, id)

        res.json(product)
    }

    catch(e) {
        console.log('error fetching product data: ', e)
    }
})

app.get("/data/product/price/:id", async (req, res) => {
    try {
        
        const id = req.params.id

        const productPrice = await sqlite.getProductPrice(db, id)

        res.json(productPrice)
    }

    catch(e) {
        console.log('error fetching product data: ', e)
    }
})


app.post("/data/product/bundle-id", async(req, res) => {
    const bundle = req.body.bundle

    const bundleID = generateBundleID(bundle)
    res.json(bundleID)

})

app.post("/data/product/get-bundle", async(req, res) => {
    const {type, name, denom} = req.body
    const bundleType = type === 'Cookie' ? 

    denom === 'Half' ? 'Half-Dozen Cookies' : 'Dozen Cookies'
    :
    denom === 'Half' ? 'Half-Batch Bars' : 'Full Batch Bars'

    const bundle = [{name: name, qty: denom === 'Half' ? 6:12}]
    const bundle_id = generateBundleID(bundle)
    const productidrow = await sqlite.getIDByName(db, bundleType)
    const product_id = productidrow.product_id

    console.log('returning bundle stuff: ', product_id, bundle_id)
    res.json({product_id, bundle_id})
})

app.post("/api/cart/add-item", async (req, res) => {
    try {
        const { product_id, quantity, bundle_id } = req.body

        console.log(`updating cart ${req.session.cart_id} with id ${product_id} quantity ${quantity} bundleID ${bundle_id}`)
        const cart_id = req.session.cart_id

        if(bundle_id){
            const bundleValid = validate.checkBundleQuantities(bundle_id, product_id, db)

            if(!bundleValid) {
                return res.status(500).send('Invalid product entry!')
            }
        } 

        const isInCart = await sqlite.productInCart(db, cart_id, product_id, bundle_id)

        if (isInCart) {
            console.log('product in cart. updating quantity:', isInCart)
            await sqlite.updateCartQuantity(db, cart_id, product_id, bundle_id, quantity)
        }

        else {
            console.log('not in cart. adding new item')
            await sqlite.addNewItemToCart(db, cart_id, product_id, bundle_id, quantity)
        }

        const newCart = await sqlite.getCart(db, cart_id)
        const finalCart = await parseCart(db, newCart)
        console.log('finalCart: ', finalCart)
        res.json(finalCart)
    }

    catch(error) {
        console.log('error adding new item: ', error)
        res.status(500).json({error: 'server error'})
    }

})

app.get("/api/cart", async (req, res) => {
   try{ 
    const cart_id = req.session.cart_id

    const cart = await sqlite.getCart(db, cart_id)

    const cartParsed = await parseCart(db, cart)

    res.json(cartParsed)
    }

    catch (error) {
        console.log('Error fetching cart data:', error)
    }
})



app.post("/api/cart/update-quantity", async (req, res) => {
    try {
        const cart_id = req.session.cart_id
        
        const { product_id, bundle_id, quantity } = req.body

        await sqlite.updateCartQuantity(db, cart_id, product_id, bundle_id, quantity)

        const newCart = await sqlite.getCart(db, cart_id)
        const newCartParse = await parseCart(db, newCart)
        res.json(newCartParse)
    }

    catch (error) {
        console.log('Error updating cart quantity:', error)
    }

})

app.post("/api/cart/set-quantity", async (req, res) => {
    try {
        const cart_id = req.session.cart_id
        
        const { product_id, bundle_id, quantity } = req.body

        await sqlite.setCartQuantity(db, cart_id, product_id, bundle_id, quantity)

        const newCart = await sqlite.getCart(db, cart_id)
        const newCartParse = await parseCart(db, newCart)
        res.json(newCartParse)
    }

    catch (error) {
        console.log('Error setting cart quantity: ', error)
    }

})

app.post("/api/cart/remove", async (req, res) => {
    try {
        const cart_id = req.session.cart_id
        
        const { product_id, bundle_id } = req.body
        await sqlite.removeItem(db, cart_id, product_id, bundle_id)
        const newCart = await sqlite.getCart(db, cart_id)
        const newCartParse = await parseCart(db, newCart)
        res.json(newCartParse)
    }

    catch (error) {
        console.log('Error removing from cart:', error)
    }
})

app.get("/api/cart/totals", async (req, res) => {
    try {
        const cartItems = await sqlite.getCart(db, req.session.cart_id)
        const parsedCart = await parseCart(db, cartItems)
        
        const { sub, tax, delivery, total } = await cartTotals(db, parsedCart)
        console.log(sub, tax, delivery, total)

        res.json({subTotal: sub, tax: tax, delivery: delivery, total:total})
    }

    catch (error) {
        console.log('error fetching totals data: ', error)
    }
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
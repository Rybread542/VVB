import { useCart } from "../context/CartContext"
import "../styles/checkout.css"
import { useRef, useState } from "react"
import useLocalStorage from "../hooks/useLocalStorage"
import { Order_Total_Summary } from "../components/cart/order_total_summary"
import { Load_Spinner } from "../components/page/load_spinner"

export function Checkout() {

    const [ setorderID ] = useLocalStorage('stripe-session', '')
    const { cartQuery } = useCart()
    const [load, setLoad] = useState(false)
    const orderFName = useRef() 
    const orderLName = useRef() 
    const orderEmail = useRef() 
    const orderPhone = useRef() 
    const orderAddress = useRef() 
    const orderCity = useRef() 
    const orderZip = useRef()

    const checkout = async (event) => {
        event.preventDefault()
        setLoad(true)
        const cartItems = cartQuery.data

        const formData = {name: `${orderFName.current.value} ${orderLName.current.value}`,
                        email: orderEmail.current.value,
                        phone: orderPhone.current.value,
                        address: `${orderAddress.current.value}\n ${orderCity.current.value} ${orderZip.current.value}`,
                        cart: cartItems}



        console.log('fetching...')
        try{
            const res = await fetch('http://localhost:4000/create-checkout-session', {
                method: "POST",
                headers: {
                    'Content-Type' : 'application/json',},
                body: JSON.stringify({items: cartItems, formData: formData})
            })     

            const data = await res.json()
            console.log('session id: ' , data.stripeID)
            setorderID(data.stripeID)
            window.location.href = data.url
        }

        catch (e) {
            console.log('Error creating checkout session: ', e)
        }
    }

    if(!cartQuery.isLoading && cartQuery.data.length === 0) {
        return (
            <main className="checkout-main"> 
                <div className="wrap" style={{width: '100%', textAlign: 'center', marginTop: '3em'}}>
                    <h2>Your cart is empty!</h2>
                    <b><a href="/store">{"<"}- Store</a></b>
                </div>
            </main>
        )
    }

    return (
    
    <main className="checkout-main">
        <div className="checkout-form">
            <form onSubmit={checkout}>

                <fieldset className="form-customer-info">
                    <legend>Customer Information</legend>

                    <div className="form-customer-info-item fname">
                        <label htmlFor="first-name">First Name</label>
                        <input type="text" id="first-name" name="first-name" ref={orderFName} disabled={load} required />
                    </div>

                    <div className="form-customer-info-item lname">
                        <label htmlFor="last-name">Last name</label>
                        <input type="text" id="last-name" name="last-name" ref={orderLName} disabled={load} required />
                    </div>

                    <div className="form-customer-info-item email">
                        <label htmlFor="checkout-email">Email</label>
                        <input type="email" id="checkout-email" name="checkout-email" ref={orderEmail} disabled={load} required />
                    </div>

                    <div className="form-customer-info-item phone">
                        <label htmlFor="phone">Phone Number</label>
                        <input type="tel" name="phone" id="phone" ref={orderPhone} disabled={load} required />
                    </div>
                </fieldset>

                <fieldset className="form-delivery-info">
                    <legend>Delivery Information</legend>

                    <div className="form-delivery-info-item address">
                        <label htmlFor="address">Delivery Address</label>
                        <input type="text" name="address" id="address" ref={orderAddress} disabled={load} required />
                    </div>

                    <div className="form-delivery-info-item city">
                        <label htmlFor="city">City</label>
                        <input type="text" name="city" id="city" ref={orderCity} disabled={load} required/>
                    </div>

                    <div className="form-delivery-info-item zip">
                        <label htmlFor="zip">ZIP Code</label>
                        <input type="text" name="zip" id="zip" ref={orderZip} disabled={load} required />
                    </div>
                </fieldset>

                <fieldset className="form-order-summary">
                    <legend id="order-legend">Order Summary</legend>
                    
                    <Order_Total_Summary />
                    
                    <div className="submit-button-wrapper">
                        {!load ? 
                        <button className="submit-button" type="submit" disabled={load}>Check out with Stripe</button>
                        :
                        <Load_Spinner/>
                        }
                    </div>
                </fieldset>
                
            </form>
        </div>
    </main>

    )
}
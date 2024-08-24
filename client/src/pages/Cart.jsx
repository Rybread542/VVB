import { useCart } from "../context/CartContext"
import { CartItem } from "../components/cart/cart_item"
import "../styles/cart.css"
import { Order_Total_Summary } from "../components/cart/order_total_summary"
import { Load_Spinner } from "../components/page/load_spinner"

export function Cart() {

    const { cartQuery } = useCart()

    if(cartQuery.isLoading) {
        return (
            <main className="cart-main"> 
                <div className="cart-title">
                    <h2>Your Cart</h2>
                </div>
                <div className="load" style={{height: '60vh'}}>
                    <Load_Spinner /> 
                </div>
            </main>
        )
    }

    if(!cartQuery.isLoading && cartQuery.data.length === 0) {
        return (
            <main className="cart-main"> 
                <div className="cart-title">
                    <h2>Your Cart</h2>
                </div>
                <div className="wrap" style={{width: '100%', textAlign: 'center', marginTop: '3em'}}>
                    <h2>Your cart is empty!</h2>
                </div>
            </main>
        )
    }

    return (
        <main className="cart-main">
            <div className="cart-title">
                <h2>Your Cart</h2>
            </div>

            <div className="cart-main-content">
                    <div className="cart-item-summary">
                        {cartQuery.data.map(item => {
                                return <CartItem key={item.key} item={item}></CartItem>
                            })
                        }
                    </div>

                    <div className="cart-total-summary-container">

                        <Order_Total_Summary/>

                        <div className="checkout-button">
                            <a href="/checkout">
                                <button id="checkout">Proceed to Checkout</button>
                            </a>
                        </div>
                    </div>
            </div>

        </main>

    )
}
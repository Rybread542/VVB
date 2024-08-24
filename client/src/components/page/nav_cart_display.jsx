import { useCart } from "../../context/CartContext";
import { forwardRef } from "react";
import { currencyFormat } from "../../utilities/formatPrices";

const Nav_Cart_Display = forwardRef((props, ref) => {
    const { cartQuery, cartTotals } = useCart()
    return(
        <>
        <div ref={ref} className="top-bar-cart-container" onClick={e => e.stopPropagation()}>
            <div className="top-bar-cart-items">
                {cartQuery.data.map(item => (
                    <div key={item.key} className='top-bar-cart-item'>
                        <span className='top-bar-cart-item-name'>{item.name}</span>
                        <span className='top-bar-cart-item-quantity'>x{item.quantity}</span>
                    </div>
                ))}
            </div>
            <div className="top-bar-cart-button-container">
                {cartTotals.data.subTotal > 0 && (<p>Subtotal: {currencyFormat(cartTotals.data.subTotal)}</p>)}
                <a href="/cart">
                    <button className="top-bar-cart-button">Go to Cart</button>
                </a>

            </div>
        </div>
        
        </>
        )
    }
)

export { Nav_Cart_Display }
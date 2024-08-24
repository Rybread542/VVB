import { useCart } from "../../context/CartContext";
import { useEffect, useState } from "react";

export function Cart_Nav_Icon({ handleCartClick }) {
    const { cartQuery } = useCart()
    const [ cartQuantity, setCartQuantity ] = useState(0)
    
    // useEffect(() => {
    //     setCartQuantity(cartItems.length)
    // }, [cartItems])

    if(cartQuery.isLoading) {
        return ''
    }
    return (
        <div className="cart-icon-container">
            <i className="fa-solid fa-cart-shopping cart-icon" onClick={handleCartClick}>
            {cartQuery.data.length > 0 && (<p className="cart-quantity-badge">{cartQuery.data.length}</p>)}
            </i>
            
        </div>
    )
}
import '../../styles/nav.css'
import useOutsideClick from "../../hooks/useOutsideClick"
import { Nav_Cart_Display } from "./nav_cart_display"
import { Cart_Nav_Icon } from "./cart_nav_icon"
import { useLocation } from "react-router-dom"

export function Navbar() {
    
    const { ref: cartRef, isVisible: cartIsVisible, open: openCart, close: closeCart } = useOutsideClick()
    const location = useLocation()

    const isInStore = ['/store', '/cart', '/checkout'].includes(location.pathname)

    const handleCartClick = (e) => {
        e.stopPropagation()
        cartIsVisible ? closeCart() : openCart()
    }

    return( 
        <>
        <div className="component-top-bar">
            <div className="grid-empty"></div>
            <div className="logo-container">
                <a href="/"><img src="images/vvb-logo-t-2.png" className="logo-img" alt="logo"></img></a>
            </div>

            <div className="top-bar-links">
                <div className="links-container">
                    <a href="/menu" id="menu">Menu</a>
                    <a href="/about" id="about">About</a>
                    <a href="/contact" id="contact">Contact</a>
                    <a href="/store" id="order">Order Online</a>
                </div>
                {isInStore && (<Cart_Nav_Icon handleCartClick={handleCartClick} />
            )}
            </div>
        </div>
            
        {cartIsVisible && (
            <Nav_Cart_Display ref={cartRef}  />
        )}
        </>
    )
    
}
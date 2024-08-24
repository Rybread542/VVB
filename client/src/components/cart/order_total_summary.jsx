import { useCart } from "../../context/CartContext";
import { currencyFormat } from "../../utilities/formatPrices";

export function Order_Total_Summary() {
    const { cartTotals, cartQuery } = useCart()

    if(cartTotals.isLoading) {
        return <h2>Loading summary...</h2>
    }

    return(
        <div className="order-summary">
            <p className="order-summary-item subtotal">Subtotal <span className="summary-price">{currencyFormat(cartTotals.data.subTotal)}</span></p>
            <p className="order-summary-item delivery">Delivery <span className="summary-price">{currencyFormat(cartTotals.data.delivery)}</span></p>
            <p className="order-summary-item tax">Tax <span className="summary-price">{currencyFormat(cartTotals.data.tax)}</span></p>
            <p className="order-summary-item fees">Service fee <span className="summary-price">-</span></p>
            <hr className="summary-divider" />
            <p className="order-summary-item total">Total <span className="summary-price">{currencyFormat(cartTotals.data.total)}</span></p>
        </div>
    )
}
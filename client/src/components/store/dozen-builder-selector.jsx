import { Cart_Counter } from "../cart/cart_counter"
import { useState } from "react"
import { useEffect } from "react"

export function Dozen_Builder_Selector({ product, addItem, itemCount, max, maxReached}) {

    const [ count, setCount ] = useState(1)

    const handleAdd = () => {
        addItem(product.product_name, count)
        setCount(1)
    }

    useEffect(() => {
        if (itemCount + count > max) {
            setCount(max - itemCount >= 1 ? max - itemCount : 1)
        }
    }, [itemCount])

    return (
        <div className="selector-item">
            <div className="selector-title">
                <h3>{product.product_name}</h3>
            </div>
            <div className="selector-controls">
                <div>
                    <Cart_Counter count={count} 
                    setCount={setCount} 
                    max={(max-itemCount)} 
                    disabled={maxReached}/>
                </div>
                <button className={`store-item-modal-button ${!maxReached ? "builder-button": "builder-button-disabled"}`} 
                onClick={handleAdd}
                disabled={maxReached}>Add</button>
            </div>

        </div>
    )
}
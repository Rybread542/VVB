import { useCart } from "../../context/CartContext";
import { Dozen_Builder_Selector } from "./dozen-builder-selector";
import { useState } from "react";
import { Load_Spinner } from "../page/load_spinner";

export function Cookie_Dozen_Builder({ onClose, max, data }) {
    const [bundleItems, setBundleItems] = useState([])
    const [itemCount, setItemCount] = useState(0)
    const [ maxReached, setMaxReached ] = useState(false)
    const [load, setLoad] = useState(false)

    const { cartNewItemMutation } = useCart()

    const bundleProduct = max === 6 ? 
    "price_1PkB6QRxCXx34TCHwbUOQuwn"
    :
    "price_1PkB6qRxCXx34TCHPxMqCrap"


    const price = async () => {
        const data = await fetch(`http://localhost:4000/data/product/price/${bundleProduct}`, {
            method: 'GET',
            headers: {'Accept' : 'application/json'},
            credentials: 'include'
        })

        const product_price = await data.json()
        console.log(product_price)
        return product_price.product_price
    }

    
    function handleNewItem(name, qty) {
        setBundleItems(prevItems => {
            const isInBundle = prevItems.find(item => item.name === name)

            const newBundle = isInBundle ?
                prevItems.map(item => 
                    item.name === name ? {...item, qty: item.qty+qty}: item
                )
            : [...prevItems, { name, qty }]

            const newItemCount = newBundle.reduce((total, item) => total + item.qty, 0)

            setItemCount(newItemCount)
            setMaxReached(newItemCount === max)
            return newBundle
        })
    }

    const resetBundle = () => {
        setBundleItems([])
        setItemCount(0)
        setMaxReached(false)
    }

    const handleAddToCart = async () => {
        setLoad(true)
        const response = await fetch('http://localhost:4000/data/product/bundle-id', {
            method: 'POST',
            headers: {'Content-type':'application/json'},
            body: JSON.stringify({bundle: bundleItems})
        })

        const bundle_id = await response.json()

        cartNewItemMutation.mutate({product_id: bundleProduct, quantity: 1, bundle_id: bundle_id})

        onClose()
    }

    return (

        <div className="store-item-modal">
            <div className="dozen-builder">
                <div className="dozen-builder-title">
                    <h3>{max === 6 ? 'Build a Half-Dozen!' : 'Build a Dozen!'}</h3>
                </div>
                <div className="store-item-modal-close-button">
                    <button className="store-item-modal-close" onClick={onClose}>X</button>
                </div>
                <div className="dozen-builder-content">
                    <div className="selector-wrapper">
                        <div className="product-selector">
                            {data.map(item => {
                                if (item.product_id !== "price_1PkAw9RxCXx34TCHdXgNHhYK" && !item.product_isBundle) {
                                    return <Dozen_Builder_Selector key={item.product_id}
                                    product={item}
                                    addItem={handleNewItem}
                                    itemCount={itemCount}
                                    max={max}
                                    maxReached={maxReached}
                                    />
                                }
                                return null
                            })}
                        </div>
                    </div>
                    <div className="dozen-builder-cart-window">
                        <div className="dozen-builder-cart-items">
                            {bundleItems.map(item => (
                                <p key={item.name}>{item.name} x{item.qty}</p>
                            ))}
                        </div>
                        <div className="dozen-builder-cart-controls">
                            {!load ?
                            (<>
                            <button className="store-item-modal-button reset-bundle" onClick={resetBundle} disabled={load}>Reset</button>
                            <button className={`store-item-modal-button ${maxReached ? "add-bundle-button" : "add-bundle-button-disabled"}`}
                            onClick={handleAddToCart}
                            disabled={!maxReached || load}>Add to Cart</button>
                            </>)
                            :
                            <Load_Spinner/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
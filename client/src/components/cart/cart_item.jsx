import { useCart } from "../../context/CartContext"
import { useState, useEffect } from "react";
import { Load_Spinner } from "../page/load_spinner";

export function CartItem({ item }) {
    const { scrubQuantity, cartUpdateQuantityMutation, cartSetQuantityMutation, cartRemoveItemMutation, cartDataRefresh } = useCart()
    const [localQuantity, setLocalQuantity] = useState(item.quantity);
    const [load, setLoad] = useState(false)

    useEffect(() => {
        setLocalQuantity(item.quantity)
    }, [item.quantity])

    const handleLocalInputChange = (e) => {
        const value = e.target.value;
        if (value === '' || !isNaN(value) && Number.isInteger(parseFloat(value)) && parseInt(value) >= 0) {
            setLocalQuantity(value);
        }
    }

    const handleCartInputChange = async() => {
        try {
            setLoad(true)
            const finalQuantity = scrubQuantity(localQuantity)
            setLocalQuantity(finalQuantity)
            await cartSetQuantityMutation.mutateAsync({product_id: item.product_id, quantity: finalQuantity, bundle_id:item.bundle_id})
        }

        catch(error) {
            console.error('error setting quantity: ', error)
        }

        finally {
            await cartDataRefresh()
            setLoad(false)
        }
        
    }

    const handleCartIncrement = async(amt) => {
        try {
            setLoad(true)
            await cartUpdateQuantityMutation.mutateAsync({product_id: item.product_id, quantity: amt, bundle_id:item.bundle_id})
        }

        catch(error) {
            console.error('error incrementing item: ', error)
        }

        finally {
            await cartDataRefresh()
            setLoad(false)
        }

    }

    const handleRemove = async() => {
        try {
            setLoad(true)
            await cartRemoveItemMutation.mutateAsync({product_id: item.product_id, bundle_id:item.bundle_id})
        }

        catch(error) {
            console.error('error removing item: ', error)
        }

        finally {
            await cartDataRefresh()
            setLoad(false)
        }
        
    }

    return(
        
        <div className="cart-item">
            <i className="fa-solid fa-trash trash" onClick={handleRemove} disabled={load}/>
            <h3 className="cart-item-name">{item.name}</h3>
            {item.isBundle && 
            <div className="bundle-items">
                {item.bundleItems.map(item => (
                    <p key={item.name}>{item.name} x{item.qty}</p>
                ))}
            </div>}

            {
            !load ? (
            <div className="cart-item-controls">
                <button className="cart-item-quant-button" onClick={() => handleCartIncrement(-1)} disabled={load}>-</button><input className="cart-item-quant" id="cart-item-quant"
                value={localQuantity}
                onChange={handleLocalInputChange}
                onBlur={handleCartInputChange}
                onFocus={(e) => e.target.select()}
                disabled={load}/>
                <button className="cart-item-quant-button" onClick={() => handleCartIncrement(1)} disabled={load}>+</button>
            </div>)
            :
            <Load_Spinner wrapStyle={{justifyContent: 'flex-end',
                alignItems: 'flex-end',
                position: 'absolute',
                marginTop: 'auto',
                bottom: '0rem',
                right: '0.5rem'}}/>
            }
                
        </div>
    )
}
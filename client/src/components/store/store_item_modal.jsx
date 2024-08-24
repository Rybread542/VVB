import { useCart } from "../../context/CartContext"
import { useState, useRef} from "react"
import { Store_Item_Modal_Controls } from "./store-item-modal-controls";

export function Store_Item_Modal({onClose, item}) {

    const { cartNewItemMutation, cartDataRefresh } = useCart()
    const bundleIDStore = useRef(null)
    const [count, setCount] = useState(1)
    const [modalLoad, setmodalLoad] = useState(false)

    const handleDropDown = async (event) => {
        setmodalLoad(true)
        const value = event.target.value
        if (value !== 'Single'){
            const type = item.product_type
            const res = await fetch('http://localhost:4000/data/product/get-bundle', {
                method: 'POST',
                headers: {'Content-type' : 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    type: type,
                    name: item.product_name,
                    denom: value === 'Half' ? 'Half':'Full'
                })
            })
            const storeData = await res.json()
            bundleIDStore.current = storeData
        }

            else {
                bundleIDStore.current = null
            }

            console.log('storeID: ', bundleIDStore.current)
            setmodalLoad(false)
        }
        

    const handleAddToCart = async() => {
       try { 
        setmodalLoad(true)
        let id
        let bundle_id = null

        if(bundleIDStore.current) {
            id = bundleIDStore.current.product_id
            bundle_id = bundleIDStore.current.bundle_id
        }

        else{
            id = item.product_id
        }
        
        console.log(`adding new product with id: ${id} quantity: ${count} bundle_id: ${bundle_id}`)
        await cartNewItemMutation.mutateAsync({product_id: id, quantity: count, bundle_id: bundle_id})
        }

        catch(error) {
            console.error('Error adding item to cart: ', error)
        }

        finally{
            await cartDataRefresh()
            onClose()
            setmodalLoad(false)
        }
    }

    return(
        <div className="store-item-modal">
            <div className='store-item-modal-window'>

                <div className="store-item-modal-close-button">
                    <button className="store-item-modal-close" onClick={onClose} disabled={modalLoad}>X</button>
                </div>

                <div className="store-item-modal-content">
                    <div className="store-item-modal-title">
                        <h2>{item.product_name}</h2>
                    </div>
                    <Store_Item_Modal_Controls onClose={onClose} 
                    showDropDown={item.product_type === 'Loaf' ? false:true}
                    product_type={item.product_type}
                    handleAddToCart={handleAddToCart}
                    handleDropDown={(e) => handleDropDown(e)}
                    count={count}
                    setCount={setCount}
                    modalLoad={modalLoad}/>
                </div>
            </div>
        </div>
)}
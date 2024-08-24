import { Cart_Counter } from "../cart/cart_counter"
import { Load_Spinner } from "../page/load_spinner"

export function Store_Item_Modal_Controls({showDropDown, product_type, handleAddToCart, handleDropDown, count, setCount, modalLoad}) {
    
    const dropDownOptions = (type) => {
        switch(type) {
            case 'Bar':
                return ['Half-Batch', 'Full Batch']
            
            case 'Cookie':
                return ['Half-Dozen', 'Dozen']     
        }
    } 

    return (
        <div className="store-item-modal-controls">
            <div className="store-item-modal-dropdown">

                {showDropDown && 
                (<select name="store-item-modal-dropdown" id="store-item-modal-dropdown" onChange={(e) => handleDropDown(e)} disabled={modalLoad}>
                    <option value="Single">Single</option>
                    <option value="Half" >{dropDownOptions(product_type)[0]}</option>
                    <option value="Full">{dropDownOptions(product_type)[1]}</option>
                </select>)}

            </div>

            <div className="store-item-modal-counter-button">

                <div className="store-item-modal-counter">
                    {
                        <Cart_Counter count={count} setCount={setCount} disabled={modalLoad} />
                    }
                </div>

                {!modalLoad ?
                (<button className="store-item-modal-button" disabled={modalLoad} onClick={handleAddToCart}>Add to cart</button>)
                :
                <Load_Spinner/>}

            </div>
        </div>
    )
}
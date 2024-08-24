import { Store_Item } from "./store_item"

export function Store_Section({products, title, showModal}) {
    return (
     <div className="store-category-items">
                {products.map(item => !item.product_isBundle &&
                    (<Store_Item key={item.product_id} onClick={() => {showModal(item)}} item={item} />
                    )
                )}
    </div>   
    )
}
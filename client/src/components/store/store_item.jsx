export function Store_Item({item, onClick}) {

    return (
        <div className="store-item" onClick={onClick}>
            <div className="store-item-img">
                <img src={item.product_img} alt="" />
            </div>
            
            <div className="store-item-content">
                <div className="store-item-title">
                    <h4>{item.product_name}</h4>
                </div>

                <div className="store-item-price">
                    <p>{item.product_price}</p>
                </div>

                <div className="store-item-desc">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam!</p>
                </div>
            </div>
        </div>
    )
}
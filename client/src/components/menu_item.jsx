

export function Menu_Item({ product_name, product_desc }) {
    return (
        <div className="menu-item" id={product_name === 'Kitchen Sink Cookie' ? 'special-cookie' : undefined}>
            <div className="menu-item-title">
                <h4 className="menu-item-title-text">
                    {product_name}
                </h4>
            </div>
            <div className="menu-item-desc">
                <p className="menu-item-desc-text">
                    {product_desc}
                </p>
            </div>
        </div>
    )
}
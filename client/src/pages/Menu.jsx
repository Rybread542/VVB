import { useProductData } from "../context/ProductDataContext"
import { Menu_Item } from "../components/menu_item"
import '../styles/menu.css'
import { Load_Spinner } from "../components/page/load_spinner"


export function Menu() {
    const { storeDataQuery } = useProductData()
    
    const placeholderDesc = 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'

    if (storeDataQuery.isLoading) {
        return <main className="menu-main">

        <div className="menu" style={{height: '80vh'}}>
            <Load_Spinner />
        </div>

    </main>
    }

    if (storeDataQuery.isError) {
        return <main className="menu-main">

        <div className="menu" style={{height: '80vh'}}>
            <h2>Error loading the menu data. Please try again.</h2>
        </div>

    </main>
    }
    
    return (
        <main className="menu-main">
            <div className="menu-title">
                <h2>Menu</h2>
            </div>
            
            <div className="menu">
                <section className="menu-category">

                    <div className="category-title">
                        <h2>Cookies</h2>
                    </div>

                    <div className="category-aux-info">
                        <p>$2.99 each</p>
                        <p>9.99 half-dozen</p>
                        <p>16.99 dozen</p>
                        <p>Mix & Match!</p>
                    </div>

                    <div className="category-items">
                        <>
                            {storeDataQuery.data.cookie.map(item => (
                                <Menu_Item key={item.product_id}
                                product_desc={placeholderDesc} 
                                {...item}
                                 />
                            ))}
                        </>
                    </div>

                </section>

                <section className="menu-category">
                    
                    <div className="category-title">
                        <h2>Bars</h2>
                    </div>

                    <div className="category-aux-info">
                        <p>$2.99 each</p>
                        <p>$12.99 half-batch</p>
                        <p>$19.99 full batch</p>
                    </div>

                    <div className="category-items">
                        {storeDataQuery.data.bar.map(item => (
                            <Menu_Item key={item.product_id}
                            product_desc={placeholderDesc}
                            product_name={item.product_name} />
                        ))}
                    </div>

                </section>

                <section className="menu-category">
                    
                    <div className="category-title">
                        <h2>Sweet Loaves</h2>
                    </div>

                    <div className="category-aux-info">
                        <p>$12.99 each</p>
                    </div>

                    <div className="category-items">
                        {storeDataQuery.data.loaf.map(item => (
                            <Menu_Item key={item.product_id}
                            product_desc={placeholderDesc}
                            product_name={item.product_name} />
                        ))}
                    </div>

                </section>
            </div>

        </main>

    )
}

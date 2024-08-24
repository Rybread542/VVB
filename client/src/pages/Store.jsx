import { Store_Section } from "../components/store/store-section"
import "../styles/store.css"
import { Store_Item_Modal } from "../components/store/store_item_modal"
import { useEffect, useState } from "react"
import { Cookie_Dozen_Builder } from "../components/store/cookie-dozen-builder"
import { useProductData } from "../context/ProductDataContext"
import { Load_Spinner } from "../components/page/load_spinner"
import { Store_Nav } from "../components/store/store-nav"


export function Store() {
    

    const [modalContent, setModalContent] = useState(null)
    const [ itemModalVisible, setItemModalVisible ] = useState(false)

    const [ builderModalVisible, setBuilderModalVisible ] = useState(false)
    const [bundleMax, setBundleMax] = useState(12)
    
    const { storeDataQuery } = useProductData()

       useEffect(() => {
        console.log(storeDataQuery.data)
    },[])

    const showModal = (newModalContent) => {
        setItemModalVisible(true)
        setModalContent(newModalContent)
    }

    const closeModal = () => {
        setModalContent(null)
        setItemModalVisible(false)
    }

    const closeBuilder = () => {
        setBuilderModalVisible(false)
    }

    const showBuilder = () => {
        setBuilderModalVisible(true)
    }

    if(storeDataQuery.isLoading) {
    return (
        <main className="store-main">
            <div className="store" style={{height: '90vh', display:'block'}}>
                <Load_Spinner/>
            </div>   
        </main>)
    }

 

    return (
        <>
        {itemModalVisible && (
            <Store_Item_Modal onClose={closeModal} item={modalContent}/>
        )}

        {builderModalVisible && (
            <Cookie_Dozen_Builder onClose={closeBuilder} max={bundleMax} data={storeDataQuery.data.cookie}/>
        )}

        <main className="store-main">
            <div className="store">
                <Store_Nav />

            <div className="store-products">
                <section className="store-category">
                    <div className="store-category-title">
                        <h3 id="cookies">Cookies</h3>
                    </div>

                    <div className="cookie-builder-display">
                        <h4 style={{textAlign: 'center'}}>Build your own bundle!</h4>
                        <div className="cookie-builder-buttons">
                                <button className="builder-open-button" onClick={() => {
                                    setBundleMax(6)
                                    showBuilder()
                                }}>Half-Dozen Cookies {storeDataQuery.data.cookie.find(item => item.product_name === 'Half-Dozen Cookies').product_price}</button>
                                <button className="builder-open-button" onClick={() => {
                                    setBundleMax(12)
                                    showBuilder()
                                }}>Dozen Cookies {storeDataQuery.data.cookie.find(item => item.product_name === 'Dozen Cookies').product_price}</button>
                        </div>
                    </div>
                                
                    <Store_Section products={storeDataQuery.data.cookie} showModal={showModal}/>

                </section>

                        
                <section className="store-category">
                    <div className="store-category-title">
                        <h3 id="bars">Bars</h3>
                    </div>
                    <Store_Section products={storeDataQuery.data.bar} showModal={showModal}/>
                </section>
                
                <section className="store-category">
                    <div className="store-category-title">
                        <h3 id="loaves">Loaves</h3>
                    </div>
                    <Store_Section products={storeDataQuery.data.loaf} showModal={showModal}/>
                </section>

            </div>
        </div> 
    </main>
    
    </>
    )
}
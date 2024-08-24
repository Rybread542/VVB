import { createContext, useContext } from "react"
import { useQuery } from "@tanstack/react-query";

const ProductDataContext = createContext()

export function useProductData() {
    return useContext(ProductDataContext)
}

export function DataProvider({ children }) {

    const getStoreData = async() => {
        try {
            const productData = await fetch(`http://localhost:4000/data/product/store-data`, {
            method: 'GET',
            headers: {
                'Accept' : 'application/json'
            },
            credentials: 'include',
            })
    
            const productArray = await productData.json()
            return productArray
        }

        catch (error) {
            console.log('Error fetching product data: ', error)
        }
    }
    
    const storeDataQuery = useQuery({
        queryKey: ['store-data'],
        queryFn: getStoreData
    })

    return(
        <ProductDataContext.Provider value={{
            storeDataQuery
            }}>

            {children}
        </ProductDataContext.Provider>
    )
}
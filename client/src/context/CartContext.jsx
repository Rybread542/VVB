import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CartContext = createContext()

export function useCart() {
    return useContext(CartContext)
}

export function CartProvider({ children }) {

    const queryClient = useQueryClient()

    const getCart = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/cart', {
                method: 'GET',
                credentials: 'include'
            })

            const cart = await res.json()
            console.log('got the cart! ' , cart)
            return cart
        }

        catch(error) {
            console.log('error getting cart. ', error)
        }
    }
    
    const calculateTotals = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/cart/totals', {
                method: 'GET',
                headers: {'Accept' : 'application/json'},
                credentials: 'include',
            })
            
            const newTotals = await res.json()
            return newTotals
        }

        catch (error) {
            console.log('error fetching price totals: ', error)
        }
    }

    async function addNewProduct({product_id, quantity, bundle_id}) {
        console.log('fetching add new product...')
        const response = await fetch("http://localhost:4000/api/cart/add-item", {
            method: 'POST',
            headers: {'Content-type' : 'application/json',},
            credentials: 'include',
            body: JSON.stringify({product_id: product_id,
                                  quantity: quantity,
                                  bundle_id: bundle_id
            })
        
        })

        if(!response.ok) {
            throw new Error('HTTP error. ', response.status)
        }

        const newCart = await response.json()
        console.log('new cart: ', newCart)
        return newCart
    }

    async function updateQuantity({product_id, quantity, bundle_id=null}) {
        const response = await fetch("http://localhost:4000/api/cart/update-quantity", {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({product_id: product_id, bundle_id:bundle_id, quantity: quantity})
        })

        const newCart = await response.json()
        return newCart
    }

    async function setQuantity({product_id, quantity, bundle_id=null}) {

        const response = await fetch("http://localhost:4000/api/cart/set-quantity", {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({product_id: product_id, bundle_id:bundle_id, quantity: quantity})
        })

        const newCart = await response.json()
        return newCart
    }

    async function removeFromCart({product_id, bundle_id=null}) {

        const response = await fetch("http://localhost:4000/api/cart/remove", {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({product_id: product_id, bundle_id:bundle_id})
        })

        const newCart = await response.json()
        return newCart
    }

    function scrubQuantity(amt) {
        return Math.max(1, Math.min(99, amt))
    }

    const cartDataRefresh = async() => {
        await queryClient.invalidateQueries(["cart", "totals"])
    }

    const cartQuery = useQuery({
        queryKey: ["cart"],
        queryFn: getCart
    })

    const cartTotals = useQuery({
        queryKey: ["totals"],
        queryFn: calculateTotals
    })

    const cartNewItemMutation = useMutation({
        mutationFn: addNewProduct, 
        onSuccess: cartDataRefresh
    })

    const cartUpdateQuantityMutation = useMutation({
        mutationFn: updateQuantity,
        onSuccess: cartDataRefresh
    })

    const cartSetQuantityMutation = useMutation({
        mutationFn: setQuantity,
        onSuccess: cartDataRefresh
    })

    const cartRemoveItemMutation = useMutation({
        mutationFn: removeFromCart,
        onSuccess: cartDataRefresh
    })

    return(
        <CartContext.Provider value={{
            cartQuery,
            cartTotals,
            scrubQuantity,
            cartDataRefresh,
            cartNewItemMutation,
            cartRemoveItemMutation,
            cartSetQuantityMutation,
            cartUpdateQuantityMutation}}>

            {children}
        </CartContext.Provider>
    )
}


import { useState, useEffect } from "react";

const useLocalStorage = (key, defaultValue) => {
    const [value, setValue] = useState(() =>{
        let currentValue;

        const jsonVal = localStorage.getItem(key)

        if (jsonVal) return JSON.parse(jsonVal)

        else{
           currentValue = defaultValue 
        }

        return currentValue
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    return [value, setValue]
}



export default useLocalStorage;
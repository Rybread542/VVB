import { useState, useRef, useEffect } from 'react'



const useOutsideClick = () => {

    const[isVisible, setIsVisible] = useState(false)
    const ref = useRef(null);

    const open = () => {
        setIsVisible(true)
        console.log('clicked to open')
    }

    const close = () => {
        setIsVisible(false)
        console.log('clicked to close')
    }

    const handleOutsideClick = (event) => {
        if(ref.current && !ref.current.contains(event.target)) {
            close()
        }
    }

    useEffect(() => {
        if (isVisible) {
            document.addEventListener('click', handleOutsideClick)
        }
        else {
            document.removeEventListener('click', handleOutsideClick)
        }
        return () => {
            document.removeEventListener('click', handleOutsideClick)
        }
    }, [isVisible])

    return { ref, isVisible, open, close }
}

export default useOutsideClick;
export function Cart_Counter({ count, setCount, max=99, disabled }) {

    const increment = () => {
        count == max ? setCount(max) : setCount(prevCount => prevCount + 1)
    }

    const decrement = () => {
        count == 1 ? setCount(1) : setCount(prevCount => prevCount - 1)
    }

    const handleUserInput = (e) => {
        let val = parseInt(e.target.value, 10)

        if (isNaN(val)) {
            setCount(0)
        }
        else {
            val = Math.max(1, Math.min(val, max))
            setCount(val)
        }
    }

    return(
        <>
        <button className="counter-button" onClick={decrement} disabled={disabled}>
            -
        </button>
        <input type="text" className='item-count' 
        onFocus={(e) => e.target.select()} 
        onClick={(e) => e.target.select()} 
        value={count} 
        onChange={handleUserInput}
        disabled={disabled} />
        <button className="counter-button" onClick={increment} disabled={disabled}>
            +
        </button>
        </>
    )
}
import { useEffect,  } from "react"
import { Navigate, useNavigate } from "react-router-dom"

export function CheckoutSuccess() {
    const nav = useNavigate()
    const sessionID = JSON.parse(localStorage.getItem('stripe-session'))
    useEffect(() => {
        async function send(){
            try {
                if(!sessionID){
                    nav('/404')
                }
                const res = await fetch("http://localhost:4000/mailer/order-confirmed", {
                    method: 'POST',
                    headers: {'Content-Type' : 'application/json'},
                    credentials: "include",
                    body: JSON.stringify({sessionID: sessionID},)
                })
            
                console.log(res.message)
            
            }

            catch (error) {
                console.log('Error sending email. It was probably already sent.', error)
            }
        }

        send()
        localStorage.removeItem('stripe-session')
        setTimeout(() => {
            nav('/')
        }, 4000);
    }, [])

    return (
        <main className="checkout-success-main">
           {(sessionID && <h1>Order Received! Thank you! You will receive an order confirmation and a followup from us.</h1>)}
        </main>
    )

}
import '../styles/contact.css'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'


export function Contact() {
    const [submitted, setSubmitted] = useState(false)
    const name = useRef()
    const email = useRef()
    const message = useRef()
    const nav = useNavigate()

    const sendMessage = async(event) => {
       event.preventDefault()
       try {
            setSubmitted(true)
            const res = await fetch('http://localhost:4000/mailer/contact-form', {
                method: 'POST',
                headers: {'Content-type':'application/json'},
                credentials: 'include',
                body: JSON.stringify({emailFrom: email.current.value, nameFrom: name.current.value, message:message.current.value})
            })

            const response = await res.json()
            setTimeout(() => {
                nav('/')
            }, 3000)
        }
        catch(error) {
            console.log('error sending contact form message: ', error)
        }
    }

    return (
        <main className="contact-main">
            <div className="contact-content">
                <div className="contact-header">
                    <div className="contact-title">
                        <h2>Lorem, ipsum!</h2>
                    </div>
                    <div className="contact-desc">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis voluptates odit nemo possimus.</p>
                    </div>
                </div>
                <div className="contact-form-wrapper">
                    <form className='contact-form' onSubmit={sendMessage} >
                            <label htmlFor="name">Name</label>
                            <input type="text" name='name' id='name' ref={name} disabled={submitted} required/>
                            <label htmlFor="email">Email</label>
                            <input type="email" name='email' id='email' ref={email} disabled={submitted} required/>
                            <label htmlFor="message">Message</label>
                            <textarea id='message' name='message' rows='6' cols='50' ref={message} disabled={submitted} required/>
                            <input id="submit" type="submit" value='Submit' disabled={submitted} />
                    </form>
                    {submitted && (<h3>Thank you for your message!</h3>)}
                </div>
            </div>
        </main>
    )
}
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "vinyl.vanilla.bakery@gmail.com",
      pass: process.env.MAILER_PW,
    },
  });

function sendMail(emailContent) {
    const mailOptions = {
        from: 'vinyl.vanilla.bakery@gmail.com',
        to: emailContent.emailTo,
        subject: emailContent.subject,
        text: emailContent.message,
        html: emailContent.message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.error(`Couldnt send the email to ${emailContent.emailTo}: `, error)
        }

        else {
            console.log('Email sent: ', info.response)
        }
    })
}

function formatNewOrderEmailVVB (orderData) {
    const emailTo = 'vinyl.vanilla.bakery@gmail.com'
    
    const subject = `[NEW ORDER] ${orderData.name}`
    const order = formatOrderItemsVVB(orderData.cart)
    const html = `
    <h2>NEW VVB ORDER</h2>
    <p><b>Name: </b>${orderData.name}</p>
    <p><b>Email: </b>${orderData.email}</p>
    <p><b>Phone: </b>${orderData.phone}</p>
    <p><b>Address: </b>${orderData.address}</p>
    <p><b>Order:</b></p>
    <ul>${order}</ul>`

    return {emailTo:emailTo, subject:subject, message:html}
}

function formatOrderItemsVVB(cartItems) {
    let orderString = ``

    cartItems.forEach(item => {
        let orderItem = `<li>${item.name} x${item.quantity}</li> `
        if (item.isBundle) {
            item.bundleItems.forEach(bundleItem => {
                let bundleListItem = `<li style= \"padding-left:20px\">
                                        ${bundleItem.name} x${bundleItem.qty}</li>`
                orderItem += bundleListItem
            })
        }
        orderString += orderItem
    })

    return orderString
}

module.exports = { sendMail, formatNewOrderEmailVVB }
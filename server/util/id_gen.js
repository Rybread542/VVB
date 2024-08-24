
function generateCartID(length=12) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
    let id = 'vv-'
    for(let i = 0; i<length; i++) {
        const idx = Math.floor(Math.random() * charset.length)
        id += charset.charAt(idx)
    }
    return id
}

function generateBundleID(bundle) {
    let bundleID = ''
    let name = bundle.map(i => `${i.name.split(' ').join('_')}#${i.qty}`).sort().join('&')
    return bundleID+name
}

function bundleIDToBundle(id) {
    return id.split('&').map(item => {
        const [name, qty] = item.split('#')
        return {
            name: name.split('_').join(' '),
            qty: parseInt(qty, 10)
        }
    })
}

module.exports = {generateCartID, generateBundleID, bundleIDToBundle}

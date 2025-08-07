// auth.js
import { jwtDecode } from 'jwt-decode'
// JWT DELIVERS
// email
// exp - Expiration date
// given_name
// iat - date
// id
// nbf - date
// role
export const getUserId = () => {
    const token = sessionStorage.getItem('token')
    var item = 0
    if (token) {
        const decoded = jwtDecode(token)
        item = decoded.id
    }
    return item
}
export const getUserName = () => {
    const token = sessionStorage.getItem('token')
    var item = ""
    if (token) {
        const decoded = jwtDecode(token)
        item = decoded.given_name
    }
    return item
}
export const getUserRole = () => {
    const token = sessionStorage.getItem('token')
    var item = ""
    if (token) {
        const decoded = jwtDecode(token)
        item = decoded.role
    }
    return item
}
import { Navigate } from "react-router-dom"
import { getUserRole, getUserId } from "./auth.js"

const ValidateRoles = ({ children, allowedRoles }) => {
    const userId = getUserId()
    const userRole = getUserRole()

    return (userId > 0 && allowedRoles.includes(userRole)) ? children : <Navigate to="/login" />
}

export default ValidateRoles
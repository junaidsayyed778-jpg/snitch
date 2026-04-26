import { useSelector } from "react-redux"
import { Navigate } from "react-router"

const ProtectedRoute = ({ children, role = "buyer" }) => {
    const { user, loading } = useSelector(state => state.auth)

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#131313]">
                <div className="w-8 h-8 border-2 border-[#ffd700] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (role && user.role !== role) {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute
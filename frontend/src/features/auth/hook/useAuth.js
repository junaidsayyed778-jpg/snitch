import { useDispatch } from "react-redux"
import { register, login, getMe, logout } from "../service/authApi"
import { setLoading, setUser, setError } from "../state/authSlice"
import { setCartUserId, clearCartState } from "../../products/state/cartSlice"

export const useAuth = () => {
    const dispatch = useDispatch()

    async function handleRegister({ email, contact, password, fullname, isSeller = false }) {
        dispatch(setError(null))
        try {

            const data = await register({ email, contact, password, fullname, isSeller })
            dispatch(setUser(data.user))
            dispatch(setCartUserId(data.user.id))
            return data.user

        } catch (err) {
            const message = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Something went wrong during registration"
            dispatch(setError(message))
            console.log(err)
        }
    }

    async function handleLogin({ email, password }) {
        dispatch(setError(null))
        try {
            const data = await login({ email, password })

            dispatch(setUser(data.user))
            dispatch(setCartUserId(data.user.id))

            return data.user
        } catch (err) {
            const message = err.response?.data?.message || "Invalid email or password"
            dispatch(setError(message))
            console.log(err)
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
            dispatch(setCartUserId(data.user.id))
        } catch (err) {
            // Only log if it's not a 401 (which is normal on first load if not logged in)
            if (err.response?.status !== 401) {
                console.log(err)
            }
            dispatch(setUser(null))
            dispatch(clearCartState())
        } finally {
            dispatch(setLoading(false))

        }
    }

    async function handleLogout() {
        try {
            await logout()
            dispatch(setUser(null))
            dispatch(clearCartState())
        } catch (err) {
            console.error("Logout error:", err)
        }
    }

    return { handleRegister, handleLogin, handleGetMe, handleLogout }
}
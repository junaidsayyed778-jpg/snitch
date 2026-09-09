import { RouterProvider } from 'react-router'
import './App.css'
import { routes } from './AppRoutes.jsx'
import { useSelector } from 'react-redux'
import { useAuth } from '../features/auth/hook/useAuth.js'
import { useEffect } from 'react'
import { connectSocket, disconnectSocket } from '../socket'

function App() {
  const { handleGetMe } = useAuth()
  const user = useSelector(state => state.auth.user)

  useEffect(() => {
    handleGetMe()
  }, [])

  useEffect(() => {
    if (user) {
      connectSocket()
    } else {
      disconnectSocket()
    }
  }, [user])

  return (
    <RouterProvider router={routes} />
  )
}

export default App

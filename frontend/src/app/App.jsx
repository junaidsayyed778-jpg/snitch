import { RouterProvider } from 'react-router'
import './App.css'
import { routes } from './AppRoutes.jsx'
import { useSelector } from 'react-redux'
import { useAuth } from '../features/auth/hook/useAuth.js'
import { useEffect } from 'react'

function App() {
  const { handleGetMe } = useAuth()

  useEffect(() => {
    handleGetMe()
  }, [])
  
  const user = useSelector(state=> state.auth.user)
  console.log(user)
  return (
    <RouterProvider router={routes} />
  )
}

export default App

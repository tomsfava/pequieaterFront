import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { selectIsAuthenticated } from '../../store/reducers/auth'
import type { FC, ReactNode } from 'react'

interface ProtectedRouteProps {
    children?: ReactNode
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated)

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute

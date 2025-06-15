import { useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectUserId } from '../store/reducers/auth'
import { useGetMeQuery } from '../services/api'

const LoggedLayout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const loggedInUserId = useSelector(selectUserId)

    const {
        data: currentUser,
        isLoading: isLoadingCurrentUser,
        isError: isErrorCurrentUser,
        error: currentUserError,
    } = useGetMeQuery()

    useEffect(() => {
        if (isErrorCurrentUser && currentUserError) {
            if (
                'status' in currentUserError &&
                (currentUserError.status === 401 || currentUserError.status === 403)
            ) {
                console.error('Sessão expirada ou inválida. Redirecionando para o login.')
                dispatch(logout())
                navigate('/login')
            } else {
                console.error('Erro ao carregar dados do usuário logado:', currentUserError)
            }
        }
    }, [isErrorCurrentUser, currentUserError, dispatch, navigate])

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    const isAtFeed = location.pathname === '/feed'
    const isAtMyProfile = loggedInUserId
        ? location.pathname === `/profile/${loggedInUserId}`
        : false

    return (
        <div>
            <header>
                <h1>PequiEater</h1>
                <nav>
                    <ul>
                        <li>
                            <Link to="/feed">Feed</Link>
                        </li>
                        {loggedInUserId && (
                            <li>
                                <Link to={`/profile/${loggedInUserId}`}>Meu Perfil</Link>
                            </li>
                        )}
                        {currentUser && !isLoadingCurrentUser && (
                            <li>
                                Olá, <span>{currentUser.username}</span>!
                            </li>
                        )}
                        <li>
                            <button onClick={handleLogout}>Sair</button>
                        </li>
                    </ul>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default LoggedLayout

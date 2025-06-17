import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectUserId } from '../../store/reducers/auth'
import { useGetUserByIdQuery } from '../../services/api'
import { Header, Nav, TitleSub } from './styles'
import { Button, StyledLink } from '../../styles'
import logoutpng from '../../assets/logout_16dp_FF0000_FILL0_wght400_GRAD0_opsz20.svg'

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
    } = useGetUserByIdQuery(loggedInUserId!, { skip: !loggedInUserId })

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
            <Header>
                <TitleSub>
                    <h1>PequiEater</h1>
                    <p>Lugar de roer</p>
                </TitleSub>
                <Nav>
                    <ul>
                        {currentUser && !isLoadingCurrentUser && (
                            <li>
                                Olá, <span>{currentUser.username}</span>!
                            </li>
                        )}
                        {!isAtFeed && (
                            <li>
                                <StyledLink to="/feed">Roeções</StyledLink>
                            </li>
                        )}
                        {!isAtMyProfile && loggedInUserId && (
                            <li>
                                <StyledLink to={`/profile/${loggedInUserId}`}>
                                    Meu Perfil
                                </StyledLink>
                            </li>
                        )}

                        <li>
                            <Button size="small" variant="danger" onClick={handleLogout}>
                                <img src={logoutpng} alt="logout" />
                            </Button>
                        </li>
                    </ul>
                </Nav>
            </Header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default LoggedLayout

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useLoginMutation } from '../../services/api'
import { setCredentials, selectIsAuthenticated } from '../../store/reducers/auth'
import type { ApiError } from '../../types/api'
import { Button, StyledLink } from '../../styles'
import { FormLogin, Field, FormFooter } from './styles'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [login, { data, isLoading, isSuccess, isError, error }] = useLoginMutation()

    const dispatch = useDispatch()
    const isAuthenticated = useSelector(selectIsAuthenticated)

    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/feed')
            return
        }

        if (isSuccess && data) {
            dispatch(
                setCredentials({
                    token: data.token,
                    userId: data.user_id,
                    username: data.username,
                })
            )
            navigate('/feed')
        }

        if (isError && error) {
            console.error('Erro ao fazer login:', error)

            if ('data' in error) {
                const apiError = error.data as ApiError
                alert(
                    `Falha no login: ${apiError?.detail || apiError?.non_field_errors?.[0] || 'Erro desconhecido.'}`
                )
            } else {
                let errorMessage = 'Erro desconhecido.'
                if (typeof error === 'object' && error !== null) {
                    if ('message' in error && typeof error.message === 'string') {
                        errorMessage = error.message
                    } else if ('error' in error && typeof error.error === 'string') {
                        errorMessage = error.error
                    }
                }
                alert(`Falha no login: ${errorMessage}`)
            }
        }
    }, [isAuthenticated, isSuccess, data, isError, error, dispatch, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await login({ username, password }).unwrap()
        } catch (err) {
            console.error('Erro de requisição:', err)
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <FormLogin onSubmit={handleSubmit}>
                <Field>
                    <label htmlFor="username">Usuário:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Field>
                <Field>
                    <label htmlFor="password">Senha:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Field>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Entrando...' : 'Login'}
                </Button>
                {isError && <p>Erro ao fazer login. Verifique suas credenciais</p>}
            </FormLogin>
            <FormFooter>
                Não tem uma conta? <StyledLink to="/register">Cadastre-se</StyledLink>
            </FormFooter>
        </div>
    )
}

export default Login

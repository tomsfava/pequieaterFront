import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useRegisterMutation } from '../../services/api'
import type { ApiError } from '../../types/api'
import { Button, StyledLink } from '../../styles'
import { FormRegister, Field, FormFooter } from './styles'

const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [bio, setBio] = useState('')

    const [register, { data, isLoading, isSuccess, isError, error }] = useRegisterMutation()

    const navigate = useNavigate()

    useEffect(() => {
        if (isSuccess && data) {
            alert('Cadastro realizado com sucesso! Faça login para continuar.')
            navigate('/')
        }

        if (isError && error) {
            console.error('Erro ao registrar:', error)

            let errorMessage = 'Ocorreu um erro desconhecido durante o cadastro.'

            if ('data' in error) {
                const apiError = error.data as ApiError
                const fieldErrors: string[] = []

                if (apiError.username) fieldErrors.push(`Usuário: ${apiError.username.join(', ')}`)
                if (apiError.email) fieldErrors.push(`Email: ${apiError.email.join(', ')}`)
                if (apiError.password) fieldErrors.push(`Senha: ${apiError.password.join(', ')}`)
                if (apiError.password2)
                    fieldErrors.push(`Confirmação de Senha: ${apiError.password2.join(', ')}`)
                if (apiError.bio) fieldErrors.push(`Bio: ${apiError.bio.join(', ')}`)
                if (apiError.non_field_errors)
                    fieldErrors.push(`Erro geral: ${apiError.non_field_errors.join(', ')}`)
                if (apiError.detail) fieldErrors.push(`Detalhes: ${apiError.detail}`)

                errorMessage = fieldErrors.length > 0 ? fieldErrors.join('\n') : errorMessage
            } else if (typeof error === 'object' && error !== null) {
                if ('message' in error && typeof error.message === 'string') {
                    errorMessage = error.message
                } else if ('error' in error && typeof error.error === 'string') {
                    errorMessage = error.error
                }
            }
            alert(`Falha no cadastro:\n${errorMessage}`)
        }
    }, [isSuccess, data, isError, error, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== password2) {
            alert('As senhas não coincidem!')
            return
        }

        try {
            await register({ username, email, password, password2, bio }).unwrap()
        } catch (err) {
            console.error('Erro na requisição de registro:', err)
        }
    }

    return (
        <div>
            <h2>Cadastro</h2>
            <FormRegister onSubmit={handleSubmit}>
                <Field>
                    <label htmlFor="register-username">Usuário:</label>
                    <input
                        type="text"
                        id="register-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Field>
                <Field>
                    <label htmlFor="register-email">Email:</label>
                    <input
                        type="email"
                        id="register-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Field>
                <Field>
                    <label htmlFor="register-password">Senha:</label>
                    <input
                        type="password"
                        id="register-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Field>
                <Field>
                    <label htmlFor="register-password2">Confirme a senha:</label>
                    <input
                        type="password"
                        id="register-password2"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                    />
                </Field>
                <Field>
                    <label htmlFor="register-bio">Bio (Opcional):</label>
                    <textarea
                        id="register-bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                    />
                </Field>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
            </FormRegister>
            <FormFooter>
                Já tem uma conta? <StyledLink to="/">Fazer Login</StyledLink>
            </FormFooter>
        </div>
    )
}

export default Register

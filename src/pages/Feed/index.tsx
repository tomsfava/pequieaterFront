import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
    useGetPostsQuery,
    useCreatePostMutation,
    useDeletePostMutation,
    useGetMeQuery,
} from '../../services/api'
import { logout, selectUserId } from '../../store/reducers/auth'
import type { ApiError } from '../../types/api'

const Feed = () => {
    const {
        data: posts,
        isLoading: isLoadingPosts,
        isError: isErrorPosts,
        error: postsError,
    } = useGetPostsQuery()
    const {
        data: currentUser,
        isLoading: isLoadingMe,
        isError: isErrorMe,
        error: meError,
    } = useGetMeQuery()
    const [createPost, { isLoading: isCreatingPost, isError: isCreateError, error: createError }] =
        useCreatePostMutation()
    const [deletePost, { isLoading: isDeletingPost, isError: isDeleteError, error: deleteError }] =
        useDeletePostMutation()

    const loggedInUserId = useSelector(selectUserId)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [newPostContent, setNewPostContent] = useState('')

    useEffect(() => {
        if (isErrorPosts && postsError) {
            console.error('Erro ao carregar posts:', postsError)
            if ('data' in postsError) {
                const apiError = postsError.data as ApiError
                alert(
                    `Erro ao carregar posts: ${apiError?.detail || apiError?.non_field_errors?.[0] || 'Erro desconhecido da API.'}`
                )
            } else {
                alert(
                    `Erro ao carregar posts: ${(postsError as any).message || (postsError as any).error || 'Erro desconhecido.'}`
                )
            }
        }

        if (isErrorMe && meError) {
            console.error('Erro ao carregar dados do usuário logado:', meError)
            if ('status' in meError && (meError.status === 401 || meError.status === 403)) {
                alert('Sua sessão expirou ou é inválida. Faça login novamente')
                dispatch(logout())
                navigate('/')
            } else if ('data' in meError) {
                const apiError = meError.data as ApiError
                alert(
                    `Erro ao carregar seu perfil: ${apiError?.detail || apiError?.non_field_errors?.[0] || 'Erro desconhecido da API.'}`
                )
            } else {
                alert(
                    `Erro ao carregar seu perfil: ${(meError as any).message || (meError as any).error || 'Erro desconhecido.'}`
                )
            }
        }

        if (isCreateError && createError) {
            console.error('Erro ao criar postagem:', createError)
            if ('data' in createError) {
                const apiError = createError.data as ApiError
                alert(
                    `Falha ao criar postagem: ${apiError?.detail || apiError?.non_field_errors?.[0] || apiError?.content?.[0] || 'Erro desconhecido da API.'}`
                )
            } else {
                alert(
                    `Falha ao criar postagem: ${(createError as any).message || (createError as any).error || 'Erro desconhecido.'}`
                )
            }
        }

        if (isDeleteError && deleteError) {
            console.error('Erro ao deletar postagem:', deleteError)
            if ('data' in deleteError) {
                const apiError = deleteError.data as ApiError
                alert(
                    `Falha ao deletar postagem: ${apiError?.detail || apiError?.non_field_errors?.[0] || 'Erro desconhecido da API.'}`
                )
            } else {
                alert(
                    `Falha ao deletar postagem: ${(deleteError as any).message || (deleteError as any).error || 'Erro desconhecido.'}`
                )
            }
        }
    }, [
        isErrorPosts,
        postsError,
        isErrorMe,
        meError,
        isCreateError,
        createError,
        isDeleteError,
        deleteError,
        dispatch,
        navigate,
    ])
}

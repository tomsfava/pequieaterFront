import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
    useGetPostsQuery,
    useCreatePostMutation,
    useDeletePostMutation,
    useGetUserByIdQuery,
} from '../../services/api'
import { logout, selectUserId } from '../../store/reducers/auth'
import type { ApiError } from '../../types/api'

const Feed = () => {
    const [feedType, setFeedType] = useState<'all' | 'following'>('all')

    const {
        data: posts,
        isLoading: isLoadingPosts,
        isError: isErrorPosts,
        error: postsError,
        refetch: refetchPosts,
    } = useGetPostsQuery({ filter: feedType === 'following' ? 'following' : undefined })

    const loggedInUserId = useSelector(selectUserId)
    const {
        data: currentUser,
        isLoading: isLoadingMe,
        isError: isErrorMe,
        error: meError,
    } = useGetUserByIdQuery(loggedInUserId!, { skip: !loggedInUserId })

    const [createPost, { isLoading: isCreatingPost, isError: isCreateError, error: createError }] =
        useCreatePostMutation()
    const [deletePost, { isLoading: isDeletingPost, isError: isDeleteError, error: deleteError }] =
        useDeletePostMutation()

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

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newPostContent.trim()) {
            alert('A postagem não pode estar vazia.')
            return
        }
        try {
            await createPost({ content: newPostContent }).unwrap()
            setNewPostContent('')
        } catch (err) {
            console.error('Erro de requisição ao criar postagem:', err)
        }
    }

    const handleDeletePost = async (postId: number) => {
        if (!window.confirm('Tem certeza que deseja deletar esta postagem?')) {
            return
        }
        try {
            await deletePost(postId).unwrap()
        } catch (err) {
            console.error('Erro de requisição ao deletar postagem:', err)
        }
    }

    if (isLoadingMe || isLoadingPosts) {
        return <div>Carregando Feed...</div>
    }

    return (
        <div>
            <form onSubmit={handleCreatePost}>
                <h3>Comece a roer:</h3>
                <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Cuidado com o espinho... mas solta o dente!"
                    rows={4}
                    disabled={isCreatingPost}
                />
                <button type="submit" disabled={isCreatingPost}>
                    {isCreatingPost ? 'Publicando...' : 'Publicar'}
                </button>
            </form>

            <hr />

            <div>
                <h2>Roeções</h2>
                <hr />

                <div>
                    <button onClick={() => setFeedType('all')} disabled={feedType === 'all'}>
                        Todas as roeções
                    </button>
                    <button
                        onClick={() => setFeedType('following')}
                        disabled={feedType === 'following'}
                    >
                        Apenas quem eu sigo
                    </button>
                </div>

                <hr />
                {posts && posts.length > 0 ? (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}
                        >
                            <p>{post.content}</p>
                            <div>
                                <Link to={`/profile/${post.author.id}`}>
                                    @{post.author.username}
                                </Link>
                                <span> - {new Date(post.created_at).toLocaleString()}</span>
                                {loggedInUserId === post.author.id && (
                                    <button
                                        onClick={() => handleDeletePost(post.id)}
                                        disabled={isDeletingPost}
                                    >
                                        {isDeletingPost ? 'Deletando...' : 'Deletar'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : // Alteração na mensagem condicional
                feedType === 'following' ? (
                    <p>Ninguém que você segue roeu ainda.</p>
                ) : (
                    <p>Nenhuma roeção na area, que tal criar uma?</p>
                )}
            </div>
        </div>
    )
}

export default Feed

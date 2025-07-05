import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
    useGetPostsQuery,
    useCreatePostMutation,
    useDeletePostMutation,
    useGetUserByIdQuery,
    useToggleLikeMutation,
    useCreateCommentMutation,
} from '../../services/api'
import { logout, selectUserId } from '../../store/reducers/auth'
import type { ApiError } from '../../types/api'
import CommentSection from '../../components/CommentSection'
import CommentCountLink from '../../components/CommentCountLink'
import { FormPost, Post, PostImage } from './styles'
import { Button, StyledLink } from '../../styles'
import deletepng from '../../assets/delete_16dp_FF0000_FILL0_wght400_GRAD0_opsz20.svg'

const Feed = () => {
    const [feedType, setFeedType] = useState<'all' | 'following'>('all')
    const [newComment, setNewComment] = useState<{ [postId: number]: string }>({})
    const [showComments, setShowComments] = useState<{ [postId: number]: boolean }>({})

    const {
        data: posts,
        isLoading: isLoadingPosts,
        isError: isErrorPosts,
        error: postsError,
    } = useGetPostsQuery({ filter: feedType === 'following' ? 'following' : undefined })

    const loggedInUserId = useSelector(selectUserId)
    const {
        data: _currentUser,
        isLoading: isLoadingMe,
        isError: isErrorMe,
        error: meError,
    } = useGetUserByIdQuery(loggedInUserId!, { skip: !loggedInUserId })

    const [createPost, { isLoading: isCreatingPost, isError: isCreateError, error: createError }] =
        useCreatePostMutation()
    const [deletePost, { isLoading: isDeletingPost, isError: isDeleteError, error: deleteError }] =
        useDeletePostMutation()
    const [toggleLike] = useToggleLikeMutation()
    const [createComment] = useCreateCommentMutation()

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
        <div className="padding6">
            <FormPost onSubmit={handleCreatePost}>
                <h3>Comece a roer:</h3>
                <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Cuidado com o espinho... mas solta o dente!"
                    rows={4}
                    cols={40}
                    disabled={isCreatingPost}
                />
                <Button type="submit" disabled={isCreatingPost}>
                    {isCreatingPost ? 'Publicando...' : 'Publicar'}
                </Button>
            </FormPost>

            <hr />

            <div>
                <h2>Roeções</h2>
                <hr />

                <div>
                    <Button onClick={() => setFeedType('all')} disabled={feedType === 'all'}>
                        Todas as roeções
                    </Button>
                    <Button
                        onClick={() => setFeedType('following')}
                        disabled={feedType === 'following'}
                    >
                        Apenas quem eu sigo
                    </Button>
                </div>

                <hr />
                {posts && posts.length > 0 ? (
                    posts.map((post) => (
                        <Post key={post.id}>
                            <p>{post.content}</p>
                            {post.image_url && (
                                <div>
                                    <PostImage src={post.image_url} alt="Imagem da postagem" />
                                </div>
                            )}
                            <div>
                                <StyledLink to={`/profile/${post.author.id}`}>
                                    @{post.author.username}
                                </StyledLink>
                                <span> - {new Date(post.created_at).toLocaleString()}</span>
                                <Button
                                    onClick={() => toggleLike(post.id)}
                                    size="small"
                                    style={{ marginLeft: '10px' }}
                                >
                                    {post.liked_by_user ? '💚' : '🤍'} {post.likes_count}
                                </Button>

                                <CommentCountLink
                                    postId={post.id}
                                    showComments={showComments[post.id]}
                                    toggle={() =>
                                        setShowComments((prev) => ({
                                            ...prev,
                                            [post.id]: !prev[post.id],
                                        }))
                                    }
                                />

                                {loggedInUserId === post.author.id && (
                                    <Button
                                        variant="danger"
                                        size="small"
                                        onClick={() => handleDeletePost(post.id)}
                                        disabled={isDeletingPost}
                                    >
                                        {isDeletingPost ? (
                                            'Deletando...'
                                        ) : (
                                            <img src={deletepng} alt="delete" />
                                        )}
                                    </Button>
                                )}
                            </div>
                            {showComments[post.id] && (
                                <div style={{ marginTop: '10px' }}>
                                    <CommentSection postId={post.id} />
                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault()
                                            const content = newComment[post.id]
                                            if (!content?.trim()) return
                                            try {
                                                await createComment({
                                                    postId: post.id,
                                                    content,
                                                }).unwrap()
                                                setNewComment((prev) => ({
                                                    ...prev,
                                                    [post.id]: '',
                                                }))
                                            } catch (err) {
                                                console.error('Erro ao comentar:', err)
                                            }
                                        }}
                                    >
                                        <textarea
                                            value={newComment[post.id] || ''}
                                            onChange={(e) =>
                                                setNewComment((prev) => ({
                                                    ...prev,
                                                    [post.id]: e.target.value,
                                                }))
                                            }
                                            placeholder="Deixe um comentário..."
                                            rows={2}
                                            cols={40}
                                        />
                                        <Button type="submit">Comentar</Button>
                                    </form>
                                </div>
                            )}
                        </Post>
                    ))
                ) : feedType === 'following' ? (
                    <p>Ninguém que você segue roeu ainda.</p>
                ) : (
                    <p>Nenhuma roeção na area, que tal criar uma?</p>
                )}
            </div>
        </div>
    )
}

export default Feed

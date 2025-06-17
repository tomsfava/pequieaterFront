import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
    useGetUserByIdQuery,
    useToggleFollowMutation,
    useUpdateUserProfileMutation,
    useGetPostsQuery,
    useDeletePostMutation,
    useDeleteUserMutation,
} from '../../services/api'
import { logout, selectUserId } from '../../store/reducers/auth'
import type { ApiError, SimpleUser } from '../../types/api'
import { ProfileLayout, MainColumn, ProfileAside, Post, SaveCancel } from './styles'
import { Button, StyledLink } from '../../styles'
import deletepng from '../../assets/delete_16dp_FF0000_FILL0_wght400_GRAD0_opsz20.svg'
import cancelpng from '../../assets/cancel_16dp_FF0000_FILL0_wght400_GRAD0_opsz20.svg'

const Profile = () => {
    const { userId } = useParams<{ userId: string }>()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const loggedInUserId = useSelector(selectUserId)

    const parsedUserId = userId ? parseInt(userId, 10) : undefined

    const {
        data: userProfile,
        isLoading,
        isError: isErrorProfile,
        error: profileError,
        refetch: refetchUserProfile,
    } = useGetUserByIdQuery(parsedUserId!, { skip: !parsedUserId })

    const {
        data: currentUserData,
        isLoading: isLoadingCurrentUser,
        isError: isErrorCurrentUser,
        error: currentUserError,
        refetch: refetchCurrentUser,
    } = useGetUserByIdQuery(loggedInUserId!, { skip: !loggedInUserId })

    const {
        data: userPosts,
        isLoading: isLoadingUserPosts,
        isError: isErrorUserPosts,
        error: userPostsError,
        refetch: refetchUserPosts,
    } = useGetPostsQuery({ authorId: parsedUserId }, { skip: !parsedUserId })

    const [toggleFollow, { isLoading: isTogglingFollow }] = useToggleFollowMutation()
    const [updateUserProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation()
    const [deletePost, { isLoading: isDeletingPost, isError: isDeleteError, error: deleteError }] =
        useDeletePostMutation()
    const [
        deleteUser,
        { isLoading: isDeletingUser, isError: isDeleteUserError, error: deleteUserError },
    ] = useDeleteUserMutation()
    const isMyProfile = loggedInUserId === parsedUserId

    const [isEditingBio, setIsEditingBio] = useState(false)
    const [editedBio, setEditedBio] = useState('')

    const [isEditingEmail, setIsEditingEmail] = useState(false)
    const [editedEmail, setEditedEmail] = useState('')

    const [showFollowers, setShowFollowers] = useState(true)
    const [showUserPosts, setShowUserPosts] = useState(false)

    useEffect(() => {
        if (userProfile && userProfile.bio) {
            setEditedBio(userProfile.bio)
        } else if (userProfile && !userProfile.bio) {
            setEditedBio('')
        }
        if (userProfile && userProfile.email) {
            setEditedEmail(userProfile.email)
        } else if (userProfile && !userProfile.email) {
            setEditedEmail('')
        }
    }, [userProfile])

    useEffect(() => {
        if (isErrorCurrentUser && currentUserError) {
            console.error('Erro ao carregar dados do usuário logado no Profile:', currentUserError)
            if (
                'status' in currentUserError &&
                (currentUserError.status === 401 || currentUserError.status === 403)
            ) {
                alert('Sua sessão expirou ou é inválida. Faça login novamente.')
                dispatch(logout())
                navigate('/login')
            } else if ('data' in currentUserError) {
                const apiError = currentUserError.data as ApiError
                alert(
                    `Erro ao carregar seu perfil: ${apiError?.detail || 'Erro desconhecido da API.'}`
                )
            } else {
                alert(
                    `Erro ao carregar seu perfil: ${(currentUserError as any).message || 'Erro desconhecido.'}`
                )
            }
        }
        if (isErrorProfile && profileError) {
            console.error('Erro ao carregar perfil:', profileError)
            if ('data' in profileError) {
                const apiError = profileError.data as ApiError
                alert(`Erro ao carregar perfil: ${apiError?.detail || 'Erro desconhecido da API.'}`)
            } else {
                alert(
                    `Erro ao carregar perfil: ${(profileError as any).message || 'Erro desconhecido.'}`
                )
            }
        }
        if (isErrorUserPosts && userPostsError) {
            console.error('Erro ao carregar postagens do usuário:', userPostsError)
            if ('data' in userPostsError) {
                const apiError = userPostsError.data as ApiError
                alert(
                    `Erro ao carregar postagens: ${apiError?.detail || 'Erro desconhecido da API.'}`
                )
            } else {
                alert(
                    `Erro ao carregar postagens: ${(userPostsError as any).message || 'Erro desconhecido.'}`
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

        if (isDeleteUserError && deleteUserError) {
            console.error('Erro ao deletar usuário:', deleteUserError)
            if ('data' in deleteUserError) {
                const apiError = deleteUserError.data as ApiError
                alert(
                    `Falha ao deletar usuário: ${apiError?.detail || apiError?.non_field_errors?.[0] || 'Erro desconhecido da API'}`
                )
            } else {
                alert(
                    `Falha ao deletar usuário: ${(deleteUserError as any).message || (deleteUserError as any).error || 'Erro desconhecido'}`
                )
            }
        }
    }, [
        isErrorCurrentUser,
        currentUserError,
        isErrorProfile,
        profileError,
        isErrorUserPosts,
        userPostsError,
        isDeleteError,
        deleteError,
        isDeleteUserError,
        deleteUserError,
        dispatch,
        navigate,
    ])

    if (isLoading || isLoadingCurrentUser || isLoadingUserPosts) {
        return <div>Carregando Perfil...</div>
    }

    if (!userProfile) {
        return <div>Perfil não encontrado.</div>
    }

    const handleToggleFollow = async () => {
        if (!parsedUserId) return
        try {
            await toggleFollow(parsedUserId).unwrap()
            refetchUserProfile()
            refetchCurrentUser()
        } catch (err) {
            console.error('Erro ao seguir/deixar de seguir:', err)
        }
    }

    const handleSaveBio = async () => {
        if (!parsedUserId) return
        try {
            await updateUserProfile({ id: parsedUserId, data: { bio: editedBio } }).unwrap()
            setIsEditingBio(false)
            refetchUserProfile()
            alert('Bio atualizada com sucesso!')
        } catch (err) {
            console.error('Erro ao atualizar a bio:', err)
            const apiError = err as { data?: ApiError; message?: string; error?: string }
            alert(
                `Falha ao atualizar a bio: ${apiError.data?.detail || apiError.data?.bio?.[0] || apiError.message || apiError.error || 'Erro desconhecido.'}`
            )
        }
    }

    const handleCancelEditBio = () => {
        setIsEditingBio(false)
        setEditedBio(userProfile.bio || '')
    }

    const handleSaveEmail = async () => {
        if (!parsedUserId) return
        try {
            await updateUserProfile({ id: parsedUserId, data: { email: editedEmail } }).unwrap()
            setIsEditingEmail(false)
            refetchUserProfile()
            alert('Email atualizado com sucesso!')
        } catch (err) {
            console.error('Erro ao atualizar o email:', err)
            const apiError = err as { data?: ApiError; message?: string; error?: string }
            alert(
                `Falha ao atualizar o email: ${apiError.data?.detail || apiError.data?.email?.[0] || apiError.message || apiError.error || 'Erro desconhecido.'}`
            )
        }
    }

    const handleCancelEditEmail = () => {
        setIsEditingEmail(false)
        setEditedEmail(userProfile.email || '')
    }

    const handleDeletePost = async (postId: number) => {
        if (!window.confirm('Tem certeza que deseja deletar esta postagem?')) {
            return
        }
        try {
            await deletePost(postId).unwrap()
            refetchUserPosts()
        } catch (err) {
            console.error('Erro de requisição ao deletar postagem:', err)
        }
    }

    const handleDeleteUser = async () => {
        if (!parsedUserId) return
        if (!window.confirm('Tem certeza de que deseja excluir sua conta?')) {
            return
        }

        try {
            await deleteUser(parsedUserId).unwrap()
            alert('Conta excluída com sucesso')
            dispatch(logout())
            navigate('/')
        } catch (err) {
            console.error('Erro ao deletar usuário:', err)
        }
    }

    const usersToList = showFollowers ? userProfile.followers : userProfile.following

    return (
        <ProfileLayout className="padding6">
            <MainColumn>
                <h2>
                    {isMyProfile ? (
                        <>
                            Meu Perfil{' '}
                            <Button
                                variant="danger"
                                size="small"
                                onClick={handleDeleteUser}
                                disabled={isDeletingUser}
                            >
                                {isDeletingUser ? (
                                    'Deletando'
                                ) : (
                                    <img src={deletepng} alt="deletar conta" />
                                )}
                            </Button>
                        </>
                    ) : (
                        `Perfil de @${userProfile.username}`
                    )}
                    {!isMyProfile && (
                        <Button onClick={handleToggleFollow} disabled={isTogglingFollow}>
                            {isTogglingFollow
                                ? '...'
                                : userProfile.is_following
                                  ? 'Deixar de Seguir'
                                  : 'Seguir'}
                        </Button>
                    )}
                </h2>
                <p>
                    <strong>Usuário:</strong>@{userProfile.username}
                </p>
                {isMyProfile ? (
                    <p>
                        <strong>Email:</strong>{' '}
                        {isEditingEmail ? (
                            <>
                                <input
                                    type="email"
                                    value={editedEmail}
                                    onChange={(e) => setEditedEmail(e.target.value)}
                                    disabled={isUpdatingProfile}
                                />
                                <SaveCancel>
                                    <Button onClick={handleSaveEmail} disabled={isUpdatingProfile}>
                                        {isUpdatingProfile ? 'Salvando...' : 'Salvar'}
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="danger"
                                        onClick={handleCancelEditEmail}
                                        disabled={isUpdatingProfile}
                                    >
                                        <img src={cancelpng} alt="cancelar" />
                                    </Button>
                                </SaveCancel>
                            </>
                        ) : (
                            <>
                                {userProfile.email || 'Adicione seu email aqui.'}{' '}
                                <Button onClick={() => setIsEditingEmail(true)}>
                                    Editar Email
                                </Button>
                            </>
                        )}
                    </p>
                ) : (
                    userProfile.email && (
                        <p>
                            <strong>Email:</strong> {userProfile.email}
                        </p>
                    )
                )}

                <div>
                    <strong>Bio:</strong>{' '}
                    {isMyProfile ? (
                        isEditingBio ? (
                            <>
                                <textarea
                                    value={editedBio}
                                    onChange={(e) => setEditedBio(e.target.value)}
                                    rows={4}
                                    cols={40}
                                    disabled={isUpdatingProfile}
                                />
                                <SaveCancel>
                                    <Button onClick={handleSaveBio} disabled={isUpdatingProfile}>
                                        {isUpdatingProfile ? 'Salvando...' : 'Salvar'}
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="danger"
                                        onClick={handleCancelEditBio}
                                        disabled={isUpdatingProfile}
                                    >
                                        <img src={cancelpng} alt="cancelar" />
                                    </Button>
                                </SaveCancel>
                            </>
                        ) : (
                            <>
                                <p>{userProfile.bio || 'Adicione sua bio aqui.'}</p>
                                <Button onClick={() => setIsEditingBio(true)}>Editar Bio</Button>
                            </>
                        )
                    ) : (
                        <p>{userProfile.bio || 'Este usuário não possui uma bio.'}</p>
                    )}
                </div>
                <p>
                    <strong>Seguidores:</strong> {userProfile.followers_count}
                </p>
                <p>
                    <strong>Seguindo:</strong> {userProfile.following_count}
                </p>
                <h3>Postagens de @{userProfile.username}</h3>
                <Button onClick={() => setShowUserPosts(!showUserPosts)}>
                    {showUserPosts ? 'Ocultar Postagens' : 'Mostrar Postagens'}
                </Button>
                {showUserPosts && (
                    <div>
                        {userPosts && userPosts.length > 0 ? (
                            userPosts.map((post) => (
                                <Post key={post.id}>
                                    <p>{post.content}</p>
                                    <div>
                                        <span>
                                            Publicado em:{' '}
                                            {new Date(post.created_at).toLocaleString()}
                                        </span>
                                        {isMyProfile && (
                                            <Button
                                                variant="danger"
                                                size="small"
                                                onClick={() => handleDeletePost(post.id)}
                                                disabled={isDeletingPost}
                                            >
                                                {isDeletingPost ? (
                                                    'Deletando...'
                                                ) : (
                                                    <img src={deletepng} alt="deletar" />
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </Post>
                            ))
                        ) : (
                            <p>Nenhuma postagem encontrada para este usuário.</p>
                        )}
                    </div>
                )}
            </MainColumn>
            <ProfileAside>
                <h3>Conexões</h3>
                <div>
                    <Button onClick={() => setShowFollowers(true)} disabled={showFollowers}>
                        Seguidores ({userProfile.followers_count})
                    </Button>
                    <Button onClick={() => setShowFollowers(false)} disabled={!showFollowers}>
                        Seguindo ({userProfile.following_count})
                    </Button>
                </div>
                <div>
                    <h4>{showFollowers ? 'Lista de Seguidores:' : 'Lista de Seguindo:'}</h4>
                    {usersToList && usersToList.length > 0 ? (
                        <ul>
                            {usersToList.map((user: SimpleUser) => (
                                <li key={user.id}>
                                    <StyledLink to={`/profile/${user.id}`}>
                                        @{user.username}
                                    </StyledLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nenhum {showFollowers ? 'seguidor' : 'usuário seguido'} para mostrar.</p>
                    )}
                </div>
            </ProfileAside>
        </ProfileLayout>
    )
}

export default Profile

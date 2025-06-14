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

    useEffect(() => {}, [
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

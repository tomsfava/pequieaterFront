import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { AuthResponse, UserPublic, Post, Comment } from '../types/api'
import type { RootState } from '../store'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token
            if (token) {
                headers.set('Authorization', `Token ${token}`)
            }
            return headers
        },
    }),
    tagTypes: ['User', 'Post'],
    endpoints: (builder) => ({
        register: builder.mutation<
            AuthResponse,
            {
                username: string
                email: string
                password: string
                password2: string
                bio: string
                avatar_url?: string
            }
        >({
            query: (credentials) => ({
                url: '/register/',
                method: 'POST',
                body: credentials,
            }),
        }),

        login: builder.mutation<AuthResponse, { username: string; password: string }>({
            query: (credentials) => ({
                url: '/login/',
                method: 'POST',
                body: credentials,
            }),
        }),

        getUserById: builder.query<UserPublic, string | number>({
            query: (id) => `/user/${id}/`,
            providesTags: (_result, _error, id) => [{ type: 'User', id }],
        }),

        getPosts: builder.query<Post[], { authorId?: string | number; filter?: 'following' }>({
            query: (params) => {
                const queryParams = new URLSearchParams()
                if (params.authorId) {
                    queryParams.append('author', String(params.authorId))
                }
                if (params.filter) {
                    queryParams.append('filter', params.filter)
                }
                return `/posts/?${queryParams.toString()}`
            },
            providesTags: ['Post'],
        }),

        createPost: builder.mutation<Post, { content: string; image_url?: string }>({
            query: (newPost) => ({
                url: '/posts/',
                method: 'POST',
                body: newPost,
            }),
            invalidatesTags: ['Post'],
        }),

        deletePost: builder.mutation<void, number>({
            query: (postId) => ({
                url: `/posts/${postId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Post'],
        }),

        toggleFollow: builder.mutation<UserPublic, number>({
            query: (userIdToFollow) => ({
                url: `/user/${userIdToFollow}/toggle-follow/`,
                method: 'POST',
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'User', id },
                { type: 'User', id: 'me' },
            ],
        }),

        updateUserProfile: builder.mutation<
            UserPublic,
            { id: string | number; data: Partial<UserPublic> }
        >({
            query: ({ id, data }) => ({
                url: `/user/${id}/`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }],
        }),
        changePassword: builder.mutation<void, { current_password: string; new_password: string }>({
            query: (data) => ({
                url: '/user/change-password/',
                method: 'POST',
                body: data,
            }),
        }),

        deleteUser: builder.mutation<void, number>({
            query: (id) => ({
                url: `user/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),

        toggleLike: builder.mutation<Post, number>({
            query: (postId) => ({
                url: `/posts/${postId}/like/`,
                method: 'POST',
            }),
            invalidatesTags: ['Post'],
        }),

        getComments: builder.query<Comment[], number>({
            query: (postId) => `posts/${postId}/comments/`,
            providesTags: (_result, _error, postId) => [{ type: 'Post', id: postId }],
        }),

        createComment: builder.mutation<Comment, { postId: number; content: string }>({
            query: ({ postId, content }) => ({
                url: `/posts/${postId}/comments/`,
                method: 'POST',
                body: { content },
            }),
            invalidatesTags: (_result, _error, { postId }) => [{ type: 'Post', id: postId }],
        }),
        deleteComment: builder.mutation<void, number>({
            query: (commentId) => ({
                url: `/posts/comments/${commentId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Post'],
        }),
    }),
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useGetUserByIdQuery,
    useGetPostsQuery,
    useCreatePostMutation,
    useDeletePostMutation,
    useToggleFollowMutation,
    useUpdateUserProfileMutation,
    useChangePasswordMutation,
    useDeleteUserMutation,
    useToggleLikeMutation,
    useGetCommentsQuery,
    useCreateCommentMutation,
    useDeleteCommentMutation,
} = api

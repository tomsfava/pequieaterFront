import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
    isAuthenticated: boolean
    token: string | null
    userId: number | null
    username: string | null
}

const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    userId: null,
    username: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ token: string; userId: number; username: string }>
        ) => {
            const { token, userId, username } = action.payload
            state.isAuthenticated = true
            state.token = token
            state.userId = userId
            state.username = username
        },
        logout: (state) => {
            state.isAuthenticated = false
            state.token = null
            state.userId = null
            state.username = null
        },
    },
})

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer

export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectUserId = (state: { auth: AuthState }) => state.auth.userId
export const selectUsername = (state: { auth: AuthState }) => state.auth.username

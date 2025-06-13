import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
    isAuthenticated: boolean
    token: string | null
    userId: number | null
    username: string | null
}

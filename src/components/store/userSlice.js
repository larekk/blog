import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Тема: Логин пользователя
export const loginUser = createAsyncThunk('user/loginUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch('https://blog-platform.kata.academy/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const result = await response.json()

    if (response.ok) {
      return result.user.token
    }

    return rejectWithValue(result.errors || { general: 'Login failed' })
  } catch (error) {
    return rejectWithValue({ general: 'Network error. Try again later.' })
  }
})

export const registerUser = createAsyncThunk('user/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch('https://blog-platform.kata.academy/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const result = await response.json()

    if (response.ok) {
      return
    }

    return rejectWithValue(result.errors)
  } catch (error) {
    return rejectWithValue({ general: 'Network error. Try again later.' })
  }
})

export const fetchUser = createAsyncThunk('user/fetchUser', async (token, { rejectWithValue }) => {
  try {
    const response = await fetch('https://blog-platform.kata.academy/api/user', {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
    })

    const result = await response.json()

    if (response.ok) {
      return result.user
    }

    return rejectWithValue(result.errors)
  } catch (error) {
    return rejectWithValue({ general: 'Network error. Try again later.' })
  }
})

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await fetch('https://blog-platform.kata.academy/api/user', {
        method: 'PUT',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        return result.user
      }

      return rejectWithValue(result.errors)
    } catch (error) {
      return rejectWithValue({ general: 'Network error. Try again later.' })
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    isLoggedIn: !!localStorage.getItem('token'),
    status: 'idle',
    error: null,
    userError: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isLoggedIn = false
      state.status = 'idle'
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload
        state.isLoggedIn = true
        localStorage.setItem('token', action.payload)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading'
        state.userError = null
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed'
        state.userError = action.payload
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading'
        state.userError = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed'
        state.userError = action.payload
      })
  },
})

// Селекторы рядом с слайсом
export const selectUser = (state) => state.user.user
export const selectToken = (state) => state.user.token
export const selectIsLoggedIn = (state) => state.user.isLoggedIn
export const selectStatus = (state) => state.user.status
export const selectUserError = (state) => state.user.userError

export const { logout } = userSlice.actions

export default userSlice.reducer

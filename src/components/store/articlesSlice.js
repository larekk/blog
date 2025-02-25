import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async (offset) => {
  const url = new URL('https://blog-platform.kata.academy/api/articles')

  const headers = {}

  const token = localStorage.getItem('token')
  if (token) {
    headers['Authorization'] = `Token ${token}`
  }

  if (offset) {
    url.searchParams.append('offset', offset)
  }

  const response = await fetch(url, { headers })

  if (!response.ok) {
    throw new Error('Error fetching articles')
  }

  return await response.json()
})

export const fetchArticleBySlug = createAsyncThunk('articles/fetchArticleBySlug', async (slug) => {
  const response = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`)

  const data = await response.json()
  return data.article
})

export const createNewArticle = createAsyncThunk(
  'articles/createNewArticle',
  async (articleData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://blog-platform.kata.academy/api/articles', {
        method: 'POST',
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      })

      const result = await response.json()

      if (response.ok) {
        console.log(result)
        return
      }

      return rejectWithValue(result.errors)
    } catch (error) {
      return rejectWithValue({ general: 'Network error. Try again later.' })
    }
  }
)

export const updateArticle = createAsyncThunk(
  'articles/updateArticle',
  async ({ slug, article }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`, {
        method: 'PUT',
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article: { ...article } }),
      })

      const result = await response.json()

      if (response.ok) {
        return result.article
      } else {
        return rejectWithValue(result.errors)
      }
    } catch (error) {
      console.error('Error in updateArticle:', error)
      return rejectWithValue({ general: 'Network error. Try again later.' })
    }
  }
)

export const deleteArticle = createAsyncThunk('articles/deleteArticle', async (slug, { rejectWithValue }) => {
  try {
    const response = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    })

    if (response.ok) {
      return
    }

    const result = await response.json()
    return rejectWithValue(result.errors)
  } catch (error) {
    return rejectWithValue({ general: 'Network error. Try again later.' })
  }
})

export const favoriteArticle = createAsyncThunk('articles/favoriteArticle', async (slug, { rejectWithValue }) => {
  try {
    const response = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}/favorite`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
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

export const unfavoriteArticle = createAsyncThunk('articles/unfavoriteArticle', async (slug, { rejectWithValue }) => {
  try {
    const response = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}/favorite`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    })

    const result = await response.json()

    if (response.ok) {
      console.log(result)
      return
    }

    return rejectWithValue(result.errors)
  } catch (error) {
    return rejectWithValue({ general: 'Network error. Try again later.' })
  }
})

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    article: null,
    total: 0,
    status: 'idle',
    newArticleStatus: 'idle',
    isDeleteStatus: 'idle',
    error: null,
  },
  reducers: {
    resetNewArticleStatus: (state) => {
      state.newArticleStatus = 'idle'
    },
    resetIsDeleteStatus: (state) => {
      state.isDeleteStatus = 'idle'
    },
    resetArticle: (state) => {
      state.article = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.total = action.payload.articlesCount
        state.articles = action.payload.articles
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchArticleBySlug.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchArticleBySlug.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.article = action.payload
      })
      .addCase(fetchArticleBySlug.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(createNewArticle.pending, (state) => {
        state.newArticleStatus = 'loading'
      })
      .addCase(createNewArticle.fulfilled, (state) => {
        state.newArticleStatus = 'succeeded'
      })
      .addCase(createNewArticle.rejected, (state, action) => {
        state.newArticleStatus = 'failed'
        state.error = action.error.message
      })
      .addCase(deleteArticle.pending, (state) => {
        state.isDeleteStatus = 'loading'
      })
      .addCase(deleteArticle.fulfilled, (state) => {
        state.isDeleteStatus = 'succeeded'
      })
      .addCase(deleteArticle.rejected, (state) => {
        state.isDeleteStatus = 'failed'
      })
      .addCase(updateArticle.pending, (state) => {
        state.newArticleStatus = 'loading' // Статус загрузки
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.newArticleStatus = 'succeeded' // Успешно обновлена
        state.article = action.payload // Сохраняем обновленную статью в state
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.newArticleStatus = 'failed' // Ошибка
        state.error = action.payload || 'An error occurred' // Сохраняем ошибку
      })
  },
})

export const { resetNewArticleStatus, resetIsDeleteStatus, resetArticle } = articlesSlice.actions

export default articlesSlice.reducer

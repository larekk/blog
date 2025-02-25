import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Card, Avatar, Tag, Spin, Alert, Button, Popconfirm, message } from 'antd'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'

import {
  deleteArticle,
  fetchArticleBySlug,
  resetIsDeleteStatus,
  favoriteArticle,
  unfavoriteArticle,
} from '../store/articlesSlice'

import styles from './Article.module.scss'

const Article = () => {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { article, status, isDeleteStatus } = useSelector((state) => state.articles)
  const { user, isLoggedIn } = useSelector((state) => state.user)
  const [isFavorited, setIsFavorited] = useState(article?.favorited || false)
  const [currentFavoritesCount, setCurrentFavoritesCount] = useState(article?.favoritesCount || 0)

  useEffect(() => {
    if (slug) {
      dispatch(fetchArticleBySlug(slug))
    }
  }, [dispatch, slug])

  useEffect(() => {
    if (article) {
      setIsFavorited(article.favorited)
      setCurrentFavoritesCount(article.favoritesCount)
    }
  }, [article])

  useEffect(() => {
    if (isDeleteStatus === 'succeeded') {
      message.success('Статья успешно удалена!')
      const timer = setTimeout(() => {
        dispatch(resetIsDeleteStatus())
        navigate('/')
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isDeleteStatus, dispatch, navigate])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const confirmDelete = () => {
    dispatch(deleteArticle(slug))
  }

  const toggleFavorite = () => {
    if (!isLoggedIn) return

    if (isFavorited) {
      dispatch(unfavoriteArticle(slug))
      setIsFavorited(false)
      setCurrentFavoritesCount((state) => state - 1)
    } else {
      dispatch(favoriteArticle(slug))
      setIsFavorited(true)
      setCurrentFavoritesCount((state) => state + 1)
    }
  }

  if (status === 'loading') {
    return (
      <div className={styles.spinContainer}>
        <Spin size="large" />
      </div>
    )
  }

  if (status === 'failed') return <Alert message="Ошибка загрузки статьи" type="error" />
  if (!article) return null

  return (
    <Card className={styles.articles__card}>
      <div className={styles.article__inner__wrapper}>
        <div>
          <div className={styles.articles__header__container}>
            <h3 className={styles.article__title}>{article.title}</h3>
            <div className={styles.heart__container} onClick={toggleFavorite}>
              {isLoggedIn && isFavorited ? (
                <HeartFilled className={styles.heart} style={{ color: 'red' }} />
              ) : (
                <HeartOutlined className={styles.heart} />
              )}
              <div>{currentFavoritesCount}</div>
            </div>
          </div>
          {Array.isArray(article.tagList) &&
            article.tagList.map((tag, i) => (
              <Tag className={styles.article__tag} key={i}>
                {tag}
              </Tag>
            ))}
        </div>
        <div className={styles.article__writer}>
          <div>
            <div className={styles.article__writer__name}>{article.author?.username || 'Unknown'}</div>
            <div className={styles.article__writer__postdate}>{formatDate(article.createdAt)}</div>
          </div>
          <Avatar
            size={46}
            src={article.author?.image || 'https://via.placeholder.com/50'}
            alt={article.author?.username || 'Аватар'}
          />
        </div>
      </div>
      <div className={styles.article__description}>
        {article.description}
        {article?.author?.username && user?.username && article.author.username === user.username && (
          <div>
            <Popconfirm
              className={styles.modalDelete}
              description="Are you sure to delete this article?"
              onConfirm={confirmDelete}
              placement="right"
              okText="Yes"
              cancelText="No"
            >
              <Button className={styles.deleteArticleButton} color="red" variant="outlined">
                Delete
              </Button>
            </Popconfirm>
            <Link to={`/articles/${slug}/edit`}>
              <Button className={styles.editArticleButton} color="green" variant="outlined">
                Edit
              </Button>
            </Link>
          </div>
        )}
      </div>
      {article.body ? <ReactMarkdown className={styles.article__content}>{article.body}</ReactMarkdown> : null}
    </Card>
  )
}

export default Article

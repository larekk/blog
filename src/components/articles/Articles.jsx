import React, { useState } from 'react'
import { Card, Avatar, Tag } from 'antd'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { favoriteArticle, unfavoriteArticle } from '../store/articlesSlice'

import styles from './Articles.module.scss'

const Articles = ({ slug, title, description, tagList, createdAt, favorited, favoritesCount, author }) => {
  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector((state) => state.user)
  const [isFavorited, setIsFavorited] = useState(favorited)
  const [currentFavoritesCount, setCurrentFavoritesCount] = useState(favoritesCount)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const toggleFavorite = () => {
    if (isFavorited) {
      setIsFavorited(false)
      setCurrentFavoritesCount(currentFavoritesCount - 1)
      dispatch(unfavoriteArticle(slug))
    } else {
      setIsFavorited(true)
      setCurrentFavoritesCount(currentFavoritesCount + 1)
      dispatch(favoriteArticle(slug))
    }
  }

  return (
    <Card className={styles.articles__card}>
      {' '}
      {/* Изменил на styles. */}
      <div className={styles.article__inner__wrapper}>
        <div>
          <div className={styles.articles__header__container}>
            <h3 className={styles.article__title}>
              <Link to={`/articles/${slug}`}>{title}</Link>
            </h3>
            <div
              className={styles.heart__container}
              onClick={() => {
                isLoggedIn ? toggleFavorite() : ''
              }}
            >
              {isLoggedIn && isFavorited ? (
                <HeartFilled className={styles.heart} style={{ color: 'red', transition: '300ms' }} />
              ) : (
                <HeartOutlined className={styles.heart} />
              )}
              {currentFavoritesCount}
            </div>
          </div>
          {tagList?.map((tag, i) => (
            <Tag className={styles.article__tag} key={i}>
              {tag}
            </Tag>
          ))}
        </div>
        <div className={styles.article__writer}>
          <div>
            <div className={styles.article__writer__name}>{author?.username || 'Unknown'}</div>
            <div className={styles.article__writer__postdate}>{formatDate(createdAt)}</div>
          </div>
          <Avatar
            size={46}
            src={author?.image || 'https://via.placeholder.com/50'}
            alt={author?.username || 'Аватар'}
          />
        </div>
      </div>
      <p className={styles.article__content}>{description}</p>
    </Card>
  )
}

export default Articles

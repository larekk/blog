import React, { useState } from 'react'
import { Card, Avatar, Tag } from 'antd'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'
// eslint-disable-next-line import/order
import { Link } from 'react-router-dom'
import './Articles.scss'

import { useDispatch, useSelector } from 'react-redux'

import { favoriteArticle, unfavoriteArticle } from '../store/articlesSlice'

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
    <Card className="articles__card">
      <div className="article__inner__wrapper">
        <div>
          <div className="articles__header__container">
            <h3 className="article__title">
              <Link to={`/articles/${slug}`}>{title}</Link>
            </h3>
            <div
              className="heart__container"
              onClick={() => {
                isLoggedIn ? toggleFavorite() : ''
              }}
            >
              {isLoggedIn && isFavorited ? (
                <HeartFilled className="heart" style={{ color: 'red', transition: '300ms' }} />
              ) : (
                <HeartOutlined className="heart" />
              )}
              {currentFavoritesCount}
            </div>
          </div>
          {tagList?.map((tag, i) => (
            <Tag className="article__tag" key={i}>
              {tag}
            </Tag>
          ))}
        </div>
        <div className="article__writer">
          <div>
            <div className="article__writer__name">{author?.username || 'Unknown'}</div>
            <div className="article__writer__postdate">{formatDate(createdAt)}</div>
          </div>
          <Avatar
            size={46}
            src={author?.image || 'https://via.placeholder.com/50'}
            alt={author?.username || 'Аватар'}
          />
        </div>
      </div>
      <p className="article__content">{description}</p>
    </Card>
  )
}

export default Articles

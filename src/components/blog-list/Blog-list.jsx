import React, { useEffect, useState } from 'react'
import { Layout, Pagination, Spin, Alert, Empty } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { createSelector } from 'reselect'

import { fetchArticles } from '../store/articlesSlice'
import ArticleCard from '../articles/Articles'

import styles from './Blog-list.module.scss'

const { Content } = Layout

const selectArticles = (state) => state.articles.articles
const selectStatus = (state) => state.articles.status
const selectTotal = (state) => state.articles.total

const makeArticlesSelector = createSelector([selectArticles, selectStatus, selectTotal], (articles, status, total) => ({
  articles,
  status,
  total,
}))

const BlogList = () => {
  const [current, setCurrent] = useState(1)
  const dispatch = useDispatch()

  const { articles, status, total } = useSelector(makeArticlesSelector)

  useEffect(() => {
    dispatch(fetchArticles((current - 1) * 20))
  }, [dispatch, current])

  const onChange = (page) => {
    setCurrent(page)
    dispatch(fetchArticles((page - 1) * 20))
  }

  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        {status === 'loading' && (
          <div className={styles.spinContainer}>
            <Spin size="large" />
          </div>
        )}
        {status === 'failed' && <Alert message="Ошибка загрузки статей" type="error" />}
        {status === 'succeeded' && articles.length === 0 && <Empty description="Нет статей" />}
        {status === 'succeeded' && articles.map((article) => <ArticleCard key={article.slug} {...article} />)}

        <Pagination
          onChange={onChange}
          current={current}
          showSizeChanger={false}
          align="center"
          total={total}
          pageSize={20}
        />
      </Content>
    </Layout>
  )
}

export default BlogList

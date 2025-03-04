import React, { useEffect } from 'react'
import { Layout, Pagination, Spin, Alert, Empty } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { useSearchParams } from 'react-router-dom'

import { fetchArticles } from '../store/articlesSlice'
import ArticleCard from '../articles/Articles'

import styles from './Blog-list.module.scss'

const { Content } = Layout

const selectArticles = (state) => state.articles.articles
const selectStatus = (state) => state.articles.status
const selectTotal = (state) => state.articles.total
const selectCurrentPage = (state) => state.articles.currentPage

const makeArticlesSelector = createSelector(
  [selectArticles, selectStatus, selectTotal, selectCurrentPage],
  (articles, status, total, currentPage) => ({
    articles,
    status,
    total,
    currentPage,
  })
)

const BlogList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useDispatch()

  const current = Number(searchParams.get('page')) || 1

  const { articles, status, total, currentPage } = useSelector(makeArticlesSelector)

  useEffect(() => {
    if (current !== currentPage) {
      dispatch(fetchArticles((current - 1) * 20))
    }
  }, [dispatch, current, currentPage])

  const onChange = (page) => {
    setSearchParams({ page })
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
          className="ant-pagination"
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

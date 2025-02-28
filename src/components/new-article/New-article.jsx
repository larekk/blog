import React, { useEffect, useState, useRef } from 'react'
import { Form, Input, Button, Alert, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'

import {
  createNewArticle,
  fetchArticleBySlug,
  resetArticle,
  resetNewArticleStatus,
  updateArticle,
} from '../store/articlesSlice'

import styles from './New-article.module.scss'

export const NewArticle = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { slug } = useParams()

  const [form] = Form.useForm()
  const newArticleStatus = useSelector((state) => state.articles.newArticleStatus)
  const articleToEdit = useSelector((state) => state.articles.article)
  const currentUser = useSelector((state) => state.user.user)

  const [tagList, setTagList] = useState([])
  const [newTag, setNewTag] = useState('')

  const messageShown = useRef(false)

  useEffect(() => {
    if (slug) {
      dispatch(fetchArticleBySlug(slug))
    } else {
      dispatch(resetArticle())
      form.resetFields()
      setTagList([])
    }
  }, [slug, dispatch, form])

  useEffect(() => {
    if (articleToEdit && slug) {
      if (articleToEdit?.author?.username !== currentUser?.username && !messageShown.current) {
        console.log('articleToEdit :', articleToEdit)
        console.log('currentUser :', currentUser)
        message.error('Вы не можете редактировать чужие статьи!')
        messageShown.current = true
        navigate('/')
      } else {
        form.setFieldsValue({
          title: articleToEdit.title || '',
          description: articleToEdit.description || '',
          body: articleToEdit.body || '',
        })
        setTagList(articleToEdit.tagList || [])
      }
    }
  }, [articleToEdit, slug, currentUser, navigate, form])

  useEffect(() => {
    if (newArticleStatus === 'succeeded') {
      const timer = setTimeout(() => {
        dispatch(resetNewArticleStatus())
        if (slug) {
          navigate(`/articles/${articleToEdit.slug}`)
        } else {
          navigate('/')
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [newArticleStatus, dispatch, navigate, slug, articleToEdit])

  const handleAddTag = () => {
    if (newTag.trim() && !tagList.includes(newTag)) {
      setTagList([...tagList, newTag.trim()])
      setNewTag('')
    }
  }

  const handleDeleteTag = (index) => {
    setTagList(tagList.filter((_, i) => i !== index))
  }

  const onFinish = (values) => {
    const newArticle = { ...values, tagList }
    if (slug) {
      dispatch(updateArticle({ slug, article: newArticle }))
    } else {
      dispatch(createNewArticle({ article: newArticle }))
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>{slug ? 'Edit article' : 'Create new article'}</h2>
        {newArticleStatus === 'failed' && (
          <Alert message="Ошибка создания/редактирования статьи" className={styles.alert} type="error" />
        )}
        {newArticleStatus === 'succeeded' ? (
          <Alert message="Статья успешно создана/отредактирована!" className={styles.alert} type="success" />
        ) : null}
        <Form form={form} layout="vertical" onFinish={onFinish} className={styles.form}>
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Title is required' }]}>
            <Input size="large" placeholder="Title" />
          </Form.Item>

          <Form.Item
            label="Short description"
            name="description"
            rules={[{ required: true, message: 'Description is required' }]}
          >
            <Input size="large" placeholder="Short description" />
          </Form.Item>

          <Form.Item label="Text" name="body" rules={[{ required: true, message: 'Text is required' }]}>
            <Input.TextArea className={styles.textArea} rows={4} placeholder="Text" />
          </Form.Item>

          <Form.Item label="Tags">
            <div className={styles.tagsContainer}>
              {tagList.map((tag, index) => (
                <div key={index} className={styles.tagItem}>
                  <div className={styles.tagContainer}>
                    <Input value={tag} readOnly size="large" />
                  </div>
                  <Button className={styles.deleteTagButton} danger onClick={() => handleDeleteTag(index)}>
                    Delete
                  </Button>
                </div>
              ))}
              <div className={styles.addTagContainer}>
                <div className={styles.newTagContainer}>
                  <Input size="large" placeholder="Tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
                </div>
                <Button className={styles.addNewTagButton} color="blue" variant="outlined" onClick={handleAddTag}>
                  Add tag
                </Button>
              </div>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.submitButton}
              loading={newArticleStatus === 'loading'}
            >
              {slug ? 'Update Article' : 'Create Article'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

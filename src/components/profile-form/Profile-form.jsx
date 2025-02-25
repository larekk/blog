import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Form, Input, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { updateUserProfile } from '../store/userSlice'

import styles from './Profile-form.module.scss'

export const ProfileForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm()

  const { status, error, user, token } = useSelector((state) => state.user)

  const onSubmit = (data) => {
    const formattedData = {
      user: {
        username: data.username,
        email: data.email,
        password: data.password,
        image: data.url,
      },
    }

    dispatch(updateUserProfile({ data: formattedData, token }))
  }

  useEffect(() => {
    if (status === 'succeeded') {
      navigate('/profile')
    }
  }, [status, navigate])

  useEffect(() => {
    if (error) {
      if (error.username) {
        setError('username', { type: 'server', message: error.username })
      }
      if (error.email) {
        setError('email', { type: 'server', message: error.email })
      }
      if (error.password) {
        setError('password', { type: 'server', message: error.password })
      }
      if (error.url) {
        setError('url', { type: 'server', message: error.url })
      }
    }
  }, [error, setError])

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Edit Profile</h2>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.form}>
          <Form.Item label="Username" validateStatus={errors.username ? 'error' : ''} help={errors.username?.message}>
            <Controller
              name="username"
              control={control}
              defaultValue={user?.username || ''}
              rules={{
                required: 'Username is required!',
                minLength: { value: 3, message: 'Username must be at least 3 characters long' },
                maxLength: { value: 20, message: 'Username cannot exceed 20 characters' },
              }}
              render={({ field }) => <Input size="large" {...field} />}
            />
          </Form.Item>

          <Form.Item label="Email address" validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
            <Controller
              name="email"
              control={control}
              defaultValue={user?.email || ''}
              rules={{
                required: 'Email is required!',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Please enter a valid email address',
                },
              }}
              render={({ field }) => <Input size="large" {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="New Password"
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              rules={{
                minLength: { value: 6, message: 'Password must be at least 6 characters long' },
                maxLength: { value: 40, message: 'Password cannot exceed 40 characters' },
              }}
              render={({ field }) => <Input.Password size="large" {...field} />}
            />
          </Form.Item>

          <Form.Item label="Avatar Image URL" validateStatus={errors.url ? 'error' : ''} help={errors.url?.message}>
            <Controller
              name="url"
              control={control}
              defaultValue={user?.image || ''}
              rules={{
                pattern: {
                  value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
                },
              }}
              render={({ field }) => <Input size="large" {...field} />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.submitButton}
              disabled={Object.keys(errors).length > 0}
              loading={status === 'loading'}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

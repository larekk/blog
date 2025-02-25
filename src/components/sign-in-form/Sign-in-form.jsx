import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Form, Input, Button, Alert } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { loginUser } from '../store/userSlice'

import styles from './Sign-in-form.module.scss'

export const SignInForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoggedIn, error, status } = useSelector((state) => state.user)

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    const formattedData = {
      user: {
        email: data.email,
        password: data.password,
      },
    }

    dispatch(loginUser(formattedData))
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn, navigate])

  useEffect(() => {
    if (error) {
      if (error['email or password']) {
        setError('email', { type: 'server', message: 'Email or password is invalid' })
        setError('password', { type: 'server', message: 'Email or password is invalid' })
      } else {
        if (error.email) {
          setError('email', { type: 'server', message: error.email })
        }
        if (error.password) {
          setError('password', { type: 'server', message: error.password })
        }
      }
    }
  }, [error, setError])

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign In</h2>

        {/* Общая ошибка, если есть */}
        {error?.general && <Alert message={error.general} type="error" showIcon style={{ marginBottom: '16px' }} />}

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.form}>
          <Form.Item label="Email address" validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Please enter your email!',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email!' },
              }}
              render={({ field }) => <Input size="large" {...field} />}
            />
          </Form.Item>

          <Form.Item label="Password" validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
            <Controller
              name="password"
              control={control}
              rules={{ required: 'Please enter your password!' }}
              render={({ field }) => <Input.Password size="large" {...field} />}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.submitButton} loading={status === 'loading'}>
              Login
            </Button>
          </Form.Item>

          <div className={styles.loginLink}>
            Don’t have an account? <Link to={'/sign-up'}>Sign Up</Link>
          </div>
        </Form>
      </div>
    </div>
  )
}

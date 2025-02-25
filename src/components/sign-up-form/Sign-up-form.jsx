import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Form, Input, Button, Checkbox } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { registerUser } from '../store/userSlice'

import styles from './Sign-up-form.module.scss'

export const SignUpForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm()

  const { status, error } = useSelector((state) => state.user)

  const onSubmit = (data) => {
    const formattedData = {
      user: {
        username: data.username,
        email: data.email,
        password: data.password,
      },
    }

    dispatch(registerUser(formattedData))
  }

  useEffect(() => {
    if (status === 'succeeded') {
      navigate('/sign-in')
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
    }
  }, [error, setError])

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create new account</h2>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.form}>
          <Form.Item label="Username" validateStatus={errors.username ? 'error' : ''} help={errors.username?.message}>
            <Controller
              name="username"
              control={control}
              rules={{
                required: 'Please enter your username!',
                minLength: { value: 3, message: 'Your username needs to be at least 3 characters.' },
                maxLength: { value: 20, message: 'Maximum 20 characters.' },
              }}
              render={({ field }) => <Input size="large" {...field} />}
            />
          </Form.Item>

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
              rules={{
                required: 'Please enter your password!',
                minLength: { value: 6, message: 'Your password needs to be at least 6 characters.' },
                maxLength: { value: 40, message: 'Maximum 40 characters' },
              }}
              render={({ field }) => <Input.Password size="large" {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Repeat Password"
            validateStatus={errors.repeatPassword ? 'error' : ''}
            help={errors.repeatPassword?.message}
          >
            <Controller
              name="repeatPassword"
              control={control}
              rules={{
                required: 'Please confirm your password!',
                validate: (value) => value === (watch('password') || '') || 'Passwords must match!',
              }}
              render={({ field }) => <Input.Password size="large" {...field} />}
            />
          </Form.Item>

          <Form.Item validateStatus={errors.agreement ? 'error' : ''} help={errors.agreement?.message}>
            <Controller
              name="agreement"
              control={control}
              rules={{ required: 'You must agree to continue' }}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className={styles.agreement}
                >
                  I agree to the processing of my personal information
                </Checkbox>
              )}
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
              Create
            </Button>
          </Form.Item>

          <div className={styles.loginLink}>
            Already have an account? <Link to={'/sign-in'}>Sign In</Link>
          </div>
        </Form>
      </div>
    </div>
  )
}

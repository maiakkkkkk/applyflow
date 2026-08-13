import { useState, type FormEvent } from 'react'
import { useAuth } from '../features/auth/context/AuthContext'

type AuthMode = 'sign-in' | 'sign-up'

export function AuthPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    setError('')
    setMessage('')

    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }

    setIsSubmitting(true)

    try {
      if (mode === 'sign-in') {
        const { error: signInError } = await signIn(email.trim(), password)
        if (signInError) setError(signInError.message)
      } else {
        const { data, error: signUpError } = await signUp(
          email.trim(),
          password,
        )

        if (signUpError) {
          setError(signUpError.message)
        } else if (!data.session) {
          setMessage(
            'Account created. Check your email to confirm your account before signing in.',
          )
        }
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Authentication could not be completed.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode)
    setError('')
    setMessage('')
  }

  const isSignIn = mode === 'sign-in'

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <p className="auth-brand">ApplyFlow</p>
        <p className="eyebrow">Job Application Tracker</p>
        <h1 id="auth-title">{isSignIn ? 'Sign in' : 'Create an account'}</h1>
        <p className="page-description">
          {isSignIn
            ? 'Access your application workspace.'
            : 'Create an account to start tracking opportunities.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="form-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              autoComplete={isSignIn ? 'current-password' : 'new-password'}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <p className="auth-feedback auth-feedback--error" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="auth-feedback auth-feedback--success" role="status">
              {message}
            </p>
          )}

          <button
            className="primary-button auth-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Please wait…'
              : isSignIn
                ? 'Sign in'
                : 'Sign up'}
          </button>
        </form>

        <p className="auth-switch">
          {isSignIn ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => changeMode(isSignIn ? 'sign-up' : 'sign-in')}
            disabled={isSubmitting}
          >
            {isSignIn ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </section>
    </main>
  )
}

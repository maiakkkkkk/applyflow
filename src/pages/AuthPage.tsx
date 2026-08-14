import { useState, type FormEvent } from 'react'
import { BrandLogo } from '../components/brand/BrandLogo'
import { PreferencesControls } from '../features/preferences/components/PreferencesControls'
import { useTranslation } from '../i18n/useTranslation'
import { useAuth } from '../features/auth/context/AuthContext'

type AuthMode = 'sign-in' | 'sign-up'

export function AuthPage() {
  const { t } = useTranslation()
  const { signIn, signInWithGoogle, signUp } = useAuth()
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    setError('')
    setMessage('')

    if (!email.trim() || !password) {
      setError(t('auth.required'))
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
            t('auth.accountCreated'),
          )
        }
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : t('auth.failed'),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleGoogleSignIn() {
    if (isGoogleSubmitting || isSubmitting) return

    setError('')
    setMessage('')
    setIsGoogleSubmitting(true)

    try {
      const { error: googleError } = await signInWithGoogle()

      if (googleError) {
        setError(googleError.message)
        setIsGoogleSubmitting(false)
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : t('auth.googleFailed'),
      )
      setIsGoogleSubmitting(false)
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
      <section className="auth-intro" aria-label="About ApplyFlow">
        <div className="auth-intro__content">
          <div className="auth-brand"><BrandLogo /></div>
          <p className="eyebrow">{t('auth.eyebrow')}</p><h1>{t('auth.hero')}</h1><p>{t('auth.heroText')}</p>
        </div>
      </section>
      <section className="auth-form-area">
      <div className="auth-preferences"><PreferencesControls /></div>
      <div className="auth-panel" aria-labelledby="auth-title">
        <p className="eyebrow">{t('auth.tracker')}</p><h1 id="auth-title">{isSignIn ? t('auth.signIn') : t('auth.create')}</h1>
        <p className="page-description">
          {isSignIn
            ? t('auth.access') : t('auth.start')}
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="auth-email">{t('auth.email')}</label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting || isGoogleSubmitting}
            />
          </div>
          <div className="form-field">
            <label htmlFor="auth-password">{t('auth.password')}</label>
            <input
              id="auth-password"
              type="password"
              autoComplete={isSignIn ? 'current-password' : 'new-password'}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting || isGoogleSubmitting}
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
            disabled={isSubmitting || isGoogleSubmitting}
          >
            {isSubmitting
              ? t('auth.wait')
              : isSignIn
                ? t('auth.signIn') : t('auth.signUp')}
          </button>
        </form>

        <div className="auth-divider" aria-hidden="true">
          <span>{t('auth.or')}</span>
        </div>

        <button
          className="google-auth-button"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting || isGoogleSubmitting}
        >
          <svg className="google-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.32 2.98-7.41Z"/><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.36l-3.24-2.54c-.9.6-2.05.97-3.38.97-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.39 13.94A6.02 6.02 0 0 1 6.07 12c0-.67.12-1.33.32-1.94V7.44H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.56l3.35-2.62Z"/><path fill="#EA4335" d="M12 5.93c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.96 5.44l3.35 2.62C7.18 7.69 9.39 5.93 12 5.93Z"/></svg>
          {isGoogleSubmitting ? t('auth.googleConnecting') : t('auth.google')}
        </button>

        <p className="auth-switch">
          {isSignIn ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
          <button
            type="button"
            onClick={() => changeMode(isSignIn ? 'sign-up' : 'sign-in')}
            disabled={isSubmitting || isGoogleSubmitting}
          >
            {isSignIn ? t('auth.signUp') : t('auth.signIn')}
          </button>
        </p>
      </div>
      </section>
    </main>
  )
}

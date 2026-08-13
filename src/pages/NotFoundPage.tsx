import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <main className="placeholder-page not-found-page">
      <p className="eyebrow">404 error</p>
      <h1>Page not found</h1>
      <p className="page-description">
        The page you requested does not exist.
      </p>
      <Link className="primary-button page-link" to="/">
        Back to dashboard
      </Link>
    </main>
  )
}

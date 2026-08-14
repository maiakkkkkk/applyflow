import { Link } from 'react-router'
import { useTranslation } from '../i18n/useTranslation'

export function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <main className="placeholder-page not-found-page">
      <p className="eyebrow">{t('notFound.eyebrow')}</p><h1>{t('notFound.title')}</h1><p className="page-description">{t('notFound.description')}</p>
      <Link className="primary-button page-link" to="/">
        {t('notFound.back')}
      </Link>
    </main>
  )
}

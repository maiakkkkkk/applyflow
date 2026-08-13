import { ApplicationCard } from '../features/applications/components/ApplicationCard'
import { mockApplications } from '../features/applications/data/mockApplications'

export function ApplicationsPage() {
  return (
    <main className="applications-page">
      <header className="page-header">
        <a className="brand" href="/" aria-label="ApplyFlow home">
          ApplyFlow
        </a>
        <div className="page-heading">
          <p className="eyebrow">Job Application Tracker</p>
          <h1>Applications</h1>
          <p className="page-description">
            Keep track of every opportunity and see where each application
            stands.
          </p>
        </div>
      </header>

      <section className="applications-grid" aria-label="Job applications">
        {mockApplications.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))}
      </section>
    </main>
  )
}

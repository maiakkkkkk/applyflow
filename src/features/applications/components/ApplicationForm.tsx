import { useState, type FormEvent } from 'react'
import type {
  Application,
  ApplicationSource,
  ApplicationStatus,
  EmploymentType,
  WorkMode,
} from '../types'

interface ApplicationFormProps {
  application?: Application
  onSubmit: (application: Application) => Promise<void>
  onCancel: () => void
}

interface FormValues {
  company: string
  position: string
  status: ApplicationStatus | ''
  source: ApplicationSource | ''
  workMode: WorkMode | ''
  employmentType: EmploymentType | ''
  location: string
  jobUrl: string
  nextActionAt: string
  technologies: string
  notes: string
}

type RequiredField = 'company' | 'position' | 'status' | 'source'
type FormErrors = Partial<Record<RequiredField, string>>

function getInitialValues(application?: Application): FormValues {
  return {
    company: application?.company ?? '',
    position: application?.position ?? '',
    status: application?.status ?? '',
    source: application?.source ?? '',
    workMode: application?.workMode ?? '',
    employmentType: application?.employmentType ?? '',
    location: application?.location ?? '',
    jobUrl: application?.jobUrl ?? '',
    nextActionAt: application?.nextActionAt ?? '',
    technologies: application?.technologies?.join(', ') ?? '',
    notes: application?.notes ?? '',
  }
}

function createTemporaryId() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `application-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function ApplicationForm({
  application: applicationToEdit,
  onSubmit,
  onCancel,
}: ApplicationFormProps) {
  const isEditing = applicationToEdit !== undefined
  const [values, setValues] = useState<FormValues>(() =>
    getInitialValues(applicationToEdit),
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateValue<Field extends keyof FormValues>(
    field: Field,
    value: FormValues[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }))

    if (field in errors) {
      setErrors((current) => ({ ...current, [field]: undefined }))
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const nextErrors: FormErrors = {}
    if (!values.company.trim()) nextErrors.company = 'Company is required.'
    if (!values.position.trim()) nextErrors.position = 'Position is required.'
    if (!values.status) nextErrors.status = 'Status is required.'
    if (!values.source) nextErrors.source = 'Source is required.'

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const technologies = values.technologies
      .split(',')
      .map((technology) => technology.trim())
      .filter(Boolean)
    const timestamp = new Date().toISOString()

    const application: Application = {
      ...applicationToEdit,
      id: applicationToEdit?.id ?? createTemporaryId(),
      company: values.company.trim(),
      position: values.position.trim(),
      status: values.status as ApplicationStatus,
      source: values.source as ApplicationSource,
      createdAt: applicationToEdit?.createdAt ?? timestamp,
      updatedAt: timestamp,
    }

    if (values.workMode) application.workMode = values.workMode
    else delete application.workMode
    if (values.employmentType)
      application.employmentType = values.employmentType
    else delete application.employmentType
    if (values.location.trim()) application.location = values.location.trim()
    else delete application.location
    if (values.jobUrl.trim()) application.jobUrl = values.jobUrl.trim()
    else delete application.jobUrl
    if (values.nextActionAt) application.nextActionAt = values.nextActionAt
    else delete application.nextActionAt
    if (technologies.length > 0) application.technologies = technologies
    else delete application.technologies
    if (values.notes.trim()) application.notes = values.notes.trim()
    else delete application.notes

    setIsSubmitting(true)
    try {
      await onSubmit(application)
      setValues(getInitialValues())
      setErrors({})
    } catch {
      // The shared applications context exposes the remote error to the page.
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="application-form-panel" aria-labelledby="form-title">
      <div className="application-form-panel__header">
        <div>
          <h2 id="form-title">
            {isEditing ? 'Edit application' : 'Add application'}
          </h2>
          <p>
            {isEditing
              ? 'Update the details for this job application.'
              : 'Record a new opportunity in your application tracker.'}
          </p>
        </div>
      </div>

      <form className="application-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="company">Company *</label>
          <input
            id="company"
            value={values.company}
            onChange={(event) => updateValue('company', event.target.value)}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={errors.company ? 'company-error' : undefined}
            autoFocus
          />
          {errors.company && (
            <span className="field-error" id="company-error">
              {errors.company}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="position">Position *</label>
          <input
            id="position"
            value={values.position}
            onChange={(event) => updateValue('position', event.target.value)}
            aria-invalid={Boolean(errors.position)}
            aria-describedby={errors.position ? 'position-error' : undefined}
          />
          {errors.position && (
            <span className="field-error" id="position-error">
              {errors.position}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="application-status">Status *</label>
          <select
            id="application-status"
            value={values.status}
            onChange={(event) =>
              updateValue(
                'status',
                event.target.value as ApplicationStatus | '',
              )
            }
            aria-invalid={Boolean(errors.status)}
            aria-describedby={errors.status ? 'status-error' : undefined}
          >
            <option value="">Select status</option>
            <option value="saved">Saved</option>
            <option value="applied">Applied</option>
            <option value="test">Test</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
          {errors.status && (
            <span className="field-error" id="status-error">
              {errors.status}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="application-source">Source *</label>
          <select
            id="application-source"
            value={values.source}
            onChange={(event) =>
              updateValue(
                'source',
                event.target.value as ApplicationSource | '',
              )
            }
            aria-invalid={Boolean(errors.source)}
            aria-describedby={errors.source ? 'source-error' : undefined}
          >
            <option value="">Select source</option>
            <option value="linkedin">LinkedIn</option>
            <option value="gupy">Gupy</option>
            <option value="company">Company website</option>
            <option value="referral">Referral</option>
            <option value="other">Other</option>
          </select>
          {errors.source && (
            <span className="field-error" id="source-error">
              {errors.source}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="application-work-mode">Work mode</label>
          <select
            id="application-work-mode"
            value={values.workMode}
            onChange={(event) =>
              updateValue('workMode', event.target.value as WorkMode | '')
            }
          >
            <option value="">Not specified</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="employment-type">Employment type</label>
          <select
            id="employment-type"
            value={values.employmentType}
            onChange={(event) =>
              updateValue(
                'employmentType',
                event.target.value as EmploymentType | '',
              )
            }
          >
            <option value="">Not specified</option>
            <option value="clt">CLT</option>
            <option value="pj">PJ</option>
            <option value="internship">Internship</option>
            <option value="trainee">Trainee</option>
            <option value="contract">Contract</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            value={values.location}
            onChange={(event) => updateValue('location', event.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="job-url">Job URL</label>
          <input
            id="job-url"
            type="url"
            value={values.jobUrl}
            onChange={(event) => updateValue('jobUrl', event.target.value)}
            placeholder="https://"
          />
        </div>

        <div className="form-field">
          <label htmlFor="next-action-at">Next action date</label>
          <input
            id="next-action-at"
            type="date"
            value={values.nextActionAt}
            onChange={(event) =>
              updateValue('nextActionAt', event.target.value)
            }
          />
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="technologies">Technologies</label>
          <input
            id="technologies"
            value={values.technologies}
            onChange={(event) =>
              updateValue('technologies', event.target.value)
            }
            placeholder="React, TypeScript, Node.js"
            aria-describedby="technologies-hint"
          />
          <span className="field-hint" id="technologies-hint">
            Separate technologies with commas.
          </span>
        </div>

        <div className="form-field form-field--full">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            rows={4}
            value={values.notes}
            onChange={(event) => updateValue('notes', event.target.value)}
          />
        </div>

        <div className="form-actions form-field--full">
          <button
            className="secondary-button"
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving…'
              : isEditing
                ? 'Save changes'
                : 'Save application'}
          </button>
        </div>
      </form>
    </section>
  )
}

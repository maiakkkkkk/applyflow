import { useState, type FormEvent } from 'react'
import type {
  Application,
  ApplicationSource,
  ApplicationStatus,
  EmploymentType,
  WorkMode,
} from '../types'

interface ApplicationFormProps {
  onSubmit: (application: Application) => void
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
  technologies: string
  notes: string
}

type RequiredField = 'company' | 'position' | 'status' | 'source'
type FormErrors = Partial<Record<RequiredField, string>>

const initialValues: FormValues = {
  company: '',
  position: '',
  status: '',
  source: '',
  workMode: '',
  employmentType: '',
  location: '',
  jobUrl: '',
  technologies: '',
  notes: '',
}

function createTemporaryId() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `application-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function ApplicationForm({
  onSubmit,
  onCancel,
}: ApplicationFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})

  function updateValue<Field extends keyof FormValues>(
    field: Field,
    value: FormValues[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }))

    if (field in errors) {
      setErrors((current) => ({ ...current, [field]: undefined }))
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

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
      id: createTemporaryId(),
      company: values.company.trim(),
      position: values.position.trim(),
      status: values.status as ApplicationStatus,
      source: values.source as ApplicationSource,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...(values.workMode && { workMode: values.workMode }),
      ...(values.employmentType && {
        employmentType: values.employmentType,
      }),
      ...(values.location.trim() && { location: values.location.trim() }),
      ...(values.jobUrl.trim() && { jobUrl: values.jobUrl.trim() }),
      ...(technologies.length > 0 && { technologies }),
      ...(values.notes.trim() && { notes: values.notes.trim() }),
    }

    onSubmit(application)
    setValues(initialValues)
    setErrors({})
  }

  return (
    <section className="application-form-panel" aria-labelledby="form-title">
      <div className="application-form-panel__header">
        <div>
          <h2 id="form-title">Add application</h2>
          <p>Record a new opportunity in your application tracker.</p>
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
          <button className="secondary-button" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="primary-button" type="submit">
            Save application
          </button>
        </div>
      </form>
    </section>
  )
}

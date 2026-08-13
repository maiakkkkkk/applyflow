import type {
  Application,
  ApplicationSource,
  ApplicationStatus,
  EmploymentType,
  SalaryCurrency,
  WorkMode,
} from '../types'

const APPLICATIONS_STORAGE_KEY = 'applyflow:applications'

const applicationStatuses = [
  'saved',
  'applied',
  'test',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
] as const satisfies readonly ApplicationStatus[]

const applicationSources = [
  'linkedin',
  'gupy',
  'company',
  'referral',
  'other',
] as const satisfies readonly ApplicationSource[]

const workModes = [
  'remote',
  'hybrid',
  'onsite',
] as const satisfies readonly WorkMode[]

const employmentTypes = [
  'clt',
  'pj',
  'internship',
  'trainee',
  'contract',
  'other',
] as const satisfies readonly EmploymentType[]

const salaryCurrencies = [
  'BRL',
  'USD',
] as const satisfies readonly SalaryCurrency[]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isOptionalString(value: unknown) {
  return value === undefined || typeof value === 'string'
}

function isOptionalNumber(value: unknown) {
  return value === undefined || (typeof value === 'number' && Number.isFinite(value))
}

function isApplication(value: unknown): value is Application {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'string' &&
    typeof value.company === 'string' &&
    typeof value.position === 'string' &&
    applicationStatuses.some((status) => status === value.status) &&
    applicationSources.some((source) => source === value.source) &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string' &&
    isOptionalString(value.jobUrl) &&
    isOptionalString(value.location) &&
    (value.workMode === undefined ||
      workModes.some((workMode) => workMode === value.workMode)) &&
    (value.employmentType === undefined ||
      employmentTypes.some(
        (employmentType) => employmentType === value.employmentType,
      )) &&
    isOptionalNumber(value.salaryMin) &&
    isOptionalNumber(value.salaryMax) &&
    (value.salaryCurrency === undefined ||
      salaryCurrencies.some(
        (currency) => currency === value.salaryCurrency,
      )) &&
    isOptionalString(value.appliedAt) &&
    isOptionalString(value.nextActionAt) &&
    isOptionalString(value.notes) &&
    (value.technologies === undefined ||
      (Array.isArray(value.technologies) &&
        value.technologies.every(
          (technology) => typeof technology === 'string',
        )))
  )
}

export function loadApplications(): Application[] | null {
  try {
    const storedValue = localStorage.getItem(APPLICATIONS_STORAGE_KEY)
    if (storedValue === null) return null

    const parsedValue: unknown = JSON.parse(storedValue)
    if (!Array.isArray(parsedValue) || !parsedValue.every(isApplication)) {
      return null
    }

    return parsedValue
  } catch {
    return null
  }
}

export function saveApplications(applications: readonly Application[]) {
  try {
    const serializedApplications = JSON.stringify(applications)

    if (localStorage.getItem(APPLICATIONS_STORAGE_KEY) !== serializedApplications) {
      localStorage.setItem(APPLICATIONS_STORAGE_KEY, serializedApplications)
    }
  } catch {
    // Persistence is best-effort; the in-memory application remains usable.
  }
}

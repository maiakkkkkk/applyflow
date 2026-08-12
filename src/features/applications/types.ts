export type ApplicationStatus =
  | 'saved'
  | 'applied'
  | 'test'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn'

export type WorkMode = 'remote' | 'hybrid' | 'onsite'

export type EmploymentType =
  | 'clt'
  | 'pj'
  | 'internship'
  | 'trainee'
  | 'contract'
  | 'other'

export type ApplicationSource =
  | 'linkedin'
  | 'gupy'
  | 'company'
  | 'referral'
  | 'other'

export type SalaryCurrency = 'BRL' | 'USD'

export interface Application {
  id: string
  company: string
  position: string
  status: ApplicationStatus
  source: ApplicationSource
  jobUrl?: string
  location?: string
  workMode?: WorkMode
  employmentType?: EmploymentType
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: SalaryCurrency
  appliedAt?: string
  nextActionAt?: string
  notes?: string
  technologies?: string[]
  createdAt: string
  updatedAt: string
}

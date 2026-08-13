import { supabase } from '../../../lib/supabaseClient'
import type { Application } from '../types'

interface ApplicationRow {
  id: string
  user_id: string
  company: string
  position: string
  status: Application['status']
  source: Application['source']
  job_url: string | null
  location: string | null
  work_mode: Application['workMode'] | null
  employment_type: Application['employmentType'] | null
  salary_min: number | null
  salary_max: number | null
  salary_currency: Application['salaryCurrency'] | null
  applied_at: string | null
  next_action_at: string | null
  notes: string | null
  technologies: string[]
  created_at: string
  updated_at: string
}

type ApplicationWrite = Omit<ApplicationRow, 'user_id'>

function toApplication(row: ApplicationRow): Application {
  return {
    id: row.id,
    company: row.company,
    position: row.position,
    status: row.status,
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...(row.job_url !== null && { jobUrl: row.job_url }),
    ...(row.location !== null && { location: row.location }),
    ...(row.work_mode !== null && { workMode: row.work_mode }),
    ...(row.employment_type !== null && {
      employmentType: row.employment_type,
    }),
    ...(row.salary_min !== null && { salaryMin: row.salary_min }),
    ...(row.salary_max !== null && { salaryMax: row.salary_max }),
    ...(row.salary_currency !== null && {
      salaryCurrency: row.salary_currency,
    }),
    ...(row.applied_at !== null && { appliedAt: row.applied_at }),
    ...(row.next_action_at !== null && { nextActionAt: row.next_action_at }),
    ...(row.notes !== null && { notes: row.notes }),
    ...(row.technologies.length > 0 && { technologies: row.technologies }),
  }
}

function toWrite(application: Application): ApplicationWrite {
  return {
    id: application.id,
    company: application.company,
    position: application.position,
    status: application.status,
    source: application.source,
    job_url: application.jobUrl ?? null,
    location: application.location ?? null,
    work_mode: application.workMode ?? null,
    employment_type: application.employmentType ?? null,
    salary_min: application.salaryMin ?? null,
    salary_max: application.salaryMax ?? null,
    salary_currency: application.salaryCurrency ?? null,
    applied_at: application.appliedAt ?? null,
    next_action_at: application.nextActionAt ?? null,
    notes: application.notes ?? null,
    technologies: application.technologies ?? [],
    created_at: application.createdAt,
    updated_at: application.updatedAt,
  }
}

function getErrorMessage(action: string, message: string) {
  return `Unable to ${action} applications. ${message}`
}

export async function listApplications(userId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw new Error(getErrorMessage('load', error.message))
  return (data as ApplicationRow[]).map(toApplication)
}

export async function createApplication(
  userId: string,
  application: Application,
) {
  const write = toWrite(application)
  const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...fields } =
    write
  const { data, error } = await supabase
    .from('applications')
    .insert({ ...fields, user_id: userId })
    .select()
    .single()

  if (error) throw new Error(getErrorMessage('create', error.message))
  return toApplication(data as ApplicationRow)
}

export async function updateApplication(
  userId: string,
  id: Application['id'],
  application: Application,
) {
  const write = toWrite(application)
  const { id: _id, created_at: _createdAt, ...changes } = write
  const { data, error } = await supabase
    .from('applications')
    .update(changes)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw new Error(getErrorMessage('update', error.message))
  return toApplication(data as ApplicationRow)
}

export async function deleteApplication(
  userId: string,
  id: Application['id'],
) {
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .select('id')
    .single()

  if (error) throw new Error(getErrorMessage('delete', error.message))
}

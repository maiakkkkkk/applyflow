import type { Application } from '../../features/applications/types'

export function createApplicationFixture(
  overrides: Partial<Application> = {},
): Application {
  return {
    id: 'application-1',
    company: 'Acme',
    position: 'Frontend Engineer',
    status: 'applied',
    source: 'linkedin',
    createdAt: '2026-08-01T12:00:00.000Z',
    updatedAt: '2026-08-10T12:00:00.000Z',
    ...overrides,
  }
}

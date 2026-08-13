// oxlint-disable react/only-export-components
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  AuthResponse,
  AuthTokenResponsePassword,
  Session,
  User,
} from '@supabase/supabase-js'
import { supabase } from '../../../lib/supabaseClient'

interface AuthContextValue {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string) => Promise<AuthResponse>
  signIn: (
    email: string,
    password: string,
  ) => Promise<AuthTokenResponsePassword>
  signOut: () => Promise<void>
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return
      setSession(nextSession)
      setIsLoading(false)
    })

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return

      if (error) {
        console.error('Unable to restore the Supabase session:', error.message)
      }

      setSession(data.session ?? null)
      setIsLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = useCallback((email: string, password: string) => {
    return supabase.auth.signUp({ email, password })
  }, [])

  const signIn = useCallback((email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password })
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      isLoading,
      signUp,
      signIn,
      signOut,
    }),
    [session, isLoading, signUp, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

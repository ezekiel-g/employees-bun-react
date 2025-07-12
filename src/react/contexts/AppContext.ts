import { createContext, useContext } from 'react'

const BACK_END_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:3000'
  : (() => {
      const url = import.meta.env.BACK_END_URL

      if (!url || url === 'undefined' || !url.startsWith('http')) {
        throw new Error('BACK_END_URL environment variable required')
      }

      return url
    })()

interface AppContextType {
  backEndUrl: string
}

export const AppContext = createContext<AppContextType>({
  backEndUrl: BACK_END_URL,
})

export const useAppContext = () => useContext(AppContext)

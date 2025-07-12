import { createContext, useContext } from 'react'

const BACK_END_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:3000'
  : 'https://production-url.com'

interface AppContextType {
  backEndUrl: string
}

export const AppContext = createContext<AppContextType>({
  backEndUrl: BACK_END_URL,
})

export const useAppContext = () => useContext(AppContext)

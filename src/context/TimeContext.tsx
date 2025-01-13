import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from './UserContext'

interface TimeContextType {
  currentTime: Date
  organHour: number
  biorhythm: {
    physical: number
    emotional: number
    intellectual: number
  }
}

const TimeContext = createContext<TimeContextType | undefined>(undefined)

export const useTime = () => {
  const context = useContext(TimeContext)
  if (!context) {
    throw new Error('useTime must be used within a TimeProvider')
  }
  return context
}

const calculateBiorhythm = (birthDate: Date, targetDate: Date) => {
  const days = Math.floor((targetDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))
  return {
    physical: Math.sin((2 * Math.PI * days) / 23),
    emotional: Math.sin((2 * Math.PI * days) / 28),
    intellectual: Math.sin((2 * Math.PI * days) / 33),
  }
}

export const TimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData } = useUser()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [organHour, setOrganHour] = useState(0)
  const [biorhythm, setBiorhythm] = useState({
    physical: 0,
    emotional: 0,
    intellectual: 0,
  })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now)
      
      // Calculate organ hour (TCM time)
      const hour = now.getHours()
      const tcmHour = Math.floor(((hour + 1) % 24) / 2)
      setOrganHour(tcmHour)
      
      // Calculate biorhythm only if we have user data
      if (userData?.birthDate) {
        const birthDate = new Date(userData.birthDate)
        setBiorhythm(calculateBiorhythm(birthDate, now))
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [userData?.birthDate]) // Re-run effect when birth date changes

  return (
    <TimeContext.Provider value={{ currentTime, organHour, biorhythm }}>
      {children}
    </TimeContext.Provider>
  )
}

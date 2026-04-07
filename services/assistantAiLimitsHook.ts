import { useEffect, useState } from 'react'
import {
  type AssistantAILimits,
  currentLimits,
  statusListeners,
} from './assistantAiLimits.js'

export function useAssistantAiLimits(): AssistantAILimits {
  const [limits, setLimits] = useState<AssistantAILimits>({ ...currentLimits })

  useEffect(() => {
    const listener = (newLimits: AssistantAILimits) => {
      setLimits({ ...newLimits })
    }
    statusListeners.add(listener)

    return () => {
      statusListeners.delete(listener)
    }
  }, [])

  return limits
}

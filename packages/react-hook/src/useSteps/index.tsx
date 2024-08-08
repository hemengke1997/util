import { useMemoizedFn } from 'ahooks'
import { useEffect, useState } from 'react'

/**
 * @description 在多个步骤中切换。如果当前步骤是最后一个步骤，则下一个步骤将是第一个步骤。
 * @param steps 步骤列表
 * @param defaultValue 默认步骤
 * @param onChange 步骤变化时的回调
 */
export default function useStep<T extends string>(
  steps: T[],
  {
    defaultValue,
    onChange,
  }: {
    defaultValue?: T
    onChange?: (step: T) => void
  },
) {
  const [currentStep, setCurrentStep] = useState(defaultValue || steps[0])

  const next = useMemoizedFn(() => {
    const currentIndex = steps.indexOf(currentStep)
    if (steps.length && currentIndex !== -1) {
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1])
      } else {
        setCurrentStep(steps[0])
      }
    }
  })

  useEffect(() => {
    onChange?.(currentStep)
  }, [currentStep, onChange])

  return [currentStep, next] as const
}

import React from 'react'

interface StepProps {
  title: string
  isActive?: boolean
  isCompleted?: boolean
}

interface StepsProps {
  currentStep: number
  children: React.ReactNode
  className?: string
}

export function Steps({ currentStep, children, className }: StepsProps) {
  const steps = React.Children.toArray(children) as React.ReactElement<StepProps>[]

  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <Step
            title={step.props.title}
            isActive={currentStep === index + 1}
            isCompleted={currentStep > index + 1}
          />
          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export function Step({ title, isActive, isCompleted }: StepProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : isCompleted
            ? 'bg-primary/20 text-primary'
            : 'bg-gray-200 text-gray-400'
        }`}
      >
        {isCompleted ? '✓' : ''}
      </div>
      <span className="mt-2 text-sm font-medium">{title}</span>
    </div>
  )
}


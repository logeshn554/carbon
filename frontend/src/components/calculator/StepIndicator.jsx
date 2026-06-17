export default function StepIndicator({ steps, currentStep }) {
  return (
    <nav aria-label="Form progress" className="mb-8">
      <ol className="flex items-center justify-between" role="list">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isActive = index === currentStep;

          return (
            <li key={step.id} className="flex items-center flex-1">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: isComplete
                      ? 'rgba(255,255,255,0.12)'
                      : isActive
                      ? '#FFFFFF'
                      : 'transparent',
                    border: isComplete
                      ? '1px solid rgba(255,255,255,0.25)'
                      : isActive
                      ? 'none'
                      : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: isActive ? '0 0 20px rgba(255,255,255,0.2)' : 'none',
                  }}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isComplete ? (
                    <span
                      className="text-xs font-bold"
                      style={{ color: 'rgba(255,255,255,0.6)' }}
                      aria-label="Completed"
                    >
                      ✓
                    </span>
                  ) : (
                    <span
                      className="text-xs font-bold font-mono"
                      style={{ color: isActive ? '#000' : 'rgba(255,255,255,0.2)' }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-center hidden sm:block">
                  <p
                    className="text-xs font-medium transition-colors"
                    style={{
                      color: isActive ? '#fff' : isComplete ? '#555' : '#333',
                    }}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs hidden md:block" style={{ color: '#333' }}>
                    {step.sublabel}
                  </p>
                </div>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-3 mt-0 sm:-mt-5">
                  <div
                    className="h-px transition-all duration-500 rounded-full"
                    style={{
                      background: index < currentStep
                        ? 'rgba(255,255,255,0.3)'
                        : 'rgba(255,255,255,0.07)',
                    }}
                    aria-hidden="true"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

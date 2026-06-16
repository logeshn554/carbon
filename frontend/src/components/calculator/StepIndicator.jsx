export default function StepIndicator({ steps, currentStep }) {
  return (
    <nav aria-label="Form progress" className="mb-8">
      <ol className="flex items-center justify-between" role="list">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isActive = index === currentStep;
          const stepNum = index + 1;

          return (
            <li key={step.id} className="flex items-center flex-1">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    transition-all duration-300
                    ${isComplete ? 'step-complete' : isActive ? 'step-active' : 'step-inactive'}
                  `}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isComplete ? (
                    <span aria-label="Completed" className="text-emerald-400">✓</span>
                  ) : (
                    <span className={isActive ? 'text-white' : 'text-slate-500'}>
                      {stepNum}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-center hidden sm:block">
                  <p className={`text-xs font-medium transition-colors ${isActive ? 'text-emerald-400' : isComplete ? 'text-slate-400' : 'text-slate-600'}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-slate-600 hidden md:block">{step.sublabel}</p>
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-3 mt-0 sm:-mt-5">
                  <div
                    className="h-0.5 transition-all duration-500 rounded-full"
                    style={{
                      background: index < currentStep
                        ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                        : 'rgba(255,255,255,0.08)',
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

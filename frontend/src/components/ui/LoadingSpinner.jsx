export default function LoadingSpinner({ size = 'md', className = '', label = 'Loading...' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  return (
    <div role="status" aria-label={label} className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} rounded-full animate-spin`}
        style={{
          borderColor: 'rgba(16, 185, 129, 0.2)',
          borderTopColor: '#10b981',
        }}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size="xl" />
      <p className="text-slate-400 animate-pulse">Loading...</p>
    </div>
  );
}

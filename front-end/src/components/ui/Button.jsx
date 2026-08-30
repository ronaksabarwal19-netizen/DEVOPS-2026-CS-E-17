const variants = {
  primary: 'bg-primary hover:bg-blue-600 text-white',
  outline: 'bg-transparent border border-border hover:bg-card text-text-secondary',
  ghost: 'bg-transparent hover:bg-card text-text-secondary',
  danger: 'bg-expense hover:bg-red-600 text-white',
};

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

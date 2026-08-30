export default function Input({ label, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-text-secondary">{label}</label>}
      <input
        className={`bg-bg border border-border rounded-lg px-3 py-2 text-text-primary placeholder:text-slate-500 focus:outline-none focus:border-primary ${className}`}
        {...props}
      />
    </div>
  );
}

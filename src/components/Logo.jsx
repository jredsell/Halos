export default function Logo({ className = "w-6 h-6", textClassName = "text-xl font-black tracking-widest text-white drop-shadow", showText = true }) {
  return (
    <div className="flex items-center gap-3">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" className="text-blue-500/20" fill="currentColor"/>
        <path d="M12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z" className="text-blue-500/50" />
        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" className="text-blue-500" />
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" className="text-blue-400" />
        <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" className="text-white" />
      </svg>
      {showText && (
        <span className={`${textClassName} flex items-baseline gap-3`}>
          HALOS
          <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest hidden md:inline-block truncate">
            - Church Presentation Software
          </span>
        </span>
      )}
    </div>
  );
}

import { cn } from '@/lib/utils'

interface PageHeroProps {
  eyebrow: string
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
  haloColor?: string
  /** Extra decorative elements rendered inside the wrapper (e.g., additional halos) */
  children?: React.ReactNode
}

export function PageHero({ eyebrow, title, description, className, haloColor, children }: PageHeroProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-[#C9A961]/20 bg-linear-to-br from-[#050B1A] via-[#0A1628] to-[#0F2959] px-8 py-12 md:py-14 text-white',
        className
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-px cmv-gold-line opacity-60" />
      <div className="absolute inset-0 cmv-pattern-grid opacity-20" />
      <div
        className="cmv-halo -top-20 -right-15 h-80 w-80"
        style={{
          background: haloColor
            ? `radial-gradient(circle, ${haloColor} 0%, transparent 70%)`
            : 'radial-gradient(circle, rgba(201,169,97,0.20) 0%, transparent 70%)',
        }}
      />
      {children}
      <div className="relative max-w-2xl">
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="h-px w-10 bg-[#C9A961]" />
          <span className="text-[11px] font-semibold tracking-[0.32em] text-[#E8D4A1] uppercase">
            {eyebrow}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15]">{title}</h1>
        {description && (
          <p className="mt-4 text-base text-slate-200/90 max-w-xl leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  )
}

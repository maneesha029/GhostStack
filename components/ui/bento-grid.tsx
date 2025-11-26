'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BentoGridProps {
  className?: string
  children?: ReactNode
}

interface BentoCardProps {
  className?: string
  name?: string
  description?: string
  header?: ReactNode
  icon?: ReactNode
  href?: string
  onClick?: () => void
  children?: ReactNode
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid w-full auto-rows-max grid-cols-1 gap-4 md:grid-cols-3',
        className
      )}
    >
      {children}
    </div>
  )
}

export function BentoCard({
  className,
  name,
  description,
  header,
  icon,
  href,
  onClick,
  children,
}: BentoCardProps) {
  const content = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-6 shadow-xl transition-all duration-300',
        'hover:border-purple-600/50 hover:shadow-purple-600/10',
        className
      )}
      onClick={onClick}
    >
      {header}
      <div className="relative z-10">
        {icon && (
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400">
            {icon}
          </div>
        )}
        {name && (
          <h3 className="mb-2 text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
            {name}
          </h3>
        )}
        {description && (
          <p className="text-sm text-gray-400 line-clamp-2">{description}</p>
        )}
        {children}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-600/0 via-purple-600/0 to-purple-600/10 opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  )

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    )
  }

  return content
}


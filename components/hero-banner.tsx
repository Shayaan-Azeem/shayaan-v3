import React from 'react'

interface HeroBannerProps {
  title: string
  subtitle?: string
  date?: string
  tags?: string[]
  backgroundImage: string
  className?: string
}

export default function HeroBanner({ 
  title, 
  subtitle, 
  date, 
  tags = [], 
  backgroundImage,
  className = ""
}: HeroBannerProps) {
  return (
    <div className={`relative h-[400px] overflow-hidden rounded-xl mb-8 ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={backgroundImage} 
          alt={title}
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 20%' }}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content Overlay */}
      <div className="relative h-full flex flex-col justify-between p-8">
        {/* Tags - Top Right */}
        {tags.length > 0 && (
          <div className="flex justify-end">
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Main Content - Bottom Left */}
        <div className="flex flex-col">
          {/* Date */}
          {date && (
            <div className="mb-4">
              <span className="text-white/80 text-sm font-medium tracking-wider">
                {new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }).toUpperCase()}
              </span>
            </div>
          )}
          
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 leading-tight">
            {title}
          </h1>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

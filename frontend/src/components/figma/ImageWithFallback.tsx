import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, ...rest } = props

  // Show placeholder immediately if no src provided
  const showPlaceholder = !src || didError

  return showPlaceholder ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={{ ...style, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
    >
      <img 
        src={ERROR_IMG_SRC} 
        alt="No image" 
        width="88"
        height="88"
        style={{ objectFit: 'contain', maxWidth: '50%', maxHeight: '50%' }}
        {...rest} 
        data-original-url={src} 
      />
    </div>
  ) : (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      style={{ ...style, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
      loading="lazy"
      decoding="async"
      {...rest} 
      onError={handleError} 
    />
  )
}

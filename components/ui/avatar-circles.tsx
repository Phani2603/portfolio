"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export interface Avatar {
  imageUrl: string
  profileUrl: string
}
interface AvatarCirclesProps {
  className?: string
  numPeople?: number
  avatarUrls: Avatar[]
}

// Try to detect whether an image is mostly light (white/bright)
// Returns true = mostly light, false = dark, null = unknown/couldn't detect
async function detectImageIsMostlyLight(src: string): Promise<boolean | null> {
  if (!src) return null
  return new Promise((resolve) => {
    try {
      const img = new Image()
      img.crossOrigin = "Anonymous"
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")
          if (!ctx) return resolve(null)
          const w = 32
          const h = 32
          canvas.width = w
          canvas.height = h
          ctx.drawImage(img, 0, 0, w, h)
          const data = ctx.getImageData(0, 0, w, h).data
          let total = 0
          let count = 0
          for (let i = 0; i < data.length; i += 4) {
            const a = data[i + 3]
            if (a === 0) continue // ignore fully transparent pixels
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]
            // luminance approximation
            const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
            total += lum
            count++
          }
          if (count === 0) return resolve(null)
          const avg = total / count
          // threshold: >200 is very light (close to white)
          resolve(avg > 200)
        } catch {
          resolve(null)
        }
      }
      img.onerror = () => resolve(null)
      img.src = src
    } catch {
      resolve(null)
    }
  })
}

export const AvatarCircles = ({
  numPeople,
  className,
  avatarUrls,
}: AvatarCirclesProps) => {
  const [lightMap, setLightMap] = useState<Record<string, boolean | null>>({})

  useEffect(() => {
    let mounted = true
    const runs: Promise<void>[] = []
    avatarUrls.forEach((a) => {
      const src = a.imageUrl
      const p = detectImageIsMostlyLight(src).then((res) => {
        if (!mounted) return
        setLightMap((s) => ({ ...s, [src]: res }))
      })
      runs.push(p)
    })
    return () => {
      mounted = false
    }
  }, [avatarUrls])

  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {avatarUrls.map((url, index) => {
        const isLight = lightMap[url.imageUrl]
        // choose badge/background based on detection
        const badgeClass = isLight === true
          ? "rounded-full bg-neutral-900 shadow-sm ring-1 ring-black/10"
          : isLight === false
          ? "rounded-full bg-white shadow-sm ring-1 ring-black/10"
          : // unknown: use subtle gray so white icons don't vanish
            "rounded-full bg-gray-100 shadow-sm ring-1 ring-black/5"

        const imgClass = isLight === true
          ? "h-9 w-9 rounded-full object-contain"
          : "h-9 w-9 rounded-full object-contain bg-white"

        return (
          <a
            key={index}
            href={url.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={badgeClass}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={index}
              className={imgClass}
              src={url.imageUrl}
              width={36}
              height={36}
              alt={`Avatar ${index + 1}`}
            />
          </a>
        )
      })}
      {(numPeople ?? 0) > 0 && (
        <a
          className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-center text-xs font-medium text-black shadow-sm hover:bg-gray-100"
          href=""
        >
          +{numPeople}
        </a>
      )}
    </div>
  )
}

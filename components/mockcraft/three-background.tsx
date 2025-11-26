'use client'

import { useEffect, useRef } from 'react'

export function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    let cleanup: (() => void) | undefined

    // Dynamic import to reduce bundle size
    import('three').then((THREE) => {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      camera.position.z = 5

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current!,
        antialias: true,
        alpha: true,
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)

      // Particles
      const geometry = new THREE.BufferGeometry()
      const vertices: number[] = []
      const colors: number[] = []
      const particleCount = 2000

      const colorPalette = [
        new THREE.Color(0x6366f1), // Indigo-500
        new THREE.Color(0xa855f7), // Purple-500
        new THREE.Color(0x06b6d4), // Cyan-500
        new THREE.Color(0x3b82f6), // Blue-500
        new THREE.Color(0x8b5cf6), // Violet-500
      ]

      for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 20
        const y = (Math.random() - 0.5) * 20
        const z = (Math.random() - 0.5) * 20
        vertices.push(x, y, z)

        const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)]
        colors.push(randomColor.r, randomColor.g, randomColor.b)
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

      const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      })

      const particles = new THREE.Points(geometry, material)
      scene.add(particles)

      let animationId: number
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        particles.rotation.x += 0.0005
        particles.rotation.y += 0.0008
        renderer.render(scene, camera)
      }

      animate()

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }

      window.addEventListener('resize', handleResize)

      cleanup = () => {
        window.removeEventListener('resize', handleResize)
        cancelAnimationFrame(animationId)
        renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    })

    return () => {
      cleanup?.()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: 'linear-gradient(135deg, #e0f2fe, #eef2ff, #f3e8ff)' }}
    />
  )
}


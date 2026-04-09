// Generates all PWA icons for SafetyCheck using the WWW brand.
// Requires: node scripts/generate-icons.js
// Output:   public/icons/*
'use strict'

const fs = require('fs')
const path = require('path')
const { createCanvas } = require('canvas')

const outDir = path.join(__dirname, '../public/icons')
fs.mkdirSync(outDir, { recursive: true })

const SIZES = [72, 96, 128, 144, 152, 180, 192, 384, 512]

function drawIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  const s = size
  const pad = Math.round(s * 0.08)
  const radius = Math.round(s * 0.22)

  // Background — blue gradient
  const grad = ctx.createLinearGradient(0, 0, 0, s)
  grad.addColorStop(0, '#2563eb')
  grad.addColorStop(1, '#1e40af')
  ctx.fillStyle = grad

  // Rounded rect
  ctx.beginPath()
  ctx.moveTo(radius, 0)
  ctx.lineTo(s - radius, 0)
  ctx.quadraticCurveTo(s, 0, s, radius)
  ctx.lineTo(s, s - radius)
  ctx.quadraticCurveTo(s, s, s - radius, s)
  ctx.lineTo(radius, s)
  ctx.quadraticCurveTo(0, s, 0, s - radius)
  ctx.lineTo(0, radius)
  ctx.quadraticCurveTo(0, 0, radius, 0)
  ctx.closePath()
  ctx.fill()

  // White circle background
  const cx = s / 2
  const cy = s / 2
  const circleR = s * 0.34
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.beginPath()
  ctx.arc(cx, cy, circleR, 0, Math.PI * 2)
  ctx.fill()

  // "WWW" text
  const fontSize = Math.round(s * 0.22)
  ctx.fillStyle = '#ffffff'
  ctx.font = `900 ${fontSize}px -apple-system, Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(0,0,0,0.2)'
  ctx.shadowBlur = Math.round(s * 0.04)
  ctx.fillText('WWW', cx, cy - s * 0.04)

  // "SafetyCheck" subtitle (only on larger icons)
  if (size >= 144) {
    const subSize = Math.round(s * 0.09)
    ctx.font = `600 ${subSize}px -apple-system, Arial, sans-serif`
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.shadowBlur = 0
    ctx.fillText('SafetyCheck', cx, cy + s * 0.22)
  }

  return canvas.toBuffer('image/png')
}

// Check if canvas package is available
try {
  require('canvas')
} catch (e) {
  console.error('❌  The "canvas" npm package is required: npm install --save-dev canvas')
  process.exit(1)
}

console.log('🎨 Generating icons...')
for (const size of SIZES) {
  const buf = drawIcon(size)
  const file = path.join(outDir, `icon-${size}x${size}.png`)
  fs.writeFileSync(file, buf)
  console.log(`   ✓ ${size}x${size}`)
}

// Also write root-level shortcuts for older manifest references
fs.copyFileSync(path.join(outDir, 'icon-192x192.png'), path.join(__dirname, '../public/icon-192x192.png'))
fs.copyFileSync(path.join(outDir, 'icon-512x512.png'), path.join(__dirname, '../public/icon-512x512.png'))
fs.copyFileSync(path.join(outDir, 'icon-180x180.png'), path.join(__dirname, '../public/apple-touch-icon.png'))

console.log('\n✅ Icons written to public/icons/ and public/')

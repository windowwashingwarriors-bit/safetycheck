// Generates all PWA icons for SafetyCheck using the real WWW Warriors logo.
// Requires: node scripts/generate-icons.js
// Source:   public/icons/www-logo.png
// Output:   public/icons/icon-*.png, public/apple-touch-icon.png
'use strict'

const fs = require('fs')
const path = require('path')

let createCanvas, loadImage
try {
  ;({ createCanvas, loadImage } = require('canvas'))
} catch (e) {
  console.error('❌  The "canvas" npm package is required: npm install --save-dev canvas')
  process.exit(1)
}

const outDir = path.join(__dirname, '../public/icons')
fs.mkdirSync(outDir, { recursive: true })

const SIZES = [72, 96, 128, 144, 152, 180, 192, 384, 512]
const logoPath = path.join(outDir, 'www-logo.png')

if (!fs.existsSync(logoPath)) {
  console.error('❌  Logo not found at public/icons/www-logo.png')
  process.exit(1)
}

async function main() {
  const logo = await loadImage(logoPath)

  console.log('🎨 Generating icons from www-logo.png...')

  for (const size of SIZES) {
    const canvas = createCanvas(size, size)
    const ctx = canvas.getContext('2d')

    // White background so logo triangle looks correct
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)

    // Draw logo centered, filling the full canvas
    ctx.drawImage(logo, 0, 0, size, size)

    const buf = canvas.toBuffer('image/png')
    const file = path.join(outDir, `icon-${size}x${size}.png`)
    fs.writeFileSync(file, buf)
    console.log(`   ✓ ${size}x${size}`)
  }

  // Root-level copies for manifest and iOS
  fs.copyFileSync(path.join(outDir, 'icon-192x192.png'), path.join(__dirname, '../public/icon-192x192.png'))
  fs.copyFileSync(path.join(outDir, 'icon-512x512.png'), path.join(__dirname, '../public/icon-512x512.png'))
  fs.copyFileSync(path.join(outDir, 'icon-180x180.png'), path.join(__dirname, '../public/apple-touch-icon.png'))

  console.log('\n✅ Icons written to public/icons/ and public/')
}

main().catch(err => {
  console.error('❌', err.message)
  process.exit(1)
})

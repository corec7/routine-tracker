import sharp from 'sharp'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'icons')

mkdirSync(outDir, { recursive: true })

// Progress ring + checkmark icon
// Ring: 75% filled arc, blue on dark gray circle
// Center: white checkmark
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#111111"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
  </defs>

  <!-- Outer rounded square -->
  <rect width="512" height="512" rx="108" fill="url(#bg)"/>

  <!-- Inner circle background -->
  <circle cx="256" cy="256" r="186" fill="#141820"/>

  <!-- Ring track -->
  <circle cx="256" cy="256" r="152" fill="none" stroke="#1e2433" stroke-width="26"/>

  <!-- Ring fill: 75% arc -->
  <!-- circumference = 2 * pi * 152 = 955.04, 75% = 716.28 -->
  <circle cx="256" cy="256" r="152" fill="none"
    stroke="url(#ring)" stroke-width="26" stroke-linecap="round"
    stroke-dasharray="716 956"
    transform="rotate(-90 256 256)"/>

  <!-- Ring end glow dot -->
  <circle cx="256" cy="408" r="16" fill="#60a5fa" opacity="0.4"/>

  <!-- Checkmark -->
  <path d="M 186 266 L 232 316 L 334 202"
    fill="none" stroke="#f0f4f8" stroke-width="30"
    stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

// Also update the favicon
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="r" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="#0a0a0a"/>
  <circle cx="32" cy="32" r="23" fill="#141820"/>
  <circle cx="32" cy="32" r="19" fill="none" stroke="#1e2433" stroke-width="3.2"/>
  <circle cx="32" cy="32" r="19" fill="none"
    stroke="url(#r)" stroke-width="3.2" stroke-linecap="round"
    stroke-dasharray="89.5 120"
    transform="rotate(-90 32 32)"/>
  <path d="M 23 33.2 L 29 39.5 L 42 25"
    fill="none" stroke="#f0f4f8" stroke-width="3.8"
    stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

const sizes = [192, 512]

for (const size of sizes) {
  const buf = await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toBuffer()
  const outPath = join(outDir, `icon-${size}.png`)
  writeFileSync(outPath, buf)
  console.log(`Generated ${outPath} (${buf.length} bytes)`)
}

// Write updated favicon
const faviconPath = join(__dirname, '..', 'public', 'favicon.svg')
writeFileSync(faviconPath, faviconSvg)
console.log(`Updated ${faviconPath}`)

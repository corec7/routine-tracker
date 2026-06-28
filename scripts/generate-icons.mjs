import sharp from 'sharp'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'icons')

mkdirSync(outDir, { recursive: true })

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#0a0a0a"/>
  <text x="256" y="370" font-size="320" text-anchor="middle" fill="#3b82f6" font-family="Arial, sans-serif" font-weight="bold">R</text>
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

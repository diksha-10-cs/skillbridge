import fs from 'fs'
import path from 'path'
import { Resvg } from '@resvg/resvg-js'

const diagramsDir = path.resolve('diagrams')
const targetFiles = process.argv.slice(2).length > 0 
  ? process.argv.slice(2)
  : fs.readdirSync(diagramsDir).filter(f => f.endsWith('.svg'))

console.log(`Processing SVG files:`, targetFiles)

for (const svgFile of targetFiles) {
  const svgName = svgFile.endsWith('.svg') ? svgFile : `${svgFile}.svg`
  const svgPath = path.join(diagramsDir, svgName)
  const pngPath = path.join(diagramsDir, svgName.replace('.svg', '.png'))
  
  if (!fs.existsSync(svgPath)) {
    console.log(`Skipping non-existent ${svgPath}`)
    continue
  }

  try {
    const svg = fs.readFileSync(svgPath, 'utf8')
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: 2000, // 2000px high-resolution print/viva ready
      },
      background: '#ffffff',
    })
    
    const pngData = resvg.render()
    const pngBuffer = pngData.asPng()
    
    fs.writeFileSync(pngPath, pngBuffer)
    console.log(`✅ Converted: ${svgName} -> ${path.basename(pngPath)} (${Math.round(pngBuffer.length / 1024)} KB)`)
  } catch (err) {
    console.error(`❌ Error converting ${svgName}:`, err.message)
  }
}

console.log('🎉 PNG conversion script completed!')

'use client'

import { useEffect, useState } from 'react'

// ── Config ──
const TARGET = 16
const RENDER = 1024
const ALPHA_MIN = 20
const PALETTE_K = 8

const EMOJIS = [
  '📚','✨','🏆','🥇','🥈','🥉','🎉','⚙️',
  '📄','🚀','🏳️','↩️','⏸️','▶️','✅','🕹️',
]
const NAMES: Record<string,string> = {
  '📚':'BOOK','✨':'STAR','🏆':'TROPHY','🥇':'MEDAL_1','🥈':'MEDAL_2','🥉':'MEDAL_3',
  '🎉':'CONFETTI','⚙️':'GEAR','📄':'DOC','🚀':'ROCKET','🏳️':'FLAG',
  '↩️':'ARROW_BACK','⏸️':'PAUSE','▶️':'PLAY','✅':'CHECK','🕹️':'JOYSTICK',
}

// ── K-Means palette extraction ──
type RGB = [number,number,number]

function rgbDist(a: RGB, b: RGB) { return (a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2 }

function extractPalette(pixels: RGB[], k: number): string[] {
  if (pixels.length <= k) return pixels.map(p => toHex(...p))
  const centroids: RGB[] = []
  const seen = new Set<number>()
  while (centroids.length < k) {
    const i = Math.floor(Math.random() * pixels.length)
    if (!seen.has(i)) { seen.add(i); centroids.push([...pixels[i]]) }
  }
  for (let iter = 0; iter < 12; iter++) {
    const clusters: RGB[][] = Array.from({length:k}, () => [])
    for (const p of pixels) {
      let best = 0, bestD = Infinity
      for (let c = 0; c < k; c++) { const d = rgbDist(p, centroids[c]); if (d < bestD) { bestD = d; best = c } }
      clusters[best].push(p)
    }
    for (let c = 0; c < k; c++) {
      if (!clusters[c].length) continue
      let sr=0,sg=0,sb=0
      for (const p of clusters[c]) { sr+=p[0]; sg+=p[1]; sb+=p[2] }
      const n = clusters[c].length
      centroids[c] = [sr/n, sg/n, sb/n]
    }
  }
  return centroids.map(c => toHex(...c))
}

function toHex(r: number, g: number, b: number) {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n)))
  return '#' + [c(r),c(g),c(b)].map(n => n.toString(16).padStart(2,'0')).join('')
}

function nearest(px: RGB, palette: string[]): string {
  const parsed = palette.map((h):RGB => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)])
  let best = palette[0], bestD = Infinity
  for (let i = 0; i < parsed.length; i++) { const d = rgbDist(px, parsed[i]); if (d < bestD) { bestD = d; best = palette[i] } }
  return best
}

// ── Sample one emoji ──
interface Sample { grid: string[][]; palette: string[] }

function sample(emoji: string): Sample {
  const c = document.createElement('canvas')
  c.width = RENDER; c.height = RENDER
  const ctx = c.getContext('2d')!

  ctx.clearRect(0,0,RENDER,RENDER)
  const fs = Math.round(RENDER * 0.80)
  ctx.font = `${fs}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(emoji, RENDER/2, RENDER*0.47)

  const img = ctx.getImageData(0,0,RENDER,RENDER)
  const d = img.data

  // Bounding box
  let x0=RENDER,y0=RENDER,x1=0,y1=0
  for (let y=0;y<RENDER;y++) for (let x=0;x<RENDER;x++) {
    if (d[(y*RENDER+x)*4+3] > ALPHA_MIN) { if(x<x0)x0=x; if(y<y0)y0=y; if(x>x1)x1=x; if(y>y1)y1=y }
  }
  if (x1<=x0||y1<=y0) { x0=0;y0=0;x1=RENDER-1;y1=RENDER-1 }

  // Square crop + 4% padding
  const w=x1-x0+1, h=y1-y0+1
  const sz = Math.max(w,h) * 1.08
  const cx=x0+w/2, cy=y0+h/2
  const sx=cx-sz/2, sy=cy-sz/2

  // Sample
  const pixels: RGB[] = []
  const raw: (RGB|null)[][] = []
  for (let gy=0;gy<TARGET;gy++) {
    const row: (RGB|null)[] = []
    for (let gx=0;gx<TARGET;gx++) {
      const bx=sx+(gx/TARGET)*sz, by=sy+(gy/TARGET)*sz
      const bex=sx+((gx+1)/TARGET)*sz, bey=sy+((gy+1)/TARGET)*sz
      let r=0,g=0,b=0,a=0,ct=0
      for (let py=Math.floor(by);py<Math.floor(bey);py++) {
        if(py<0||py>=RENDER) continue
        for (let px=Math.floor(bx);px<Math.floor(bex);px++) {
          if(px<0||px>=RENDER) continue
          const i=(py*RENDER+px)*4
          const alpha=d[i+3]
          if(alpha>ALPHA_MIN) { const f=alpha/255; r+=d[i]*f; g+=d[i+1]*f; b+=d[i+2]*f; a+=alpha; ct++ }
        }
      }
      if(ct>=2&&a/ct>ALPHA_MIN/2) {
        const avg:RGB = [Math.min(255,r/ct*(255/(a/ct))), Math.min(255,g/ct*(255/(a/ct))), Math.min(255,b/ct*(255/(a/ct)))]
        row.push(avg); pixels.push(avg)
      } else { row.push(null) }
    }
    raw.push(row)
  }

  const palette = extractPalette(pixels, PALETTE_K)
  const grid = raw.map(r => r.map(cell => cell ? nearest(cell, palette) : ''))
  return { grid, palette }
}

// ── SVG pixel renderer ──
function PixelSvg({ grid, size=40 }: { grid: string[][]; size?: number }) {
  const n = grid.length; const cs = 24/n
  const rects: React.ReactElement[] = []
  grid.forEach((row,y) => row.forEach((cell,x) => {
    if (!cell) return
    rects.push(<rect key={`${y}-${x}`} x={x*cs+.02} y={y*cs+.02} width={cs-.04} height={cs-.04} fill={cell} rx={.02*cs*3}/>)
  }))
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">{rects}</svg>
}

// ── Grid → code snippet ──
function gridToCode(grid: string[][]) {
  return '[\n' + grid.map(r => '  [' + r.map(c => c?`'${c}'`:"''").join(',') + ']').join(',\n') + '\n]'
}

// ── Page ──
export default function IconsPreviewPage() {
  const [results, setResults] = useState<Record<string,Sample>>({})
  const [selected, setSelected] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      const r: Record<string,Sample> = {}
      for (const e of EMOJIS) r[e] = sample(e)
      setResults(r); setDone(true)
    }, 50)
    return () => clearTimeout(t)
  }, [])

  const allCode = EMOJIS.map(e => `export const ${NAMES[e]||e} = ${gridToCode(results[e]?.grid||[])}`).join('\n\n')

  return (
    <main style={{minHeight:'100vh',background:'linear-gradient(180deg,#0F0D2E,#141236,#1A1548)',padding:'28px',color:'#F0EEFF'}}>
      <div style={{maxWidth:1100,margin:'0 auto'}}>
        <h1 style={{fontFamily:'Arial Black,Impact,sans-serif',fontSize:26,fontWeight:900,textAlign:'center',marginBottom:4}}>
          Emoji → {TARGET}×{TARGET} 多色像素采样
        </h1>
        <p style={{color:'#9996B0',fontSize:13,textAlign:'center',marginBottom:20}}>
          1024px 渲染 → 智能裁剪 → K-Means {PALETTE_K}色调色板 {done?'· ✅ 完成':'· ⏳ 采样中...'}
        </p>

        {done && (
          <div style={{textAlign:'center',marginBottom:20}}>
            <button onClick={() => navigator.clipboard.writeText(allCode)}
              style={{background:'linear-gradient(135deg,#4B3FD9,#3D32C7)',color:'#FFF',border:'none',borderRadius:8,padding:'10px 24px',fontWeight:700,fontSize:14,cursor:'pointer',boxShadow:'0 0 16px rgba(75,63,217,0.4)'}}>
              📋 导出全部 patterns.ts 代码
            </button>
          </div>
        )}

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:12}}>
          {EMOJIS.map(e => {
            const s = results[e]
            return (
              <div key={e} onClick={() => s && setSelected(selected===e?'':e)}
                style={{background:selected===e?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.04)',border:selected===e?'1px solid rgba(255,255,255,0.2)':'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:16,display:'flex',flexDirection:'column',alignItems:'center',gap:8,cursor:s?'pointer':'default',transition:'all .15s'}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <span style={{fontSize:28}}>{e}</span><span style={{color:'#666'}}>→</span>
                  {s ? <PixelSvg grid={s.grid} size={42}/> : <div style={{width:42,height:42}}/>}
                </div>
                <span style={{color:'#9996B0',fontSize:11}}>{NAMES[e]||e}</span>
                {s && <div style={{display:'flex',gap:3,flexWrap:'wrap',justifyContent:'center'}}>
                  {s.palette.slice(0,8).map(c => <span key={c} style={{width:10,height:10,background:c,borderRadius:2,border:'1px solid rgba(255,255,255,0.15)'}} title={c}/>)}
                </div>}
              </div>
            )
          })}
        </div>

        {selected && results[selected] && (
          <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:20,marginTop:24}}>
            <h3 style={{fontFamily:'Arial Black,sans-serif',fontSize:16,margin:'0 0 12px'}}>{NAMES[selected]} — {TARGET}×{TARGET} {results[selected].palette.length}色</h3>
            <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
              <div style={{display:'grid',gridTemplateColumns:`repeat(${TARGET},16px)`,gap:1,background:'rgba(255,255,255,0.03)',padding:4,borderRadius:6}}>
                {results[selected].grid.map((r,y)=>r.map((c,x)=><div key={`${y}-${x}`} style={{width:16,height:16,background:c||'transparent',borderRadius:2}}/>))}
              </div>
              <pre style={{color:'#9996B0',fontSize:10,lineHeight:1.3,margin:0,background:'rgba(0,0,0,0.3)',padding:12,borderRadius:8,overflow:'auto',maxHeight:400,flex:1}}>
                {gridToCode(results[selected].grid)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

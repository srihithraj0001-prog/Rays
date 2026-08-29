import React, {useEffect, useRef, useState} from 'react'
import pdfjsLib from 'pdfjs-dist'
import 'pdfjs-dist/web/pdf_viewer.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.min.js'

export default function PDFViewer({src}){
  const canvasRef = useRef(null)
  const [numPages,setNumPages] = useState(0)

  useEffect(()=>{
    if(!src) return
    const load = async ()=>{
      const loadingTask = pdfjsLib.getDocument(src)
      const pdf = await loadingTask.promise
      setNumPages(pdf.numPages)
      const page = await pdf.getPage(1)
      const viewport = page.getViewport({scale:1.2})
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width
      const renderContext = {canvasContext:context,viewport}
      await page.render(renderContext).promise
    }
    load().catch(err=> console.error(err))
  },[src])

  return (
    <div>
      <canvas ref={canvasRef} style={{border:'1px solid #ddd'}} />
      <div style={{marginTop:8,color:'var(--muted)'}}>Pages: {numPages}</div>
    </div>
  )
}

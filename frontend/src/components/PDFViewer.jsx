import React, { useEffect, useRef, useState } from 'react'
import pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.9.179/build/pdf.worker.min.js'

export default function PDFViewer({url}){
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let cancelled = false
    async function renderPDF(){
      setLoading(true)
      try{
        const loadingTask = pdfjsLib.getDocument(url)
        const pdf = await loadingTask.promise
        const page = await pdf.getPage(1)
        const viewport = page.getViewport({scale:1.2})
        const canvas = canvasRef.current
        canvas.height = viewport.height
        canvas.width = viewport.width
        const ctx = canvas.getContext('2d')
        const renderContext = { canvasContext: ctx, viewport }
        await page.render(renderContext).promise
      }catch(e){
        console.error('PDF render error',e)
      }finally{
        if(!cancelled) setLoading(false)
      }
    }
    renderPDF()
    return ()=>{ cancelled = true }
  },[url])

  return (
    <div className="pdf-viewer">
      {loading && <div>Loading PDF...</div>}
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}

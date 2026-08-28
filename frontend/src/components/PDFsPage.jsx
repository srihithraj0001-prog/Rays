import React from 'react'
import PDFs from './PDFsPage'

export default function PDFsPage(){
  const pdfs = require('../data/pdfs.json')
  return (
    <div>
      <h2>PDF Library</h2>
      <div className="pdf-grid">
        {pdfs.map((p,i)=> (
          <div key={i} className="pdf-card">
            <div className="pdf-title">{p.title}</div>
            <div>Subject: {p.subject}</div>
            <div>Source: <a href={p.sourceUrl} target="_blank">{p.source}</a></div>
            <a href={p.file} target="_blank">Open PDF</a>
          </div>
        ))}
      </div>
    </div>
  )
}

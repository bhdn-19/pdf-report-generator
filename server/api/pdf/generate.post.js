import puppeteer from 'puppeteer'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const html = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.5;
            padding: 24px;
            color: #111827;
          }

          h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 12px;
            color: #1f2937;
            text-align: center
          }

          p {
            font-size: 14px;
            margin-bottom: 24px;
            color: #4b5563;    
          }
        </style>
      </head>
      <body>
        <h1>${body.title}</h1>
        <p>${body.description}</p>
      </body>
    </html>
  `

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'networkidle0' })

  const pdfBuffer = await page.pdf({ format: body.pageSize, printBackground: true })
  await browser.close()

  setHeader(event, 'Content-Type', 'application/pdf')
  return pdfBuffer
})
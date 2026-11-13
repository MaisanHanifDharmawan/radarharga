import puppeteer from 'puppeteer-core'

const edge = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`
const browser = await puppeteer.launch({ executablePath: edge, headless: 'new', args: ['--disable-gpu', '--hide-scrollbars'] })
const page = await browser.newPage()
await page.setViewport({ width: 375, height: 2400 })
await page.goto('http://localhost:4273/', { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 1500))
await page.screenshot({ path: 'shots/home-375.png' })
await page.setViewport({ width: 768, height: 2600 })
await new Promise(r => setTimeout(r, 600))
await page.screenshot({ path: 'shots/home-768.png' })
await page.setViewport({ width: 1280, height: 3600 })
await new Promise(r => setTimeout(r, 600))
await page.screenshot({ path: 'shots/home-1280.png' })
await browser.close()
console.log('done')

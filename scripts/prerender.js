// Static site generation: put the rendered app HTML into www/index.html.
// Runs after `vite build` (client → www/) and `vite build --ssr` (server → dist-ssr/).
import fs from 'node:fs'

const htmlPath = 'www/index.html'
const serverEntry = new URL('../dist-ssr/entry-server.js', import.meta.url)

const { render } = await import(serverEntry.href)
const template = fs.readFileSync(htmlPath, 'utf-8')

if (!template.includes('<!--app-html-->')) {
  throw new Error(`${htmlPath} has no <!--app-html--> placeholder`)
}

fs.writeFileSync(htmlPath, template.replace('<!--app-html-->', render()))
fs.rmSync('dist-ssr', { recursive: true, force: true })

console.log(`Prerendered ${htmlPath}`)

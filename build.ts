import { build } from 'bun'

await build({
  entrypoints: ['./src/index.tsx'],
  outdir: './dist',
  target: 'browser',
  minify: true,
  sourcemap: 'external',
  define: {
    'import.meta.env.MODE': '\'production\'',
    'import.meta.env.BACK_END_URL': `'${process.env.BACK_END_URL}'`,
  },
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
  },
})

const html = await Bun.file('./src/index.html').text()
const updatedHtml = html.replace('./index.tsx', './index.js')

await Bun.write('./dist/index.html', updatedHtml)
await Bun.$`mkdir -p dist/assets && cp -R src/assets/* dist/assets/`

console.log('Build output created in \'dist\' folder')

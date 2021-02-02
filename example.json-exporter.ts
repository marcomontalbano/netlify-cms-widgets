import fs from 'fs'
import { getContent } from './packages/netlify-cms-json-exporter/src'

const content = getContent('./playground/config.yml', './content')

fs.writeFileSync('db.json', JSON.stringify(content, undefined, 2))

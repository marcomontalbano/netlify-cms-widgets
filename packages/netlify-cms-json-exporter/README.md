# Netlify CMS - JSON Exporter

[Netlify CMS](https://www.netlifycms.org/) stores the content in separate folders and files.
With `JSON Exporter` you can export all your Netlify CMS contents in a single json file with all relations resolved.

This can be useful if need to inject your content as `props` inside your components.

## Usage

```sh
# with yarn
yarn add -D netlify-cms-json-exporter

# with npm
npm install --save-dev netlify-cms-json-exporter
```

### Export as `db.json`

```ts
import fs from 'fs'
import { getContent } from 'netlify-cms-json-exporter'

const content = getContent('./public/admin/config.yml', './content')

fs.writeFileSync('db.json', JSON.stringify(content, undefined, 2))
```

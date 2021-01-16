import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

const camelCase = (string) => {
    return string.replace( /-([a-z])/ig, function( all, letter ) {
        return letter.toUpperCase();
    });
}

const createBundle = (packageName) => ({
    input: `./packages/${packageName}/index.tsx`,
    output: {
        file: `./dist/netlify-cms-widget-${packageName}.js`,
        format: 'iife',
        name: `marcomontalbano.netlifyCmsWidget${capitalize(camelCase(packageName))}`
    },
    plugins: [
        typescript(),
        nodeResolve()
    ]
})

export default [
    createBundle('id'),
    createBundle('secret'),
]
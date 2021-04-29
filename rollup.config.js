import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { execSync } from 'child_process';

const packagePrefix = 'netlify-cms-';

const camelCase = (string) => {
    return string.replace(/-([a-z])/gi, function (all, letter) {
        return letter.toUpperCase();
    });
};

const createOutput = (packageName, pathPrefix) => ({
    file: `${pathPrefix}/${packageName}.js`,
    format: 'iife',
    name: `marcomontalbano.${camelCase(packageName)}`,
});

const createBundle = (packageName) => ({
    input: `./packages/${packageName.replace(packagePrefix, '')}/index.tsx`,
    output: [
        createOutput(packageName, './dist'),
        createOutput(packageName, './playground/dist'),
    ],
    plugins: [typescript(), nodeResolve()],
});

const lernaLsOutput = execSync('./node_modules/.bin/lerna ls --json --all', {
    encoding: 'utf-8',
});

const packages = JSON.parse(lernaLsOutput);

export default packages
    .filter((pkg) => pkg.name.startsWith(packagePrefix))
    .map((pkg) => createBundle(pkg.name));

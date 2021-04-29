const fs = require('fs');
const { execSync } = require('child_process');

let readme = fs.readFileSync('README.md', 'utf-8');

const lernaLsOutput = execSync('./node_modules/.bin/lerna ls --json --all', {
    encoding: 'utf-8',
});

const packages = JSON.parse(lernaLsOutput);

console.group('Updated README.md');

packages.forEach((package) => {
    const regex = new RegExp(
        `\\/netlify-cms-widgets\\@[\\w\\.]+\\/dist\\/${package.name}\\.min\\.js`,
        'g'
    );

    if (!regex.test(readme)) {
        throw new Error(`"${package.name}" not found!`);
    }

    readme = readme.replace(
        regex,
        `/netlify-cms-widgets@${package.version}/dist/${package.name}.min.js`
    );

    console.log(`${package.name}@${package.version}`);
});

console.groupEnd('Updated README.md');

fs.writeFileSync('README.md', readme);

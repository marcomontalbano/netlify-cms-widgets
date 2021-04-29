const fs = require('fs');
const { exec } = require('child_process');

let readme = fs.readFileSync('README.md', 'utf-8');

exec('./node_modules/.bin/lerna ls --json --all', (error, stdout) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }

    const packages = JSON.parse(stdout);

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
});

const fs = require('fs');

const codeToObscure = /cycle.push\(cycle\[0\]\);(\s.*){5}/gim;
const problemFilePath = './node_modules/metro/src/lib/polyfills/require.js';
const problemFileContent = fs.readFileSync(problemFilePath, 'utf8');
fs.writeFileSync(
    problemFilePath,
    problemFileContent.replace(codeToObscure, '// no cycle warning removed by stfu.js script'),
    'utf8',
);
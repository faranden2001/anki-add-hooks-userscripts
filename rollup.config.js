import glob from 'glob';
import fs from 'fs';
import userScriptCss from 'rollup-plugin-userscript-css';
import alias from 'rollup-plugin-alias';
import path from 'path';


const getMetatagLinesFromFile = filePath => {
  const templateFileContent = fs.readFileSync(filePath, 'utf-8');
  const templateLines = templateFileContent.split(/[\n\r]+/);
  return templateLines.filter(text => /^\s*\/\/\s*@\w+\b/.test(text));
}

const createMetatags = entryFile => {
  let output = '// ==UserScript==\n';
  output += fs.readFileSync('./src/userscript_metatags.js', 'utf-8');
  output += getMetatagLinesFromFile(entryFile).join('\n') + '\n';
  output += '// ==/UserScript==\n'
  return output;
}


const makeConfig = (entryFile, entryFileIndex) => ({
  input: './src/template.js',
  output: {
    file: `./hooks/${path.basename(entryFile, '.js')}_hook.user.js`,
    name: 'AnkiAddHooks',
    format: 'iife',
    banner: createMetatags(entryFile),
  },
  plugins: [
    userScriptCss(),
    alias({
      __SITE_SPECIFIC_FUNCTIONS__: `${__dirname}/${entryFile}`,
    }),
  ],
});



export default glob.sync('./src/hooks/*.js').map(makeConfig);
#!/usr/bin/env tsx
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';
import { $, cd } from 'zx';

/**
 *
 * @param {URL} dir
 */
export async function cmd_wireify(dir) {
  cd(dir.pathname);
  await $`pnpm i wireit pnpm -D`;
  await $`sed '/wireit/d' ./.gitignore > ./.gitignore`;
  await $`echo '.wireit' >> ./.gitignore`;
  
  const package_json = new URL('./package.json', dir);
  console.log('at', package_json.href);
  await fs.access(package_json.pathname, fs.constants.R_OK | fs.constants.W_OK);
  // eslint-disable-next-line unicorn/prefer-json-parse-buffer
  const config = JSON.parse(
    await fs.readFile(package_json, { encoding: 'utf8' })
  );

  if (config.wireit) {
    console.log('Already Wireify');
  } else {
    let wireit = {};
    let scripts = {};
    for (const [key, cmd] of Object.entries(config.scripts)) {
      scripts[key] = 'wireit';
      wireit[key] = {
        command: cmd,
      };
    }
    config.scripts = scripts;
    config.wireit = wireit;
    config.packageManager = `pnpm@${config.devDependencies.pnpm
      .replace('~', '')
      .replace('^', '')}`;
    console.log({
      packageManager: config.packageManager,
      scripts: config.scripts,
      wireit: config.wireit,
    });
    await fs.writeFile(package_json, JSON.stringify(config, undefined, 2));
    console.log('DONE');
  }
}

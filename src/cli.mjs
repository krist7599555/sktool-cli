import inquirer from 'inquirer';
import * as fs from 'node:fs/promises';
import * as url from 'node:url';
import untildify from 'untildify';
import { cmd_wireify } from './cmd-wireify.mjs';
import { $, cd } from 'zx';

const CWD_DIR = url.pathToFileURL(process.cwd());
const ASSETS_DIR = new URL('../assets', import.meta.url);

const COMMANDS = /** @type {const} */ ([
  'eslint+prettier+vscode',
  'seo',
  'tailwind+postcss',
  'wireify',
  'krist7599555-lodosh',
  'icon'
]);

/**
 * @param {string} _dir
 * @returns string | true
 */
function resolve_path(_dir) {
  if (!_dir.endsWith('/')) _dir += '/';
  const dir = _dir.includes('~')
    ? url.pathToFileURL(untildify(_dir))
    : new URL(_dir, CWD_DIR);
  return dir;
}

/** @type {{target_directory: string, selected_commands: typeof COMMANDS[number][]}} */
const { target_directory, selected_commands } = await inquirer.prompt([
  {
    type: 'input',
    name: 'target_directory',
    default: process.cwd(),
    /**
     * @param {string} _dir
     * @returns string | true
     */
    async validate(_dir) {
      const dir = resolve_path(_dir);
      if (!(await fs.stat(dir)).isDirectory()) {
        return `directory ${dir.pathname} not exists`;
      }
      if (!(await fs.stat(new URL('./package.json', dir))).isFile()) {
        return `directory ${dir.pathname}/package.json not found`;
      }
      return true;
    },
  },
  {
    type: 'checkbox',
    name: 'selected_commands',
    message: 'Command To run',
    choices: COMMANDS,
    default: COMMANDS,
  },
]);

const project_dir = resolve_path(target_directory);

if (selected_commands.includes('wireify')) {
  await cmd_wireify(project_dir);
}

if (selected_commands.includes('eslint+prettier+vscode')) {
  cd(project_dir);
  await $`pnpm i -D eslint eslint-config-prettier eslint-define-config eslint-plugin-html eslint-plugin-json-format eslint-plugin-prettier eslint-plugin-simple-import-sort eslint-plugin-svelte eslint-plugin-tailwindcss eslint-plugin-unicorn prettier-plugin-svelte prettier-plugin-tailwindcss eslint-formatter-mo`
  console.log()
  console.log("  > SHOULD RUN", 'eslint . --color --format mo')
  console.log()
  await fs.copyFile(
    new URL('./.eslintrc.cjs', ASSETS_DIR),
    new URL('./.eslintrc.cjs', project_dir),
    fs.constants.COPYFILE_FICLONE_FORCE
  );
  await fs.copyFile(
    new URL('./.prettierrc.cjs', ASSETS_DIR),
    new URL('./.prettierrc.cjs', project_dir),
    fs.constants.COPYFILE_FICLONE_FORCE
  );
  fs.mkdir(new URL('./.vscode', project_dir), { recursive: true })
  await fs.copyFile(
    new URL('./settings.json', ASSETS_DIR),
    new URL('./.vscode/settings.json', project_dir),
    fs.constants.COPYFILE_FICLONE_FORCE
  );
}

if (selected_commands.includes('tailwind+postcss')) {
  cd(project_dir);
  await $`pnpm i -D tailwindcss postcss postcss-load-config autoprefixer @fontsource/noto-sans-thai @fontsource/noto-sans`
  await fs.copyFile(
    new URL('./tailwind.config.cjs', ASSETS_DIR),
    new URL('./tailwind.config.cjs', project_dir),
    fs.constants.COPYFILE_FICLONE_FORCE
  );
  await fs.copyFile(
    new URL('./postcss.config.cjs', ASSETS_DIR),
    new URL('./postcss.config.cjs', project_dir),
    fs.constants.COPYFILE_FICLONE_FORCE
  );
  await fs.mkdir(new URL('./.vscode', project_dir), { recursive: true })
  await fs.copyFile(
    new URL('./settings.json', ASSETS_DIR),
    new URL('./.vscode/settings.json', project_dir),
    fs.constants.COPYFILE_FICLONE_FORCE
  );
}

if (selected_commands.includes('seo')) {
  cd(project_dir);
  await $`pnpm i -D svelte-meta-tags`
  await $`sed '/env/d' ./.gitignore > ./.gitignore` // un ignore .env file
  await fs.mkdir(new URL('./src/lib', project_dir), { recursive: true })
  await fs.copyFile(
    new URL('./seo.svelte', ASSETS_DIR),
    new URL('./src/lib/seo.svelte', project_dir),
    fs.constants.COPYFILE_FICLONE_FORCE
  );
  await fs.copyFile(
    new URL('./.env', ASSETS_DIR),
    new URL('./.env', project_dir),
    fs.constants.COPYFILE_FICLONE_FORCE
  );
}

if (selected_commands.includes('krist7599555-lodosh')) {
  await $`pnpm i -D @krist7599555/lodosh`
}

if (selected_commands.includes('icon')) {
  await $`pnpm i -D @steeze-ui/svelte-icon @steeze-ui/lucide-icons @steeze-ui/heroicons`
}
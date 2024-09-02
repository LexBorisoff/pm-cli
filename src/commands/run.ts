import fs from 'node:fs';
import path from 'node:path';
import type { PackageJson } from 'type-fest';
import { prompts } from '@lexjs/cli-utils';
import { type ParsedArgs } from '../parse-args.js';
import { PackageManager } from '../enums/package-manager.enum.js';
import { operations } from '../operations.js';

function generateCommand(
  script: string,
  { flags, packageManager = PackageManager.NPM }: ParsedArgs,
): void {
  const { tmp } = operations;
  const pmFlags = flags.packageManager.join(' ');
  const passThrough = flags.passThrough.join(' ');

  let cmd = `${packageManager}`;

  if (packageManager === PackageManager.NPM) {
    cmd += ` run ${script}`;
    if (pmFlags !== '') {
      cmd += ` ${pmFlags}`;
    }
    if (passThrough !== '') {
      cmd += ` -- ${passThrough}`;
    }
  }

  if (
    packageManager === PackageManager.PNPM ||
    packageManager === PackageManager.BUN
  ) {
    if (pmFlags !== '') {
      cmd += ` ${pmFlags}`;
    }
    cmd += ` run ${script}`;
    if (passThrough !== '') {
      cmd += ` ${passThrough}`;
    }
  }

  if (packageManager === PackageManager.YARN) {
    cmd += ` ${script}`;
    if (passThrough !== '') {
      cmd += ` ${passThrough}`;
    }
  }

  tmp.cmd.write(cmd);
}

function getScripts(): PackageJson.Scripts {
  const filePath = path.resolve(process.cwd(), 'package.json');

  if (!fs.existsSync(filePath)) {
    throw new Error('No package.json in current directory');
  }

  const json = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  });

  try {
    const contents: PackageJson = JSON.parse(json);

    if (
      contents.scripts == null ||
      Object.keys(contents.scripts).length === 0
    ) {
      throw new Error('No scripts in package.json');
    }

    return contents.scripts;
  } catch {
    throw new Error('Error reading package.json');
  }
}

export default async function run(args: ParsedArgs, scriptName?: string) {
  const { values } = args;
  const scripts = getScripts();

  if (scriptName != null) {
    if (scripts[scriptName] == null) {
      throw new Error('No matching script');
    }

    generateCommand(scriptName, args);
    return;
  }

  const choices = Object.entries(scripts ?? {})
    .filter(
      ([key]) =>
        values.length === 0 || values.every((value) => key.includes(value)),
    )
    .map(([key, value]) => ({
      title: key,
      value: key,
      description: value,
    }));

  if (choices.length === 0) {
    throw new Error('No matching scripts');
  }

  // a single script was matched
  if (choices.length === 1) {
    const [script] = choices;
    generateCommand(script.value, args);
    return;
  }

  // an array of scripts was matched
  const { script } = await prompts.select({
    name: 'script',
    message: 'Select a script to run',
    choices,
  });

  if (script != null) {
    generateCommand(script, args);
  }
}

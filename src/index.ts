#!/usr/bin/env node

import { createLogger } from '@lexjs/cli-utils';
import parsedArgs from './parse-args.js';
import run from './commands/run.js';
import { Command } from './enums/command.enum.js';

const logger = createLogger();
const commands: string[] = Object.values(Command);

async function main() {
  try {
    const args = parsedArgs();
    const { command } = args;

    if (command === 'run') {
      await run(args);
      return;
    }

    if (!commands.includes(command)) {
      await run(args, command);
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
  }
}
main();

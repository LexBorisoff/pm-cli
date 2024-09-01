import { Command } from './enums/command.enum.js';
import { PackageManager } from './enums/package-manager.enum.js';

interface Flags {
  packageManager: string[];
  passThrough: string[];
}

export interface ParsedArgs {
  command: string;
  packageManager?: PackageManager;
  values: string[];
  flags: Flags;
}

function isValidPm(pm: string): pm is PackageManager {
  const validPms: string[] = Object.values(PackageManager);
  return validPms.includes(pm);
}

export default function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2);

  let command = args.at(0);
  let packageManager: PackageManager | undefined = undefined;

  if (command === Command.USING) {
    const pmArg = args.at(1);
    if (pmArg != null && !isValidPm(pmArg)) {
      throw new Error('Invalid package manager');
    }

    packageManager = pmArg;
    command = args.at(2) ?? command;
  }

  if (command == null) {
    throw new Error('Command must be provided');
  }

  const pmFlagsIndex = args.findIndex((arg) => arg.startsWith('--'));
  const passThroughFlagsIndex = args.findIndex((arg) => arg === '--');

  const pmFlags: string[] = [];
  const passThroughFlags: string[] = [];

  if (pmFlagsIndex >= 0) {
    pmFlags.push(
      ...args.slice(
        pmFlagsIndex,
        passThroughFlagsIndex >= 0 ? passThroughFlagsIndex : args.length,
      ),
    );
  }

  if (passThroughFlagsIndex >= 0) {
    passThroughFlags.push(...args.slice(passThroughFlagsIndex + 1));
  }

  const valuesStartIndex = packageManager != null ? 3 : 1;
  const valuesLastIndex =
    passThroughFlagsIndex >= 0 ? passThroughFlagsIndex + 1 : args.length;
  const valuesEndIndex = pmFlagsIndex >= 0 ? pmFlagsIndex : valuesLastIndex;

  return {
    command,
    packageManager,
    values: args.slice(valuesStartIndex, valuesEndIndex),
    flags: {
      packageManager: pmFlags,
      passThrough: passThroughFlags,
    },
  };
}

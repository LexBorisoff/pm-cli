import type { FileTree } from '@lexjs/core';
import { pm } from './scripts/pm.script.js';
import { source } from './scripts/source.script.js';

const { platform } = process;
const isWindows = platform === 'win32';

export const fileTree = {
  bin: {
    type: 'dir',
    children: {
      ['pm.sh']: {
        type: 'file',
        data: pm.sh,
      },
      ['pm.ps1']: {
        type: 'file',
        data: pm.ps1,
        skip: !isWindows,
      },
    },
  },
  etc: {
    type: 'dir',
    children: {
      ['source.sh']: {
        type: 'file',
        data: source.sh,
      },
      ['source.ps1']: {
        type: 'file',
        data: source.ps1,
        skip: !isWindows,
      },
    },
  },
  tmp: {
    type: 'dir',
    children: {
      cmd: {
        type: 'file',
      },
    },
  },
} satisfies FileTree;

import { createOperations } from '@lexjs/core';
import { fileTree } from './file-tree.js';
import { APP_NAME } from './constants.js';

export const operations = createOperations(APP_NAME, fileTree);

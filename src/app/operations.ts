import { createOperations } from '@lexjs/core';
import { APP_NAME } from '../constants.js';
import { fileTree } from './file-tree.js';

export const operations = createOperations(APP_NAME, fileTree);

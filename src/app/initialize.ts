#!/usr/bin/env node

import { initializeApp } from '@lexjs/core';
import { APP_NAME } from '../constants.js';
import { fileTree } from './file-tree.js';

if (process.env.npm_config_global === 'true') {
  const appName =
    process.env.NODE_ENV === 'development' ? `${APP_NAME}-test` : APP_NAME;
  initializeApp(appName, fileTree);
}

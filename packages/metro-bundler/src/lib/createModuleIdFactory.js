/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @format
 */

'use strict';
const crypto = require('crypto');

function createModuleIdFactory(projectRoots): ({path: string}) => number {
  const fileToIdMap = new Map();
  // let nextId = 0;
  const usedIds = {};
  return ({path: modulePath}) => {
    const relativePath = getRelativePath(projectRoots, modulePath);
    if (!fileToIdMap.has(modulePath)) {
      fileToIdMap.set(modulePath, getModuleHashedPathId(relativePath, usedIds));
      // nextId += 1;
    }
    return fileToIdMap.get(modulePath);
  };
}

function getRelativePath(projectRoots, modulePath) {
  const rex = new RegExp(projectRoots, 'g');
  return modulePath.replace(rex, '');
}

function getModuleHashedPathId(path, usedIds){
  var len = 4;
  var hash = crypto.createHash("md5");
  hash.update(path);
  let id = hash.digest("hex");
  while (usedIds[id.substr(0, len)]) {
    len++;
  }
  id = id.substr(0, len);
  usedIds[id] = path;
  id = parseInt(id, 16);
  return id;
}

module.exports = createModuleIdFactory;

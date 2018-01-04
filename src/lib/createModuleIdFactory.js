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

function createModuleIdFactory(projectRoots) {
  const fileToIdMap = new Map();
  // let nextId = 0;
  const usedIds = {};
  return (_ref) => {let modulePath = _ref.path;
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

function getModuleHashedPathId(path, usedIds) {
  var len = 4;
  var hash = crypto.createHash("md5");
  hash.update(path);
  let id = hash.digest("hex");
  while (usedIds[id.substr(0, len)]) {
    len++;
  }
  id = id.substr(0, len);
  id = parseInt(id, 16);
  id = getStr(id, usedIds);
  usedIds[id] = path;
  return id;
}

function getStr(nums, usedIds) {
  var testThree = /([0]){3}/;
  var testFour = /([0]){4}/;
  var strNum = JSON.stringify(nums)
  if(testThree.test(strNum)){
      nums = nums + 111;
  }
  if(testFour.test(strNum)){
      nums = nums + 1111;
  }
  while (usedIds[nums]){
    nums += 1;
  }
  return nums;
}
module.exports = createModuleIdFactory;
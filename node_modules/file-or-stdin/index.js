'use strict';

const readFile = require('graceful-fs').readFile;
const getStdin = require('get-stdin');
const inspectWithKind = require('inspect-with-kind');

module.exports = function fileOrStdin(filePath, options) {
  if (options !== undefined && typeof options !== 'object' && typeof options !== 'string') {
    return Promise.reject(new TypeError(`Expected an object or a string, but got ${
      inspectWithKind(options)
    }.`));
  }

  if (options === '') {
    return Promise.reject(new Error(
      'Expected a valid encoding (for example `utf8` and `base64`), but got \'\' (empty string).'
    ));
  }

  if (filePath) {
    return new Promise((resolve, reject) => {
      readFile(filePath, options, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data);
      });
    });
  }

  const encoding = typeof options === 'string' ? options : (options || {}).encoding;

  if (/^utf-?8$/i.test(encoding)) {
    return getStdin();
  }

  const promise = getStdin.buffer();

  if (encoding) {
    return promise.then(buf => buf.toString(encoding));
  }

  return promise;
};

JS Inliner
==========

Inline tiny JS files into your markup without doing something gnarly.

[![Build Status](https://travis-ci.org/tivac/node-js-inliner.png?branch=master)](https://travis-ci.org/tivac/node-js-inliner)
[![NPM version](https://badge.fury.io/js/node-js-inliner.png)](http://badge.fury.io/js/node-js-inliner)
[![Dependency Status](https://gemnasium.com/tivac/node-js-inliner.png)](https://gemnasium.com/tivac/node-js-inliner)

## Usage ##

```javascript
var inliner = require("js-inliner");

inliner(stream, { root : "/fooga/wooga", size : 1024 }, function(err, text) {
    if(err) {
        throw new Error(err);
    }
    
    console.log(text.toString());
});
```

## API ##

### inliner(stream, [options], cb)

* `stream` {Stream} Readable stream to parse
* `options` {Object}
* `cb` {Function}
  * `err` {Error | null}
  * `text` {Buffer} Rewritten text

#### Options

* `root` {String} location on disk to use as the root of URLs. Default is `process.cwd()`.
* `size` {Number} maximum size in bytes of files to inline. Default is `1024`.


## A Note on Versioning ##

This project's version number currently has a "0.x" prefix, indicating that it's a new
project under heavy development. **As long as the version number starts with
"0.x", minor revisions may introduce breaking changes.** You've been warned!

Once it reaches version 1.0.0, it will adhere strictly to
[SemVer 2.0](http://semver.org/spec/v2.0.0.html).

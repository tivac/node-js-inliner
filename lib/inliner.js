/*jshint node:true */

"use strict";

var fs = require("fs"),
    path = require("path"),
    
    trumpet = require("trumpet"),
    Uri     = require("jsuri"),
    async   = require("async"),
    concat  = require("concat-stream");

module.exports = function(files, options, done) {
    if(typeof options === "function") {
        done = options;
        options = {};
    }

    if(!Array.isArray(files)) {
        files = [ files ];
    }
    
    if(!options.root) {
        options.root = process.cwd();
    }
    
    async.map(
        files,
        function inliner(file, cb) {
            var tr = trumpet();

            tr.selectAll("script[src]", function(script) {
                script.getAttribute("src", function(src) {
                    var uri    = new Uri(src),
                       output, file;

                    // Handle cases like src="wooga.js" that jsuri mistakenly
                    // thinks is a host
                    if(uri.host() && uri.path()) {
                        return;
                    }

                    file = path.join(options.root, uri.path() || uri.host());
                    
                    // No non-existant files or fatties
                    if(!fs.existsSync(file) || fs.statSync(file).size > 1024) {
                        return;
                    }

                    script.removeAttribute("src");
                    output = script.createWriteStream();

                    fs.createReadStream(file, { encoding : "utf8" }).pipe(output);
                });
            });
            
            tr.pipe(concat(function concatDone(data) {
                cb(null, {
                    file : file,
                    data : data
                });
            }));

            fs.createReadStream(file).pipe(tr);
        },
        done
   );
};

/*jshint node:true */

"use strict";

var fs = require("fs"),
    path = require("path"),
    
    trumpet = require("trumpet"),
    Uri     = require("jsuri"),
    concat  = require("concat-stream");

module.exports = function(stream, options, done) {
    var tr = trumpet();
    
    if(typeof options === "function") {
        done = options;
        options = {};
    }
    
    // Provide this default up here because it's a function call
    if(!options.root) {
        options.root = process.cwd();
    }
    
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
            if(!fs.existsSync(file) || fs.statSync(file).size > (options.size || 1024)) {
                return;
            }

            script.removeAttribute("src");
            output = script.createWriteStream();

            fs.createReadStream(file, { encoding : "utf8" }).pipe(output);
        });
    });
    
    tr.pipe(concat(function concatDone(data) {
        done(null, data);
    }));

    stream.pipe(tr);
};

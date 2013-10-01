/*jshint node:true */

"use strict";

var fs = require("fs"),
    path = require("path"),
    
    trumpet = require("trumpet"),
    Uri     = require("jsuri"),
    slide   = require("slide"),

    _inliner;

_inliner = function(file, cb) {
    var tr = trumpet();

    // TODO: pipe to somewhere real, concat stream or a temp file?
    // TODO: figure out when things are actually done
    
    tr.pipe(process.stdout);

    tr.selectAll("script[src]", function(script) {
        script.getAttribute("src", function(src) {
            var uri    = new Uri(src),
                output, file;

            // Handle cases like src="wooga.js" that jsuri mistakenly
            // thinks is a host
            if(uri.host() && uri.path()) {
                return;
            }

            file = path.join(__dirname, root, uri.path() || uri.host());

            // No non-existant files or fatties
            if(!fs.existsSync(file) || fs.statSync(file).size > 1024) {
                return;
            }

            script.removeAttribute("src");
            output = script.createWriteStream();
            
            // Working
            //output.end("uri: " + file, "utf8");

            // we're done when the writable stream is done
            output.on("finish", cb);

            fs.createReadStream(file, { encoding : "utf8" }).pipe(output);
        });
    });

    fs.createReadStream(file).pipe(tr);
};

module.exports = function(files, options, done) {
    if(typeof options === "function") {
        done = options;
        options = {};
    }

    if(!Array.isArray(files)) {
        files = [ files ];
    }

    slide.asyncMap(files, _inliner, done);
};

/*
tr.pipe(process.stdout);

tr.selectAll("script[src]", function(script) {
    script.getAttribute("src", function(src) {
        var uri    = new Uri(src),
            output, file;

        // Handle cases like src="wooga.js" that jsuri mistakenly
        // thinks is a host
        if(uri.host() && uri.path()) {
            return;
        }

        file = path.join(__dirname, root, uri.path() || uri.host());

        // No non-existant files or fatties
        if(!fs.existsSync(file) || fs.statSync(file).size > 1024) {
            return;
        }

        script.removeAttribute("src");
        output = script.createWriteStream();
        
        // Working
        //output.end("uri: " + file, "utf8");

        fs.createReadStream(file, { encoding : "utf8" }).pipe(output);
    });
});

fs.createReadStream(__dirname + "/tests/specimens/test.ejs").pipe(tr);*/
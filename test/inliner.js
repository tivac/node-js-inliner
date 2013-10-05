/*jshint node:true */

"use strict";

var fs      = require("fs"),
    assert  = require("assert"),
    path    = require("path"),

    inliner = require("../lib/inliner");

describe("JS Inliner", function() {
    describe("Main Module", function() {
        it("should inline files in html", function(done) {
            var file   = "./test/specimens/test.html",
                stream = fs.createReadStream(file, { encoding : "utf8" }),
                root   = path.dirname(file);
            
            inliner(stream, { root : root }, function(err, results) {
                var js;
                
                assert.ifError(err);
                
                js = results.toString("utf8");
                
                assert(js.indexOf("src=\"wooga.js\"") === -1);
                assert(js.indexOf("src=\"/booga/fooga.js\"") === -1);
                
                assert(js.indexOf("<script >var wooga = \"I am wooga.js\";</script>") > -1);
                assert(js.indexOf("<script >var fooga = \"I am /booga/fooga.js\";</script>") > -1);
                assert(js.indexOf("<script src=\"biggun.js\"></script>") > -1);
                
                done();
            });
        });
        
        it("should inline files in ejs", function(done) {
            var file   = "./test/specimens/test.ejs",
                stream = fs.createReadStream(file, { encoding : "utf8" }),
                root   = path.dirname(file);
            
            inliner(stream, { root : root }, function(err, results) {
                var js;
                
                assert.ifError(err);
                
                js = results.toString("utf8");
                
                assert(js.indexOf("src=\"wooga.js\"") === -1);
                assert(js.indexOf("src=\"/booga/fooga.js\"") === -1);
                
                assert(js.indexOf("<script >var wooga = \"I am wooga.js\";</script>") > -1);
                assert(js.indexOf("<script >var fooga = \"I am /booga/fooga.js\";</script>") > -1);
                assert(js.indexOf("<script src=\"biggun.js\"></script>") > -1);
                
                done();
            });
        });
    });
});

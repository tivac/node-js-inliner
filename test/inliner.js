/*jshint node:true */

"use strict";

var assert  = require("assert"),
    path    = require("path"),

    inliner = require("../lib/inliner");

describe("JS Inliner", function() {
    describe("Main Module", function() {
        it("should something something something", function(done) {
            var file = "./test/specimens/test.ejs",
                root = path.dirname(file);
            
            inliner(file, { root : root }, function(err, results) {
                var js;
                
                assert.ifError(err);
                
                assert.equal(results.length, 1);
                assert.equal(results[0].file, file);
                
                js = results[0].data.toString("utf8");
                
                assert(js.indexOf("src=\"wooga.js\"") === -1);
                assert(js.indexOf("src=\"/booga/fooga.js\"") === -1);
                
                assert(js.indexOf("<script >var wooga = \"I am wooga.js\";</script>") > -1);
                assert(js.indexOf("<script >var fooga = \"I am /booga/fooga.js\";</script>") > -1);
                
                done();
            });
        });
    });
});

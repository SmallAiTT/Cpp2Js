/**
 * Created by small on 13-10-25.
 */

var path = require("path");
var fileParser = require("./h2Js.js");

var fileBlock = fileParser.parse(path.join(__dirname, "Test.h"));
console.log(fileBlock.toJs());
/**
 * Created by small on 13-10-23.
 */


var consts = require("./Consts.js");
var fs = require("fs");
var path = require("path");

var wordParser = {};
module.exports = wordParser;

wordParser.NODE_TYPE = {
    STRING : "string",
    COMMENT : "comment",
    STATEMENT_END : "statementEnd",
    BRACE_START : "braceStart",
    BRACE_END : "braceEnd",
    BRACKET_START : "bracketStart",
    BRACKET_END : "bracketEnd",
    PARENTHESIS_START : "parenthesisStart",
    PARENTHESIS_END : "parenthesisEnd",
    DEFINE : "define",
    WORD : "word",
    OPERATOR : "operator",
    ASSIGNMENT : "assignment",
    FILE_END : "fileEnd"
};

var nt = wordParser.NODE_TYPE;

var opers = ["+", "-", "*", "/", "%", "="];

function NodeInfo(value, type, index){
    this.value = value.trim();
    this.type = type;
    this.index = index;
}
wordParser.getWordNode = function(str, index){
    var store = "";
    var node = {value : "", type : "", index : index};
    var isAppendBlank = false;
    for(var i = index, li = str.length; i < li; i++){
        var curr = str[i];
        var next = i + 1 < li ? str[i+1] : null;
        if(store == "" && curr.search(/\s/) == 0) continue;
        else if(store == "" && curr == "/" && (next == "/" || next == "*")){
            store = curr + next;
            isAppendBlank = true;
            i++;
            continue;
        }else if(store.indexOf("/*") == 0){
            isAppendBlank = true;
            if(curr == "*" && next == "/"){
                var node = new NodeInfo(store + curr + next, nt.COMMENT, i+2);
                if(str.substring(index - 1, index) == ";" && str.substring(index, i - store.length).indexOf("\n") < 0){
                    node.isComment4Pre = true;
                }
                else if(str.substring(index - 1, index) == "{" && str.substring(index, i - store.length).indexOf("\n") < 0){
                    node.isComment4Pre = true;
                }
                return node;
            }
        }
        else if(store.indexOf("//") == 0){
            isAppendBlank = true;
            if(curr == "\n" || next == null){
                var node = new NodeInfo(store + curr, nt.COMMENT, Math.min(i + 1, str.length));
                if(str.substring(index - 1, index) == ";" && str.substring(index, i - store.length).indexOf("\n") < 0){
                    node.isComment4Pre = true;
                }
                else if(str.substring(index - 1, index) == "{" && str.substring(index, i - store.length).indexOf("\n") < 0){
                    node.isComment4Pre = true;
                }
                return node;
            }
        }else if(store.indexOf('"') == 0){
            isAppendBlank = true;
            if(curr == '"') return new NodeInfo(store + curr, nt.STRING, i+1);
        }else if((store.indexOf("/*") == 0 || store.indexOf('"') == 0) && next == null){
            console.log("error")
            console.log(store);
            return node.index = str.length;
        }else if(store == "" && curr == ";"){
            return new NodeInfo(curr, nt.STATEMENT_END, i+1);
        }else if(store == "" && curr == "{"){
            return new NodeInfo(curr, nt.BRACE_START, i+1);
        }else if(store == "" && curr == "}"){
            return new NodeInfo(curr, nt.BRACE_END, i+1);
        }else if(store == "" && curr == "["){
            return new NodeInfo(curr, nt.BRACKET_START, i+1);
        }else if(store == "" && curr == "]"){
            return new NodeInfo(curr, nt.BRACKET_END, i+1);
        }else if(store == "" && curr == "("){
            return new NodeInfo(curr, nt.PARENTHESIS_START, i+1);
        }else if(store == "" && curr == ")"){
            return new NodeInfo(curr, nt.PARENTHESIS_END, i+1);
        }else if(isHeadInArr(store, consts.DEFINE_ARR2)){
            if((curr == "\n" || next == null))
                return new NodeInfo(store + curr, nt.DEFINE, i+1);
            else {
                store += curr;
                continue;
            }
        }else if(consts.DEFINE_ARR.indexOf(store + curr) >= 0 ){
            if(next == null || next == "\n") return new NodeInfo(store + curr, nt.DEFINE, i+1);
            if(next.search(/\s/) == 0) {
                isAppendBlank = true;
                i++;
                store += curr + next;
                continue;
            }
        }else if((next == "=" && (curr.search(/[<>=]/) == 0)) || (curr == "<" && next == ">") ){
            return new NodeInfo(curr + next, nt.WORD, i + 2);
        }else if(curr.search(/[<>]/) == 0){
            return new NodeInfo(curr, nt.WORD, i + 1);
        }else if(curr == "="){
            return new NodeInfo(curr, nt.WORD, i+1);
        }else if(next == ";" ||
            next == "{" || next == "}"
            || next == "(" || next == ")"
            || next == "[" || next == "]"
            || opers.indexOf(next) >= 0){
            return new NodeInfo(store + curr, nt.WORD, i+1);
        }else if(curr.search(/\s/) == 0){
            return new NodeInfo(store, nt.WORD, i+1);
        }else if(next == null){
            return new NodeInfo(store + curr, nt.WORD, i+1);
        }

        if(curr.search(/\s/) != 0) store += curr;
        else if(isAppendBlank) store+=curr;
    }
    node.index = str.length;
    node.type = nt.WORD;
    return node;
}
function isHeadInArr(str, arr){
    for(var i = 0, li = arr.length; i < li; i++){
        var itemi = arr[i];
        if(str.indexOf(itemi) == 0) return true;
    }
    return false;
}

wordParser.getWordNodeArr = function(file){
    var content = fs.readFileSync(file).toString();
    var arr = [];
    var index = 0;
    while(index < content.length){
        var node = wordParser.getWordNode(content, index);
        index = node.index;
        arr.push(node);
    }
    return arr;
}

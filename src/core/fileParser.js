/**
 * Created by small on 13-10-24.
 */
var path = require("path");
var wordParser = require("./wordParser.js");

var fileParser = {};
module.exports = fileParser;


function WorldUnit(word){
    this.word = word;
    this.value = word.value;
    this.toJs = function(){
        return this.value + " ";
    }
}
function BlockUnit(){
    this.units = [];
    this.type = BlockUnit.TYPE_PARENTHESIS;
    this.addStatement = function(statement){
        this.units.push(statement);
    };
    this.toJs = function(){
        var start = "", end = "";
        if(this.type == BlockUnit.TYPE_PARENTHESIS){
            start = "(";
            end = ")";
        }else if(this.type == BlockUnit.TYPE_BRACKET){
            start = "[";
            end = "]";
        }
        var str = start;
        for(var i = 0, li = this.units.length; i < li; i++){
            var itemi = this.units[i];
            str += itemi.toJs();
        }
        str += end;
        return str;
    };
}
BlockUnit.TYPE_BRACE = "brace";
BlockUnit.TYPE_BRACKET = "bracket";
BlockUnit.TYPE_PARENTHESIS = "parenthesis";

function Statement(){
    this.comments = [];
    this.units = [];
    this.isPrintEnd = true;

    this.addWord = function(word){
        this.units.push(new WorldUnit(word));
    };
    this.addUnit = function(blockUnit){
        this.units.push(blockUnit);
    };
    this.addComment = function(comment){
        this.comments.push(comment);
    };

    this.toJs = function(){
        var str = "";
        for(var i = 0, li = this.comments.length; i < li; i++){
            var itemi = this.comments[i];
            str += itemi.value + "\r\n";
        }
        for(var i = 0, li = this.units.length; i < li; i++){
            var itemi = this.units[i];
            str += itemi.toJs();
        }
        if(this.isPrintEnd) str += ";";
        return str;
    };
};

function Block(){
    this.comments = [];
    this.statements = [];
    this.head = null;//这是个statement
    this.foot = null;//这是个statement
    this.toJs = function(){
        var str = "";
        if(this.head) {
            this.head.isPrintEnd = false;
            str += this.head.toJs();
        }
        str += "{\r\n";
        for(var i = 0, li = this.statements.length; i < li; i++){
            var itemi = this.statements[i];
            str += itemi.toJs() + "\r\n";
        }
        if(this.foot) {
            this.foot.isPrintEnd = false;
            str += this.foot.toJs();
        }
        str += "}\r\n";
        return str;
    };
}

function FileBlock(){
    this.statements = [];
    this.toJs = function(){
        var str = "";
        for(var i = 0, li = this.statements.length; i < li; i++){
            var itemi = this.statements[i];
            str += itemi.toJs() + "\r\n";
        }
        return str;
    };
}


fileParser.parse = function(file){
    var wordArr = wordParser.getWordNodeArr(file);
    var blockStack = [];
    var statementStack = [];
    var fileBlock = new FileBlock();
    var currBlock = fileBlock;
    var currStatement = new Statement();
    statementStack.push(currStatement);
    blockStack.push(currBlock);
    for(var i = 0, li = wordArr.length; i < li; i++){
        var node = wordArr[i];
        if(node.type == "define") continue;
        if(node.type == "comment") currStatement.addComment(node);
        else if(node.type == "word"){
            currStatement.addWord(node);
        }else if(node.type == "statementEnd"){
            if(currStatement.units.length == 0) continue;
            var nextNode = wordArr[i + 1];
            if(nextNode && nextNode.type == "comment" && nextNode.isComment4Pre){
                currStatement.addComment(wordArr[i + 1]);
                i++;
            }
            if(currBlock.statements) currBlock.statements.push(statementStack.pop());
            else currBlock.addStatement(statementStack.pop());
            currStatement = new Statement();
            statementStack.push(currStatement);
        }else if(node.type == "braceStart"){
            var nextNode = wordArr[i + 1];
            if(nextNode && nextNode.type == "comment" && nextNode.isComment4Pre){
                currStatement.addComment(wordArr[i + 1]);
                i++;
            }
            //end statement
            currBlock = new Block();
            currBlock.head = statementStack.pop();
            blockStack.push(currBlock);
            currStatement = new Statement();
            statementStack.push(currStatement);
        }else if(node.type == "braceEnd"){
            var tmp = blockStack.pop();
            currBlock = blockStack[blockStack.length - 1];
            currBlock.statements.push(tmp);
        }else if(node.type == "bracketStart"){
            currBlock = new BlockUnit();
            currBlock.type = BlockUnit.TYPE_BRACKET;
            blockStack.push(currBlock);
            currStatement = new Statement();
            statementStack.push(currStatement);
        }else if(node.type == "bracketEnd"){
            var tmp = statementStack.pop()
            tmp.isPrintEnd = false;
            currBlock.addStatement(tmp);
            currStatement = statementStack[statementStack.length - 1];
            currStatement.addUnit(blockStack.pop());
            currBlock = blockStack[blockStack.length - 1]
        }else if(node.type == "parenthesisStart"){
            currBlock = new BlockUnit();
            currBlock.type = BlockUnit.TYPE_PARENTHESIS;
            blockStack.push(currBlock);
            currStatement = new Statement();
            statementStack.push(currStatement);
        }else if(node.type == "parenthesisEnd"){
            var tmp = statementStack.pop()
            tmp.isPrintEnd = false;
            currBlock.addStatement(tmp);
            currStatement = statementStack[statementStack.length - 1];
            currStatement.addUnit(blockStack.pop());
            currBlock = blockStack[blockStack.length - 1]
        }else if(node.type == "fileEnd"){
            break;
        }else {
//        nodes.push(node);
        }
    }
    return fileBlock;
};
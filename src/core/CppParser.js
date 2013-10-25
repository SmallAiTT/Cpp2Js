/**
 * Created by small on 13-10-22.
 */

var consts = require("./Consts.js");

function Statement(){
    this.comments = [];
    this.worlds = [];
};

function invokeCb(parser, cb, world){
    cb(world);
    parser.state = null;
    parser.world = "";
    parser.doRightNow = false;
}

function defaultFilter(parser, curr, next, filters, index){
//    console.log("-----defaultFilter-----");
    if(curr.search(/\s/) == 0) return;
    if(curr == ";" || curr == "{"){
        parser.state = CppParser.STATE_STATEMENT_END;
        return;
    }
    parser.world += curr;
}

function strFilter(parser, curr, next, filters, index){
//    console.log("-----strFilter-----");
    if(curr == '"') {
        parser.state = CppParser.STATE_STR;
        return;
    }
    if(filters.length > index + 1) filters[index + 1](parser, curr, next, filters, index + 1);
}

function commentFilter(parser, curr, next, filters, index){
//    console.log("-----commentFilter-----");
    if(curr == "/"){
        if(next == "/") {
            parser.state = CppParser.STATE_COMMENT01;
            return;
        }else if(next == "*") {
            parser.state = CppParser.STATE_COMMENT02;
            return;
        }
    }
    if(filters.length > index + 1) filters[index + 1](parser, curr, next, filters, index + 1);
}

function worldFilter(parser, curr, next, filters, index){
//    console.log("-----worldFilter-----");
    if((parser.world == "" && curr.search(/[\(\)\[\]\,]/) == 0)){
        parser.world += curr;
        parser.state = CppParser.STATE_WORLD;
        return;
    }
    else if(curr.search(/\s/) != 0 && (next == null || next.search(/[\s\(\)\[\]\,]/) == 0)){
        parser.world += curr;
        parser.state = CppParser.STATE_WORLD;
        return;
    }
    if(filters.length > index + 1) filters[index + 1](parser, curr, next, filters, index + 1);
}

function defineFilter(parser, curr, next, filters, index){
//    console.log("-----includeFilter-----");
    if(curr == "#"){
        parser.state = CppParser.STATE_DEFINE_START;
        return;
    }
    if(filters.length > index + 1) filters[index + 1](parser, curr, next, filters, index + 1);
}

function CppParser(){

    this.state = null;
    this.world = "";
    this.content = null;

    this.comments = [];
    this.doRightNow = false;

    this._doWorldStart = function(curr, next){
        CppParser.filters[0](this, curr, next, CppParser.filters, 0);
    };

    this._doStr = function(curr, next, cb){
        if(this.world != "" && curr == '"') {
            this.world += curr;
            invokeCb(this, cb, this.world);
        }else{
            this.world += curr;
        }
    };

    this._doWorld = function(curr, next, cb){
        invokeCb(this, cb, this.world);
    };

    this._doComment1 = function(curr, next, cb){
        if((curr == "\r" && next == "\n") || curr == "\n"){
//            this.world += curr;
            this.comments.push(this.world);
            invokeCb(this, cb, this.world);
        }else{
            this.world += curr;
        }
    };
    this._doComment2 = function(curr, next, cb){
        if(curr == "/" && this.world.substring(this.world.length - 1) == "*" && this.world.length > 2){
            this.world += curr;
            this.comments.push(this.world);
            invokeCb(this, cb, this.world);
        }else{
            this.world += curr;
        }
    };

    this._doDefine = function(curr, next, cb){
        if((curr == "\r" && next == "\n") || curr == "\n"){
            invokeCb(this, cb, this.world);
        }else{
            this.world += curr;
        }
    };

    this._doDefineStart = function(curr, next, cb){
        this.world += curr;
        if(next == null || next.search(/\s/ == 0)){
            if(consts.DEFINE_ARR.indexOf(this.world)){
                this.state = CppParser.STATE_DEFINE;
                return;
            }else{
                invokeCb(this, cb, this.world);
            }
        }
    };

    this.parse = function(str, cb){
        this.content = str;
        for(var i = 0, li = str.length; i < li; i++){
            var curr = str.substring(i, i + 1);
            var next = li - 1 > i ? str.substring(i + 1, i + 2) : null;
            if(this.state == null){
                this._doWorldStart(curr, next);
            }
            if(this.state != null){
//                console.log("%%%%%%%%%" + this.state + "%%%%%%%")
                switch(this.state){
                    case CppParser.STATE_STR : this._doStr(curr, next, cb); break;
                    case CppParser.STATE_COMMENT01 : this._doComment1(curr, next, cb); break;
                    case CppParser.STATE_COMMENT02 : this._doComment2(curr, next, cb); break;
                    case CppParser.STATE_WORLD : this._doWorld(curr, next, cb); break;
                    case CppParser.STATE_DEFINE_START : this._doDefineStart(curr, next, cb); break;
                    case CppParser.STATE_DEFINE : this._doDefine(curr, next, cb); break;
                    default : ;
                }
            }
        }
    }
};
CppParser.STATE_STR = "str";
CppParser.STATE_COMMENT01 = "comment1";
CppParser.STATE_COMMENT02 = "comment2";
CppParser.STATE_WORLD = "world";
CppParser.STATE_STATEMENT_END = "statementEnd";
CppParser.STATE_DEFINE_START = "defineStart";
CppParser.STATE_DEFINE = "define";
CppParser.isDefinedStart = false;
CppParser.filters = [defineFilter, commentFilter, strFilter, worldFilter, defaultFilter];
CppParser.filters = [defineFilter, commentFilter, strFilter, worldFilter, defaultFilter];

var parser = new CppParser();
var fs = require("fs");
var path = require("path");
var content = fs.readFileSync(path.join(__dirname,"Test.h")).toString();
parser.parse(content, function(world){
    console.log(world);
});
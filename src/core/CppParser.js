/**
 * Created by small on 13-10-22.
 */

function invokeCb(parser, cb, world){
    cb(world);
    parser.state = null;
    parser.world = "";
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
        parser.world += curr;
        parser.state = CppParser.STATE_STR;
        return;
    }
    if(filters.length > index + 1) filters[index + 1](parser, curr, next, filters, index + 1);
}

function commentFilter(parser, curr, next, filters, index){
//    console.log("-----commentFilter-----");
    if(parser.wrold == "/"){
        if(curr == "/") {
            parser.state = CppParser.STATE_COMMENT01;
            return;
        }else if(curr == "*") {
            parser.state = CppParser.STATE_COMMENT01;
            return;
        }
    }
    if(filters.length > index + 1) filters[index + 1](parser, curr, next, filters, index + 1);
}

function worldFilter(parser, curr, next, filters, index){
//    console.log("-----worldFilter-----");
    if(next == null || next.search(/\s/) == 0){
        parser.world += curr;
        parser.state = CppParser.STATE_WORLD;
        return;
    }
    if(filters.length > index + 1) filters[index + 1](parser, curr, next, filters, index + 1);
}



function CppParser(){

    this.state = null;
    this.world = "";
    this.content = null;

    this._doStr = function(curr, next, cb){
        this.world += curr;
        if(curr == '"') {
            invokeCb(this, cb, this.world);
        }
    };

    this._doWorldStart = function(curr, next){
        CppParser.filters[0](this, curr, next, CppParser.filters, 0);
    };

    this._doWorld = function(str, next, cb){
        invokeCb(this, cb, this.world);
    };

    this._doComment = function(str, next, cb){};

    this.parse = function(str, cb){
        this.content = str;
        for(var i = 0, li = str.length; i < li; i++){
            var curr = str.substring(i, i + 1);
            var next = li - 1 > i ? str.substring(i + 1, i + 2) : null;
            if(this.state == null){
                this._doWorldStart(curr, next);
            }else{
                console.log("%%%%%%%%%" + this.state + "%%%%%%%")
                switch(this.state){
                    case CppParser.STATE_STR : this._doStr(curr, next, cb); break;
                    case CppParser.STATE_COMMENT01 : break;
                    case CppParser.STATE_COMMENT01 : break;
                    case CppParser.STATE_WORLD : this._doWorld(curr, next, cb); break;
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
CppParser.filters = [strFilter, commentFilter, worldFilter, defaultFilter];

var parser = new CppParser();
parser.parse('var a = "asdf fdas";', function(world){
    console.log(world);
});
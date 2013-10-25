/**
 * Created by small on 13-10-24.
 */

var content = fs.readFileSync(path.join(__dirname,"Test.h")).toString();
var index = 0;


var results = [];//结果
var fileBlock = new FileBlock();//当前块
var currBlock = fileBlock;
var stack = [currBlock];//栈
var nodesBuff = [];//当前的statement的节点缓存
var commentsBuff = [];//当前的statement的注释缓存

while(index < content.length){
    var node = getWordNode(content, index);
    index = node.index;
    if(node.type == "define") continue;
    if(node.type == "comment") commentsBuff.push(node);
    else if(node.type == "word"){
        nodesBuff.push(node);
    }else if(node.type == "statementEnd"){
        if(nodesBuff.length == 0) continue;
        var statement = new Statement();
        statement.comments = commentsBuff;
        statement.nodes = nodesBuff;
        commentsBuff = [];
        nodesBuff = [];
        currBlock.statements.push(statement);
    }else if(node.type == "blockStart"){
        var block = new Block();
        block.head = nodesBuff;
        block.comments = commentsBuff;
        commentsBuff = [];
        nodesBuff = [];
        currBlock.statements.push(block);
        stack.push(currBlock);
        currBlock = block;
    }else if(node.type == "blockEnd"){
        currBlock = stack.pop();
    }else if(node.type == "fileEnd"){
        break;
    }else {
//        nodes.push(node);
    }
}

function getClassJs(block){
    var head = block.head;
    if(head.length == 0 || head[0].value != "class") return null;
    var name = head[1].value;
    var flag = false;
    var parentClass = "cc.Class";
    for(var i = 2, li = head.length; i < li; i++){
        var itemi = head[i];
        if(flag) {
            parentClass = itemi.value;
            break;
        }
        if(itemi.value == ":"){
            flag = true;
        }
    }
    var str = "var " + name + " = " + parentClass + ".extend({\r\n";
    var statements = block.statements;
    for(var i = 0, li = statements.length; i < li; i++){
        var itemi = statements[i];
        str += itemi.toJs();
    }
    str += "});\r\n"
    return str;
}
function getMethodJs(block){

}

function Block(){
    this.head = [];
    this.foot = [];
    this.comments = [];
    this.statements = [];
    this.type = "";
    this.children = [];

    this.fmtArr = [getClassJs];

    this.toJs = function(){
        var commentsStr = "";
        for(var i = 0, li = this.comments.length; i < li; i++){
            var itemi = this.comments[i];
            commentsStr += itemi.value + "\r\n";
        }
        for(var i = 0, li = this.fmtArr.length; i < li; i++){
            var itemi = this.fmtArr[i];
            var str = itemi(this);
            if(str) return commentsStr + str;
        }
        return commentsStr;
    };
}

function Statement(){
    this.nodes = [];
    this.comments = [];
    this.type = "";
    this.toJs = function(){
        var str = "";
        for(var i = 0, li = this.nodes.length; i < li; i++){
            var itemi = this.nodes[i];
            str += itemi.value + " "
        }
        return str + ";\r\n";
    };
};
function FileBlock(){
    this.statements = [];
    this.toJs = function(){
        var str = "";
        for(var i = 0, li = this.statements.length; i < li; i++){
            var itemi = this.statements[i];
            str += itemi.toJs();
        }
        return str;
    };
};

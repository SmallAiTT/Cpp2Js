/**
 * Created by small on 13-10-22.
 */

var KW = {
    //bool、char、wchar_t、class、const、double、enum、float、int、long、short、signed、struct、union、unsigned、void、volatile
    type : {
        $bool : "bool", $char : "char", $wchar_t : "wchar_t", $class : "class",
        $const : "const", $double : "double", $enum : "enum", $float : "float",
        $int : "int", $long : "long", $short : "short", $struct : "struct",
        $union : "union", $unsigned : "unsigned", $void : "void", $volatile : "volatile"
    },
    //auto、extern、inline、register、static
    storeType : {
        $auto : "auto", $extern : "extern", $inline : "inline", $register : "register", $static : "static"
    },
    //friend、private、protected、public
    visitSymbol : {
        $friend : "friend", $private : "private", $protected : "protected", $public : "public"
    },
    //asm、operator、template、this、typedef、virtual
    otherSymbol : {
        $asm : "asm", $operator : "operator", $template : "template",
        $this : "this", $typedef : "typedef", $virtual : "virtual"
    },
    //break、case、catch、continue、default、do、else、for、goto、if、return、switch、throw、try、while
    punctuation : {
        $break : "break", $case : "case", $catch : "catch", $continue : "continue",
        $default : "default", $do : "do", $else : "else", $for : "for",
        $goto : "goto", $if : "if", $return : "return", $switch : "switch",
        $throw : "throw", $try : "try", $while : "while"
    },
    //delete、false、new、sizeof、true
    arithmetic : {
        $delete : "delete", $false : "false", $new : "new", $sizeof : "sizeof", $true : "true"
    }
    /**
     * VC++中还有一些专用的关键字，它们都以双下划线开头：
     _ _asm、_ _based、_ _cdecl、_ _emit、_ _export、_ _far、_ _fastcall、
     _ _fortran、_ _huge、_ _interrupt、_ _loadds、_multipile_inheritance、
     _ _near、_ _pascal、_ _saveregs、_ _segment、_ _signal_inheritance、
     _ _self、_ _stdcall、_ _virtual、_ _inheritance
     */
};
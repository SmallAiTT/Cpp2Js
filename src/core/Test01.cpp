//
//  Test01.cpp
//  MyTestCpp01
//
//  Created by SmallJun on 13-10-22.
//
//

#include "Test01.h"

#include <iostream.h>
using namespace std;
int max(int i, int j){      /*定义max()函数*/
    if (i>=j) return i;
    else      return j;
}

int main(void){                                                    /*定义main()函数*/
    cout<<"输入i,j：";                                            //显示提示信息
    int i, j;                                                                //说明变量
    cin>>i>>j;                                                         //从键盘上输入变量的值
    cout<<"最大数是："<<max(i, j)<<'\n';          //输出提示信息和结果
    for(int k = 0; k < j; ++k){
        cout<<"fff";
    }
    return 0;
}


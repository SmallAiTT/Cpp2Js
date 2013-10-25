//
//  ActivityRankTitleLayer.h
//  sanguo123
//
//  Created by 何 金 on 13-8-5.
//
//

#ifndef __sanguo123__ActivityRankTitleLayer__
#define __sanguo123__ActivityRankTitleLayer__

#include <iostream>
#include "cocos-ext.h"
#include "GameTableView.h"
#include "cocos2d.h"
USING_NS_CC;
USING_NS_CC_EXT;
class ActivityRankTitleLayer:public CCLayer
, public cocos2d::extension::CCTableViewDataSource
, public cocos2d::extension::CCTableViewDelegate
{
public:
    static ActivityRankTitleLayer *create(cocos2d::CCSize size,cocos2d::CCObject *pObj, cocos2d::SEL_CallFuncO fCallFuncO);
   bool initWithSize(cocos2d::CCSize size, cocos2d::CCObject *pObj, cocos2d::SEL_CallFuncO fCallFuncO);
    ActivityRankTitleLayer();
    ~ActivityRankTitleLayer();
    CCArray *dataArray;
    GameTableView *m_pTableView;
    virtual void scrollViewDidScroll(cocos2d::extension::CCScrollView* view) {};
	virtual void scrollViewDidZoom(cocos2d::extension::CCScrollView* view) {}
	virtual void tableCellTouched(cocos2d::extension::CCTableView* table, cocos2d::extension::CCTableViewCell* cell);
	virtual cocos2d::CCSize cellSizeForTable(cocos2d::extension::CCTableView *table);
	virtual cocos2d::extension::CCTableViewCell* tableCellAtIndex(cocos2d::extension::CCTableView *table, unsigned int idx);
	virtual unsigned int numberOfCellsInTableView(cocos2d::extension::CCTableView *table);
    void createTableView();
    cocos2d::CCObject *m_pTarget;
    cocos2d::SEL_CallFuncO m_fCallFuncO;
    int selectIndex;
    void onSelectIndex(int index);
    int getSelectIndex();
    CCSize m_size;
};

#endif /* defined(__sanguo123__ActivityRankTitleLayer__) */

//
//  ActivityRankTitleLayer.cpp
//  sanguo123
//
//  Created by 何 金 on 13-8-5.
//
//

#include "ActivityRankTitleLayer.h"
#include "ResourceConfig.h"
#include "CCStrokeLabel.h"
ActivityRankTitleLayer::ActivityRankTitleLayer()
{
    dataArray=NULL;
    m_pTableView=NULL;
    selectIndex=0;
}
ActivityRankTitleLayer::~ActivityRankTitleLayer()
{
    CC_SAFE_RELEASE_NULL(dataArray);
}
ActivityRankTitleLayer *ActivityRankTitleLayer::create(cocos2d::CCSize size, cocos2d::CCObject *pObj, cocos2d::SEL_CallFuncO fCallFuncO)
{
    ActivityRankTitleLayer *layer=new ActivityRankTitleLayer();
    if (layer&&layer->initWithSize(size, pObj, fCallFuncO)) {
        layer->autorelease();
        return layer;
    }
    CC_SAFE_DELETE(layer);
    return NULL;
}
bool ActivityRankTitleLayer::initWithSize(cocos2d::CCSize size, cocos2d::CCObject *pObj, cocos2d::SEL_CallFuncO fCallFuncO)
{
    m_pTarget=pObj;
    m_size=size;
    m_fCallFuncO=fCallFuncO;
    CCDictionary *rootDic=ResourceConfig::sharedConfig()->getDicWithConfigPath("rank_config.plist");
    if (rootDic) {
        dataArray=(CCArray *)rootDic->objectForKey("rankconfig");
        CC_SAFE_RETAIN(dataArray);
    }
    createTableView();
    return true;
}
void ActivityRankTitleLayer::createTableView()
{
    if (m_pTableView != NULL)
    {
        m_pTableView->removeFromParentAndCleanup(true);
        m_pTableView = NULL;
    }
    m_pTableView = GameTableView::create(this, m_size);
    m_pTableView->setDirection(kCCScrollViewDirectionHorizontal);
    m_pTableView->setPosition(ccp(0, 0));
    m_pTableView->setDelegate(this);
    
    addChild(m_pTableView);
    m_pTableView->reloadData();
}
void ActivityRankTitleLayer::tableCellTouched(cocos2d::extension::CCTableView* table, cocos2d::extension::CCTableViewCell* cell)
{
    if (m_pTarget&&m_fCallFuncO) {
        (m_pTarget->*m_fCallFuncO)(CCInteger::create(cell->getIdx()));
    }
    selectIndex=cell->getIdx();
    m_pTableView->reloadData();
    if (selectIndex!=0&&selectIndex!=dataArray->count()-1) {
        m_pTableView->setContentOffset(ccp(-100*selectIndex+100, 0));
    }
}
void ActivityRankTitleLayer::onSelectIndex(int index)
{
    selectIndex+=index;
    if (selectIndex<0) {
        selectIndex=0;
        return;
    }
    if(selectIndex>=dataArray->count())
    {
        selectIndex=dataArray->count()-1;
        return;
    }
    if (m_pTarget&&m_fCallFuncO) {
        (m_pTarget->*m_fCallFuncO)(CCInteger::create(selectIndex));
    }
    m_pTableView->reloadData();
    if (selectIndex!=0&&selectIndex!=dataArray->count()-1) {
        m_pTableView->setContentOffset(ccp(-100*selectIndex+100, 0));
    }

//    m_pTableView->showDirectionMoveAnima(index<0);

}
int ActivityRankTitleLayer::getSelectIndex()
{
    return selectIndex;
}
cocos2d::CCSize ActivityRankTitleLayer::cellSizeForTable(cocos2d::extension::CCTableView *table)
{
    return CCSizeMake(100, 60);
}
cocos2d::extension::CCTableViewCell* ActivityRankTitleLayer::tableCellAtIndex(cocos2d::extension::CCTableView *table, unsigned int idx)
{
    CCTableViewCell *cell = table->dequeueCell();
    CCString* labelString=(CCString *)dataArray->objectAtIndex(idx);
    if (cell==NULL) {
        cell = new CCTableViewCell();
        cell->autorelease();
        CCLabelTTF *label1=CCLabelTTF::create(labelString->getCString(), "arial", 20);
//        CCStrokeLabel *label;
        if (idx==selectIndex) {
            
            label1->setColor(ccc3(58, 19, 5));
            cell->setScale(1.2);
//            label1=CCStrokeLabel::createWithLabel(label1, 1, ccc3(91, 42, 7));
            label1->setTag(66);
            label1->setPosition(ccp(40, 25));

        }
        else
        {
            label1->setColor(ccc3(93, 65, 44));
            cell->setScale(1.0);
//            label=CCStrokeLabel::createWithLabel(label1, 1, ccc3(249, 245, 212));
            label1->setTag(66);
            label1->setPosition(ccp(40, 25));
        }
        cell->addChild(label1);
    }
    else
    {
        cell->removeAllChildren();
        CCLabelTTF *label1=CCLabelTTF::create(labelString->getCString(), "arial", 20);
        //        CCStrokeLabel *label;
        if (idx==selectIndex) {
            
            label1->setColor(ccc3(58, 19, 5));
            cell->setScale(1.2);
            //            label1=CCStrokeLabel::createWithLabel(label1, 1, ccc3(91, 42, 7));
            label1->setTag(66);
            label1->setPosition(ccp(40, 25));
            
        }
        else
        {
            label1->setColor(ccc3(93, 65, 44));
            cell->setScale(1.0);
            //            label=CCStrokeLabel::createWithLabel(label1, 1, ccc3(249, 245, 212));
            label1->setTag(66);
            label1->setPosition(ccp(40, 25));
        }
        cell->addChild(label1);
    }
	return cell;
}
unsigned int ActivityRankTitleLayer::numberOfCellsInTableView(cocos2d::extension::CCTableView *table)
{
    return dataArray->count();
}
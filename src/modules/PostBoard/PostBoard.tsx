import './PostBoard.css';
import React, { useState } from 'react';
import Select from 'react-select';

import ToggleButtonGroup from '../../components/ToggleButtonGroup';
import icon_angular from "../../assets/image-138.png";
import icon_angularx2 from "../../assets/image-138@2x.png";
import icon_angularx3 from "../../assets/image-138@3x.png";

import icon_react from "../../assets/image-140.png";
import icon_reactx2 from "../../assets/image-140@2x.png";
import icon_reactx3 from "../../assets/image-140@3x.png";
import icon_vue from "../../assets/image-141.png";
import icon_vuex2 from "../../assets/image-141@2x.png";
import icon_vuex3 from "../../assets/image-141@3x.png";


import Paginator from '../../components/Paginator';
import PostList from './components/PostList';

import { myAppState, myPostsManager } from './PostsManagerContext';

/**
 *  Array of options to be printed on the select topic filter
 */
const selectOptions = [
    {
        value: "angular", label: (<div style={{ display: 'flex', alignItems: 'center' }}>
            <img
                alt="angular"
                srcSet={`${icon_angular}, ${icon_angularx2} 2x, ${icon_angularx3} 3x`}
                src={icon_angular} />
            <span style={{ marginLeft: 13 }}>Angular</span>
        </div>)
    },
    {
        value: "reactjs", label: (<div style={{ display: 'flex', alignItems: 'center' }}>
            <img
                alt="react"
                srcSet={`${icon_react}, ${icon_reactx2} 2x, ${icon_reactx3} 3x`}
                src={icon_react} />
            <span style={{ marginLeft: 13 }}>Reacts</span>
        </div>)
    },
    {
        value: "vuejs", label: (<div style={{ display: 'flex', alignItems: 'center' }}>
            <img
                alt="vue"
                srcSet={`${icon_vue}, ${icon_vuex2} 2x, ${icon_vuex3} 3x`}
                src={icon_vue} />
            <span style={{ marginLeft: 13 }}>Vuejs</span>
        </div>)
    }];

/**
 *  dictionary with the two options of the views
 */
const ViewsTab = {
    ALL: "all",
    FAVS: "favs"
};


//////////////////////////////////-----------SETTING UP --------------////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////77
if (!myAppState.state.initiated) {
    myAppState.state.initiated = true;
    myAppState.state.selectedTopic = selectOptions[0].value;
    myAppState.state.selectedView = ViewsTab.ALL;
}

////////////////////////////////////////////////////////////////////////////////////////////
/**
 *  Setting up the post service with the stored filter
 */
myPostsManager.setQuery(myAppState.state.selectedTopic);
myPostsManager.setPage(myAppState.state.currentPage);
myPostsManager.infiniteScroll = myAppState.state.infiniteScroll;
//////////////////////////////////////////////////////////////
/**
 *  Method to request the post from postService
 */
function requestHits(): Promise<Array<any>> {
    myPostsManager.infiniteScroll = myAppState.state.infiniteScroll;
    myPostsManager.setQuery(myAppState.state.selectedTopic);
    myPostsManager.setPage(myAppState.state.currentPage);

    let promiseexecution;
    if (myAppState.state.selectedView === ViewsTab.ALL) {
        promiseexecution = myPostsManager.executeQuery();
    } else {
        promiseexecution = myPostsManager.getFromLocalStorage();
    }
    return promiseexecution;
}

requestHits();
//////////////////////////////////-----------HANDLERS --------------////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *  on language change from component , the new value will be store on the app state and localstorage
 * then will do a request for the new data
 * @param newTopic  
 */
function changeLanguageHandler(newTopic: string) {
    myAppState.state.selectedTopic = newTopic;
    myAppState.state.currentPage = 0;
    // STORE THIS STATE
    myAppState.store();
    requestHits()
}
//////////////////////////////////////////////////////////////////////////////////////
/**
 * on page change from components, the new value will be store on app state and localstorage
 * then will do a request for the new data
 * @param newPage 
 */
function changePage(newPage: number) {

    myAppState.state.currentPage = newPage;
    // STORE THIS STATE
    myAppState.store();
    // RETURN THIS TO USE FOR SOMETHING DOWN THE LINE
    return requestHits();
}
//////////////////////////////////////////////////////////////////////////////////////
/**
 * to toggle activation on infinite scroll
 * then will do a requst for the data because the data printend on the page will differ.
 * @param isInfinte 
 */
function changeInfiniteScroll(isInfinte: boolean) {
    myAppState.state.infiniteScroll = isInfinte;
    myAppState.store();
    requestHits();
}

/**
 * to change the current view (like a tab-view) , the new selectedview will be store on local
 *  then will do a request for the data.
 * @param newview
 */
function changeCurrentView(newview: string) {
    myAppState.state.selectedView = newview;
    myAppState.state.currentPage = 0;
    myAppState.store();
    myPostsManager.clear();
    requestHits();

}
/////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *  THIS WILL START THE SCROLL INFINITE HANDLER,
 *   Will go Up:prevPage or Down:nextPage. 
 *   
 */
const unbindLoopOnEnterFrame = ((function () {
    const scrollNode = window;
    /**
  * Util function to get the max posible scrollY
  * @returns maxPosibleScrollY
  */
    const getScrollMaxY = () => {

        return document.body.scrollHeight - window.innerHeight;
    };

    const getScrollY = function () {
        return scrollNode.scrollY;
    }
    const isEnable = function (): boolean {
        return myPostsManager.ready && myAppState.state.infiniteScroll
    }
    const getCurrentPage = function () {
        return myPostsManager.getPage()
    }
    const getMaxPages = function () {
        return myPostsManager.getMaxPages() - 1;//0 doesnt count
    }
    const updatePage = function (dir: number) {
        return changePage(getCurrentPage() + dir);
    }
    const goNextPage = function () {
        if (getCurrentPage() < getMaxPages()) {
            let storeMaxScroll = getScrollMaxY();
            updatePage(1).then(() => {

                // MOVE SCROLL UP
                setTimeout(() => {
                    // VALIDATE IF THE maScrollChange  
                    if (storeMaxScroll !== getScrollMaxY()) {
                        scrollNode.scrollTo(0, getScrollY() - 100);
                    }
                }, 100);

            })
        }
    };
    const goPrevPage = function () {

        if (getCurrentPage() > 0) {
            let storeMaxScroll = getScrollMaxY();
            updatePage(-1).then(() => {
                // MOVE SCROLL UP
                setTimeout(() => {
                    // VALIDATE IF THE maScrollChange 
                    if (storeMaxScroll !== getScrollMaxY()) {
                        scrollNode.scrollTo(0, 200);
                    }
                }, 100);

            })
        }
    };

    const validateMinScreen = function () {
        if (isEnable()) {
            // PAGE IS TOO SMALL
            if (getScrollMaxY() < 100) {
                if (getCurrentPage() < getMaxPages()) {
                    goNextPage();
                } else if (getCurrentPage() > 0) {
                    goPrevPage();
                }

            }
        }
    }
    const onEnterFrame = (callback: () => void) => {
        let activeloop = true;
        let step = () => {
            if (activeloop) {
                try {
                    callback();
                } catch (e) {
                    console.warn("onEnterFrame", e);
                }
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);

        return () => { activeloop = false; };
    }

    var lastScrollY = 0, scrollDirection = "";
    return onEnterFrame(() => {
        if (isEnable()) {
            let maxScrollY = getScrollMaxY();
            let scrollY = getScrollY();
            validateMinScreen();
            if (lastScrollY !== scrollY) {
                scrollDirection = lastScrollY < scrollY ? "down" : "up";
                lastScrollY = scrollY;
                if (scrollDirection === "down" && lastScrollY >= (maxScrollY)) {
                    goNextPage();
                } else if (scrollDirection === "up" && lastScrollY <= 100) {
                    goPrevPage();
                }
            }
        }
    });


})());

//////////////////////////////////-----------COMPONENTS --------------////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *  Component to select the filter option
 *   
 *  this 
 * @returns 
 */
function SelectTopic() {
    const [selectedTopic, setTopic] = useState(myAppState.state.selectedTopic);
    const [isvisible, setVisible] = useState(myAppState.state.selectedView === ViewsTab.ALL);
    const currentValue = selectOptions.filter((option) => option.value === selectedTopic)[0];
    const triggerPageChange = React.useCallback(() => {
        setVisible(myAppState.state.selectedView === ViewsTab.ALL);
    }, []);

    React.useEffect(() => {
        return myAppState.listenOnStore(triggerPageChange);
    }, [triggerPageChange]);
    return (<div>{isvisible ?
        <div className='select-lang-wrapper'>
            <Select
                placeholder="Select Your News"
                value={currentValue}
                options={selectOptions}
                onChange={(selectedOption) => {
                    if (selectedOption) {
                        changeLanguageHandler(selectedOption.value);
                        setTopic(selectedOption.value);
                    }
                }}
                components={{
                    IndicatorSeparator: () => null
                  }}
                ></Select>
        </div> : null
    }</div>);

}
//////////////////////////////////////////////////////////////////////////////
/**
 *  COMPONENT FOR PAGINATE WITH PAGES NUMBERS
 * @returns 
 */
function BoardPaginatorCom() {
    const [selectedPage, setPage] = useState(myPostsManager.getPage());
    const [maxPages, setMaxPage] = useState(myPostsManager.getMaxPages());
    const triggerPageChange = React.useCallback(() => {
        setPage(myPostsManager.getPage());
        setMaxPage(myPostsManager.getMaxPages());
    }, []);
    React.useEffect(() => {
        let unbindPageChange = myPostsManager.listenToPageChange(triggerPageChange)
        let unbindDataChange = myPostsManager.listenToDataChange(triggerPageChange)
        return () => {
            unbindPageChange();
            unbindDataChange();
        };
    }, [triggerPageChange]);

    const onChangePage = (value: number) => {
        changePage(value - 1);
        setPage(value - 1);
    };

    return <Paginator max={Math.max(1, maxPages)} selected={Math.min(maxPages, selectedPage + 1)} onchange={(num: number) => onChangePage(num)}></Paginator>
}


//////////////////////////////////////////////////////////////////////////////
/**
 *  Component for toggle the Infinite Scrolll
 * @returns 
 */
function InfiniteScrollToggleCom() {
    const [checked, toggle] = useState(myAppState.state.infiniteScroll);
    const changePaginationType = (isInfinte: boolean) => {
        changeInfiniteScroll(isInfinte);
        toggle(isInfinte);
    };
    return (
        <div  >
            <label>Infinite Scroll <input type="checkbox" checked={checked} onChange={(e) => {
                changePaginationType(e.target.checked);
            }} /></label>
        </div>)
}


//////////////////////////////////////////////////////////////////////////////
/** 
 *  Component for switch the view from All to Favorites. 
 * @returns 
 */
function SwitchViewCom() {
    const [currentView, setView] = useState(myAppState.state.selectedView);
    const changeView = (value: string) => {
        changeCurrentView(value);
        setView(value);
    };
    return <div>
        <ToggleButtonGroup selected={currentView} onchange={(value: string) => changeView(value)}>
            <button value={ViewsTab.ALL}>All</button>
            <option value={ViewsTab.FAVS}>My Favs</option>
        </ToggleButtonGroup>
    </div>
}


/**
 *  Component for visual progress to determinate if is loading the data.
 * (Nithel: i know no rquested for the test, but the visual feedback is helpfull)
 * @returns 
 */
function ProgressBarCom() {
    const [state_ready, change_state_ready] = useState(myPostsManager.ready);
    const triggerChange = React.useCallback(() => change_state_ready(myPostsManager.ready), []);
    React.useEffect(() => {
        return myPostsManager.listenToReadyChange(triggerChange);
    }, [triggerChange]);
    return <div style={{ width: "100%", position: "fixed", bottom: 0, left: 0, zIndex: 100 }}>
        <div className="progress" style={{ display: state_ready ? "none" : "" }} >
            <div className='bar'></div>
        </div></div>;
}


/////////////////////////////////////////////
export default class PostBoard extends React.Component {

    componentWillUnmount() {
        // LETS UNBIND THE ON ENTERFRAME LISTENER.
        unbindLoopOnEnterFrame();
    }

    render() {
        return (<div>
            <div className='full-width-row vhalign'>
                <SwitchViewCom></SwitchViewCom>
            </div>

            <div className='full-width-row select-lang-row valign' >
                <SelectTopic></SelectTopic>
                <div> <InfiniteScrollToggleCom /> </div>

            </div>
            <div className='full-width-row '>
                <PostList />
            </div>
            <div className='full-width-row vhalign ' style={{ paddingTop: 100 }}>
                <BoardPaginatorCom />
            </div>

            <ProgressBarCom />

        </div >);
    }

}
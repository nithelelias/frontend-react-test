import React, { useRef, useState } from "react";
import PostType from "../PostType";
import { myPostsManager } from '../PostsManagerContext';
import PostCom from "./PostCom";

///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
/**
 *  Component when there is no data found. (Nithel: i know no rquested for the test, but the visual feedback is helpfull)
 * @returns 
 */
function NoDataFoundCom() {
    const [state_ready, change_state_ready] = useState(myPostsManager.ready);
    const triggerChange = React.useCallback(() => change_state_ready(myPostsManager.ready), []);
    React.useEffect(() => {
        return myPostsManager.listenToReadyChange(triggerChange);
    }, [triggerChange]);
    return <span> {state_ready ? "No post found" : "Loading..."}</span>
}
///////////////////////////////////////////////////////////////////////////////////////
/**
 *  Component to list the diferent Post using the current post Manager list.
 * @returns 
 */
function PostList() {
    const [list, updatePostList] = useState(myPostsManager.getPostList());
    const triggerChange = React.useCallback(() => updatePostList(myPostsManager.getPostList()), []);
   
    React.useEffect(() => {
        return myPostsManager.listenToDataChange(triggerChange);
    }, [triggerChange]);

    if (list.length === 0) {
        return <div className='full-width center text-muted'>
            <NoDataFoundCom  ></NoDataFoundCom>
        </div>
    }
    return (<div>
        {list.map((post: PostType, index: number) => {
            return <PostCom key={index} post={post} />;
        })} </div>);
}

export default PostList;
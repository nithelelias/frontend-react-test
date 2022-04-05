
import React, { useRef, useState } from "react";
import PostType from "../PostType";

import icon_time from "../../../assets/iconmonstr-time-2.png";
import icon_time2x from "../../../assets/iconmonstr-time-2@2x.png";
import icon_time3x from "../../../assets/iconmonstr-time-2@3x.png";
import icon_heart from "../../../assets/iconmonstr-favorite-3.png";
import icon_heart2x from "../../../assets/iconmonstr-favorite-3@2x.png";
import icon_heart3x from "../../../assets/iconmonstr-favorite-3@3x.png";
import icon_hole_heart from "../../../assets/iconmonstr-favorite-2.png";
import icon_hole_heart2x from "../../../assets/iconmonstr-favorite-2@2x.png";
import icon_hole_heart3x from "../../../assets/iconmonstr-favorite-2@3x.png";
import moment from "moment";
import { myPostsManager } from '../PostsManagerContext';

//////////////////////////////////////////////////////////////
///.. ISO8601 
const EXPECTED_FORMAT = "YYYY-MM-DDTHH:mm:ssZ";
//////////////////////////////////////////////////////////////

/**
 *  Component for print the each item of the post list.
 * @param param = { } 
 * @returns 
 */
export default function PostCom({ post }: { post: PostType; }) {
    // FOR THIS CASE I WILL USE THE DIRTY  = is a dirty call to force the update 
    //   Because the fav state of this item post could be used for another item post messing up of the correct "is favorite state"
    const [dirty, triggerDirty] = useState(1);
    // CALCULATE HOW OLD IS THIS POST.
    const createdAgo = (() => {
        try {
            return moment(post.created_at, EXPECTED_FORMAT).fromNow();
        } catch (e) {
            // created date not parseable
            console.warn("PostCom: created date not parseable", e)
        }
    })();
    // to store the reference of the "favorite click" dom  when printend 
    const favEl = useRef(null);
    //  handler the favorite click
    const toggleFav = () => {
        myPostsManager.toggleFav(post);
        // Force THIS 
        triggerDirty(dirty + 1)
    };
    const openStoryLink = () => {
        window.open(post.story_url, "_blank");
    };

    return <div className='post-card  pointer' onClick={(e) => {
        if (favEl !== null && favEl.current !== null && (e.target !== favEl.current && !(favEl.current as HTMLElement).contains(e.target as HTMLElement))) {
            openStoryLink();
        }
    }}>
        <div className='left-side valign animated fadeIn'>
            <div className='full-width'>
                <div className='full-width valign' style={{ height: "1rem", marginBottom: 6 }}>
                    <img
                        alt="Time"
                        srcSet={`${icon_time}, ${icon_time2x} 2x, ${icon_time3x} 3x`}
                        src={icon_time}
                    />  <span className='created-ago-text'>{createdAgo} by {post.author} </span>

                </div>
                <div className='message-text'> {post.story_title}</div>
            </div>
        </div>
        <div className='right-side favorite-side vhalign animated fadeIn' ref={favEl} onClick={() => toggleFav()}>
            <div className='pointer' >
                {myPostsManager.isFav(post.appID) ?
                    <img src={icon_heart} srcSet={`${icon_heart}, ${icon_heart2x} 2x, ${icon_heart3x} 3x`} alt='with Heart' />
                    : <img src={icon_hole_heart} srcSet={`${icon_hole_heart}, ${icon_hole_heart2x} 2x, ${icon_hole_heart3x} 3x`} alt='No Heart' />
                }
            </div>
        </div>
    </div>;
};
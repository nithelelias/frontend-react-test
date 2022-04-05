import React from "react";

import img_title from "../assets/hacker-news.png";
import img_title_2x from "../assets/hacker-news@2x.png";
import img_title_3x from "../assets/hacker-news@3x.png";

/**
 *  App Header Component
 *   show a simple image using
 * @returns 
 */
export default function AppHeaderCom() {
    
    return <div className="app-header">
        <img
            alt="hacker news"
            srcSet={`${img_title}, ${img_title_2x} 2x, ${img_title_3x} 3x`}
            src={img_title}
            className="app-title" />

    </div>
}



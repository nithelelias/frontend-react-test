import '@testing-library/jest-dom';
import { fireEvent, render } from "@testing-library/react";
import PostType from "../PostType";
import PostCom from "./PostCom";
const post: PostType = {
    appID: "0",
    author: "string", // REQUIRE
    comment_text: "string", //
    created_at: "02/02/2020 16:40:40",//"2022-04-03T04:46:03.000Z"
    created_at_i: 0,//1648961163
    num_comments: "string",
    objectID: "string",//"30894539"
    parent_id: "string",//30892127
    points: "string",
    story_id: 0,//30891217
    story_text: "string",
    story_title: "Hola mundo",
    story_url: "not_a_story_url",
    title: "string",
    url: "not_a_url"
};
test("render a post ", () => {
    const component = render(<PostCom post={post}></PostCom>);
    //  component.debug();
    expect(component.getByText(post.story_title)).toBeInTheDocument();
});
test("click a post to open url ", () => {
    const component = render(<PostCom post={post}></PostCom>);
    const myMock = jest.fn();
    global.open = myMock;
    const element: any = component.container.querySelector(".post-card.pointer");
    fireEvent.click(element);
    expect(myMock).toBeCalled();
    expect(myMock.mock.calls[0].join("-")).toBe([post.story_url, "_blank"].join("-"));


});

test("toggle fav a post ", () => {
    const store: any = {};
    const component = render(<PostCom post={post}></PostCom>);
    const element: any = component.container.querySelector(".favorite-side");
    jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation((key, value) => (store[key as string] = value as string));
    ///////////////////////////////////////////////////////
    fireEvent.click(element);

    // WILLS STORE HERE THE FAVORITE POST
    if (store.hasOwnProperty("app-favs-store")) {
        let json = JSON.parse(store["app-favs-store"]);
        expect(json.dic.hasOwnProperty(post.appID)).toBe(true);
    }
    // WILL HAVE THE HEART ICON
    expect(component.container.querySelectorAll(".favorite-side img[alt='with Heart']").length).toBe(1);

    //////////////////////////////////////////
    fireEvent.click(element);
    //
    {
        let json = JSON.parse(store["app-favs-store"]);
        expect(json.dic.hasOwnProperty(post.appID)).toBe(false);
    }
    // NO ICON FOUND 
    expect(component.container.querySelectorAll(".favorite-side img[alt='with Heart']").length).toBe(0);

});
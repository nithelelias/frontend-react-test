import '@testing-library/jest-dom';
import PostType from './PostType';
import PostCom from "./components/PostCom";
import { fireEvent, render } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import { myPostsManager } from './PostsManagerContext';
import PostBoard from './PostBoard';
import { act } from 'react-dom/test-utils';
let module: any = null;
let container: any = null;
beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {

    unmountComponentAtNode(container);
    container.remove();
    container = null;
});


it("render a list of post ", async () => {

    const fakeResponse: any = {
        page: 0,
        hits: [
            {
                author: "nithel",
                story_title: "Hola mundo 00",
                created_at: "2022-04-03T04:46:03.000Z",
                story_url: "test hola mundo 1",
            },
            {
                author: "nithel",
                story_title: "Hola mundo 2",
                created_at: "2022-04-03T04:46:03.000Z",
                story_url: "test hola mundo 2",
            },
            {
                author: "nithel",
                story_title: "Hola mundo 3",
                created_at: "2022-04-03T04:46:03.000Z",
                story_url: "test hola mundo 3",
            },
            {
                author: "nithel",
                story_title: "Hola mundo 4",
                created_at: "2022-04-03T04:46:03.000Z",
                message: "THIS WILL NOT GO story_url is missing"
            }
        ]
    };

    await act(async () => {
        module = render(
            <PostBoard />,
            container
        );
    })


    const fakeJsonResponse: any = {
        json: () => Promise.resolve(fakeResponse)
    }
    jest.spyOn(global, "fetch").mockImplementation(() => { return Promise.resolve(fakeJsonResponse); });
    await act(async () => {
        // FORCE THE EXECUTE QUERY
        await myPostsManager.executeQuery();
    });

    /// FOR EACH HITS WE WILL SEARCH DO A QUERY SELECTOR IF THE COMPONENT IS FOUND

    let divs_postcard = module.container.querySelectorAll(".post-card");
    expect(divs_postcard.length).toBe(3);
    expect(module.queryByText(fakeResponse.hits[3].story_title)).not.toBeInTheDocument();

});

it("change the topic of the post to react", async () => {
    // THE MODULE STILL HAVE LOADED
    await act(async () => {
        module = render(
            <PostBoard />,
            container
        );
    });
    const fakeResponse1: any = {
        page: 0,
        hits: [
            {
                author: "nithel",
                story_title: "Hola mundo 00",
                created_at: "2022-04-03T04:46:03.000Z",
                story_url: "test hola mundo 1",
            },
            {
                author: "nithel",
                story_title: "Hola mundo 2",
                created_at: "2022-04-03T04:46:03.000Z",
                story_url: "test hola mundo 2",
            }
        ]
    };
    const fakeResponse2: any = {
        page: 0,
        hits: [{
            author: "nithel",
            story_title: "Hola mundo 3",
            created_at: "2022-04-03T04:46:03.000Z",
            story_url: "test hola mundo 3",
        },
        {
            author: "nithel",
            story_title: "Hola mundo 4",
            created_at: "2022-04-03T04:46:03.000Z",
            message: "THIS WILL NOT GO story_url is missing",
            story_url: "test hola mundo 4",
        }]
    };
    const fakeJsonResponse: any = {
        json: () => Promise.resolve(fakeResponse1)
    }
    const fakeJsonResponse2: any = {
        json: () => Promise.resolve(fakeResponse2)
    }
    let payload: any = "";
    jest.spyOn(global, "fetch").mockImplementation((_payload) => {
        payload = _payload;
        return Promise.resolve(fakeJsonResponse);
    });
    await act(async () => {
        // FORCE THE EXECUTE QUERY
        await myPostsManager.executeQuery();

    });
    // VALIDATE IF THE PAYLOAD HAS ANGULAR AS DEFAULT
    expect(payload.indexOf("angular")).not.toBe(-1);
    // change the query to react
    myPostsManager.setQuery("react");
    await act(async () => {
        // FORCE THE EXECUTE QUERY
        await myPostsManager.executeQuery(); 
    });
    expect(payload.indexOf("react")).not.toBe(-1);
})
/*



test("click on a post to open his story url link", () => { });

test("favorite the post without open another story url", () => { });

*/




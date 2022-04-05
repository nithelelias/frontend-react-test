import moment from "moment";
import AppLocalStorage from "../../core/AppLocalStorage";
import PostType from "./PostType";
import { on, off, trigger } from "../../core/Event";

///////////////////////////////////////////////////////////////////////
/**
 *  create a favorites store to be used
 */
const appFavsStore = new AppLocalStorage("app-favs-store");
const AppFavs: any = appFavsStore.get({
    dic: {},
    hits: [],
});
///////////////////////////////////////////////////////////////////////
/**
 *  this function will tell if a item on the postlist requested , have the minimun values required to be printed.
 * @param item 
 * @returns true | false  
 */
function validateMinFieldsRequired(item: PostType) {
    const REQUIRED_FIELDS = ["author", "created_at", "story_title", "story_url"];
    let valid = true;
    for (let i in REQUIRED_FIELDS) {
        let field = REQUIRED_FIELDS[i] as keyof typeof item;
        if (!item.hasOwnProperty(field)) {
            valid = false;
            break;
        }

        if (item[field] == null) {
            valid = false; break;
        }

    }
    return valid;
}
/////////////////////////////////////////////////////////////////////////
/**
 *  this object will manage the data comsuming a web service who will have a predefine structure to deal.
 *  this Object will do:
 *  
 *   Request a web api using the url giveng on a GET method using fetch to retrieve POST from it.
 *   Handler the favorite store to, save, remove and get Posts. 
 *   
 *  this Object works with pagination and a query params    
 *   page = number
 *   query = string
 *  
 *  this object will retrieve the data and return a promise and also will trigger an event of : ready state change, data change, page change
 *  
 * @author Nithel Elias
 */
class PostsManager {
    private id: string;
    private page: number;
    private query: string;
    public infiniteScroll: boolean;
    public ready: boolean;
    private hitsPerPage: number;
    private postList: Array<PostType>;
    private pagesPoolList: Array<Array<PostType>>;
    private maxPages: number;
    private lastExecution: Promise<Array<PostType>>;
    private url: string;
    private str_event_readychange: string;
    private str_event_datachange: string;
    private str_event_pagechange: string;

    /**
     *  This Manager will manage the data comsuming a web service who will have a predefine structure to deal.
     *  can store favorites and can be requested on the method getFromLocalStorage
     * @param url url of the web service to be consumed
     */
    constructor(url: string) {
        this.id = (Date.now().toString().substring(4) + "_" + (Math.random().toString().substring(12)));
        this.url = url;
        this.page = 0;
        this.infiniteScroll = false;
        this.query = "";
        this.ready = false;
        this.hitsPerPage = 20;
        this.postList = [];
        this.maxPages = 0;
        this.pagesPoolList = [];
        this.lastExecution = Promise.resolve([]);
        this.str_event_readychange = "PostServiceReadyChange_" + this.id;
        this.str_event_datachange = "PostServiceDataChange_" + this.id;
        this.str_event_pagechange = "PostServicePageChange_" + this.id;
    }


    onReady() {
        return this.lastExecution;
    }

    getPostList() {
        return this.postList;
    }
    getPage() {
        return this.page;
    }

    getMaxPages() {
        return this.maxPages;
    }
    setPage(numPage: number) {
        this.page = numPage;
        trigger(this.str_event_pagechange, numPage);
    }
    setQuery(query: string) {
        this.query = query;
    }
    clear() {
        this.postList = [];
        this.pagesPoolList = [];
        trigger(this.str_event_datachange, this.postList);
    }
    /**
     * will add a post to favorites
     * @param post 
     */
    addFav(post: PostType) {

        // IF NOT IN HERE.
        if (!AppFavs.dic.hasOwnProperty(post.appID)) {
            AppFavs.dic[post.appID] = post;
            AppFavs.hits.push(post.appID);
            appFavsStore.set(AppFavs);
        }
    }

    /**
     *  will remove a post from favorites.
     * @param id 
     */
    removeFav(id: string) {
        if (AppFavs.dic.hasOwnProperty(id)) {
            delete AppFavs.dic[id];
            AppFavs.hits.splice(AppFavs.hits.indexOf(id), 1);
            appFavsStore.set(AppFavs);
        }
    }
    /**
     * easy method to use the toggle here, to prevent data assumption outside.
     * @param post 
     */
    toggleFav(post: PostType) {
        if (this.isFav(post.appID)) {
            this.removeFav(post.appID);
        } else {
            this.addFav(post);
        }
    }
    /**
     * will tell if a post is marked on the favorites list.
     * @param id 
     * @returns true|false boolean
     */
    isFav(id: string): boolean {
        return AppFavs.dic.hasOwnProperty(id);
    }
    /**
     * to listen when the ready state change
     * @param callback 
     * @returns the unbind method
     */
    listenToReadyChange(callback: () => void) {
        on(this.str_event_readychange, callback);
        return () => {
            off(this.str_event_readychange, callback);
        }
    }
    /**
     * to listen when the  current post lists  change
     * @param callback 
     * @returns the unbind method
     */
    listenToDataChange(callback: () => void) {
        on(this.str_event_datachange, callback);
        return () => {
            off(this.str_event_datachange, callback);
        }
    }
    /**
     * to listen when the current page change
     * @param callback 
     * @returns the unbind method
     */
    listenToPageChange(callback: () => void) {
        on(this.str_event_pagechange, callback);
        return () => {
            off(this.str_event_pagechange, callback);
        }
    }

    /**
     *  to change the ready state and trigger the ready change event.
     * @param ready boolean
     */
    private setReady(ready: boolean) {
        this.ready = ready;
        trigger(this.str_event_readychange, this.ready);
    }

    /**
     * Retrieve a lists of Post from the webservice
     * @returns Promise<Array<PostType>>
     */
    executeQuery() {
        this.setReady(false);
        this.lastExecution = new Promise((resolve) => {
            // QUERY 
            fetch(this.url + `?query=${this.query.toLowerCase()}&page=${this.page}`).then((r) => r.json())
                .then((response) => {
                    let newHits = response.hits.filter((item: PostType) => {
                        // VALIDATE THAT AT LEAST GET THE REQUIRED PARAMS
                        return validateMinFieldsRequired(item);
                    }).map((item: PostType) => {
                        // GIVE IT AT APPID FROM OBJECTID OR AT LEAST CREATED_AT
                        item.appID = item.objectID || (moment(item.created_at).format("x"));
                        return (item);
                    });
                    // response.page to store the page result // in case to multiple executions.
                    this.pagesPoolList[response.page || this.page] = newHits;
                    if (this.infiniteScroll) {
                        this.postList = this.pagesPoolList.flat(1);
                    } else {
                        this.postList = newHits;
                    }


                    this.maxPages = response.nbPages;
                    resolve(this.postList);
                    trigger(this.str_event_datachange, this.postList);
                    setTimeout(() => {
                        this.setReady(true);
                    }, 500)
                }, (e) => {
                    resolve([]);
                    console.error(e);
                })
        })
        return this.lastExecution;

    }


    /**
     *  retrieve the favorites posts  from localstorage
     * @returns Promise<Array<PostType>>
     */
    getFromLocalStorage() {
        this.setReady(false);

        this.maxPages = Math.ceil(AppFavs.hits.length / this.hitsPerPage);;
        if (this.page > this.maxPages) {
            this.page = this.maxPages;
        }
        try {

            let fromindex = this.hitsPerPage * (this.page);
            let newHits = AppFavs.hits.slice(fromindex, fromindex + 20).map((appId: string) => {
                return AppFavs.dic[appId];
            });
            this.pagesPoolList[this.page] = newHits;
            if (this.infiniteScroll) {
                this.postList = this.pagesPoolList.flat(1);
            } else {
                this.postList = newHits;
            }


            trigger(this.str_event_datachange, this.postList);
        } catch (e) {
            console.error(e);
        } finally {
            // TO PREVENT RELOADS
            setTimeout(() => {
                this.setReady(true);
            }, 500)
        }
        this.lastExecution = Promise.resolve(this.postList);

        return this.lastExecution;

    }
}



export default PostsManager;
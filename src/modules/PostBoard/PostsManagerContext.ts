import { on, off, trigger } from "../../core/Event";
import AppLocalStorage from "../../core/AppLocalStorage";
import PostsManager from "./PostsManager";


/**
 *  the idea of this file is to be reused on diferent components without instanciate diferents objects.
 */

////////////////////////////////////////////////////////////////////////////
type AppStatetype = {
    initiated: boolean;
    selectedTopic: string;
    currentPage: number;
    infiniteScroll: boolean;
    selectedView: string;
};
const appStateStore = new AppLocalStorage("app-state-store");
export default class AppStateManager {
    public state: AppStatetype;
    private str_event_onstore: string;
    constructor() {
        this.state = appStateStore.get({
            initiated: false,
            selectedTopic: "",
            selectedView: "",
            infiniteScroll: false,
            currentPage: 0,
        }) as AppStatetype;
        this.str_event_onstore = "app-state-store-stored"
    }
    store() {
        appStateStore.set(this.state);
        trigger(this.str_event_onstore, 1);
    }
    listenOnStore(callback: () => void) {
        on(this.str_event_onstore, callback);
        return () => {
            off(this.str_event_onstore, callback);
        }
    }
}

export const myAppState = new AppStateManager();
////////////////////////////////////////////////////////////////////////////


export const myPostsManager = new PostsManager("https://hn.algolia.com/api/v1/search_by_date");

export default class AppLocalStorage {
    private keystore: string;
    constructor(_keystore: string) {
        this.keystore = _keystore;
    }
    set(_obj: any) {
        window.localStorage.setItem(this.keystore, JSON.stringify(_obj));
    }
    get(_default: any): any {
        let item = window.localStorage.getItem(this.keystore);
        if (!item) {
            return _default;
        }
        return JSON.parse(item);
    }
}

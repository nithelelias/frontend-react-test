//////////////////////////////////////////////////////////////////////////
/// UTIL FUNCTION TO CREATE CUSTOM EVENTS 
//////////////////////////////////////////////////////////////////////////

/**
 *  add an event listener to acustom tag eventtype
 * @param eventType 
 * @param listener 
 */
function on(eventType: string, listener: (event: any) => void) {
    document.addEventListener(eventType, listener);
}

/**
 * unbind an event listener to the corresponding tag eventtype and callbackfunction
 * @param eventType 
 * @param listener 
 */
function off(eventType: string, listener: (event: any) => void) {
    document.removeEventListener(eventType, listener);
}

/**
 *  To hear only one time.
 * @param eventType 
 * @param listener 
 */
function once(eventType: string, listener: (event: any) => void) {
    on(eventType, handleEventOnce);

    function handleEventOnce(event: any) {
        listener(event);
        off(eventType, handleEventOnce);
    }
}

/**
 * to trigger an custom event
 * @param eventType 
 * @param data 
 */
function trigger(eventType: string, data: any) {
    const event = new CustomEvent(eventType, { detail: data });
    document.dispatchEvent(event);
}

export { on, once, off, trigger };
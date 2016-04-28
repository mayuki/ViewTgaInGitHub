"use strict";

// XHR Proxy
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command == 'FetchRemoteResource') {
        const url = request.url;

        const xhr = new XMLHttpRequest();
        console.log(url);
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            sendResponse({ blobUrl: URL.createObjectURL(xhr.response) });
        };
        xhr.onerror = (e) => console.log(e);
        xhr.send();
        
        return true;
    }
});
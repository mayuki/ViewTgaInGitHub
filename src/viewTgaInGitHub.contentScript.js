"use strict";

class ViewTgaInGitHub {
    static main() {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = chrome.extension.getURL("viewTgaInGitHub.pageScript.js");
        window.document.body.appendChild(script);


        window.addEventListener('message', (e) => {
            if (e.data.sender == 'ViewTgaInGitHubBridge' && e.data.event == 'pjax:complete' /* && e.data.origin == 'https://github.com' */) {
                ViewTgaInGitHub.injectImages();
            }
        });
        ViewTgaInGitHub.injectImages();
    }

    static injectImages() {
        const isCommitChangeSetPage = window.location.href.match(/\/commit\//) != null;
        if (!window.location.pathname.endsWith('.tga') && !isCommitChangeSetPage) return;

        if (isCommitChangeSetPage) {
            const fileHeaders = document.querySelectorAll('.file-header[data-path$=".tga"]');
            for (let i = 0; i < fileHeaders.length; i++) {
                const fileHeader = fileHeaders[i];
                let path = fileHeader.querySelector('a').href;

                // create path to raw image
                path = path.replace(/\/blob\//, '/raw/') + '?raw=true';

                // create dummy "View Raw" link
                const viewRawLinkE = document.createElement('a');
                viewRawLinkE.href = path;
                viewRawLinkE.textContent = 'View Raw';

                const dataContainer = fileHeader.nextElementSibling;
                dataContainer.textContent = '';
                dataContainer.appendChild(viewRawLinkE);
                dataContainer.classList.remove('empty');
                dataContainer.classList.add('image');
            }
            console.log(fileHeaders);
        }

        const tgaLinks = document.querySelectorAll('.image a[href*=".tga"]');
        for (let i = 0; i < tgaLinks.length; i++) {
            const aElement = tgaLinks[i];
            const url = aElement.href;

            aElement.textContent = 'Loading...';

            ((aElement) => {
                chrome.runtime.sendMessage({ command: 'FetchRemoteResource', url: url }, (response) => {
                    const tga = new TGA();
                    tga.open(response.blobUrl, () => {
                        aElement.textContent = '';

                        const canvas = tga.getCanvas();
                        aElement.appendChild(canvas);
                    });
                });
            })(aElement);
        }
    }
}

ViewTgaInGitHub.main();

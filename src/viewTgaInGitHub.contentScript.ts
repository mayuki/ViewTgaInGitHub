declare var TGA: any;
declare var chrome: any;
declare var $: any;

class ViewTgaInGitHub {
    static main(): void {
        var script = document.createElement('script');
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

    static injectImages(): void {
        var isCommitChangeSetPage = window.location.href.match(/\/commit\//) != null;
        if (!window.location.pathname.endsWith('.tga') && !isCommitChangeSetPage) return;

        if (isCommitChangeSetPage) {
            var fileHeaders = document.querySelectorAll('.file-header[data-path$=".tga"]');
            for (var i = 0; i < fileHeaders.length; i++) {
                var fileHeader = <HTMLElement>(fileHeaders[i]);
                var path = (<HTMLAnchorElement>fileHeader.querySelector('a')).href;

                // create path to raw image
                path = path.replace(/\/blob\//, '/raw/') + '?raw=true';

                // create dummy "View Raw" link
                var viewRawLinkE = document.createElement('a');
                viewRawLinkE.href = path;
                viewRawLinkE.textContent = 'View Raw';

                var dataContainer = fileHeader.nextElementSibling;
                dataContainer.textContent = '';
                dataContainer.appendChild(viewRawLinkE);
                dataContainer.classList.remove('empty');
                dataContainer.classList.add('image');
            }
            console.log(fileHeaders);
        }

        var tgaLinks = document.querySelectorAll('.image a[href*=".tga"]');
        for (var i = 0; i < tgaLinks.length; i++) {
            var aElement = (<HTMLAnchorElement>tgaLinks[i]);
            var url = aElement.href;

            aElement.textContent = 'Loading...';

            ((aElement: HTMLAnchorElement) => {
                var tga = new TGA();
                tga.open(url, () => {
                    aElement.textContent = '';

                    var canvas = tga.getCanvas();
                    aElement.appendChild(canvas);
                });
            })(aElement);
        }
    }
}

ViewTgaInGitHub.main();

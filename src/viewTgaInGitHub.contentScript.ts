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
        if (!window.location.pathname.endsWith('.tga')) return;

        var tgaLinks = document.querySelectorAll('.image a[href*=".tga"]');
        for (var i = 0; i < tgaLinks.length; i++) {
            var aElement = (<HTMLAnchorElement>tgaLinks[i]);
            var url = aElement.href;

            aElement.textContent = 'Loading...';

            var tga = new TGA();
            tga.open(url, function (data) {
                aElement.textContent = '';

                var canvas = tga.getCanvas();
                aElement.appendChild(canvas);
            });
        }
    }
}

ViewTgaInGitHub.main();

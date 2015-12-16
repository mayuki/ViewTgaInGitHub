var ViewTgaInGitHub = (function () {
    function ViewTgaInGitHub() {
    }
    ViewTgaInGitHub.main = function () {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = chrome.extension.getURL("viewTgaInGitHub.pageScript.js");
        window.document.body.appendChild(script);
        window.addEventListener('message', function (e) {
            if (e.data.sender == 'ViewTgaInGitHubBridge' && e.data.event == 'pjax:complete' /* && e.data.origin == 'https://github.com' */) {
                ViewTgaInGitHub.injectImages();
            }
        });
        ViewTgaInGitHub.injectImages();
    };
    ViewTgaInGitHub.injectImages = function () {
        if (!window.location.pathname.endsWith('.tga'))
            return;
        var tgaLinks = document.querySelectorAll('.image a[href*=".tga"]');
        for (var i = 0; i < tgaLinks.length; i++) {
            var aElement = tgaLinks[i];
            var url = aElement.href;
            aElement.textContent = 'Loading...';
            var tga = new TGA();
            tga.open(url, function (data) {
                aElement.textContent = '';
                var canvas = tga.getCanvas();
                aElement.appendChild(canvas);
            });
        }
    };
    return ViewTgaInGitHub;
})();
ViewTgaInGitHub.main();

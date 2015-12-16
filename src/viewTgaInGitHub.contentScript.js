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
        var isCommitChangeSetPage = window.location.href.match(/\/commit\//) != null;
        if (!window.location.pathname.endsWith('.tga') && !isCommitChangeSetPage)
            return;
        if (isCommitChangeSetPage) {
            var fileHeaders = document.querySelectorAll('.file-header[data-path$=".tga"]');
            for (var i = 0; i < fileHeaders.length; i++) {
                var fileHeader = (fileHeaders[i]);
                var path = fileHeader.querySelector('a').href;
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
            var aElement = tgaLinks[i];
            var url = aElement.href;
            aElement.textContent = 'Loading...';
            (function (aElement) {
                var tga = new TGA();
                tga.open(url, function () {
                    aElement.textContent = '';
                    var canvas = tga.getCanvas();
                    aElement.appendChild(canvas);
                });
            })(aElement);
        }
    };
    return ViewTgaInGitHub;
})();
ViewTgaInGitHub.main();

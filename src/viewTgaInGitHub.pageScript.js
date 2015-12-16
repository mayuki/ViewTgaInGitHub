var ViewTgaInGitHubBridge = (function () {
    function ViewTgaInGitHubBridge() {
    }
    ViewTgaInGitHubBridge.main = function () {
        $(document).on('pjax:complete', function (details) {
            window.postMessage({ sender: 'ViewTgaInGitHubBridge', event: 'pjax:complete' }, '*');
        });
    };
    return ViewTgaInGitHubBridge;
})();
ViewTgaInGitHubBridge.main();

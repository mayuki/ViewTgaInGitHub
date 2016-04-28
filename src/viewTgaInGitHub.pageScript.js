class ViewTgaInGitHubBridge {
    static main() {
        document.addEventListener('pjax:complete', (details) => {
            window.postMessage({ sender: 'ViewTgaInGitHubBridge', event: 'pjax:complete' }, '*');
        });
    }
}

ViewTgaInGitHubBridge.main();

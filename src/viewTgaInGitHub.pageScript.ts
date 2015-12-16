declare var TGA: any;
declare var chrome: any;
declare var $: any;

class ViewTgaInGitHubBridge {
    static main(): void {
        $(document).on('pjax:complete', (details) => {
            window.postMessage({ sender: 'ViewTgaInGitHubBridge', event: 'pjax:complete' }, '*');
        });
    }
}

ViewTgaInGitHubBridge.main();

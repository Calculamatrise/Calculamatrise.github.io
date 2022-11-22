import EventEmitter from "./EventEmitter.js";

let i = 0;
const parser = new DOMParser();
export default class extends EventEmitter {
    constructor() {
        super();
        navigation.addEventListener('navigate', event => {
            if (event.userInitiated && event.navigationType !== 'traverse') {
                const destinationURL = new URL(event.destination.url);
                this.navigate(destinationURL.pathname, {
                    popped: event.navigationType === 'traverse' && !(navigation.currentEntry.index < event.destination.index)
                });
            }
        });
        window.addEventListener('popstate', event => {
            this.navigate(location.pathname, {
                dom: event.state,
                popped: true
            });
        });
    }

    /**
     * 
     * @param {string} pathname
     * @param {object} options
     * @param {boolean} options.popped
     * @returns {Promise}
     */
    async navigate(pathname, { dom = history.state, popped = false, saveState = false } = {}) {
        if (typeof pathname != 'string') return;
        else if (dom) dom = parser.parseFromString(dom, 'text/html');
        let oldContent = parser.parseFromString(document.body.innerHTML, 'text/html');
        const nav = oldContent.querySelector('body > nav');
        if (nav !== null) {
            nav.remove();
        }

        history[(popped ? 'replace' : 'push') + 'State'](null && oldContent.documentElement.outerHTML, document.title, pathname);
        try {
            this.emit(pathname);
            let dir = pathname.slice(1, -1).split('/');
            if (dir.length > 1) {
                for (let t = 1; t < dir.length; t++) {
                    let pathname = dir.slice(0, -t).join('/');
                    this.emit(`/${pathname}/*`);
                }
            }

            let loadAssets = dom === null;
            if (loadAssets) {
                dom = await fetch(pathname).then(r => r.text()).then(res => parser.parseFromString(res, 'text/html'));
                for (const element of dom.querySelectorAll('link')) {
                    const link = document.createElement('link');
                    link.rel = element.rel || '';
                    link.href = element.href;
                    document.body.appendChild(link);
                    // element.remove();
                }

                for (const element of document.body.querySelectorAll('script')) {
                    element.src += '?i=' + i++;
                }
            }

            const nav = dom.querySelector('body > nav');
            if (nav !== null) {
                nav.remove();
            }

            document.body.replaceChildren(document.body.querySelector('nav'), ...dom.body.children);
            if (dom.title) {
                document.title = dom.title;
            }


            for (const element of document.body.querySelectorAll('script')) {
                const script = document.createElement('script');
                script.type = element.type || '';
                script.src = element.src ? element.src + '?i=' + i++ : null;
                element.replaceWith(script);
            }
        } catch(e) {
            console.error(e, 'haa');
            this.emit('/*');
        }
    }
}
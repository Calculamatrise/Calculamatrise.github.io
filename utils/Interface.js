import EventEmitter from "./EventEmitter.js";

export default class extends EventEmitter {
    get mobile() {
        return navigator.userAgentData.mobile || window.innerWidth <= 500;
    }

    nav = document.querySelector('nav') ?? document.createElement('nav');
    constructor(Application = window.Application) {
        super();
        fetch('/nav.html').then(r => r.text()).then(data => {
            this.nav.innerHTML = data;
            const select = this.nav.querySelector('select');
            select.value = location.pathname;
            select.addEventListener('input', function() {
                if (this.value === 'theme') {
                    this.value = location.pathname;
                    Application.setColorScheme(Application.storage.theme = Application.getColorScheme() !== 'dark' ? 'dark' : 'light');
                    return;
                }

                Application.router.navigate(this.value);
            });
            this.loadContent();
            this.emit('loaded');

            window.addEventListener('popstate', event => {
                select.value = location.pathname;
            });
        });

        document.body.prepend(this.nav);
        document.body.addEventListener('scroll', event => {
            const { height } = this.nav.getBoundingClientRect();
            const { y } = document.body.getBoundingClientRect();
            y > 0 && this.nav.style.setProperty('background-image', `linear-gradient(180deg, var(--accent-color), rgba(${Application.getColorScheme() == 'dark' ? '45, 45, 45' : '210, 210, 210'}, ${Math.min(.66 - (height - Math.abs(y)) / 100, 1)}))`);
        });

        window.addEventListener('resize', this.loadContent.bind(this));
    }

    loadContent() {
        for (const child of this.nav.children) {
            child.style[((this.mobile ? child.tagName == 'SELECT' : child.tagName !== 'SELECT') ? 'remove' : 'set') + 'Property']('display', 'none');
        }
    }
}
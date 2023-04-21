class DateNow extends HTMLElement {

    constructor() {
        super()
        this.init()
    }

    connectedCallback() {
        this.format = this.hasAttribute('format') ? this.getAttribute('format') : 'HH:mm:SS';
        this.setDateFormatted()
    }

    init() {

        setInterval(() => {
            this.setDateFormatted()
        },1000)

    }

    setDateFormatted() {
        let date = new Date()
        const map = {
            'YYYY': date.getFullYear(),
            'MM': ('0' + (date.getMonth() + 1)).slice(-2),
            'DD': ('0' + date.getDate()).slice(-2),
            'HH': ('0' + date.getHours()).slice(-2),
            'mm': ('0' + date.getMinutes()).slice(-2),
            'SS': ('0' + date.getSeconds()).slice(-2)
        };
        this.innerText = this.format.replace(/YYYY|MM|DD|HH|mm|SS/g, (matched) => map[matched]);
    }
    
}

customElements.define('zol-datenow', DateNow);
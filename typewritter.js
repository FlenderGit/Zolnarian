class TypeWritter extends HTMLElement {

    constructor() {
        super()
        this.backward = false
        this.current_text = ''
        this.init()
    }

    connectedCallback() {
        this.text = this.hasAttribute('text') ? this.getAttribute('text') : "I'm a pratice text.\nI'm just here to test fonctionnalities !  ";
        this.speed = this.hasAttribute('speed') ? this.getAttribute('speed') : 100
        this.loop = this.hasAttribute('loop')
    }

    init() {

        this.index = 0
        let finished = false
 

        this.action()

    }

    action() {
        setTimeout(() => {
            let char = this.text[this.index] 

            this.current_text += char
            this.innerText = this.current_text

            this.index++
            if (this.index < this.text.length)
                this.action()
            else {
                this.classList.add('zol-finished')
            }

        }, this.speed)
        
    }

    
    
}

var style_typewriter = 'zol-typewritter { border-right: black solid .1rem; } zol-typewritter.zol-finished { animation: infinite typewritter 1s ; } @keyframes typewritter { from {border-right-color:black} to { border-right-color: transparent} }';

createCSSFile(style_typewriter)

customElements.define('zol-typewritter', TypeWritter);
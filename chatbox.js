class Chatbox extends HTMLElement {

    constructor() {
        super()
        this.user = undefined
        this.publishKey = undefined
        this.subcribeKey = undefined
        this.pubnub = undefined
    }

    connectedCallback() {
        this.template = this.getElementsByTagName('template')[0]
        this.publishKey = this.hasAttribute('published-key') ? this.getAttribute('published-key') : "pub-c-f62f9dde-ff26-4648-80fa-091db6515e52";
        this.subcribeKey = this.hasAttribute('subcribe-key') ? this.getAttribute('subcribe-key') : "sub-c-b74b9e4f-22a4-4c87-a352-8f98aff5980b";
        this.generate_form()

    }

    connect() {

        this.pubnub = new PubNub({
            publishKey : this.publishKey,
            subscribeKey : this.subcribeKey,
            userId: this.user.login
        });

        const listener = {
            status: (statusEvent) => {
                if (statusEvent.category === "PNConnectedCategory") {
                    console.log("Connected");
                }
            },
            message: (messageEvent) => {
                let container = this.querySelector('#zol-chatbox-container')
                let isDown = container.scrollTop + container.clientHeight + 30 >= container.scrollHeight
                this.addMessageUser(messageEvent.message);

                if (isDown){
                    container.scrollTop = container.scrollHeight
                }
                
            },
            presence: (presenceEvent) => {
                console.log(presenceEvent)
                let p = document.createElement('p')
                p.innerText = presenceEvent.uuid + ' vient de se ' + ( presenceEvent.action == 'join' ? 'connecter' : 'déconnecter')
                this.addMessage(p.outerHTML)
            }
        };

        this.pubnub.addListener(listener);

        this.pubnub.subscribe({
            channels: ["zolnarian-chatbox"],
            withPresence: true
        });
    } 

    generate_chatbox() {

        this.innerHTML = null

        let btn_logout = document.createElement('button')
        btn_logout.addEventListener('click', () => {
            this.pubnub.unsubscribe({
                channels: ['zolnarian-chatbox']
            })
            this.generate_form()
        })
        btn_logout.innerText = 'Déconnection'
        this.appendChild(btn_logout)

        let container = document.createElement('div')
        container.id = 'zol-chatbox-container'
        this.appendChild(container)
        
        let form = document.createElement('form')

        let input = document.createElement('input')
        input.type = 'text'
        input.required = true
        input.placeholder = 'Type here'
        form.appendChild(input)

        let button = document.createElement('button')
        button.innerText = 'Envoyer'

        form.appendChild(button)

        form.addEventListener('submit',(event) => {
            event.preventDefault()
            this.publishMessage(input.value)
            input.value = null
        })

        this.appendChild(form)

    }

    generate_form() {

        this.innerHTML = null

        let form = document.createElement('form')

        let input = document.createElement('input')
        form.appendChild(input)

        let btn_login = document.createElement('button')
        btn_login.innerText = 'Se connecter'
        form.appendChild(btn_login)

        form.addEventListener('submit', (event) => {
            event.preventDefault()
            this.generate_chatbox()
            this.user = {
                login : input.value,
                id: generate_uuid() 
            }
            this.connect()
        })

        this.appendChild(form)

    }

    addMessage(data) {
        this.querySelector('#zol-chatbox-container').innerHTML += data
    }

    addMessageUser(data){
        this.addMessage(replaceValues(this.template.innerHTML, data))
    }

    

    async publishMessage (message) {
        const publishPayload = {
            channel : "zolnarian-chatbox",
            message: {
                login: this.user.login,
                message: message
            }
        };
        await this.pubnub.publish(publishPayload);
    }
    
}



let style = "zol-chatbox{display:flex;flex:1;flex-direction:column;padding:1rem}zol-chatbox > #zol-chatbox-container{flex:1;display:flex;flex-direction:column;overflow-y:auto}zol-chatbox > #zol-chatbox-container::before{position:relative;content:'';flex:1 1 auto;}#zol-chatbox-container > *{margin:.2rem 0}zol-chatbox > #zol-chatbox-container *{color:#f5f5f5;font-size:large}zol-chatbox form{display:flex}zol-chatbox input{flex:1}"
createCSSFile(style)

customElements.define('zol-chatbox', Chatbox);
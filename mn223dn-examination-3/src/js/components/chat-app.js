import { WindowContainer } from './window-container.js'

/** A template of the first page of chat-app */
const welcomwPage = document.createElement('template')
welcomwPage.innerHTML = `
    <link rel="stylesheet" href="css/chat-app.css">

    <div class="welcome-page">
        <div class="ui left icon input username">
            <input id="usernameInput" type="text" placeholder="Username...">
            <i class="user icon"></i>
        </div>

        <div class="ui left icon input channel">
            <input id="channelInput" type="text" placeholder="Channel...">
            <i class="podcast icon"></i>
        </div>

        <button class="enter ui positive right labeled icon button">
            <i class="right arrow icon"></i>
            Enter
        </button>
    </div>
`
/** A template of the message page of chat-app */
const chatPage = document.createElement('template')
chatPage.innerHTML = `
  <link rel="stylesheet" href="css/chat-app.css">

  <div class="chat-page">
    <div class="messages-div">

      <template>
        <div id="msgUserName" class="ui blue segment"></div>
        <div id="msgBody" class="message-body"></div>
      </template>
    </div>

    <div class="ui fluid action input">
      <input id="messageField" type="text" placeholder="Type message here...">
      <div id="sendButton" class="ui button">Send</div>
    </div>
  </div>
`
/** class creates chat app custom HTMLElement extending window-continer */
export class ChatApp extends WindowContainer {
  constructor () {
    super()
    /** add icon and title to the window */
    this._windowIcon.classList.add('comments', 'outline')
    this._windowTitle.textContent += 'Chat App'

    /**
     * if no user saved in local storage, open chat welcome page to enter user info
     * else, it will show message page directly if there is already user info saved in the local storage
     */
    if (window.localStorage.getItem('user') !== null) {
      this.userName = JSON.parse(window.localStorage.getItem('user')).username
      this.channel = JSON.parse(window.localStorage.getItem('user')).channel
      this.enterChat()
    } else {
      this._container.appendChild(welcomwPage.content.cloneNode(true))
      this._userName = this.shadowRoot.querySelector('#usernameInput')
      this._channel = this.shadowRoot.querySelector('#channelInput')
      this._enterButton = this.shadowRoot.querySelector('.enter.button')
      this._enterButton.addEventListener('click', this.saveUserInfo.bind(this))
    }
  }

  connectedCallback () {
    /** add event to setting icon to change username or channel */
    this._settingButton.addEventListener('click', this.editUserInfo.bind(this))
  }

  /** change the user info in the local storage */
  editUserInfo () {
    this.socket.close()
    this._container.removeChild(this._container.querySelector('div'))
    this._container.appendChild(welcomwPage.content.cloneNode(true))
    this._userName = this.shadowRoot.querySelector('#usernameInput')
    this._channel = this.shadowRoot.querySelector('#channelInput')
    this._enterButton = this.shadowRoot.querySelector('.enter.button')
    /** get current info from local storage */
    this._userName.value = JSON.parse(window.localStorage.getItem('user')).username
    if (JSON.parse(window.localStorage.getItem('user')).channel) {
      this._channel.value = JSON.parse(window.localStorage.getItem('user')).channel
    }
    /** save the new info */
    this._enterButton.addEventListener('click', this.saveUserInfo.bind(this))
  }

  /** save the user info in local storage after change */
  saveUserInfo () {
    this.userName = this._userName.value.trim()
    this.channel = this._channel.value.trim()
    /** username is mandatory */
    if (this.userName.length > 0) {
      /** check if channel name is entered */
      if (this.channel.length > 0) {
        window.localStorage.setItem('user', JSON.stringify({
          username: this.userName,
          channel: this.channel
        }))
      } else {
        window.localStorage.setItem('user', JSON.stringify({
          username: this.userName
        }))
      }
      this._container.removeChild(this._container.querySelector('div'))
      this.enterChat()
    }
  }

  /**
   * enter the message chat page if channel is chosen if will only show message sent on the same channel
   * otherwise, it will show all messages
  */
  enterChat () {
    this._container.appendChild(chatPage.content.cloneNode(true))
    this._messagesDiv = this.shadowRoot.querySelector('.messages-div')
    this._messageInputField = this.shadowRoot.querySelector('#messageField')
    this._sendButton = this.shadowRoot.querySelector('#sendButton')

    /** start connection of web socket */
    this.connect().then(() => '').catch(function (error) {
      console.log('WebSocket error: ' + error)
    })

    /** send message when press enter or click on send button */
    this._sendButton.addEventListener('click', (e) => { this.sendMessage() })
    this._messageInputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage()
      }
    })
  }

  /** start the connection of web socket */
  connect () {
    return new Promise((resolve, reject) => {
      this.socket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/')
      this.socket.onopen = () => resolve()
      this.socket.onerror = error => reject(error)

      /** when message recived call getmessage() function */
      this.socket.onmessage = response => {
        this.getMessage(JSON.parse(response.data))
      }
      /** close connection when click on close button  */
      this._closeicon.addEventListener('click', (e) => { this.socket.close() })
    })
  }

  /** send message */
  sendMessage () {
    var message = this._messageInputField.value
    this._messageInputField.value = ''
    if (message.length > 0) {
      this.socket.send(JSON.stringify({
        type: 'message',
        data: message,
        username: this.userName,
        channel: this.channel,
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }))
    }
  }

  /** display message on the page */
  getMessage (message) {
    /** ignore heartbeat message */
    if (message.type !== 'heartbeat') {
      /** create a message element from the template */
      var tempMsg = this.shadowRoot.querySelectorAll('template')[0]
      var messageBlock = document.importNode(tempMsg, true)
      /** display all message if no channel is entered */
      if (JSON.parse(window.localStorage.getItem('user')).channel == null) {
        messageBlock.content.querySelector('#msgUserName').textContent = message.username
        messageBlock.content.querySelector('#msgBody').textContent = message.data
        this._messagesDiv.appendChild(messageBlock.content.cloneNode(true))
      } else {
        /** if channel is entered, filter on the message will applied.
         * Only message from the same channel and notification will displayed
         * */
        if (message.type === 'notification' || message.channel === JSON.parse(window.localStorage.getItem('user')).channel) {
          messageBlock.content.querySelector('#msgUserName').textContent = message.username
          messageBlock.content.querySelector('#msgBody').textContent = message.data

          this._messagesDiv.appendChild(messageBlock.content.cloneNode(true))
        }
      }
    }

    /** keep page scroll to bottom after evrey message */
    // http://sourcetricks.com/2010/07/javascript-scroll-to-bottom-of-page.html
    this._messagesDiv.scrollTo(0, this._messagesDiv.scrollHeight)
  }

  static get observedAttributes () {
    return []
  }

  attributeChangedCallback (name, oldValue, newValue) {
  }
}
/** define chat-app as a custom HTML element */
window.customElements.define('chat-app', ChatApp)

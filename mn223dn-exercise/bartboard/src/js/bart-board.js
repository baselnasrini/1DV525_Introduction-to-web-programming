const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
    background:#002418;
    font-size: 1.2em;
    color:white;
    width:500px;
    height:200px;
    padding:10px;
    border:6px solid #9b3b00;
    border-bottom:12px solid #9b3b00;
    overflow:hidden;
    margin:10px;
    float:left;
    border-radius: 3px;
  }

  p{
    margin: 0;
    padding:0;
  }
  </style>

  <p id='text'></p>
`

class BartBoard extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this._p = this.shadowRoot.querySelector('#text')
    this._intervalID = null
    this._letter = 0
    this._text = ''
    this._speed = 50
  }

  static get observedAttributes () {
    return ['text', 'speed']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'text') {
      this._text = newValue
    } else if (name === 'speed') {
      this._speed = newValue
    }
  }

  connectedCallback () {
    // if (this.hasAttribute('text')) {
    //  this.shadowRoot.querySelector('#text').innerText = this.getAttribute('text')
    // }
    this.addEventListener('mousedown', this._onWrite)
    this.addEventListener('mouseup', this.stopWriting)
    this.addEventListener('mouseleave', this.stopWriting)
  }

  disconnectedCallback () {
    this.removeEventListener('mousedown', this._onWrite)
    this.removeEventListener('mouseup', this.stopWriting)
    this.removeEventListener('mouseleave', this.stopWriting)
    this.stopWriting()
  }

  _onWrite (event) {
    this._intervalID = setInterval(() => {
      this._p.textContent += this._text.charAt(this._letter++)
      if (this._letter >= this._text.length) {
        this._p.textContent += ' '
        this._letter = 0
      }
    }, this._speed)
  }

  stopWriting (event) {
    clearTimeout(this._intervalID)
  }
}

window.customElements.define('bart-board', BartBoard)

export {
  BartBoard
}

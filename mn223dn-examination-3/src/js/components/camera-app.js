import { WindowContainer } from './window-container.js'

/** A template of camera-app page */
const template = document.createElement('template')
template.innerHTML = `
    <link rel="stylesheet" href="css/camera-app.css">

    <div id="video-container">
        <video id="camera-stream" width="300"></video>

        <button class="negative ui labeled icon button">
          <i class="delete icon"></i>
          Clear filter
        </button>
        <button class="positive ui right labeled icon button">
          <i class="right eye icon"></i>
          Apply filter
        </button>
    </div>
 
`
/** class creates camera app custom HTMLElement extending window-continer */
export class CameraApp extends WindowContainer {
  constructor () {
    super()
    this._container.appendChild(template.content.cloneNode(true))

    /** add title and icon sto the window and remove setting icon */
    this._windowIcon.classList.add('camera', 'outline')
    this._windowTitle.textContent += 'Camera'
    this._settingButton.classList.add('removed')

    this._videoElem = this.shadowRoot.querySelector('#camera-stream')
    this._filterButton = this.shadowRoot.querySelector('.positive.button')
    this._removeFilterButton = this.shadowRoot.querySelector('.negative.button')
  }

  connectedCallback () {
    /** get stream from the camera */
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

    /** if getUserMedia supported by the browser */
    if (navigator.getUserMedia) {
    // request permission to use camera
      navigator.getUserMedia(
        {
          video: true
        },

        // when accept the permission
        (localMediaStream) => {
          this._videoElem.srcObject = localMediaStream
          this._videoElem.play()
          /** stop the video stream when click close icon */
          this._closeicon.addEventListener('click', (e) => { localMediaStream.getTracks()[0].stop() })
          /** apply random filter to video */
          this._filterButton.addEventListener('click', (e) => { this.applyFilter() })
          /** remove video filter */
          this._removeFilterButton.addEventListener('click', (e) => { this.removeFilter() })
        },

        // when refuse the permission
        function (err) {
          console.log('The following error occurred when trying to use getUserMedia: ' + err)
        }
      )
    } else {
      /** if the browser not support getUserMedia */
      alert('Sorry, your browser does not support getUserMedia')
    }
  }

  applyFilter () {
    var filtersArr = [
      'grayscale',
      'sepia',
      'blur',
      'brightness',
      'contrast',
      'hue-rotate',
      'hue-rotate2',
      'hue-rotate3',
      'saturate',
      'invert'
    ]
    /** pick a random filter */
    var filter = Math.floor(Math.random() * 10)
    console.log(filter)
    this._videoElem.classList = ''
    this._videoElem.classList.add(filtersArr[filter])
  }

  removeFilter () {
    this._videoElem.classList = ''
  }

  static get observedAttributes () {
    return []
  }

  attributeChangedCallback (name, oldValue, newValue) {

  }
}
/** define camera-app as a custom HTML element */
window.customElements.define('camera-app', CameraApp)

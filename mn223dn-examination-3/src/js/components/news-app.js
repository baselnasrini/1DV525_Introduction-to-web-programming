import { WindowContainer } from './window-container.js'

/** A template of the container */
const containerTemplate = document.createElement('template')
containerTemplate.innerHTML = `
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="css/news-app.css">

    <div class="w3-container">
        <div class="w3-row">
            <a href="#">
            <div id="sverige" class="w3-third tablink w3-bottombar w3-hover-light-grey w3-padding">Sweden News</div>
            </a>
            <a href="#">
            <div id="world" class="w3-third tablink w3-bottombar w3-hover-light-grey w3-padding">World News</div>
            </a>
            <a href="#">
            <div id="sport" class="w3-third tablink w3-bottombar w3-hover-light-grey w3-padding">Sport News</div>
            </a>
        </div>

        <template>
            <a href="" target="_blank"><div id="newsHead" class="ui blue segment"> <img id="articleImage" src="" alt="article picture"/>  <h5 id="newsTitle"></h5></div></a>
            <div id="newsBody" class="news-body"></div>
        </template>
        
        <template>
          <div id="articlesContainer">
          </div>
        </template>

    </div>
`
/** class creates news app custom HTMLElement extending window-continer */
export class NewsApp extends WindowContainer {
  constructor () {
    super()
    this._container.appendChild(containerTemplate.content.cloneNode(true))
    /** add title and icon sto the window and remove setting icon  */
    this._windowIcon.classList.add('newspaper', 'outline')
    this._windowTitle.textContent += 'Latest News'
    this._settingButton.classList.add('removed')

    this._tab = this.shadowRoot.querySelectorAll('.tablink')
  }

  connectedCallback () {
    /** add events to tab buttons */
    this._tab[0].addEventListener('click', (e) => { this.getNews(e) })
    this._tab[1].addEventListener('click', (e) => { this.getNews(e) })
    this._tab[2].addEventListener('click', (e) => { this.getNews(e) })
  }

  /** fix tab line border and fetch news and put them in container  */
  getNews (evt) {
    var i, tablinks

    /** return all tabs border color to grey after each new click */
    tablinks = this.shadowRoot.querySelectorAll('.w3-border-red')
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].classList.remove('w3-border-red')
    }

    /** change the chosen tab border color to red */
    evt.currentTarget.classList.add('w3-border-red')

    /** fetch news of the choosen topic and show them in container */
    this.fetchNews(evt.currentTarget.id)
  }

  fetchNews (category) {
    /** import the template of the article block */
    var articleTemp = this.shadowRoot.querySelectorAll('template')[0]
    var articleBlock = document.importNode(articleTemp, true).content

    /** import the template of the articles container */
    var conTemp = this.shadowRoot.querySelectorAll('template')[1]
    var conBlock = document.importNode(conTemp, true).content

    var container = conBlock.querySelector('#articlesContainer')

    /** remove the current fully continer from the window */
    if (this._container.querySelector('#articlesContainer')) {
      this._container.querySelector('#articlesContainer').remove()
    }

    /** set the url after each choose */
    var url
    if (category === 'sverige') {
      url = 'https://newsapi.org/v2/top-headlines?country=se&pageSize=25&apiKey=cc80131385334967a8d099ab2e5de5cb'
    } else if (category === 'world') {
      url = 'https://newsapi.org/v2/top-headlines?language=en&pageSize=25&apiKey=cc80131385334967a8d099ab2e5de5cb'
    } else if (category === 'sport') {
      url = 'https://newsapi.org/v2/top-headlines?category=sport&pageSize=25&apiKey=cc80131385334967a8d099ab2e5de5cb'
    }

    /** fetch news and show them */
    window.fetch(url).then(response => response.json()).then(response => {
      var articlesArr = response.articles
      /** iterate the aticles and put them in container */
      articlesArr.forEach((elem, i) => {
        /** if the article has an image link display it */
        if (elem.urlToImage) {
          articleBlock.querySelector('img').src = elem.urlToImage
          articleBlock.querySelector('img').style.display = 'block'
        } else {
          /** else, hide the image element */
          articleBlock.querySelector('img').style.display = 'none'
        }

        /** fill the article information and add it to container */
        articleBlock.querySelector('#newsTitle').textContent = elem.title
        articleBlock.querySelector('#newsHead').parentElement.href = elem.url
        articleBlock.querySelector('#newsBody').textContent = elem.description
        container.appendChild(articleBlock.cloneNode(true))
      })
    })

    this._container.appendChild(container)
  }

  static get observedAttributes () {
    return []
  }

  attributeChangedCallback (name, oldValue, newValue) {

  }
}

/** define news-app as a custom HTML element */
window.customElements.define('news-app', NewsApp)

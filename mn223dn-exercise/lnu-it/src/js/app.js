let linkElement = document.createElement('link')
linkElement.setAttribute('href', 'css/style.css')
linkElement.setAttribute('rel', 'stylesheet')

let headerTag = document.querySelector('HEADER')
headerTag.appendChild(linkElement)

console.log(headerTag)

let aTag = document.querySelectorAll('A')

for (let i = 0; i < aTag.length; i = i + 1) {
  aTag[i].classList.add('lnu')
}

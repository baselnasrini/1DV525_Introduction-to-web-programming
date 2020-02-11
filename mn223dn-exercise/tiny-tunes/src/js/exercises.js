function step01 () {
  let myText = document.createTextNode('Hello World')

  let pTag = document.querySelector('#step01_hello')

  pTag.appendChild(myText)
}

function step02 () {
  let h2Element = document.createElement('h2')
  let myText = document.createTextNode('This is a sub headline')
  h2Element.appendChild(myText)

  let tag = document.querySelector('#step02')

  tag.appendChild(h2Element)
}

function step03 () {
  let h2Element = document.createElement('h2')
  let myText = document.createTextNode('This is a sub headline')
  h2Element.appendChild(myText)

  let tag03 = document.querySelector('#step03')
  let attribute = document.querySelector('#step03 p')
  tag03.insertBefore(h2Element, attribute)
}

function step04 () {
  let attribute = document.querySelector('#step04').firstElementChild
  attribute.classList.add('red')
}

function step05 () {
  let attribute = document.querySelector('.greybox')
  attribute.addEventListener('click', function () { addText('You clicked!') }, true)

  let addText = function (text) {
    let clicktext = document.createElement('p')
    let myText = document.createTextNode(text)
    clicktext.appendChild(myText)

    let tag03 = document.querySelector('#step05')
    tag03.appendChild(clicktext)
  }
}

function step06 () {
  let element = document.getElementById('list06')
  let fragment = document.createDocumentFragment()
  for (let i = 0; i < 10; i++) {
    let li = document.createElement('li')
    li.textContent = i + 1
    fragment.appendChild(li)
  }
  element.appendChild(fragment)
}

function step07 () {
  let listElement = document.getElementById('list07')
  let template = document.querySelector('#step07-template')

  for (let i = 0; i < 5; i++) {
    var clone = document.importNode(template.content, true)
    let aElement = clone.querySelector('li a')
    aElement.href = 'https://coursepress.lnu.se/kurs/introduction-to-web-programming/'
    aElement.appendChild(document.createTextNode('Couse Home Page'))

    listElement.appendChild(clone)
  }
}

export {
  step01,
  step02,
  step03,
  step04,
  step05,
  step06,
  step07
}

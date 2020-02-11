let mainTag = document.querySelector('.main')
let nextButtonTag = document.querySelector('.nextButton')
mainTag.removeChild(nextButtonTag)
let answerInputTag = document.querySelector('.answerInput')
mainTag.removeChild(answerInputTag)
let radioButtonTag = document.querySelector('.radioButton')
mainTag.removeChild(radioButtonTag)
let newGameButtonTag = document.querySelector('.newGameButton')
mainTag.removeChild(newGameButtonTag)

let nameInputTag = document.querySelector('.nameInput')
let alternativesTag = document.querySelector('.alternatives')
let startButtonTag = document.querySelector('.startButton')
let scoreBoardButtonTag = document.querySelector('.scoreBoardButton')
let userName = ''
let questionTag = document.querySelector('.firstLine')
let timerTag = document.querySelector('.timer')
let firstURL = 'http://vhost3.lnu.se:20080/question/1'
let question = ''
const maxTime = 20
let currentTime = maxTime
let totalTime = 0
let interval = null
let score = 0

startButtonTag.addEventListener('click', event => {
  userName = nameInputTag.value
  if (userName.length > 0) {
    startQuiz()
  }
})

function startQuiz () {
  mainTag.removeChild(nameInputTag)
  mainTag.removeChild(startButtonTag)
  mainTag.removeChild(scoreBoardButtonTag)
  getQuestion(firstURL)
}

async function getQuestion (URL) {
  const response = await window.fetch(URL)
  const user = await response.json()
  firstURL = user.nextURL
  question = user.question
  alternativesTag.innerHTML = ``
  if (user.alternatives === undefined) {
    mainTag.appendChild(answerInputTag)
    mainTag.appendChild(nextButtonTag)
  } else {
    let altLength = Object.keys(user.alternatives).length
    let radioArr = Object.values(user.alternatives)

    for (let i = 0; i < altLength; i = i + 1) {
      let radio = document.createElement('input')
      radio.setAttribute('type', 'radio')
      radio.setAttribute('name', 'altRadio')
      radio.setAttribute('value', radioArr[i])
      let label = document.createElement('label')
      label.classList.add('alt')
      label.textContent = radioArr[i]
      let br = document.createElement('br')
      alternativesTag.appendChild(radio)
      alternativesTag.appendChild(label)
      alternativesTag.appendChild(br)
    }
    mainTag.appendChild(nextButtonTag)
  }

  displayQuestion(question)
  startTimer()

  nextButtonTag.addEventListener('click', event => {
    if (user.alternatives === undefined) {
      let answer = answerInputTag.value
      answerInputTag.value = ''
      if (answer.length > 0) {
        sendAnswer(firstURL, answer)
        mainTag.removeChild(answerInputTag)
      }
    } else {
      let radioTag = document.getElementsByName('altRadio')
      for (let i = 0; i < radioTag.length; i = i + 1) {
        if (radioTag[i].checked) {
          let answer = 'alt' + (i + 1)
          document.querySelectorAll('input').forEach(e => e.parentNode.removeChild(e))
          document.querySelectorAll('.alt').forEach(e => e.parentNode.removeChild(e))
          sendAnswer(firstURL, answer)
        }
      }
    }
  })
}

async function sendAnswer (URL, query) {
  stopTimer()
  let answer = { answer: query }
  let config = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(answer) }
  const response = await window.fetch(URL, config)
  const user = await response.json()

  displayQuestion(user.question)
  score = score + currentTime
  if (user.message === 'Wrong answer! :(') {
    lose()
  } else if (user.nextURL === undefined) {
    showscoreBoard()

    let topScore
    if (JSON.parse(window.localStorage.getItem('topScore')) === null) {
      topScore = []
    } else {
      topScore = JSON.parse(window.localStorage.getItem('topScore'))
    }
    topScore.push({ name: userName, score: score })
    topScore.sort((p1, p2) => { return p2.score - p1.score })
    topScore.splice(5)
    window.localStorage.setItem('topScore', JSON.stringify(topScore))

    window.location.reload()
  } else {
    getQuestion(user.nextURL)
  }
}

function displayQuestion (question) {
  questionTag.textContent = question
}

function displayTime () {
  const timer = currentTime + ' sec. remain of ' + maxTime
  timerTag.textContent = timer
}

function startTimer () {
  currentTime = maxTime
  interval = setInterval(() => {
    currentTime = currentTime - 1
    displayTime()
    if (currentTime <= 0) {
      lose()
    }
  }, 1000)
}

function lose () {
  let tag = questionTag.nextSibling
  while (tag !== null) {
    mainTag.removeChild(tag)
    tag = questionTag.nextSibling
  }
  stopTimer()
  displayQuestion('Game Over!!!')
  mainTag.appendChild(newGameButtonTag)
  newGameButtonTag.addEventListener('click', event => {
    window.location.reload()
  })
}

function stopTimer () {
  clearInterval(interval)
  totalTime = totalTime + (maxTime - currentTime)
}

scoreBoardButtonTag.addEventListener('click', event => {
  showscoreBoard()
})

function showscoreBoard () {
  let storage = JSON.parse(window.localStorage.getItem('topScore'))
  let text = 'Top Scores:  '
  let topScoreWindow = window.open('', 'top', 'width=500,height=550,location=no,status=no')
  topScoreWindow.document.write('<html><head><title>Top Score</title><link rel="stylesheet" href="css/style.css"></head><body class=timer>')

  topScoreWindow.document.write(text)
  topScoreWindow.document.write('<br>')
  for (let i = 0; i < storage.length; i++) {
    text = i + 1 + '.   ' + storage[i].name + ': ' + storage[i].score + ' point '
    topScoreWindow.document.write(text)
    topScoreWindow.document.write('<br>')
  }
}

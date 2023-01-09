/* Show mouse and touch events in the HTML canvas element
https://sekika.github.io/2020/01/07/CanvasEvent/
Author: Katsutoshi Seki
License: MIT License
*/

const c = document.getElementById('canvas')
const ctx = c.getContext('2d')
let dragging = false
let lastPos

function move(pos) {
  if (dragging) {
    ctx.moveTo(lastPos[0], lastPos[1])
    ctx.lineTo(pos[0], pos[1])
    ctx.stroke()
    lastPos = pos
  }
}

function down(pos) {
  dragging = true
  lastPos = pos
}

function up(pos) {
  move(pos)
  dragging = false
}

function pos(e) {
  const x = e.clientX - c.getBoundingClientRect().left
  const y = e.clientY - c.getBoundingClientRect().top
  return [x, y]
}

function strPair(pos) {
  return ` (${pos[0]}, ${pos[1]})`
}

function showMessage(message) {
  const current = document.getElementById('message').textContent
  message = `${current}\n${message}`
  document.getElementById('message').innerHTML = message
}

function showMessageMouseMove(message) {
  document.getElementById('messageMouseMove').innerHTML = message
}

function showMessageTouchMove(message) {
  document.getElementById('messageTouchMove').innerHTML = message
}

function init() {
  let i
  let message
  ctx.strokeStyle = 'blue'
  ctx.lineWidth = 1
  c.addEventListener('mousedown', (e) => {
    showMessage(`mousedown${strPair(pos(e))}`)
    down(pos(e))
  })
  c.addEventListener('mouseup', (e) => {
    showMessage(`mouseup${strPair(pos(e))}`)
    up(pos(e))
  })
  c.addEventListener('click', (e) => {
    showMessage(`click${strPair(pos(e))}`)
  })
  c.addEventListener('mousemove', (e) => {
    showMessageMouseMove(`mousemove${strPair(pos(e))}`)
    move(pos(e))
  })
  c.addEventListener('touchstart', (e) => {
    message = 'touchstart'
    for (i = 0; i < e.changedTouches.length; i++) {
      message += strPair(pos(e.changedTouches[i]))
    }
    showMessage(message)
    if (e.changedTouches.length === 1) {
      down(pos(e.changedTouches[0]))
    }
  })
  c.addEventListener('touchcancel', (e) => {
    message = 'touchcancel'
    for (i = 0; i < e.changedTouches.length; i++) {
      message += strPair(pos(e.changedTouches[i]))
    }
    showMessage(message)
  })
  c.addEventListener('touchend', (e) => {
    message = 'touchend'
    for (i = 0; i < e.changedTouches.length; i++) {
      message += strPair(pos(e.changedTouches[i]))
    }
    showMessage(message)
    if (e.changedTouches.length === 1) {
      up(pos(e.changedTouches[0]))
    }
  })
  c.addEventListener('touchmove', (e) => {
    if (document.formOption.noSwipe.checked) {
      e.preventDefault()
    }
    message = 'touchmove'
    for (i = 0; i < e.changedTouches.length; i++) {
      message += strPair(pos(e.changedTouches[i]))
    }
    showMessageTouchMove(message)
    if (e.changedTouches.length === 1) {
      move(pos(e.changedTouches[0]))
    }
  })
}

function clear() {
  ctx.clearRect(0, 0, c.width, c.height)
  document.getElementById('message').innerHTML = ''
  showMessageMouseMove('(mousemove)')
  showMessageTouchMove('(touchmove)')
}

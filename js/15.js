/* 15 Puzzle
https://sekika.github.io/2020/01/14/15Puzzle/
Author: Katsutoshi Seki
License: MIT License
*/

// Load canvas
const c = document.getElementById('canvas')
const ctx = c.getContext('2d')

// Entry point
window.onload = function () {
  board.newGame()
  initEvent()
}

// Block of predetermined parameters --------------------

// Default values
const defaultPuzzleSize = 4
const defaultGridSize = 100

// Limit of parameters
const minPuzzleSize = 2
const maxPuzzleSize = 30
const minGridSize = 10
const maxCanvasSize = 2000

// Local Storage
const localStoragePrefix = '15puzzle_'

// Message

const lang = document.getElementById('lang').textContent
const message = {
  en: {
    puzzle: ' Puzzle',
    start: 'Starting a new game',
    showBest: 'Best score: BEST moves',
    move: 'Move MOVE',
    finished: 'Finished in MOVE moves!',
    bestScore: ' Best score 😁',
    goal: 'This is the solved position.',
    color: 'Select color of tiles',
    inputSize: 'Input size of the tiles.'
  },
  ja: {
    puzzle: 'パズル',
    start: 'ゲーム開始！',
    showBest: '最短記録はBEST手',
    move: 'MOVE手動かしました。',
    finished: 'MOVE手で完成！',
    bestScore: '最短記録だ😁',
    goal: 'この配置を目指します。',
    color: '駒の色を選んでください。',
    inputSize: '駒の大きさを入力してください。'
  }
}[lang]

// Appearance - Pull request is welcome

const finishTile = ['😃', '😆', '😊', '🤠', '👌', '🐧', '🐱', '🦜', '🌻', '🌈']

const colorPalette = [{ // Color palette: available color combinations
  background: '#440D19',
  tile: '#F4EDBE',
  number: '#375DC5'
}, {
  background: '#5d6f66',
  tile: '#f5cbb7',
  number: '#5c4e5f'
}, {
  background: '#ff9d1e',
  tile: '#bee600',
  number: '#019fd3'
}, {
  background: '#F5F6CE',
  tile: '#FE9A2E',
  number: '#0000FF'
}, {
  background: '#B45F04',
  tile: '#A9F5F2',
  number: '#0404B4'
}, {
  background: '#61380B',
  tile: '#D0A9F5',
  number: '#0B2161'
}, {
  background: '#000000',
  tile: '#FFFFFF',
  number: '#000000'
}, {
  background: '#FFFFFF',
  tile: '#000000',
  number: '#FFFFFF'
}, {
  background: '#b4e001',
  tile: '#1458c7',
  number: '#e2e2b9'
}]

// Block of functions ---------------------------

const initEvent = function () { // Add mouse and touch events
  c.addEventListener('mousedown', (e) => {
    board.down(pos(e))
  })
  c.addEventListener('touchstart', (e) => {
    if (e.changedTouches.length === 1) {
      board.down(pos(e.changedTouches[0]))
    }
  })
}

const pos = function (e) { // Get position from event
  // Mouse position in canvas coordinate
  const x = e.clientX - c.getBoundingClientRect().left
  const y = e.clientY - c.getBoundingClientRect().top
  // Mouse position in grid coordinate
  const boardX = Math.floor(x / board.gridWidth)
  const boardY = Math.floor(y / board.gridHeight)
  // Return position in the board as 1D parameter
  return boardX + boardY * board.n
}

const showMessage = function (mes) { // Show message
  document.getElementById('message').textContent = mes
}

const getStorage = function (key) { // Get local storage.
  // Prefix is attached for indicating the name of this application.
  return localStorage.getItem(localStoragePrefix + key)
}

const setStorage = function (key, value) { // Set local storage
  localStorage.setItem(localStoragePrefix + key, String(value))
}

// Board object of the puzzle -----------------------------

const board = {
  loadSetting() { // Load settings from local storage of the browzer
    // board.n = "n" in storage
    this.n = Number(getStorage('n'))
    if (isNaN(this.n) || this.n < minPuzzleSize) {
      this.n = defaultPuzzleSize
    }
    this.n = Math.floor(this.n)
    if (this.n > maxPuzzleSize) {
      this.n = maxPuzzleSize
    }
    // Read board.bestScore from storage
    this.bestScore = Number(getStorage(`best_${String(this.n)}`))
    if (isNaN(this.bestScore) || this.bestScore < 0) {
      this.bestScore = 0
    }
    this.bestScore = Math.floor(this.bestScore)
    // board.gridWidth = "size" in storage
    this.gridWidth = Number(getStorage('size'))
    if (isNaN(this.gridWidth) || this.gridWidth < minGridSize) {
      this.gridWidth = defaultGridSize
    }
    this.gridWidth = Math.floor(this.gridWidth)
    if (this.gridWidth * this.n > maxCanvasSize) {
      this.gridWidth = Math.floor(maxCanvasSize / this.n)
    }
    // Select color from color pallete according to the setting of storage
    let i = Number(getStorage('color'))
    if (isNaN(i) || i < 0 || i >= colorPalette.length) {
      i = 0
    }
    this.color = colorPalette[Math.floor(i)]
  },
  initialize() { // Initialize board
    // Parameters are calculated from board.n and board.gridWidth,
    // which should be predetermined with board.localSetting()

    // Puzzle name determined from board.n
    this.puzzleName = this.n * this.n - 1 + message.puzzle
    document.getElementsByTagName('title')[0].innerHTML = this.puzzleName
    document.getElementsByTagName('h1')[0].innerHTML = this.puzzleName
    // Board size determined from board.gridWidth
    if (this.n > 10) {
      this.numSize = Math.floor(this.gridWidth / 4) + 3
    } else {
      this.numSize = Math.floor(this.gridWidth / 2) + 4
    }
    this.gridHeight = this.gridWidth
    this.tileMargin = Math.floor(this.gridWidth / 30) + 1
    this.tileWidth = this.gridWidth - 2 * this.tileMargin
    this.tileHeight = this.gridHeight - 2 * this.tileMargin
    this.numDigit = Math.floor(this.numSize / 3)
    this.numLeft = Math.floor(this.gridWidth / 2) - this.numDigit + this.tileMargin
    this.numBottom = Math.floor(this.gridWidth / 2) + this.numDigit + this.tileMargin
    this.numFont = `${String(this.numSize)}px serif`
    c.width = this.gridWidth * this.n + this.tileMargin / 2
    c.height = this.gridHeight * this.n + this.tileMargin / 2
    // Change size of message and button
    this.htmlFont = `${Math.floor(this.numSize / 3) + 5}px`
    document.getElementById('message').style.fontSize = this.htmlFont
    this.btnWidth = `${this.gridWidth}px`
    this.btnHeight = `${Math.floor(this.gridHeight / 4) + 20}px`
    const btnNew = document.getElementById('new')
    btnNew.style.width = this.btnWidth
    btnNew.style.height = this.btnHeight
    btnNew.style.fontSize = this.htmlFont
  },
  initParam() { // Initialize parameters after shuffle
    this.finished = false
    this.move = 0
    this.prevZero = -1
    this.modeColor = false
    this.tileInitial = Array.from(this.tile)
  },
  newGame() { // New game
    this.loadSetting()
    this.initialize()
    this.shuffleTiles()
    this.drawBoard()
  },
  restartGame() { // Restart same game
    if (this.modeColor) {
      this.escapeColorMode()
    }
    this.tile = this.tileInitial
    this.initParam()
    this.drawBoard()
  },
  incPuzzleSize() { // Increase the size of puzzle
    if (this.n < maxPuzzleSize) {
      setStorage('n', this.n + 1)
    }
    this.newGame()
  },
  decPuzzleSize() { // Decrease the size of puzzle
    if (this.n > minPuzzleSize) {
      setStorage('n', this.n - 1)
    }
    this.newGame()
  },
  changeMode() { // Change color mode
    if (this.modeColor) {
      this.escapeColorMode()
      return
    }
    this.modeColor = true
    this.n = Math.ceil(Math.sqrt(colorPalette.length))
    this.initialize()
    this.tileBackup = Array.from(board.tile)
    this.drawBackground()
    showMessage(message.color)
    this.tile = []
    for (let i = 0; i < colorPalette.length; i++) {
      this.tile.push(i + 1)
      this.color = colorPalette[i]
      this.drawTile(i)
    }
  },
  changeTileSize() { // Size of tile button
    this.loadSetting()
    const size = prompt(message.inputSize, this.gridWidth)
    this.gridWidth = size || this.gridWidth
    setStorage('size', this.gridWidth)
    this.initialize()
    this.drawBoard()
  },
  posZero() { // position of 0 = empty grid
    const notFound = 99
    for (let i = 0; i < this.tile.length; i++) {
      if (this.tile[i] === 0) {
        return i
      }
    }
    return notFound
  },
  row(i) { // row number of position i
    return Math.floor(i / this.n)
  },
  inversion() { // Count inversions of the board
    // It is critical for determining if the puzzle is solvable.
    // See https://www.geeksforgeeks.org/check-instance-15-puzzle-solvable/
    let inv = 0
    for (let i = 0; i < this.tile.length - 1; i++) {
      for (let j = i + 1; j < this.tile.length; j++) {
        if (this.tile[j] && this.tile[i] > this.tile[j]) {
          inv++
        }
      }
    }
    return inv
  },
  isSolvable() { // Check if the puzzle is solvable
    let i = this.inversion()
    if (this.n % 2 === 0) {
      i += this.row(this.posZero()) + 1
    }
    if (i % 2 === 0) {
      return true
    }
    return false
  },
  isFinished() { // Check if the puzzle is finished
    for (let i = 0; i < this.n * this.n - 1; i++) {
      if (this.tile[i] !== i + 1) {
        return false
      }
    }
    return true
  },
  isMovable(i) { // Check if position i is movable
    const z = this.posZero()
    if (i === z) {
      return false
    }
    if (i % this.n === z % this.n) {
      this.moveTile = Math.abs((z - i) / this.n)
      this.moveDir = (z - i) / this.moveTile
      return true
    }
    if (this.row(i) === this.row(z)) {
      this.moveTile = Math.abs(z - i)
      this.moveDir = (z - i) / this.moveTile
      return true
    }
    return false
  },
  swapTile(i, j) { // Swap tiles of positions i and j
    [this.tile[i], this.tile[j]] = [this.tile[j], this.tile[i]]
  },
  down(i) { // Down movement of mouse or touch at position i
    // Color mode
    if (this.modeColor) {
      if (i < colorPalette.length) {
        setStorage('color', i)
        this.escapeColorMode()
      }
      return
    }
    // Normal mode
    if (!this.finished) {
      if (this.isMovable(i)) {
        this.moveFrom(i)
      }
      if (this.isFinished()) {
        this.finish()
      }
    }
  },
  moveFrom(i) { // Slide tiles from position i
    // If it is a revert move, move is not counted to allow mistake
    if (i === this.prevZero) {
      this.move -= 2
    } else {
      this.prevZero = this.posZero()
    }
    // Slide the tile(s)
    for (let j = this.moveTile; j > 0; j--) {
      this.swapTile(i + this.moveDir * j, i + this.moveDir * (j - 1))
    }
    this.move++ // Increase the count of move
    this.drawBoard()
  },
  initialTiles() { // Make initial (goal) arrangement of tiles
    this.tile = []
    for (let i = 0; i < this.n * this.n - 1; i++) {
      this.tile.push(i + 1)
    }
    this.tile.push(0)
  },
  shuffleTiles() { // Shuffle tiles for a new game
    // Prepare initial arrangement
    this.initialTiles()
    // Fisher–Yates shuffle to make random permutation
    for (let i = this.tile.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      this.swapTile(i, j)
    }
    // Make sure that the puzzle is solvable
    if (!this.isSolvable()) {
      if (this.tile[0] && this.tile[1]) {
        this.swapTile(0, 1)
      } else {
        this.swapTile(2, 3)
      }
    }
    // Avoid finished arrangement
    if (this.isFinished()) {
      this.shuffleTiles()
    }
    // Reset parameters
    this.initParam()
  },
  drawBackground() { // Draw background of the board
    ctx.fillStyle = this.color.background
    ctx.fillRect(0, 0, c.width, c.height)
    ctx.stroke()
  },
  drawTile(i) { // Draw a tile of position i
    let digitOffset
    let num
    const x = i % this.n * this.gridWidth
    const y = this.row(i) * this.gridHeight
    const flushTileSize = 0.7
    if (this.tile[i] || this.finished) {
      // Note that finish tile is drawn at empty position when finished
      ctx.fillStyle = this.color.tile
      ctx.fillRect(x + this.tileMargin, y + this.tileMargin, this.tileWidth, this.tileHeight)
      ctx.fillStyle = this.color.number
      ctx.font = this.numFont
      if (this.tile[i]) {
        num = this.tile[i]
        digitOffset = Math.floor(Math.log10(num)) * this.numDigit
      } else {
        num = finishTile[Math.floor(Math.random() * finishTile.length)]
        digitOffset = this.numDigit * flushTileSize
      }
      ctx.fillText(num, x + this.numLeft - digitOffset, y + this.numBottom)
      ctx.stroke()
    }
  },
  drawBoard() { // Draw the board of current arrangement of tiles
    this.drawBackground()
    for (let i = 0; i < this.tile.length; i++) {
      this.drawTile(i)
    }
    // Message
    if (this.move) {
      showMessage(message.move.replace('MOVE', this.move))
    } else if (this.bestScore) {
      let mes = message.showBest.replace('BEST', this.bestScore)
      if (this.bestScore === 1) {
        mes = mes.replace('moves', 'move')
      }
      showMessage(mes)
    } else {
      showMessage(message.start)
    }
  },
  showGoal() { // Show goal position
    this.initialTiles()
    this.finished = false
    this.drawBoard()
    showMessage(message.goal)
    this.finished = true
  },
  finish() { // Finish the puzzle
    this.finished = true // Set this flag for preventing movement of tile
    this.drawBoard()
    // Message for showing the puzzle is finished
    let mes = message.finished.replace('MOVE', this.move)
    if (this.move === 1) {
      mes = mes.replace('moves', 'move')
    }
    if (this.bestScore && this.bestScore < this.move) {
      showMessage(mes)
    } else {
      showMessage(mes + message.bestScore)
      setStorage(`best_${String(this.n)}`, this.move)
    }
  },
  escapeColorMode() { // Escape from color mode
    this.modeColor = false
    this.loadSetting()
    this.initialize()
    this.tile = this.tileBackup
    this.drawBoard()
  }
}

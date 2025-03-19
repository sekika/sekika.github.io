/* Dodgem https://sekika.github.io/dodgem/
   Author: Katsutoshi Seki
   License: MIT License */

/* eslint-disable no-magic-numbers, no-alert */

/* ===========================================================================
 * Entry point
 */
window.onload = function () {
  board.loadWindow()
}

/* ===========================================================================
 * Block of predetermined parameters
 */

// URL of the evaluation value database
// It was obtained through almost complete reading.
const urlEval = '/file/dodgem/dodgem_eval.json.gz'

// Game setting
const drawRepetition = 3 // Determine the draw with this number of repetitions

// Level of computer
const defaultLevel = 1
const maxLevel = 3

// Wait in watching mode (ms)
const slowThink = 1500
const fastThink = 150

// Canvas
const c = document.getElementById('canvas')
const ctx = c.getContext('2d')

// Game size
const defaultGameSize = 4
const minGameSize = 3
const maxGameSize = 5

// Local Storage
const localStoragePrefix = 'dodgem_'

// Evaluation value for winning
const evalWin = 100

// Drawing size
const maxCanvasSize = 2000
const defaultGridSize = 100
const minGridSize = 10

// Piece
const pieceChar = ['▶︎', '▲']
const colorPiece = ['#015fd3', '#FE322E']
const pieceHtml = function (i) {
  return `<span style="color: ${colorPiece[i]};">${pieceChar[i]}</span>`
}

// Color
const colorBackground = '#440D19' // Background (grid)
const colorTile = '#F4EDBE' // Tile
const colorSelect = '#D0C380' // Tile when a piece is selected
const colorTileFinished = '#ffeee6' // Tile when game is finished

/* ===========================================================================
 * Message localization
 */
const lang = document.getElementById('lang').textContent
const message = {
  en: {
    pleaseWait: 'Please wait...',
    loading: 'Loading evaluation data',
    loadError: 'Could not load evaluation data',
    ready: 'Ready to play!',
    pressNewGame: 'Select game setup and press the "New game" button.<br>See "How to play dodgem" below for detail.',
    turn: ['Player 1', 'Player 2'],
    alt: 'Alternate',
    human: 'You',
    comp: 'Computer',
    showThinking: 'TURN is thinking',
    showWin: 'TURN won🏆',
    draw: 'Draw🤝',
    winDetermined: 'Winning position for TURN',
    selectPiece: 'Select PIECE to move',
    moveTo: 'Where to move?',
    removeTap: ' (Same PIECE to remove)',
    win: 'win',
    loss: 'loss',
    numDraw: 'draw',
    confirmStop: 'Quit this game?'
  },
  ja: {
    pleaseWait: 'お待ちください...',
    loading: '評価値データを読み込み中です',
    loadError: '評価値データを読み込めませんでした',
    ready: '準備ができました！',
    pressNewGame: 'ゲームの設定を選んで「ゲーム開始」を押してください。詳細は遊び方（↓）参照。',
    turn: ['先手', '後手'],
    alt: '先後交代',
    human: 'あなた',
    comp: 'コンピュータ',
    showThinking: 'TURNが考えています',
    showWin: 'TURNの勝ちです🏆',
    draw: '引き分けです🤝',
    winDetermined: 'TURNの必勝形です',
    selectPiece: 'PIECEを選んでください',
    moveTo: 'どこへ動かす？',
    removeTap: '（同じPIECEで除去）',
    win: '勝',
    loss: '敗',
    numDraw: '分',
    confirmStop: 'ゲームを中断しますか？'
  }
}[lang]

/* ===========================================================================
 * Block of functions
 */

const showMessage = function (mes) { // Show message
  document.getElementById('message').innerHTML = mes
}

const showStatus = function (mes) { // Show status of a game
  document.getElementById('status').innerHTML = mes
}

const getStorage = function (key) { // Get local storage.
  // Prefix is attached for indicating the name of this application.
  return localStorage.getItem(localStoragePrefix + key)
}

const setStorage = function (key, value) { // Set local storage
  localStorage.setItem(localStoragePrefix + key, String(value))
}

const getSelectedRadioValue = function (name) {
  // Get selected value of a radio button
  const radios = document.getElementsByName(name)
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      return radios[i].value
    }
  }
  return null
}

const setSelectedRadioValue = function (name, value) {
  // Set a value to a radio button
  document.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
    input.checked = input.value === value
  })
}

/* ===========================================================================
 * Board object of the game
 *
 * The status of the game is stored in the properties of the board object
 */

const board = {
  /* ===========================================================================
   * Initialization functions
   */
  loadWindow() { // Entry point when window was loaded
    // Initialize
    this.timerThink = null
    this.error = false
    this.continuousPlay = false
    this.waitThink = slowThink
    this.numWin = [0, 0]
    this.numDraw = 0
    this.result = ''
    this.session = ''
    this.loadSetting()
    this.initialize()
    // Draw empty board
    this.pieces = [[],[]]
    this.drawTiles(colorTile)
    // Show loading message
    showMessage(`<div style="font-weight: bold; color: red;">⏳ ${message.pleaseWait}</div>`)
    showStatus(message.loading)
    // Load evaluation data and start
    this.loadEvalData()
  },
  async loadEvalData() { // Load evaluation data and start the game
    let response
    try {
      response = await fetch(urlEval, {method: 'GET'})
      window.pako.deflate('')
    } catch (e) {
      if (e.message.includes('deflate')) {
        this.loadFail('pako is not loaded')
      } else {
        this.loadFail(`${e.name}: ${e.message}`)
      }
      return
    }
    if (response.ok) {
      this.gzippedEvalMap = await response.arrayBuffer()
      this.reloadEvalData()
      if (Object.keys(this.evalMap['3']).length < 100) {
        this.loadFail('Inconsistent evaluation data')
        return
      }
      // Start the game
      this.setInitPos()
      this.drawTiles(colorTile)
      showMessage(`${pieceHtml(0)}${pieceHtml(1)} ${message.ready}`)
      showStatus(message.pressNewGame)
      this.finished = true
      this.initEvent()
    } else {
      this.loadFail(`HTTP ${response.status}: ${response.statusText}`)
    }
  },
  loadFail(errorMessage) { // Failed loading evaluation data
    this.error = true
    showMessage(message.loadError)
    showStatus(errorMessage)
  },
  reloadEvalData() { // Reload evaluation data
    // Decompress gzipped data with pako, and parse json
    if (this.gzippedEvalMap) {
      const evalMap = window.pako.ungzip(new Uint8Array(this.gzippedEvalMap), { to: 'string' })
      this.evalMap = JSON.parse(evalMap)
    }
  },
  loadSetting() { // Load settings from local storage of the browzer
    // this.n = "n" in storage
    this.n = Number(getStorage('n'))
    if (isNaN(this.n) || this.n < minGameSize) {
      this.n = defaultGameSize
    }
    this.n = Math.floor(this.n)
    if (this.n > maxGameSize) {
      this.n = maxGameSize
    }
    // set radio button of turn to "turn" in storage
    setSelectedRadioValue('board', this.n.toString())
    const selectedPlayer = getStorage('turn')
    if (['sente', 'gote', 'alt', 'comp'].includes(selectedPlayer)) {
      setSelectedRadioValue('turn', selectedPlayer)
    }
    if (getSelectedRadioValue('turn') === 'comp') {
      this.onCompSelected()
    }
    // this.gridWidth = "size" in storage
    this.gridWidth = Number(getStorage('size'))
    if (isNaN(this.gridWidth) || this.gridWidth < minGridSize) {
      this.gridWidth = defaultGridSize
    }
    this.gridWidth = Math.floor(this.gridWidth)
    if (this.gridWidth * this.n > maxCanvasSize) {
      this.gridWidth = Math.floor(maxCanvasSize / this.n)
    }
    // Level of computer
    this.level = Number(getStorage('level'))
    if (isNaN(this.level) || this.level < 1) {
      this.level = defaultLevel
    }
    this.level = Math.floor(this.level)
    if (this.level > maxLevel) {
      this.level = maxLevel
    }
    setSelectedRadioValue('level', this.level.toString())
    this.result = ''
  },
  newGame() { // Start a new game
    if (this.error) {
      return
    }
    if (this.result !== '' && !this.finished) {
      if (confirm(message.confirmStop)) {  
        this.numWin = [0, 0]
        this.numDraw = 0
        this.result = ''
      } else {
        return
      }
    }
    this.initialize()
    this.drawBoard()
  },
  initialize() { // Initialize board
    if (this.timerThink !== null) {
      clearTimeout(this.timerThink)
    }
    const selectedN = parseInt(getSelectedRadioValue('board'), 10)
    if (minGameSize <= selectedN <= maxGameSize) {
      this.n = selectedN
      setStorage('n', this.n)
    }
    const selectedLevel = parseInt(getSelectedRadioValue('level'), 10)
    if (selectedLevel >= 1 <= maxLevel) {
      this.level = selectedLevel
      setStorage('level', this.level)
    }
    const selectedPlayer = getSelectedRadioValue('turn')
    const human = 0
    let sessionPlayer
    if (selectedPlayer === 'sente') {
      this.players = [human, this.level]
      sessionPlayer = `${message.turn[0]} ${pieceHtml(0)} (vs L${this.level})`
    }
    if (selectedPlayer === 'gote') {
      this.players = [this.level, human]
      sessionPlayer = `${message.turn[1]} ${pieceHtml(1)} (vs L${this.level})`
    }
    if (selectedPlayer === 'alt') {
      if (Array.isArray(this.players) && this.players[0] > human && this.players[1] === human) {
        this.players = [human, this.level]
      } else {
        this.players = [this.level, human]
      }
      sessionPlayer = `${message.alt} ${pieceHtml(0)}${pieceHtml(1)} (vs L${this.level})`
    }
    if (selectedPlayer === 'comp') {
      this.players = [this.level, this.level]
      sessionPlayer = `${message.comp} L${this.level} ${message.turn[0]}`
    }
    setStorage('turn', selectedPlayer)
    const session = `${this.n}×${this.n} ${sessionPlayer}`
    if (this.session !== session) {
      this.numWin = [0, 0]
      this.numDraw = 0
      this.result = ''
    }
    this.session = session
    this.reloadEvalData()
    this.setBoardParam()
    this.setInitPos()
  },
  setBoardParam() {
    // Parameters are calculated from board.n and board.gridWidth,
    // which should be predetermined with board.localSetting()

    // Board size determined from board.gridWidth
    this.pieceSize = Math.floor(this.gridWidth * 0.7)
    this.gridHeight = this.gridWidth
    this.tileMargin = Math.floor(this.gridWidth / 30) + 1  
    this.tileWidth = this.gridWidth - 2 * this.tileMargin
    this.tileHeight = this.gridHeight - 2 * this.tileMargin
    this.pieceLeft = Math.floor(this.gridWidth / 2) - Math.floor(this.pieceSize / 2) + this.tileMargin
    this.pieceBottom = Math.floor(this.gridWidth / 2) + Math.floor(this.pieceSize / 3) + this.tileMargin  
    this.pieceFont = `${String(this.pieceSize)}px serif`
    c.width = this.gridWidth * this.n + this.tileMargin / 2
    c.height = this.gridHeight * this.n + this.tileMargin / 2
    // Change size of message and button
    this.htmlFont = `${Math.floor(this.pieceSize / 3) + 5}px`  
    document.getElementById('message').style.fontSize = this.htmlFont
    const btnNew = document.getElementById('new')
    btnNew.style.fontSize = this.htmlFont
  },
  setInitPos() { // Set initial position
    this.pieces = this.initPos(this.n)
    this.lastRemain = this.remain(this.pieces)
    this.countDraw = 0
    this.turn = 0
    this.moving = false
    this.thinking = false
    this.finished = false
    this.draw = false
    this.winDetermined = -1
    this.moveHistory = []
    this.stopping = false
    this.showTurn = message.turn
    if (Math.min(...this.players) === 0 && Math.max(...this.players) > 0) {
      if (this.players[0] === 0) {
        this.showTurn = [message.human, message.comp]
      } else {
        this.showTurn = [message.comp, message.human]
      }
    }
    this.setStatus()
  },
  setStatus() { // Set status of the game
    this.teban = `${this.showTeban(0)}<br>${this.showTeban(1)}`
    if (this.result === '') {
      showStatus(`${this.teban}`)
    } else {
      showStatus(`${this.teban}<br>${this.result}`)
    }
  },
  showTeban(i) { // Used from setStatus(i)
    const player = [message.human, `${message.comp} L1`, `${message.comp} L2`, `${message.comp} L3`]
    return `${message.turn[i]} ${pieceHtml(i)} ${player[this.players[i]]}`
  },
  repeatGame() { // Automatic repeating of a game
    if (this.continuousPlay && Math.min(...this.players) > 0) {
      if ((this.numWin[0] + this.numWin[1] + this.numDraw) % this.numRepetition > 0) {
        this.newGame()
      }
    }
  },
  /* ===========================================================================
   * Play computer's move
   */
  playComp() { // Main thinking function
    this.thinking = true
    const pos = this.nextPositions(this.pieces, this.turn)
    let minEval = evalWin + 2
    let p = []
    const depth = this.getDepth()
    // Evaluate all the possible moves
    for (let i = 0; i < pos.length; i++) {
      let e = this.evaluate(pos[i], 1 - this.turn, depth)
      if (depth === 1 && Math.abs(e) < evalWin) {
        e = this.remain(pos[i])
      }
      if (e < minEval) {
        p = [pos[i]]
        minEval = e
      } else if (e === minEval) {
        p.push(pos[i])
      }
    }
    // Select moves that are not in the history
    const pDiff = p.filter(pos => !this.moveHistory.includes(this.makeKey(pos, this.turn)))

    if (pDiff.length < p.length) {
      if (pDiff.length === 0) {
        const count = new Map()
        for (const pos of p) {
          const key = this.makeKey(pos, this.turn)
          const c = this.moveHistory.filter(x => x === key).length
          if (!count.has(c)) {
            count.set(c, [])
          }
          count.get(c).push(pos)
        }
        const minCount = Math.min(...count.keys())
        p = count.get(minCount)
        // Draw when repeated certain numbers
        if (minCount >= drawRepetition - 1) {
          this.finished = true
          this.draw = true
        }
      } else {
        p = pDiff
      }
    }
    // Win determined
    if (minEval === -evalWin && !this.draw && this.level === 3) {
      this.winDetermined = this.turn
    }
    // Loss determined
    if (minEval === evalWin && !this.draw) {
      p = this.minRemain(p)
    }
    // Select a move from candidates
    this.pieces = p[Math.floor(Math.random() * p.length)]
    this.moveHistory.push(this.makeKey(this.pieces, this.turn))
    if (this.isFinished()) {
      this.finished = true
    }
    this.turn = 1 - this.turn
    this.thinking = false
  },
  playCompAndWait() { // Play computer and wait for some time
    // Human vs computer: wait for 5 ms for rendering
    // Computer vs computer: wait for this.waitThink ms
    let waitDrawing = 5
    if (Math.min(...this.players) > 0) {
      waitDrawing = this.waitThink
    }
    if (this.timerThink) {
      clearTimeout(this.timerThink)
    }
    this.timerThink = setTimeout(() => {
      this.playCompWrapper(waitDrawing)
    }, waitDrawing)
  },
  async playCompWrapper(waitDrawing) { // Wrapper for playComp for waiting time
    const startTime = performance.now()
    await this.playComp()
    const elapsedTime = performance.now() - startTime
    const remainingTime = waitDrawing - elapsedTime
    // After computer thinks, remaining time of the waiting time
    // is calculated, and wait for that time
    if (remainingTime > 0) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, remainingTime)
      })
    }
    if (!this.stopping) {
      this.drawBoard()
    }
  },
  getDepth() { // Get thinking depth
    const level = this.players[this.turn]
    if (level === 1) {
      // Level 1 does not use predetermined evaluation data
      this.evalMap = {3:{}, 4:{}, 5:{}}
      // Add some randomness in the move
      return 1 + Math.floor(Math.random() * 7)
    } if (level === 2) {
      // Level 2
      if (this.n === 3) {
        this.evalMap['3'] = {}
        return 6 + Math.floor(Math.random() * 5)
      }
      if (this.n === 4) {
        if (this.moveHistory.length < 8) {
          return 1 // Use book in the opening
        }
        if (this.remain(this.pieces) === 12) {
          this.evalMap['4'] = {} // Clear preloaded evaluation data
        }
        if (this.remain(this.pieces) > 12) {
          return 6 + Math.floor(Math.random() * 5)
        }
        return 30
      }
      // For n=5, evaluation is refreshed every time to save memory
      this.reloadEvalData()
      return 38 - 5 * this.n - Math.floor(this.remain(this.pieces) / 5)  
    }
    // Level 3
    if (this.moveHistory.length <= 2) {
      return 1
    }
    if (this.n === 3) {
      return 5
    }
    if (this.n === 5) {
      this.reloadEvalData()
    }
    if (this.n === 4 || this.remain(this.pieces) < 15) {
      return 40
    }
    return 38 - 5 * this.n - Math.floor(this.remain(this.pieces) / 5)  
  },
  evaluate(pieces, turn, depth) { // Evaluation function
    // Check if the game is finished
    if (pieces[turn].length === 0) {
      return evalWin
    }
    if (pieces[1 - turn].length === 0) {
      return -evalWin
    }
    const pos = this.nextPositions(pieces, turn)
    if (pos.length === 0) {
      return evalWin + 1
    }
    if (depth < 1) {
      // Basic evaluation function by remaining move
      let remain = 0 // Difference of the remaining move
      for (let i = 0; i < pieces[1].length; i++) {
        remain -= 1 + Math.floor(pieces[1][i] / this.n)
        // Add one more if the piece is blocked by opponent piece
        if (pieces[0].includes(pieces[1][i] - this.n)) {
          remain -= 1
        }
      }
      for (let i = 0; i < pieces[0].length; i++) {
        remain += this.n - pieces[0][i] % this.n
        if (pieces[0][i] % this.n < this.n - 1 && pieces[1].includes(pieces[0][i] + 1)) {
          remain += 1
        }
      }
      if (turn === 0) {
        return 1 - 2 * remain
      }
      return 1 + 2 * remain
    }
    // Evaluate all the possible moves and select the best move
    let minEval = evalWin + 1
    for (let i = 0; i < pos.length; i++) {
      let e
      const key = this.makeKey(pos[i], 1 - turn)
      if (key in this.evalMap[this.n] && this.evalMap[this.n][key][1] >= depth - 1) {
        e = this.evalMap[this.n][key][0]
      } else {
        e = this.evaluate(pos[i], 1 - turn, depth - 1)
        this.evalMap[this.n][key] = [e, depth - 1]
      }
      if (e <= -evalWin) {
        return -e
      }
      if (e < minEval) {
        minEval = e
      }
    }
    return -minEval
  },
  /* ===========================================================================
   * Handling events
   */
  initEvent() { // Add mouse and touch events
    // Since touchstart events can also trigger mousedown events,
    // use a touchHandled flag to prevent duplicate handling.
    let touchHandled = false
    // mousedown event
    c.addEventListener('mousedown', (e) => {
      if (!touchHandled) {
        this.down(this.pos(e))
      }
      touchHandled = false
    })
    // touchstart event
    c.addEventListener('touchstart', (e) => {
      if (e.changedTouches.length === 1) {
        touchHandled = true
        this.down(this.pos(e.changedTouches[0]))
      }
    }, {passive: true})
    // Selecting a radio button of turn
    const compRadio = document.getElementById('comp')
    const allRadios = document.querySelectorAll('input[name="turn"]')
    allRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (compRadio.checked) {
          this.onCompSelected()
        } else {
          this.onCompUnselected()
        }
      })
    })
  },
  pos(e) { // Get position in the board from event
    // Mouse position in canvas coordinate
    const x = e.clientX - c.getBoundingClientRect().left
    const y = e.clientY - c.getBoundingClientRect().top
    // Mouse position in grid coordinate
    const boardX = Math.floor(x / this.gridWidth)
    const boardY = Math.floor(y / this.gridHeight)
    // Return position in the board as 1D parameter
    return boardX + boardY * this.n
  },
  down(i) { // Down movement of mouse or touch at position i
    if (this.thinking || this.finished || this.error) {
      return
    }
    if (this.moving) {
      const m = this.moveAvailable(this.pieces, this.moveFrom, this.turn)
      if (i === this.moveFrom) {
        if (m.includes(-1)) {
          this.pieces = this.pieces.map((subArray) => subArray.filter((item) => item !== i)) // Delete i
          if (this.isFinished()) {
            this.finished = true
          }
          this.moving = false
          this.turn = 1 - this.turn
          this.drawBoard()
        }
        return
      }
      if (this.isMovable(i)) {
        this.drawBoard()
        this.moveFrom = i
        this.fillTile(i, colorSelect)
        this.putPiece(i, this.turn)
        return
      }
      if (!m.includes(i)) {
        return
      }
      // Move from this.moveFrom to i
      this.pieces = this.pieces.map((subArray) => subArray.map((item) => {
        if (item === this.moveFrom) {
          return i
        }
        return item
      }))
      if (this.isFinished()) {
        this.finished = true
      }
      this.moving = false
      this.turn = 1 - this.turn
      this.drawBoard()
      return
    }
    if (this.isMovable(i)) {
      this.moving = true
      this.moveFrom = i
      this.fillTile(i, colorSelect)
      this.putPiece(i, this.turn)
    }
  },
  changeTileSize() { // Press button to change size of tile
    this.loadSetting()
    const size = prompt(message.inputSize, this.gridWidth)
    this.gridWidth = size || this.gridWidth
    setStorage('size', this.gridWidth)
    this.setBoardParam()
    this.drawTiles(colorTile)
  },
  onCompSelected() {
    document.getElementById('watchMode').innerHTML = '⏩ <input type="radio" name="watch" id="slow" value="slow" checked>Slow<input type="radio" name="watch" id="fast" value="fast">Fast<input type="radio" name="watch" id="100" value="100">100<input type="radio" name="watch" id="stop" value="stop">Stop'
    this.onSlowSelected()
    this.stopping = false
    // Events on selecting the radio button
    const slowRadio = document.getElementById('slow')
    slowRadio.addEventListener('change', () => {
      if (slowRadio.checked) {
        this.onSlowSelected()
      }
    })
    const fastRadio = document.getElementById('fast')
    fastRadio.addEventListener('change', () => {
      if (fastRadio.checked) {
        this.onFastSelected()
      }
    })
    const continuousRadio = document.getElementById('100')
    continuousRadio.addEventListener('change', () => {
      if (continuousRadio.checked) {
        this.onContinuousSelected()
      }
    })
    const stopRadio = document.getElementById('stop')
    stopRadio.addEventListener('change', () => {
      if (stopRadio.checked) {
        this.onStopSelected()
      }
    })
  },
  onCompUnselected() {
    document.getElementById('watchMode').innerHTML = ''
  },
  onSlowSelected() {
    if (this.stopping) {
      this.playCompWrapper()
    }
    this.stopping = false
    this.continuousPlay = false
    this.waitThink = slowThink
  },
  onFastSelected() {
    if (this.stopping) {
      this.playCompWrapper()
    }
    this.stopping = false
    this.continuousPlay = false
    this.waitThink = fastThink
  },
  onContinuousSelected() {
    if (this.stopping) {
      this.playCompWrapper()
    }
    this.stopping = false
    this.continuousPlay = true
    this.waitThink = 1
    this.numRepetition = 100
  },
  onStopSelected() {
    if (this.timerThink) {
      clearTimeout(this.timerThink)
      this.timerThink = null
      this.stopping = true
    }
  },
  /* ===========================================================================
   * Rendering
   */
  drawBoard() { // Draw board and messages, and handle repetition
    // Draw board
    this.drawTiles(colorTile)
    // Show message
    if (this.draw) {
      showMessage(message.draw)
      showStatus(this.teban)
      this.drawTiles(colorTileFinished)
    } else if (this.finished) {
      showMessage(message.showWin.replace('TURN', this.showTurn[this.win]))
      showStatus(this.teban)
      this.drawTiles(colorTileFinished)
    } else {
      if (this.winDetermined > -1) {
        let status = `${this.teban}<br>${message.winDetermined.replace('TURN', String(this.showTurn[this.winDetermined]).toLowerCase())}`
        if (this.result !== '') {
          status += `<br>${this.result}`
        }
        showStatus(status)
      }
      if (this.players[this.turn] === 0) {
        showMessage(message.selectPiece.replace('PIECE', pieceHtml(this.turn)))
      } else {
        showMessage(message.showThinking.replace('TURN', this.showTurn[this.turn]))
        this.playCompAndWait()
      }
    }
    // Repetition
    if (this.finished) {
      if (this.draw) {
        this.numDraw += 1
      } else if (this.players[1] === 0) {
        this.numWin[1 - this.win] += 1
      } else {
        this.numWin[this.win] += 1
      }
      this.result = `${this.session} ${this.numWin[0]} ${message.win} ${this.numWin[1]} ${message.loss} ${this.numDraw} ${message.numDraw}`
      showStatus(this.result)
      this.repeatGame()
    }
  },
  drawTiles(color) { // Draw the board of current arrangement of pieces
    // Draw background
    ctx.fillStyle = colorBackground
    ctx.fillRect(0, 0, c.width, c.height)
    ctx.stroke()
    // Draw tiles
    for (let i = 0; i < this.n ** 2; i++) {
      this.fillTile(i, color)
    }
    // Draw pieces
    for (let turn = 0; turn < 2; turn++) {
      const pieces = this.pieces[turn]
      for (let i = 0; i < this.pieces[turn].length; i++) {
        this.putPiece(pieces[i], turn)
      }
    }
  },
  fillTile(i, color) { // Fill tile i with the color
    const x = i % this.n * this.gridWidth
    const y = this.row(i) * this.gridHeight
    ctx.fillStyle = color
    ctx.fillRect(x + this.tileMargin, y + this.tileMargin, this.tileWidth, this.tileHeight)
  },
  putPiece(i, turn) { // Put a piece of the turn at tile i
    const x = i % this.n * this.gridWidth
    const y = this.row(i) * this.gridHeight
    ctx.fillStyle = colorPiece[turn]
    ctx.font = this.pieceFont
    ctx.fillText(pieceChar[turn], x + this.pieceLeft, y + this.pieceBottom)
    ctx.stroke()
    if (this.players[turn] === 0 && !this.finished && !this.error) {
      let mes = message.moveTo
      const remove = message.removeTap.replace('PIECE', pieceHtml(this.turn))
      if (turn === 0) {
        if ((i + 1) % this.n === 0) {
          mes += remove
        }
      } else if (i < this.n) {
        mes += remove
      }
      showMessage(mes)
    }
  },
  /* ===========================================================================
   * Basic calculation functions
   */
  initPos(n) { // Initial piece arrangement of n x n board
    const piece = []
    const piece2 = []
    for (let i = 0; i < n - 1; i++) {
      piece.push(n * i)
      piece2.push(n * (n - 1) + 1 + i)
    }
    return [piece, piece2]
  },
  isFinished() { // Check if the game is finished
    if (this.pieces[0].length === 0) {
      this.win = 0
      return true
    }
    if (this.pieces[1].length === 0) {
      this.win = 1
      return true
    }
    // When opponent cannot move, you lose
    for (let i = 0; i < this.pieces[1 - this.turn].length; i++) {
      if (this.moveAvailable(this.pieces, this.pieces[1 - this.turn][i], 1 - this.turn).length > 0) {
        return false
      }
    }
    this.win = 1 - this.turn
    return true
  },
  isMovable(i) { // Check if piece at tile i is movable
    if (!this.pieces[this.turn].includes(i)) {
      return false
    }
    if (this.moveAvailable(this.pieces, i, this.turn).length === 0) {
      return false
    }
    return true
  },
  isEmpty(pieces, i) { // Check if tile i is empty
    if (pieces[0].includes(i)) {
      return false
    }
    if (pieces[1].includes(i)) {
      return false
    }
    return true
  },
  nextPositions(pieces, turn) { // List of available posisions
    const pos = []
    for (let i = 0; i < pieces[turn].length; i++) {
      const m = this.moveAvailable(pieces, pieces[turn][i], turn)
      for (let j = 0; j < m.length; j++) {
        if (m[j] < 0) {
          pos.push(pieces.map((subArray) => subArray.filter((item) => item !== pieces[turn][i])))
        } else {
          pos.push(pieces.map((subArray) => subArray.map((item) => {
            if (item === pieces[turn][i]) {
              return m[j]
            }
            return item
          })))
        }
      }
    }
    return pos
  },
  moveAvailable(pieces, i, turn) { // List of available places
    const place = []
    // For the second player
    if (turn === 1) {
      if (i < this.n) {
        place.push(-1)
      } else if (this.isEmpty(pieces, i - this.n)) {
        place.push(i - this.n)
      }
      if (i % this.n > 0) {
        if (this.isEmpty(pieces, i - 1)) {
          place.push(i - 1)
        }
      }
      if (i % this.n < this.n - 1) {
        if (this.isEmpty(pieces, i + 1)) {
          place.push(i + 1)
        }
      }
      return place
    }
    // For the first player
    if (i % this.n === this.n - 1) {
      place.push(-1)
    } else if (this.isEmpty(pieces, i + 1)) {
      place.push(i + 1)
    }
    if (i >= this.n) {
      if (this.isEmpty(pieces, i - this.n)) {
        place.push(i - this.n)
      }
    }
    if (i < this.n * (this.n - 1)) {
      if (this.isEmpty(pieces, i + this.n)) {
        place.push(i + this.n)
      }
    }
    return place
  },
  row(i) { // row number of position i
    return Math.floor(i / this.n)
  },
  remain(pieces) { // Remaining moves with only forward move
    let remain = 0
    for (let i = 0; i < pieces[1].length; i++) {
      remain += 1 + Math.floor(pieces[1][i] / this.n)
    }
    for (let i = 0; i < pieces[0].length; i++) {
      remain += this.n - pieces[0][i] % this.n
    }
    return remain
  },
  minRemain(pos) { // Smallest remain value in the positions
    const remainValues = pos.map((item) => this.remain(item))
    const minValue = Math.min(...remainValues)
    return pos.filter((item, index) => remainValues[index] === minValue)
  },
  makeKey(pos, turn) { // Make a key of a position and a turn
    return JSON.stringify([pos[0].sort((x, y) => x - y), pos[1].sort((x, y) => x - y), turn])
  }
}

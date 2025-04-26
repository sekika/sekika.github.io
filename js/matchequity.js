/*
Match equity calculator for backgammon

HTML: https://sekika.github.io/2025/01/13/MatchEquity/
JavaScript: https://github.com/sekika/sekika.github.io/blob/master/js/matchequity.js

Author: Katsutoshi Seki
License: MIT License
*/

// Maximum match length
const maxPoint = 15
parseGet()
update()

function parseGet() {
  const parse = location.search.replace('?', '')
  const parts = parse.split('-')
  const defaultPoint = 5
  const point = parseInt(parts[0] || defaultPoint, 10)
  if (point < 1 || point > maxPoint) {
    return
  }
  setPoint(point)
  const myPoint = parseInt(parts[1] || 0, 10)
  if (myPoint < 0 || myPoint > point) {
    return
  }
  document.getElementById('myPoint').value = myPoint
  const oppPoint = parseInt(parts[2] || 0, 10)
  if (oppPoint < 0 || oppPoint > point) {
    return
  }
  document.getElementById('oppPoint').value = oppPoint
}

function decPoint() { // eslint-disable-line no-unused-vars
  let point = document.getElementById('point').value
  point = parseInt(point, 10) - 2
  setPoint(point)
}

function incPoint() { // eslint-disable-line no-unused-vars
  let point = document.getElementById('point').value
  point = parseInt(point, 10) + 2
  setPoint(point)
}

function setPoint(point) {  
  const minPoint = 3
  if (isNaN(point) || point < minPoint) {
    point = minPoint
  }
  if (point > maxPoint) {
    point = maxPoint
  }
  document.getElementById('point').value = point
  update()
}

function decMyPoint() { // eslint-disable-line no-unused-vars
  let myPoint = document.getElementById('myPoint').value
  myPoint = parseInt(myPoint, 10) - 1
  if (myPoint < 0) {
    myPoint = 0
  }
  document.getElementById('myPoint').value = myPoint
  update()
}

function incMyPoint() { // eslint-disable-line no-unused-vars
  let myPoint = document.getElementById('myPoint').value
  const point = document.getElementById('point').value
  myPoint = parseInt(myPoint, 10) + 1
  if (myPoint > point) {
    myPoint = point
  }
  document.getElementById('myPoint').value = myPoint
  update()
}

function decOppPoint() { // eslint-disable-line no-unused-vars
  let oppPoint = document.getElementById('oppPoint').value
  oppPoint = parseInt(oppPoint, 10) - 1
  if (oppPoint < 0) {
    oppPoint = 0
  }
  document.getElementById('oppPoint').value = oppPoint
  update()
}

function incOppPoint() { // eslint-disable-line no-unused-vars
  let oppPoint = document.getElementById('oppPoint').value
  const point = document.getElementById('point').value
  oppPoint = parseInt(oppPoint, 10) + 1
  if (oppPoint > point) {
    oppPoint = point
  }
  document.getElementById('oppPoint').value = oppPoint
  update()
}

function resetPoint() { // eslint-disable-line no-unused-vars
  document.getElementById('myPoint').value = '0'
  document.getElementById('oppPoint').value = '0'
  update()
}

function update() { // eslint-disable-line complexity
  // Get parameter
  const gammonRate = 0.25
  const textPoint = document.getElementById('point').value
  const point = Math.round(Number(textPoint))
  document.getElementById('result').innerHTML = ''
  if (isNaN(point) || point < 1) {
    document.getElementById('matchStatus').innerText = 'Impossible match length'
    return
  }
  if (point > maxPoint) {
    document.getElementById('matchStatus').innerText = `Maximum match length is ${maxPoint}.`
    return
  }
  const textMyPoint = document.getElementById('myPoint').value
  const myPoint = Math.round(Number(textMyPoint))
  if (isNaN(myPoint) || myPoint < 0) {
    document.getElementById('matchStatus').innerText = 'Impossible point'
    return
  }
  const textOppPoint = document.getElementById('oppPoint').value
  const oppPoint = Math.round(Number(textOppPoint))
  if (isNaN(oppPoint) || oppPoint < 0) {
    document.getElementById('matchStatus').innerText = 'Impossible point'
    return
  }
  const myAway = point - myPoint
  const oppAway = point - oppPoint
  let matchStatus = `${myAway.toString()}-away ${oppAway.toString()}-away`
  if (myAway < 1 || oppAway < 1) {
    if (myAway < 1 && oppAway < 1) {
      document.getElementById('matchStatus').innerText = 'Impossible point'
      return
    }
    document.getElementById('matchStatus').innerText = 'Match finished'
    return
  }
  if (myAway === 1 || oppAway === 1) {
    if (myAway === 1 && oppAway === 1) {
      document.getElementById('matchStatus').innerText = `${matchStatus} (DMP)`
      return
    }
    matchStatus += ' (Crawford)'
  }
  document.getElementById('matchStatus').innerText = matchStatus
  const mwc = equity(myAway, oppAway) * 100
  let result = `<ul><li>Match Winning Chance = <strong>${mwc.toFixed(1)}%</strong></li>`
  if (oppAway === 1) {
    result += '<li>If it is a post-crawford game, just double immediately.</li>'
  }
  if (myAway === 1 && oppAway % 2 === 0) {
    result += '<li>If it is a post-crawford game, you have a free drop.</li>'
  }
  // Opponent's double
  if (myAway > 1 && oppAway > 1) {
    let dropPoint = drop(myAway, oppAway, 0)
    let k = ltqnorm(dropPoint) ** 2 * 2
    result += '</ul><h2>Opponent\'s double</h2>'
    result += `<ul><li>Pass opponent's double if your winning chance is below <strong>${(dropPoint * 100).toFixed(1)}%</strong>, or D<sup>2</sup>/S > ${k.toFixed(2)} <a href="https://bkgm.com/articles/Kleinman/NormalRaceTakes/index.html">in the race</a>, `
    if (oppAway === 2) {
      result += 'regardless of the opponent\'s gammon chance.</li>'
    } else {
      result += 'where gammon is not counted.</li>'
      dropPoint = drop(myAway, oppAway, gammonRate) * 100
      result += `<li>Assuming ${gammonRate * 100}% gammon rate, pass opponent's double if your winning chance is below <strong>${dropPoint.toFixed(1)}%</strong>, where opponent has ${((100 - dropPoint) * gammonRate).toFixed(1)}% gammon chance and you have ${(dropPoint * gammonRate).toFixed(1)}% gammon chance.</li>`
    }
    // Recube potential
    if (myAway > 2) {
      if (oppAway === 2) {
        result += '<li>Redouble right after taking the cube.'
      } else {
        const doublePoint = double(myAway, oppAway, 0, 2)
        dropPoint = drop(oppAway, myAway, 0, 2)
        result += `<li>After taking the cube, you can consider redoubling if your winning chance is higher than <strong>${(doublePoint * 100).toFixed(1)}%</strong>, and opponent will pass your recube when your winning chance is above <strong>${(100 - dropPoint * 100).toFixed(1)}%</strong>.`
      }
    }
    // Your double
    result += '</ul><h2>Your double</h2>'
    dropPoint = drop(oppAway, myAway, 0)
    k = ltqnorm(dropPoint) ** 2 * 2
    const drop1 = 1 - dropPoint
    result += `<ul><li>Opponent will pass your double if your winning chance is above <strong>${(100 - dropPoint * 100).toFixed(1)}%</strong>, or D<sup>2</sup>/S > ${k.toFixed(2)} <a href="https://bkgm.com/articles/Kleinman/NormalRaceTakes/index.html">in the race</a>, `
    if (myAway === 2) {
      result += 'regardless of your gammon chance.</li>'
    } else {
      result += 'where gammon is not counted.</li>'
      dropPoint = 100 - drop(oppAway, myAway, gammonRate) * 100
      result += `<li>Assuming ${gammonRate * 100}% gammon rate, opponent will pass your double if your winning chance is above <strong>${dropPoint.toFixed(1)}%</strong>, where you have ${(dropPoint * gammonRate).toFixed(1)}% gammon chance and opponent has ${((100 - dropPoint) * gammonRate).toFixed(1)}% gammon chance.</li>`
    }
    // Minimum doubling point
    result += `<li>Minimum doubling point is <strong>${(double(myAway, oppAway, 0) * 100).toFixed(1)}%</strong>, `
    if (myAway === 2) {
      if (oppAway === 2) {
        result += 'and it is <strong>always correct to double</strong> when you are in favorite.'
      } else {
        result += 'regardless of your gammon chance. If you have a good gammon chance, it is better not to double and play for a gammon.</li>'
      }
    } else {
      result += 'where gammon is not counted.</li>'
      const doublePoint = double(myAway, oppAway, gammonRate) * 100
      if (oppAway === 2) {
        result += `<li>Minimum doubling point is <strong>${doublePoint.toFixed(1)}%</strong> when you have ${((100 - doublePoint) * gammonRate).toFixed(1)}% gammon chance.</li>`
      }
    }
    // Recube potential
    const recubePotentialIndex = 0.15
    if (oppAway > 2) {
      if (myAway === 2) {
        result += '<li>Opponent will redouble right after taking the cube.'
      } else {
        const doublePoint = 1 - double(oppAway, myAway, 0, 2)
        dropPoint = drop(myAway, oppAway, 0, 2)
        let watch = ''
        if (drop1 - doublePoint < recubePotentialIndex) {
          if (oppAway > 4) {
            watch = 'Note that opponent\'s <strong>recube potential</strong> is very high, especially when opponent has a chance to win gammon. '
          } else {
            watch = 'Note that opponent\'s <strong>recube potential</strong> is very high. '
          }
        }
        result += `<li>${watch}Opponent may redoube if your winning chance is lower than <strong>${(doublePoint * 100).toFixed(1)}%</strong>, and you should pass the recube when your winning chance is below <strong>${(dropPoint * 100).toFixed(1)}%</strong>.`
      }
    }
    // Match equity table
    result += '</ul><h2>Match equity table</h2>'
    result += met(myAway, oppAway)
    // Calculation
    result += '<h2>Calculation</h2>'
    const dropEquity = equity(myAway, oppAway - 1)
    result += `<ul><li>Suppose the opponent doubles. If you pass, score is ${myAway}-away ${oppAway - 1}-away with MWC of ${(dropEquity * 100).toFixed(1)}%.`
    let loss = dropEquity - equity(myAway, oppAway - 2)
    result += `<li>If you take and lose, score is ${myAway}-away ${oppAway - 2}-away (MWC = ${((dropEquity - loss) * 100).toFixed(1)}%) where loss of MWC is ${(loss * 100).toFixed(1)}%.`
    let gain
    if (oppAway > 2 || myAway === 2) {
      gain = equity(myAway - 2, oppAway) - dropEquity
      result += `<li>If you take and win, score is ${myAway - 2}-away ${oppAway}-away (MWC = ${((dropEquity + gain) * 100).toFixed(1)}%) where gain of MWC is ${(gain * 100).toFixed(1)}%.`
    } else if (myAway > 4) {
      gain = equity(myAway - 4, oppAway) - dropEquity
      result += `<li>If you take, <strong>redouble</strong> and win, score is ${myAway - 4}-away ${oppAway}-away (MWC = ${((dropEquity + gain) * 100).toFixed(1)}%) where gain of MWC is ${(gain * 100).toFixed(1)}%.`
    } else {
      gain = 1 - dropEquity
      result += `<li>If you take, <strong>redouble</strong> and win, you win the match where gain of MWC is ${(gain * 100).toFixed(1)}%.`
    }
    result += `<li>Therefore take/pass border is calculated as ${(loss * 100).toFixed(1)} / (${(loss * 100).toFixed(1)} + ${(gain * 100).toFixed(1)}) = ${(loss / (loss + gain) * 100).toFixed(1)}%.`
    if (oppAway > 2) {
      dropPoint = equity(myAway, oppAway - 1)
      const single = 1 - gammonRate
      const oppGammonEquity = equity(myAway, oppAway - 4)
      loss = dropPoint - equity(myAway, oppAway - 2) * single - oppGammonEquity * gammonRate
      const myGammonEquity = equity(myAway - 4, oppAway)
      gain = equity(myAway - 2, oppAway) * single + myGammonEquity * gammonRate - dropPoint
      result += `<li>When the opponent wins by gammon, the MWC is ${(oppGammonEquity * 100).toFixed(1)}%. When you win by gammon, the MWC is ${(myGammonEquity * 100).toFixed(1)}%. Assuming a ${(gammonRate * 100).toFixed(0)}% <a href="https://www.bkgm.com/gloss/lookup.cgi?gammon+rate">gammon rate</a> (gammon percentage divided by winning percentage), the loss of MWC is calculated as ${(dropPoint * 100).toFixed(1)}% - (${(equity(myAway, oppAway - 2) * 100).toFixed(1)}% x ${single} + ${(oppGammonEquity * 100).toFixed(1)}% x ${gammonRate}) = ${(loss * 100).toFixed(1)}%. The gain is calculated as ${(gain * 100).toFixed(1)}%, resulting in the take/pass border of ${(loss * 100).toFixed(1)} / (${(loss * 100).toFixed(1)} + ${(gain * 100).toFixed(1)}) = ${(loss / (loss + gain) * 100).toFixed(1)}%. Note that it is ${((2 * gammonRate + 1) / (4 * gammonRate + 4) * 100).toFixed(1)}% for the money game. In this scenario, the opponent's chance of gammon is ${(gain / (loss + gain) * 100).toFixed(1)}% x ${gammonRate.toFixed(2)} = ${(gain / (loss + gain) * gammonRate * 100).toFixed(1)}% while your chance of gammon is ${(loss / (loss + gain) * gammonRate * 100).toFixed(1)}%.</li>`
    }
  }
  result += '</ul>'
  document.getElementById('result').innerHTML = result
}

function met(myAway, oppAway) {
  const maxAway = Math.max(myAway, oppAway)
  let result = '<table><tr><th>'
  for (let away = 1; away <= maxAway; away++) {
    result += `<th>${away}a</th>`
  }
  result += '</tr>'
  for (let my = 1; my <= maxAway; my++) {
    result += `<tr><th>${my}a</th>`
    for (let op = 1; op <= maxAway; op++) {
      const eq = (equity(my, op) * 100).toFixed(0)
      if (my === myAway && op === oppAway) {
        result += `<th><strong>${eq}</strong></th>`
      } else {
        result += `<td>${eq}</td>`
      }
    }
    result += '</tr>'
  }
  result += '</table><ul><li>Calculated with the <a href="https://bkgm.com/articles/Janowski/MatchEquityFormulaRevised/">formula by Rick Janowski</a>.</li></ul>'
  return result
}

function equity(myAway, oppAway) {
  if (myAway === oppAway) {
    return 0.5 // eslint-disable-line no-magic-numbers
  }
  if (myAway > oppAway) {
    return 1 - equity(oppAway, myAway)
  }
  if (myAway < 1) {
    return 1
  }
  // Now myAway is the leader and oppAway is the trailer
  // Calculation of https://bkgm.com/articles/Janowski/MatchEquityFormulaRevised/ follows.
  if (myAway === 1) { // Crawford
    // 0.525 + 0.525 * (T-1) / (T_2) for crawford
    return 0.525 + 0.57 * (oppAway - 1) / (oppAway + 2) // eslint-disable-line no-magic-numbers
  }
  // A small improvement may be made by assuming 3-away scores are 3.1-away in calculating the difference in score D
  if (myAway === 3) { // eslint-disable-line no-magic-numbers
    myAway = 3.1 // eslint-disable-line no-magic-numbers
  }
  // Match Match equity for the leader is
  // M = 0.5 + 0.87 * D / (T+6)
  let m = 0.5 + 0.87 * (oppAway - myAway) / (oppAway + 6) // eslint-disable-line no-magic-numbers
  // where M predicted is greater than 0.88, reduce by an amount equal to 0.34 * (M - 0.88)
  if (m > 0.88) { // eslint-disable-line no-magic-numbers
    m -= 0.34 * (m - 0.88) // eslint-disable-line no-magic-numbers
  }
  return m
}

function drop(myAway, oppAway, gammonRate = 0, cube = 1) {
  if (myAway < 2 || oppAway < 2) {
    console.log(`Drop point for ${myAway}-away ${oppAway}-away cannot be calculated.`) // eslint-disable-line no-console
    return 0
  }
  // Drop point (MWC for drop)
  const drop = equity(myAway, oppAway - cube)
  // Loss for taking and losing
  const single = 1 - gammonRate
  let singleEquity = equity(myAway, oppAway - 2 * cube)
  let gammonEquity = equity(myAway, oppAway - 4 * cube)
  const loss = drop - singleEquity * single - gammonEquity * gammonRate
  // Gain for taking and winning
  if (oppAway <= 2 * cube) {
    cube *= 2
  }
  singleEquity = equity(myAway - 2 * cube, oppAway)
  gammonEquity = equity(myAway - 4 * cube, oppAway)
  const gain = singleEquity * single + gammonEquity * gammonRate - drop
  // console.log(`${myAway}-away ${oppAway}-away cube = ${cube} drop = ${drop.toFixed(3)} singleEquity = ${singleEquity.toFixed(3)} gammonEquity = ${gammonEquity.toFixed(3)} loss = ${loss.toFixed(3)} gain = ${gain.toFixed(3)}`);

  // Calculate drop point
  const dropPoint = loss / (loss + gain)
  return dropPoint
}

function double(myAway, oppAway, myGammon = 0, cube = 1) {
  if (myAway < 2 || oppAway < 2) {
    console.log(`Minimum doubling point for ${myAway}-away ${oppAway}-away cannot be calculated.`) // eslint-disable-line no-console
    return 0
  }
  // Gain for double and win
  let singleEquity = 1
  if (myAway > 2 * cube) {
    singleEquity = equity(myAway - 2 * cube, oppAway)
  }
  const gainSingle = singleEquity - equity(myAway - cube, oppAway)
  let gammonEquity = 1
  if (myAway > 4 * cube) {
    gammonEquity = equity(myAway - 4 * cube, oppAway)
  }
  const gainGammon = gammonEquity - equity(myAway - 2 * cube, oppAway)
  const gain = gainSingle * (1 - myGammon) + gainGammon * myGammon
  // Loss for double and lose
  let loss
  if (myAway > 2 * cube) {
    loss = equity(myAway, oppAway - cube) - equity(myAway, oppAway - 2 * cube)
  } else if (oppAway > 4 * cube) {
    loss = equity(myAway, oppAway - cube) - equity(myAway, oppAway - 4 * cube)
  } else {
    loss = equity(myAway, oppAway - cube)
  }
  // Calculate doubling point
  // console.log(`${myAway}-away ${oppAway}-away cube = ${cube} singleEquity = ${singleEquity.toFixed(3)} gainSingle = ${gainSingle.toFixed(3)} gain = ${gain.toFixed(3)} loss = ${loss.toFixed(3)}`);
  const doublingPoint = loss / (loss + gain)
  return doublingPoint
}

/*
    * Lower tail quantile for standard normal distribution function.
    *
    * Author:      Peter John Acklam
    * WWW URL:     http://home.online.no/~pjacklam/notes/invnorm/
    *
    * Javascript implementation by Liorzou Etienne
    * - Adapted from Dr. Thomas Ziegler's C implementation itself adapted from Peter's Perl version
    * URL:   https://github.com/liorzoue/js-normal-inverse
    */

function ltqnorm(p) {
  /* Coefficients in rational approximations. */
  const a =
        [
          -3.969683028665376e+01, // eslint-disable-line no-magic-numbers
          2.209460984245205e+02, // eslint-disable-line no-magic-numbers
          -2.759285104469687e+02, // eslint-disable-line no-magic-numbers
          1.383577518672690e+02, // eslint-disable-line no-magic-numbers
          -3.066479806614716e+01, // eslint-disable-line no-magic-numbers
          2.506628277459239e+00 // eslint-disable-line no-magic-numbers
        ]

  const b =
        [
          -5.447609879822406e+01, // eslint-disable-line no-magic-numbers
          1.615858368580409e+02, // eslint-disable-line no-magic-numbers
          -1.556989798598866e+02, // eslint-disable-line no-magic-numbers
          6.680131188771972e+01, // eslint-disable-line no-magic-numbers
          -1.328068155288572e+01 // eslint-disable-line no-magic-numbers
        ]

  const c =
        [
          -7.784894002430293e-03, // eslint-disable-line no-magic-numbers
          -3.223964580411365e-01, // eslint-disable-line no-magic-numbers
          -2.400758277161838e+00, // eslint-disable-line no-magic-numbers
          -2.549732539343734e+00, // eslint-disable-line no-magic-numbers
          4.374664141464968e+00, // eslint-disable-line no-magic-numbers
          2.938163982698783e+00 // eslint-disable-line no-magic-numbers
        ]

  const d =
        [
          7.784695709041462e-03, // eslint-disable-line no-magic-numbers
          3.224671290700398e-01, // eslint-disable-line no-magic-numbers
          2.445134137142996e+00, // eslint-disable-line no-magic-numbers
          3.754408661907416e+00 // eslint-disable-line no-magic-numbers
        ]

  const LOW = 0.02425
  const HIGH = 0.97575

  let q

  // errno = 0;

  if (p < 0 || p > 1) {
    // errno = EDOM;
    return 0.0
  } else if (p === 0) {
    // errno = ERANGE;
    return Number.NEGATIVE_INFINITY /* minus "infinity" */
  } else if (p === 1) {
    // errno = ERANGE;
    return Number.POSITIVE_INFINITY /* "infinity" */
  } else if (p < LOW) {
    /* Rational approximation for lower region */
    q = Math.sqrt(-2 * Math.log(p)) // eslint-disable-line no-magic-numbers
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  } else if (p > HIGH) {
    /* Rational approximation for upper region */
    q = Math.sqrt(-2 * Math.log(1 - p)) // eslint-disable-line no-magic-numbers
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  }

  /* Rational approximation for central region */
  q = p - 0.5 // eslint-disable-line no-magic-numbers
  const r = q * q
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
                (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
}

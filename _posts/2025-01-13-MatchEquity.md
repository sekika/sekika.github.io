---
layout: post-en
title: Match equity calculator
date: 2025-01-13 12:29:51 +0000
tags:
- game
- javascript
- english
---
The match equity of backgammon and the <a href="https://bkgm.com/articles/GOL/Oct99/hanka99.htm">doubling window</a> can be calculated up to a 15-point match.

<ul>
    <li><input name="point" id="point" type="text" value="5" size="3" onkeyup="update()" /> point match
    <input type="button" value="-" onclick="decPoint();" />
    <input type="button" value="+" onclick="incPoint();" /></li>
    <li>I won <input name="myPoint" id="myPoint" type="text" value="0" size="3" onkeyup="update()" /> points
    <input type="button" value="-" onclick="decMyPoint();" />
    <input type="button" value="+" onclick="incMyPoint();" /></li>
    <li>Opponent won <input name="oppPoint" id="oppPoint" type="text" value="0" size="3" onkeyup="update()" /> points
    <input type="button" value="-" onclick="decOppPoint();" />
    <input type="button" value="+" onclick="incOppPoint();" /></li>
    <li><input type="button" value="0 - 0" onclick="resetPoint();" /></li>
</ul>

<h2 id="matchStatus"></h2>

<div id="result"></div>

<script>
    'use strict';
    // Maximum match length
    const maxPoint = 15;
    update();

    function decPoint() {
        var point = document.getElementById("point").value;
        point = parseInt(point, 10) - 2;
        setPoint(point);
    }

    function incPoint() {
        var point = document.getElementById("point").value;
        point = parseInt(point, 10) + 2;
        setPoint(point);
    }

    function setPoint(point) {
        if (isNaN(point) || point < 3) {
            point = 3
        }
        if (point > maxPoint) {
            point = maxPoint
        }
        document.getElementById("point").value = point;
        update();
    }

    function decMyPoint() {
        var myPoint = document.getElementById("myPoint").value;
        myPoint = parseInt(myPoint, 10) - 1;
        if (myPoint < 0) {
            myPoint = 0
        }
        document.getElementById("myPoint").value = myPoint;
        update();
    }

    function incMyPoint() {
        var myPoint = document.getElementById("myPoint").value;
        var point = document.getElementById("point").value;
        myPoint = parseInt(myPoint, 10) + 1;
        if (myPoint > point) {
            myPoint = point
        }
        document.getElementById("myPoint").value = myPoint;
        update();
    }

    function decOppPoint() {
        var oppPoint = document.getElementById("oppPoint").value;
        oppPoint = parseInt(oppPoint, 10) - 1;
        if (oppPoint < 0) {
            oppPoint = 0
        }
        document.getElementById("oppPoint").value = oppPoint;
        update();
    }

    function incOppPoint() {
        var oppPoint = document.getElementById("oppPoint").value;
        var point = document.getElementById("point").value;
        oppPoint = parseInt(oppPoint, 10) + 1;
        if (oppPoint > point) {
            oppPoint = point
        }
        document.getElementById("oppPoint").value = oppPoint;
        update();
    }

    function resetPoint() {
        document.getElementById("myPoint").value = "0";
        document.getElementById("oppPoint").value = "0";
        update();
    }

    function update() {
        // Get parameter
        const gammonRate = 0.25;
        var textPoint = document.getElementById("point").value;
        var point = Math.round(Number(textPoint));
        document.getElementById("result").innerHTML = "";
        if (isNaN(point) || point < 1) {
            document.getElementById("matchStatus").innerText = "Impossible match length";
            return
        }
        if (point > maxPoint) {
            document.getElementById("matchStatus").innerText = `Maximum match length is ${maxPoint}.`;
            return
        }
        var textMyPoint = document.getElementById("myPoint").value;
        var myPoint = Math.round(Number(textMyPoint));
        if (isNaN(myPoint) || myPoint < 0) {
            document.getElementById("matchStatus").innerText = "Impossible point";
            return
        }
        var textOppPoint = document.getElementById("oppPoint").value;
        var oppPoint = Math.round(Number(textOppPoint));
        if (isNaN(oppPoint) || oppPoint < 0) {
            document.getElementById("matchStatus").innerText = "Impossible point";
            return
        }
        var myAway = point - myPoint
        var oppAway = point - oppPoint
        var matchStatus = myAway.toString() + "-away " + oppAway.toString() + "-away"
        if (myAway < 1 || oppAway < 1) {
            if (myAway < 1 && oppAway < 1) {
                document.getElementById("matchStatus").innerText = "Impossible point"
                return
            }
            document.getElementById("matchStatus").innerText = "Match finished"
            return
        }
        if (myAway == 1 || oppAway == 1) {
            if (myAway == 1 && oppAway == 1) {
                document.getElementById("matchStatus").innerText = matchStatus + " (DMP)"
                return
            } else {
                matchStatus += " (Crawford)"
            }
        }
        document.getElementById("matchStatus").innerText = matchStatus;
        var mwc = equity(myAway, oppAway) * 100;
        var result = `<ul><li>Match Winning Chance = <strong>${mwc.toFixed(1)}%</strong></li>`;
        if (oppAway == 1) {
            result += `<li>If it is a post-crawford game, just double immediately.</li>`
        }
        if (myAway == 1 && oppAway % 2 == 0) {
            result += `<li>If it is a post-crawford game, you have a free drop.</li>`
        }
        // Opponent's double
        if (myAway > 1 && oppAway > 1) {
            var dropPoint = drop(myAway, oppAway, 0);
            var k = ltqnorm(dropPoint) ** 2 * 2;
            result += "</ul><h2>Opponent's double</h2>";
            result += `<ul><li>Pass opponent's double if your winning chance is below <strong>${(dropPoint * 100).toFixed(1)}%</strong>, or D<sup>2</sup>/S > ${k.toFixed(2)} <a href="https://bkgm.com/articles/Kleinman/NormalRaceTakes/index.html">in the race</a>, `;
            if (oppAway == 2) {
                result += "regardless of the opponent's gammon chance.</li>";
            } else {
                result += "where gammon is not counted.</li>";
                dropPoint = drop(myAway, oppAway, gammonRate) * 100;
                result += `<li>Pass opponent's double if your winning chance is below <strong>${dropPoint.toFixed(1)}%</strong> and opponent has ${((100 - dropPoint) * gammonRate).toFixed(1)}% gammon chance. Your gammon chance is not counted.</li>`;
            }
            // Your double
            result += "</ul><h2>Your double</h2>";
            dropPoint = drop(oppAway, myAway, 0);
            k = ltqnorm(dropPoint) ** 2 * 2;
            result += `<ul><li>Opponent will pass your double if your winning chance is above <strong>${(100 - dropPoint * 100).toFixed(1)}%</strong>, or D<sup>2</sup>/S > ${k.toFixed(2)} <a href="https://bkgm.com/articles/Kleinman/NormalRaceTakes/index.html">in the race</a>, `;
            if (myAway == 2) {
                result += "regardless of your gammon chance.</li>";
            } else {
                result += "where gammon is not counted.</li>";
                dropPoint = (100 - drop(oppAway, myAway, gammonRate) * 100);
                result += `<li>Opponent will pass your double if your winning chance is above <strong>${dropPoint.toFixed(1)}%</strong> and you have ${(dropPoint * gammonRate).toFixed(1)}% gammon chance. Opponent's gammon chance is not counted.</li>`;
            }
            result += `<li>Minimum doubling point is <strong>${(double(myAway, oppAway, 0) * 100).toFixed(1)}%</strong>, `;
            if (myAway == 2) {
                result += "regardless of your gammon chance.</li></ul>";
            } else {
                result += "where gammon is not counted.</li>";
                let doublePoint = double(myAway, oppAway, gammonRate) * 100;
                result += `<li>Minimum doubling point is <strong>${doublePoint.toFixed(1)}%</strong> when you have ${((100 - doublePoint) * gammonRate).toFixed(1)}% gammon chance. Opponent's gammon chance is not counted.</li></ul>`;
            }
            // Match equity table
            result += "<h2>Match equity table</h2>";
            const maxAway = Math.max(myAway, oppAway);
            result += "<table><tr><th>";
            for (let away = 1; away <= maxAway; away++) {
                result += `<th>${away}a</th>`;
            }
            result += "</tr>";
            for (let my = 1; my <= maxAway; my++) {
                result += `<tr><th>${my}a</th>`;
                for (let op = 1; op <= maxAway; op++) {
                    let eq = (equity(my, op)*100).toFixed(0)
                    if (my == myAway && op == oppAway) {
                        result += `<th><strong>${eq}</strong></th>`;
                    } else {
                        result += `<td>${eq}</td>`;
                    }
                }
                result += "</tr>";
            }
            result += "</table><ul><li>Calculated with the <a href=\"https://bkgm.com/articles/Janowski/MatchEquityFormulaRevised/\">formula by Rick Janowski</a>.</li></ul>";
            // Calculation
            result += "<h2>Calculation</h2>"
            const dropEquity = equity(myAway, oppAway - 1);
            result += `<ul><li>Suppose the opponent doubles. If you pass, score is ${myAway}-away ${oppAway-1}-away with MWC of ${(dropEquity * 100).toFixed(1)}%.`;
            let loss = dropEquity - equity(myAway, oppAway - 2)
            result += `<li>If you take and lose, score is ${myAway}-away ${oppAway-2}-away (MWC = ${((dropEquity - loss) * 100).toFixed(1)}%) where loss of MWC is ${(loss * 100).toFixed(1)}%.`;
            // Gain for taking and winning
            let gain;
            if (oppAway > 2 || myAway == 2) {
                gain = equity(myAway - 2, oppAway) - dropEquity;
                result += `<li>If you take and win, score is ${myAway-2}-away ${oppAway}-away (MWC = ${((dropEquity + gain) * 100).toFixed(1)}%) where gain of MWC is ${(gain * 100).toFixed(1)}%.`;
            } else if (myAway > 4) {
                gain = equity(myAway - 4, oppAway) - dropEquity;
                result += `<li>If you take, <strong>redouble</strong> and win, score is ${myAway-4}-away ${oppAway}-away (MWC = ${((dropEquity + gain) * 100).toFixed(1)}%) where gain of MWC is ${(gain * 100).toFixed(1)}%.`;
            } else {
                gain = 1 - dropEquity;
                result += `<li>If you take, <strong>redouble</strong> and win, you win the match where gain of MWC is ${(gain * 100).toFixed(1)}%.`;
            }
            result += `<li>Therefore take/pass border is calculated as ${(loss * 100).toFixed(1)} / (${(loss * 100).toFixed(1)} + ${(gain * 100).toFixed(1)}) = ${(loss / (loss + gain) * 100).toFixed(1)}%.`;
            if (oppAway > 2) {
                dropPoint = equity(myAway, oppAway - 1);
                const single = 1 - gammonRate
                var gammonEquity = 0;
                if (oppAway > 4) {
                    gammonEquity = equity(myAway, oppAway - 4);
                }
                loss = dropPoint - equity(myAway, oppAway - 2) * single - gammonEquity * gammonRate;
                result += `<li>When opponent wins by gammon, MWC = ${(gammonEquity * 100).toFixed(1)}%. Therefore by assuming ${(gammonRate * 100).toFixed(0)}% gammon chance out of the win, loss of MWC is calculated as ${(loss * 100).toFixed(1)}%, and the take/pass border = ${(loss * 100).toFixed(1)} / (${(loss * 100).toFixed(1)} + ${(gain * 100).toFixed(1)}) = ${(loss / (loss + gain) * 100).toFixed(1)}%. In this case, opponent's gammon chance is ${(gain / (loss + gain) * 100).toFixed(1)}% x ${gammonRate.toFixed(2)} = ${(gain / (loss + gain) * gammonRate * 100).toFixed(1)}%.</li>`;
            }
        }
        result += "</ul>";            
        document.getElementById("result").innerHTML = result;
    }

    function equity(myAway, oppAway) {
        if (myAway === oppAway) {
            return 0.5;
        }
        if (myAway > oppAway) {
            return 1 - equity(oppAway, myAway);
        }
        if (myAway === 0) {
            return 1;
        }
        // Now myAway is the leader and oppAway is the trailer
        // Calculation of https://bkgm.com/articles/Janowski/MatchEquityFormulaRevised/ follows.
        if (myAway === 1) { // Crawford
            // 0.525 + 0.525 * (T-1) / (T_2) for crawford
            return 0.525 + 0.57 * (oppAway - 1) / (oppAway + 2);
        }
        // A small improvement may be made by assuming 3-away scores are 3.1-away in calculating the difference in score D
        if (myAway === 3) {
            myAway = 3.1;
        }
        // Match Match equity for the leader is
        // M = 0.5 + 0.87 * D / (T+6)
        let m = 0.5 + (0.87 * (oppAway - myAway)) / (oppAway + 6);
        // where M predicted is greater than 0.88, reduce by an amount equal to 0.34 * (M - 0.88)
        if (m > 0.88) {
            m = m - 0.34 * (m - 0.88);
        }
        return m;
    }

    function drop(myAway, oppAway, oppGammon) {
        if (myAway < 2 || oppAway < 2) {
            console.log(`Drop point for ${myAway}-away ${oppAway}-away cannot be calculated.`);
            return 0;
        }
        // Drop point (MWC for drop)
        const drop = equity(myAway, oppAway - 1);
        // Loss for taking and losing
        const single = 1 - oppGammon;
        const singleEquity = equity(myAway, oppAway - 2);
        var gammonEquity = 0;
        if (oppAway > 4) {
            gammonEquity = equity(myAway, oppAway - 4);
        }
        const loss = drop - singleEquity * single - gammonEquity * oppGammon;
        // console.log(`${myAway}-away ${oppAway}-away drop = ${drop.toFixed(3)} singleEquity = ${singleEquity.toFixed(3)} gammonEquity = ${gammonEquity.toFixed(3)} loss = ${loss.toFixed(3)}`);
        // Gain for taking and winning
        let gain;
        if (oppAway > 2) {
            gain = equity(myAway - 2, oppAway) - drop;
        } else if (myAway > 4) {
            gain = equity(myAway - 4, oppAway) - drop;
        } else {
            gain = 1 - drop;
        }

        // Calculate drop point
        const dropPoint = loss / (loss + gain);
        return dropPoint;
    }

    function double(myAway, oppAway, myGammon) {
        if (myAway < 2 || oppAway < 2) {
            console.log(`Minimum doubling point for ${me}-away ${oppAway}-away cannot be calculated.`);
            return 0;
        }
        // Gain for double and win
        let gainSingle = equity(myAway - 2, oppAway) - equity(myAway - 1, oppAway);
        var gammonEquity = 1;
        if (oppAway > 4) {
            gammonEquity = equity(myAway - 4, oppAway);
        }
        let gainGammon = gammonEquity - equity(myAway - 2, oppAway);
        const gain = gainSingle * (1 - myGammon) + gainGammon * myGammon
        // Loss for double and lose
        let loss;
        if (myAway > 2) {
            loss = equity(myAway, oppAway - 1) - equity(myAway, oppAway - 2);
        } else if (oppAway > 4) {
            loss = equity(myAway, oppAway - 1) - equity(myAway, oppAway - 4);
        } else {
            loss = equity(myAway, oppAway - 1);
        }
        // Calculate doubling point
        let doublingPoint = loss / (loss + gain);
        return doublingPoint;
    }

    /*
    * Lower tail quantile for standard normal distribution function.
    *
    * Author:      Peter John Acklam
    * WWW URL:     http://home.online.no/~pjacklam/notes/invnorm/
    */

    function ltqnorm(p) {
        /* Coefficients in rational approximations. */
        var a =
        [
            -3.969683028665376e+01,
            2.209460984245205e+02,
            -2.759285104469687e+02,
            1.383577518672690e+02,
            -3.066479806614716e+01,
            2.506628277459239e+00
        ];

        var b =
        [
            -5.447609879822406e+01,
            1.615858368580409e+02,
            -1.556989798598866e+02,
            6.680131188771972e+01,
            -1.328068155288572e+01
        ];

        var c =
        [
            -7.784894002430293e-03,
            -3.223964580411365e-01,
            -2.400758277161838e+00,
            -2.549732539343734e+00,
            4.374664141464968e+00,
            2.938163982698783e+00
        ];

        var d =
        [
            7.784695709041462e-03,
            3.224671290700398e-01,
            2.445134137142996e+00,
            3.754408661907416e+00
        ];

        var LOW = 0.02425;
        var HIGH = 0.97575;

        var q, r;

        // errno = 0;

        if (p < 0 || p > 1)
        {
            // errno = EDOM;
            return 0.0;
        }
        else if (p == 0)
        {
            // errno = ERANGE;
            return Number.NEGATIVE_INFINITY; /* minus "infinity" */;
        }
        else if (p == 1)
        {
            // errno = ERANGE;
            return Number.POSITIVE_INFINITY; /* "infinity" */;
        }
        else if (p < LOW)
        {
            /* Rational approximation for lower region */
            q = Math.sqrt(-2*Math.log(p));
            return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
                ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
        }
        else if (p > HIGH)
        {
            /* Rational approximation for upper region */
            q  = Math.sqrt(-2*Math.log(1-p));
            return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
                ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
        }
        else
        {
            /* Rational approximation for central region */
                q = p - 0.5;
                r = q*q;
            return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q /
                (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
        }
    }

</script>

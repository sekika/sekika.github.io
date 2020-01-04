// DrawCartesianGraph
//
// beta version
//
// Author: Katsutoshi Seki
// URL: https://sekika.github.io/js/graph.js
// Japanese description: https://sekika.github.io/2020/01/03/DrawCartesianGraph/
// License: MIT License

'use strict';

// Draw axis
function drawAxis(ctx, x, y) {
    x = x || "x"; // Set default value
    y = y || "y";
    // X axis
    ctx.beginPath();
    ctx.moveTo(0, ctx.originY);
    ctx.lineTo(ctx.width - 30, ctx.originY);
    ctx.lineTo(ctx.width - 45, ctx.originY - 10);
    ctx.moveTo(ctx.width - 30, ctx.originY);
    ctx.lineTo(ctx.width - 45, ctx.originY + 10);
    ctx.fillText(x, ctx.width - 25, ctx.originY + 5);

    // Y axis
    ctx.moveTo(ctx.originX, ctx.height);
    ctx.lineTo(ctx.originX, 30);
    ctx.lineTo(ctx.originX - 10, 45);
    ctx.moveTo(ctx.originX, 30);
    ctx.lineTo(ctx.originX + 10, 45);
    ctx.fillText(y, ctx.originX - 5, 20);
    ctx.stroke();
}

// Draw scale of the x axis
function drawScaleX(ctx, scaleX) {
    var x, minX, precision;
    precision = 10000000;
    minX = -Math.floor((ctx.originX - 20) / ctx.unitX / scaleX) * scaleX;
    for (x = minX; ctx.originX + ctx.unitX * x < ctx.width - 30; x = x + scaleX) {
        x = Math.round(x * precision) / precision;
        ctx.moveTo(ctx.originX + ctx.unitX * x, ctx.originY);
        ctx.lineTo(ctx.originX + ctx.unitX * x, ctx.originY + 7);
        ctx.fillStyle = "black";
        ctx.fillText(x, ctx.originX + ctx.unitX * x - 20, ctx.originY + 25);
    }
    ctx.stroke();
}

// Draw scale of the y axis
function drawScaleY(ctx, scaleY) {
    var y, minY, precision;
    precision = 10000000;
    ctx.offsetScaleY = ctx.offsetScaleY || 30;
    minY = Math.ceil((ctx.height - ctx.originY - 10) / ctx.unitY / scaleY) * scaleY;
    for (y = minY; ctx.originY + ctx.unitY * y > 30; y = y + scaleY) {
        y = Math.round(y * precision) / precision;
        if (y !== 0) {
            ctx.moveTo(ctx.originX, ctx.originY + ctx.unitY * y);
            ctx.lineTo(ctx.originX - 5, ctx.originY + ctx.unitY * y);
            ctx.fillText(y.toString(), ctx.originX - ctx.offsetScaleY, ctx.originY + ctx.unitY * y + 10);
        }
    }
    ctx.stroke();
}

// Draw a graph
function draw(ctx, func, parameter) {
    var x, y, pixX, pixY, first;
    ctx.beginPath();
    first = true;
    for (pixX = 0; pixX < ctx.width - 30; pixX++) {
        x = (pixX - ctx.originX) / ctx.unitX;
        y = func(x, parameter);
        pixY = ctx.originY + ctx.unitY * y;
        if (pixY >= 35 && pixY <= ctx.height) {
            if (first) {
                ctx.moveTo(pixX, pixY);
                first = false;
            } else {
                ctx.lineTo(pixX, pixY);
            }
        } else {
            first = true;
        }
    }
    ctx.stroke();
}

// Plot integer values
function plotInt(ctx, func, parameter) {
    var x, y, pixX, pixY;
    ctx.plotMinX = ctx.plotMinX || 0;
    ctx.beginPath();
    for (x = ctx.plotMinX; x * ctx.unitX < ctx.width - ctx.originX - 30; x++) {
        y = func(x, parameter);
        pixX = ctx.originX + ctx.unitX * x;
        pixY = ctx.originY + ctx.unitY * y;
        if (pixY >= 35 && pixY <= ctx.height) {
            ctx.beginPath();
            ctx.arc(pixX, pixY, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.stroke();
}

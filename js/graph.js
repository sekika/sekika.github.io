// DrawCartesianGraph
//
// beta version
//
// Author: Katsutoshi Seki
// URL: https://sekika.github.io/js/graph.js
// Japanese description: https://sekika.github.io/2020/01/03/DrawCartesianGraph/
// License: MIT License

'use strict';

// Set default values as constant.
// These can be changed by setting properties of ctx
const labelX = "x"; // Label of the x axis
const labelY = "y"; // Label of the y axis
const topMargin = 30; // Top margin (without label)
const rightMargin = 10; // Right margin (without label)
const vectorWidth = 10; // Width of the vector of axis
const vectorHeight = 15; // Height of the vector of axis

const scaleX = 1; // Scale interval of x axis
const scaleY = 1; // Scale interval of y axis
const scaleLengthX = 6; // Length of scale of x axis
const scaleLengthY = 5; // Length of scale of y axis
const offsetScaleY = 30; // Location of label of y axis
const precision = 10000000; // To prevent rounding error

const plotMinX = 0; // Minimum value of x for plotInt function
const plotSize = 4; // Size of the mark for the plotInt function

// Draw axis
function drawAxis(ctx) {
    // Set default values
    ctx.labelX = ctx.labelX || labelX;
    ctx.labelY = ctx.labelY || labelY;
    ctx.topMargin = ctx.topMargin || topMargin;
    ctx.rightMargin = ctx.rightMargin || rightMargin; 
    ctx.vectorWidth = ctx.vectorWidth || vectorWidth;
    ctx.vectorHeight = ctx.vectorHeight || vectorHeight;
    // Draw X axis
    ctx.beginPath();
    ctx.moveTo(0, ctx.originY);
    ctx.lineTo(ctx.width - ctx.rightMargin, ctx.originY);
    ctx.lineTo(ctx.width - ctx.rightMargin - ctx.vectorHeight, ctx.originY - ctx.vectorWidth);
    ctx.moveTo(ctx.width - ctx.rightMargin, ctx.originY);
    ctx.lineTo(ctx.width - ctx.rightMargin - ctx.vectorHeight, ctx.originY + ctx.vectorWidth);
    ctx.fillText(ctx.labelX, ctx.width - ctx.rightMargin + 10, ctx.originY + 5);
    // Draw Y axis
    ctx.moveTo(ctx.originX, ctx.height);
    ctx.lineTo(ctx.originX, ctx.topMargin);
    ctx.lineTo(ctx.originX - ctx.vectorWidth, ctx.topMargin + ctx.vectorHeight);
    ctx.moveTo(ctx.originX, ctx.topMargin);
    ctx.lineTo(ctx.originX + ctx.vectorWidth, ctx.topMargin + ctx.vectorHeight);
    ctx.fillText(ctx.labelY, ctx.originX - 5, ctx.topMargin - 10);
    ctx.stroke();
}

// Draw scale of the x axis
function drawScaleX(ctx) {
    var x, minX;
    ctx.scaleX = ctx.scaleX || scaleX;
    ctx.scaleLengthX = ctx.scaleLengthX || scaleLengthX; 
    ctx.rightMargin = ctx.rightMargin || rightMargin;
    ctx.precision = ctx.precision || precision;
    minX = -Math.floor((ctx.originX - 20) / ctx.unitX / ctx.scaleX) * ctx.scaleX;
    for (x = minX; ctx.originX + ctx.unitX * x < ctx.width - ctx.rightMargin; x = x + ctx.scaleX) {
        x = Math.round(x * ctx.precision) / ctx.precision;
        ctx.moveTo(ctx.originX + ctx.unitX * x, ctx.originY);
        ctx.lineTo(ctx.originX + ctx.unitX * x, ctx.originY + ctx.scaleLengthX);
        ctx.fillText(x, ctx.originX + ctx.unitX * x - 20, ctx.originY + 25);
    }
    ctx.stroke();
}

// Draw scale of the y axis
function drawScaleY(ctx) {
    var y, minY;
    ctx.scaleY = ctx.scaleY || scaleY;
    ctx.scaleLengthY = ctx.scaleLengthY || scaleLengthY;
    ctx.offsetScaleY = ctx.offsetScaleY || offsetScaleY;
    ctx.precision = ctx.precision || precision;
    minY = Math.ceil((ctx.height - ctx.originY - 10) / ctx.unitY / ctx.scaleY) * ctx.scaleY;
    for (y = minY; ctx.originY + ctx.unitY * y > ctx.topMargin; y = y + ctx.scaleY) {
        y = Math.round(y * ctx.precision) / ctx.precision;
        if (y !== 0) {
            ctx.moveTo(ctx.originX, ctx.originY + ctx.unitY * y);
            ctx.lineTo(ctx.originX - ctx.scaleLengthY, ctx.originY + ctx.unitY * y);
            ctx.fillText(y.toString(), ctx.originX - ctx.offsetScaleY, ctx.originY + ctx.unitY * y + 10);
        }
    }
    ctx.stroke();
}

// Draw a graph
function draw(ctx, func, parameter) {
    var x, y, pixX, pixY, first;
    ctx.topMargin = ctx.topMargin || topMargin;
    ctx.rightMargin = ctx.rightMargin || rightMargin;
    ctx.beginPath();
    first = true;
    for (pixX = 0; pixX < ctx.width - ctx.rightMargin; pixX++) {
        x = (pixX - ctx.originX) / ctx.unitX;
        y = func(x, parameter);
        pixY = ctx.originY + ctx.unitY * y;
        if (pixY >= ctx.topMargin + 5 && pixY <= ctx.height) {
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
    ctx.plotMinX = ctx.plotMinX || plotMinX;
    ctx.plotSize = ctx.plotSize || plotSize;
    ctx.topMargin = ctx.topMargin || topMargin;
    ctx.rightMargin = ctx.rightMargin || rightMargin;
    ctx.beginPath();
    for (x = ctx.plotMinX; x * ctx.unitX < ctx.width - ctx.originX - ctx.rightMargin; x++) {
        y = func(x, parameter);
        pixX = ctx.originX + ctx.unitX * x;
        pixY = ctx.originY + ctx.unitY * y;
        if (pixY >= ctx.topMargin + 5 && pixY <= ctx.height) {
            ctx.beginPath();
            ctx.arc(pixX, pixY, ctx.plotSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.stroke();
}

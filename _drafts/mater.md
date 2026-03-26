---
layout: post-en
title: HYDRUS Mater.in Checker
permalink: /mater/
tags:
- english
- soil
- javascript
---
[HYDRUS](https://www.pc-progress.com/en/default.aspx) is a software package for simulating water flow, heat, and solute transport in variably saturated porous media (soils). The Mater.in file is an input file for HYDRUS used when soil hydraulic properties are defined by tabular data (look-up tables) rather than analytical functions. It contains discrete data points for water content (&theta;), pressure head (h), hydraulic conductivity (K), and optionally soil hydraulic capacity (C). See Table 12.14 in the [user manual](https://www.pc-progress.com/downloads/Pgm_Hydrus3D5/HYDRUS_Technical_Manual_1D_V5.pdf). This tool validates the format of your `Mater.in` file and visualizes the hydraulic property curves.

Paste the content of Mater.in into the text box below and click the "Check" button.

<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<style>
    textarea {
        width: 100%;
        font-family: monospace;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        resize: vertical;
    }
    button {
        margin-top: 10px;
        padding: 10px 20px;
        font-size: 16px;
        background-color: #0078D7;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    button:hover {
        background-color: #005A9E;
    }
    #errorOutput {
        color: #D13438;
        font-weight: bold;
        margin-top: 15px;
        white-space: pre-wrap;
    }
</style>

<textarea id="inputData" rows="10" placeholder="Paste the content of Mater.in here..."></textarea>
<br>
<button onclick="processData()">Check</button>

<div id="errorOutput"></div>

<div class="plot-container">
    <div id="plotTheta" class="plot"></div>
    <div id="plotK" class="plot"></div>
    <div id="plotThetaK" class="plot"></div>
    <div id="plotC" class="plot"></div>
</div>

<script>
    function processData() {
        // Clear previous errors and plots
        const errorOutput = document.getElementById('errorOutput');
        errorOutput.innerText = '';
        Plotly.purge('plotTheta');
        Plotly.purge('plotK');
        Plotly.purge('plotC');
        Plotly.purge('plotThetaK');

        const text = document.getElementById('inputData').value.trim();
        if (!text) {
            showError("No data entered.");
            return;
        }

        const lines = text.split(/\r?\n/);
        if (lines.length < 6) {
            showError("The file is too short. It does not match the valid Mater.in format (at least 6 lines required).");
            return;
        }

        const iCapStr = lines[1].trim();
        const iCap = parseInt(iCapStr);
        if (isNaN(iCap) || (iCap !== 0 && iCap !== 1)) {
            showError(`[Format Error] Line 2: Invalid iCap value ("${iCapStr}"). Please enter 0 or 1.`);
            return;
        }

        const nTabStr = lines[3].trim();
        const nTab = parseInt(nTabStr);
        if (isNaN(nTab) || nTab <= 0) {
            showError(`[Format Error] Line 4: Invalid NTab value ("${nTabStr}"). Please enter a positive integer.`);
            return;
        }

        const expectedCols = (iCap === 1) ? 4 : 3;
        const startLine = 5; 
        
        let theta = [];
        let h = [];
        let k = [];
        let c = [];

        for (let i = 0; i < nTab; i++) {
            const lineIndex = startLine + i;
            if (lineIndex >= lines.length) {
                showError(`[Line Count Error] Insufficient data lines for NTab (${nTab} lines). Line ${lineIndex + 1} not found.`);
                return;
            }

            const line = lines[lineIndex].trim();
            const parts = line.split(/\s+/);

            if (parts.length < expectedCols) {
                showError(`[Data Error] Line ${lineIndex + 1}: Insufficient columns. Because iCap=${iCap}, ${expectedCols} columns are required.\nContent: ${line}`);
                return;
            }

            const t_val = parseFloat(parts[0]);
            const h_val = parseFloat(parts[1]);
            const k_val = parseFloat(parts[2]);

            if (isNaN(t_val) || isNaN(h_val) || isNaN(k_val)) {
                showError(`[Data Error] Line ${lineIndex + 1}: Contains data that cannot be read as a number.\nContent: ${line}`);
                return;
            }

            // Check if -h and K (to be plotted on log axes) are greater than 0
            const h_plot = -h_val;
            if (h_plot <= 0) {
                showError(`[Data Error] Line ${lineIndex + 1}: The value of -h to be plotted on a logarithmic axis is less than or equal to 0 (${h_plot}).\nContent: ${line}`);
                return;
            }
            if (k_val <= 0) {
                showError(`[Data Error] Line ${lineIndex + 1}: The value of K to be plotted on a logarithmic axis is less than or equal to 0 (${k_val}).\nContent: ${line}`);
                return;
            }

            theta.push(t_val);
            h.push(h_plot); 
            k.push(k_val);

            if (iCap === 1) {
                const c_val = parseFloat(parts[3]);
                if (isNaN(c_val)) {
                    showError(`[Data Error] Line ${lineIndex + 1}: The Capacity value cannot be read as a number.\nContent: ${line}`);
                    return;
                }
                
                // Check if C (to be plotted on a log axis) is greater than 0
                if (c_val <= 0) {
                    showError(`[Data Error] Line ${lineIndex + 1}: The value of C to be plotted on a logarithmic axis is less than or equal to 0 (${c_val}).\nContent: ${line}`);
                    return;
                }
                c.push(c_val);
            }
        }

        drawPlots(theta, h, k, c, iCap);
    }

    function drawPlots(theta, h, k, c, iCap) {
        // Shared layout for X-axis (-h: logarithmic)
        const xAxisLayoutLog = {
            title: 'Pressure Head (-h)',
            type: 'log',
            exponentformat: 'e',
            gridcolor: '#eee'
        };

        // 1. -h vs θ Plot
        const traceTheta = {
            x: h,
            y: theta,
            mode: 'lines+markers',
            name: 'Water Content (θ)',
            line: { color: '#1f77b4' }
        };
        const layoutTheta = {
            title: 'Pressure Head (-h) vs Water Content (θ)',
            xaxis: xAxisLayoutLog,
            yaxis: { 
                title: 'Water Content (θ)', 
                rangemode: 'tozero',
                gridcolor: '#eee'
            },
            plot_bgcolor: '#fff'
        };
        Plotly.newPlot('plotTheta', [traceTheta], layoutTheta);

        // 2. -h vs K Plot
        const traceK = {
            x: h,
            y: k,
            mode: 'lines+markers',
            name: 'Hydraulic Conductivity (K)',
            line: { color: '#2ca02c' }
        };
        const layoutK = {
            title: 'Pressure Head (-h) vs Hydraulic Conductivity (K)',
            xaxis: xAxisLayoutLog,
            yaxis: { 
                title: 'Hydraulic Conductivity (K)', 
                type: 'log',
                exponentformat: 'e',
                gridcolor: '#eee'
            },
            plot_bgcolor: '#fff'
        };
        Plotly.newPlot('plotK', [traceK], layoutK);

        // 3. θ vs K Plot
        const traceThetaK = {
            x: theta,
            y: k,
            mode: 'lines+markers',
            name: 'Hydraulic Conductivity (K)',
            line: { color: '#d62728' }
        };
        const layoutThetaK = {
            title: 'Water Content (θ) vs Hydraulic Conductivity (K)',
            xaxis: {
                title: 'Water Content (θ)',
                rangemode: 'tozero',
                gridcolor: '#eee'
            },
            yaxis: {
                title: 'Hydraulic Conductivity (K)',
                type: 'log',
                exponentformat: 'e',
                gridcolor: '#eee'
            },
            plot_bgcolor: '#fff'
        };
        Plotly.newPlot('plotThetaK', [traceThetaK], layoutThetaK);

        // 4. -h vs C Plot (Only if iCap === 1)
        if (iCap === 1) {
            const traceC = {
                x: h,
                y: c,
                mode: 'lines+markers',
                name: 'Hydraulic Capacity (C)',
                line: { color: '#ff7f0e' }
            };
            const layoutC = {
                title: 'Pressure Head (-h) vs Hydraulic Capacity (C)',
                xaxis: xAxisLayoutLog,
                yaxis: { 
                    title: 'Hydraulic Capacity (C)', 
                    type: 'log',
                    exponentformat: 'e',
                    gridcolor: '#eee'
                },
                plot_bgcolor: '#fff'
            };
            Plotly.newPlot('plotC', [traceC], layoutC);
        }
    }

    function showError(msg) {
        document.getElementById('errorOutput').innerText = msg;
    }
</script>

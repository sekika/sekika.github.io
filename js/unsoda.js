/* UNSODA Viewer
https://sekika.github.io/unsoda/
Author: Katsutoshi Seki
License: MIT License
*/

/* See https://plotly.com/javascript/getting-started/ */
const plotlyVersion = '2.32.0'
const plotlyUrl = `https://cdn.plot.ly/plotly-${plotlyVersion}.min.js`
const dataUrl = 'https://sekika.github.io/file/unsoda/unsoda.json'
const showColumn = ['code', 'texture', 'series', 'location', 'depth_upper',
  'depth_lower'
]
const unsatfit = ['2360', '2362', '3033', '4592', '4770', '4780', '3130', '3152', '3142', '3163', '3182', '4263', '4660', '4661', '3370', '3390', '3392', '3393', '4673', '3120']
const showName = {
  OM_content: 'Organic matter',
  k_sat: '<strong>K<sub>s</sub></strong> (saturated hydraulic conductivity)',
  theta_sat: '<strong>&theta;<sub>s</sub></strong> (saturated volumetric water content)',
  free_Fe_Al_oxide: 'Free Fe and Al oxide'
}
const unit = {
  bulk_density: 'g/cm<sup>3</sup>',
  particle_density: 'g/cm<sup>3</sup>',
  porosity: 'cm<sup>3</sup>/cm<sup>3</sup>',
  OM_content: 'mass %',
  k_sat: 'cm/day',
  theta_sat: 'cm<sup>3</sup>/cm<sup>3</sup>',
  CEC: 'cmol/kg',
  pH: '',
  electrolyte_level: 'meq/L',
  SAR: 'mmol<sup>1/2</sup>/L<sup>1/2</sup>',
  ESP: '%',
  EC: 'dS/m',
  free_Fe_Al_oxide: 'mass %'
}
const plotlyMargin = {
  l: 100,
  r: 30,
  b: 70,
  t: 10,
  pad: 1
}
let data = ''
let plot = {}

$.ajax({
  url: dataUrl,
  success(readdata) {
    data = readdata
    const code = location.search.replace('?', '')
    if (data.code.includes(code)) {
      const url = location.href.split('?')[0]
      $('#query').html(`<script src="${plotlyUrl}"></script>\n<a href="${url}">Select data from database</a>`)
      selectID(code)
      return
    }
    setQuery()
  },
  error() {
    $('#query').html('Could not load data.')
  }
})

function setQuery() {
  let text =
        'Texture: <select id="texture" onChange="select()">\n<option value="all" selected>All\n'
  const texture = values(data.general, 'texture')
  for (let i = 0; i < texture.length; i++) {
    text += `<option value="${texture[i]}">${texture[i]}\n`
  }
  text += '</select>'
  text +=
        ' Series: <select id="series" onChange="select()">\n<option value="all" selected>All\n'
  const series = values(data.general, 'series')
  for (let i = 0; i < series.length; i++) {
    text += `<option value="${series[i]}">${series[i]}\n`
  }
  text += '</select>'
  text += `<script src="${plotlyUrl}"></script>`
  $('#query').html(text)
  select()
}

function values(table, key) {
  const value = new Set()
  for (const code in table) {
    if (key in table[code] && table[code][key]) {
      let v = table[code][key]
      if (key === 'series') {
        v = truncateSeries(v)
      }
      value.add(v)
    }
  }
  return Array.from(value).sort()
}

function truncateSeries(str) {
  const strFirst = str.split(' ')[0]
  if (!['Medium', 'S.'].includes(strFirst)) {
    str = str.split(' ')[0]
  }
  return str
}

function select() {
  const t = document.getElementById('texture').value
  if (t === '') {
    return
  }
  const s = document.getElementById('series').value
  let text =
        '<div id="list" style="max-height:400px; overflow-y:scroll;"><table border="1"><tr>'
  for (let j = 0; j < showColumn.length; j++) {
    text += `<th>${showTitle(showColumn[j])}`
  }
  let count = 0
  for (let i = 0; i < data.code.length; i++) {
    const d = data.general[data.code[i]]
    if ((t === 'all' || t === d.texture) && (s === 'all' || s === truncateSeries(d.series))) {
      const id = data.code[i]
      const d = data.general[id]
      count += 1
      text += '<tr>'
      for (let j = 0; j < showColumn.length; j++) {
        if (j === 0) {
          text += `<td><a href="javascript:selectID(${id});">${
            d[showColumn[j]]}</a></td>`
        } else {
          text += `<td>${d[showColumn[j]]}</td>`
        }
      }
    }
  }
  text = `${count} data selected${text}</table></div>`
  $('#table').html(text)
  $('#show').html('')
}

function selectID(code) {
  const target = document.getElementById('list')
  if (target) {
    target.style.maxHeight = '150px'
  }
  let html = `<h2>UNSODA ${code}</h2>`
  if (location.search.replace('?', '') !== code) {
    html += `<p><a href="?${code}">Permalink</a></p>`
  }
  html += waterRetention(code)
  html += hydraulicConductivity(code)
  html += diffusivity(code)
  html += sizeDistribution(code)
  html += generalDescription(code)
  html += soilProperties(code)
  html += method(code)
  $('#show').html(html)
  drawPlot()
}

function waterRetention(code) {
  const s = scatterGroup(code, 'h-t')
  if (!s) {
    return ''
  }
  let html = '<h3>Water retention</h3>\n'
  const com = showComment(code, 'lwr', 'lab_wat_ret', 'Laboratory') +
          showComment(code, 'fwr', 'field_wat_ret', 'Field')
  if (com) {
    html += `<ul>${com}</ul>`
  }
  html += s
  return html
}

function hydraulicConductivity(code) {
  let s = scatterGroup(code, 'h-k')
  s += scatterGroup(code, 't-k')
  if (!s) {
    return ''
  }
  let html = '<h3>Hydraulic conductivity</h3>\n'
  if (unsatfit.includes(code)) {
    html += '<ul><li>Fitting result availabe at <a href="https://doi.org/10.2478/johh-2022-0039">Fig. 6 and Appendix in this paper</a>.</li></ul>\n'
  }
  const com = showComment(code, 'lhc', 'lab_hydr_cond', 'Laboratory') +
          showComment(code, 'fhc', 'field_hydr_cond', 'Field')
  if (com) {
    html += `<ul>${com}</ul>`
  }
  html += s
  return html
}

function diffusivity(code) {
  const s = scatterGroup(code, 't-d')
  if (!s) {
    return ''
  }
  let html = '<h3>Diffusivity</h3>\n'
  html += `<ul><li>Defined as D = K/C, C=-d&theta;/dh</li></ul>${s}`
  return html
}

function sizeDistribution(code) {
  let html = ''
  if (code in data.particle_size) {
    html += '<h3>Particle size distribution</h3>\n'
    html += scatter(code, 'particle_size')
  }
  if (code in data.aggregate_size_distribution) {
    html += '<h3>Aggregate size distribution</h3>\n'
    html += scatter(code, 'aggregate_size_distribution')
  }
  return html
}

function generalDescription(code) {
  let html = '<h3>General description</h3>\n<ul>\n'
  const d = data.general[code]
  for (const key in d) {
    if (d[key]) {
      html += showGeneral(d, key)
    }
  }
  html += showComment(code, 'general', 'general', 'Comment')
  html += '</ul>'
  return html
}

function showGeneral(d, key) {
  if (!key.includes('ID') || key.includes('site')) {
    return `<li>${showTitle(key)}: ${d[key]}`
  }
  if (d[key] === '999') {
    return ''
  }
  const id = d[key]
  key = key.replace('_ID', '')
  return `<li>${showTitle(key)}: ${data[key][id]}`
}

function soilProperties(code) {
  let html = '<h3>Soil properties</h3>\n<ul>\n'
  const sp = data.soil_properties[code]
  for (const key in sp) {
    if (sp[key] && key !== 'code') {
      html += `<li>${showTitle(key)}: ${sp[key]} ${unit[key]}`
    }
  }
  if (code in data.mineralogy && data.mineralogy[code].mineral_type) {
    const mineral = data.mineralogy[code]
    for (const key in mineral) {
      if (Object.hasOwn(mineral, key)) {
        html += `<li>${showTitle(key)}: ${mineral[key]}`
      }
    }
  }
  html += '</ul>'
  return html
}

function method(code) {
  let com = showComment(code, 'lab', 'lab_general', 'Laboratory')
  com += showComment(code, 'field', 'field_general', 'Field')
  com += showComment(code, 'soilprop', 'soil_properties', 'Soil properties')
  com += showComment(code, 'lsc', 'lab_sat_cond', 'Laboratory K<sub>s</sub>')
  com += showComment(code, 'fsc', 'field_sat_cond', 'Field K<sub>s</sub>')
  if (com === '') {
    return ''
  }
  return `\n\n<h3>Method</h3>\n<ul>${com}</ul>`
}

function showComment(code, method, table, comment) {
  const m = data.methodology[code]
  if (`comment_${method}_ID` in m) {
    const id = m[`comment_${method}_ID`]
    if (id === '999') {
      return ''
    }
    return `<li>${comment}: ${data[`comment_${table}`][id]}`
  }
  return ''
}

async function drawPlot() {
  await waitPlotly()
  for (const p in plot) {
    if (Object.hasOwn(plot, p)) {
      Plotly.newPlot(p, [plot[p][0]], plot[p][1])
    }
  }
  plot = []
}

const waitPlotly = () => new Promise((resolve) => {
  const checkInterval = 50
  const interval = setInterval(() => {
    if (typeof Plotly === 'undefined') {
      return
    }
    clearInterval(interval)
    resolve()
  }, checkInterval)
})

function showTitle(str) {
  if (str in showName) {
    str = showName[str]
  } else {
    str = str.split('_').join(' ')
    str = str[0].toUpperCase() + str.substring(1)
  }
  return str
}

function scatterGroup(code, group) {
  let html = ''
  const tables = [`lab_drying_${group}`, `lab_wetting_${group}`,
    `field_drying_${
      group}`, `field_wetting_${group}`
  ]
  tables.forEach((table) => {
    html += scatter(code, table)
  })
  return html
}

function scatter(code, table) {
  if (!(code in data[table])) {
    return ''
  }
  const d = data[table][code]
  const x = d[0]
  const y = d[1]
  const tt = table.split('_')
  let labelX
  let labelY
  let typeX
  let typeY
  let html = '<ul>'
  if (tt[1] === 'size') {
    labelX = 'Size (μm)'
    labelY = 'Mass fraction'
    typeX = 'log'
    typeY = 'normal'
  } else {
    const caption = `${tt[0]} ${tt[1]}`
    const par = tt[2].split('-')
    const label = {
      h: 'h (cm)',
      t: 'θ',
      k: 'K (cm/day)',
      d: 'D (cm^2/d)'
    }
    labelX = label[par[0]]
    labelY = label[par[1]]
    typeX = 'log'
    typeY = 'log'
    if (par[0] === 't') {
      typeX = 'normal'
    }
    if (par[1] === 't') {
      typeY = 'normal'
    }
    html += `<li>${showTitle(caption)}</li>`
    if (tt[2] === 'h-t') {
      html += `<li><a href="https://seki.webmasters.gr.jp/swrc/?unsoda=${
        code
      }&place=${tt[0]}&process=${tt[1]
      }">Fit with various water retention models</a> data will be transferred</li>`
    }
  }
  html += `<li>${labelX} = ${x.toString()}</li>`
  html += `<li>${labelY} = ${y.toString()}</li></ul>`
  html += `<div id="${table}"></div>`
  const p = {
    x,
    y,
    mode: 'markers',
    type: 'scatter'
  }
  const layout = {
    xaxis: {
      type: typeX,
      autorange: true,
      title: {
        text: labelX
      }
    },
    yaxis: {
      type: typeY,
      autorange: true,
      title: {
        text: labelY
      }
    },
    width: 400,
    height: 300,
    margin: plotlyMargin
  }
  plot[table] = [p, layout]
  return html
}

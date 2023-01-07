"use strict";
const data_url = 'https://sekika.github.io/file/unsoda/unsoda.json';
const show_name = {'OM_content': 'Organic matter', 'k_sat': '<strong>K<sub>s</sub></strong> (saturated hydraulic conductivity)', 'theta_sat': '<strong>&theta;<sub>s</sub></strong> (saturated volumetric water content)', 'free_Fe_Al_oxide': 'Free Fe and Al oxide'}
const unit = {'bulk_density': 'g/cm<sup>3</sup>', 'particle_density': 'g/cm<sup>3</sup>', 'porosity': 'cm<sup>3</sup>/cm<sup>3</sup>', 'OM_content': 'mass %', 'k_sat': 'cm/day', 'theta_sat': 'cm<sup>3</sup>/cm<sup>3</sup>', 'CEC': 'cmol/kg', 'pH': '', 'electrolyte_level': 'meq/L', 'SAR': 'mmol<sup>1/2</sup>/L<sup>1/2</sup>', 'ESP': '%', 'EC': 'dS/m', 'free_Fe_Al_oxide': 'mass %'}
var data = '';
var plot = {};

$.ajax({
    url: data_url,
    success: function(readdata) {
        data = readdata;
        let code = location.search.replace('?','');
        if ( data['code'].includes(code) ) {
            SelectID(code);
            let url = location.href.split('?')[0];
            $('#query').html('<a href="' + url + '">Select data from database</a>');
            return;
        }
        set_query();
    },
    error: function() {
        $('#query').html('Could not load data.');
    }
});

function set_query() {
    var text = 'Texture: <select id="texture" onChange="select()">\n<option value="all" selected>All\n';
    let texture = values(data['general'], 'texture');
    for (let i = 0; i < texture.length; i++) {
        text += '<option value="' + texture[i] + '">' + texture[i] + '\n';
    }
    text += '</select>'
    $('#query').html(text);
    select();
}

function values(table, key) {
    let value = new Set();
    for (let code in table) {
        if (key in table[code] && table[code][key]) {
            value.add(table[code][key]);
        }
    }
    return Array.from(value).sort();
}

function select() {
    let key = ['code', 'texture', 'location', 'keyword'];
    let t = document.getElementById("texture").value;
    if (t == '') {
        return;
    }
    var text = '<div id="list" style="max-height:400px; overflow-y:scroll;"><table border="1"><tr>';
    for (let j = 0; j < key.length; j++) {
        text += '<td>' + key[j];
    }
    let count = 0;
    for (let i = 0; i < data['code'].length; i++) {
        if (t == 'all' || data['general'][data['code'][i]]['texture'] == t) {
            let id = data['code'][i]
            let d = data['general'][id];
            count += 1;
            text += '<tr>'
            for (let j = 0; j < key.length; j++) {
                if (j == 0) {
                    text += '<td><a href="javascript:SelectID(' + id + ');">' + d[key[j]] + '</a></td>';
                } else {
                    text += '<td>' + d[key[j]] + '</td>';
                }
            }
        }
    }
    text = count + ' data selected' + text;
    text += '</table></div>'
    $('#table').html(text);
    $('#show').html('');
}

function SelectID(code) {
    var html = '<h2>UNSODA ' + code + '</h2>';
    let target = document.getElementById("list");  
    if (target) {
        target.style.maxHeight="150px";
    }      
    if (location.search.replace('?','') != code) {
        html += '<p><a href="?' + code + '">Permalink</a></p>';
    }
    if (code in data['lab_drying_h-t'] || code in data['lab_wetting_h-t'] || code in data['field_drying_h-t'] || code in data['field_wetting_h-t']) {
        html += '<h3>Water retention</h3>\n';
        let com = show_comment(code, 'lwr', 'lab_wat_ret', 'Laboratory') + show_comment(code, 'fwr', 'field_wat_ret', 'Field') 
        if (com) {
            html += '<ul>'+ com + '</ul>';
        }
        let tables = ['lab_drying_h-t', 'lab_wetting_h-t', 'field_drying_h-t', 'field_wetting_h-t'];
        tables.forEach(table => {
            html += scatter(code, table);
        });
    }
    if (code in data['lab_drying_h-k'] || code in data['lab_wetting_h-k'] || code in data['field_drying_h-k'] || code in data['field_wetting_h-k'] || code in data['lab_drying_t-k'] || code in data['lab_wetting_t-k'] || code in data['field_drying_t-k'] || code in data['field_wetting_t-k'] || code in data['lab_drying_t-d'] || code in data['lab_wetting_t-d'] || code in data['field_drying_t-d'] || code in data['field_wetting_t-d'] ) {
        html += '<h3>Hydraulic conductivity</h3>\n';
        let com = show_comment(code, 'lhc', 'lab_hydr_cond', 'Laboratory') + show_comment(code, 'fhc', 'field_hydr_cond', 'Field') 
        if (com) {
            html += '<ul>'+ com + '</ul>';
        }
        let tables = ['lab_drying_h-k', 'lab_wetting_h-k', 'field_drying_h-k', 'field_wetting_h-k'];
        tables.forEach(table => {
            html += scatter(code, table);
        });
        tables = ['lab_drying_t-k', 'lab_wetting_t-k', 'field_drying_t-k', 'field_wetting_t-k'];
        tables.forEach(table => {
            html += scatter(code, table);
        });
        tables = ['lab_drying_t-d', 'lab_wetting_t-d', 'field_drying_t-d', 'field_wetting_t-d'];
        tables.forEach(table => {
            html += scatter(code, table);
        });
    }
    if (code in data['particle_size']) {
        html += '<h3>Particle size distribution</h3>\n';
        html += scatter(code, 'particle_size')
    }
    if (code in data['aggregate_size_distribution']) {
        html += '<h3>Aggregate size distribution</h3>\n';
        html += scatter(code, 'aggregate_size_distribution')
    }

    html += '<h3>General description</h3>\n<ul>\n';
    let d = data['general'][code];
    for ( let key in d ) {
        if (d[key]) {
            if ( key.includes('ID') && !key.includes('site')) {
                if ( d[key] != '999' ) {
                    let id = d[key]
                    key = key.replace('_ID', '');
                    html += '<li>' + show_title(key) + ': ' + data[key][id];
                }
            } else {
                html += '<li>' + show_title(key) + ': ' + d[key];
            }
        }
    }
    html += show_comment(code, 'general', 'general', 'Comment')
    html += '</ul>';

    html += '<h3>Soil properties</h3>\n<ul>\n';
    let sp = data['soil_properties'][code];
    for ( let key in sp ) {
        if (sp[key] && key != 'code') {
            {
                html += '<li>' + show_title(key) + ': ' + sp[key] + ' ' + unit[key];
            }
        }
    }
    if (code in data['mineralogy'] && data['mineralogy'][code]['mineral_type']) {
        let mineral = data['mineralogy'][code];
        for (let key in mineral) {
            html += '<li>' + show_title(key) + ': ' + mineral[key];
        }
    }
    let com = ''
    com += show_comment(code, 'lab', 'lab_general', 'Laboratory')
    com += show_comment(code, 'field', 'field_general', 'Field')
    com += show_comment(code, 'soilprop', 'soil_properties', 'Soil properties')
    com += show_comment(code, 'lsc', 'lab_sat_cond', 'Laboratory K<sub>s</sub>')
    com += show_comment(code, 'fsc', 'field_sat_cond', 'Field K<sub>s</sub>')
    if (com != '') {
        html += '</ul>\n\n<h3>Method</h3>\n<ul>';
        html += com;
    }
    html += '</ul>';
    $('#show').html(html);
    for (let p in plot) {
        Plotly.newPlot(p, [plot[p][0]], plot[p][1]);
    }
    plot = [];
}

function show_title(str) {
    if ( str in show_name ) {
        str = show_name[str];
    } else {
        str = str.split('_').join(' ');
        str = str[0].toUpperCase() + str.substring(1);
    }
    return str
}

function show_comment(code, method, table, comment) {
    let m = data['methodology'][code];
    if ("comment_" + method + "_ID" in m) {
        let id = m['comment_' + method + '_ID'];
        if (id == '999') {
            return ''
        }
        return '<li>' + comment + ': ' + data['comment_' + table][id];
    }
    return ''
}

function scatter(code, table) {
    if (!(code in data[table])) {
        return '';
    }
    let d = data[table][code];
    let x = d[0]
    let y = d[1]
    let tt = table.split('_');
    let label_x, label_y, type_x, type_y;
    let ret = '<ul>';
    if (tt[1] == 'size') {
        label_x = 'size (μm)';
        label_y = 'fraction';
        type_x = 'log';
        type_y = 'normal';
    } else {
        let caption = tt[0] + ' ' + tt[1];
        let par = tt[2].split('-');
        let label = {
            'h': 'h (cm)',
            't': 'θ',
            'k': 'K (cm/day)',
            'd': 'Diffusivity (cm^2/d)'
        }
        label_x = label[par[0]];
        label_y = label[par[1]];
        type_x = 'log';
        type_y = 'log';
        if (par[0] == 't') {
            type_x = 'normal';
        } 
        if (par[1] == 't') {
            type_y = 'normal';
        } 
        ret += '<li>' + show_title(caption) + '</li>';
        if (tt[2] == 'h-t') {
            ret += '<li><a href="https://seki.webmasters.gr.jp/swrc/?unsoda=' + code + '&place=' + tt[0] + '&process=' + tt[1] + '">Fit with various water retention models</a> data will be transferred</li>'
        }
    }
    ret += '<li>' + label_x + ' = ' + x.toString() + '</li>';
    ret += '<li>' + label_y + ' = ' + y.toString() + '</li></ul>';
    ret += '<div id="' + table + '"></div>';
    let p = {
        x: x,
        y: y,
        mode: 'markers',
        type: 'scatter'
    };
    let layout = {
        xaxis: {
          type: type_x,
          autorange: true,
          title: {
            text: label_x
          }
        },
        yaxis: {
            type: type_y,
            autorange: true,
          title: {
            text: label_y
          }
        },
        width: 400,
        height: 300,
        margin: {
            l: 100,
            r: 30,
            b: 70,
            t: 10,
            pad: 1
        }
    };
    plot[table] = [p, layout];
    return ret;
}

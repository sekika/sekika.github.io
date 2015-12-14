---
layout: search
title: 検索
permalink: /search/
---
<h1>検索</h1>

<ul>
<li><a href="http://la.ma.la/search.html">こちらのスクリプト</a>を使わせていただきました。
<li>ひらがなカタカナはローマ字のまま検索できます。
</ul>
<br>

<input type="text" id="q" onkeyup="do_find(this.value)" onkeydown="key(event.keyCode)" autocomplete="off">　<span id="stat"></span>
<div id="navi"></div>
<div id="result"></div>
<script>
window.onload=function(){
	gid("q").focus();
}
//Stringの拡張
{
	$_ = String.prototype;
	//一括置換
	$_.mReplace = function(pat,flag){
		var temp = this;
		if(!flag){flag=""}
		for(var i in pat){
			var re = new RegExp(i,flag);
			temp = temp.replace(re,pat[i])
		}
		return temp;
	};
}
// Date の拡張
{
	$_ = Date.prototype;
	//日付の書式
	$_.format = "yyyy-mm-dd HH:MM:SS";
	$_.formatTime = function(format){
		var yy;
		var o = {
			yyyy : ((yy = this.getYear()) < 2000)? yy+1900 : yy,
			mm   : this.getMonth() + 1,
			dd   : this.getDate(),
			HH   : this.getHours(),
			MM   : this.getMinutes(),
			SS   : this.getSeconds()
		}
		for(var i in o){
			if (o[i] < 10) o[i] = "0" + o[i];
		}
		return (format) ? format.mReplace(o) : this.format.mReplace(o);
	}
}
</script>
<script>
var start = new Date().getTime();
var bodylist = [];
var st = gid("stat");
var re = gid("result");
var nv = gid("navi");
var max = 10;
var KC = {
	enter: 13,
	left : 37,
	right: 39
};
function gid(id){
	return document.getElementById(id);
}
function ignore_case(){
	var a = arguments;
	return "[" + a[0] + a[0].toUpperCase() + "]"
}
function do_find(v){
	if(this.lastquery == v){return}
	this.lastquery = v;
	var re = find(v);
	if(re.length){
		pagenavi(re);
		view(re)
	}
}
function key(c){
	switch(c){
		case KC.enter: mv(1);break;
		case KC.left : mv(-1);break;
		case KC.right: mv(1);break;
	}
}
function find(v){
	var query = v;
	if(!v){return []}
	var aimai;
	if(query){
		aimai = roma2.fuzzy(query);
		aimai = aimai.replace(/[a-z]/g,ignore_case);
		try{
			reg = new RegExp(aimai,"g");
		}catch(e){
			reg = /(.)/g;
		}
	}else{
		reg = /(.)/g;
	}
	var start = new Date().getTime();
	var result = [];
	for(var i=0;i<data.length;i++){
		//var s = data[i].body;
		var s = bodylist[i];
		var res = reg.exec(s);
		if(!res){continue}
		var len = res[0].length;
		var idx = res.index;
		if(idx != -1){
			result.push([i,idx,len]);
		}
	}
	st.innerHTML = result.length +"件ヒット / "+ data.length+"件中";
	var end = new Date().getTime();
	window.status = (end-start) + " ms";
	return result;
}
function time2date(time){
	if(!this.cache){this.cache = {}};
	if(this.cache[time]) return this.cache[time];
	var d = new Date(time*1000);
	this.cache[time] = d.formatTime("yyyy年mm月dd日");
	return this.cache[time];
}
function snippet(body,idx,len){
	var start = idx - 20;
	return [
		body.substring(start,idx),
		,"<b>"
		,body.substr(idx,len)
		,"</b>"
		,body.substr(idx+len,50),
	].join("");
}
function pagenavi(result){
	var len = result.length;
	var ct = Math.ceil(len/max);
	var buf = [];
	for(var i=0;i<ct;i++){
		buf.push(
			"<span onclick='view(\"\","
			,i+1
			,");sw(",i,")'>"
			,i+1
			,"</span>"
		);
	}
	nv.innerHTML = buf.join("");
	sw(0);
}
function sw(t){
	var span = nv.getElementsByTagName("span");
	for(var i=0;i<span.length;i++){
		span[i].className = (i==t)?"selected":"";
	}
}
function mv(to){
	var span = nv.getElementsByTagName("span");
	var current;
	if(!span.length){return}
	for(var i=0;i<span.length;i++){
		if(span[i].className == "selected"){
			current = i;break;
		}
	}
	var moveto = current+to;
	if(moveto < 0){return}
	if(moveto > span.length-1){moveto=0}
	sw(moveto);
	view("",moveto+1)
}
function view(result,offset){
	if(!offset){offset = 1}
	if(!result){
		result = this.last.reverse();
	}else{
		this.last = result;
	}
	var r = result.reverse();
	var buf = ["<dl>"];
	var count = 0;
	for(var i=(offset-1)*10;i<r.length;i++){
		count++;
		if(count > max){break}
		var num = r[i][0];
		var idx = r[i][1];
		var len = r[i][2];
		with(data[num]){
			buf.push(
				"<dt><a href='",file,"'>"
				,title||"無題","</a>"
				,"<dd>"
				,snippet(bodylist[num],idx,len)
				,"<br><span>"
				,"作成日:",time2date(ctime)
				,(time2date(ctime)!=time2date(mtime))?
					"(更新日"+time2date(mtime)+")":""
				,"</span><br>"
			);
		}
	}
	re.innerHTML = buf.join("");
}
for(var i=0;i<data.length;i++){
	bodylist.push(data[i].body);
}
var bodyidx = bodylist.join("<>");
var end = new Date().getTime();
window.status = (end-start) + " ms";
</script>

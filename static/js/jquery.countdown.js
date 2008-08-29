
(function($){function Countdown(){this._nextId=0;this._inst=[];this.regional=[];this.regional['']={labels:['Years','Months','Weeks','Days','Hours','Minutes','Current Score'],labelsSingle:['Year','Month','Week','Day','Hour','Minute','Point'],compactLabels:['y','m','w','d'],compactLabelsSingle:['y','m','w','d'],timeSeparator:':'};this._defaults={format:'dHMS',compact:false,description:'',expiryUrl:null,alwaysExpire:false,onExpiry:null,onTick:null,serverTime:null};$.extend(this._defaults,this.regional['']);}
$.extend(Countdown.prototype,{markerClassName:'hasCountdown',_register:function(inst){var id=this._nextId++;this._inst[id]=inst;return id;},_getInst:function(id){return this._inst[id]||id;},setDefaults:function(settings){extendRemove(this._defaults,settings||{});},_attachCountdown:function(target,inst){target=$(target);if(target.is('.'+this.markerClassName)){return;}
target.addClass(this.markerClassName);target[0]._cdnId=inst._id;inst._target=target;this._updateCountdown(inst._id);},_updateCountdown:function(id){var inst=this._getInst(id);inst._target.html(inst._generateHTML());var onTick=inst._get('onTick');if(onTick){onTick.apply(inst._target[0],[inst._periods]);}
var expired=(inst._since?inst._now.getTime()<=inst._since.getTime():inst._now.getTime()>=inst._until.getTime());if(expired){if(inst._timer||inst._get('alwaysExpire')){var onExpiry=inst._get('onExpiry');if(onExpiry){onExpiry.apply(inst._target[0],[]);}
var expiryUrl=inst._get('expiryUrl');if(expiryUrl){window.location=expiryUrl;}}
inst._timer=null;}
else{var format=inst._get('format');inst._timer=setTimeout('$.countdown._updateCountdown('+inst._id+')',(format.match('s|S')?2:(format.match('m|M')?30:600))*980);}},_changeCountdown:function(target,settings){var inst=this._getInst(target._cdnId);if(inst){extendRemove(inst._settings,settings||{});inst._adjustSettings();this._updateCountdown(inst._id);}},_destroyCountdown:function(target){target=$(target);if(!target.is('.'+this.markerClassName)){return;}
target.removeClass(this.markerClassName);target.empty();clearTimeout(this._inst[target[0]._cdnId]._timer);this._inst[target[0]._cdnId]=null;target[0]._cdnId=undefined;}});var Y=0;var O=1;var W=2;var D=3;var H=4;var M=5;var S=6;function CountdownInstance(settings){this._id=$.countdown._register(this);this._target=null;this._timer=null;this._now=null;this._periods=[0,0,0,0,0,0,0];this._settings=extendRemove({},settings||{});this._adjustSettings();}
$.extend(CountdownInstance.prototype,{_get:function(name){return(this._settings[name]!=null?this._settings[name]:$.countdown._defaults[name]);},_adjustSettings:function(){var now=new Date();var serverTime=this._get('serverTime');this._offset=(serverTime?serverTime.getTime()-now.getTime():0);this._since=this._get('since');if(this._since){this._since=this._determineTime(this._since,null);this._since.setMilliseconds(0);}
this._until=this._determineTime(this._get('until'),now);this._until.setMilliseconds(0);},_determineTime:function(setting,defaultTime){var offsetNumeric=function(offset){var time=new Date();time.setTime(time.getTime()+offset*1000);return time;};var getDaysInMonth=function(year,month){return 32-new Date(year,month,32).getDate();};var offsetString=function(offset){var time=new Date();var year=time.getFullYear();var month=time.getMonth();var day=time.getDate();var hour=time.getHours();var minute=time.getMinutes();var second=time.getSeconds();var pattern=/([+-]?[0-9]+)\s*(s|S|m|M|h|H|d|D|w|W|o|O|y|Y)?/g;var matches=pattern.exec(offset);while(matches){switch(matches[2]||'s'){case's':case'S':second+=parseInt(matches[1]);break;case'm':case'M':minute+=parseInt(matches[1]);break;case'h':case'H':hour+=parseInt(matches[1]);break;case'd':case'D':day+=parseInt(matches[1]);break;case'w':case'W':day+=parseInt(matches[1])*7;break;case'o':case'O':month+=parseInt(matches[1]);day=Math.min(day,getDaysInMonth(year,month));break;case'y':case'Y':year+=parseInt(matches[1]);day=Math.min(day,getDaysInMonth(year,month));break;}
matches=pattern.exec(offset);}
time=new Date(year,month,day,hour,minute,second,0);return time;};return(setting==null?defaultTime:(typeof setting=='string'?offsetString(setting):(typeof setting=='number'?offsetNumeric(setting):setting)));},_generateHTML:function(){var format=this._get('format');var show=[];show[Y]=(format.match('y')?'?':(format.match('Y')?'!':null));show[O]=(format.match('o')?'?':(format.match('O')?'!':null));show[W]=(format.match('w')?'?':(format.match('W')?'!':null));show[D]=(format.match('d')?'?':(format.match('D')?'!':null));show[H]=(format.match('h')?'?':(format.match('H')?'!':null));show[M]=(format.match('m')?'?':(format.match('M')?'!':null));show[S]=(format.match('s')?'?':(format.match('S')?'!':null));this._periods=periods=this._calculatePeriods(show,new Date());var shownNonZero=false;var showCount=0;for(var period=0;period<show.length;period++){shownNonZero|=(show[period]=='?'&&periods[period]>0);show[period]=(show[period]=='?'&&!shownNonZero?null:show[period]);showCount+=(show[period]?1:0);}
var compact=this._get('compact');var labels=(compact?this._get('compactLabels'):this._get('labels'));var labelsSingle=(compact?this._get('compactLabelsSingle'):this._get('labelsSingle'))||labels;var timeSeparator=this._get('timeSeparator');var description=this._get('description')||'';var twoDigits=function(value){return(value<10?'0':'')+value;};var showCompact=function(period){return(show[period]?periods[period]+(periods[period]==1?labelsSingle[period]:labels[period])+' ':'');};var showFull=function(period){return(show[period]?'<div class="countdown_section"><span class="countdown_amount">'+
periods[period]+'</span><br/>'+(periods[period]==1?labelsSingle[period]:labels[period])+'</div>':'');};return(compact?'<div class="countdown_row countdown_amount">'+
showCompact(Y)+showCompact(O)+showCompact(W)+showCompact(D)+
twoDigits(this._periods[H])+timeSeparator+
twoDigits(this._periods[M])+(show[S]?timeSeparator+twoDigits(this._periods[S]):''):'<div class="countdown_row countdown_show'+showCount+'">'+
showFull(Y)+showFull(O)+showFull(W)+showFull(D)+
showFull(H)+showFull(M)+showFull(S))+'</div>'+
(description?'<div class="countdown_row countdown_descr">'+description+'</div>':'');},_calculatePeriods:function(show,now){this._now=now;this._now.setMilliseconds(0);var until=new Date(this._now.getTime());if(this._since&&now.getTime()<this._since.getTime()){this._now=now=until;}
else if(this._since){now=this._since;}
else{until=new Date(this._until.getTime());if(now.getTime()>this._until.getTime()){this._now=now=until;}}
until.setTime(until.getTime()-this._offset);var periods=[0,0,0,0,0,0,0];if(show[Y]||show[O]){var months=Math.max(0,(until.getFullYear()-now.getFullYear())*12+
until.getMonth()-now.getMonth()+(until.getDate()<now.getDate()?-1:0));periods[Y]=(show[Y]?Math.floor(months/12):0);periods[O]=(show[O]?months-periods[Y]*12:0);now=new Date(now.getTime());now.setFullYear(now.getFullYear()+periods[Y]);now.setMonth(now.getMonth()+periods[O]);}
var diff=Math.floor((until.getTime()-now.getTime())/1000);var extractPeriod=function(period,numSecs){periods[period]=(show[period]?Math.floor(diff/numSecs):0);diff-=periods[period]*numSecs;};extractPeriod(W,604800);extractPeriod(D,86400);extractPeriod(H,3600);extractPeriod(M,60);extractPeriod(S,.10);return periods;}});function extendRemove(target,props){$.extend(target,props);for(var name in props){if(props[name]==null){target[name]=null;}}
return target;}
$.fn.countdown=function(options){var otherArgs=Array.prototype.slice.call(arguments,1);return this.each(function(){if(typeof options=='string'){$.countdown['_'+options+'Countdown'].apply($.countdown,[this].concat(otherArgs));}
else{$.countdown._attachCountdown(this,new CountdownInstance(options));}});};$(function(){$.countdown=new Countdown();});})(jQuery);
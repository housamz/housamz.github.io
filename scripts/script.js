jQuery(function($) {

/*-------------------------------------------
Cursor
---------------------------------------------*/
	if ($(window).width() < 800) {} else {
		$(document).mousemove(function(e) {
			$('.cursor').eq(0).css({
				left: e.pageX,
				top: e.pageY
			});
			setTimeout(function() {
				$('.cursor').eq(1).css({
					left: e.pageX,
					top: e.pageY
				});
			}, 100);
		});

		$("a").hover(
			function (){
				$('.cursor').eq(0).stop().animate({
					width: 15,
					height: 15
				}).css("background-color", "#007ec0");
			},
			function (){
				$('.cursor').eq(0).stop().animate({
					width: 10,
					height: 10
				}).css("background-color", "#00ccaf");
			}
		);
	}

	$('#masonry-container').masonry({
		itemSelector: '.item',
		isAnimated: true // the animated makes the process smooth
	});
	$(window).resize(function() {
		$('#masonry-container').masonry({
			itemSelector: '.item',
			isAnimated: true
		}, 'reload');
	});
	
	$('[data-toggle="tooltip"]').tooltip();
	
	$("#main-nav li").hover(function(){
		$(this).find('ul:first:hidden').fadeIn();
	},function(){
		$(this).find('ul:first').fadeOut();
	});
	
	$("#back-top").hide();
	$(function () {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {
				$('#back-top').fadeIn();
			} else {
				$('#back-top').fadeOut();
			}
		});

		$('#back-top').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 1000);
			$('.fa-rocket').addClass("teery");

			setTimeout(function(){ $('.fa-rocket').removeClass('teery'); }, 1000);

			return false;
		});
	});

	// check if whoami
	if($("#dates").html()) {
		
		// timelinr.min.js
		function autoPlay(){var s=$(settings.datesDiv).find("a."+settings.datesSelectedClass);"forward"==settings.autoPlayDirection?s.parent().is("li:last-child")?$(settings.datesDiv+" li:first-child").find("a").trigger("click"):s.parent().next().find("a").trigger("click"):"backward"==settings.autoPlayDirection&&(s.parent().is("li:first-child")?$(settings.datesDiv+" li:last-child").find("a").trigger("click"):s.parent().prev().find("a").trigger("click"))}jQuery.fn.timelinr=function(s){settings=jQuery.extend({orientation:"horizontal",containerDiv:"#timeline",datesDiv:"#dates",datesSelectedClass:"selected",datesSpeed:"normal",issuesDiv:"#issues",issuesSelectedClass:"selected",issuesSpeed:"fast",issuesTransparency:0,issuesTransparencySpeed:500,prevButton:"#prev",nextButton:"#next",arrowKeys:"false",startAt:1,autoPlay:"false",autoPlayDirection:"forward",autoPlayPause:2e3},s),$(function(){var s=$(settings.datesDiv+" li").length,t=$(settings.issuesDiv+" li").length,e=($(settings.datesDiv).find("a."+settings.datesSelectedClass),$(settings.issuesDiv).find("li."+settings.issuesSelectedClass),$(settings.containerDiv).width()),i=$(settings.containerDiv).height(),n=($(settings.issuesDiv).width(),$(settings.issuesDiv).height(),$(settings.issuesDiv+" li").width()),a=$(settings.issuesDiv+" li").height(),g=($(settings.datesDiv).width(),$(settings.datesDiv).height(),$(settings.datesDiv+" li").width()),l=$(settings.datesDiv+" li").height();if("horizontal"==settings.orientation){$(settings.issuesDiv).width(n*t),$(settings.datesDiv).width(g*s).css("marginLeft",0);var d=parseInt($(settings.datesDiv).css("marginLeft").substring(0,$(settings.datesDiv).css("marginLeft").indexOf("px")))}else if("vertical"==settings.orientation){$(settings.issuesDiv).height(a*t),$(settings.datesDiv).height(l*s).css("marginTop",i/2-l/2);var d=parseInt($(settings.datesDiv).css("marginTop").substring(0,$(settings.datesDiv).css("marginTop").indexOf("px")))}$(settings.datesDiv+" a").click(function(t){t.preventDefault();var e=($(this).text(),$(this).parent().prevAll().length);"horizontal"==settings.orientation?$(settings.issuesDiv).animate({marginLeft:-n*e},{queue:!1,duration:settings.issuesSpeed}):"vertical"==settings.orientation&&$(settings.issuesDiv).animate({marginTop:-a*e},{queue:!1,duration:settings.issuesSpeed}),$(settings.issuesDiv+" > li").animate({opacity:settings.issuesTransparency},{queue:!1,duration:settings.issuesSpeed}).removeClass(settings.issuesSelectedClass).eq(e).addClass(settings.issuesSelectedClass).fadeTo(settings.issuesTransparencySpeed,1),1==s?$(settings.prevButton+","+settings.nextButton).fadeOut("fast"):2==s?$(settings.issuesDiv+" li:first-child").hasClass(settings.issuesSelectedClass)?($(settings.prevButton).fadeOut("fast"),$(settings.nextButton).fadeIn("fast")):$(settings.issuesDiv+" li:last-child").hasClass(settings.issuesSelectedClass)&&($(settings.nextButton).fadeOut("fast"),$(settings.prevButton).fadeIn("fast")):$(settings.issuesDiv+" li:first-child").hasClass(settings.issuesSelectedClass)?($(settings.nextButton).fadeIn("fast"),$(settings.prevButton).fadeOut("fast")):$(settings.issuesDiv+" li:last-child").hasClass(settings.issuesSelectedClass)?($(settings.prevButton).fadeIn("fast"),$(settings.nextButton).fadeOut("fast")):$(settings.nextButton+","+settings.prevButton).fadeIn("slow"),$(settings.datesDiv+" a").removeClass(settings.datesSelectedClass),$(this).addClass(settings.datesSelectedClass),"horizontal"==settings.orientation?$(settings.datesDiv).animate({marginLeft:d-g*e},{queue:!1,duration:"settings.datesSpeed"}):"vertical"==settings.orientation&&$(settings.datesDiv).animate({marginTop:d-l*e},{queue:!1,duration:"settings.datesSpeed"})}),$(settings.nextButton).bind("click",function(e){e.preventDefault();var i=$(settings.issuesDiv).find("li."+settings.issuesSelectedClass).index();if("horizontal"==settings.orientation){{var g=parseInt($(settings.issuesDiv).css("marginLeft").substring(0,$(settings.issuesDiv).css("marginLeft").indexOf("px")));parseInt($(settings.datesDiv).css("marginLeft").substring(0,$(settings.datesDiv).css("marginLeft").indexOf("px")))}-(n*t-n)>=g?($(settings.issuesDiv).stop(),$(settings.datesDiv+" li:last-child a").click()):$(settings.issuesDiv).is(":animated")||$(settings.datesDiv+" li").eq(i+1).find("a").trigger("click")}else if("vertical"==settings.orientation){{var g=parseInt($(settings.issuesDiv).css("marginTop").substring(0,$(settings.issuesDiv).css("marginTop").indexOf("px")));parseInt($(settings.datesDiv).css("marginTop").substring(0,$(settings.datesDiv).css("marginTop").indexOf("px")))}-(a*t-a)>=g?($(settings.issuesDiv).stop(),$(settings.datesDiv+" li:last-child a").click()):$(settings.issuesDiv).is(":animated")||$(settings.datesDiv+" li").eq(i+1).find("a").trigger("click")}1==s?$(settings.prevButton+","+settings.nextButton).fadeOut("fast"):2==s?$(settings.issuesDiv+" li:first-child").hasClass(settings.issuesSelectedClass)?($(settings.prevButton).fadeOut("fast"),$(settings.nextButton).fadeIn("fast")):$(settings.issuesDiv+" li:last-child").hasClass(settings.issuesSelectedClass)&&($(settings.nextButton).fadeOut("fast"),$(settings.prevButton).fadeIn("fast")):$(settings.issuesDiv+" li:first-child").hasClass(settings.issuesSelectedClass)?$(settings.prevButton).fadeOut("fast"):$(settings.issuesDiv+" li:last-child").hasClass(settings.issuesSelectedClass)?$(settings.nextButton).fadeOut("fast"):$(settings.nextButton+","+settings.prevButton).fadeIn("slow")}),$(settings.prevButton).click(function(t){t.preventDefault();var e=$(settings.issuesDiv).find("li."+settings.issuesSelectedClass).index();if("horizontal"==settings.orientation){{var i=parseInt($(settings.issuesDiv).css("marginLeft").substring(0,$(settings.issuesDiv).css("marginLeft").indexOf("px")));parseInt($(settings.datesDiv).css("marginLeft").substring(0,$(settings.datesDiv).css("marginLeft").indexOf("px")))}i>=0?($(settings.issuesDiv).stop(),$(settings.datesDiv+" li:first-child a").click()):$(settings.issuesDiv).is(":animated")||$(settings.datesDiv+" li").eq(e-1).find("a").trigger("click")}else if("vertical"==settings.orientation){{var i=parseInt($(settings.issuesDiv).css("marginTop").substring(0,$(settings.issuesDiv).css("marginTop").indexOf("px")));parseInt($(settings.datesDiv).css("marginTop").substring(0,$(settings.datesDiv).css("marginTop").indexOf("px")))}i>=0?($(settings.issuesDiv).stop(),$(settings.datesDiv+" li:first-child a").click()):$(settings.issuesDiv).is(":animated")||$(settings.datesDiv+" li").eq(e-1).find("a").trigger("click")}1==s?$(settings.prevButton+","+settings.nextButton).fadeOut("fast"):2==s?$(settings.issuesDiv+" li:first-child").hasClass(settings.issuesSelectedClass)?($(settings.prevButton).fadeOut("fast"),$(settings.nextButton).fadeIn("fast")):$(settings.issuesDiv+" li:last-child").hasClass(settings.issuesSelectedClass)&&($(settings.nextButton).fadeOut("fast"),$(settings.prevButton).fadeIn("fast")):$(settings.issuesDiv+" li:first-child").hasClass(settings.issuesSelectedClass)?$(settings.prevButton).fadeOut("fast"):$(settings.issuesDiv+" li:last-child").hasClass(settings.issuesSelectedClass)?$(settings.nextButton).fadeOut("fast"):$(settings.nextButton+","+settings.prevButton).fadeIn("slow")}),"true"==settings.arrowKeys&&("horizontal"==settings.orientation?$(document).keydown(function(s){39==s.keyCode&&$(settings.nextButton).click(),37==s.keyCode&&$(settings.prevButton).click()}):"vertical"==settings.orientation&&$(document).keydown(function(s){40==s.keyCode&&$(settings.nextButton).click(),38==s.keyCode&&$(settings.prevButton).click()})),$(settings.datesDiv+" li").eq(settings.startAt-1).find("a").trigger("click"),"true"==settings.autoPlay&&setInterval("autoPlay()",settings.autoPlayPause)})};
		//timeline
		$().timelinr({ arrowKeys: 'true' });
	
		// skills
		var allskills;
		if($("#skillsList").length) {
			$("#skillsList").children().each(function() {
				var val = $(this).attr("value");
				var name = $(this).text();
				allskills +='<li style="font-size:'+val/100+'em">'+name+'</li>';
			});
			allskills = allskills.replace("undefined", "");
			$("#skillsList").html(allskills);
		}
	}

	// typing effect
	var typearray = $("#typedtext").html().split(', ');
	$(".site-description").typed({
		backDelay: 2000,
		strings: typearray,
		loop: true
	});

	// behance portfolio
	
	// Behance API info
	var api  = 'yzwwt3wwsgK8vm0Cne8EWuEfMLOtWNf3';
	var user = 'housamz';

	var apiURL = "https://www.behance.net/v2/users/" + user + "/projects?api_key=" + api + "&callback=?";
	console.log(apiURL);

	$.getJSON(apiURL, function (data) {
		var project_str = "";
			for (i = 0; i < data.projects.length; i++) {
				obj = {};
				obj = data.projects[i];

				fields = obj.fields.join(", ");
				project_str += '<div class="col-sm-4"><div class="thumbnail"><img src="' + obj.covers['404'] + '" alt="' + obj.name + '" /><div class="caption"><h3>' + obj.name + '</h3><p><small>' + fields + '</small><br><br><a href="' + obj.url + '" class="btn btn-primary" role="button" target="_blank">View on Behance</a><span class="clearfix"></span></p></div></div></div>';

			}

		$('#portfolio').append(project_str);
	});
	

});

//typed.min.js
!function(t){"use strict";var s=function(s,o){this.el=t(s),this.options=t.extend({},t.fn.typed.defaults,o),this.text=this.el.text(),this.typeSpeed=this.options.typeSpeed,this.startDelay=this.options.startDelay,this.backSpeed=this.options.backSpeed,this.backDelay=this.options.backDelay,this.strings=this.options.strings,this.strPos=0,this.arrayPos=0,this.string=this.strings[this.arrayPos],this.stopNum=0,this.loop=this.options.loop,this.loopCount=this.options.loopCount,this.curLoop=1,this.stopArray=this.loop===!1?this.strings.length-1:this.strings.length,this.build()};s.prototype={constructor:s,init:function(){var t=this;setTimeout(function(){t.typewrite(t.string,t.strPos)},t.startDelay)},build:function(){this.el.after('<span id="typed-cursor">|</span>'),this.init()},typewrite:function(t,s){var o=Math.round(70*Math.random())+this.typeSpeed,e=this;setTimeout(function(){if(e.arrayPos<e.strings.length){if("^"===t.substr(s,1)){var o=t.substr(s+1).indexOf(" "),i=t.substr(s+1,o);t=t.replace("^"+i,"")}else var i=0;setTimeout(function(){if(e.el.text(e.text+t.substr(0,s)),s>t.length&&e.arrayPos<e.stopArray){clearTimeout(o),e.options.onStringTyped();var o=setTimeout(function(){e.backspace(t,s)},e.backDelay)}else if(s++,e.typewrite(t,s),e.loop===!1&&e.arrayPos===e.stopArray&&s===t.length){var o=e.options.callback();clearTimeout(o)}},i)}else e.loop===!0&&e.loopCount===!1?(e.arrayPos=0,e.init()):e.loopCount!==!1&&e.curLoop<e.loopCount&&(e.arrayPos=0,e.curLoop=e.curLoop+1,e.init())},o)},backspace:function(t,s){var o=Math.round(70*Math.random())+this.backSpeed,e=this;setTimeout(function(){if(e.el.text(e.text+t.substr(0,s)),s>e.stopNum)s--,e.backspace(t,s);else if(s<=e.stopNum){clearTimeout(o);var o=e.arrayPos=e.arrayPos+1;e.typewrite(e.strings[e.arrayPos],s)}},o)}},t.fn.typed=function(o){return this.each(function(){var e=t(this),i=e.data("typed"),a="object"==typeof o&&o;i||e.data("typed",i=new s(this,a)),"string"==typeof o&&i[o]()})},t.fn.typed.defaults={strings:["These are the default values...","You know what you should do?","Use your own!","Have a great day!"],typeSpeed:0,startDelay:0,backSpeed:0,backDelay:500,loop:!1,loopCount:!1,callback:function(){},onStringTyped:function(){}}}(window.jQuery);

// Countdown.min.js
var module,countdown=function(r){function v(a,b){var c=a.getTime();a.setUTCMonth(a.getUTCMonth()+b);return Math.round((a.getTime()-c)/864E5)}function t(a){var b=a.getTime(),c=new Date(b);c.setUTCMonth(a.getUTCMonth()+1);return Math.round((c.getTime()-b)/864E5)}function f(a,b){return a+" "+(1===a?p[b]:q[b])}function n(){}function l(a,b,c,g,x,d){0<=a[c]&&(b+=a[c],delete a[c]);b/=x;if(1>=b+1)return 0;if(0<=a[g]){a[g]=+(a[g]+b).toFixed(d);switch(g){case "seconds":if(60!==a.seconds||isNaN(a.minutes))break;
a.minutes++;a.seconds=0;case "minutes":if(60!==a.minutes||isNaN(a.hours))break;a.hours++;a.minutes=0;case "hours":if(24!==a.hours||isNaN(a.days))break;a.days++;a.hours=0;case "days":if(7!==a.days||isNaN(a.weeks))break;a.weeks++;a.days=0;case "weeks":if(a.weeks!==t(a.refMonth)/7||isNaN(a.months))break;a.months++;a.weeks=0;case "months":if(12!==a.months||isNaN(a.years))break;a.years++;a.months=0;case "years":if(10!==a.years||isNaN(a.decades))break;a.decades++;a.years=0;case "decades":if(10!==a.decades||
isNaN(a.centuries))break;a.centuries++;a.decades=0;case "centuries":if(10!==a.centuries||isNaN(a.millennia))break;a.millennia++;a.centuries=0}return 0}return b}function w(a,b,c,g,d,k){a.start=b;a.end=c;a.units=g;a.value=c.getTime()-b.getTime();if(0>a.value){var f=c;c=b;b=f}a.refMonth=new Date(b.getFullYear(),b.getMonth(),15);try{a.millennia=0;a.centuries=0;a.decades=0;a.years=c.getUTCFullYear()-b.getUTCFullYear();a.months=c.getUTCMonth()-b.getUTCMonth();a.weeks=0;a.days=c.getUTCDate()-b.getUTCDate();
a.hours=c.getUTCHours()-b.getUTCHours();a.minutes=c.getUTCMinutes()-b.getUTCMinutes();a.seconds=c.getUTCSeconds()-b.getUTCSeconds();a.milliseconds=c.getUTCMilliseconds()-b.getUTCMilliseconds();var h;0>a.milliseconds?(h=s(-a.milliseconds/1E3),a.seconds-=h,a.milliseconds+=1E3*h):1E3<=a.milliseconds&&(a.seconds+=m(a.milliseconds/1E3),a.milliseconds%=1E3);0>a.seconds?(h=s(-a.seconds/60),a.minutes-=h,a.seconds+=60*h):60<=a.seconds&&(a.minutes+=m(a.seconds/60),a.seconds%=60);0>a.minutes?(h=s(-a.minutes/
60),a.hours-=h,a.minutes+=60*h):60<=a.minutes&&(a.hours+=m(a.minutes/60),a.minutes%=60);0>a.hours?(h=s(-a.hours/24),a.days-=h,a.hours+=24*h):24<=a.hours&&(a.days+=m(a.hours/24),a.hours%=24);for(;0>a.days;)a.months--,a.days+=v(a.refMonth,1);7<=a.days&&(a.weeks+=m(a.days/7),a.days%=7);0>a.months?(h=s(-a.months/12),a.years-=h,a.months+=12*h):12<=a.months&&(a.years+=m(a.months/12),a.months%=12);10<=a.years&&(a.decades+=m(a.years/10),a.years%=10,10<=a.decades&&(a.centuries+=m(a.decades/10),a.decades%=
10,10<=a.centuries&&(a.millennia+=m(a.centuries/10),a.centuries%=10)));b=0;!(g&1024)||b>=d?(a.centuries+=10*a.millennia,delete a.millennia):a.millennia&&b++;!(g&512)||b>=d?(a.decades+=10*a.centuries,delete a.centuries):a.centuries&&b++;!(g&256)||b>=d?(a.years+=10*a.decades,delete a.decades):a.decades&&b++;!(g&128)||b>=d?(a.months+=12*a.years,delete a.years):a.years&&b++;!(g&64)||b>=d?(a.months&&(a.days+=v(a.refMonth,a.months)),delete a.months,7<=a.days&&(a.weeks+=m(a.days/7),a.days%=7)):a.months&&
b++;!(g&32)||b>=d?(a.days+=7*a.weeks,delete a.weeks):a.weeks&&b++;!(g&16)||b>=d?(a.hours+=24*a.days,delete a.days):a.days&&b++;!(g&8)||b>=d?(a.minutes+=60*a.hours,delete a.hours):a.hours&&b++;!(g&4)||b>=d?(a.seconds+=60*a.minutes,delete a.minutes):a.minutes&&b++;!(g&2)||b>=d?(a.milliseconds+=1E3*a.seconds,delete a.seconds):a.seconds&&b++;if(!(g&1)||b>=d){var e=l(a,0,"milliseconds","seconds",1E3,k);if(e&&(e=l(a,e,"seconds","minutes",60,k))&&(e=l(a,e,"minutes","hours",60,k))&&(e=l(a,e,"hours","days",
24,k))&&(e=l(a,e,"days","weeks",7,k))&&(e=l(a,e,"weeks","months",t(a.refMonth)/7,k))){g=e;var n,p=a.refMonth,q=p.getTime(),r=new Date(q);r.setUTCFullYear(p.getUTCFullYear()+1);n=Math.round((r.getTime()-q)/864E5);if(e=l(a,g,"months","years",n/t(a.refMonth),k))if(e=l(a,e,"years","decades",10,k))if(e=l(a,e,"decades","centuries",10,k))if(e=l(a,e,"centuries","millennia",10,k))throw Error("Fractional unit overflow");}}}finally{delete a.refMonth}return a}function d(a,b,c,d,f){var k;c=+c||222;d=0<d?d:NaN;
f=0<f?20>f?Math.round(f):20:0;"function"===typeof a?(k=a,a=null):a instanceof Date||(a=null!==a&&isFinite(a)?new Date(a):null);"function"===typeof b?(k=b,b=null):b instanceof Date||(b=null!==b&&isFinite(b)?new Date(b):null);if(!a&&!b)return new n;if(!k)return w(new n,a||new Date,b||new Date,c,d,f);var l=c&1?1E3/30:c&2?1E3:c&4?6E4:c&8?36E5:c&16?864E5:6048E5,h,e=function(){k(w(new n,a||new Date,b||new Date,c,d,f),h)};e();return h=setInterval(e,l)}var s=Math.ceil,m=Math.floor,p,q,u;n.prototype.toString=
function(){var a=u(this),b=a.length;if(!b)return"";1<b&&(a[b-1]="and "+a[b-1]);return a.join(", ")};n.prototype.toHTML=function(a){a=a||"span";var b=u(this),c=b.length;if(!c)return"";for(var d=0;d<c;d++)b[d]="\x3c"+a+"\x3e"+b[d]+"\x3c/"+a+"\x3e";--c&&(b[c]="and "+b[c]);return b.join(", ")};u=function(a){var b=[],c=a.millennia;c&&b.push(f(c,10));(c=a.centuries)&&b.push(f(c,9));(c=a.decades)&&b.push(f(c,8));(c=a.years)&&b.push(f(c,7));(c=a.months)&&b.push(f(c,6));(c=a.weeks)&&b.push(f(c,5));(c=a.days)&&
b.push(f(c,4));(c=a.hours)&&b.push(f(c,3));(c=a.minutes)&&b.push(f(c,2));(c=a.seconds)&&b.push(f(c,1));(c=a.milliseconds)&&b.push(f(c,0));return b};d.MILLISECONDS=1;d.SECONDS=2;d.MINUTES=4;d.HOURS=8;d.DAYS=16;d.WEEKS=32;d.MONTHS=64;d.YEARS=128;d.DECADES=256;d.CENTURIES=512;d.MILLENNIA=1024;d.DEFAULTS=222;d.ALL=2047;d.setLabels=function(a,b){a=a||[];a.split&&(a=a.split("|"));b=b||[];b.split&&(b=b.split("|"));for(var c=0;10>=c;c++)p[c]=a[c]||p[c],q[c]=b[c]||q[c]};(d.resetLabels=function(){p="millisecond second minute hour day week month year decade century millennium".split(" ");
q="milliseconds seconds minutes hours days weeks months years decades centuries millennia".split(" ")})();r&&r.exports?r.exports=d:"function"===typeof window.define&&window.define.amd&&window.define("countdown",[],function(){return d});return d}(module);


// Custom code
setInterval(function() {
	var timespan = countdown(new Date("1981-08-03T04:30:00"), new Date());
	var div = document.getElementById('time');
	if (!!div) {
		div.innerHTML = '<li>on earth for</li><li class="years">' + timespan.years + ' <span>Years</span></li><li class="months">' + timespan.months + ' <span>Months</span></li><li class="days">' + timespan.days + ' <span>Days</span></li><li class="hours">' + timespan.hours + ' <span>Hours</span></li><li class="minutes">' + timespan.minutes + ' <span>Minutes</span></li><li class="seconds">' + timespan.seconds + ' <span>Seconds</span></li>';
	}
}, 1000);

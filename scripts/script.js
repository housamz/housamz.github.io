/*jshint esversion: 6 */

jQuery(function($) {

	// typing effect
	new TypedText($('#site-skills'));

	// game
	new FThisWebsite($("#main")[0], ' fudge ');

	// back to top
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
			$('body,html').animate({ scrollTop: 0 }, 1000);
			$('#back-top span').addClass("launch");
			setTimeout(function(){ $('#back-top span').removeClass('launch'); }, 1500);
			return false;
		});
	});

	if ($("#portfolio")) {
		// portfolio
		$.ajax({
			url: "https://t.hmz.ie/apis/behance.php",
			type: "GET",
			dataType: "json",
			contentType: "json",
			success: function (data) {
				data = JSON.parse(data);
				for (i = 0; i < data.projects.length; i++) {
					let obj = data.projects[i];
					$('#portfolio').append(
						$('<div/>', { "class": "post shadow-effect" }).append([
							$('<h3/>', { "text": obj.name	}),
							$('<img/>', { "src":  obj.covers['404'], "alt": obj.name }),
							$('<p/>').append(
								$('<small/>', { "text": obj.fields.join(", ")	})
							),
							$('<a/>', { "class": "post-link", "href": obj.url, "target": "_blank"	}),
						])
					);
				}
			},
			error: function (data) {
				console.log("ERROR: ", data);
			}
		});
	}

	// check if whoami
	if($("#whoami").html()) {
		// on earth for
		new DateBetween("timeOnEarth", "On earth for", "1981-08-03T04:30:00", null);

		// rotate time on earth while scrolling
		const timeText = document.querySelector("#timeOnEarth");
		const earth = document.querySelector("#earth");
		const h = document.documentElement, b = document.body;

		document.addEventListener("scroll", e => {
			let percent = (h.scrollTop||b.scrollTop) / ((h.scrollHeight||b.scrollHeight) - h.clientHeight) * 100;
			timeText.parentNode.style.transform = `rotate(${percent}deg)`;
			earth.style.transform = `rotate(${-percent}deg)`;
		});

		// reading data from linkedin.json
		fetch("../scripts/linkedin.json")
		.then(response => response.json())
		.then(data => {
			bind(data, document.querySelector('#whoami'));
			new Timeline("timeline");
		})
		.catch(err => console.log(err));
	}

});


// Countdown Class
class DateBetween {
	constructor(parent, message, startingDate, endingDate, html = false) {
		this.parent = parent;
		this.message = message;
		this.startingDate = startingDate;
		this.endingDate = endingDate;
		this.html = html;
		this.timeObj = {years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0};
		const self = this;
		if (!this.endingDate) setInterval(() => self.view(), 1000);
	}

	view() {
		this.calculate();
		const parent = document.getElementById(this.parent);
		let output = `• <span>${this.message}</span>`;

		for (const key in this.timeObj) {
			output += ` • <span>${('0' + this.timeObj[key]).slice(-2)} ${key.charAt(0).toUpperCase() + key.slice(1)}</span>`;
		}

		if (!this.html) output = output.replace(/(<([^>]+)>)/gi, "");

		parent.innerHTML = output;
	}

	calculate() {
		let startDate = new Date(new Date(this.startingDate).toISOString());
		let endDate = new Date(
			(this.endingDate) ?
				new Date(this.endingDate).toISOString() :
				new Date().toISOString()
		);

		if (startDate > endDate) {
			[startDate, endDate] = [endDate, startDate];
		}

		const startYear = startDate.getFullYear();
		const february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
		const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

		this.timeObj.years = endDate.getFullYear() - startYear;
		this.timeObj.months = endDate.getMonth() - startDate.getMonth();
		if (this.timeObj.months < 0) {
			this.timeObj.years--;
			this.timeObj.months += 12;
		}
		this.timeObj.days = endDate.getDate() - startDate.getDate();
		if (this.timeObj.days < 0) {
			if (this.timeObj.months > 0) {
				this.timeObj.months--;
			} else {
				this.timeObj.years--;
				this.timeObj.months = 11;
			}
			this.timeObj.days += daysInMonth[startDate.getMonth()];
		}

		this.timeObj.hours = endDate.getHours() - startDate.getHours();
		if (this.timeObj.hours < 0) {
			this.timeObj.days--;
			this.timeObj.hours += 24;
		}

		this.timeObj.minutes = endDate.getMinutes() - startDate.getMinutes();
		if (this.timeObj.minutes < 0) {
			this.timeObj.hours--;
			this.timeObj.minutes += 60;
		}
		this.timeObj.seconds = endDate.getSeconds() - startDate.getSeconds();
	}
}

// Game Class
class FThisWebsite {
	constructor(container, word) {
		this.self = this;
		this.speed = 25;
		this.gameOn = false;
		this.shooting = false;
		this.container = container;
		this.word = word;
		this.maxX = window.innerWidth - this.speed;
		this.maxY = window.innerHeight - (this.speed * 3);
		this.draw();
		document.addEventListener("keydown", (e) => {
			if (this.gameOn) e.preventDefault();
			switch (e.code) {
				case 'F2':
					if (this.gameOn) {
						this.stop();
					} else {
						this.start();
					}
					break;
				case 'ArrowRight':
					this.move(this.shooterDiv, this.speed, null);
					break;
				case 'ArrowLeft':
					this.move(this.shooterDiv, -this.speed, null);
					break;
				case 'ArrowUp':
					if(!this.shooting) this.shoot(this.shooterDiv);
					break;
			}
			return false;
		});
	}

	create(c, parent = null, type = null) {
		const div = document.createElement('div');
		div.className = c;
		if (parent) {
			parent.appendChild(div);
		} else {
			document.body.appendChild(div);
		}
		if (type === "monster") {
			const id = Math.random().toString(36).substring(7);
			this.monsters.push({id, left: 0, top: 0});
			div.id = id;
		} else {
			div.id = c;
		}
		return div;
	}

	draw() {
		this.gameDiv = this.create("game");
		this.shooterDiv = this.create("shooter", this.gameDiv);
		this.scoreBoard = this.create("score-board", this.gameDiv);
	}

	start() {
		this.monsters = [];
		this.score = 0;
		this.scoreBoard.innerText = this.score;
		this.gameOn = true;
		this.gameDiv.style.display = "block";
		document.body.style.overflow = "hidden";
		const elements = document.getElementsByClassName("monster");
		while(elements.length > 0){
			elements[0].parentNode.removeChild(elements[0]);
		}
		this.monstersController();
	}

	stop() {
		this.gameOn = false;
		this.gameDiv.style.display = "none";
		document.body.style.overflow = "auto";
	}

	gameOver() {
		this.gameOn = false;
		if (confirm('Game Over! Do you want to play again?')) {
			this.start();
		} else {

		}
	}

	move(div, x = null, y = null, type = "shooter") {
		if (!this.gameOn) return;
		let where = null;
		let index = null;
		let newX = 0;
		let newY = 0;

		if (type === "monster") {
			index = this.monsters.map(function(e) { return e.id; }).indexOf(div.id);
			where = this.monsters[index];
		} else {
			where = div.getBoundingClientRect();
		}
		newX = where.left + x;
		newY = where.top + y;

		switch (type) {
			case "monster":
				if (newY >= this.maxY) {
					newY = 0;
					this.gameOver();
				}
				if (this.monsters[index]) {
					this.monsters[index].left = newX;
					this.monsters[index].top = newY;
				}
				this.getWordAtPoint(this.container, where.left, where.top);
				break;
			case "shot":
			case "shooter":
				for (var i = 0; i < this.monsters.length; ++i) {
					const monster = this.monsters[i];
					if (
						(newX >= monster.left - this.speed && newX <= monster.left + this.speed) &&
						(newY >= monster.top - this.speed && newY <= monster.top + this.speed)
					) {
						const elem = document.getElementById(monster.id);
						elem.parentNode.removeChild(elem);
						this.score += 1;
						this.scoreBoard.innerText = this.score;
						this.monsters = this.monsters.filter(function( obj ) {
							return obj.id !== monster.id;
						});
						break;
					}
				}
				break;
			default:
				//@toto
		}

		if (x) div.style.left = newX + 'px';
		if (y) div.style.top = newY + 'px';
		return {x: newX, y: newY};
	}

	shoot(parent) {
		this.self.shooting = true;
		const shot = this.create("shot", this.gameDiv);
		const where = parent.getBoundingClientRect();
		this.move(shot, where.left, where.top, "shot");
		const interval = setInterval(() => {
			if (parseInt(shot.style.top, 10) > 0) {
				this.move(shot, null, -this.speed, "shot");
			} else {
				clearInterval(interval);
				this.self.shooting = false;
				shot.parentNode.removeChild(shot);
			}
		}, this.speed);
	}

	monstersController() {
		if (!this.gameOn) return;
		let delay = this.rand(40 * this.speed, 120 * this.speed);
		const className = this.rand(1, 3);

		for (var i = 0; i < this.monsters.length; ++i) {
			const monsterDiv = document.getElementById(this.monsters[i].id);
			this.move(monsterDiv, (Math.random() - 0.5) * 2 * this.speed, this.speed, "monster");
		}

		for (var j = 0; j < 2; ++j) {
			const m = this.create("monster monster-" + className, this.gameDiv, "monster");
			this.move(m, this.rand(this.speed, this.maxX), this.rand(this.speed, this.speed * 20), "monster");
		}

		setTimeout(() => this.monstersController(), delay);
	}

	getWordAtPoint(ele, x, y) {
		if (ele.nodeType === ele.TEXT_NODE) {
			var range = ele.ownerDocument.createRange();
			range.selectNodeContents(ele);
			var currentPos = 0;
			var endPos = range.endOffset;
			while(currentPos+1 < endPos) {
				range.setStart(ele, currentPos);
				range.setEnd(ele, currentPos+1);
				if(
					range.getBoundingClientRect().left  <= x &&
					range.getBoundingClientRect().right >= x &&
					range.getBoundingClientRect().top   <= y &&
					range.getBoundingClientRect().bottom >= y
				) {
					range.expand("word");
					var ret = range.toString();
					range.detach();
					if (ret !== this.word && range.startContainer.parentNode.innerText) {
						range.startContainer.parentNode.innerText = range.startContainer.parentNode.innerText.replace(ret, this.word);
					}
					return(ret);
				}
				currentPos += 1;
			}
		} else {
			for(var i = 0; i < ele.childNodes.length; i++) {
				var range = ele.childNodes[i].ownerDocument.createRange();
				range.selectNodeContents(ele.childNodes[i]);
				if(range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right  >= x &&
					range.getBoundingClientRect().top  <= y && range.getBoundingClientRect().bottom >= y) {
					range.detach();
					return(this.getWordAtPoint(ele.childNodes[i], x, y));
				} else {
					range.detach();
				}
			}
		}
		return(null);
	}

	rand(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

}


// Typing Effect Class
class TypedText {
	constructor(el) {
		this.textArray = el.attr('data-type').split(', ');
		this.el = el;
		this.loopNum = 0;
		this.period = parseInt(el.attr('data-period'), 10) || 1000;
		this.txt = '';
		this.isDeleting = false;
		this.type();
		this.self = this;
	}

	type() {
		const i = this.loopNum % this.textArray.length;
		const fullTxt = this.textArray[i];
		this.txt = (this.isDeleting) ?
			fullTxt.substring(0, this.txt.length - 1) :
			fullTxt.substring(0, this.txt.length + 1);

		this.el.html(this.txt);
		let delay = 200 - Math.random() * 100;
		if (this.isDeleting) { delay /= 2; }
		if (!this.isDeleting && this.txt === fullTxt) {
			delay = this.period;
			this.isDeleting = true;
		} else if (this.isDeleting && this.txt === '') {
			this.isDeleting = false;
			this.loopNum++;
			delay = 500;
		}
		setTimeout(() => this.self.type(), delay);
	}
}


// Timeline class
class Timeline {
	constructor(parent) {
		this.parent = document.getElementById(parent);
		this.startYear = parseInt(this.parent.getAttribute("startYear"));
		this.nowYear = new Date().getFullYear();
		this.yearsCount = this.nowYear - this.startYear;
		this.widthUnit = parseFloat((this.parent.clientWidth / (this.yearsCount + 1)).toFixed(2));
		this.parentWidth = this.parent.clientWidth - this.widthUnit;
		this.eventDivs = document.querySelectorAll(`#${parent} .event`);
		this.yearsLocations = {};
		this.init();
	}

	init() {
		this.parent.innerHTML = '';
		const yearsDiv = document.createElement("div");
		yearsDiv.setAttribute("id", "years");
		this.parent.prepend(yearsDiv);

		const eventsDiv = document.createElement("div");
		eventsDiv.setAttribute("id", "events");
		this.parent.appendChild(eventsDiv);

		for (let i = 0; i <= this.yearsCount; i++) {
			const location = Math.floor(this.parentWidth - i * this.widthUnit);
			const year = (i === this.yearsCount) ? "Now" : i + this.startYear;
			const node = document.createElement("section");
			const text = document.createTextNode(year);
			node.appendChild(text);
			node.setAttribute("style", `left: ${location}px`);
			yearsDiv.prepend(node);
			this.yearsLocations[year] = location;
		}

		this.eventDivs = [...this.eventDivs].sort((a, b) => b.getAttribute("startYear") - a.getAttribute("startYear"));

		this.eventDivs.forEach((div, i) => {
			const startYearLocation = this.yearsLocations[div.getAttribute("startYear")] - (this.widthUnit / 2);
			const endYearLocation = this.yearsLocations[div.getAttribute("endYear")] + (this.widthUnit / 2);

			div.setAttribute("style",
			(i > this.eventDivs.length / 2) ?
				`margin-right: ${this.parentWidth - endYearLocation + this.widthUnit}px; flex-direction: row-reverse` :
				`margin-left: ${startYearLocation + this.widthUnit}px`);
			const node = document.createElement("div");
			node.setAttribute("class", "bar");
			node.setAttribute("style", `left: ${endYearLocation}px; right: ${this.parentWidth - startYearLocation}px`);
			div.prepend(node);
			eventsDiv.append(div);
		});
	}
}


// extra simple two-way binding
const VARS = {
	BIND_ATTR: 'bind',
	INDEX_NAME: '%index%'
};

// clone children as much as the data length
const cloneNode = (node, count) => {
	[...Array(count)].forEach(() => node.parentNode.insertBefore(node.cloneNode(true), node));
};

const findData = (obj, bindParams, index) => {
	const operations = { concat: false, index: false, substr: false };
	const extra = { index, substr: '', text: '' };
	if (bindParams.includes('[')) {
		operations.substr = true;
		extra.substr = bindParams.substring(
			bindParams.indexOf('['),
			bindParams.lastIndexOf(']') + 1);
	}

	if (bindParams.includes('+')) {
		operations.concat = true;
		if (bindParams.includes('\'')) {
			extra.text = bindParams.match(/'([^']+)'/)[1];
			bindParams = bindParams
				.replace(bindParams.match(/'([^']+)'/)[0], '')
				.replace('+', '');
		}
	}

	if (bindParams.includes(VARS.INDEX_NAME)) {
		operations.index = true;
		bindParams = bindParams.replace(VARS.INDEX_NAME, '');
	}

	const keys = bindParams.replace(extra.substr, '').split('.');
	for (let i = 0; i < keys.length; i++) {
		obj = obj[keys[i].trim()];
		if (obj === undefined) break;
	}

	if (operations.substr) {
		let delimiter = JSON.parse(extra.substr.replace('-', ','));
		obj = obj.substring(delimiter[0], delimiter[1]);
	}

	if (operations.concat) {
		obj = extra.text ? (obj ? obj : '') + extra.text : extra.text;
	}

	if (operations.index) {
		obj = obj ? (obj ? obj : '') + extra.index : extra.index;
	}

	return obj;
};

const bindOne = (data, node, index) => {
	if (!node.hasAttribute(VARS.BIND_ATTR)) {
		if (node.hasChildNodes()) bind(data, node);
		return;
	}
	let obj = data;
	const bindParams = node.getAttribute(VARS.BIND_ATTR).split('|');
	switch (bindParams[0].trim()) {
		case 'attr':
			// search for before and after colon including optional white spaces
			const regex = /([^:\s]+)\s?:\s?([^:\,\}]+)/g;
			let attrKeyVal;
			while ((attrKeyVal = regex.exec(bindParams[1])) !== null)
				node.setAttribute(attrKeyVal[1], findData(data, attrKeyVal[2], index));
			bind(data, node);
			break;
		case 'foreach':
			obj = findData(data, bindParams[1], index);
			cloneNode(node.children[0], obj.length - 1);
			obj.forEach((item, i) => bind(item, node.children[i], i));
			break;
		case 'html':
			node.innerHTML = findData(data, bindParams[1], index);
			break;
		case 'text':
			node.innerText = findData(data, bindParams[1], index);
			break;
		default:
			break;
	}
};

const bind = (data, parent, index = 0) =>
	[...parent.children].forEach((node) => bindOne(data, node, index));
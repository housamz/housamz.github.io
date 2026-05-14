/*jshint esversion: 6 */

jQuery(function ($) {
  // typing effect
  if ($("#site-skills").length) {
    new TypedText($("#site-skills"));
  }

  // game
  new FThisWebsite($("#main")[0], " fudge ");

  // back to top
  $("#back-top").hide();
  $(function () {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        $("#back-top").fadeIn();
      } else {
        $("#back-top").fadeOut();
      }
    });

    $("#back-top").click(function () {
      $("body,html").animate({ scrollTop: 0 }, 1000);
      $("#back-top span").addClass("launch");
      setTimeout(function () {
        $("#back-top span").removeClass("launch");
      }, 1500);
      return false;
    });
  });

  // check if whoami
  if ($("#whoami").html()) {
    // on earth for
    new DateBetween("timeOnEarth", "On earth for", "1981-08-03T04:30:00", null);

    // keep earth/time rotating and boost speed while scrolling
    const whoami = document.querySelector("#whoami");
    const earthSvg = document.querySelector("#timeOnEarthSvg");
    const timeTextParent = document.querySelector("#timeOnEarthParent");
    const earth = document.querySelector("#earth");
    let updateEarthPlacement = null;

    if (whoami && earthSvg && timeTextParent && earth) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const maxScale = 1.55;
      const maxRightShift = 260;

      const getWhoamiScrollProgress = () => {
        const rect = whoami.getBoundingClientRect();
        const total = rect.height + window.innerHeight;
        const seen = window.innerHeight - rect.top;
        return Math.min(1, Math.max(0, seen / total));
      };

      updateEarthPlacement = () => {
        const progress = getWhoamiScrollProgress();
        const scale = 1 + (maxScale - 1) * progress;
        const shift = maxRightShift * progress;

        earthSvg.style.setProperty("--earth-scale", scale.toFixed(3));
        earthSvg.style.setProperty("--earth-shift", `${Math.round(shift)}px`);
      };

      window.addEventListener("scroll", updateEarthPlacement, { passive: true });
      window.addEventListener("resize", updateEarthPlacement);
      window.addEventListener("load", updateEarthPlacement);
      updateEarthPlacement();

      if (!prefersReducedMotion) {
        let rotation = 0;
        let speedBoost = 0;
        let lastScrollY = window.scrollY || window.pageYOffset || 0;
        let lastTimestamp = null;

        const baseSpeed = 0.012;
        const maxBoost = 0.24;

        window.addEventListener(
          "scroll",
          () => {
            const currentScrollY = window.scrollY || window.pageYOffset || 0;
            const delta = Math.abs(currentScrollY - lastScrollY);
            lastScrollY = currentScrollY;

            speedBoost = Math.min(speedBoost + delta * 0.0012, maxBoost);
          },
          { passive: true },
        );

        const animateEarth = (timestamp) => {
          if (!lastTimestamp) {
            lastTimestamp = timestamp;
          }

          const deltaTime = Math.min(timestamp - lastTimestamp, 64);
          lastTimestamp = timestamp;

          rotation = (rotation + (baseSpeed + speedBoost) * deltaTime) % 360;
          timeTextParent.style.transform = `rotate(${rotation}deg)`;
          earth.style.transform = `rotate(${-rotation}deg)`;

          // Smoothly settle back to the base speed after scroll bursts.
          speedBoost = Math.max(0, speedBoost - deltaTime * 0.00025);

          window.requestAnimationFrame(animateEarth);
        };

        window.requestAnimationFrame(animateEarth);
      }
    }

    // reading data from linkedin.json
    fetch("../scripts/resume.json")
      .then((response) => response.json())
      .then((data) => {
        bind(data, document.querySelector("#whoami"));
        if (typeof updateEarthPlacement === "function") {
          updateEarthPlacement();
          window.requestAnimationFrame(updateEarthPlacement);
        }
        new Timeline("timeline", data);
      })
      .catch((err) => console.log(err));
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
    this.timeObj = {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
    const self = this;
    if (!this.endingDate) {
      self.view();
      setInterval(() => self.view(), 1000);
    }
  }

  view() {
    this.calculate();
    const parent = document.getElementById(this.parent);
    let output = `• <span>${this.message}</span>`;

    for (const key in this.timeObj) {
      output += ` • <span>${("0" + this.timeObj[key]).slice(-2)} ${
        key.charAt(0).toUpperCase() + key.slice(1)
      }</span>`;
    }

    if (!this.html) output = output.replace(/(<([^>]+)>)/gi, "");

    parent.innerHTML = `${output} •`;
  }

  calculate() {
    let startDate = new Date(new Date(this.startingDate).toISOString());
    let endDate = new Date(
      this.endingDate
        ? new Date(this.endingDate).toISOString()
        : new Date().toISOString(),
    );

    if (startDate > endDate) {
      [startDate, endDate] = [endDate, startDate];
    }

    const startYear = startDate.getFullYear();
    const february =
      (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0
        ? 29
        : 28;
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
    this.maxY = window.innerHeight - this.speed * 3;
    this.draw();
    document.addEventListener("keydown", (e) => {
      if (this.gameOn) e.preventDefault();
      switch (e.code) {
        case "F2":
          if (this.gameOn) {
            this.stop();
          } else {
            this.start();
          }
          break;
        case "ArrowRight":
          this.move(this.shooterDiv, this.speed, null);
          break;
        case "ArrowLeft":
          this.move(this.shooterDiv, -this.speed, null);
          break;
        case "ArrowUp":
          if (!this.shooting) this.shoot(this.shooterDiv);
          break;
      }
      return false;
    });
  }

  create(c, parent = null, type = null) {
    const div = document.createElement("div");
    div.className = c;
    if (parent) {
      parent.appendChild(div);
    } else {
      document.body.appendChild(div);
    }
    if (type === "monster") {
      const id = Math.random().toString(36).substring(7);
      this.monsters.push({ id, left: 0, top: 0 });
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
    while (elements.length > 0) {
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
    if (confirm("Game Over! Do you want to play again?")) {
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
      index = this.monsters
        .map(function (e) {
          return e.id;
        })
        .indexOf(div.id);
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
            newX >= monster.left - this.speed &&
            newX <= monster.left + this.speed &&
            newY >= monster.top - this.speed &&
            newY <= monster.top + this.speed
          ) {
            const elem = document.getElementById(monster.id);
            elem.parentNode.removeChild(elem);
            this.score += 1;
            this.scoreBoard.innerText = this.score;
            this.monsters = this.monsters.filter(function (obj) {
              return obj.id !== monster.id;
            });
            break;
          }
        }
        break;
      default:
      //@toto
    }

    if (x) div.style.left = newX + "px";
    if (y) div.style.top = newY + "px";
    return { x: newX, y: newY };
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
      this.move(
        monsterDiv,
        (Math.random() - 0.5) * 2 * this.speed,
        this.speed,
        "monster",
      );
    }

    for (var j = 0; j < 2; ++j) {
      const m = this.create(
        "monster monster-" + className,
        this.gameDiv,
        "monster",
      );
      this.move(
        m,
        this.rand(this.speed, this.maxX),
        this.rand(this.speed, this.speed * 20),
        "monster",
      );
    }

    setTimeout(() => this.monstersController(), delay);
  }

  getWordAtPoint(ele, x, y) {
    if (ele.nodeType === ele.TEXT_NODE) {
      var range = ele.ownerDocument.createRange();
      range.selectNodeContents(ele);
      var currentPos = 0;
      var endPos = range.endOffset;
      while (currentPos + 1 < endPos) {
        range.setStart(ele, currentPos);
        range.setEnd(ele, currentPos + 1);
        if (
          range.getBoundingClientRect().left <= x &&
          range.getBoundingClientRect().right >= x &&
          range.getBoundingClientRect().top <= y &&
          range.getBoundingClientRect().bottom >= y
        ) {
          range.expand("word");
          var ret = range.toString();
          range.detach();
          if (ret !== this.word && range.startContainer.parentNode.innerText) {
            range.startContainer.parentNode.innerText =
              range.startContainer.parentNode.innerText.replace(ret, this.word);
          }
          return ret;
        }
        currentPos += 1;
      }
    } else {
      for (var i = 0; i < ele.childNodes.length; i++) {
        var range = ele.childNodes[i].ownerDocument.createRange();
        range.selectNodeContents(ele.childNodes[i]);
        if (
          range.getBoundingClientRect().left <= x &&
          range.getBoundingClientRect().right >= x &&
          range.getBoundingClientRect().top <= y &&
          range.getBoundingClientRect().bottom >= y
        ) {
          range.detach();
          return this.getWordAtPoint(ele.childNodes[i], x, y);
        } else {
          range.detach();
        }
      }
    }
    return null;
  }

  rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

// Timeline class
class Timeline {
  constructor(element, data) {
    this.element = document.getElementById(element);
    this.data = data;
    this.tooltip = document.getElementById("tooltip");
    this.host = this.element ? this.element.closest("#whoami") : null;
    this.legend = this.host ? this.host.querySelector(".chart-key") : null;

    this.pixelsPerYear = 60; // Width in pixels per year
    this.baseOffset = 50; // Starting Y position
    this.rowSpacing = 60; // Space between rows
    this.maxRows = 6; // Number of rows to distribute events
    this.horizontalPadding = 80; // Left and right breathing room for the axis
    this.rowGap = 20; // Minimum horizontal gap between events in the same row
    this.minEventWidth = 22;
    this.labelBuffer = 140;

    this.startYear = new Date().getFullYear();
    this.activeTypes = new Set(["work", "teaching", "education"]);
    this.entries = this.getAllEntries(); // Precompute sorted entries
    this.maxRows = this.getConfiguredMaxRows();
    this.endYear = this.getTimelineEndYear();
    this.bindLegendControls();
    this.init();
  }

  getTypeFromLegendClass(className) {
    if (!className) return null;
    if (className.includes("work-bar")) return "work";
    if (className.includes("teaching-bar")) return "teaching";
    if (className.includes("education-bar")) return "education";
    if (className.includes("volunteer-bar")) return "volunteer";
    return null;
  }

  bindLegendControls() {
    if (!this.legend) return;

    this.legend.querySelectorAll("div").forEach((item) => {
      const type = this.getTypeFromLegendClass(item.className);
      if (!type) return;

      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");

      const isActive = this.activeTypes.has(type);
      item.classList.toggle("is-off", !isActive);
      item.setAttribute("aria-pressed", isActive ? "true" : "false");

      const toggle = () => {
        if (this.activeTypes.has(type)) {
          this.activeTypes.delete(type);
          item.classList.add("is-off");
          item.setAttribute("aria-pressed", "false");
        } else {
          this.activeTypes.add(type);
          item.classList.remove("is-off");
          item.setAttribute("aria-pressed", "true");
        }

        this.init();
      };

      item.addEventListener("click", toggle);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  parseDate(dateStr) {
    if (!dateStr || dateStr === "Now") return this.startYear;

    const direct = new Date(dateStr);
    if (!Number.isNaN(direct.getTime())) {
      return direct.getFullYear() + (direct.getMonth() + 1) / 12;
    }

    // Fallback for partial or irregular date formats.
    const yearMatch = String(dateStr).match(/\d{4}/);
    if (yearMatch) {
      return Number(yearMatch[0]);
    }

    return this.startYear;
  }

  getPositionFromDate(date) {
    return this.horizontalPadding + (this.startYear - date) * this.pixelsPerYear;
  }

  parsePreferredRow(rawRow) {
    const parsed = Number(rawRow);
    if (!Number.isFinite(parsed)) return null;

    // Support 1-based row numbers in data (row: 3 means third row).
    const rowIndex = Math.floor(parsed) - 1;
    return rowIndex >= 0 ? rowIndex : null;
  }

  getConfiguredMaxRows() {
    const maxPreferredRow = this.entries.reduce((max, item) => {
      if (item.preferredRow === null || item.preferredRow === undefined) {
        return max;
      }
      return Math.max(max, item.preferredRow + 1);
    }, 0);

    return Math.max(this.maxRows, maxPreferredRow);
  }

  getTimelineEndYear() {
    if (!this.entries.length) return this.startYear;
    const allDates = this.entries
      .flatMap((item) => [item.parsedStart, item.parsedEnd])
      .filter((value) => Number.isFinite(value));
    if (!allDates.length) return this.startYear;

    const oldest = Math.min(...allDates);
    return Math.floor(oldest);
  }

  getAllEntries() {
    return [
      ...this.data.education.map((edu) => ({
        title: edu.institution,
        subtitle: edu.area,
        type: "education",
        preferredRow: this.parsePreferredRow(edu.row),
        parsedStart: this.parseDate(edu.startDate),
        parsedEnd: this.parseDate(edu.endDate),
        tooltipContent: `${edu.institution}: ${edu.area}\n${edu.startDate} - ${edu.endDate}`,
      })),
      ...this.data.work.map((work) => ({
        title: work.position,
        subtitle: work.company,
        type: work.academic ? "teaching" : "work",
        preferredRow: this.parsePreferredRow(work.row),
        parsedStart: this.parseDate(work.startDate),
        parsedEnd: this.parseDate(work.endDate),
        tooltipContent: `${work.position}: ${work.company}\n${work.startDate} - ${work.endDate}`,
      })),
      ...this.data.volunteer.map((vol) => ({
        title: vol.position,
        subtitle: vol.organization,
        type: "volunteer",
        preferredRow: this.parsePreferredRow(vol.row),
        parsedStart: this.parseDate(vol.startDate),
        parsedEnd: this.parseDate(vol.endDate),
        tooltipContent: `${vol.position}: ${vol.organization}\n${vol.startDate} - ${vol.endDate}`,
      })),
    ].sort((a, b) => b.parsedEnd - a.parsedEnd);
  }

  init() {
    this.element.innerHTML = "";

    const timelineWidth =
      (this.startYear - this.endYear + 1) * this.pixelsPerYear +
      this.horizontalPadding * 2;
    const timelineHeight = this.baseOffset + this.maxRows * this.rowSpacing;

    this.element.style.width = `${timelineWidth}px`;
    this.element.style.height = `${timelineHeight}px`;

    this.drawYearMarkers();
    this.drawAllEvents();
    this.addEventListeners();
  }

  drawYearMarkers() {
    const yearsContainer = document.createElement("div");
    yearsContainer.id = "years";
    const fragment = document.createDocumentFragment();

    for (let year = this.startYear; year >= this.endYear; year--) {
      const marker = document.createElement("div");
      marker.className = "year-marker";
      marker.style.left = `${this.getPositionFromDate(year)}px`;

      const text = document.createElement("div");
      text.textContent = year;
      marker.appendChild(text);
      fragment.appendChild(marker);
    }

    yearsContainer.appendChild(fragment);
    this.element.appendChild(yearsContainer);
  }

  drawAllEvents() {
    const fragment = document.createDocumentFragment();
    const rowRightEdges = Array(this.maxRows).fill(-Infinity);

    const filteredEntries = this.entries.filter((item) =>
      this.activeTypes.has(item.type),
    );

    filteredEntries.forEach((item, index) => {
      const startPosition = this.getPositionFromDate(item.parsedStart);
      const endPosition = this.getPositionFromDate(item.parsedEnd);
      const leftPosition = Math.min(startPosition, endPosition);
      const width = Math.max(
        this.minEventWidth,
        Math.abs(endPosition - startPosition),
      );

      let row = null;

      if (item.preferredRow !== null && item.preferredRow !== undefined) {
        row = Math.min(Math.max(item.preferredRow, 0), this.maxRows - 1);
      } else {
        row = rowRightEdges.findIndex(
          (rightEdge) => leftPosition >= rightEdge + this.rowGap,
        );
        if (row === -1) {
          row = rowRightEdges.indexOf(Math.min(...rowRightEdges));
        }
      }

      // Alternate label side to reduce text collisions in dense areas.
      const putLabelOnRight = row % 2 === 0;
      const labelReach = this.labelBuffer;
      rowRightEdges[row] = Math.max(
        rowRightEdges[row],
        leftPosition + width + (putLabelOnRight ? labelReach : 0),
      );

      const yPosition = this.baseOffset + row * this.rowSpacing;

      // Create event container
      const container = document.createElement("div");
      container.classList.add("event", item.type);
      container.style.cssText = `left: ${leftPosition}px; top: ${yPosition}px; width: ${width}px`;
      container.dataset.tooltip = item.tooltipContent;

      // Create event line
      const line = document.createElement("div");
      line.className = "event-line";
      line.style.width = "100%";

      // Create event label
      const text = document.createElement("div");
      text.className = "event-text";
      const title = document.createElement("div");
      title.className = "em";
      title.textContent = item.title;
      text.append(title);

      const subTitle = document.createElement("span");
      subTitle.textContent = item.subtitle;
      text.append(title, subTitle);

      if (putLabelOnRight) {
        text.style.left = "0";
        text.style.textAlign = "left";
      } else {
        text.style.right = "0";
        text.style.textAlign = "right";
      }

      // Assemble elements
      container.append(line, text);
      fragment.appendChild(container);
    });

    this.element.appendChild(fragment);
  }

  addEventListeners() {
    this.element.querySelectorAll(".event").forEach((event) => {
      event.addEventListener("mouseenter", (e) => {
        const tooltip = this.tooltip;
        tooltip.textContent = e.target.dataset.tooltip;
        tooltip.style.opacity = "1";

        const rect = e.target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        tooltip.style.left = `${
          window.scrollX + rect.left + rect.width / 2 - tooltipRect.width / 2
        }px`;
        tooltip.style.top = `${
          window.scrollY + rect.top - tooltipRect.height - 10
        }px`;
      });

      event.addEventListener("mouseleave", () => {
        this.tooltip.style.opacity = "0";
      });
    });
  }
}

// extra simple two-way binding
const VARS = {
  BIND_ATTR: "bind",
  INDEX_NAME: "%index%",
};

// clone children as much as the data length
const cloneNode = (node, count) => {
  [...Array(count)].forEach(() =>
    node.parentNode.insertBefore(node.cloneNode(true), node),
  );
};

const findData = (obj, bindParams, index) => {
  const operations = { concat: false, index: false, substr: false };
  const extra = { index, substr: "", text: "" };
  if (bindParams.includes("[")) {
    operations.substr = true;
    extra.substr = bindParams.substring(
      bindParams.indexOf("["),
      bindParams.lastIndexOf("]") + 1,
    );
  }

  if (bindParams.includes("+")) {
    operations.concat = true;
    if (bindParams.includes("'")) {
      extra.text = bindParams.match(/'([^']+)'/)[1];
      bindParams = bindParams
        .replace(bindParams.match(/'([^']+)'/)[0], "")
        .replace("+", "");
    }
  }

  if (bindParams.includes(VARS.INDEX_NAME)) {
    operations.index = true;
    bindParams = bindParams.replace(VARS.INDEX_NAME, "");
  }

  const keys = bindParams.replace(extra.substr, "").split(".");
  for (let i = 0; i < keys.length; i++) {
    obj = obj[keys[i].trim()];
    if (obj === undefined) break;
  }

  if (operations.substr) {
    let delimiter = JSON.parse(extra.substr.replace("-", ","));
    obj = obj.substring(delimiter[0], delimiter[1]);
  }

  if (operations.concat) {
    obj = extra.text ? (obj ? obj : "") + extra.text : extra.text;
  }

  if (operations.index) {
    obj = obj ? (obj ? obj : "") + extra.index : extra.index;
  }

  return obj;
};

const bindOne = (data, node, index) => {
  if (!node.hasAttribute(VARS.BIND_ATTR)) {
    if (node.hasChildNodes()) bind(data, node);
    return;
  }
  let obj = data;
  const bindParams = node.getAttribute(VARS.BIND_ATTR).split("|");
  switch (bindParams[0].trim()) {
    case "attr":
      // search for before and after colon including optional white spaces
      const regex = /([^:\s]+)\s?:\s?([^:\,\}]+)/g;
      let attrKeyVal;
      while ((attrKeyVal = regex.exec(bindParams[1])) !== null)
        node.setAttribute(attrKeyVal[1], findData(data, attrKeyVal[2], index));
      bind(data, node);
      break;
    case "foreach":
      obj = findData(data, bindParams[1], index);
      cloneNode(node.children[0], obj.length - 1);
      obj.forEach((item, i) => bind(item, node.children[i], i));
      break;
    case "html":
      node.innerHTML = findData(data, bindParams[1], index);
      break;
    case "paragraphs":
      const paragraphs =
        `<p>${findData(data, bindParams[1], index).split(".").join(".</p><p>")}</p>`.replace(
          /<p><\/p>/g,
          "",
        );
      node.innerHTML = paragraphs;
      break;
    case "text":
      node.innerText = findData(data, bindParams[1], index);
      break;
    default:
      break;
  }
};

const bind = (data, parent, index = 0) =>
  [...parent.children].forEach((node) => bindOne(data, node, index));

const TERMINAL_PROMPT = "housamz@starship:~$";
const TERMINAL_TYPE_SPEED = 10;
const TERMINAL_SPINNER_CHARS = ["-", "\\", "|", "/"];
const TERMINAL_DATA = {
  welcome: {
    description: "Welcome and splash screen",
    lines: [
      "<em>Housamz (<em>hmz.ie</em>) All rights are not reserved.</em>",
      " ",
      "0000000000000000000111111111110001111111100",
      "0000000000000000011111111111111111111111110",
      "0000000000000000111111110000011111111100111",
      "0000000111111001111111100000111111111001110",
      "0001111111111111111111000001111111111111100",
      "0111110000001111111110000011111111100000000",
      "0111000000001111111111100011111111000000000",
      "1110000000011111111001111111111111000000000",
      "1100000000111111110000011111111110000111110",
      "1100000001111111100000011111111100000011111",
      "1110000111111111000000111111111000000011111",
      "0111111111111110000011111111111111000111110",
      "0011111111111000001111111111000111111111100",
      " ",
      "<em>Type '<i>help</i>' to see available commands.</em>",
      " ",
    ],
    type: "welcome",
  },
  whoami: {
    description: "Who is Housamz?",
    lines: [
      "👨‍💻 By day, I'm a Software Engineer. By night, a pos-grad lecturer. And in between? I'm probably fixing a toaster or building a robot for fun. Basically: full-time nerd, part-time superhero 🦸‍♂️🔧",
      "🕹️ My tech story began in '98 as a starry-eyed Web Designer (weren't we all?), and by 2008 I was knee-deep in Web Dev—LEGO bricks turned to skyscrapers 🧱➡️🏙️",
      "💼 Since then, I've dabbled in everything from biz dev to marketing, even had a go at entrepreneurship (RIP my lemonade empire 🍋💸).",
      "🎨 My real love? Making things look so good they give Mona Lisa an identity crisis. Pixel-perfect is my love language 💖🖼️",
      "🇮🇪 Oh, and I'm also a Peace Commissioner in Ireland—because why not fight bugs and crime? ⚖️🐛",
    ],
    type: "paragraph",
  },
  skills: {
    description: "What can I do?",
    lines: [
      "<i>My Technical Skills</i>",
      "<i>Frontend</i> HTML, CSS, JavaScript",
      "<i>Backend</i> Node.js, Python",
      "<i>DevOps</i> Docker, Git",
      "<i>Linux Administration</i>",
      "<i>Shell Scripting</i>",
    ],
    type: "list",
  },
  projects: {
    description: "My projects",
    lines: [
      "<i>My Projects</i>",
      "<i>Terminal Website</i> This interactive terminal-like website",
    ],
    type: "list",
  },
  contact: {
    description: "How to reach me",
    lines: [
      "<i>Contact Information</i>",
      "<i>Universal name</i> <em>housamz</em>",
      "<i>GitHub</i> <span>github.com/<em>housamz</em></span>",
      "<i>Codepen</i> <span>codepen.io/<em>housamz</em></span>",
      "<i>LinkedIn</i> <span>linkedin.com/in/<em>housamz</em></span>",
      "<i>Twitter</i> <span>twitter.com/<em>housamz</em></span>",
      "<i>Website</i> <span><em>housamz</em>.com</span>",
    ],
    type: "list",
  },
};

const TERMINAL_APIS = {
  joke: {
    url: "https://icanhazdadjoke.com/",
    headers: { Accept: "application/json" },
    parse: (res) => res.joke,
    description: "Get a random joke",
  },
  geek: {
    url: "https://geek-jokes.sameerkumar.website/api?format=json",
    parse: (res) => res.joke,
    description: "Get a random geek joke",
  },
  fact: {
    url: "https://uselessfacts.jsph.pl/api/v2/facts/random",
    parse: (res) => res.text,
    description: "Get a random fact",
  },
  ip: {
    url: "https://ipapi.co/json/",
    parse: (res) => Object.keys(res).map((k) => `<i>${k}</i> ${res[k]}`),
    description: "Get IP and location info",
  },
  weather: {
    url: "",
    parse: () => [],
    description: "Get Weather info for location",
  },
};

const TERMINAL_WEATHER_ICONS = {
  0: { description: "Clear sky", emoji: "☀️", icon: "sun" },
  1: { description: "Partly cloudy", emoji: "🌤️", icon: "cloud-sun" },
  2: { description: "Cloudy", emoji: "☁️", icon: "cloud" },
  3: { description: "Overcast", emoji: "🌥️", icon: "cloud-meatball" },
  4: { description: "Fog", emoji: "🌫️", icon: "smog" },
  9: { description: "Drizzle", emoji: "🌦️", icon: "cloud-drizzle" },
  10: { description: "Rain", emoji: "🌧️", icon: "cloud-rain" },
  11: { description: "Thunderstorm", emoji: "⛈️", icon: "cloud-bolt" },
  13: { description: "Snow", emoji: "🌨️", icon: "cloud-snow" },
  14: { description: "Blowing snow", emoji: "🌬️❄️", icon: "wind-snow" },
  15: { description: "Hail", emoji: "🌩️🧊", icon: "cloud-hail" },
  17: {
    description: "Thunderstorm without precipitation",
    emoji: "🌩️",
    icon: "bolt",
  },
  20: { description: "Mist", emoji: "🌫️", icon: "water" },
  30: { description: "Duststorm", emoji: "🌪️", icon: "wind" },
  40: { description: "Rain showers", emoji: "🌦️", icon: "cloud-showers-heavy" },
  50: {
    description: "Drizzle, not freezing",
    emoji: "🌧️",
    icon: "cloud-drizzle",
  },
  60: { description: "Rain, not freezing", emoji: "🌧️", icon: "cloud-rain" },
  70: { description: "Snow", emoji: "❄️", icon: "snowflake" },
  80: { description: "Rain showers", emoji: "🌦️", icon: "cloud-showers-heavy" },
  81: {
    description: "Rain showers, slight",
    emoji: "🌧️",
    icon: "cloud-sun-rain",
  },
  82: {
    description: "Rain showers, heavy",
    emoji: "🌧️🌧️",
    icon: "cloud-showers-heavy",
  },
  85: { description: "Snow showers, slight", emoji: "🌨️", icon: "cloud-snow" },
  86: { description: "Snow showers, heavy", emoji: "🌨️❄️", icon: "snowflake" },
  95: {
    description: "Thunderstorm, slight or moderate",
    emoji: "⛈️",
    icon: "cloud-bolt",
  },
  96: { description: "Thunderstorm with hail", emoji: "⛈️🧊", icon: "cloud-bolt-hail" },
  99: { description: "Severe thunderstorm", emoji: "🌩️⚡", icon: "bolt" },
};

class Terminal {
  constructor() {
    this._commands = [];
    this._historyIndex = -1;
    this._cursorTimeout = null;
  }

  initialize() {
    this._setupDOM();
    this.showWelcomeScreen();
    this._setupEventListeners();
    this._updateCursorPosition();
  }

  _setupDOM() {
    const firstPrompt = this._getFirstPrompt();
    if (firstPrompt) {
      firstPrompt.innerText = TERMINAL_PROMPT;
    }
  }

  _setupEventListeners() {
    const commandInput = this._getCommandInput();
    if (!commandInput) return;

    commandInput.addEventListener("keydown", (e) => this._handleKeyDown(e));
    commandInput.addEventListener("input", () =>
      this._updateCursorPositionDebounced()
    );

    document.body.addEventListener("click", () => {
      commandInput.focus();
    });
  }

  _get(id) {
    return document.getElementById(id);
  }

  _getCommandInput() {
    return this._get("command-input");
  }

  _getCommandHistory() {
    return this._get("command-history");
  }

  _getCursor() {
    return this._get("cursor");
  }

  _getFirstPrompt() {
    return this._get("first-prompt");
  }

  _createDiv(className, innerHTML) {
    const div = document.createElement("div");
    if (className) div.className = className;
    if (innerHTML) div.innerHTML = innerHTML;
    return div;
  }

  _createSpan(title, text, className) {
    return `<span ${className ? `class="${className}"` : ""}>${title ?? ""}</span>${text ? " " + text : ""}`;
  }

  _scrollToBottom() {
    const terminalContent = this._get("app");
    if (terminalContent) {
      terminalContent.scrollTop = terminalContent.scrollHeight;
    }
  }

  _updateCursorPosition() {
    const commandInput = this._getCommandInput();
    const cursor = this._getCursor();
    if (!commandInput || !cursor) return;

    const left = (TERMINAL_PROMPT.length + commandInput.value.length) * 10;
    cursor.style.left = `${left}px`;
  }

  _updateCursorPositionDebounced() {
    if (this._cursorTimeout) {
      clearTimeout(this._cursorTimeout);
    }
    this._cursorTimeout = setTimeout(() => this._updateCursorPosition(), 10);
  }

  async _handleKeyDown(e) {
    const commandInput = this._getCommandInput();
    if (!commandInput) return;

    switch (e.key) {
      case "Enter":
        await this._handleEnter(e, commandInput);
        break;
      case "ArrowUp":
        this._handleArrowUp(e, commandInput);
        break;
      case "ArrowDown":
        this._handleArrowDown(e, commandInput);
        break;
      case "Tab":
        this._handleTab(e, commandInput);
        break;
    }

    this._updateCursorPosition();
  }

  async _handleEnter(e, commandInput) {
    e.preventDefault();
    const command = commandInput.value.trim();
    await this.executeCommand(command);
    commandInput.value = "";
    this._historyIndex = -1;
  }

  _handleArrowUp(e, commandInput) {
    e.preventDefault();
    const commands = this.getCommands();
    if (this._historyIndex < commands.length - 1) {
      this._historyIndex++;
      commandInput.value = commands[commands.length - 1 - this._historyIndex];
    }
  }

  _handleArrowDown(e, commandInput) {
    e.preventDefault();
    const commands = this.getCommands();
    if (this._historyIndex > 0) {
      this._historyIndex--;
      commandInput.value = commands[commands.length - 1 - this._historyIndex];
    } else if (this._historyIndex === 0) {
      this._historyIndex = -1;
      commandInput.value = "";
    }
  }

  _handleTab(e, commandInput) {
    e.preventDefault();
    const currentInput = commandInput.value.toLowerCase();

    if (!currentInput) return;

    const matchingCommands = this.getAvailableCommands().filter((cmd) =>
      cmd.startsWith(currentInput)
    );

    if (matchingCommands.length === 1) {
      commandInput.value = matchingCommands[0];
    } else if (matchingCommands.length > 1) {
      this._showCompletions(currentInput, matchingCommands);
    }
  }

  _showCompletions(currentInput, matchingCommands) {
    const commandHistory = this._getCommandHistory();
    if (!commandHistory) return;

    const commandLine = this._createDiv(
      "",
      this._createSpan(TERMINAL_PROMPT, currentInput, "prompt")
    );
    commandHistory.appendChild(commandLine);

    const outputElement = this._createDiv(
      "output",
      matchingCommands.join("&nbsp;&nbsp;&nbsp;")
    );
    commandHistory.appendChild(outputElement);

    this._scrollToBottom();
  }

  showWelcomeScreen() {
    const colors = ["grey", "blue", "purple"];

    this._renderOutput(
      TERMINAL_DATA.welcome.lines.map((line, i) => {
        if (i > 1 && i <= 14) {
          const groupIndex = Math.floor((i - 2) / 5);
          return this._createSpan(
            line.replace(/0/g, " ").replace(/1/g, "="),
            null,
            colors[groupIndex % colors.length]
          );
        }

        return line;
      }),
      "welcome",
      0
    );
  }

  async executeCommand(command) {
    const commandHistory = this._getCommandHistory();
    if (!commandHistory) return;

    const commandLine = this._createDiv(
      "",
      this._createSpan(TERMINAL_PROMPT, command, "prompt")
    );
    commandHistory.appendChild(commandLine);

    let outputLines = [];
    let type = "";
    const theCommand = command.toLowerCase();
    this._commands.push(theCommand);

    switch (theCommand) {
      case "welcome":
        this.showWelcomeScreen();
        break;
      case "whoami":
      case "skills":
      case "projects":
      case "contact":
        outputLines = TERMINAL_DATA[theCommand].lines;
        type = TERMINAL_DATA[theCommand].type;
        break;

      case "help":
        const otherCommands = [
          {
            color: "blue",
            title: "exit",
            text: "Go to the homepage",
          },
          {
            color: "blue",
            title: "date",
            text: "Display current date",
          },
          {
            color: "blue",
            title: "clear",
            text: "Clear the terminal",
          },
          {
            color: "blue",
            title: "history",
            text: "Show command history",
          },
          {
            color: "orange",
            title: "Arrow Keys",
            text: "To navigate history.",
          },
          {
            color: "orange",
            title: "Tab Key",
            text: "To complete commands.",
          },
        ];
        outputLines = [
          "<i>Available commands:</i>",
          ...Object.entries(TERMINAL_DATA).map(
            ([k, v]) => `<i>${k}</i> ${v.description}`
          ),
          ...Object.entries(TERMINAL_APIS).map(([k, v]) =>
            this._createSpan(k, v.description, "green")
          ),
          ...otherCommands.map((i) => this._createSpan(i.title, i.text, i.color)),
        ];
        type = "list";
        break;

      case "test":
        this._runTestCommands();
        return;

      case "history":
        outputLines = this._commands;
        break;

      case "date":
        outputLines = [this._createSpan(new Date().toString(), null, "orange")];
        break;

      case "clear":
        commandHistory.innerHTML = "";
        return;

      case "exit":
        window.location.href = window.__HOME_URL__ || "/";
        return;

      case "joke":
      case "geek":
      case "fact":
        await this._handleApiCommand(theCommand);
        return;

      case "ip":
        await this._handleIpCommand();
        return;

      case "weather":
        await this._handleWeatherCommand();
        return;

      case "":
        outputLines = [];
        break;

      default:
        outputLines = this._createErrorMessage(command, true);
    }

    if (outputLines.length > 0) {
      this._renderOutput(outputLines, type);
    }
  }

  async _handleApiCommand(command) {
    this._showSpinner();
    try {
      const output = await this._fetchAPI(command);
      this._hideSpinner();
      const outputArray = Array.isArray(output) ? output : [output];
      this._renderOutput(outputArray, "paragraph");
    } catch (error) {
      this._hideSpinner();
      this._renderOutput(this._createErrorMessage(), "paragraph");
    }
  }

  async _handleIpCommand() {
    this._showSpinner();
    try {
      const output = await this._fetchAPI("ip");
      this._hideSpinner();
      this._renderOutput(output, "list");
    } catch (error) {
      this._hideSpinner();
      this._renderOutput(this._createErrorMessage("location"), "paragraph");
    }
  }

  async _handleWeatherCommand() {
    this._showSpinner();
    try {
      const location = await this._fetchLocation();
      const weatherLines = await this._fetchWeather(location);
      this._hideSpinner();
      this._renderOutput(weatherLines, "list");
    } catch (error) {
      this._hideSpinner();
      this._renderOutput(this._createErrorMessage("weather"), "paragraph");
    }
  }

  _runTestCommands() {
    ["welcome", "help", "date", ...Object.keys(TERMINAL_DATA), ...Object.keys(TERMINAL_APIS), "history"].forEach((k, i) =>
      setTimeout(() => this.executeCommand(k), i * 3000)
    );
  }

  _createErrorMessage(text, isCommandError) {
    const message = !text
      ? "Error fetching data. Please try again."
      : isCommandError
        ? `Command not found: ${text}. Type 'help' for available commands.`
        : `Error fetching ${text} data. Please try again.`;

    return [this._createSpan(message, null, "red")];
  }

  getCommands() {
    return [...this._commands];
  }

  getAvailableCommands() {
    return [
      ...Object.keys(TERMINAL_DATA),
      ...Object.keys(TERMINAL_APIS),
      "exit",
      "clear",
      "date",
      "history",
    ];
  }

  _renderOutput(outputLines, name, speed = TERMINAL_TYPE_SPEED) {
    if (outputLines.length === 0) return;

    const outputElement = this._createDiv(`output ${name}`);
    const commandHistory = this._getCommandHistory();
    if (!commandHistory) return;

    commandHistory.appendChild(outputElement);

    if (speed === 0) {
      for (const line of outputLines) {
        const lineElement = this._createDiv("", line);
        outputElement.appendChild(lineElement);
      }
      this._scrollToBottom();
      return;
    }

    let lineIndex = 0;
    let charIndex = 0;

    const typewriter = setInterval(() => {
      if (lineIndex < outputLines.length) {
        if (charIndex === 0) {
          const lineElement = this._createDiv();
          outputElement.appendChild(lineElement);
        }

        const currentLine = outputLines[lineIndex];
        const currentLineElement = outputElement.lastChild;

        if (charIndex >= currentLine.length) {
          lineIndex++;
          charIndex = 0;
        } else {
          currentLineElement.innerHTML = currentLine.substring(0, charIndex + 1);
          charIndex++;
        }

        this._scrollToBottom();
      } else {
        clearInterval(typewriter);
      }
    }, speed);
  }

  _showSpinner() {
    let spinnerFrame = 0;
    const spinner = this._createDiv(
      "output",
      `${this._createSpan("Waiting...", null, "orange")} ${this._createSpan(TERMINAL_SPINNER_CHARS[0], null, "spinner")}`
    );
    spinner.id = "spinner";

    const commandHistory = this._getCommandHistory();
    if (!commandHistory) return;

    commandHistory.appendChild(spinner);

    this._spinnerInterval = setInterval(() => {
      spinnerFrame = (spinnerFrame + 1) % TERMINAL_SPINNER_CHARS.length;
      const spinnerElement = spinner.querySelector(".spinner");
      if (spinnerElement) {
        spinnerElement.textContent = TERMINAL_SPINNER_CHARS[spinnerFrame];
      }
    }, 100);
  }

  _hideSpinner() {
    if (this._spinnerInterval) {
      clearInterval(this._spinnerInterval);
      this._spinnerInterval = null;
    }

    const spinner = document.getElementById("spinner");
    if (spinner) {
      spinner.remove();
    }
  }

  async _fetchAPI(command) {
    const api = TERMINAL_APIS[command];
    if (!api) {
      throw new Error("API not found");
    }

    const response = await fetch(api.url, {
      headers: api.headers || {},
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return api.parse(data);
  }

  async _fetchLocation() {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }
    return response.json();
  }

  async _fetchWeather(location) {
    const { latitude, longitude, city, country_name } = location;
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const weatherData = await response.json();
    const lines = [`Weather for ${city}, ${country_name}`];

    const processEntry = (key, value) => {
      if (typeof value === "object" && value !== null) {
        lines.push(`<i>${key}</i>`);
        Object.entries(value).forEach(([childKey, childValue]) => {
          processEntry(childKey, childValue);
        });
      } else {
        if (key === "weathercode") {
          const code = String(value);
          const entry = TERMINAL_WEATHER_ICONS[code];

          if (entry) {
            lines.push(`<i>${key}</i> ${entry.emoji}`);
          } else {
            lines.push(`<i>${key}</i> ${value}`);
          }
          return;
        }
        lines.push(`<i>${key}</i> ${value}`);
      }
    };

    Object.entries(weatherData).forEach(([k, v]) => {
      processEntry(k, v);
    });

    return lines;
  }
}

jQuery(function ($) {
  if (document.getElementById("command-history") && document.getElementById("command-input")) {
    new Terminal().initialize();
  }
});

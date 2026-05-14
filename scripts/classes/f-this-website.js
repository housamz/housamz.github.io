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

window.FThisWebsite = FThisWebsite;

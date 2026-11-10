const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
module.exports = function run() {
  const lines = [],
    renders = [],
    nodes = [],
    timers = new Map();
  let now = 1000,
    nextTimer = 0;
  const context = {
    window: { matchMedia: () => ({ matches: false }) },
    document: {
      createElement: () => ({
        textContent: "",
        append(...items) {
          this.children = items;
        },
        setAttribute() {},
      }),
    },
    performance: { now: () => now },
    setInterval(fn) {
      timers.set(++nextTimer, fn);
      return nextTimer;
    },
    clearInterval(id) {
      timers.delete(id);
    },
    escapeHtml: (value) =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;"),
  };
  vm.createContext(context);
  vm.runInContext(
    fs.readFileSync(
      path.join(__dirname, "../scripts/classes/terminal-play.js"),
      "utf8",
    ),
    context,
  );
  const terminal = {
    _renderOutput: (output, type, speed) => {
      renders.push({ output, type, speed });
      lines.push(...output.map((line) => line.replace(/<[^>]*>/g, "")));
    },
    _getCommandHistory: () => ({ append: (node) => nodes.push(node) }),
    _get: () => ({ clientWidth: 640 }),
    _scrollToBottom() {},
  };
  const play = new context.window.TerminalPlay(terminal);
  assert.equal(play.handle("constructor"), false);
  assert.equal(play.handle("not-a-command"), false);
  play.handle("play codebreaker");
  assert.equal(new Set(play.game.code).size, 4);
  play.game.code = "0123";
  play.handle("guess 1111");
  assert.equal(play.game.tries, 0);
  play.handle("guess 0132");
  assert.match(lines.at(-1), /exact: 2 \/ misplaced: 2 \/ guesses left: 5/);
  play.handle("guess 0123");
  assert.equal(play.game, null);
  assert.equal(play.wins, 1);
  play.handle("play codebreaker");
  play.game.code = "0123";
  for (let i = 0; i < 6; i++) play.handle("guess 4567");
  assert.equal(play.game, null);
  assert.match(lines.at(-1), /code was 0123/);
  play.handle("play trivia");
  assert.equal(new Set(play.game.questions.map((q) => q[0])).size, 5);
  play.handle("answer z");
  assert.equal(play.game.index, 0);
  for (let i = 0; i < 5; i++)
    play.handle("answer " + "abc"[play.game.questions[play.game.index][2]]);
  assert.equal(play.game, null);
  assert(play.badges.has("Quiz wizard"));
  play.handle("play typing");
  const phrase = play.game.phrase;
  now += 60000;
  play.handle("type " + phrase);
  assert.equal(play.bestWpm, Math.round(phrase.length / 5));
  play.handle("roll 0d6");
  assert.match(lines.at(-1), /Usage:/);
  play.handle("roll 20d100");
  const values = lines
    .at(-1)
    .match(/^\[(.*)\]/)[1]
    .split(", ")
    .map(Number);
  assert.equal(values.length, 20);
  assert(values.every((v) => v >= 1 && v <= 100));
  play.handle("cowsay <img src=x>");
  assert(lines.some((line) => line.includes("&lt;img src=x&gt;")));
  play.handle("matrix");
  assert.equal(timers.size, 1);
  play.handle("donut");
  assert.equal(timers.size, 1);
  assert.equal(nodes.at(-1).children[1].textContent.split("\n").length, 18);
  now += 31000;
  [...timers.values()][0]();
  assert.equal(timers.size, 0);
  play.handle("matrix");
  play.handle("stop");
  assert.equal(timers.size, 0);
  context.window.matchMedia = () => ({ matches: true });
  play.handle("matrix");
  assert.equal(timers.size, 0);
  play.handle("stats");
  assert(lines.some((line) => line.includes("Progress resets")));
  play.handle("games");
  const menu = renders.at(-1);
  assert.equal(menu.type, "list");
  assert.equal(
    menu.speed,
    undefined,
    "Use the core renderer’s default typing speed",
  );
  assert(
    menu.output.some((line) => line.startsWith("<i>play codebreaker</i>")),
  );
  assert(menu.output[0].startsWith("<i>"));
  play.handle("fortune");
  assert(renders.at(-1).output[0].startsWith("<em>"));
  return "PASS: code scoring, invalid inputs, win/loss, trivia sampling, typing speed, dice bounds, safe text, animation replacement/expiry/stop, reduced motion, and session stats.";
};

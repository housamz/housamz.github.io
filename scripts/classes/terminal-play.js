/* Extra activities for the original terminal. All progress is session-only. */
class TerminalPlay {
  constructor(terminal) {
    this.terminal = terminal;
    this.game = null;
    this.animation = null;
    this.visited = new Set();
    this.wins = 0;
    this.rounds = 0;
    this.bestWpm = 0;
    this.badges = new Set();
    this.commands = {
      games: 'Mini-games and how to play',
      play: 'Start a game: play codebreaker / trivia / typing',
      guess: 'Crack the code: guess 1234',
      answer: 'Answer trivia: answer b',
      type: 'Submit the typing challenge: type <sentence>',
      rps: 'Rock, paper, scissors: rps rock',
      matrix: 'Animated digital rain; stop to finish',
      donut: 'A spinning ASCII donut; stop to finish',
      stop: 'Stop the active game or animation',
      fortune: 'A small piece of terminal wisdom',
      roll: 'Roll dice: roll 2d6',
      cowsay: 'A cow with something to say: cowsay hello',
      stats: 'Your session scores and discoveries',
      explore: 'Suggest something you have not tried yet'
    };
  }
  say(lines) {
    const commandWords = /\b(play|guess|answer|type|rps|matrix|donut|stop|fortune|roll|cowsay|stats|explore|games|apps|help)\b/g;
    const styled = lines.map((line, index) => {
      const safe = escapeHtml(line);
      return index === 0 ? `<em>${safe}</em>` : safe.replace(commandWords, '<span class="green">$1</span>');
    });
    this.terminal._renderOutput(styled, 'play-output');
  }
  menu(title, entries, note) {
    this.terminal._renderOutput([
      `<i>${escapeHtml(title)}</i>`,
      ...entries.map(([command, description]) => `<i>${escapeHtml(command)}</i> ${escapeHtml(description)}`),
      `<em class="menu-note">${escapeHtml(note)}</em>`
    ], 'list');
  }
  pick(items) { return items[Math.floor(Math.random() * items.length)]; }
  badge(name) {
    if (this.badges.has(name)) return;
    this.badges.add(name);
    this.say(['Achievement unlocked: ' + name]);
  }
  stop(announce = true) {
    if (this.animation) {
      clearInterval(this.animation.timer);
      this.animation.label.textContent += ' [stopped]';
      this.animation = null;
    }
    this.game = null;
    if (announce) this.say(['Activity stopped. Type games for another round.']);
  }
  handle(raw) {
    const [command, ...parts] = raw.trim().split(/\s+/);
    const name = command.toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(this.commands, name)) return false;
    const arg = parts.join(' ');
    this.visited.add(name);
    if (this.visited.size >= 5) this.badge('Curious human');
    switch (name) {
      case 'games':
        this.menu('Games & experiments', [
          ['play codebreaker', 'Crack four digits in six guesses'],
          ['play trivia', 'Five computing questions'],
          ['play typing', 'Speed and accuracy challenge'],
          ['rps rock', 'Rock, paper, scissors'],
          ['matrix', 'Animated digital rain'],
          ['donut', 'Spinning ASCII donut'],
          ['fortune', 'Terminal wisdom'],
          ['roll 2d6', 'Roll the dice'],
          ['cowsay hello', 'Consult the resident cow'],
          ['stats', 'Session scores and achievements'],
          ['explore', 'Suggest something new'],
          ['stop', 'End the current activity'],
        ], 'help <command> for instructions · Escape / Ctrl+C to stop');
        break;
      case 'play': this.start(arg.toLowerCase()); break;
      case 'guess': this.guess(arg); break;
      case 'answer': this.answer(arg); break;
      case 'type': this.typing(arg); break;
      case 'rps': this.rps(arg.toLowerCase()); break;
      case 'matrix': case 'donut': this.animate(name); break;
      case 'stop': this.stop(); break;
      case 'fortune':
        this.say([this.pick(['There is no cloud. There is just someone else’s computer.', 'The best feature is sometimes the one you delete.', 'First, solve the problem. Then, name the variables.', 'Your next great idea may be hiding behind a short walk.', 'A working prototype is worth a thousand meetings.', 'Somewhere, a printer is refusing to cooperate.', 'Make it work. Make it clear. Then make tea.', 'The bug is always in the last place you look. Stop looking after that.'])]);
        break;
      case 'roll': this.roll(arg); break;
      case 'cowsay': {
        const message = (arg || 'Have you tried turning it off and on again?').slice(0, 120);
        const words = message.match(/.{1,36}(?:\s|$)|.{1,36}/g) || [message];
        const width = Math.max(...words.map(line => line.trim().length));
        this.say([' ' + '_'.repeat(width + 2), ...words.map(line => '| ' + line.trim().padEnd(width) + ' |'), ' ' + '-'.repeat(width + 2), '        \\   ^__^', '         \\  (oo)\\_______', '            (__)\\       )\\/\\', '                ||----w |', '                ||     ||']);
        break;
      }
      case 'stats':
        this.say(['THIS SESSION', 'Activities discovered: ' + this.visited.size + ' / ' + Object.keys(this.commands).length, 'Games completed: ' + this.rounds, 'Wins: ' + this.wins, 'Best typing speed: ' + this.bestWpm + ' WPM', 'Achievements: ' + ([...this.badges].join(', ') || 'None yet. Try a game!'), 'Progress resets when you reload.']);
        break;
      case 'explore': {
        const choices = ['play codebreaker', 'play trivia', 'play typing', 'rps rock', 'matrix', 'donut', 'fortune', 'roll 2d6', 'cowsay hello'];
        const unseen = choices.filter(choice => !this.visited.has(choice.split(' ')[0]));
        this.say(['Try this next: ' + this.pick(unseen.length ? unseen : choices)]);
        break;
      }
    }
    return true;
  }
  start(name) {
    if (!['codebreaker', 'trivia', 'typing'].includes(name)) {
      this.say(['Choose a game: play codebreaker / play trivia / play typing']); return;
    }
    this.stop(false);
    if (name === 'codebreaker') {
      const digits = [...'0123456789'];
      const code = Array.from({length:4}, () => digits.splice(Math.floor(Math.random() * digits.length), 1)[0]).join('');
      this.game = {name, code, tries:0};
      this.say(['CODEBREAKER', 'Four different digits. Six guesses. A leading zero is possible.', 'Exact = right digit, right place. Misplaced = right digit, wrong place.', 'Type guess 1234 to begin.']);
    } else if (name === 'trivia') {
      const bank = [
        ['Which HTTP status means “not found”?', ['200', '404', '500'], 1, '404 means the requested resource was not found.'],
        ['What does CSS stand for?', ['Cascading Style Sheets', 'Computer Style System', 'Creative Script Syntax'], 0, 'Cascading Style Sheets controls presentation.'],
        ['Which number is binary 1010 in decimal?', ['8', '12', '10'], 2, '8 + 2 = 10.'],
        ['Which data structure uses FIFO?', ['Stack', 'Queue', 'Tree'], 1, 'First in, first out: a queue.'],
        ['Which HTML element represents the main page heading?', ['<head>', '<header>', '<h1>'], 2, 'The h1 element is the highest-level heading.'],
        ['What is the usual result of typeof [] in JavaScript?', ['array', 'object', 'list'], 1, 'Arrays are objects. Array.isArray checks for an array.'],
        ['Which protocol encrypts web traffic?', ['HTTPS', 'HTTP', 'FTP'], 0, 'HTTPS uses TLS to protect the connection.'],
        ['In Git, which command creates a new branch?', ['git branch', 'git push', 'git status'], 0, 'git branch <name> creates a branch without switching to it.']
      ];
      // Draw without replacement, without relying on a biased sort comparator.
      const questions = [];
      while (questions.length < 5) questions.push(bank.splice(Math.floor(Math.random() * bank.length), 1)[0]);
      this.game = {name, questions, index:0, score:0};
      this.question();
    } else {
      const phrase = this.pick(['Good software starts with understanding people.', 'Small steps and clear thinking solve big problems.', 'The best interface gets out of your way.']);
      this.game = {name, phrase, started:performance.now()};
      this.say(['TYPING TEST', 'Type the sentence exactly, including punctuation, prefixed with type:', phrase, 'Example: type ' + phrase, 'The timer starts now. Backspace is allowed.']);
    }
  }
  guess(value) {
    const game = this.game;
    if (game?.name !== 'codebreaker') { this.say(['Start a round first: play codebreaker']); return; }
    if (!/^\d{4}$/.test(value) || new Set(value).size !== 4) { this.say(['Use four different digits, e.g. guess 1234. No guess used.']); return; }
    game.tries++;
    let exact = 0, misplaced = 0;
    [...value].forEach((digit, index) => { if (game.code[index] === digit) exact++; else if (game.code.includes(digit)) misplaced++; });
    if (exact === 4) {
      this.say(['Access granted. Code ' + game.code + ' cracked in ' + game.tries + ' / 6 guesses.']);
      this.wins++; this.rounds++; this.game = null; this.badge('Code whisperer');
    } else if (game.tries === 6) {
      this.say(['Out of guesses. The code was ' + game.code + '. Type play codebreaker for a new code.']);
      this.rounds++; this.game = null;
    } else this.say([value + ' → exact: ' + exact + ' / misplaced: ' + misplaced + ' / guesses left: ' + (6 - game.tries)]);
  }
  question() {
    const game = this.game, question = game.questions[game.index];
    this.say(['TRIVIA ' + (game.index + 1) + ' / 5 — score: ' + game.score, question[0], ...question[1].map((answer, index) => '  ' + 'abc'[index] + ') ' + answer), 'Type answer a, answer b, or answer c.']);
  }
  answer(value) {
    const game = this.game;
    if (game?.name !== 'trivia') { this.say(['Start a quiz first: play trivia']); return; }
    if (!/^[abc]$/i.test(value)) { this.say(['Choose a, b, or c. Example: answer b']); return; }
    const question = game.questions[game.index], correct = 'abc'.indexOf(value.toLowerCase()) === question[2];
    if (correct) game.score++;
    this.say([(correct ? 'Correct! ' : 'Not quite. ') + question[3]]);
    game.index++;
    if (game.index === 5) {
      this.say(['Quiz complete: ' + game.score + ' / 5. Type play trivia for a fresh quiz.']);
      this.rounds++; if (game.score >= 3) this.wins++; if (game.score === 5) this.badge('Quiz wizard');
      this.game = null;
    } else this.question();
  }
  typing(value) {
    const game = this.game;
    if (game?.name !== 'typing') { this.say(['Start a typing challenge first: play typing']); return; }
    if (!value) { this.say(['Usage: type <the sentence shown above>']); return; }
    const elapsed = Math.max(1, (performance.now() - game.started) / 1000);
    let matches = 0;
    [...game.phrase].forEach((letter, index) => { if (letter === value[index]) matches++; });
    const accuracy = Math.round(matches / Math.max(game.phrase.length, value.length) * 100);
    const wpm = Math.round((matches / 5) / (elapsed / 60));
    this.say([accuracy + '% accuracy / ' + wpm + ' WPM / ' + elapsed.toFixed(1) + ' seconds (including reading time).']);
    this.rounds++;
    if (value === game.phrase) { this.wins++; this.bestWpm = Math.max(this.bestWpm, wpm); this.badge('Keyboard pilot'); }
    else this.say(['Target: ' + game.phrase, 'Type play typing to try another sentence.']);
    this.game = null;
  }
  rps(choice) {
    const choices = ['rock', 'paper', 'scissors'];
    if (!choices.includes(choice)) { this.say(['Usage: rps rock / rps paper / rps scissors']); return; }
    const computer = this.pick(choices);
    const win = {rock:'scissors', paper:'rock', scissors:'paper'}[choice] === computer;
    this.rounds++; if (win) { this.wins++; this.badge('Human beats machine'); }
    this.say(['You: ' + choice + ' / machine: ' + computer, choice === computer ? 'A draw. Great minds think alike.' : win ? 'You win. The machine requests a rematch.' : 'The machine wins this one. Again?', 'Play again: rps rock / paper / scissors']);
  }
  roll(argument) {
    const match = /^(\d{1,2})d(\d{1,3})$/i.exec(argument || '1d6');
    if (!match || +match[1] < 1 || +match[1] > 20 || +match[2] < 2 || +match[2] > 100) {
      this.say(['Usage: roll 2d6 (1–20 dice, 2–100 sides).']); return;
    }
    const rolls = Array.from({length:+match[1]}, () => 1 + Math.floor(Math.random() * +match[2]));
    this.say(['[' + rolls.join(', ') + '] → total: ' + rolls.reduce((sum, value) => sum + value, 0)]);
  }
  animate(name) {
    this.stop(false);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const output = document.createElement('div'); output.className = 'output';
    const label = document.createElement('div'); label.className = 'green';
    label.textContent = name + (reduced ? ' — still frame (reduced motion)' : ' — stop / Escape / Ctrl+C to end. Auto-stops after 30 seconds.');
    const canvas = document.createElement('pre'); canvas.className = 'ascii-animation'; canvas.setAttribute('aria-label', name + ' ASCII art');
    output.append(label, canvas); this.terminal._getCommandHistory().append(output);
    const width = Math.min(64, Math.max(20, Math.floor(this.terminal._get('app').clientWidth / 10) - 2));
    const height = 18, started = performance.now(); let frame = 0;
    const drops = Array.from({length:width}, () => Math.floor(Math.random() * height));
    const draw = () => {
      frame++;
      const pixels = Array(width * height).fill(' ');
      if (name === 'matrix') {
        for (let x = 0; x < width; x++) {
          if (frame % 2 === 0) drops[x] = (drops[x] + 1) % (height + 8);
          for (let tail = 0; tail < 7; tail++) {
            const y = drops[x] - tail;
            if (y >= 0 && y < height) pixels[x + y * width] = this.pick(tail < 2 ? '01' : '.:01');
          }
        }
      } else {
        const depth = Array(width * height).fill(0), a = frame * .07, b = frame * .03;
        for (let j = 0; j < 6.28; j += .09) for (let i = 0; i < 6.28; i += .04) {
          const c = Math.sin(i), d = Math.cos(j), e = Math.sin(a), f = Math.sin(j), g = Math.cos(a), h = d + 2;
          const D = 1 / (c * h * e + f * g + 5), l = Math.cos(i), m = Math.cos(b), n = Math.sin(b), t = c * h * g - f * e;
          const x = Math.floor(width / 2 + width * .36 * D * (l * h * m - t * n));
          const y = Math.floor(height / 2 + height * .7 * D * (l * h * n + t * m));
          const N = Math.floor(8 * ((f * e - c * d * g) * m - c * d * e - f * g - l * d * n));
          const o = x + width * y;
          if (x >= 0 && x < width && y >= 0 && y < height && D > depth[o]) { depth[o] = D; pixels[o] = '.,-~:;=!*#$@'[Math.max(0, Math.min(11, N))]; }
        }
      }
      canvas.textContent = Array.from({length:height}, (_, row) => pixels.slice(row * width, (row + 1) * width).join('')).join('\n');
      if (performance.now() - started >= 30000) this.stop(false);
    };
    draw(); this.terminal._scrollToBottom(); this.badge('ASCII appreciator');
    if (!reduced) this.animation = {label, timer:setInterval(draw, name === 'matrix' ? 100 : 80)};
  }
}
window.TerminalPlay = TerminalPlay;

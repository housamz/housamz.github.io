const TERMINAL_PROMPT = window.__SITE_DATA__?.terminal?.prompt || "housamz@starship:~$";
const TERMINAL_TYPE_SPEED = 10;
const TERMINAL_SPINNER_CHARS = ["-", "\\", "|", "/"];
const SITE_DATA = window.__SITE_DATA__ || {};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatLinkText = (url) => String(url || "").replace(/^https?:\/\//, "").replace(/\/$/, "");

const DEFAULT_TERMINAL_DATA = {
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
  whoami: { description: "Who is this?", lines: [], type: "paragraph" },
  skills: { description: "What can I do?", lines: [], type: "list" },
  projects: { description: "My projects", lines: [], type: "list" },
  contact: { description: "How to reach me", lines: [], type: "list" },
};

const buildTerminalDataFromSiteData = (data) => {
  const basics = data?.basics || {};
  const profiles = Array.isArray(basics.profiles) ? basics.profiles : [];
  const skillItems = (Array.isArray(data?.skills) ? data.skills : []).slice(0, 12);
  const projectItems = Array.isArray(data?.projects) ? data.projects : [];

  const summary = String(basics.summary || "")
    .replace(/\n\n---\n\n/, "\n\n")
    .replace(/<[^>]+>/g, "")
    .trim();
  const whoamiLines = summary ? [escapeHtml(summary)] : [];

  const skillsLines = ["<i>Top Skills</i>"];
  skillItems.forEach((item) => {
    const skillName = typeof item === "string" ? item : item?.name;
    if (skillName) {
      skillsLines.push(`<i>${escapeHtml(skillName)}</i>`);
    }
  });

  const projectsLines = ["<i>Featured Projects</i>"];
  projectItems.forEach((item) => {
    const title = item?.name || item?.title;
    const description = item?.description || item?.summary || "";
    if (!title) return;
    let displayDesc = description;
    if (displayDesc.length > 60) {
      displayDesc = displayDesc.substring(0, 57) + "...";
    }
    const line = displayDesc 
      ? `<i>${escapeHtml(title)}</i> — ${escapeHtml(displayDesc)}` 
      : `<i>${escapeHtml(title)}</i>`;
    projectsLines.push(line);
  });
  projectsLines.push("<div style='grid-column: 1 / -1; margin-top: 0.5rem;'><span class='green'>Tip: Use 'info projects &lt;name&gt;' or 'open projects &lt;name&gt;' to explore</span></div>");

  const contactLines = ["<i>Contact Information</i>"];
  if (basics.name) {
    contactLines.push(`<i>Name</i> <em>${escapeHtml(basics.name)}</em>`);
  }
  profiles.forEach((profile) => {
    if (!profile?.network || !profile?.url) return;
    contactLines.push(
      `<i>${escapeHtml(profile.network)}</i> <span>${escapeHtml(formatLinkText(profile.url))}</span>`,
    );
  });
  if (basics.website) {
    contactLines.push(`<i>Website</i> <span>${escapeHtml(formatLinkText(basics.website))}</span>`);
  }

  return {
    whoami: {
      description: "Who is this?",
      lines: whoamiLines,
      type: "paragraph",
    },
    skills: {
      description: "What can I do?",
      lines: skillsLines,
      type: "list",
    },
    projects: {
      description: "My projects",
      lines: projectsLines,
      type: "list",
    },
    contact: {
      description: "How to reach me",
      lines: contactLines,
      type: "list",
    },
  };
};

const TERMINAL_DATA = {
  ...DEFAULT_TERMINAL_DATA,
  ...(SITE_DATA?.terminal?.sections || {}),
  ...buildTerminalDataFromSiteData(SITE_DATA),
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
            color: "green",
            title: "info",
            text: "Get detailed info about items (e.g., 'info projects teanga')",
          },
          {
            color: "green",
            title: "open",
            text: "Open URL for items (e.g., 'open projects teanga', 'open contact github')",
          },
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
        if (theCommand.startsWith("info ")) {
          const parts = theCommand.split(" ");
          const category = parts[1];
          const itemName = parts.slice(2).join(" ").toLowerCase();
          outputLines = this._handleInfoCommand(category, itemName);
        } else if (theCommand.startsWith("open ")) {
          const parts = theCommand.split(" ");
          const category = parts[1];
          const itemName = parts.slice(2).join(" ").toLowerCase();
          this._handleOpenCommand(category, itemName);
          return;
        } else {
          outputLines = this._createErrorMessage(command, true);
        }
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

  _handleInfoCommand(category, itemName) {
    if (!category || !itemName) {
      return [this._createSpan("Usage: info <category> <name> (e.g., 'info projects teanga')", null, "red")];
    }

    const categoryLower = category.toLowerCase();
    let items = [];
    let itemDisplayName = "Item";

    if (categoryLower === "projects") {
      items = SITE_DATA?.projects || [];
      itemDisplayName = "Project";
    } else if (categoryLower === "skills") {
      const skillsArray = SITE_DATA?.skills || [];
      items = skillsArray.map(s => typeof s === "string" ? { name: s } : s);
      itemDisplayName = "Skill";
    } else if (categoryLower === "work") {
      items = SITE_DATA?.work || [];
      itemDisplayName = "Work Experience";
    } else if (categoryLower === "education") {
      items = SITE_DATA?.education || [];
      itemDisplayName = "Education";
    } else if (categoryLower === "volunteer") {
      items = SITE_DATA?.volunteer || [];
      itemDisplayName = "Volunteer";
    } else {
      return [this._createSpan("Unknown category: " + category + ". Try: projects, skills, work, education, volunteer", null, "red")];
    }

    const normalize = (str) => str.toLowerCase().replace(/-/g, " ");
    const normalized = normalize(itemName);
    const item = items.find(i => {
      const name = normalize(i?.name || i?.title || "");
      return name.includes(normalized) || normalized.includes(name.split(" ")[0]);
    });

    if (!item) {
      return [this._createSpan(itemDisplayName + " not found. Try 'info " + categoryLower + "' to list all.", null, "orange")];
    }

    const lines = ["<i>" + escapeHtml(item.name || item.title || itemDisplayName) + "</i>"];

    if (item.summary) lines.push("<em>Summary:</em> " + escapeHtml(item.summary));
    if (item.description) lines.push("<em>Description:</em> " + escapeHtml(item.description));
    if (item.position) lines.push("<em>Position:</em> " + escapeHtml(item.position));
    if (item.startDate) lines.push("<em>Started:</em> " + escapeHtml(item.startDate));
    if (item.endDate) lines.push("<em>Ended:</em> " + escapeHtml(item.endDate));
    if (item.studyType) lines.push("<em>Type:</em> " + escapeHtml(item.studyType));
    if (item.area) lines.push("<em>Area:</em> " + escapeHtml(item.area));
    if (item.organization) lines.push("<em>Organization:</em> " + escapeHtml(item.organization));
    if (item.name && categoryLower === "skills") lines.push("<em>Skill:</em> " + escapeHtml(item.name));
    if (item.url) lines.push("<em>URL:</em> <span>" + escapeHtml(formatLinkText(item.url)) + "</span>");
    if (item.href) lines.push("<em>URL:</em> <span>" + escapeHtml(formatLinkText(item.href)) + "</span>");
    if (item.location?.city) lines.push("<em>Location:</em> " + escapeHtml(item.location.city));

    return lines;
  }

  _handleOpenCommand(category, itemName) {
    if (!category || !itemName) {
      this._renderOutput([this._createSpan("Usage: open <category> <name> (e.g., 'open projects teanga')", null, "red")], "paragraph");
      return;
    }

    const categoryLower = category.toLowerCase();
    let items = [];
    let url = null;

    if (categoryLower === "projects") {
      items = SITE_DATA?.projects || [];
      const normalize = (str) => str.toLowerCase().replace(/-/g, " ");
      const normalized = normalize(itemName);
      const item = items.find(i => {
        const name = normalize(i?.name || i?.title || "");
        return name.includes(normalized) || normalized.includes(name.split(" ")[0]);
      });
      url = item?.url || item?.href;
      if (!url) {
        this._renderOutput([this._createSpan("Project not found or has no URL.", null, "orange")], "paragraph");
        return;
      }
    } else if (categoryLower === "contact") {
      const profiles = SITE_DATA?.basics?.profiles || [];
      const normalize = (str) => str.toLowerCase().replace(/-/g, " ");
      const normalized = normalize(itemName);
      const item = profiles.find(p => {
        const name = normalize(p.network || "");
        return name.includes(normalized) || normalized.includes(name.split(" ")[0]);
      });
      url = item?.url;
      if (!url) {
        this._renderOutput([this._createSpan("Contact not found or has no URL.", null, "orange")], "paragraph");
        return;
      }
    } else if (categoryLower === "work") {
      items = SITE_DATA?.work || [];
      const normalize = (str) => str.toLowerCase().replace(/-/g, " ");
      const normalized = normalize(itemName);
      const item = items.find(i => {
        const name = normalize(i?.name || i?.company || "");
        return name.includes(normalized) || normalized.includes(name.split(" ")[0]);
      });
      url = item?.url;
      if (!url) {
        this._renderOutput([this._createSpan("Work entry not found or has no URL.", null, "orange")], "paragraph");
        return;
      }
    } else {
      this._renderOutput([this._createSpan("Unknown category: " + category + ". Try: projects, contact, work", null, "red")], "paragraph");
      return;
    }

    if (url) {
      window.open(url, "_blank");
      this._renderOutput([this._createSpan("Opening: " + formatLinkText(url), null, "green")], "paragraph");
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
      "info",
      "open",
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

window.Terminal = Terminal;

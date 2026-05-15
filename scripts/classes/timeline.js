class Timeline {
  constructor(element, data) {
    this.element = document.getElementById(element);
    this.data = data;
    this.tooltip = document.getElementById("tooltip");
    this.host = this.element ? this.element.closest("#whoami") : null;
    this.legend = this.host ? this.host.querySelector(".chart-key") : null;

    this.pixelsPerYear = 60;
    this.baseOffset = 50;
    this.rowSpacing = 60;
    this.maxRows = 6;
    this.horizontalPadding = 80;
    this.rowGap = 20;
    this.minEventWidth = 22;
    this.labelBuffer = 140;

    this.startYear = new Date().getFullYear();
    this.activeTypes = new Set(["work", "teaching", "education"]);
    this.entries = this.getAllEntries();
    this.maxRows = this.getConfiguredMaxRows();
    this.endYear = this.getTimelineEndYear();
    this.bindLegendControls();
    this.init();
  }

  getTypeFromLegendItem(node) {
    return node ? node.getAttribute("data-timeline-filter") : null;
  }

  bindLegendControls() {
    if (!this.legend) return;

    this.legend.querySelectorAll("div").forEach((item) => {
      const type = this.getTypeFromLegendItem(item);
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

    filteredEntries.forEach((item) => {
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

      const putLabelOnRight = row % 2 === 0;
      const labelReach = this.labelBuffer;
      rowRightEdges[row] = Math.max(
        rowRightEdges[row],
        leftPosition + width + (putLabelOnRight ? labelReach : 0),
      );

      const yPosition = this.baseOffset + row * this.rowSpacing;

      const container = document.createElement("div");
      container.classList.add("event", item.type);
      container.style.cssText = `left: ${leftPosition}px; top: ${yPosition}px; width: ${width}px`;
      container.dataset.tooltip = item.tooltipContent;

      const line = document.createElement("div");
      line.className = "event-line";
      line.style.width = "100%";

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

window.Timeline = Timeline;

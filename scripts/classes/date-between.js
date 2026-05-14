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

window.DateBetween = DateBetween;

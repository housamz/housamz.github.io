/*jshint esversion: 6 */

jQuery(function ($) {
  // typing effect
  if ($("#site-skills").length && typeof window.TypedText === "function") {
    new TypedText($("#site-skills"));
  }

  // game
  if ($("#main").length && typeof window.FThisWebsite === "function") {
    new FThisWebsite($("#main")[0], " fudge ");
  }

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
  if (
    $("#whoami").html() &&
    typeof window.DateBetween === "function" &&
    typeof window.Timeline === "function"
  ) {
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

    const data = window.__SITE_DATA__;
    if (!data) return;

    const normalizedSummary = String(data?.basics?.summary || "")
      .replace(/\n\n---\n\n/, "\n\n")
      .trim();

    const dataForBinding = {
      ...data,
      basics: {
        ...data.basics,
        summary: normalizedSummary,
      },
      skills: Array.isArray(data.skills)
        ? data.skills.map((item) => {
            if (typeof item === "string") {
              return {
                name: item,
                category: "Professional",
                categoryClass: "skill-item skill-cat-professional",
              };
            }

            const category = item?.category || "Professional";
            const categoryKey = String(category)
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "") || "professional";

            return {
              ...item,
              category,
              categoryClass: `skill-item skill-cat-${categoryKey}`,
            };
          })
        : data.skills,
      projects: Array.isArray(data.projects)
        ? data.projects.map((item) => ({
            ...item,
            projectUrl: item.href || item.url,
            description: item.description || item.summary,
          }))
        : data.projects,
    };

    bind(dataForBinding, document.querySelector("#whoami"));

    const skillNodes = document.querySelectorAll("#whoami .skill-item");
    skillNodes.forEach((node) => {
      const category = String(node.getAttribute("data-category") || "professional")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "professional";
      node.dataset.skillCategory = category;
    });

    const skillsLegend = document.querySelector("#whoami .skills-filter");
    if (skillsLegend && skillNodes.length) {
      const activeCategories = new Set(
        Array.from(skillNodes).map((node) => node.dataset.skillCategory).filter(Boolean),
      );

      const getSkillTypeFromLegendClass = (className) => {
        if (!className) return null;
        if (className.includes("skill-filter-all")) return "all";
        if (className.includes("skill-filter-development")) return "development";
        if (className.includes("skill-filter-teaching")) return "teaching";
        if (className.includes("skill-filter-design")) return "design";
        if (className.includes("skill-filter-leadership")) return "leadership";
        if (className.includes("skill-filter-professional")) return "professional";
        return null;
      };

      const applySkillFilters = () => {
        skillNodes.forEach((node) => {
          const category = node.dataset.skillCategory || "professional";
          node.style.display = activeCategories.has(category) ? "" : "none";
        });

        const allActive =
          activeCategories.size > 0 &&
          Array.from(skillNodes).every((node) =>
            activeCategories.has(node.dataset.skillCategory),
          );

        skillsLegend.querySelectorAll("div").forEach((item) => {
          const type = getSkillTypeFromLegendClass(item.className);
          if (!type) return;
          const isActive = type === "all" ? allActive : activeCategories.has(type);
          item.classList.toggle("is-off", !isActive);
          item.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
      };

      skillsLegend.querySelectorAll("div").forEach((item) => {
        const type = getSkillTypeFromLegendClass(item.className);
        if (!type) return;

        item.setAttribute("role", "button");
        item.setAttribute("tabindex", "0");

        const toggle = () => {
          if (type === "all") {
            activeCategories.clear();
            skillNodes.forEach((node) => {
              if (node.dataset.skillCategory) activeCategories.add(node.dataset.skillCategory);
            });
          } else if (activeCategories.has(type)) {
            activeCategories.delete(type);
          } else {
            activeCategories.add(type);
          }
          applySkillFilters();
        };

        item.addEventListener("click", toggle);
        item.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
        });
      });

      applySkillFilters();
    }

    if (typeof updateEarthPlacement === "function") {
      updateEarthPlacement();
      window.requestAnimationFrame(updateEarthPlacement);
    }
    new Timeline("timeline", dataForBinding);
  }
});

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
      while ((attrKeyVal = regex.exec(bindParams[1])) !== null) {
        const attrName = attrKeyVal[1].trim();
        const attrValue = findData(data, attrKeyVal[2].trim(), index);
        if (attrName === "class") {
          // Add to class list rather than replacing so existing classes are preserved.
          String(attrValue || "").split(/\s+/).filter(Boolean).forEach((cls) => {
            node.classList.add(cls);
          });
        } else {
          node.setAttribute(attrName, attrValue);
        }
      }
      bind(data, node);
      break;
    case "foreach":
      obj = findData(data, bindParams[1], index);
      cloneNode(node.children[0], obj.length - 1);
      obj.forEach((item, i) => bindOne(item, node.children[i], i));
      break;
    case "html":
      node.innerHTML = findData(data, bindParams[1], index);
      break;
    case "paragraphs":
      const paragraphItems = String(findData(data, bindParams[1], index) || "")
        .split(/\n\s*\n/)
        .map((item) => item.trim())
        .filter(Boolean);
      const paragraphs = paragraphItems.map((item) => `<p>${item}</p>`).join("");
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

jQuery(function ($) {
  if (document.getElementById("command-history") && document.getElementById("command-input")) {
    if (typeof window.Terminal === "function") {
      new Terminal().initialize();
    }
  }
});

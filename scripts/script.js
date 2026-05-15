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

    // Travels map
    const mapElement = document.getElementById("map");
    const travelsData = data?.travels;
    if (
      mapElement &&
      travelsData &&
      Array.isArray(travelsData.countries) &&
      Array.isArray(travelsData.places) &&
      typeof window.L === "object"
    ) {
      const countries = travelsData.countries;
      const travels = travelsData.places;

      const map = L.map("map").setView([35, 20], 2);

      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
      const lightTiles = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 20,
          minZoom: 2,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        },
      );
      const darkTiles = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 20,
          minZoom: 2,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        },
      );

      let baseLayer;
      const applyBaseLayer = (isDark) => {
        if (baseLayer) map.removeLayer(baseLayer);
        baseLayer = isDark ? darkTiles : lightTiles;
        baseLayer.addTo(map);
      };

      applyBaseLayer(prefersDark.matches);

      if (typeof prefersDark.addEventListener === "function") {
        prefersDark.addEventListener("change", (event) => applyBaseLayer(event.matches));
      } else if (typeof prefersDark.addListener === "function") {
        prefersDark.addListener((event) => applyBaseLayer(event.matches));
      }

      const markerGroup =
        typeof L.markerClusterGroup === "function"
          ? L.markerClusterGroup({
            showCoverageOnHover: false,
            disableClusteringAtZoom: 7,
            chunkedLoading: false,
          })
          : L.layerGroup();

      markerGroup.addTo(map);

      const countryFilter = document.getElementById("country-filter");
      const citySearch = document.getElementById("city-search");
      const clearFilters = document.getElementById("clear-filters");
      const countriesCount = document.getElementById("countries-count");
      const citiesCount = document.getElementById("cities-count");
      const visibleCount = document.getElementById("visible-count");
      const travelResults = document.getElementById("travel-results");

      if (countryFilter && citySearch && clearFilters && countriesCount && citiesCount) {
        const travelData = travels.map((place, index) => ({
          ...place,
          id: index + 1,
          countryData: countries[place.country - 1],
        }));

        const totalCountries = new Set(travelData.map((place) => place.country)).size;
        const totalCities = travelData.length;
        const allBounds = L.latLngBounds(travelData.map((place) => [place.lat, place.lng]));

        countriesCount.textContent = String(totalCountries);
        citiesCount.textContent = String(totalCities);

        const usedCountryIds = new Set(travelData.map((place) => place.country));
        countries.forEach((country, index) => {
          const countryId = index + 1;
          if (!usedCountryIds.has(countryId)) return;
          const option = document.createElement("option");
          option.value = String(countryId);
          option.textContent = `${country.flag} ${country.name}`;
          countryFilter.appendChild(option);
        });

        const popupContent = (place) =>
          `<strong>${place.countryData.flag} ${place.city}, ${place.countryData.name}</strong>`;

        const getFilteredTravels = () => {
          const selectedCountry = countryFilter.value;
          const cityQuery = citySearch.value.trim().toLowerCase();

          return travelData.filter((place) => {
            const matchesCountry =
              selectedCountry === "all" || place.country === Number(selectedCountry);
            const matchesCity =
              cityQuery.length === 0 || place.city.toLowerCase().includes(cityQuery);

            return matchesCountry && matchesCity;
          });
        };

        const updateMap = (filteredTravels) => {
          map.removeLayer(markerGroup);
          markerGroup.clearLayers();

          filteredTravels.forEach((place) => {
            const marker = L.marker([place.lat, place.lng]).bindPopup(popupContent(place));
            markerGroup.addLayer(marker);
          });

          markerGroup.addTo(map);

          if (visibleCount) visibleCount.textContent = String(filteredTravels.length);

          if (filteredTravels.length > 1) {
            const bounds = L.latLngBounds(filteredTravels.map((place) => [place.lat, place.lng]));
            map.fitBounds(bounds, { padding: [30, 30] });
            if (travelResults) travelResults.textContent = `Showing ${filteredTravels.length} cities.`;
            return;
          }

          if (filteredTravels.length === 1) {
            const place = filteredTravels[0];
            map.setView([place.lat, place.lng], 6);
            if (travelResults) {
              travelResults.textContent =
                `Showing 1 city: ${place.city}, ${place.countryData.name}.`;
            }
            return;
          }

          map.fitBounds(allBounds, { padding: [30, 30] });
          if (travelResults) travelResults.textContent = "No cities match this filter.";
        };

        countryFilter.addEventListener("change", () => updateMap(getFilteredTravels()));
        citySearch.addEventListener("input", () => updateMap(getFilteredTravels()));
        clearFilters.addEventListener("click", () => {
          countryFilter.value = "all";
          citySearch.value = "";
          updateMap(travelData);
        });

        updateMap(travelData);
      }
    }
  }
});
const binder = new Binder();
const bind = (data, parent, index) => binder.bind(data, parent, index);

jQuery(function ($) {
  if (document.getElementById("command-history") && document.getElementById("command-input")) {
    if (typeof window.Terminal === "function") {
      new Terminal().initialize();
    }
  }
});

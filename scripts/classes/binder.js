/*jshint esversion: 6 */

class Binder {
  constructor() {
    this.BIND_ATTR = "bind";
    this.INDEX_NAME = "%index%";
  }

  // Clone a node's first child to match the data array length
  cloneNode(node, count) {
    [...Array(count)].forEach(() =>
      node.parentNode.insertBefore(node.cloneNode(true), node),
    );
  }

  findData(obj, bindParams, index) {
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

    if (bindParams.includes(this.INDEX_NAME)) {
      operations.index = true;
      bindParams = bindParams.replace(this.INDEX_NAME, "");
    }

    const keys = bindParams.replace(extra.substr, "").split(".");
    for (let i = 0; i < keys.length; i++) {
      obj = obj[keys[i].trim()];
      if (obj === undefined) break;
    }

    if (operations.substr) {
      const delimiter = JSON.parse(extra.substr.replace("-", ","));
      obj = obj.substring(delimiter[0], delimiter[1]);
    }

    if (operations.concat) {
      obj = extra.text ? (obj ? obj : "") + extra.text : extra.text;
    }

    if (operations.index) {
      obj = obj ? (obj ? obj : "") + extra.index : extra.index;
    }

    return obj;
  }

  bindOne(data, node, index) {
    if (!node.hasAttribute(this.BIND_ATTR)) {
      if (node.hasChildNodes()) this.bind(data, node);
      return;
    }

    const bindParams = node.getAttribute(this.BIND_ATTR).split("|");
    switch (bindParams[0].trim()) {
      case "attr": {
        // search for key : value pairs including optional whitespace
        const regex = /([^:\s]+)\s?:\s?([^:\,\}]+)/g;
        let attrKeyVal;
        while ((attrKeyVal = regex.exec(bindParams[1])) !== null) {
          const attrName = attrKeyVal[1].trim();
          const attrValue = this.findData(data, attrKeyVal[2].trim(), index);
          if (attrName === "class") {
            // Append to class list rather than replacing so existing classes are preserved.
            String(attrValue || "").split(/\s+/).filter(Boolean).forEach((cls) => {
              node.classList.add(cls);
            });
          } else {
            node.setAttribute(attrName, attrValue);
          }
        }
        this.bind(data, node);
        break;
      }
      case "foreach": {
        const obj = this.findData(data, bindParams[1], index);
        this.cloneNode(node.children[0], obj.length - 1);
        obj.forEach((item, i) => this.bindOne(item, node.children[i], i));
        break;
      }
      case "html":
        node.innerHTML = this.findData(data, bindParams[1], index);
        break;
      case "paragraphs": {
        const paragraphItems = String(this.findData(data, bindParams[1], index) || "")
          .split(/\n\s*\n/)
          .map((item) => item.trim())
          .filter(Boolean);
        node.innerHTML = paragraphItems.map((item) => `<p>${item}</p>`).join("");
        break;
      }
      case "text":
        node.innerText = this.findData(data, bindParams[1], index);
        break;
      default:
        break;
    }
  }

  bind(data, parent, index = 0) {
    [...parent.children].forEach((node) => this.bindOne(data, node, index));
  }
}

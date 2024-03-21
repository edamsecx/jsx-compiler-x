import { encodeString } from "./encodeString";

export function JSXLexer(jsxString: string): Tokens {
  let pointer = 0;
  function next(step: number = 1) {
    const char = jsxString[pointer] || null;
    pointer += step;
    return char;
  }

  function back(step: number = 1) {
    pointer -= step;
    return jsxString[pointer] || null;
  }

  function skipEmpty() {
    while (/\s/.test(peek() || "_")) {
      next();
    }
    return peek();
  }

  function peek(step: number = 0) {
    return jsxString[pointer + step] || null;
  }

  function stringParser() {
    let string = "";
    while (true) {
      const char = next();
      if (char === "\\") {
        const nextChar = next();
        if (!nextChar) throw new Error("Unexpected end of jsx string");
        if (nextChar === "u") {
          let unicode = 0;
          for (let i = 0; i < 4; i++) {
            const char = next();
            if (!char) throw new Error("Unexpected end of jsx string");
            const code = char.charCodeAt(0) * Math.pow(16, 3 - i);
            if (isFinite(code)) {
              unicode += code;
            } else {
              back();
              break;
            }
          }
          continue;
        }
        string += encodeString(nextChar);
        continue;
      }
      if (char === '"') {
        break;
      }
      string += char;
    }
    return string;
  }

  function attributesParser() {
    // a="b" c="d"
    // => { a: "b", c: "d" }

    while (true) {
      skipEmpty();
      const char = next();
      if (char === ">") {
        tokensArray.push({ type: "tag-right-bracket", value: ">" });
        break;
      }

      if (char === "/" && peek(2) === ">") {
        next(2);
        tokensArray.push({ type: "tag-self-closing-right-bracket", value: "/>" });
        break;
      }

      if (!char) throw new Error("Unexpected end of jsx attribute");

      let name = "";
      let value = "";

      while (/[a-zA-Z_]/.test(peek() || "")) {
        name += next();
      }

      tokensArray.push({ type: "attribute-name", value: name });

      if (peek() === "=") {
        next();
        tokensArray.push({ type: "attribute-assign", value: "=" });
        if (peek() === '"') {
          next();
          value = stringParser();
          tokensArray.push({ type: "attribute-value", value: value });
        } else {
          throw new Error("Unexpected end of jsx attribute");
        }
      } else {
        tokensArray.push({ type: "attribute-assign", value: "=" });
        tokensArray.push({ type: "attribute-value", value: "" });
        continue;
      }

      if (!name || !value) throw new Error("Unexpected end of jsx attribute");
    }
  }

  let tokensArray: Token[] = [];

  while (true) {
    const char = next();
    if (char === "<") {
      const nextChar = skipEmpty();
      if (!nextChar) throw new Error("Unexpected end of jsx tag");

      if (nextChar === ">") {
        tokensArray.push({ type: "fragment-open", value: "<>" });
        next();
        continue;
      } else if (nextChar === "/" && peek(2) === ">") {
        tokensArray.push({ type: "fragment-close", value: "</>" });
        next(2);
        continue;
      } else if (/[a-zA-Z_]/.test(nextChar)) {
        tokensArray.push({ type: "tag-left-bracket", value: "<" });
        let tagName = "";
        while (/[a-zA-Z_]/.test(peek() || "")) {
          tagName += next();
        }
        tokensArray.push({ type: "tag-name", value: tagName });
        attributesParser();

        continue;
      } else if (nextChar === "/" && /[a-zA-Z_]/.test(peek(2) || "")) {
        tokensArray.push({
          type: "tag-closing-left-bracket",
          value: "</",
        });
        next();
        let tagName = "";
        while (/[a-zA-Z_]/.test(peek() || "")) {
          tagName += next();
        }
        tokensArray.push({ type: "tag-name", value: tagName });
        next();
        tokensArray.push({ type: "tag-right-bracket", value: ">" });
        continue;
      } else if (nextChar === ">") {
        tokensArray.push({ type: "tag-right-bracket", value: ">" });
        next();
        continue;
      } else if (nextChar === "/") {
        tokensArray.push({ type: "tag-closing-left-bracket", value: "</" });
        next();
        continue;
      } else if (/\u/.test(nextChar)) {
        tokensArray.push({ type: "tag-left-bracket", value: "<" });
        let tagName = "";
        while (/[a-zA-Z_]/.test(peek() || "")) {
          tagName += next();
        }
        tokensArray.push({ type: "component-name", value: tagName });
        attributesParser();

        continue;
      } else {
        throw new Error("Unexpected character: <" + nextChar);
      }
    } else if (!!char) {
      tokensArray.push({ type: "content-text", value: char || "" });
      continue;
    }else {
      break;
    }
  }

  return tokensArray;
}

console.log(JSXLexer("<div>test</div>"))
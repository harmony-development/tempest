import { Converter } from "showdown";
import { host } from "./app";
import { parseHMC } from "~/logic/utils/parsing";

const markdownClasses: {
  [key: string]: string;
} = {
  p: "msg-p",
  pre: "codeblock",
};

export const conv = new Converter({
  simplifiedAutoLink: true,
  openLinksInNewWindow: true,
  ghCodeBlocks: true,
  extensions: [
    ...Object.keys(markdownClasses).map((key) => ({
      type: "output",
      regex: new RegExp(`<${key}>`, "g"),
      replace: `<${key} class="${markdownClasses[key]}" $1>`,
    })),
    {
      type: "lang",
      filter: (text, _converter, _options) => {
        return text.replaceAll(/<:.+?:>/g, (m) => {
          return `<img class="${
            m.length === text.replace(/\s/g, "").length ? "big-emoji" : "emoji"
          }" src="${parseHMC(m.slice(2, -2), host.value)}" />`;
        });
      },
    },
  ],
});
conv.setFlavor("github");

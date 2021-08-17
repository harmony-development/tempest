import { parseUserHost } from "./parsing";

describe("user host parsing", () => {
  const cases = [
    {
      provided: "https://chat.harmonyapp.io:2289",
      expected: "https://chat.harmonyapp.io:2289",
      title: "should parse normal hosts properly",
    },
    {
      provided: "https://chat.harmonyapp.io",
      expected: "https://chat.harmonyapp.io:2289",
      title: "should add port automatically",
    },
    {
      provided: "chat.harmonyapp.io",
      expected: "https://chat.harmonyapp.io:2289",
      title: "should automatically add HTTPS",
    },
    {
      provided: "http://chat.harmonyapp.io",
      expected: "http://chat.harmonyapp.io:2289",
      title: "should use http if specified explicitly",
    },
  ];

  test.each(cases)(`$title`, ({ provided, expected }) => {
    expect(parseUserHost(provided)).toStrictEqual(expected);
  });
});

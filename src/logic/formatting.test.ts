import { nearestOverlap } from './formatting';
describe("nearest overlap calculation", () => {
  const cases = [
    {
      formatters: [
        [0, 5],
        [3, 8],
        [9, 13]
      ]
    }
  ]

  test.each(cases)(`$formatters`, ({formatters}) => {
    expect(nearestOverlap(formatters[0], formatters.splice(0))).toBe(3)
  })
})

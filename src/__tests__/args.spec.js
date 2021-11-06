const Args = require('../args')

test('assert destination is valid', () => {
  expect((new Args(['/', 'yarn', 'cp', './', 'sj://bucket/']).assertDestinationValid)).not.toThrow(Error)
})

test('assert destination is invalid', () => {
  expect((new Args(['/', 'yarn', 'cp', './', '/bucket/'])).assertDestinationValid).toThrow(Error)
})

test('process force replace', () => {
  const args = new Args(['/', 'yarn', 'cp', './', '/bucket/', '--forceReplace'])

  expect(args.argv.forceReplace).toBe(undefined)
  expect(args.forceReplace).toBe(true)
})

test('options', () => {
  const args = new Args(['/', 'yarn', 'cp', './', '/bucket/', '--arg1', '3', '--arg2'])

  expect(args.options).toEqual({ arg1: 3, arg2: true })
})

test('Flags', () => {
  const args = new Args(['/', 'yarn', 'cp', './', '/bucket/', '--parallelism', '3', '--arg2', '--progress', '-h'])

  expect(args.flags.cp).toEqual(['--parallelism', '3', '--progress', '-h'])
})

test.each([
  {
    argv: ['/', 'yarn', 'cp', './'],
    expected: true,
  },
  {
    argv: ['/', 'yarn', 'cp', './', 'a'],
    expected: false,
  },
  {
    argv: ['/', 'yarn', 'cp', './', 'a', '--parallelism', '4'],
    expected: false,
  },
  {
    argv: ['/', 'yarn', 'rm', './'],
    expected: false,
  },
])('forward to uplink', ({ argv, expected }) => {
  jest.mock('fs')
  const args = new Args(argv)

  expect(args.shouldForwardToUplink()).toBe(expected)
})

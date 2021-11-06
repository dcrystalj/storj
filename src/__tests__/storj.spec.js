const Args = require('../args')
const Storj = require('../storj')

test.each([
  {
    files: ['/a/b/c.mp4', '/a/b/d.txt'],
    spawn: {
      chained: jest.fn(() => Promise.resolve()),
      chainedWithOutput: jest.fn(() => Promise.resolve()),
    },
    args: new Args(['/', 'yarn', 'cp', './a/b', 'sj://bucket/', '-h', '--forceReplace']),
    expectedCalls: {
      chained: [
        [[['uplink', ['cp', '/a/b/c.mp4', 'sj://bucket/b/c.mp4', '-h']]]],
        [[['uplink', ['cp', '/a/b/d.txt', 'sj://bucket/b/d.txt', '-h']]]],
      ],
      chainedWithOutput: [],
    },
  },
  {
    files: ['/a/b/c.mp4', '/a/b/d.txt'],
    args: new Args(['/', 'yarn', 'cp', './a/b', 'sj://bucket/', '--parallelism', '3', '-h']),
    spawn: {
      chained: jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve({})),
      chainedWithOutput: jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve(''))
        .mockImplementationOnce(() => Promise.resolve('BKT some /a/b/d.txt')),
    },
    expectedCalls: {
      chained: [
        [[['uplink', ['cp', '/a/b/c.mp4', 'sj://bucket/b/c.mp4', '--parallelism', '3', '-h']]]],
      ],
      chainedWithOutput: [
        [[['uplink', ['ls', 'sj://bucket/b/c.mp4', '-h']]]],
        [[['uplink', ['ls', 'sj://bucket/b/d.txt', '-h']]]],
      ],
    },
  },
])('upload recursive', async ({
  files,
  args,
  spawn,
  expectedCalls,
}) => {
  const storj = new Storj(spawn)
  await storj.uploadRecursive(files, args.source, args.destination, args.flags, args.forceReplace)

  expect(spawn.chained.mock.calls).toEqual(expectedCalls.chained)
  expect(spawn.chainedWithOutput.mock.calls).toEqual(expectedCalls.chainedWithOutput)
})

test.each([
  {
    args: new Args(['/', 'yarn', 'rm', 'sj://test/']),
    lines: 'test/core/LICENSE\na/core/README.md\nb/core/lib/config/cache-contexts.js',
    spawn: {
      chained: jest.fn(() => Promise.resolve()),
    },
    expectedCalls: {
      chained: [
        [[['uplink', ['rm', 'sj://test/test/core/LICENSE']]]],
        [[['uplink', ['rm', 'sj://test/a/core/README.md']]]],
        [[['uplink', ['rm', 'sj://test/b/core/lib/config/cache-contexts.js']]]],
      ],
    },
  },
])('delete recursive', async ({ args, lines, spawn, expectedCalls }) => {
  const storj = new Storj(spawn)
  storj.listRecursivePaths = jest.fn(() => Promise.resolve(lines))
  await storj.deleteRecursive(args.source, args.flags)

  expect(spawn.chained.mock.calls).toEqual(expectedCalls.chained)
})

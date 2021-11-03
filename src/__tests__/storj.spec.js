const Storj = require('../storj')

test.each([
  {
    files: ['/a/b/c.mp4', '/a/b/d.txt'],
    localFolder: './a/b',
    uploadFolder: 'sj://bucket/',
    replaceExisting: true,
    spawnMock: jest.fn(() => Promise.resolve()),
    options: ['--skip'],
    expectedCalls: [
      ['uplink', ['cp', '/a/b/c.mp4', 'sj://bucket/b/c.mp4', '--skip']],
      ['uplink', ['cp', '/a/b/d.txt', 'sj://bucket/b/d.txt', '--skip']]
    ]
  },
  {
    files: ['/a/b/c.mp4', '/a/b/d.txt'],
    localFolder: './a/b',
    uploadFolder: 'sj://bucket/',
    replaceExisting: false,
    options: ['--a', '--b'],
    spawnMock: jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(''))
      .mockImplementationOnce(() => Promise.resolve({}))
      .mockImplementationOnce(() => Promise.resolve('BKT some /a/b/d.txt')),
    expectedCalls: [
      ['uplink', ['ls', 'sj://bucket/b/c.mp4', '--a', '--b'], false],
      ['uplink', ['cp', '/a/b/c.mp4', 'sj://bucket/b/c.mp4', '--a', '--b']],
      ['uplink', ['ls', 'sj://bucket/b/d.txt', '--a', '--b'], false]
    ]
  }
])('upload recursive', async ({
  files,
  localFolder,
  uploadFolder,
  options,
  replaceExisting,
  spawnMock,
  expectedCalls
}) => {
  // const cp = { exec: spawnMock }
  const storj = new Storj(spawnMock)
  await storj.uploadRecursive(files, localFolder, uploadFolder, options, replaceExisting)

  expect(spawnMock.mock.calls).toEqual(expectedCalls)
})

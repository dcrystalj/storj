const commands = require('../commands')

test.each([
  {
    file: '/a/b/c.mp4',
    localFolderName: 'b',
    uploadFolder: 'sj://test/',
    expected: 'sj://test/b/c.mp4'
  },
  {
    file: '/a/b/c.mp4',
    localFolderName: 'a',
    uploadFolder: 'sj://test/',
    expected: 'sj://test/a/b/c.mp4'
  },
  {
    file: '/a/b/c.mp4',
    localFolderName: 'b',
    uploadFolder: 'sj://test/b',
    expected: 'sj://test/b/b/c.mp4'
  },
  {
    file: '/a/b/c.mp4',
    localFolderName: './b',
    uploadFolder: 'sj://test/b/',
    expected: 'sj://test/b/b/c.mp4'
  },
  {
    file: '/a/b/c.mp4',
    localFolderName: './b/',
    uploadFolder: 'sj://test/b/',
    expected: 'sj://test/b/b/c.mp4'
  },
  {
    file: '/c.mp4',
    localFolderName: './',
    uploadFolder: 'sj://test/',
    expected: 'sj://test/c.mp4'
  }
])('build upload path', ({ file, localFolderName, uploadFolder, expected }) => {
  expect(commands.buildUploadPath(file, localFolderName, uploadFolder)).toBe(expected)
})

const path = require('path')
const { URL } = require('url')

const buildUploadPath = (file, localFolder, uploadFolder) => {
  const localFolderPath = path.parse(localFolder)
  const localFolderName = localFolderPath.base
  const relativePath = file.split(localFolderName + path.sep).pop()
  const url = new URL(uploadFolder)
  url.pathname = path.join(url.pathname, path.sep, localFolderName, path.sep, relativePath)
  return url.href
}

module.exports = {
  buildUploadPath,
}

import Storage from 'web-storage-cache'

const localStorage = new Storage()

export function setLocalStorage(key, value) {
  return localStorage.set(key, value)
}
export function getLocalStorage(key) {
  return localStorage.get(key)
}

export function removeLocalStorage(key) {
  return localStorage.delete(key)
}
export function clearLocalStorage() {
  return localStorage.clear()
}

//将每个电子书存储在localstorage 中
export function setBookObject(fileName, key, value) {

  // let book = {}
  // if (getLocalStorage(`${fileName}-info`)) {
  //   book = getLocalStorage(`${fileName}-info`)
  // } else {
  //   book[key] = value
  //   setLocalStorage(`${fileName}-info`, book)
  // }
  let book = getLocalStorage(`${fileName}-info`)
  if (!book) {
    book = {}
  }
  book[key] = value
  setLocalStorage(`${fileName}-info`, book)

}
//获取缓存的电子书的信息
export function getBookObject(fileName, key) {
  let book = getLocalStorage(`${fileName}-info`)
  if (book) {
    return book[key]
  } else {
    return null
  }
}
//从localstorage 中获取缓存的字字体
export function getFontFamily(fileName) {
  return getBookObject(fileName, 'fontFamily')
}
//字体的保存
export function saveFontFamily(fileName, font) {
  return setBookObject(fileName, 'fontFamily', font)
}
//字体大小的缓存

export function getFontSize(fileName) {
  return getBookObject(fileName, 'fontSize')
}
export function saveFontSize(fileName, fontSize) {
  return setBookObject(fileName, 'fontSize', fontSize)
}
// 主题设置
export function getTheme(fileName) {
  return getBookObject(fileName, 'theme')
}

export function saveTheme(fileName, theme) {
  setBookObject(fileName, 'theme', theme)
}

//本地缓存语言
export function getLocale() {
  return getLocalStorage('locale')
}
export function saveLocale(locale) {
  return setLocalStorage('locale', locale)
}
//当前进度位置
export function getLocation(fileName) {
  return getBookObject(fileName, 'location')
}
export function saveLocation(fileName, location) {
  setBookObject(fileName, 'location', location)
}
//阅读计时
export function getReadTime(fileName) {
  return getBookObject(fileName, 'time')
}
export function saveReadTime(fileName, theme) {
  setBookObject(fileName, 'time', theme)
}
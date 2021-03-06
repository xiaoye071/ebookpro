
import axios from 'axios';
import { setLocalForage } from '../utils/localForage'
export function download(book, onSuccess, onError, OnProgress) {
  //当只传三个参数时,将后面两个合并
  if (!OnProgress) {
    OnProgress = onError
    onError = null
  }
  //create() 方法返回一个调用方式
  return axios.create({
    baseURL: process.env.VUE_APP_EPUB_URL,
    method: 'get',
    responseType: 'blob',
    timeout: 180 * 1000,
    //监听下载 progressEvent
    onDownloadProgress: progressEvent => {
      if (OnProgress) OnProgress(progressEvent)
    }
  }).get(`${book.categoryText}/${book.fileName}.epub`).then(res => {
    const blob = new Blob([res.data])

    //存储
    setLocalForage(book.fileName, blob, () => {
      if (onSuccess) onSuccess(book)
    }, err => {
      if (onError) onError(err)
    })
    // if (onSuccess) onSuccess(res)
  }).catch(err => {
    if (onError) onError(err)
  })
}
export function home() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/home`
  });
}

export function detail(book) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
    params: {
      fileName: book.fileName
    }
  })
}
export function list() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`
  })
}

export function shelf() {
  return axios({
    methods: "get",
    url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
  })
}
import Mock from 'mockjs'
import BookHomeApi from './bookHome'
import BookShelfApi from './bookShelf'
import BookHomeList from './bookList'
import BookFlatList from './bookFlatList'
// import { home } from '../api/home';


// Mock.setup({
//   timeout: '350-600'
// })
//请求的数据
Mock.mock(/\/book\/home/, 'get', BookHomeApi)
Mock.mock(/\/book\/shelf/, 'get', BookShelfApi)
Mock.mock(/\/book\/list/, 'get', BookHomeList)
Mock.mock(/\/book\/flat-list/, 'get', BookFlatList)

export default Mock

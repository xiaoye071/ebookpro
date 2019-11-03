const book = {
  state: {
    fileName: "",//文件名获取
    titleVisible: false,//标题栏
    visible: -1,
    //-1  不显示 0 字号 1 主题 2 进度 3 目录
    defaultFontSize: 16,//默认字体大侠
    currentBook: null,//当前页
    defaultFontFamily: 'Default',//默认字体样式
    fontFamilyVisible: false,//字体格式隐藏
    defaultTheme: 'Default',//主题
    progress: 0,//阅读进度
    bookAvailable: false,//进度条是否处于可用状态
    section: 0,//进度跳转区
  },
  mutations: {
    'SET_FILANAME': (state, fileName) => {
      state.fileName = fileName;
    },
    'SET_TITLEVISIBLE': (state, titleVisible) => {
      state.titleVisible = titleVisible
    },
    'SET_VISIBLE': (state, visible) => {
      state.visible = visible
    },
    'SET_DEFAULT_FONT_SIZE': (state, defaultFontSize) => {
      state.defaultFontSize = defaultFontSize
    },
    'SET_CURRENT_BOOK': (state, currentBook) => {
      state.currentBook = currentBook
    },
    'SET_DEFAULT_FONT_FAMILY': (state, defaultFontFamily) => {
      state.defaultFontFamily = defaultFontFamily
    },
    'SET_FONT_FAMILY_VISIBLE': (state, fontFamilyVisible) => {
      state.fontFamilyVisible = fontFamilyVisible
    },
    'SET_DEFAULT_THEME': (state, defaultTheme) => {
      state.defaultTheme = defaultTheme
    },

    'SET_BOOK_AVAILABLE': (state, bookAvailable) => {
      state.bookAvailable = bookAvailable
    },

    'SET_PROGRESS': (state, progress) => {
      state.progress = progress
    },
    'SET_SECTION': (state, section) => {
      state.section = section
    }
  },
  // actions: {

  //   // setMenuVisible: ({ commit }, menuVisible) => {
  //   //   return commit("SET_MENUVISIBLE", menuVisible)
  //   // },
  // }
};
export default book;

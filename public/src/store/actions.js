const actions = {
  setFileName: ({ commit }, fileName) => {
    return commit("SET_FILANAME", fileName);
  },
  setTitleVisible: ({ commit }, titleVisible) => {
    return commit("SET_TITLEVISIBLE", titleVisible)
  },
  setVisible: ({ commit }, visible) => {
    return commit("SET_VISIBLE", visible)
  },
  setDefaultFontSize: ({ commit }, defaultFontSize) => {
    return commit("SET_DEFAULT_FONT_SIZE", defaultFontSize)
  },
  setCurrentBook: ({ commit }, currentBook) => {
    return commit("SET_CURRENT_BOOK", currentBook)
  },
  setDefaultFontFamily: ({ commit }, defaultFontFamily) => {
    return commit("SET_DEFAULT_FONT_FAMILY", defaultFontFamily)
  },
  setFontFamilyVisible: ({ commit }, fontFamilyVisible) => {
    return commit("SET_FONT_FAMILY_VISIBLE", fontFamilyVisible)
  },
  setDefaultTheme: ({ commit }, defaultTheme) => {
    return commit("SET_DEFAULT_THEME", defaultTheme)
  },
  setBookAvailable: ({ commit }, bookAvailable) => {
    return commit("SET_BOOK_AVAILABLE", bookAvailable)
  },
  setProgress: ({ commit }, progress) => {
    return commit('SET_PROGRESS', progress)
  },
  setSection: ({ commit }, section) => {
    return commit("SET_SECTION", section)
  }
}

export default actions
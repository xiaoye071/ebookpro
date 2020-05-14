// import Navigation from "epubjs/types/navigation";

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
  },
  setCover: ({ commit }, cover) => {
    return commit("SET_COVER", cover)
  },
  setMetadata: ({ commit }, metadata) => {
    return commit('SET_METADATA', metadata)
  },
  setNavigation: ({ commit }, Navigation) => {
    return commit('SET_NAVIGATION', Navigation)
  },
  setOffsetY: ({ commit }, offsetY) => {
    return commit('SET_OFFSETY', offsetY)
  },
  setIsBookmark: ({ commit }, isBookmark) => {
    return commit('SET_IS_BOOKMARK', isBookmark)
  },
  setPagelist: ({ commit }, pagelist) => {
    return commit('SET_PAGELIST', pagelist)
  },
  setPaginate: ({ commit }, paginate) => {
    return commit('SET_PAGINATE', paginate)
  },
  setHotSearchOffsetY({ commit }, offsetY) {
    return commit('SET_HOT_SEARCH_OFFSETY', offsetY)
  },
  setFlapCardVisible({ commit }, visible) {
    return commit('SET_FLAP_CARD_VISIBLE', visible)
  },
  setIsEditMode({ commit }, isEditMode) {
    return commit('SET_IS_EDIT_MODE', isEditMode)
  },
  setShelfList({ commit }, list) {
    return commit('SET_SHELF_LIST', list)
  },
  setShelfSelected({ commit }, selected) {
    return commit('SET_SHELF_SELECTED', selected)
  },
  setShelfTitleVisible({ commit }, visible) {
    return commit('SET_SHELF_TITLE_VISIBLE', visible)
  },
  setShelfCategory({ commit }, category) {
    return commit('SET_SHELF_CATEGORY', category)
  },
  setCurrentType({ commit }, type) {
    return commit('SET_CURRENT_TYPE', type)
  }
}

export default actions
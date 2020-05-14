import CreateAPI from 'vue-create-api'
import Vue from 'vue'
import Toast from "../components/common/Toast.vue"
import Popup from '../components/common/Popup.vue'
import GroupDialog from "../components/shelf/shelfGroupDialog.vue"
Vue.use(CreateAPI)
Vue.createAPI(Toast, true)
Vue.createAPI(Popup, true)
Vue.createAPI(GroupDialog, true)
Vue.mixin({
  methods: {
    toast(setting) {
      return this.$createToast({
        $props: setting
      })
    },
    popup(setting) {
      return this.$createPopup({
        $props: setting
      })
    },
    simpleToast(text) {
      const toast = this.toast({
        text: text
      }).show()
      toast.updateText(text)
    },
    dialog(settings) {
      return this.$createGroupDialog({
        $props: settings
      })
    }
  },
})
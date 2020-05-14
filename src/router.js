import Vue from "vue";
import Router from "vue-router";


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      // redirect: "/ebook "
      redirect: "/store "

    },
    {
      path: "/ebook",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/ebook/index.vue"),
      children: [
        {
          path: ":fileName",
          component: () => import("./components/ebook/EbookReader.vue")
        }
      ]
    },
    {
      path: "/store",
      component: () => import("./views/store/index.vue"),
      redirect: "/store/shelf",
      children: [
        {
          path: 'home',
          component: () => import("./views/store/bookHome.vue")
        },
        {
          path: 'detail',
          component: () => import("./views/store/bookDetail.vue")
        },
        {
          path: 'list',
          component: () => import("./views/store/bookList.vue")
        },
        {
          path: 'shelf',
          component: () => import("./views/store/bookShelf.vue")
        },
        {
          path: 'category',
          component: () => import("./views/store/bookCategory.vue")
        }
      ]
    }
  ]
});

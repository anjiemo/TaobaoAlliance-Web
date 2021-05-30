module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '领券联盟商城',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '领券联盟商城是一个领取淘宝优惠券的平台，买的越多省的越多，不买立省百分百！' },
      { hid: 'keywords', name: 'keywords', content: '领券,优惠,淘宝,省钱,节省,购物,电商,推荐,搜券' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {
        src: 'https://cdn.sunofbeaches.com/qrcodejs/qrcode.min.js'
      }
    ]
  },
  css: [
    'element-ui/lib/theme-chalk/index.css',
  ],
  plugins: [
    {
      src: '~plugins/elementui',
      ssr: true
    }
  ],
  modules: [
    '@nuxtjs/proxy'
  ],

  axios: {
    proxy: true,
    prefix: '/union/',
    credentials: true
  },

  proxy: {
    '/union/': {
      target: 'https://api.sunofbeach.net/shop/',
      pathRewrite: {
        changeOrigin: true,
        '^/union/': ''
      }
    }
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#c9302c' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}


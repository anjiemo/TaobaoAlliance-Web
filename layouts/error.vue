<template>
  <div class="center-box">
    <div class="page-404" v-if="error.statusCode === 404">
      <h1>天呐~ 页面找不到了！</h1>
    </div>
    <div v-else class="error-page">
      <h1>系统繁忙，请稍后重试...</h1>
    </div>
    <div class="to-home-page">
      <a href="/">回到首页</a>
<!--      <nuxt-link to="/">回到首页</nuxt-link>-->
    </div>
  </div>
</template>

<script>
  export default {
    props: ['error']
  }
</script>

<style>

  .to-home-page a {
    text-decoration: none;
    padding: 10px 20px;
    border: dodgerblue solid 1px;
  }

  .to-home-page {
    text-align: center;
    margin-bottom: 100px;
  }

  .page-404, .error-page {
    min-height: 100px;
    text-align: center;
  }

  .page-404 h1, .error-page h1 {
    margin-top: 100px;
  }

</style>


<template>
  <div>
    <!--顶部-->
    <div id="header">
      <div class="center-box clear-fix">
        <div class="header-logo float-left">
          <span>券场</span>
        </div>
        <div class="header-menu float-left">
          <ul>
            <a href="/">
              <li :class="$store.state.setCurrentActive === 'index'?'menu-active':''">发现</li>
            </a>
            <a href="/ticket">
              <li :class="$store.state.setCurrentActive === 'ticket'?'menu-active':''">券场</li>
            </a>
            <a href="/onSell">
              <li :class="$store.state.setCurrentActive === 'onSell'?'menu-active':''">特惠</li>
            </a>
          </ul>
        </div>
        <div class="header-search-box float-left">
          <el-input @keyup.enter.native="toSearchPage" v-model="keyword" placeholder="复制（淘宝的标题或者关键字）找优惠券！"
                    size="small"/>
        </div>
        <div class="header-search-btn float-left">
          <el-button type="danger" size="small" @click="toSearchPage">搜索</el-button>
        </div>
      </div>
    </div>
    <nuxt/>
    <!--底部-->
    <div id="footer">
      <div class="center-box">
        <div class="footer-link">
          <ul class="clear-fix">
            <li>
              联系我们
            </li>
            <li>
              人才招聘
            </li>
            <li>
              广告投放
            </li>
            <li>
              网点加盟
            </li>
            <li>
              常见问题
            </li>
            <li>
              友情链接
            </li>
          </ul>
        </div>
        <div class="size-info">
          <p>&copy;2020 cqautotest.cn 渝IPC备 123456号-11 code by A lonely cat</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        keyword: ''
      }
    },
    mounted() {
      if (this.$router.app.context.query.keyword !== undefined) {
        this.keyword = this.$router.app.context.query.keyword;
      }
    },
    methods: {
      toSearchPage() {
        console.log('tSearchPage...');
        //search?kw=测试
        window.location.href = '/search?keyword=' + encodeURIComponent(this.keyword);
      }
    }
  }
</script>

<style>
  html {
    font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .size-info {
    color: #fff;
    line-height: 30px;
    padding-bottom: 20px;
    text-align: center;
  }

  .footer-link ul {
    display: inline-block;
  }

  .footer-link {
    padding-top: 20px;
    text-align: center;
  }

  .footer-link li {
    float: left;
    color: #fff;
    padding-left: 10px;
    padding-right: 10px;
    margin-left: 10px;
    margin-right: 10px;
    line-height: 30px;
  }

  .footer-link ul {
    list-style: none;
  }

  #footer {
    background: #c9302c;
  }

  .menu-active {
    background: #0000000a;
  }

  .header-search-btn {
    margin-left: 20px;
  }

  .header-search-box {
    margin-left: 20px;
  }

  .header-search-box .el-input {
    width: 300px;
  }

  .header-search-btn .el-button--danger {
    width: 100px;
  }

  .header-search-box, .header-search-btn {
    line-height: 70px;
  }

  .back-top:hover {
    color: #c9302c;
    border: #c9302c 1px solid;
  }

  .back-top {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-top: 15px;
    margin-bottom: 15px;
    color: #8c8c8c;
    line-height: 30px;
    text-align: center;
    border: #8c8c8c 1px solid;
  }

  #header {
    box-shadow: 0px 5px 10px #d4d4d4;
    height: 70px;
    background: #fff;
  }

  .float-left {
    float: left;
  }

  .float-right {
    float: right;
  }

  .clear-fix {
    zoom: 1;
    overflow: auto;
  }

  .header-menu li:hover {
    background: #0000000a;
  }

  .header-menu li {
    cursor: pointer;
    float: left;
    color: #000;
    font-size: 16px;
    font-weight: 600;
    line-height: 70px;
    padding-left: 15px;
    padding-right: 15px;
  }

  .header-menu ul {
    list-style: none;
  }

  .header-menu {
    margin-left: 30px;
  }

  .header-logo {
    float: left;
    line-height: 70px;
    font-size: 24px;
    font-weight: 600;
    color: #c9302c;
  }

  .center-box {
    width: 1140px;
    margin: 0 auto;
  }
</style>


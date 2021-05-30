<template>
  <section class="container">
    <div class="center-box">
      <div id="recommend-category-box">
        <ul class="clear-fix">
          <li :class="item.favorites_id!==currentFavoriteId?'float-left':'float-left recommend-menu-active' "
              v-for="(item,index) in categories"
              :key="index " v-text="item.favorites_title" @click="onCategoryClick(item)">
          </li>
          <li class="float-right">
            <a href="#top">
              <span class="back-top el-icon-upload2"/>
            </a>
          </li>
        </ul>
      </div>
      <div id="recommend-content-list-box"
           v-loading="loading">
        <div class="recommend-content-title">
          <span v-html="currentCategory"/>
        </div>
        <div class="recommend-content-list clear-fix">
          <div class="recommend-content-item float-left"
               v-for="(item,index) in content.tbk_dg_optimus_material_response.result_list.map_data" :key="index">
            <div class="recommend-item-cover">
              <img :src="item.pict_url + '_240x240xzq90.jpg_.webp'"/>
              <div class="discovery-qr-code-container" :id="'discovery-qr-code-container_' + index"/>
            </div>
            <div class="recommend-item-title">
              <a v-text="item.title" :href="item.coupon_click_url!==null?item.coupon_click_url:item.click_url"
                 target="_blank"/>
            </div>
            <div class="recommend-item-info">
              <a v-if="item.coupon_click_url!==null" class="buy-btn" :href="item.coupon_click_url"
                 target="_blank"
                 @mouseenter="onMouseHover(index,item.coupon_click_url)"
                 @mouseleave="onMouseLeave(index)">领券购买</a>
              <span class="recommend-original-price"
                    v-text="item.coupon_click_url===null?'晚了，无优惠券了':'原价：'+item.zk_final_price">原价：35.00</span>
            </div>
            <span class="recommend-coupon-info" v-if="item.coupon_info!=null" v-text="item.coupon_info"/>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import api from '../../utils/api';

  export default {
    head: {
      title: '领券联盟商城-券场',
      meta: [
        { charset: 'utf-8' },
        { hid: 'description', name: 'description', content: '领券联盟商城-券场,你可以在这里找到推荐的淘宝优惠券' },
        { hid: 'keywords', name: 'keywords', content: '优惠券,领券,淘宝联盟,优惠,淘宝,阿里妈妈' }
      ],
    },
    data() {
      return {
        loading: false
      }
    },
    methods: {
      onMouseLeave(index) {
        let qrCodeContainer = document.getElementById('discovery-qr-code-container_' + index);
        if (qrCodeContainer) {
          qrCodeContainer.innerHTML = '';
          qrCodeContainer.style.display = 'node';
          qrCodeContainer.style.backgroundColor = "transparent"
        }
      },
      onMouseHover(index, url) {
        console.log("onMouseHover...");
        // //生成二维码
        let qrCodeContainer = document.getElementById('discovery-qr-code-container_' + index);
        if (qrCodeContainer) {
          qrCodeContainer.style.display = 'block';
          qrCodeContainer.innerHTML = '';
          let qrcode = new QRCode(qrCodeContainer, {
            width: 160,//设置宽高
            height: 160,
            colorDark: "#000000", //二维码颜色
            colorLight: "#ffffff", //二维码背景色
            correctLevel: QRCode.CorrectLevel.M//容错率，L/M/H
          });
          if (url.search("http:") === -1) {
            url = "http:" + url
          }
          qrCodeContainer.style.backgroundColor = "#ffffff"
          qrcode.makeCode(url);
        }
      },
      onCategoryClick(item) {
        document.documentElement.scrollTop = 0;
        console.log("loadContentByCategory...");
        // console.log(item.favorites_id);
        // console.log(item.favorites_title);
        this.currentFavoriteId = item.favorites_id;
        this.currentCategory = item.favorites_title.split('').join("<em>/</em>");
        //加载对应的内容
        this.loadContentByCategory(item.favorites_id);
      },
      loadContentByCategory(favoriteId) {
        this.loading = true;
        this.content.tbk_dg_optimus_material_response.result_list.map_data = [];
        api.getRecommendContentByProxy(favoriteId).then(result => {
          this.loading = false;
          if (result.code === api.SUCCESS_CODE) {
            this.content = result.data;
          } else {
            //
          }
        });
      },
      onScroll() {
        let menuBox = document.getElementById('recommend-category-box');
        if (menuBox) {
          let dy = document.documentElement.scrollTop;
          if (dy < 90) {
            menuBox.style.top = (90 - dy) + 'px';
          } else {
            menuBox.style.top = '0px';
          }
        }
        console.log("onScroll....")
      }
    },
    mounted() {
      this.$store.commit('setCurrentActive', 'ticket');
      this.onScroll();
      console.log(document.documentElement.clientHeight);
      let listBox = document.getElementById("recommend-content-list-box");
      if (listBox) {
        listBox.style.minHeight = document.documentElement.clientHeight + "px";
      }
      window.addEventListener("scroll", this.onScroll)
    },
    async asyncData() {
      console.log("test load data...");
      let categoryResult = await api.getRecommendCategories();
      if (categoryResult.code === api.SUCCESS_CODE) {
        //请求分类成功
        let currentId = categoryResult.data[0].favorites_id;
        //去获取分类商品列表
        let contentResult = await api.getRecommendContent(currentId);
        // console.log(contentResult.data.tbk_dg_optimus_material_response.result_list.map_data)
        let titleArray = categoryResult.data[0].favorites_title.split('');
        // let  url = contentResult.data.tbk_dg_optimus_material_response.result_list.map_data.length = 0;
        // console.log(url);
        if (contentResult.code === api.SUCCESS_CODE) {
          return {
            categories: categoryResult.data,
            content: contentResult.data,
            currentCategory: titleArray.join("<em>/</em>"),
            currentFavoriteId: currentId
          };
        }
      } else {
        //TODO：请求分类失败
      }
    }
  }
</script>

<style>

  .discovery-qr-code-container img {
    display: inline-block !important;
    margin-top: 25px;
    width: 193px;
    height: 193px;
  }

  .recommend-item-cover {
    position: relative;
  }

  .discovery-qr-code-container {
    position: absolute;
    text-align: center;
    z-index: 2000;
    display: none;
    left: 0;
    top: 0;
    width: 243px;
    height: 243px;
  }

  .recommend-content-title span {
    font-size: 20px;
    font-weight: 600;
    color: #4d555d;
    font-style: normal;
    margin: 0 3px;
  }

  .recommend-content-title em {
    margin-left: 5px;
    margin-right: 5px;
    font-weight: 400;
    font-size: 16px;
  }

  .recommend-content-title {
    text-align: center;
    margin-bottom: 30px;
  }

  #recommend-content-list-box {
    margin-top: 100px;
    box-shadow: 0 5px 10px #d4d4d4;
  }

  .recommend-coupon-info {
    position: absolute;
    right: 12px;
    top: 20px;
    padding: 5px 10px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    background: #c9302c;
    color: #fff;
  }

  .buy-btn {
    text-decoration: none;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: #dcdfe6 1px solid;
    color: #fff;
    -wekit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: 1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    background-color: #f56c6c;
    border-color: #f56c6c;
  }

  .recommend-original-price {
    margin-left: 10px;
    font-weight: 600;
    color: #ebb563;
  }

  .recommend-item-info {
    margin-top: 10px;
  }

  .recommend-item-title a {
    margin-top: 10px;
    text-decoration: none;
    color: #47494e;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .recommend-content-item {
    width: 265px;
    position: relative;
    box-shadow: 0 5px 10px #d4d4d4;
    background: #fff;
    padding: 10px 10px;
    margin: 10px;
    height: 370px;
  }

  .recommend-item-cover > img {
    border-radius: 5px;
    width: 243px;
    height: 243px;
  }

  .recommend-menu-active {
    border-bottom: #c9302c 2px solid;
    color: #c9302c !important;
  }

  #recommend-category-box li {
    font-size: 16px;
    cursor: pointer;
    margin-left: 20px;
    color: #8c8c8c;
    margin-right: 20px;
  }

  #recommend-category-box ul > li:hover {
    color: #c9302c !important;
  }

  #recommend-category-box {
    height: 60px;
    width: 1140px;
    top: 90px;
    z-index: 1000;
    position: fixed;
    margin-bottom: 30px;
    background: #fff;
    line-height: 58px;
    box-shadow: 0 5px 10px #d4d4d4;
  }

  #recommend-category-box ul {
    list-style: none;
  }
</style>


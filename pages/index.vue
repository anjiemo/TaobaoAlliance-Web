<template>
  <div class="center-box clear-fix">
    <div class="discovery-content-box">
      <div class="discovery-left-part float-left">
        <div id="discovery-left-menu-box">
          <ul>
            <li :class="currentCategoryId===item.id?'discovery-category-active':''"
                v-for="(item,index) in categoriesList"
                :key="index"
                @click="onLeftMenuClick(item)">
              <span v-text="item.title"/>
            </li>
          </ul>
          <div class="discovery-to-top">
            <a href="#top">
              <span class="el-icon-upload2"/>
            </a>
          </div>
        </div>
      </div>
      <div class="discovery-center-part float-left" id="discovery-center-part">
        <div class="discovery-content-item clear-fix" v-for="(item,index) in contentList" :key="index">
          <div class="item-left-cover float-left">
            <el-image
              style="width: 180px; height: 180px"
              :src="item.pict_url + '_180x180xzq90.jpg_.webp'"
              fit="cover"/>
            <div class="discovery-qr-code-container" :id="'discovery-qr-code-container_' + index">

            </div>
          </div>
          <div class="item-right-info float-left">
            <div class="item-title">
              <a :href="item.coupon_click_url" target="_blank">
                <span v-text="item.title"/>
              </a>
            </div>
            <div class="price-info">
              <span class="original-price" v-text="'原价:'+item.zk_final_price"/>
              <span class="off-price">券后价: <span
                v-text="to2Bit(item.zk_final_price - item.coupon_amount)"/></span>
            </div>
            <div class="sell-info">
              <span v-text="item.volume"/>
              <span>·</span>
              <span>人已购买</span>
            </div>
          </div>
          <a target="_blank" :href="item.coupon_click_url"
             class="discovery-buy-btn"
             type="danger" size="small"
             @mouseenter="onMouseHover(index,item.coupon_click_url)"
             @mouseleave="onMouseLeave(index)">领券购买</a>
        </div>
        <div v-loading="isLoading" class="discovery-content-loading"/>
      </div>
      <div class="discovery-right-part float-left">
        <div id="discovery-right-loop">
          <el-carousel height="275px">
            <el-carousel-item v-for="(item,index) in loopData" :key="index">
              <a target="_blank" :href="item.coupon_click_url">
                <el-image
                  style="width: 275px; height: 275px"
                  :src="item.pict_url + '_270x270xzq90.jpg_.webp'"
                  fit="cover"/>
              </a>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import api from "../utils/api";
import axios from "axios";

export default {
  data() {
    return {
      active: '',
      isLoading: false,
      currentPage: 1
    }
  },
  methods: {
    onMouseLeave(index) {
      let qrCodeContainer = document.getElementById('discovery-qr-code-container_' + index);
      if (qrCodeContainer) {
        qrCodeContainer.innerHTML = '';
        qrCodeContainer.style.display = 'node';
        // 将二维码容器的背景置为透明，以免遮住商品封面图片
        qrCodeContainer.style.backgroundColor = "transparent"
      }
    },
    async onMouseHover(index, url) {
      console.log("onMouseHover...");
      //生成二维码
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
        // 正则匹配，是否有 http: 前缀，如果没有就拼接上去
        if (url.search("http:") === -1) {
          url = "http:" + url
        }
        // 填充白色背景，黑白的二维码比较容易识别一些
        qrCodeContainer.style.backgroundColor = "#ffffff"
        qrcode.makeCode(url);
      }
    },
    onLeftMenuClick(item) {
      document.documentElement.scrollTop = 0;
      this.currentCategoryId = item.id;
      this.currentPage = 1;
      this.contentList.length = 0;
      this.contentList = [];
      this.isLoading = true;
      //去加载这个分类内容
      this.loadData(this.currentPage);
    },
    loadData() {
      api.getCategoryContentByProxy(this.currentCategoryId, this.currentPage).then(result => {
        console.log(result);
        if (result.code === api.SUCCESS_CODE) {
          console.log("size ===> " + result.data.length);
          this.contentList = this.contentList.concat(result.data);
          //如果说没有更多
          if (result.data.length === 52) {
            //不用改值
            this.isLoading = false;
          }
        } else {
          this.isLoading = false;
          this.currentPage--;
        }
      });
    },
    //加载更多
    loaderMore() {
      this.currentPage++;
      this.loadData();
    },
    to2Bit(num) {
      return num.toFixed(2);
    },
    onScroll() {
      //console.log("on window scroll");
      //拿到对应的元素
      let leftMenuBox = document.getElementById('discovery-left-menu-box');
      let loopBox = document.getElementById('discovery-right-loop');
      let contentBox = document.getElementById('discovery-center-part');
      let contentBoxHeight = contentBox.offsetHeight - document.documentElement.clientHeight + 90;
      //10199
      //console.log("contentBox ====> height ===> " + contentBoxHeight);
      let dy = document.documentElement.scrollTop;
      //10192
      //console.log("dy ====> height ===> " + dy);
      if (leftMenuBox && loopBox) {
        //console.log(leftMenuBox.offsetTop);
        //判断当前滑动的距离
        if (dy >= 90) {
          leftMenuBox.style.top = '10px';
          loopBox.style.top = '10px';
        } else {
          leftMenuBox.style.top = (90 - dy) + 'px';
          loopBox.style.top = (90 - dy) + 'px';
        }
        if (dy >= contentBoxHeight && !this.isLoading) {
          //触发加载更多内容
          console.log("触发加载更多内容....");
          this.isLoading = true;
          //执行加载更多的代码
          this.loaderMore();
        }
      }
    }
  },
  async asyncData() {
    let categoriesResult;
    if (process.client) {
      categoriesResult = await api.getCategoriesByProxy();
    } else {
      categoriesResult = await api.getCategories();
    }
    if (categoriesResult.code === api.SUCCESS_CODE) {
      let categoriesList = categoriesResult.data;
      //拿推荐里面的内容
      let recommendItem = categoriesList[0];
      let currentCategoryId = recommendItem.id;
      let contentResult;
      if (process.client) {
        console.log("process in client");
        contentResult = await api.getCategoryContentByProxy(currentCategoryId, 1);
      } else {
        contentResult = await api.getCategoryContent(currentCategoryId, 1);
      }
      let loopData = contentResult.data.slice(0, 5);
      if (contentResult.code === api.SUCCESS_CODE) {
        // console.log(contentResult.data)
        return {
          currentCategoryId,
          categoriesList,
          contentList: contentResult.data,
          loopData
        };
      }
    }
  },
  mounted() {
    this.$store.commit('setCurrentActive', 'index');
    this.onScroll();
    let contentBox = document.getElementById('discovery-center-part');
    contentBox.style.minHeight = window.screen.height + 'px';
    window.addEventListener("scroll", this.onScroll);
  }
}
</script>

<style>

.discovery-qr-code-container img {
  display: inline-block !important;
  margin-top: 9px;
}

.discovery-qr-code-container {
  position: absolute;
  text-align: center;
  display: none;
  left: 0;
  top: 0;
  width: 180px;
  height: 180px;
}

.item-left-cover {
  position: relative;
}

#discovery-right-loop {
  position: fixed;
  width: 275px;
  height: 275px;
  box-shadow: 0 5px 10px #d4d4d4;
}

#discovery-left-menu-box > ul {
  margin-top: 20px;
  margin-bottom: 20px;
  box-shadow: 0 5px 10px #d4d4d4;
}

.discovery-to-top a {
  text-decoration: none;
  color: #7f828b;
}

.discovery-to-top {
  text-align: center;
}

.discovery-to-top span :hover {
  border: 1px solid dodgerblue;
  color: dodgerblue;
}

.discovery-to-top span {
  padding: 0 12px;
  cursor: pointer;
  border-radius: 50%;
  border: 1px solid #7f828b;
}

#discovery-left-menu-box {
  position: fixed;
}

#discovery-right-loop .el-carousel__button {
  width: 8px;
  height: 8px;
  border-radius: 50px;
}

.original-price {
  text-decoration: line-through;
}

.off-price {
  color: orangered;
}

.discovery-buy-btn:hover {
  background-color: orangered;
  border-color: orangered;
}

.discovery-buy-btn {
  text-decoration: none;
  padding: 8px 20px;
  border-radius: 5px;
  position: absolute;
  bottom: 20px;
  background-color: #F56C6C;
  border-color: #F56C6C;
  color: white;
  right: 20px;
}

.discovery-category-active {
  background: #ff4500;
  color: #fff;
}

.discovery-content-box {
  margin-top: 20px;
}

.sell-info {
  margin-top: 10px;
  margin-bottom: 10px;
  color: #47494e;
  font-size: 16px;
}

.price-info {
  font-size: 16px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: 600;
}

#discovery-left-menu-box li:hover {
  background: #ff4500;
  color: #fff;
}

#discovery-left-menu-box span {
  line-height: 40px;
}

#discovery-left-menu-box li {
  width: 105px;
  height: 40px;
  list-style: none;
  cursor: pointer;
  text-align: center;
}

/*1140px，分三份，左：120*/
.discovery-left-part {
  width: 105px;
  margin-left: 5px;
  margin-right: 10px;
}

.item-left-cover img {
  border-radius: 5px;
}

.item-title a {
  font-size: 20px;
  color: #000;
  text-decoration: none;
}

.item-title {
  cursor: pointer;
  max-width: 500px;
  font-weight: 600;
}

.item-right-info {
  margin-left: 10px;
}

.discovery-content-item {
  margin-bottom: 10px;
  position: relative;
  padding: 10px;
  background: #fff;
  box-shadow: 0 5px 10px #d4d4d4;
}

.discovery-content-loading {
  width: 100%;
  height: 104px;
  margin-bottom: 10px;
  box-shadow: 0 5px 10px #d4d4d4;
}

.discovery-center-part {
  width: 710px;
  margin-left: 130px;
  margin-right: 10px;
}

.discovery-right-part {
  width: 275px;
  margin-right: 5px;
  margin-left: 10px;
}

</style>

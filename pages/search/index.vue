<template>
  <div>
    <div class="center-box">
      <div class="search-content-box clear-fix" id="search-content-box">
        <div class="search-content-item float-left"
             v-if="searchResult!==undefined"
             v-for="(item,index) in searchResult" :key="index">
          <a :href="item.coupon_share_url===null?item.url:item.coupon_share_url" target="_blank">
            <div class="search-content-cover">
              <el-image :src="item.pict_url + '_270x270xzq90.jpg_.webp'"/>
              <span class="off-prise-tips" v-if="item.coupon_amount!==null" v-text="'省'+ item.coupon_amount + '元'"/>
            </div>
            <div class="search-content-prise-info">
              <span class="original-prise" v-text="'¥' + item.zk_final_price"/>
              <span>券后价：<span v-text="to2Bit(item.zk_final_price - item.coupon_amount)"/>
            </span>
            </div>
            <div class="search-content-volume">
              <span v-text="item.volume + '·人已购买'"/>
            </div>
            <div class="search-content-title">
              <p v-text="item.title"/>
            </div>
          </a>
        </div>
      </div>
      <div class="search-loading"
           v-if="hasMoreContent"
           v-loading="isLoading"/>
    </div>
  </div>
</template>
<script>
  import api from "../../utils/api";

  export default {
    data() {
      return {
        isLoading: false,
        currentPage: 1,
        hasMoreContent: true
      }
    },
    methods: {
      to2Bit(num) {
        return num.toFixed(2);
      },
      loaderMore() {
        this.currentPage++;
        //页码，搜索关键字
        api.doSearchByProxy(this.keyword, this.currentPage).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            if (result.data.tbk_dg_material_optional_response === null) {
              this.$message.error({
                message: '没有更多内容',
                center: true
              });
              this.hasMoreContent = false;
            }
            this.searchResult = this.searchResult.concat(result.data.tbk_dg_material_optional_response.result_list.map_data)
          }
          this.isLoading = false;
        });
      },
      onScroll() {
        //console.log("on window scroll");
        //拿到对应的元素
        let contentBox = document.getElementById('search-content-box');
        let contentBoxHeight = contentBox.offsetHeight - document.documentElement.clientHeight + 90;
        //10199
        //console.log("contentBox ====> height ===> " + contentBoxHeight);
        let dy = document.documentElement.scrollTop;
        //10192
        //console.log("dy ====> height ===> " + dy);
        if (dy >= contentBoxHeight && !this.isLoading && this.hasMoreContent) {
          //触发加载更多内容
          console.log("触发加载更多内容....");
          this.isLoading = true;
          //执行加载更多的代码
          this.loaderMore();
        }
      }
    },
    mounted() {
      window.addEventListener("scroll", this.onScroll)
    },
    asyncData(content) {
      //console.log("isClient ===> " + process.server);
      //console.log(content.route.query);
      let keyword = content.query.keyword;
      //console.log(keyword);
      if (process.server) {
        return api.doSearch(encodeURIComponent(keyword), 1).then(result => {
          //console.log(result);
          if (result.code === api.SUCCESS_CODE) {
            //console.log(result.data);
            return {
              searchResult: result.data.tbk_dg_material_optional_response.result_list.map_data,
              keyword: keyword
            };
          }
        });
      } else {
        return api.doSearchByProxy(encodeURIComponent(keyword), 1).then(result => {
          console.log(result);
          if (result.code === api.SUCCESS_CODE) {
            return {
              searchResult: result.data.tbk_dg_material_optional_response.result_list.map_data,
              keyword: keyword
            };
          }
        });
      }
    }
  }
</script>
<style>

  .el-message {
    min-width: 0;
  }

  .search-loading {
    width: 100%;
    height: 200px;
    background: #F5F5F5;
  }

  .search-content-cover {
    position: relative;
  }

  .off-prise-tips {
    position: absolute;
    background: #c9302c;
    color: #fff;
    padding: 5px 18px;
    top: 0;
    right: 0;
  }

  .search-content-title {
    min-height: 44px;
    font-size: 16px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    color: #000;
  }

  .search-content-volume {
    margin-bottom: 5px;
    color: #7f828b;
    font-size: 16px;
  }

  .search-content-prise-info .original-prise {
    text-decoration: line-through;
  }

  .search-content-prise-info {
    color: orangered;
    font-size: 18px;
    font-weight: 600;
    margin-top: 5px;
    margin-bottom: 10px;
  }

  .search-content-box {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .search-content-item:hover {
    border: #c63632 1px solid;
  }

  .search-content-item a {
    text-decoration: none;
  }

  .search-content-item {
    cursor: pointer;
    width: 275px;
    margin: 5px;
    padding: 5px;
    border: #7f828b 1px solid;
  }

  .search-content-cover .el-image {
    width: 263px;
    height: 263px;
  }

</style>

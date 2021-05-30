<template>
  <div class="center-box">
    <div class="onSell-content-box clear-fix" id="onSell-content-box">
      <div class="onSell-content-item float-left" v-for="(item,index) in contentList" :key="index">
        <a :href="item.coupon_click_url" target="_blank">
          <div class="onSell-item-cover">
            <el-image
              style="width: 263px; height: 263px"
              :src="item.pict_url + '_270x270xzq90.jpg_.webp'"
              fit="cover"/>
            <div class="onSell-off-prise">
              省{{ item.coupon_amount }}元
            </div>
          </div>
          <div class="onSell-item-prise">
            <span class="onSell-item-final-prise" v-text="'¥'+item.zk_final_price"/>
            <span>
           券后价:
            <span v-text="to2Bit(item.zk_final_price - item.coupon_amount)"/>
         </span>
          </div>
          <div class="onSell-item-volume">
            <span>{{ item.volume }} ·人已购买</span>
          </div>
          <div class="onSell-item-title">
            <p v-text="item.title"/>
          </div>
        </a>
      </div>
    </div>
    <div v-if="isLoading&&hasMore" class="onSell-page-loading" v-loading="isLoading" element-loading-text="正在玩命加载中..."/>
  </div>
</template>
<script>
import api from '../../utils/api';

export default {
  data() {
    return {
      isLoading: false,
      currentPage: 1,
      hasMore: true
    }
  },
  methods: {
    to2Bit(num) {
      return num.toFixed(2);
    },
    onScroll() {
      let dy = document.documentElement.scrollTop;
      let contentBox = document.getElementById('onSell-content-box');
      let contentBoxHeight = contentBox.offsetHeight - document.documentElement.clientHeight + 90;
      console.log(dy);
      if (dy >= contentBoxHeight && !this.isLoading && this.hasMore) {
        //触发加载更多内容
        console.log("触发加载更多内容....");
        this.isLoading = true;
        //执行加载更多的代码
        this.loaderMore();
      }
    },
    loaderMore() {
      this.currentPage++;
      api.getOnSellContent(this.currentPage).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          if (result.data.tbk_dg_optimus_material_response !== null) {
            this.contentList = this.contentList.concat(result.data.tbk_dg_optimus_material_response.result_list.map_data);
          } else {
            this.$message({
              message: '没有更多内容',
              type: 'error',
              center: true
            });
            this.hasMore = false;
          }
        } else {
          this.currentPage--;
        }
        this.isLoading = false;
      })
    }
  },
  asyncData() {
    return api.getOnSellContent(1).then(result => {
      //console.log(result);
      if (result.code === api.SUCCESS_CODE) {
        if (result.data.tbk_dg_optimus_material_response !== null) {
          let data = result.data.tbk_dg_optimus_material_response.result_list.map_data;
          return {contentList: data};
        }
      }
    });
  },
  mounted() {
    this.$store.commit('setCurrentActive', 'onSell');
    //设置滚动监听
    window.addEventListener("scroll", this.onScroll);
  }
}
</script>
<style>

.onSell-page-loading .el-loading-spinner .path {
  stroke: #47494e;
}

.onSell-page-loading .el-loading-spinner .el-loading-text {
  color: #47494e;
}

.onSell-page-loading {
  width: 100%;
  height: 200px;
  margin-bottom: 20px;
  box-shadow: 0px 5px 10px #d4d4d4;
}

.onSell-item-title {
  font-weight: 600;
  min-height: 43px;
  font-size: 16px;
  color: #000;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.onSell-item-volume {
  font-size: 14px;
  color: #7f828b;
  margin-bottom: 5px;
}

.onSell-item-prise {
  color: #f40;
  margin-bottom: 10px;
  font-size: 18px;
}

.onSell-item-final-prise {
  text-decoration: line-through;
}

.onSell-content-box {
  margin-top: 20px;
  margin-bottom: 20px;
}

.onSell-content-item:hover {
  border: #c9302c solid 1px;
}

.onSell-content-item > a {
  text-decoration: none;
}

.onSell-content-item {
  width: 275px;
  cursor: pointer;
  margin: 5px;
  padding: 5px;
  border: #dfdfdf 1px solid;
}

.onSell-off-prise {
  background: #c9302c;
  color: #fff;
  font-size: 14px;
  text-align: center;
  padding: 4px 18px;
  position: absolute;
  top: 0;
  right: 0;
}

.onSell-item-cover {
  margin-bottom: 10px;
  position: relative;
}

</style>

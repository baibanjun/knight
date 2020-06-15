<template>
  <div id="app">
    <el-container class="nav">
      <el-header height="70px" v-show="!is_records">
        <img src="./assets/logo.png" alt="12" height="60">
        <span class="title">健骑士餐厨垃圾处理系统</span>
        <span class="user_info" v-show="is_login">
          <span>欢迎,<span class="blue_text">{{user}}</span></span>
          <span @click="out()"><i class="el-icon-switch-button"></i>退出</span>
        </span>
      </el-header>
      <el-container>
        <right-menu :menu="menu_type" v-show="menu_type!=0"></right-menu>
        <el-main>
          <bread-crumb v-show="is_login" :bread_crumb="levelList"></bread-crumb>
          <!--多个组件需要动效，使用transition-group -->
          <transition name="main">
            <router-view key="default"/>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
	import rightMenu from '_c/rightMenu.vue'
	import breadCrumb from '_c/breadCrumb.vue'
	import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
	export default{
		data(){
			return {
				levelList:[]
			}
		},
		mounted() {
			// console.log(router)
		},
		watch: {
			'$route':function (newVal, oldVal) {
				this.getBreadcrumb()
			}
		},
		created(){

        },
		computed:{
			...mapState({
				user:state => state.user_name,
				is_login:state => state.is_login,
				menu_type:state => state.menu_type,
        is_records:state => state.is_records
			}),
			bread_crumb:() => {
				return []
			}
		},
		components:{
			rightMenu,
			breadCrumb
		},
		methods:{
			...mapMutations([ //将mutation里的方法展开平铺
				'log_out'
			]),
			out:function(){
				this.$confirm('确认退出登录？')
					.then(()=> {
						this.log_out()
						this.$router.push("/login")
					})
					.catch(()=> {});
			},
			getBreadcrumb:function(){
        let matched = this.$route.matched  //抓取元信息
        this.levelList = matched
      }
		}
	}
</script>

<style lang="less">
a{
	text-decoration: none;
	color:#909399
}
body{
	margin: 0
}
.main-enter{
	opacity: 0;
}
.main-enter-active{
	transition: opacity 1s ease;
}
.main-enter-to{
	opacity: 1;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.el-header{
	background-color: #EBEEF5;
}
.el-main{
	padding: 30px
}
.el-menu{
	border-bottom: 1px solid #e6e6e6
}
.el-submenu__title{
  font-weight: 600;
}
.nav{
	.title{
		font-size: 25px;
		font-weight: 400;
	}
	.user_info{
		float: right;
		line-height: 70px;
		margin-right: 50px;
		span{
			margin:0 20px;
			font-size:16px;
			cursor: pointer;
		}
	}
	img{
		vertical-align:middle;
		margin:5px 40px;
	}
}
.page{
  text-align: center;
  padding: 10px 0;
}
.tac{
  text-align: center
}
.blue_text{
  color: #409EFF
}
table,tbody,thead {
  width: 100% !important;
}
.el-submenu .el-menu-item {
  height:44px !important;
  line-height: 44px !important;
}
// colgroup {
//   position: absolute;
//   width: 100% !important;
//   display: flex;
// }
// col {
//   flex: 1;
//   text-align: center;
// }
</style>

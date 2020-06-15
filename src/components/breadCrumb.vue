<template>
	<p>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: n.path }" v-for="n in bread_crumb">{{n.meta.title}}</el-breadcrumb-item>
		</el-breadcrumb>
	</p>
	
</template>

<script>
	export default{
		data(){
			return {}
		},
		props:{
			bread_crumb:{
				type:Array,
				default:() => {
					return []
				}
			}
		}
	}
</script>

<style scoped>
	p{
		padding-bottom:20px;
		padding-left:10px;
		border-bottom: 1px solid #E6E6E6;
	}
</style>

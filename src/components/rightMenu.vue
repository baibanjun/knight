<template>
	<el-aside width="200px">
		<el-menu
      :default-active="$route.path"
			class="el-menu-vertical-demo"
			active-text-color="#409EFF"
			:router="true"
      :default-openeds='["1","2","3"]'
		>
    <!-- :default-openeds='["1","2"]' -->
			<!--开启router之后，el-menu-item中的index即为路由地址-->
			<el-submenu :index="n.index" v-for="n in menu_type">
				<template slot="title">
					<i :class="n.icon"></i>
					<span>{{n.title}}</span>
				</template>
				<el-menu-item-group>
					<el-menu-item v-for="p in n.group" :index="p.to">{{p.name}}</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
		</el-menu>
	</el-aside>
</template>

<script>
	export default{
		data(){
			return{
				//超级管理员端
				type_1:[
					{
						title:"财务管理",icon:"el-icon-menu",index:'1',
						group:[
							{name:'月结款项应付账单',to:'/super/statement'},
							{name:'入账管理',to:'/super/income'},
							{name:'出账管理',to:'/super/expenditure'},
							{name:'财务报表',to:'/super/report'},
							{name:'账目管理',to:'/super/accounts'}
						]
					},
					{
						title:"用户管理",icon:"el-icon-menu",index:'2',
						group:[
							{name:'用户管理',to:'/super/userList'},
							{name:'角色管理',to:'/super/roleList'}
						]
					}
				],
        //出纳
        type_2:[
        	{
        		title:"财务管理",icon:"el-icon-menu",index:'1',
        		group:[
        			{name:'月结款项对账表',to:'/cashier/statement'},
        			{name:'入账管理',to:'/cashier/income'},
        			{name:'出账管理',to:'/cashier/expenditure'},
        			{name:'账目管理',to:'/cashier/accounts'}
        		]
        	}
        ],
        //财务端
        type_3:[
        	{
        		title:"餐厨垃圾管理",icon:"el-icon-menu",index:'1',
        		group:[
        			{name:'餐厨垃圾入库(日)',to:'/finance/rub/dayList'},
        			{name:'餐厨垃圾入库(月)',to:'/finance/rub/monthList'},
        			{name:'餐厨垃圾处理',to:'/finance/rub/disposeList'},
        			{name:'合同管理',to:'/finance/rub/contractList'}
        		]
        	},
        	{
        		title:"餐厨油脂管理",icon:"el-icon-menu",index:'2',
        		group:[
        			{name:'餐厨油脂入库(日)',to:'/finance/gre/dayList'},
        			{name:'餐厨油脂入库(月)',to:'/finance/gre/monthList'},
        			{name:'餐厨油脂出库',to:'/finance/gre/export'},
        			{name:'合同管理',to:'/finance/gre/contractList'}
        		]
        	},
        	{
        		title:"财务管理",icon:"el-icon-menu",index:'3',
        		group:[
        			{name:'月结款项对账表',to:'/finance/fin/statement'},
        			{name:'入账管理',to:'/finance/fin/income'},
        			{name:'出账管理',to:'/finance/fin/expenditure'},
        			{name:'账目管理',to:'/finance/fin/accounts'}
        		]
        	}
        ],
				//管理员端
				type_4:[
					{
						title:"餐厨垃圾管理",icon:"el-icon-menu",index:'1',
						group:[
							{name:'餐厨垃圾入库(日)',to:'/admin/rub/dayList'},
							{name:'餐厨垃圾入库(月)',to:'/admin/rub/monthList'},
							{name:'餐厨垃圾处理',to:'/admin/rub/disposeList'},
							{name:'单位管理',to:'/admin/rub/companyList'},
							{name:'运输人管理',to:'/admin/rub/driverList'},
							{name:'合同管理',to:'/admin/rub/contractList'}
						]
					},
					{
						title:"餐厨油脂管理",icon:"el-icon-menu",index:'2',
						group:[
							{name:'餐厨油脂入库(日)',to:'/admin/gre/dayList'},
							{name:'餐厨油脂入库(月)',to:'/admin/gre/monthList'},
							{name:'餐厨油脂出库',to:'/admin/gre/export'},
							{name:'餐厨油脂入库汇总',to:'/admin/gre/summary'},
							{name:'单位管理',to:'/admin/gre/companyList'},
							{name:'合同管理',to:'/admin/gre/contractList'}
						]
					},
          {
          	title:"出入库数据查询",icon:"el-icon-menu",index:'3',
          	group:[
          		{name:'数据列表',to:'/admin/stockList'},
          	]
          }
				],
				//入库员端
        type_5:[
        	{
        		title:"入库管理",icon:"el-icon-menu",index:'1',
        		group:[
        			{name:'出入库称重',to:'/warehousing/stock'},
        			{name:'餐厨垃圾开票',to:'/warehousing/rubDayList'},
        			{name:'餐厨油脂开票',to:'/warehousing/greDayList'}
        		]
        	}
        ],


			}
		},
		computed:{
			menu_type:function(){
				var type = [];
				if(this.menu == '1'){
					type = this.type_1
				}
				else if(this.menu == '3'){ //出纳
					type = this.type_2
				}
				else if(this.menu == '5'){ //财务
					type = this.type_3
				}
				else if(this.menu == '7'){ //管理员
					type = this.type_4
				}
				else if(this.menu == '13'){
					type = this.type_5
				}
				return type
			}
		},
		props:{
			menu:{
				type:[String,Number],
				default:'2'
			}
		}
	}
</script>

<style>
</style>

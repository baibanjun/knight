export default [
  {
  	path:'/',
  	name:'main',
  	component: () => import('@/views/login.vue')
  },
	{
		path:'/login',
		name:'login',
		component: () => import('@/views/login.vue')
	},
	//超级管理员模块
	{
		path:'/super',
		name:'super',
		component: () => import('@/views/index.vue'),
		meta:{title: '超级管理员系统'},
		children: [
			{
				path:'userList',
				component: () => import('@/views/super/userList.vue'),
				meta:{title: '用户管理'}
			},
			{
				path:'roleList',
				component: () => import('@/views/super/roleList.vue'),
				meta:{title: '角色管理'}
			},
			{
				path:'addUser',
				component: () => import('@/views/super/addUser.vue'),
				meta:{title: '新增用户'}
			},
			{
				path:'editUser',
				component: () => import('@/views/super/editUser.vue'),
				meta:{title: '修改用户'}
			},
			{
				path:'editRole',
				component: () => import('@/views/super/editRole.vue'),
				meta:{title: '修改角色'}
			},
      {
      	path:'accounts',
      	component: () => import('@/views/super/accounts.vue'),
      	meta:{title: '账目管理列表'}
      },
      {
      	path:'accountsDetail',
      	component: () => import('@/views/super/accountsDetail.vue'),
      	meta:{title: '账目详情'}
      },
      {
      	path:'addAccounts',
      	component: () => import('@/views/super/addAccounts.vue'),
      	meta:{title: '新增账目'}
      },
      {
      	path:'expenditure',
      	component: () => import('@/views/super/expenditure.vue'),
      	meta:{title: '出账管理列表'}
      },
      {
      	path:'expenditureDetail',
      	component: () => import('@/views/super/expenditureDetail.vue'),
      	meta:{title: '出账账目详情'}
      },
      {
      	path:'addExpenditure',
      	component: () => import('@/views/super/addExpenditure.vue'),
      	meta:{title: '新增出账账目'}
      },
      {
      	path:'income',
      	component: () => import('@/views/super/income.vue'),
      	meta:{title: '入账管理列表'}
      },
      {
      	path:'addIncome',
      	component: () => import('@/views/super/addIncome.vue'),
      	meta:{title: '新增入账账目'}
      },
      {
      	path:'incomeDetail',
      	component: () => import('@/views/super/incomeDetail.vue'),
      	meta:{title: '入账账目详情'}
      },
      {
      	path:'statement',
      	component: () => import('@/views/super/statement.vue'),
      	meta:{title: '月结款应付账单列表'}
      },
      {
      	path:'statementDetail',
      	component: () => import('@/views/super/statementDetail.vue'),
      	meta:{title: '月结款应付账单详情'}
      },
      {
      	path:'report',
      	component: () => import('@/views/super/report.vue'),
      	meta:{title: '财务报表'}
      }
		]
	},
  //管理员模块
  {
  	path:'/admin',
  	name:'admin',
  	component: () => import('@/views/index.vue'),
  	meta:{title: '管理员系统'},
  	children: [
      //餐厨垃圾管理
      {
      	path:'rub',
      	component: () => import('@/views/index.vue'),
      	meta:{title: '餐厨垃圾管理'},
        children:[
          {
          	path:'/',
          	component: () => import('@/views/admin/rubDayList.vue')
          },
          {
          	path:'dayList',
          	component: () => import('@/views/admin/rubDayList.vue'),
          	meta:{title: '餐厨垃圾入库（日）列表'}
          },
          {
          	path:'dayDetail',
          	component: () => import('@/views/admin/rubDayDetail.vue'),
          	meta:{title: '餐厨垃圾入库（日）详情'}
          },
          {
          	path:'addDay',
          	component: () => import('@/views/admin/rubAddDay.vue'),
          	meta:{title: '新增餐厨垃圾入库（日）记录'}
          },
          {
          	path:'monthList',
          	component: () => import('@/views/admin/rubMonthList.vue'),
          	meta:{title: '餐厨垃圾入库（月）列表'}
          },
          {
          	path:'monthDetail',
          	component: () => import('@/views/admin/rubMonthDetail.vue'),
          	meta:{title: '餐厨垃圾入库（月）详情'}
          },
          {
          	path:'disposeList',
          	component: () => import('@/views/admin/rubDisposeList.vue'),
          	meta:{title: '餐厨垃圾处理'}
          },
          {
          	path:'disposeDetail',
          	component: () => import('@/views/admin/rubDisposeDetail.vue'),
          	meta:{title: '餐厨垃圾处理详情'}
          },
          {
          	path:'companyList',
          	component: () => import('@/views/admin/rubCompanyList.vue'),
          	meta:{title: '单位管理'}
          },
          {
          	path:'addCompany',
          	component: () => import('@/views/admin/rubAddCompany.vue'),
          	meta:{title: '新增单位'}
          },
          {
          	path:'companyDetail',
          	component: () => import('@/views/admin/rubCompanyDetail.vue'),
          	meta:{title: '查看单位详情'}
          },
          {
          	path:'driverList',
          	component: () => import('@/views/admin/rubDriverList.vue'),
          	meta:{title: '运输人管理列表'}
          },
          {
          	path:'addDriver',
          	component: () => import('@/views/admin/rubAddDriver.vue'),
          	meta:{title: '新增运输人'}
          },
          {
          	path:'driverDetail',
          	component: () => import('@/views/admin/rubDriverDetail.vue'),
          	meta:{title: '运输人信息'}
          },
          {
          	path:'contractList',
          	component: () => import('@/views/admin/rubContractList.vue'),
          	meta:{title: '合同管理列表'}
          },
          {
          	path:'addContract',
          	component: () => import('@/views/admin/rubAddContract.vue'),
          	meta:{title: '新增合同'}
          },
          {
          	path:'contractDetail',
          	component: () => import('@/views/admin/rubContractDetail.vue'),
          	meta:{title: '合同详情'}
          }
        ]
      },
      //餐厨油脂管理
      {
      	path:'gre',
      	component: () => import('@/views/index.vue'),
      	meta:{title: '餐厨油脂管理'},
        children:[
          {
          	path:'/',
          	component: () => import('@/views/admin/greDayList.vue')
          },
          {
          	path:'dayList',
          	component: () => import('@/views/admin/greDayList.vue'),
          	meta:{title: '餐厨油脂入库（日）列表'}
          },
          {
          	path:'dayDetail',
          	component: () => import('@/views/admin/greDayDetail.vue'),
          	meta:{title: '餐厨油脂入库（日）详情'}
          },
          {
          	path:'addDay',
          	component: () => import('@/views/admin/greAddDay.vue'),
          	meta:{title: '新增油脂入库（日）记录'}
          },
          {
          	path:'monthList',
          	component: () => import('@/views/admin/greMonthList.vue'),
          	meta:{title: '餐厨油脂入库（月）列表'}
          },
          {
          	path:'monthDetail',
          	component: () => import('@/views/admin/greMonthDetail.vue'),
          	meta:{title: '餐厨油脂入库（月）详情'}
          },
          {
          	path:'export',
          	component: () => import('@/views/admin/greExport.vue'),
          	meta:{title: '餐厨油脂出库'}
          },
          {
          	path:'exportDetail',
          	component: () => import('@/views/admin/greExportDetail.vue'),
          	meta:{title: '餐厨油脂出库详情'}
          },
          {
          	path:'summary',
          	component: () => import('@/views/admin/greSummary.vue'),
          	meta:{title: '餐厨油脂出入库汇总列表'}
          },
          {
          	path:'summaryDetail',
          	component: () => import('@/views/admin/greSummaryDetail.vue'),
          	meta:{title: '餐厨油脂出入库汇总详情'}
          },
          {
          	path:'companyList',
          	component: () => import('@/views/admin/greCompanyList.vue'),
          	meta:{title: '单位管理列表'}
          },
          {
          	path:'addCompany',
          	component: () => import('@/views/admin/greAddCompany.vue'),
          	meta:{title: '新增单位'}
          },
          {
          	path:'companyDetail',
          	component: () => import('@/views/admin/greCompanyDetail.vue'),
          	meta:{title: '单位详情'}
          },
          {
          	path:'contractList',
          	component: () => import('@/views/admin/greContractList.vue'),
          	meta:{title: '合同管理列表'}
          },
          {
          	path:'addContract',
          	component: () => import('@/views/admin/greAddContract.vue'),
          	meta:{title: '新增合同'}
          },
           {
          	path:'contractDetail',
          	component: () => import('@/views/admin/greContractDetail.vue'),
          	meta:{title: '合同详情'}
          }

        ]
      },
      //新模块
      {
      	path:'stockList',
      	component: () => import('@/views/admin/stockList.vue'),
      	meta:{title: '出入库数据列表'},
      }
  	]
  },

  //财务模块
  {
  	path:'/finance',
  	name:'finance',
  	component: () => import('@/views/index.vue'),
  	meta:{title: '财务系统'},
  	children: [
      //餐厨垃圾管理
      {
      	path:'rub',
      	component: () => import('@/views/index.vue'),
      	meta:{title: '餐厨垃圾管理'},
        children:[
          {
          	path:'/',
          	component: () => import('@/views/finance/rubDayList.vue')
          },
          {
          	path:'dayList',
          	component: () => import('@/views/finance/rubDayList.vue'),
          	meta:{title: '餐厨垃圾入库（日）列表'}
          },
          {
          	path:'dayDetail',
          	component: () => import('@/views/finance/rubDayDetail.vue'),
          	meta:{title: '餐厨垃圾入库（日）详情'}
          },
          {
          	path:'monthList',
          	component: () => import('@/views/finance/rubMonthList.vue'),
          	meta:{title: '餐厨垃圾入库（月）列表'}
          },
          {
          	path:'monthDetail',
          	component: () => import('@/views/finance/rubMonthDetail.vue'),
          	meta:{title: '餐厨垃圾入库（月）详情'}
          },
          {
          	path:'disposeList',
          	component: () => import('@/views/finance/rubDisposeList.vue'),
          	meta:{title: '餐厨垃圾处理'}
          },
          {
          	path:'disposeDetail',
          	component: () => import('@/views/finance/rubDisposeDetail.vue'),
          	meta:{title: '餐厨垃圾处理详情'}
          },
          {
          	path:'disposeSummary',
          	component: () => import('@/views/finance/rubDisposeSummary.vue'),
          	meta:{title: '餐厨垃圾处理合计详情'}
          },
          {
          	path:'contractList',
          	component: () => import('@/views/finance/rubContractList.vue'),
          	meta:{title: '合同管理列表'}
          },
          {
          	path:'addContract',
          	component: () => import('@/views/finance/rubAddContract.vue'),
          	meta:{title: '新增合同'}
          },
          {
          	path:'contractDetail',
          	component: () => import('@/views/finance/rubContractDetail.vue'),
          	meta:{title: '合同详情'}
          }
        ]
      },
      //餐厨油脂管理
      {
      	path:'gre',
      	component: () => import('@/views/index.vue'),
      	meta:{title: '餐厨油脂管理'},
        children:[
          {
          	path:'/',
          	component: () => import('@/views/finance/greDayList.vue')
          },
          {
          	path:'dayList',
          	component: () => import('@/views/finance/greDayList.vue'),
          	meta:{title: '餐厨油脂入库（日）列表'}
          },
          {
          	path:'dayDetail',
          	component: () => import('@/views/finance/greDayDetail.vue'),
          	meta:{title: '餐厨油脂入库（日）详情'}
          },
          {
          	path:'monthList',
          	component: () => import('@/views/finance/greMonthList.vue'),
          	meta:{title: '餐厨油脂入库（月）列表'}
          },
          {
          	path:'monthDetail',
          	component: () => import('@/views/finance/greMonthDetail.vue'),
          	meta:{title: '餐厨油脂入库（月）详情'}
          },
          {
          	path:'export',
          	component: () => import('@/views/finance/greExport.vue'),
          	meta:{title: '餐厨油脂出库'}
          },
          {
          	path:'exportDetail',
          	component: () => import('@/views/finance/greExportDetail.vue'),
          	meta:{title: '餐厨油脂出库详情'}
          },
          {
          	path:'contractList',
          	component: () => import('@/views/finance/greContractList.vue'),
          	meta:{title: '合同管理列表'}
          },
          {
          	path:'addContract',
          	component: () => import('@/views/finance/greAddContract.vue'),
          	meta:{title: '新增合同'}
          },
           {
          	path:'contractDetail',
          	component: () => import('@/views/finance/greContractDetail.vue'),
          	meta:{title: '合同详情'}
          }
        ]
      },
      //财务管理
      {
      	path:'fin',
      	component: () => import('@/views/index.vue'),
      	meta:{title: '财务管理'},
        children:[
          {
          	path:'/',
          	component: () => import('@/views/finance/finStatement.vue')
          },
          {
          	path:'statement',
          	component: () => import('@/views/finance/finStatement.vue'),
          	meta:{title: '月结款项对账表'}
          },
          {
          	path:'addStatement',
          	component: () => import('@/views/finance/finAddStatement.vue'),
          	meta:{title: '新建结款项账目'}
          },
          {
          	path:'statementDetail',
          	component: () => import('@/views/finance/finStatementDetail.vue'),
          	meta:{title: '月结款项详情'}
          },
          {
          	path:'income',
          	component: () => import('@/views/finance/finIncome.vue'),
          	meta:{title: '入账管理列表'}
          },
          {
          	path:'addIncome',
          	component: () => import('@/views/finance/finAddIncome.vue'),
          	meta:{title: '新增入账账单'}
          },
          {
          	path:'incomeDetail',
          	component: () => import('@/views/finance/finIncomeDetail.vue'),
          	meta:{title: '入账账单详情'}
          },
          {
          	path:'expenditure',
          	component: () => import('@/views/finance/finExpenditure.vue'),
          	meta:{title: '出账管理列表'}
          },
          {
          	path:'addExpenditure',
          	component: () => import('@/views/finance/finAddExpenditure.vue'),
          	meta:{title: '新增出账账单'}
          },
          {
          	path:'expenditureDetail',
          	component: () => import('@/views/finance/finExpenditureDetail.vue'),
          	meta:{title: '出账账单详情'}
          },
          {
          	path:'accounts',
          	component: () => import('@/views/finance/finAccounts.vue'),
          	meta:{title: '账目管理列表'}
          },
          {
          	path:'addAccounts',
          	component: () => import('@/views/finance/finAddAccounts.vue'),
          	meta:{title: '新建账目'}
          },
          {
          	path:'accountsDetail',
          	component: () => import('@/views/finance/finAccountsDetail.vue'),
          	meta:{title: '账目详情'}
          }
        ]
      }
  	]
  },
  //出纳端
  {
  	path:'/cashier',
  	name:'cashier',
  	component: () => import('@/views/index.vue'),
  	meta:{title: '出纳端管理系统'},
  	children: [
  		{
  			path:'accounts',
  			component: () => import('@/views/cashier/accounts.vue'),
  			meta:{title: '账目管理列表'}
  		},
      {
      	path:'accountsDetail',
      	component: () => import('@/views/cashier/accountsDetail.vue'),
      	meta:{title: '账目详情'}
      },
      {
      	path:'addAccounts',
      	component: () => import('@/views/cashier/addAccounts.vue'),
      	meta:{title: '新增账目'}
      },
      {
      	path:'expenditure',
      	component: () => import('@/views/cashier/expenditure.vue'),
      	meta:{title: '出账管理列表'}
      },
      {
      	path:'expenditureDetail',
      	component: () => import('@/views/cashier/expenditureDetail.vue'),
      	meta:{title: '出账账目详情'}
      },
      {
      	path:'addExpenditure',
      	component: () => import('@/views/cashier/addExpenditure.vue'),
      	meta:{title: '新增出账账目'}
      },
      {
      	path:'income',
      	component: () => import('@/views/cashier/income.vue'),
      	meta:{title: '入账管理列表'}
      },
      {
      	path:'addIncome',
      	component: () => import('@/views/cashier/addIncome.vue'),
      	meta:{title: '新增入账账目'}
      },
      {
      	path:'incomeDetail',
      	component: () => import('@/views/cashier/incomeDetail.vue'),
      	meta:{title: '入账账目详情'}
      },
      {
      	path:'statement',
      	component: () => import('@/views/cashier/statement.vue'),
      	meta:{title: '月结款应付账单列表'}
      },
      {
      	path:'statementDetail',
      	component: () => import('@/views/cashier/statementDetail.vue'),
      	meta:{title: '月结款应付账单详情'}
      }
  	]
  },
	//入库员模块
	{
		path:'/warehousing',
		name:'warehousing',
		component: () => import('@/views/index.vue'),
		meta:{title: '入库系统'},
		children: [
		{
			path:'stock',
			component: () => import('@/views/warehousing/stock.vue'),
			meta:{title: '出入库称重'}
		},
		{
			path:'addDayIn',
			component: () => import('@/views/warehousing/addDayIn.vue'),
			meta:{title: '新增入库记录'}
		},
    {
    	path:'addDayOut',
    	component: () => import('@/views/warehousing/addDayOut.vue'),
    	meta:{title: '新增出库记录'}
    },
		{
			path:'greDayList',
			component: () => import('@/views/warehousing/greDayList.vue'),
			meta:{title: '餐厨油脂开票'}
		},
		{
			path:'rubDayList',
			component: () => import('@/views/warehousing/rubDayList.vue'),
			meta:{title: '餐厨垃圾开票'}
		},
		{
			path:'greDayDetail',
			component: () => import('@/views/warehousing/greDayDetail.vue'),
			meta:{title: '油脂入库详情'}
		},
		{
			path:'rubDayDetail',
			component: () => import('@/views/warehousing/rubDayDetail.vue'),
			meta:{title: '垃圾入库详情'}
		},
		]
	},
  //抽样员模块
  {
  	path:'/sampler',
  	name:'sampler',
  	component: () => import('@/views/sampler.vue'),
  	meta:{title: '抽样员系统'}
  },
  //操作员模块
  {
  	path:'/operator',
  	name:'operator',
  	component: () => import('@/views/operator.vue'),
  	meta:{title: '操作员系统'}
  },
  //手机端收运记录
  {
  	path:'/records',
  	name:'records',
  	component: () => import('@/views/rubRecords.vue')
  },
	{
		path:'*',
		component: () => import('@/views/error_404.vue')
	}
]

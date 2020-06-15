const state = {
  account_id:'',//账目
  statement_id:'',//对账
  income_id:'',//入账
  expenditure_id:''//出账
}

const getters = {}

const mutations = {
  //财务管理模块
  cashier_account:(state,params) => {
  	state.account_id = params._id
  },
  cashier_statement:(state,params) => {
  	state.statement_id = params._id
  },
  cashier_income:(state,params) => {
  	state.income_id = params._id
  },
  cashier_expenditure:(state,params) => {
  	state.expenditure_id = params._id
  }
}
const actions = { }

export default {
	// namespaces:true,  //开启命名空间后，user相对独立、密闭。...mapState等方法需要定义
	state,
	getters,
	mutations,
	actions
	// modules:{xxx} //可在模块中继续添加模块
}

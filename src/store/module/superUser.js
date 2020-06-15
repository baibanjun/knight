const state = {
	now_user_id:'',
	now_role_id:'',
  now_role_name:'',
  account_id:'',//账目
  statement_id:'',//对账
  income_id:'',//入账
  expenditure_id:''//出账
}
const getters = {

}
const mutations = {
	set_user_id:(state,params) => {   //可以使用set_user_name(){}
		state.now_user_id = params.user_id
	},
	set_role_id:(state,params) => {
		state.now_role_id = params.role_id
	},
  set_role_name:(state,params) => {
  	state.now_role_name = params.role_name
  },
  //财务管理模块
  super_account:(state,params) => {
  	state.account_id = params._id
  },
  super_statement:(state,params) => {
  	state.statement_id = params._id
  },
  super_income:(state,params) => {
  	state.income_id = params._id
  },
  super_expenditure:(state,params) => {
  	state.expenditure_id = params._id
  }
}
const actions = {
	xxx_action({ commit,state,rootState,dispatch,getters,rootGetters }){
		dispatch('xxx',{}) //当前实例继续执行actions
	},
	xxx(){

	}
}

export default {
	// namespaces:true,  //开启命名空间后，user相对独立、密闭。...mapState等方法需要定义
	state,
	getters,
	mutations,
	actions
	// modules:{xxx} //可在模块中继续添加模块
}

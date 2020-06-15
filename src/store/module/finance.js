const state = {
	rub_day_id:'',//垃圾 日
	rub_month_id:'', //月
	finance_month:'',
  finance_info:{},
	rub_dispose_id:'',//处理
	rub_contract_id:'',//合同
	gre_day_id:'', //油脂  日
	gre_month_id:'',//月
	gre_export_id:'',//出库
	gre_contract_id:'',//合同
  account_id:'',//账目
  statement_id:'',//对账
  income_id:'',//入账
  expenditure_id:'',//出账
  fin_search_info:{

    rub_contract_id:'',
    rub_contract_sign:'',
    rub_contract_company_name:'',

    gre_contract_id:'',
    gre_contract_sign:'',
    gre_contract_company_name:'',
	
	gre_export_company_name:''
  }
}

const getters = {}

const mutations = {
  set_fin_search_info:(state,params) => {
    state.fin_search_info.rub_contract_id = params.rub_contract_id||'';
    state.fin_search_info.rub_contract_sign = params.rub_contract_sign||'';
    state.fin_search_info.rub_contract_company_name = params.rub_contract_company_name||'';

    state.fin_search_info.gre_contract_no = params.gre_contract_no||'';
    state.fin_search_info.gre_contract_sign = params.gre_contract_sign||'';
    state.fin_search_info.gre_contract_company_name = params.gre_contract_company_name||'';
	
    state.fin_search_info.gre_export_company_name = params.gre_export_company_name||'';
  },
  set_finance_month:(state,params) => { //修改月份
  	state.finance_month = params.month
  },
  set_finance_info:(state,params) => { //修改携带信息
  	state.finance_info = params
  },
  //餐厨垃圾模块
	finance_rub_day:(state,params) => {   //可以使用finance_user_name(){}
		state.rub_day_id = params._id
	},
  finance_rub_month:(state,params) => {
  	state.rub_month_id = params._id
  },
  finance_rub_dispose:(state,params) => {
  	state.rub_dispose_id = params._id
  },
  finance_rub_contract:(state,params) => {
  	state.rub_contract_id = params._id
  },
  //餐厨油脂模块
  finance_gre_day:(state,params) => {
  	state.gre_day_id = params._id
  },
  finance_gre_month:(state,params) => {
  	state.gre_month_id = params._id
  },
  finance_gre_export:(state,params) => {
  	state.gre_export_id = params._id
  },
  finance_gre_contract:(state,params) => {
  	state.gre_contract_id = params._id
  },
  //财务管理模块
  finance_account:(state,params) => {
  	state.account_id = params._id
  },
  finance_statement:(state,params) => {
  	state.statement_id = params._id
  },
  finance_income:(state,params) => {
  	state.income_id = params._id
  },
  finance_expenditure:(state,params) => {
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

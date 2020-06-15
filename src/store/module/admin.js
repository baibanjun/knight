const state = {
	rub_day_id:'',//垃圾 日
	rub_month_id:'', //月
  admin_month:'',
  admin_plate_number:'',
	rub_dispose_id:'',//处理
	rub_company_id:'',//单位
	rub_driver_id:'',//运输人
	rub_contract_id:'',//合同

	gre_day_id:'', //油脂  日
	gre_month_id:'',//月
	gre_export_id:'',//出库
	gre_company_id:'',//单位
	gre_summary_id:'',//汇总
	gre_contract_id:'',//合同

  state_search_info:{
    rub_company_name:'', //餐厨单位管理
    rub_company_mobile:'',
    rub_company_contacts:'',
    rub_company_driver_name:'',

    rub_driver_number:'', //车牌
    rub_driver_mobile:'',
    rub_driver_company_name:'',//公司名
    rub_driver_name:'',

    rub_contract_id:'', //编号
    rub_contract_sign:'', //签订人
    rub_contract_company_name:'',//公司名

    gre_export_company_name:'',

    gre_company_name:'', //油脂单位管理
    gre_company_mobile:'',
    gre_company_contacts:'',

    gre_contract_no:'', //编号
    gre_contract_sign:'', //签订人
    gre_contract_company_name:'',//公司名

    }
}

const getters = {}

const mutations = {
  set_admin_search_info:(state,params) => {
		state.state_search_info.rub_company_name = params.rub_company_name||'';
    state.state_search_info.rub_company_mobile = params.rub_company_mobile||'';
    state.state_search_info.rub_company_contacts = params.rub_company_contacts||'';
    state.state_search_info.rub_company_driver_name = params.rub_company_driver_name||'';

    state.state_search_info.rub_driver_number = params.rub_driver_number||'';
    state.state_search_info.rub_driver_mobile = params.rub_driver_mobile||'';
    state.state_search_info.rub_driver_company_name = params.rub_driver_company_name||'';
    state.state_search_info.rub_driver_name = params.rub_driver_name||'';

    state.state_search_info.rub_contract_id = params.rub_contract_id||'';
    state.state_search_info.rub_contract_sign = params.rub_contract_sign||'';
    state.state_search_info.rub_contract_company_name = params.rub_contract_company_name||'';

    state.state_search_info.gre_export_company_name = params.gre_export_company_name||'';

    state.state_search_info.gre_company_name = params.gre_company_name||'';
    state.state_search_info.gre_company_mobile = params.gre_company_mobile||'';
    state.state_search_info.gre_company_contacts = params.gre_company_contacts||'';

    state.state_search_info.gre_contract_no = params.gre_contract_no||'';
    state.state_search_info.gre_contract_sign = params.gre_contract_sign||'';
    state.state_search_info.gre_contract_company_name = params.gre_contract_company_name||'';
	},
  //餐厨垃圾模块
	admin_rub_day:(state,params) => {   //可以使用admin_user_name(){}
		state.rub_day_id = params._id
	},
  set_admin_month:(state,params) => { //修改月份
  	state.admin_month = params.month
  },
  set_admin_car:(state,params) => { //修改车牌
  	state.admin_plate_number = params.plate_number
  },
  admin_rub_month:(state,params) => {
  	state.rub_month_id = params._id
  },
  admin_rub_dispose:(state,params) => {
  	state.rub_dispose_id = params._id
  },
  admin_rub_company:(state,params) => {
  	state.rub_company_id = params._id
  },
  admin_rub_driver:(state,params) => {
  	state.rub_driver_id = params._id
  },
  admin_rub_contract:(state,params) => {
  	state.rub_contract_id = params._id
  },
  //餐厨油脂模块
  admin_gre_day:(state,params) => {
  	state.gre_day_id = params._id
  },
  admin_gre_month:(state,params) => {
  	state.gre_month_id = params._id
  },
  admin_gre_export:(state,params) => {
  	state.gre_export_id = params._id
  },
	admin_gre_company:(state,params) => {
		state.gre_company_id = params._id
	},
  admin_gre_summary:(state,params) => {
  	state.gre_summary_id = params._id
  },
  admin_gre_contract:(state,params) => {
  	state.gre_contract_id = params._id
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

const mutation = {
	log_out(state,params){ //登出
		state.user_name = ''
		state.is_login = false
    state.role_type = 0
		state.menu_type = 0
		state.user_id = 0
    state.is_records = false
	},
	login_success(state,params){ //登录
		state.user_name = params.user_name
		state.is_login = true
		state.role_type = params.role_type
		state.token = params.token
		state.user_id = params.user_id
		state.menu_type = params.menu_type  //右侧菜单
	},
  to_records(state,params){ //到收运记录页面
  	state.is_login = false
    state.role_type = 0
  	state.menu_type = 0
  	state.is_records = true
  },
}

export default mutation

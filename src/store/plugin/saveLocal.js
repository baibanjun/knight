export default store => {
	if(sessionStorage.state) store.replaceState(JSON.parse(sessionStorage.state))  //store实例方法replaceState,用本地存储的state实例替换初始化的state实例
	store.subscribe((mutation,state) => { //store.subscribe方法监听每次提交mutation，
		sessionStorage.state = JSON.stringify(state)
	})
}
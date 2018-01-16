var store = {
	fetch(key){	//取
		return JSON.parse(localStorage.getItem(key)) || [];
	},
	save(key,value){		//存
		//Json.stringify 转成字符串
		localStorage.setItem(key,JSON.stringify(value));
	}
}
var list= store.fetch("todoKey");

var filter = {
	all(list){
		return list;
	},
	unfinished(list){
		return list.filter(item=>{
			return !item.isChoose;
		});
	},
	finish(list){
		return list.filter(item=>{
			return item.isChoose;
		})
	},
}

var vm = new Vue({
	el:'.main',
	data:{
		list:list,
		newTodo:'',//新添加的任务
		editTodo:'',//编辑的任务
		oldTodo:'',//编辑前的任务title
		visibility:'all',
	},
	computed:{
		noChooseLength(){
			return this.list.filter(function(item){
	            return !item.isChoose
	        }).length
		},
		filterList(){
			return filter[this.visibility] ? filter[this.visibility](list) : list;
		}
	},
	watch:{
		list:{
			handler(){
				store.save("todoKey",list);
			},
			deep:true	//深层监控，对象中的isChoose改变了也可监控到，否则不能监控到已有值得改变
		}
	},
	methods:{
		//添加任务
		addTodo(){
			if(this.newTodo!=''){
				this.list.push({'title':this.newTodo,'isChoose':false});
			}
			this.newTodo='';
		},
		//删除任务
		delTodo(index){
			this.list.splice(index,1);
		},
		//双击修改任务
		deitTodo(todo){
			this.editTodo = todo;
			this.oldTodo = todo.title;
		},
		//确定编辑
		suerEdit(todo){
			this.editTodo='';
		},
		//取消编辑
		cancelTodo(todo){
			todo.title = this.oldTodo;
			this.oldTodo='';
			this.editTodo='';
		}
		
	},
	//自定义指令
	directives:{
		//自定义方法获取input焦点
		"focus":{
			//el：绑定的元素，bingding：为一个对象，判断值
			update(el,binding){
				if(binding.value){
					el.focus();
				}
			}
		}
	},
});

function watchHashChange(){
	var hash = window.location.hash.slice(1);
	vm.visibility = hash;
}
watchHashChange();
window.addEventListener("hashchange",watchHashChange);
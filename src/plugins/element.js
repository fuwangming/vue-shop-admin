import Vue from 'vue'
import { Tabs,TabPane,Alert,Cascader,Tree,Tag,MessageBox,Dialog,Pagination,Tooltip,Switch,TableColumn,Table,Col,Row,Option,Select,Card,BreadcrumbItem,Breadcrumb,Button,Form, FormItem,Input,Message,Container,Header,Aside,Main,Menu,Submenu,MenuItem } from 'element-ui'



Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(Tree)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Col)
Vue.use(Row)
Vue.use(Option)
Vue.use(Select)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

webpackJsonp([3],{17:function(t,e,i){"use strict";function n(t){i(83)}Object.defineProperty(e,"__esModule",{value:!0});var o=i(15),s=i.n(o),r=i(55),a=i(14),c={name:"TheLogin",props:{show:{type:Boolean}},data:function(){return{username:"",password:"",submiting:!1,usernameValid:!1,passwordValid:!1}},components:{BaseInput:r.a},computed:{action:function(){return this.$store.state.loginAction},isLogin:function(){return"login"===this.action},actionName:function(){return this.isLogin?"登录":"注册"},editable:function(){return this.username&&this.password}},methods:{close:function(){this.initForm(),this.$store.commit("hideLogin")},submit:function(){if(!this.submiting)return this.usernameValid&&this.passwordValid?void(this.isLogin?this.loginSubmit():this.signup()):this.$message({message:"请输入正确的用户名或者密码",type:"warn"})},loginSubmit:function(){var t=this;this.submiting=!0,Object(a.l)({username:this.username,password:this.password}).then(function(e){t.username="",t.password="";var i=e.source,n=i._id,o=i.username,r=i.userPic,a=i.token;t.$store.commit("updateUser",{id:n,username:o,userPic:r}),t.$store.commit("addNav",{name:"我的",route:"/blog/user/"+n,icon:"iconfont icon-touxiang"}),s.a.set("blogToken",a),s.a.set("blogUserId",n),t.submiting=!1,t.close()}).catch(function(e){t.submiting=!1})},signup:function(){var t=this;this.submiting=!0,Object(a.p)({username:this.username,password:this.password}).then(function(e){t.$store.commit("changeLoginAction","login"),t.password="",t.submiting=!1}).catch(function(e){t.submiting=!1})},initForm:function(){this.username="",this.password="",this.$refs.usernameInput.clearError(),this.$refs.passwordInput.clearError()},changeAction:function(t){this.$store.commit("changeLoginAction",t),this.initForm()}}},l=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("transition",{attrs:{name:"fade"}},[i("section",{directives:[{name:"show",rawName:"v-show",value:t.show,expression:"show"}],staticClass:"the-login"},[i("div",{staticClass:"the-login-main"},[i("h2",{staticClass:"the-login-title"},[t._v(t._s(t.actionName))]),i("i",{staticClass:"iconfont icon-close",on:{click:t.close}}),i("form",{staticClass:"the-login-form"},[i("BaseInput",{ref:"usernameInput",staticClass:"the-login-form-item",attrs:{maxlength:18,"show-error":!t.isLogin,validators:[{reg:/^[\u4e00-\u9fa5\w]+$/,errText:"请输入正确的用户名"}],placeholder:"请输入用户名"},on:{validation:function(e){return t.usernameValid=!e}},model:{value:t.username,callback:function(e){t.username=e},expression:"username"}},[t.isLogin?t._e():i("div",{staticClass:"base-input__info"},[i("p",[i("i",{staticClass:"iconfont icon-warn"}),t._v("只能使用中文、英文、数字、下划线。")]),i("p",[i("i",{staticClass:"iconfont icon-warn"}),t._v("长度小于18。")])])]),i("BaseInput",{ref:"passwordInput",staticClass:"the-login-form-item",attrs:{minlength:6,maxlength:18,"show-error":!t.isLogin,validators:[{reg:/^([A-Z]|[a-z]|[0-9]){6,18}$/,errText:"请输入正确的密码"}],type:"password",placeholder:"请输入密码"},on:{validation:function(e){return t.passwordValid=!e}},model:{value:t.password,callback:function(e){t.password=e},expression:"password"}},[t.isLogin?t._e():i("div",{staticClass:"base-input__info"},[i("p",[i("i",{staticClass:"iconfont icon-warn"}),t._v("包含英文、数字。")]),i("p",[i("i",{staticClass:"iconfont icon-warn"}),t._v("长度在6-18。")])])]),i("button",{class:{"the-login-form-item":!0,"is-disabled":!t.editable},attrs:{disabled:!t.editable},on:{click:function(e){return e.preventDefault(),t.submit(e)}}},[i("i",{directives:[{name:"show",rawName:"v-show",value:t.submiting,expression:"submiting"}],staticClass:"iconfont icon-loading-out"}),t._v(t._s(t.actionName))])],1),i("div",{staticClass:"the-login-help"},["login"===t.action?i("span",{on:{click:function(e){return t.changeAction("signup")}}},[t._v("没有账号？注册一个")]):t._e(),"signup"===t.action?i("span",{on:{click:function(e){return t.changeAction("login")}}},[t._v("已有账号？登录")]):t._e()])])])])},u=[],h={render:l,staticRenderFns:u},m=h,d=i(3),p=n,g=d(c,m,!1,p,null,null);e.default=g.exports},55:function(t,e,i){"use strict";var n={name:"BaseInput",props:{showError:{type:Boolean,default:!0},type:{type:String,default:"text"},value:{type:[Number,String]},placeholder:{type:String},minlength:{type:Number},maxlength:{type:Number},validators:{validator:function(t){if(!Array.isArray(t))return!1;var e=!0;return t.forEach(function(t){Object.keys(t).forEach(function(t){["reg","errText","equalTo"].includes(t)||(e=!1)})}),e}}},data:function(){return{error:""}},methods:{handleChange:function(t){this.validators&&(this.error=this.validate(t),this.$emit("validation",this.error))},validate:function(t){var e="";return this.validators.some(function(i){var n=i.reg,o=i.errText,s=i.equalTo;return n&&!n.test(t)?(e=o,!0):!(!s||s===t)&&(e=o,!0)}),e},clearInput:function(){this.$emit("input",""),this.handleChange("")},clearError:function(){this.error=""}}},o=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"base-input"},[i("div",{staticClass:"base-input__inner"},[i("input",{attrs:{type:t.type,placeholder:t.placeholder,minlength:t.minlength,maxlength:t.maxlength,autocomplete:""},domProps:{value:t.value},on:{input:function(e){return t.$emit("input",e.target.value)},change:function(e){return t.handleChange(e.target.value)}}}),i("i",{directives:[{name:"show",rawName:"v-show",value:!!t.value,expression:"!!value"}],staticClass:"base-input__clear iconfont icon-error",on:{click:t.clearInput}})]),t._t("default"),i("transition",{attrs:{name:"zoom-in"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:t.showError&&t.error,expression:"showError && error"}],staticClass:"base-input__info--error"},[i("i",{staticClass:"iconfont icon-error"}),t._v(t._s(t.error)+"\n    ")])])],2)},s=[],r={render:o,staticRenderFns:s},a=r,c=i(3),l=c(n,a,!1,null,null,null);e.a=l.exports},83:function(t,e,i){var n=i(84);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);i(54)("55dd854b",n,!0,{})},84:function(t,e,i){e=t.exports=i(53)(!1),e.push([t.i,".the-login{position:fixed;top:0;left:0;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%;background-color:rgba(0,0,0,.2);z-index:2000}.the-login-main{position:relative;width:80%;height:60%;min-height:400px;border-radius:4px;background-color:#fff;-webkit-box-shadow:0 0 12px rgba(4,4,4,.18);box-shadow:0 0 12px rgba(4,4,4,.18)}.the-login-title{width:100%;font-size:1.2em;font-weight:700;padding:1em}.the-login-main>.icon-close{position:absolute;right:1em;top:1em;font-size:1.2em;color:#8c8c8c;cursor:pointer;-webkit-transition:color .3s;-o-transition:color .3s;transition:color .3s}.icon-close:hover{color:#212121}.the-login-form{padding:1em 2em}.the-login-form-item{margin-bottom:1.2em;width:100%}.the-login-form button{color:#fff;background-color:#00bcd4;border-color:#00bcd4}.the-login-help{padding:0 2.5em;font-size:.8em;color:#00bcd4}.the-login-help span{cursor:pointer}@media screen and (min-width:425px){.the-login-main{width:340px;height:400px}}button.the-login-form-item{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center}",""])}});
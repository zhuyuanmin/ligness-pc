import{v as X,r as g,b as D,c as F,H as v,d as l,b6 as k,J as U,C as T,u as j,a as E,o as $,f as i,h as p,b2 as A,b3 as L,j as q}from"./index.9c60be82.js";/* empty css                */import{c as O,E as h}from"./el-form-item.a274136f.js";import{r as J,d as M,b as R}from"./api.8ae4beb9.js";import{g as V,ai as W,aj as z,E as N}from"./el-button.6c306299.js";import{_ as B}from"./plugin-vue_export-helper.21dcd24c.js";var P="/assets/login-bg.f3c48848.png";const H={class:"drag-verify"},G={id:"dragRef"},Q={class:"text"},Y=X({__name:"DragVerify",props:{value:{type:Boolean,default:!1},successIcon:{type:String,default:"finish-verify"},successText:{type:String,default:"\u9A8C\u8BC1\u6210\u529F"},startIcon:{type:String,default:"right-arrow"},startText:{type:String,default:"\u62D6\u52A8\u6ED1\u5757\u5230\u6700\u53F3\u8FB9"}},emits:["update:value"],setup(e,{emit:f}){const a=g(!1),u=g(!1),o="ontouchstart"in document.documentElement,r=o?"touchmove":"mousemove",s=o?"touchend":"mouseup",d=n=>{let t=0;const c=40,m=document.querySelector(".drag-verify .block"),w=n.clientX||n.touches[0].pageX,x=m.offsetWidth-c;if(a.value)return!1;const S=_=>{t=(_.clientX||_.touches[0].pageX)-w,t<=0&&(t=0),t>=x-20&&(t=x),m.style.transition=".1s all",m.style.transform=`translateX(${t}px)`},b=()=>{if(t!==x){u.value=!0;const _=document.querySelector("#dragRef"),I=document.querySelector(".drag-verify");_.style.background="red",I.style.borderColor="red",setTimeout(()=>{u.value=!1,_.style.background="#fff",I.style.borderColor="#D8DAE1",m.style.transition=".5s all",m.style.transform="translateX(0)"},800)}else a.value=!0,f("update:value",a.value);document.removeEventListener(r,S),document.removeEventListener(s,b)};document.addEventListener(r,S),document.addEventListener(s,b)};return(n,t)=>(D(),F("div",H,[v("div",{class:T(["range",a.value?"success":""])},[v("div",{class:"block",onMousedown:d,onTouchstart:d},[v("span",G,[l(k,{iconClass:a.value?e.successIcon:u.value?"error-verify":e.startIcon},null,8,["iconClass"])])],32),v("span",Q,U(a.value?e.successText:e.startText),1)],2)]))}});var Z=B(Y,[["__scopeId","data-v-3ed0ca0b"]]);const K=async e=>await J({url:M.login,method:"post",data:e});/*! js-cookie v3.0.1 | MIT */function y(e){for(var f=1;f<arguments.length;f++){var a=arguments[f];for(var u in a)e[u]=a[u]}return e}var ee={read:function(e){return e[0]==='"'&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}};function C(e,f){function a(o,r,s){if(typeof document!="undefined"){s=y({},f,s),typeof s.expires=="number"&&(s.expires=new Date(Date.now()+s.expires*864e5)),s.expires&&(s.expires=s.expires.toUTCString()),o=encodeURIComponent(o).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var d="";for(var n in s)!s[n]||(d+="; "+n,s[n]!==!0&&(d+="="+s[n].split(";")[0]));return document.cookie=o+"="+e.write(r,o)+d}}function u(o){if(!(typeof document=="undefined"||arguments.length&&!o)){for(var r=document.cookie?document.cookie.split("; "):[],s={},d=0;d<r.length;d++){var n=r[d].split("="),t=n.slice(1).join("=");try{var c=decodeURIComponent(n[0]);if(s[c]=e.read(t,c),o===c)break}catch{}}return o?s[o]:s}}return Object.create({set:a,get:u,remove:function(o,r){a(o,"",y({},r,{expires:-1}))},withAttributes:function(o){return C(this.converter,y({},this.attributes,o))},withConverter:function(o){return C(y({},this.converter,o),this.attributes)}},{attributes:{value:Object.freeze(f)},converter:{value:Object.freeze(e)}})}var te=C(ee,{path:"/"});const oe=e=>(A("data-v-2cc2d528"),e=e(),L(),e),se={class:"container"},ne={class:"left-bg"},ae=["src"],re={class:"right-login-info"},ce={class:"box"},le=oe(()=>v("div",{class:"header"},"\u767B\u5F55",-1)),ie={class:"content"},ue=q("\u767B\u5F55"),de={__name:"Login",setup(e){const f=g(),a=g(!1),u=g(!1),o=j(),r=E({account:"",password:""}),s=E({account:[{required:!0,message:"\u8BF7\u8F93\u5165\u7528\u6237\u540D",trigger:["blur","change"]}],password:[{required:!0,message:"\u8BF7\u8F93\u5165\u5BC6\u7801",trigger:["blur","change"]}]});$(()=>{const n=window.localStorage.getItem("userInfo"),{token:t}=n?JSON.parse(n):{};t&&o.replace("/")});const d=async n=>{!n||await n.validate(t=>{t&&(a.value=!0,K({staffAccount:r.account,staffPwd:r.password}).then(c=>{const m=window.atob(te.get(c.staffId)),{ligness_token:w}=JSON.parse(m)[c.staffId];window.localStorage.setItem("userInfo",JSON.stringify({...c,token:w})),o.replace("/")}).finally(()=>{a.value=!1}))})};return(n,t)=>(D(),F("div",se,[v("div",ne,[v("img",{src:i(P),alt:"",srcset:""},null,8,ae)]),v("div",re,[v("div",ce,[le,l(i(O),{class:"form",model:r,ref_key:"ruleFormRef",ref:f,rules:s},{default:p(()=>[l(i(h),{prop:"account"},{default:p(()=>[l(i(R),{class:"input-class",modelValue:r.account,"onUpdate:modelValue":t[0]||(t[0]=c=>r.account=c),autocomplete:"on",clearable:"",placeholder:"\u7528\u6237\u540D"},{prefix:p(()=>[l(i(V),{class:"el-input__icon"},{default:p(()=>[l(i(W))]),_:1})]),_:1},8,["modelValue"])]),_:1}),l(i(h),{prop:"password"},{default:p(()=>[l(i(R),{class:"input-class",type:"password",modelValue:r.password,"onUpdate:modelValue":t[1]||(t[1]=c=>r.password=c),"show-password":"",placeholder:"\u5BC6\u7801"},{prefix:p(()=>[l(i(V),{class:"el-input__icon"},{default:p(()=>[l(i(z))]),_:1})]),_:1},8,["modelValue"])]),_:1}),l(i(h),null,{default:p(()=>[v("div",ie,[l(Z,{value:u.value,"onUpdate:value":t[2]||(t[2]=c=>u.value=c)},null,8,["value"])])]),_:1}),l(i(h),null,{default:p(()=>[l(i(N),{type:"primary",class:"submit-btn",onClick:t[3]||(t[3]=c=>d(f.value)),loading:a.value,disabled:!u.value||a.value},{default:p(()=>[ue]),_:1},8,["loading","disabled"])]),_:1})]),_:1},8,["model","rules"])])])]))}};var ye=B(de,[["__scopeId","data-v-2cc2d528"]]);export{ye as default};
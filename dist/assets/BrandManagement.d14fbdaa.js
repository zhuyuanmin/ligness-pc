import{a as C,r as _,u as E,o as w,w as L,b as t,c as n,F as f,d as o,H as i,L as M,g as R,k as I,h as u,J as N,f as c,i as h,j as g}from"./index.9c60be82.js";import{S as P}from"./SearchComp.35c94b3a.js";import{E as $}from"./el-card.fa11a4e5.js";import{E as D}from"./el-divider.096cb25f.js";import{E as v}from"./el-button.6c306299.js";import{E as F,a as S}from"./api.8ae4beb9.js";import{g as T,d as z}from"./brand.5e252246.js";import{_ as V}from"./plugin-vue_export-helper.21dcd24c.js";import"./el-form-item.a274136f.js";import"./el-checkbox.2ad9bde9.js";import"./el-select.4e33594a.js";import"./el-popper.3ccaac71.js";/* empty css                *//* empty css                       */const j={class:"container"},H={class:"brand-list"},J={class:"top"},q=["src"],A={class:"btn-list"},G=g("\u7F16\u8F91"),K=g("\u5220\u9664"),O={key:1,class:"empty-data"},Q={__name:"BrandManagement",setup(U){const y=C([{type:"input",label:"\u54C1\u724C\u540D\u79F0",placeholder:"\u8BF7\u8F93\u5165\u54C1\u724C\u540D\u79F0",field:"brandName"},{type:"btnList",children:[{text:"\u67E5\u8BE2",type:"submit",onClick:e=>{a({...e})}},{text:"\u91CD\u7F6E",type:"reset",onClick:()=>{a({})}},{text:"\u65B0\u589E\u54C1\u724C",style:"primary",onClick:()=>p()}]}]),d=_([]),l=E(),b=l.currentRoute.value,m=_(b),a=e=>{T(e).then(s=>{d.value=s})};w(()=>{m.value.fullPath==="/brand-management"&&a({})}),L(()=>l.currentRoute.value,e=>{m.value=e,e.fullPath==="/brand-management"&&a({})});const p=(e,s)=>{e?l.push(`/brand-management/detail/${e.brandId}?type=${s}`):l.push("/brand-management/detail")},k=e=>{F.confirm("\u6B64\u64CD\u4F5C\u5C06\u6C38\u4E45\u5220\u9664\u8BE5\u9879\uFF0C\u662F\u5426\u7EE7\u7EED\uFF1F","\u63D0\u793A",{cancelButtonText:"\u53D6\u6D88",confirmButtonText:"\u786E\u5B9A",draggable:!0,type:"warning"}).then(()=>{z({brandId:e.brandId}).then(s=>{S.success("\u64CD\u4F5C\u6210\u529F\uFF01"),a({})})},()=>{})};return(e,s)=>{const x=I("router-view");return t(),n("div",j,[m.value.fullPath==="/brand-management"?(t(),n(f,{key:0},[o(P,{formItemList:y},null,8,["formItemList"]),i("ul",H,[d.value.length>0?(t(!0),n(f,{key:0},M(d.value,r=>(t(),n("li",{class:"card",key:r.id},[o(c($),null,{default:u(()=>[i("div",J,[i("img",{src:r.imgPath,alt:"\u56FE\u7247",srcset:""},null,8,q)]),i("p",null,N(r.brandName),1),o(c(D)),i("div",A,[o(c(v),{text:"",type:"primary",size:"small",onClick:h(B=>p(r,"edit"),["prevent"])},{default:u(()=>[G]),_:2},1032,["onClick"]),o(c(v),{text:"",type:"danger",size:"small",onClick:h(B=>k(r),["prevent"])},{default:u(()=>[K]),_:2},1032,["onClick"])])]),_:2},1024)]))),128)):(t(),n("div",O,"\u6682\u65E0\u6570\u636E"))])],64)):(t(),R(x,{key:1}))])}}};var de=V(Q,[["__scopeId","data-v-43f399ae"]]);export{de as default};

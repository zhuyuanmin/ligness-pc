import{r as f,o as D,b as v,c as E,e as C,f as a,g as T,h as _,d as s,H as w,J as A}from"./index.9c60be82.js";import{E as l,a as B}from"./el-table-column.5c3598bd.js";import"./el-checkbox.2ad9bde9.js";import"./el-tooltip.586473e3.js";import"./el-popper.3ccaac71.js";import{E as I}from"./el-loading.55964568.js";import{r as L,d as k}from"./api.8ae4beb9.js";import{_ as S}from"./plugin-vue_export-helper.21dcd24c.js";import"./el-button.6c306299.js";const x=async m=>await L({url:k.device.analysis,method:"post",data:m});const M={class:"container"},V={__name:"DeviceAnalysis",setup(m){const N=I.directive,u=f(!1),p=f([{deviceTypeName:"\u6B27\u6D32\u4E4B\u661F:\u65F6\u5C1A\u5851\u5F62\u5927\u5E08",deviceNo:"68",deviceCount:101,online:0,offline:101,fault:0},{deviceTypeName:"\u6B27\u6D32\u4E4B\u661F:\u751F\u547D\u80FD\u91CF\u6297\u8870\u96D5\u5851\u5927\u5E08",deviceNo:"69",deviceCount:52,online:1,offline:51,fault:0},{deviceTypeName:"\u6B27\u6D32\u4E4B\u661F:\u751F\u547D\u80FD\u91CF\u6297\u8870\u96D5\u5851\u5927\u5E08plus",deviceNo:"80",deviceCount:29,online:1,offline:28,fault:0},{deviceTypeName:"MEI XIU SI",deviceNo:"81",deviceCount:0,online:0,offline:0,fault:0}]),y=i=>{const{columns:r,data:t}=i,n=[];return r.forEach((h,o)=>{if(o===0){n[o]="\u5408\u8BA1";return}let c=[];o===4?c=t.map(e=>Number(e.deviceCount)):c=t.map(e=>Number(e[h.property])),c.every(e=>Number.isNaN(e))?n[o]="N/A":n[o]=c.reduce((e,d)=>{const g=Number(d);return Number.isNaN(g)?e:e+d},0)}),n},b=i=>{u.value=!0,x(i).then(r=>{const{pageList:t}=r||{};p.value=t}).finally(()=>{u.value=!1})};return D(()=>{b({})}),(i,r)=>(v(),E("div",M,[C((v(),T(a(B),{data:p.value,"show-summary":"","summary-method":y,"max-height":"400",class:"table-class"},{default:_(()=>[s(a(l),{prop:"deviceTypeName",label:"\u8BBE\u5907\u578B\u53F7"}),s(a(l),{prop:"online",label:"\u5728\u7EBF\u8BBE\u5907"}),s(a(l),{prop:"offline",label:"\u79BB\u7EBF\u8BBE\u5907"}),s(a(l),{prop:"fault",label:"\u5F02\u5E38\u8BBE\u5907"}),s(a(l),{prop:"total",label:"\u8BBE\u5907\u603B\u6570",width:"150"},{default:_(t=>[w("span",null,A(t.row.deviceNum),1)]),_:1})]),_:1},8,["data"])),[[a(N),u.value]])]))}};var K=S(V,[["__scopeId","data-v-74cfa6ac"]]);export{K as default};
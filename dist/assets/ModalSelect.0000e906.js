import{r as p,a as M,w as C,b as x,g as z,h as n,H as v,d as r,f as l,P as E,j as S,y as k}from"./index.9c60be82.js";import{E as d,a as N}from"./el-table-column.5c3598bd.js";import"./el-checkbox.2ad9bde9.js";import"./el-tooltip.586473e3.js";import"./el-popper.3ccaac71.js";import{E as h}from"./el-button.6c306299.js";import{E as P}from"./el-dialog.42e60ec1.js";import"./api.8ae4beb9.js";import{E as T}from"./el-pagination.8641f62f.js";import"./el-select.4e33594a.js";import{_ as V}from"./plugin-vue_export-helper.21dcd24c.js";const B={class:"content"},I={class:"dialog-footer"},L=S("\u53D6\u6D88"),R=S("\u786E\u5B9A"),U={__name:"ModalSelect",props:{showModal:{type:Boolean,default:!1},getStoreList:{type:Function},value:{type:[String,Array],default:""}},emits:["update:showModal"],setup(c,{emit:u}){const i=c,t=p(),m=M([{storeId:"213423",storeName:"S3245234"},{storeId:"213453",storeName:"S7995234"}]),f=p(1),g=p(10);let o=[];const _=(a,e)=>{!t.value||(a.length>1?(t.value.clearSelection(),t.value.toggleRowSelection(e,!0),o=[],o.push(e)):a.length?o.push(e):o=[])};C(()=>i.showModal,()=>{k(()=>{if(i.value){const a=m.find(e=>e.storeId===i.value[0].value);a&&t.value&&(t.value.clearSelection(),t.value.toggleRowSelection(a,!0),o=[],o.push(a))}else t.value&&(t.value.clearSelection(),o=[])})});const y=()=>{u("update:showModal",!1),i.getStoreList(o)},w=a=>{},b=a=>{};return(a,e)=>(x(),z(l(P),{modelValue:c.showModal,"onUpdate:modelValue":e[4]||(e[4]=s=>E(showModal)?showModal.value=s:null),title:"\u9009\u62E9\u95E8\u5E97",width:"50%","custom-class":"modal-class-store",onClose:e[5]||(e[5]=s=>u("update:showModal",!1)),"append-to-body":"",draggable:""},{footer:n(()=>[v("span",I,[r(l(h),{onClick:e[2]||(e[2]=s=>u("update:showModal",!1))},{default:n(()=>[L]),_:1}),r(l(h),{type:"primary",onClick:e[3]||(e[3]=s=>y())},{default:n(()=>[R]),_:1})])]),default:n(()=>[v("div",B,[r(l(N),{data:m,"max-height":"400",class:"table-class",ref_key:"myTable",ref:t,onSelect:_},{default:n(()=>[r(l(d),{type:"selection",width:"55"}),r(l(d),{type:"index",label:"\u5E8F\u53F7",width:"100"}),r(l(d),{prop:"storeId",label:"\u95E8\u5E97\u7F16\u7801"}),r(l(d),{prop:"storeName",label:"\u95E8\u5E97\u540D\u79F0"})]),_:1},8,["data"]),r(l(T),{class:"class-pagination",currentPage:f.value,"onUpdate:currentPage":e[0]||(e[0]=s=>f.value=s),"page-size":g.value,"onUpdate:page-size":e[1]||(e[1]=s=>g.value=s),"page-sizes":[5,10,15,20],layout:"total, sizes, prev, pager, next, jumper",total:100,small:"",onSizeChange:b,onCurrentChange:w},null,8,["currentPage","page-size"])])]),_:1},8,["modelValue"]))}};var Q=V(U,[["__scopeId","data-v-434776db"]]);export{Q as M};

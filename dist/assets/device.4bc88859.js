import{r as t,d as a}from"./api.8ae4beb9.js";const d=async e=>await t({url:a.device.list,method:"post",data:e}),i=async e=>await t({url:a.device.add,method:"post",data:e}),c=async e=>await t({url:a.device.edit,method:"post",data:e}),r=async e=>await t({url:a.device.delete,method:"post",data:e}),o=async e=>await t({url:a.device.view,method:"post",data:e}),n=async e=>await t({url:a.device.usage,method:"post",data:e});export{i as a,r as d,c as e,d as g,n as u,o as v};
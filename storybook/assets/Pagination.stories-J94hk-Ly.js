import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./Icon-CLxcS8MO.js";var r;function i(){return(i=e((()=>{t(),r=({total:e=5,current:t=1})=>{let r=document.createElement(`nav`);r.className=`pagination`,r.setAttribute(`aria-label`,`Страницы`);let i=document.createElement(`ul`);i.className=`pagination__list`;let a=(e,n,r,i=!1)=>{let a=document.createElement(`li`),o=document.createElement(`a`);return o.className=`pagination__link`,o.href=`#page-${n}`,r&&o.setAttribute(`aria-label`,r),n===t&&!r&&o.setAttribute(`aria-current`,`page`),i&&(o.setAttribute(`role`,`link`),o.setAttribute(`aria-disabled`,`true`),o.removeAttribute(`href`)),o.append(e),a.append(o),a};i.append(a(n({name:`chevron-left`,size:20}),t-1,`Предыдущая страница`,t===1));for(let t=1;t<=e;t++)i.append(a(String(t),t));return i.append(a(n({name:`chevron-right`,size:20}),t+1,`Следующая страница`,t===e)),r.append(i),r}})))()}var a,o,s,c,l;function u(){return(u=e((()=>{i(),a={title:`Molecules/Pagination`,tags:[`autodocs`],argTypes:{total:{control:{type:`number`,min:1,max:10}},current:{control:{type:`number`,min:1,max:10}}},render:e=>r(e)},o={args:{total:5,current:1}},s={args:{total:5,current:3}},c={args:{total:5,current:5}},l=[`FirstPage`,`Middle`,`LastPage`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    total: 5,
    current: 1
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    total: 5,
    current: 3
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    total: 5,
    current: 5
  }
}`,...c.parameters?.docs?.source}}}})))()}u();export{o as FirstPage,c as LastPage,s as Middle,l as __namedExportsOrder,a as default};
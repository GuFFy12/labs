import{n as e}from"./rolldown-runtime-DkW27tQK.js";var t;function n(){return(n=e((()=>{t=({size:e=`md`,label:t=`Загрузка`})=>{let n=document.createElement(`span`);return n.className=`spinner spinner--${e}`,n.setAttribute(`role`,`status`),n.setAttribute(`aria-label`,t),n}})))()}var r,i,a,o;function s(){return(s=e((()=>{n(),r={title:`Atoms/Spinner`,tags:[`autodocs`],argTypes:{size:{control:{type:`select`},options:[`sm`,`md`,`lg`]}},render:e=>t(e)},i={args:{size:`md`}},a={render:()=>{let e=document.createElement(`div`);return e.style.cssText=`display: flex; gap: 24px; align-items: center;`,[`sm`,`md`,`lg`].forEach(n=>e.append(t({size:n}))),e}},o=[`Default`,`Sizes`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'md'
  }
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display: flex; gap: 24px; align-items: center;';
    ['sm', 'md', 'lg'].forEach(size => wrap.append(createSpinner({
      size
    })));
    return wrap;
  }
}`,...a.parameters?.docs?.source}}}})))()}s();export{i as Default,a as Sizes,o as __namedExportsOrder,r as default};
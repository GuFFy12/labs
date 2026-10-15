import{n as e}from"./rolldown-runtime-DkW27tQK.js";var t;function n(){return(n=e((()=>{t=({items:e=[]})=>{let t=document.createElement(`nav`);t.className=`breadcrumbs`,t.setAttribute(`aria-label`,`Хлебные крошки`);let n=document.createElement(`ol`);return n.className=`breadcrumbs__list`,e.forEach((t,r)=>{let i=document.createElement(`li`);if(i.className=`breadcrumbs__item`,r===e.length-1)i.setAttribute(`aria-current`,`page`),i.textContent=t.label;else{let e=document.createElement(`a`);e.className=`breadcrumbs__link`,e.href=t.href||`#`,e.textContent=t.label,i.append(e)}n.append(i)}),t.append(n),t}})))()}var r,i,a,o;function s(){return(s=e((()=>{n(),r={title:`Molecules/Breadcrumbs`,tags:[`autodocs`],render:e=>t(e)},i={args:{items:[{label:`Главная`,href:`#`},{label:`Курсы`}]}},a={args:{items:[{label:`Главная`,href:`#`},{label:`Курсы`,href:`#`},{label:`Frontend-разработчик`}]}},o=[`TwoLevels`,`ThreeLevels`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      label: 'Главная',
      href: '#'
    }, {
      label: 'Курсы'
    }]
  }
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      label: 'Главная',
      href: '#'
    }, {
      label: 'Курсы',
      href: '#'
    }, {
      label: 'Frontend-разработчик'
    }]
  }
}`,...a.parameters?.docs?.source}}}})))()}s();export{a as ThreeLevels,i as TwoLevels,o as __namedExportsOrder,r as default};
import{n as e}from"./rolldown-runtime-DkW27tQK.js";var t,n;function r(){return(r=e((()=>{t=0,n=({trigger:e=`Наведите`,text:n=`Подсказка`,placement:r=`top`})=>{let i=`tooltip-${++t}`,a=document.createElement(`span`);return a.className=`tooltip tooltip--${r}`,a.innerHTML=`
        <button type="button" class="tooltip__trigger" aria-describedby="${i}">${e}</button>
        <span class="tooltip__bubble" role="tooltip" id="${i}">${n}</span>
    `,a.addEventListener(`keydown`,e=>{e.key===`Escape`&&a.classList.add(`tooltip--dismissed`)}),a.addEventListener(`mouseleave`,()=>a.classList.remove(`tooltip--dismissed`)),a.addEventListener(`focusout`,()=>a.classList.remove(`tooltip--dismissed`)),a}})))()}var i,a,o,s;function c(){return(c=e((()=>{r(),i={title:`Molecules/Tooltip`,tags:[`autodocs`],argTypes:{placement:{control:{type:`select`},options:[`top`,`bottom`]}},decorators:[e=>{let t=document.createElement(`div`);return t.style.padding=`64px 32px`,t.append(e()),t}],render:e=>n(e)},a={args:{trigger:`Что такое наставник?`,text:`Разработчик, который проверяет задания и отвечает в чате`,placement:`top`}},o={args:{trigger:`Рассрочка`,text:`Оплата частями без переплаты на 12 месяцев`,placement:`bottom`}},s=[`Top`,`Bottom`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    trigger: 'Что такое наставник?',
    text: 'Разработчик, который проверяет задания и отвечает в чате',
    placement: 'top'
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    trigger: 'Рассрочка',
    text: 'Оплата частями без переплаты на 12 месяцев',
    placement: 'bottom'
  }
}`,...o.parameters?.docs?.source}}}})))()}c();export{o as Bottom,a as Top,s as __namedExportsOrder,i as default};
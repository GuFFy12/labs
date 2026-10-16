import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./Button-Bf5YDKvu.js";var r,i,a;function o(){return(o=e((()=>{t(),r=0,i=({title:e=`Заголовок`,text:t=``,confirmLabel:i=`Подтвердить`,cancelLabel:a=`Отмена`,variant:o=`primary`})=>{let s=`modal-${++r}`,c=document.createElement(`dialog`);c.className=`modal`,c.setAttribute(`aria-labelledby`,`${s}-title`),c.innerHTML=`
        <h2 class="modal__title" id="${s}-title">${e}</h2>
        <p class="modal__text">${t}</p>
        <div class="modal__actions"></div>
    `;let l=n({variant:`ghost`,label:a}),u=n({variant:o,label:i});return l.addEventListener(`click`,()=>c.close(`cancel`)),u.addEventListener(`click`,()=>c.close(`confirm`)),c.querySelector(`.modal__actions`).append(l,u),c.addEventListener(`click`,e=>{e.target===c&&c.close(`cancel`)}),c},a=e=>{let t=document.createElement(`div`),r=i(e),a=n({variant:`secondary`,label:`Открыть окно`});return a.addEventListener(`click`,()=>r.showModal()),t.append(a,r),t}})))()}var s,c,l,u,d,f;function p(){return(p=e((()=>{o(),s={title:`Organisms/Modal`,tags:[`autodocs`],argTypes:{variant:{control:{type:`select`},options:[`primary`,`danger`]}},render:e=>a(e)},c=e=>{let t=i(e);return t.classList.add(`modal--static`),t.setAttribute(`open`,``),t},l={args:{title:`Записаться на курс?`,text:`Менеджер свяжется с вами в течение дня и расскажет о старте потока.`,confirmLabel:`Записаться`}},u={args:{title:`Записаться на курс?`,text:`Менеджер свяжется с вами в течение дня и расскажет о старте потока.`,confirmLabel:`Записаться`},render:c},d={args:{title:`Отменить запись?`,text:`Место в потоке освободится, вернуть его можно будет только при наличии свободных мест.`,confirmLabel:`Отменить запись`,cancelLabel:`Оставить`,variant:`danger`},render:c},f=[`Interactive`,`Confirm`,`Danger`],l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Записаться на курс?',
    text: 'Менеджер свяжется с вами в течение дня и расскажет о старте потока.',
    confirmLabel: 'Записаться'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Записаться на курс?',
    text: 'Менеджер свяжется с вами в течение дня и расскажет о старте потока.',
    confirmLabel: 'Записаться'
  },
  render: staticModal
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Отменить запись?',
    text: 'Место в потоке освободится, вернуть его можно будет только при наличии свободных мест.',
    confirmLabel: 'Отменить запись',
    cancelLabel: 'Оставить',
    variant: 'danger'
  },
  render: staticModal
}`,...d.parameters?.docs?.source}}}})))()}p();export{u as Confirm,d as Danger,l as Interactive,f as __namedExportsOrder,s as default};
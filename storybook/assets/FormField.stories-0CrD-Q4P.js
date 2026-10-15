import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./FormField-I9XW_RxS.js";var r,i,a,o,s,c;function l(){return(l=e((()=>{t(),r={title:`Molecules/FormField`,tags:[`autodocs`],argTypes:{type:{control:{type:`select`},options:[`text`,`email`,`password`]},required:{control:`boolean`}},render:e=>n(e)},i={args:{label:`Имя`,placeholder:`Анна`}},a={args:{label:`Email`,type:`email`,placeholder:`you@example.com`,required:!0}},o={args:{label:`Пароль`,type:`password`,helper:`Не меньше 8 символов`}},s={args:{label:`Email`,type:`email`,placeholder:`you@example.com`,required:!0,error:`Введите корректный email`}},c=[`Default`,`Required`,`WithHelper`,`WithError`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Имя',
    placeholder: 'Анна'
  }
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    required: true
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Пароль',
    type: 'password',
    helper: 'Не меньше 8 символов'
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    required: true,
    error: 'Введите корректный email'
  }
}`,...s.parameters?.docs?.source}}}})))()}l();export{i as Default,a as Required,s as WithError,o as WithHelper,c as __namedExportsOrder,r as default};
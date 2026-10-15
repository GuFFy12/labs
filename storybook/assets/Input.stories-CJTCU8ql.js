import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./Input-B1nTmkkQ.js";var r,i,a,o,s,c,l;function u(){return(u=e((()=>{t(),r={title:`Atoms/Input`,tags:[`autodocs`],argTypes:{type:{control:{type:`select`},options:[`text`,`email`,`password`]},disabled:{control:`boolean`},invalid:{control:`boolean`}},render:e=>n(e)},i={args:{type:`text`,placeholder:`Ваше имя`,label:`Имя`}},a={args:{type:`email`,placeholder:`you@example.com`,label:`Email`}},o={args:{type:`password`,value:`secret123`,label:`Пароль`}},s={args:{type:`email`,value:`not-an-email`,invalid:!0,label:`Email`}},c={args:{placeholder:`Недоступно`,disabled:!0,label:`Поле`}},l=[`Text`,`Email`,`Password`,`Invalid`,`Disabled`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'text',
    placeholder: 'Ваше имя',
    label: 'Имя'
  }
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'email',
    placeholder: 'you@example.com',
    label: 'Email'
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'password',
    value: 'secret123',
    label: 'Пароль'
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'email',
    value: 'not-an-email',
    invalid: true,
    label: 'Email'
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Недоступно',
    disabled: true,
    label: 'Поле'
  }
}`,...c.parameters?.docs?.source}}}})))()}u();export{c as Disabled,a as Email,s as Invalid,o as Password,i as Text,l as __namedExportsOrder,r as default};
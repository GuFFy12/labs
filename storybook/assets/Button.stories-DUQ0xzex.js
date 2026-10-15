import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./Button-Bf5YDKvu.js";var r,i,a,o,s,c,l,u,d;function f(){return(f=e((()=>{t(),r={title:`Atoms/Button`,tags:[`autodocs`],argTypes:{variant:{control:{type:`select`},options:[`primary`,`secondary`,`ghost`,`danger`]},size:{control:{type:`select`},options:[`sm`,`md`,`lg`]},disabled:{control:`boolean`}}},i={args:{variant:`primary`,size:`md`,label:`Записаться`},render:e=>n(e)},a={args:{variant:`secondary`,size:`md`,label:`Подробнее`},render:e=>n(e)},o={args:{variant:`ghost`,size:`md`,label:`Отмена`},render:e=>n(e)},s={args:{variant:`danger`,size:`md`,label:`Удалить`},render:e=>n(e)},c={render:()=>{let e=document.createElement(`div`);return e.style.display=`flex`,e.style.gap=`16px`,e.style.alignItems=`center`,e.append(n({label:`Small`,size:`sm`}),n({label:`Medium`,size:`md`}),n({label:`Large`,size:`lg`})),e}},l={args:{variant:`primary`,size:`md`,label:`Недоступно`,disabled:!0},render:e=>n(e)},u={render:()=>{let e=document.createElement(`div`);return e.style.cssText=`display: grid; grid-template-columns: repeat(4, max-content); gap: 16px; align-items: center;`,[`primary`,`secondary`,`ghost`,`danger`].forEach(t=>{[`sm`,`md`,`lg`].forEach(r=>e.append(n({variant:t,size:r,label:`${t} ${r}`}))),e.append(n({variant:t,size:`md`,label:`disabled`,disabled:!0}))}),e}},d=[`Primary`,`Secondary`,`Ghost`,`Danger`,`Sizes`,`Disabled`,`AllVariants`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    size: 'md',
    label: 'Записаться'
  },
  render: args => createButton(args)
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    size: 'md',
    label: 'Подробнее'
  },
  render: args => createButton(args)
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'ghost',
    size: 'md',
    label: 'Отмена'
  },
  render: args => createButton(args)
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    size: 'md',
    label: 'Удалить'
  },
  render: args => createButton(args)
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '16px';
    wrap.style.alignItems = 'center';
    wrap.append(createButton({
      label: 'Small',
      size: 'sm'
    }), createButton({
      label: 'Medium',
      size: 'md'
    }), createButton({
      label: 'Large',
      size: 'lg'
    }));
    return wrap;
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    size: 'md',
    label: 'Недоступно',
    disabled: true
  },
  render: args => createButton(args)
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display: grid; grid-template-columns: repeat(4, max-content); gap: 16px; align-items: center;';
    ['primary', 'secondary', 'ghost', 'danger'].forEach(variant => {
      ['sm', 'md', 'lg'].forEach(size => wrap.append(createButton({
        variant,
        size,
        label: \`\${variant} \${size}\`
      })));
      wrap.append(createButton({
        variant,
        size: 'md',
        label: 'disabled',
        disabled: true
      }));
    });
    return wrap;
  }
}`,...u.parameters?.docs?.source}}}})))()}f();export{u as AllVariants,s as Danger,l as Disabled,o as Ghost,i as Primary,a as Secondary,c as Sizes,d as __namedExportsOrder,r as default};
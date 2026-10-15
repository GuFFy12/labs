import{n as e}from"./rolldown-runtime-DkW27tQK.js";var t;function n(){return(n=e((()=>{t=({label:e=`Radio`,name:t=`radio`,value:n=``,checked:r=!1,disabled:i=!1})=>{let a=document.createElement(`label`);a.className=`radio`;let o=document.createElement(`input`);o.type=`radio`,o.className=`radio__input`,o.name=t,o.value=n||e,o.checked=r,o.disabled=i;let s=document.createElement(`span`);return s.textContent=e,a.append(o,s),a}})))()}var r,i,a,o,s,c;function l(){return(l=e((()=>{n(),r={title:`Atoms/Radio`,tags:[`autodocs`],argTypes:{checked:{control:`boolean`},disabled:{control:`boolean`}},render:e=>t(e)},i={args:{label:`Онлайн`,name:`format`}},a={args:{label:`Онлайн`,name:`format-2`,checked:!0}},o={args:{label:`Офлайн`,name:`format-3`,disabled:!0}},s={render:()=>{let e=document.createElement(`fieldset`);e.style.cssText=`border: none; padding: 0; display: flex; flex-direction: column; gap: 12px;`;let n=document.createElement(`legend`);return n.textContent=`Формат обучения`,n.style.cssText=`font-family: var(--font-family-body); font-weight: 600; margin-bottom: 8px; color: var(--color-semantic-text-default);`,e.append(n,t({label:`Онлайн`,name:`group`,checked:!0}),t({label:`Гибрид`,name:`group`}),t({label:`Офлайн`,name:`group`,disabled:!0})),e}},c=[`Default`,`Checked`,`Disabled`,`Group`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Онлайн',
    name: 'format'
  }
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Онлайн',
    name: 'format-2',
    checked: true
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Офлайн',
    name: 'format-3',
    disabled: true
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const fieldset = document.createElement('fieldset');
    fieldset.style.cssText = 'border: none; padding: 0; display: flex; flex-direction: column; gap: 12px;';
    const legend = document.createElement('legend');
    legend.textContent = 'Формат обучения';
    legend.style.cssText = 'font-family: var(--font-family-body); font-weight: 600; margin-bottom: 8px; color: var(--color-semantic-text-default);';
    fieldset.append(legend, createRadio({
      label: 'Онлайн',
      name: 'group',
      checked: true
    }), createRadio({
      label: 'Гибрид',
      name: 'group'
    }), createRadio({
      label: 'Офлайн',
      name: 'group',
      disabled: true
    }));
    return fieldset;
  }
}`,...s.parameters?.docs?.source}}}})))()}l();export{a as Checked,i as Default,o as Disabled,s as Group,c as __namedExportsOrder,r as default};
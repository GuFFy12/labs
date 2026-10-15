import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./Badge-DN4UJCv1.js";var r,i,a,o,s,c,l;function u(){return(u=e((()=>{t(),r={title:`Atoms/Badge`,tags:[`autodocs`],argTypes:{variant:{control:{type:`select`},options:[`info`,`success`,`warning`,`error`]}},render:e=>n(e)},i={args:{variant:`info`,label:`Новый курс`}},a={args:{variant:`success`,label:`Оплачено`}},o={args:{variant:`warning`,label:`Осталось 3 места`}},s={args:{variant:`error`,label:`Отменено`}},c={render:()=>{let e=document.createElement(`div`);return e.style.cssText=`display: flex; gap: 8px; flex-wrap: wrap;`,e.append(n({variant:`info`,label:`info`}),n({variant:`success`,label:`success`}),n({variant:`warning`,label:`warning`}),n({variant:`error`,label:`error`})),e}},l=[`Info`,`Success`,`Warning`,`Error`,`All`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'info',
    label: 'Новый курс'
  }
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'success',
    label: 'Оплачено'
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'warning',
    label: 'Осталось 3 места'
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'error',
    label: 'Отменено'
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';
    wrap.append(createBadge({
      variant: 'info',
      label: 'info'
    }), createBadge({
      variant: 'success',
      label: 'success'
    }), createBadge({
      variant: 'warning',
      label: 'warning'
    }), createBadge({
      variant: 'error',
      label: 'error'
    }));
    return wrap;
  }
}`,...c.parameters?.docs?.source}}}})))()}u();export{c as All,s as Error,i as Info,a as Success,o as Warning,l as __namedExportsOrder,r as default};
import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,n,r,t as i}from"./Icon-CLxcS8MO.js";var a,o,s,c;function l(){return(l=e((()=>{n(),t(),a={title:`Atoms/Icon`,tags:[`autodocs`],argTypes:{name:{control:{type:`select`},options:Object.keys(r)},size:{control:{type:`select`},options:[16,20,24,32,48]}},render:e=>i(e)},o={args:{name:`star`,size:24}},s={render:()=>{let e=document.createElement(`div`);return e.style.cssText=`display: grid; grid-template-columns: repeat(6, 96px); gap: 16px; color: var(--color-semantic-text-default); font-family: monospace; font-size: 12px;`,Object.keys(r).forEach(t=>{let n=document.createElement(`div`);n.style.cssText=`display: flex; flex-direction: column; align-items: center; gap: 8px;`;let r=document.createElement(`span`);r.textContent=t,n.append(i({name:t,size:32}),r),e.append(n)}),e}},c=[`Default`,`Set`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'star',
    size: 24
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display: grid; grid-template-columns: repeat(6, 96px); gap: 16px; color: var(--color-semantic-text-default); font-family: monospace; font-size: 12px;';
    Object.keys(icons).forEach(name => {
      const cell = document.createElement('div');
      cell.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 8px;';
      const caption = document.createElement('span');
      caption.textContent = name;
      cell.append(createIcon({
        name,
        size: 32
      }), caption);
      wrap.append(cell);
    });
    return wrap;
  }
}`,...s.parameters?.docs?.source}}}})))()}l();export{o as Default,s as Set,c as __namedExportsOrder,a as default};
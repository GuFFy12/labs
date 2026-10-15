import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./Avatar-Db00nS8g.js";var r,i,a,o,s,c;function l(){return(l=e((()=>{t(),r=`avatar.webp`,i={title:`Atoms/Avatar`,tags:[`autodocs`],argTypes:{size:{control:{type:`select`},options:[`sm`,`md`,`lg`]}},render:e=>n(e)},a={args:{src:r,name:`Елена Иванова`,size:`md`}},o={args:{name:`Павел Орлов`,size:`md`}},s={render:()=>{let e=document.createElement(`div`);return e.style.cssText=`display: flex; gap: 16px; align-items: center;`,[`sm`,`md`,`lg`].forEach(t=>e.append(n({src:r,name:`Елена Иванова`,size:t}),n({name:`Павел Орлов`,size:t}))),e}},c=[`Photo`,`Initials`,`Sizes`],a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    src: PHOTO,
    name: 'Елена Иванова',
    size: 'md'
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'Павел Орлов',
    size: 'md'
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display: flex; gap: 16px; align-items: center;';
    ['sm', 'md', 'lg'].forEach(size => wrap.append(createAvatar({
      src: PHOTO,
      name: 'Елена Иванова',
      size
    }), createAvatar({
      name: 'Павел Орлов',
      size
    })));
    return wrap;
  }
}`,...s.parameters?.docs?.source}}}})))()}l();export{o as Initials,a as Photo,s as Sizes,c as __namedExportsOrder,i as default};
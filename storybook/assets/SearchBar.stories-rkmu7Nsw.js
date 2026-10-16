import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./Button-Bf5YDKvu.js";import{n as r,t as i}from"./Icon-CLxcS8MO.js";import{n as a,t as o}from"./Input-B1nTmkkQ.js";var s;function c(){return(c=e((()=>{a(),t(),r(),s=({placeholder:e=`Поиск курсов`,buttonLabel:t=`Найти`,onSearch:r=()=>{}})=>{let a=document.createElement(`form`);a.className=`search-bar`,a.setAttribute(`role`,`search`);let s=document.createElement(`div`);s.className=`search-bar__field`;let c=o({type:`search`,placeholder:e,label:e});return c.classList.add(`search-bar__input`),s.append(i({name:`search`,size:20}),c),a.append(s,n({label:t})),a.addEventListener(`submit`,e=>{e.preventDefault(),r(c.value)}),a}})))()}var l,u,d,f;function p(){return(p=e((()=>{c(),l={title:`Molecules/SearchBar`,tags:[`autodocs`],render:e=>s(e)},u={args:{placeholder:`Поиск курсов`,buttonLabel:`Найти`}},d={args:{placeholder:`Python, дизайн, аналитика…`,buttonLabel:`Искать`}},f=[`Default`,`Catalog`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Поиск курсов',
    buttonLabel: 'Найти'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Python, дизайн, аналитика…',
    buttonLabel: 'Искать'
  }
}`,...d.parameters?.docs?.source}}}})))()}p();export{d as Catalog,u as Default,f as __namedExportsOrder,l as default};
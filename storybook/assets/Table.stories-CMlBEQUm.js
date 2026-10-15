import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./Badge-DN4UJCv1.js";var r;function i(){return(i=e((()=>{t(),r=({caption:e=``,columns:t=[],rows:r=[],striped:i=!1})=>{let a=document.createElement(`div`);a.className=`table-wrap`;let o=document.createElement(`table`);o.className=`table${i?` table--striped`:``}`,o.innerHTML=`
        ${e?`<caption class="table__caption">${e}</caption>`:``}
        <thead><tr>${t.map(e=>`<th scope="col">${e.label}</th>`).join(``)}</tr></thead>
        <tbody></tbody>
    `;let s=o.querySelector(`tbody`);return r.forEach(e=>{let r=document.createElement(`tr`);t.forEach(t=>{let i=document.createElement(`td`),a=e[t.key];t.badge?i.append(n({label:a.label,variant:a.variant})):i.textContent=a,r.append(i)}),s.append(r)}),a.append(o),a}})))()}var a,o,s,c,l,u;function d(){return(d=e((()=>{i(),a=[{key:`course`,label:`Курс`},{key:`start`,label:`Старт`},{key:`price`,label:`Стоимость`},{key:`status`,label:`Статус`,badge:!0}],o=[{course:`Frontend-разработчик`,start:`14 октября`,price:`6 900 ₽/мес`,status:{label:`Набор открыт`,variant:`success`}},{course:`Python-разработчик`,start:`21 октября`,price:`7 400 ₽/мес`,status:{label:`Осталось 3 места`,variant:`warning`}},{course:`Веб-дизайнер`,start:`4 ноября`,price:`5 900 ₽/мес`,status:{label:`Скоро`,variant:`info`}},{course:`UX-исследователь`,start:`—`,price:`5 400 ₽/мес`,status:{label:`Набор закрыт`,variant:`error`}}],s={title:`Organisms/Table`,tags:[`autodocs`],argTypes:{striped:{control:`boolean`}},render:e=>r(e)},c={args:{caption:`Ближайшие потоки`,columns:a,rows:o}},l={args:{caption:`Ближайшие потоки`,columns:a,rows:o,striped:!0}},u=[`Default`,`Striped`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    caption: 'Ближайшие потоки',
    columns,
    rows
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    caption: 'Ближайшие потоки',
    columns,
    rows,
    striped: true
  }
}`,...l.parameters?.docs?.source}}}})))()}d();export{c as Default,l as Striped,u as __namedExportsOrder,s as default};
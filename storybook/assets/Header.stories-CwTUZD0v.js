import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./Avatar-Db00nS8g.js";import{n as r,t as i}from"./Button-Bf5YDKvu.js";var a;function o(){return(o=e((()=>{r(),t(),a=({brand:e=`EduKit`,links:t=[`Курсы`,`Преподаватели`,`Блог`,`Контакты`],active:r=`Курсы`,user:a=null})=>{let o=document.createElement(`header`);o.className=`header`,o.innerHTML=`
        <a class="header__brand" href="#">${e}</a>
        <nav class="header__nav" aria-label="Основная навигация">
            ${t.map(e=>`<a class="header__link" href="#"${e===r?` aria-current="page"`:``}>${e}</a>`).join(``)}
        </nav>
        <div class="header__actions"></div>
    `;let s=o.querySelector(`.header__actions`);return a?s.append(n({name:a,size:`sm`})):s.append(i({variant:`ghost`,size:`sm`,label:`Войти`}),i({size:`sm`,label:`Регистрация`})),o}})))()}var s,c,l,u;function d(){return(d=e((()=>{o(),s={title:`Organisms/Header`,tags:[`autodocs`],parameters:{layout:`fullscreen`},argTypes:{active:{control:{type:`select`},options:[`Курсы`,`Преподаватели`,`Блог`,`Контакты`]}},render:e=>a(e)},c={args:{active:`Курсы`}},l={args:{active:`Блог`,user:`Анна Смирнова`}},u=[`Guest`,`LoggedIn`],c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    active: 'Курсы'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    active: 'Блог',
    user: 'Анна Смирнова'
  }
}`,...l.parameters?.docs?.source}}}})))()}d();export{c as Guest,l as LoggedIn,u as __namedExportsOrder,s as default};
import{n as e}from"./rolldown-runtime-DkW27tQK.js";var t;function n(){return(n=e((()=>{t=({brand:e=`EduKit`,columns:t=[],copyright:n=`© 2026 EduKit`})=>{let r=document.createElement(`footer`);return r.className=`footer`,r.innerHTML=`
        <div class="footer__grid">
            <p class="footer__brand">${e}</p>
            ${t.map(e=>`
                <div>
                    <h2 class="footer__title">${e.title}</h2>
                    <ul class="footer__list">
                        ${e.links.map(e=>`<li><a class="footer__link" href="#">${e}</a></li>`).join(``)}
                    </ul>
                </div>`).join(``)}
        </div>
        <p class="footer__copy">${n}</p>
    `,r}})))()}var r,i,a,o;function s(){return(s=e((()=>{n(),r={title:`Organisms/Footer`,tags:[`autodocs`],parameters:{layout:`fullscreen`},render:e=>t(e)},i={args:{columns:[{title:`Обучение`,links:[`Все курсы`,`Преподаватели`,`Корпоративным клиентам`]},{title:`Школа`,links:[`Блог`,`Контакты`,`Вакансии`]},{title:`Соцсети`,links:[`Telegram`,`ВКонтакте`,`YouTube`]}]}},a={args:{columns:[],copyright:`© 2026 EduKit. Все права защищены.`}},o=[`Default`,`Minimal`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    columns: [{
      title: 'Обучение',
      links: ['Все курсы', 'Преподаватели', 'Корпоративным клиентам']
    }, {
      title: 'Школа',
      links: ['Блог', 'Контакты', 'Вакансии']
    }, {
      title: 'Соцсети',
      links: ['Telegram', 'ВКонтакте', 'YouTube']
    }]
  }
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    columns: [],
    copyright: '© 2026 EduKit. Все права защищены.'
  }
}`,...a.parameters?.docs?.source}}}})))()}s();export{i as Default,a as Minimal,o as __namedExportsOrder,r as default};
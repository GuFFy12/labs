import{n as e}from"./rolldown-runtime-DkW27tQK.js";var t,n,r,i;function a(){return(a=e((()=>{t=({image:e,title:t,text:n,actionLabel:r=`Подробнее`})=>{let i=document.createElement(`article`);return i.className=`card`,i.innerHTML=`
        <img class="card__image" src="${e}" alt="">
        <div class="card__body">
            <h3 class="card__title">${t}</h3>
            <p class="card__text">${n}</p>
            <button class="btn btn--primary btn--md">${r}</button>
        </div>
    `,i},n=({image:e,title:n,text:r,price:i,badge:a=``})=>{let o=t({image:e,title:n,text:r,actionLabel:`Записаться`});o.classList.add(`card--product`);let s=o.querySelector(`.card__body`);return a&&s.insertAdjacentHTML(`afterbegin`,`<span class="badge badge--info">${a}</span>`),o.querySelector(`.card__text`).insertAdjacentHTML(`afterend`,`<p class="card__price">${i}</p>`),o},r=({image:e,title:n,text:r,date:i,readTime:a})=>{let o=t({image:e,title:n,text:r,actionLabel:`Читать`});return o.classList.add(`card--article`),o.querySelector(`.btn`).className=`btn btn--ghost btn--sm`,o.querySelector(`.card__body`).insertAdjacentHTML(`afterbegin`,`<p class="card__meta">${i} · ${a}</p>`),o},i=({image:e,title:n,text:r,role:i})=>{let a=t({image:e,title:n,text:r,actionLabel:`Профиль`});a.classList.add(`card--user`);let o=a.querySelector(`.card__image`);return o.alt=n,a.querySelector(`.btn`).className=`btn btn--secondary btn--sm`,a.querySelector(`.card__title`).insertAdjacentHTML(`afterend`,`<p class="card__role">${i}</p>`),a}})))()}var o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{a(),o=`card-course.webp`,s=`card-post.webp`,c=`avatar.webp`,l={title:`Organisms/Card`,tags:[`autodocs`],render:e=>t(e)},u={args:{image:o,title:`Frontend-разработчик`,text:`Вёрстка, JavaScript и React: от первой страницы до SPA`,actionLabel:`Подробнее`}},d={args:{image:o,title:`Frontend-разработчик`,text:`8 месяцев, наставник и 5 проектов в портфолио`,price:`6 900 ₽/мес`,badge:`С нуля`},render:e=>n(e)},f={args:{image:s,title:`Как найти первую работу в IT без опыта`,text:`Что смотрит работодатель в резюме джуна`,date:`12 сентября 2026`,readTime:`7 мин`},render:e=>r(e)},p={args:{image:c,title:`Елена Иванова`,role:`Frontend-разработчик`,text:`10 лет в разработке, тимлид фронтенда в финтехе`},render:e=>i(e)},m=[`Default`,`Product`,`Article`,`User`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    image: COURSE,
    title: 'Frontend-разработчик',
    text: 'Вёрстка, JavaScript и React: от первой страницы до SPA',
    actionLabel: 'Подробнее'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    image: COURSE,
    title: 'Frontend-разработчик',
    text: '8 месяцев, наставник и 5 проектов в портфолио',
    price: '6 900 ₽/мес',
    badge: 'С нуля'
  },
  render: args => createProductCard(args)
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    image: POST,
    title: 'Как найти первую работу в IT без опыта',
    text: 'Что смотрит работодатель в резюме джуна',
    date: '12 сентября 2026',
    readTime: '7 мин'
  },
  render: args => createArticleCard(args)
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    image: TEACHER,
    title: 'Елена Иванова',
    role: 'Frontend-разработчик',
    text: '10 лет в разработке, тимлид фронтенда в финтехе'
  },
  render: args => createUserCard(args)
}`,...p.parameters?.docs?.source}}}})))()}h();export{f as Article,u as Default,d as Product,p as User,m as __namedExportsOrder,l as default};
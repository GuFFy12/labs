import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./Button-Bf5YDKvu.js";import{n as r,t as i}from"./Checkbox-DNUdrC-H.js";import{n as a,t as o}from"./FormField-I9XW_RxS.js";var s;function c(){return(c=e((()=>{a(),r(),t(),s=({title:e=`Заявка на курс`,fields:t=[],consent:r=`Согласен на обработку персональных данных`,submitLabel:a=`Отправить`})=>{let s=document.createElement(`form`);s.className=`form`,s.noValidate=!0,s.innerHTML=`<h2 class="form__title">${e}</h2>`,t.forEach(e=>s.append(o(e))),r&&s.append(i({label:r,name:`consent`}));let c=n({label:a,size:`lg`});c.type=`submit`,s.append(c);let l=document.createElement(`p`);return l.className=`form__status`,l.setAttribute(`role`,`status`),s.append(l),s.addEventListener(`submit`,e=>{e.preventDefault(),l.textContent=s.checkValidity()?`Заявка отправлена!`:`Заполните обязательные поля`}),s}})))()}var l,u,d,f;function p(){return(p=e((()=>{c(),l={title:`Organisms/Form`,tags:[`autodocs`],render:e=>s(e)},u={args:{title:`Заявка на курс`,fields:[{label:`Имя`,placeholder:`Анна`,required:!0},{label:`Email`,type:`email`,placeholder:`you@example.com`,required:!0},{label:`Телефон`,type:`tel`,placeholder:`+7 900 000-00-00`,helper:`Позвоним, чтобы подобрать поток`}],submitLabel:`Записаться`}},d={args:{title:`Вход`,fields:[{label:`Email`,type:`email`,placeholder:`you@example.com`,required:!0,error:`Введите корректный email`},{label:`Пароль`,type:`password`,required:!0,error:`Неверный пароль`}],consent:``,submitLabel:`Войти`}},f=[`Enrollment`,`WithErrors`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Заявка на курс',
    fields: [{
      label: 'Имя',
      placeholder: 'Анна',
      required: true
    }, {
      label: 'Email',
      type: 'email',
      placeholder: 'you@example.com',
      required: true
    }, {
      label: 'Телефон',
      type: 'tel',
      placeholder: '+7 900 000-00-00',
      helper: 'Позвоним, чтобы подобрать поток'
    }],
    submitLabel: 'Записаться'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Вход',
    fields: [{
      label: 'Email',
      type: 'email',
      placeholder: 'you@example.com',
      required: true,
      error: 'Введите корректный email'
    }, {
      label: 'Пароль',
      type: 'password',
      required: true,
      error: 'Неверный пароль'
    }],
    consent: '',
    submitLabel: 'Войти'
  }
}`,...d.parameters?.docs?.source}}}})))()}p();export{u as Enrollment,d as WithErrors,f as __namedExportsOrder,l as default};
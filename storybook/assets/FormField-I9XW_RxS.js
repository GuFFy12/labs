import{n as e}from"./rolldown-runtime-DkW27tQK.js";var t,n;function r(){return(r=e((()=>{t=0,n=({label:e,type:n=`text`,placeholder:r=``,error:i=``,required:a=!1,helper:o=``})=>{let s=`field-${++t}`,c=document.createElement(`div`);return c.className=`form-field`,c.innerHTML=`
        <label class="form-field__label" for="${s}">
            ${e}${a?` *`:``}
        </label>
        <input type="${n}" class="form-field__input" id="${s}"
               placeholder="${r}" ${a?`required`:``}
               ${i?`aria-invalid="true" aria-describedby="${s}-msg"`:o?`aria-describedby="${s}-msg"`:``} />
        ${i?`<span class="form-field__error" id="${s}-msg">${i}</span>`:``}
        ${!i&&o?`<span class="form-field__helper" id="${s}-msg">${o}</span>`:``}
    `,c}})))()}export{r as n,n as t};
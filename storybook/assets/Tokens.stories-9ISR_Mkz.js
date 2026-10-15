import{n as e}from"./rolldown-runtime-DkW27tQK.js";var t,n,r,i,a,o,s,c,l;function u(){return(u=e((()=>{t={title:`Foundations/Tokens`},n=(e,t)=>{let n=document.createElement(`div`);return n.style.cssText=`
        display: flex; flex-direction: column;
        align-items: center; gap: 8px;
        font-family: monospace; font-size: 12px;
    `,n.innerHTML=`
        <div style="
            width: 80px; height: 80px;
            background: var(${t});
            border-radius: 12px;
            border: 1px solid #e5e7eb;
        "></div>
        <div>${e}</div>
    `,n},r={render:()=>{let e=document.createElement(`div`);return e.style.cssText=`display: flex; gap: 16px; flex-wrap: wrap;`,e.append(n(`primary`,`--color-semantic-action-primary`),n(`text`,`--color-semantic-text-default`),n(`bg`,`--color-semantic-background-default`),n(`surface`,`--color-semantic-background-surface`)),e}},i={render:()=>{let e=document.createElement(`div`);return e.style.cssText=`display: flex; flex-direction: column; gap: 12px;`,[1,2,3,4,6,8,12,16].forEach(t=>{let n=document.createElement(`div`);n.style.cssText=`display: flex; align-items: center; gap: 16px;`,n.innerHTML=`
                <code>space-${t}</code>
                <div style="
                    height: 16px;
                    width: var(--space-${t});
                    background: var(--color-semantic-action-primary);
                "></div>
                <small>var(--space-${t})</small>
            `,e.append(n)}),e}},a={render:()=>{let e=document.createElement(`div`);return e.style.cssText=`display: flex; gap: 16px; flex-wrap: wrap;`,[`background-default`,`background-surface`,`background-muted`,`text-default`,`text-muted`,`border-default`,`action-primary`,`action-primary-hover`,`action-on-primary`,`action-danger`,`action-danger-hover`,`feedback-info-bg`,`feedback-info-text`,`feedback-success-bg`,`feedback-success-text`,`feedback-warning-bg`,`feedback-warning-text`,`feedback-error-bg`,`feedback-error-text`].forEach(t=>e.append(n(t,`--color-semantic-${t}`))),e}},o={render:()=>{let e=document.createElement(`div`);return e.style.cssText=`display: flex; flex-direction: column; gap: 16px;`,[`3xl`,`2xl`,`xl`,`lg`,`base`,`sm`,`xs`].forEach(t=>{let n=document.createElement(`div`);n.style.cssText=`display: flex; align-items: baseline; gap: 24px;`,n.innerHTML=`
                <code style="width: 140px; flex-shrink: 0;">font-size-${t}</code>
                <span style="
                    font-family: var(--font-family-${[`3xl`,`2xl`,`xl`].includes(t)?`display`:`body`});
                    font-size: var(--font-size-${t});
                    font-weight: var(--font-weight-${[`3xl`,`2xl`,`xl`].includes(t)?`bold`:`regular`});
                ">Дизайн-система EduKit</span>
            `,e.append(n)}),e}},s={render:()=>{let e=document.createElement(`div`);return e.style.cssText=`display: flex; gap: 24px; font-family: monospace; font-size: 12px;`,[`sm`,`md`,`lg`,`pill`].forEach(t=>{let n=document.createElement(`div`);n.style.cssText=`display: flex; flex-direction: column; align-items: center; gap: 8px;`,n.innerHTML=`
                <div style="width: 96px; height: 64px; border-radius: var(--radius-${t});
                    background: var(--color-semantic-feedback-info-bg);
                    border: 2px solid var(--color-semantic-action-primary);"></div>
                <div>radius-${t}</div>
            `,e.append(n)}),e}},c={render:()=>{let e=document.createElement(`div`);return e.style.cssText=`display: flex; gap: 32px; padding: 16px; font-family: monospace; font-size: 12px;`,[`sm`,`md`,`lg`].forEach(t=>{let n=document.createElement(`div`);n.style.cssText=`width: 120px; height: 80px; display: grid; place-items: center;
                border-radius: 12px; background: var(--color-semantic-background-surface);
                color: var(--color-semantic-text-default); box-shadow: var(--shadow-${t});`,n.textContent=`shadow-${t}`,e.append(n)}),e}},l=[`Colors`,`Spacing`,`SemanticColors`,`Typography`,`Radii`,`Shadows`],r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display: flex; gap: 16px; flex-wrap: wrap;';
    wrap.append(Swatch('primary', '--color-semantic-action-primary'), Swatch('text', '--color-semantic-text-default'), Swatch('bg', '--color-semantic-background-default'), Swatch('surface', '--color-semantic-background-surface'));
    return wrap;
  }
}`,...r.parameters?.docs?.source}}},i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';
    [1, 2, 3, 4, 6, 8, 12, 16].forEach(n => {
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; align-items: center; gap: 16px;';
      row.innerHTML = \`
                <code>space-\${n}</code>
                <div style="
                    height: 16px;
                    width: var(--space-\${n});
                    background: var(--color-semantic-action-primary);
                "></div>
                <small>var(--space-\${n})</small>
            \`;
      wrap.append(row);
    });
    return wrap;
  }
}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display: flex; gap: 16px; flex-wrap: wrap;';
    ['background-default', 'background-surface', 'background-muted', 'text-default', 'text-muted', 'border-default', 'action-primary', 'action-primary-hover', 'action-on-primary', 'action-danger', 'action-danger-hover', 'feedback-info-bg', 'feedback-info-text', 'feedback-success-bg', 'feedback-success-text', 'feedback-warning-bg', 'feedback-warning-text', 'feedback-error-bg', 'feedback-error-text'].forEach(name => wrap.append(Swatch(name, \`--color-semantic-\${name}\`)));
    return wrap;
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display: flex; flex-direction: column; gap: 16px;';
    ['3xl', '2xl', 'xl', 'lg', 'base', 'sm', 'xs'].forEach(size => {
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; align-items: baseline; gap: 24px;';
      row.innerHTML = \`
                <code style="width: 140px; flex-shrink: 0;">font-size-\${size}</code>
                <span style="
                    font-family: var(--font-family-\${['3xl', '2xl', 'xl'].includes(size) ? 'display' : 'body'});
                    font-size: var(--font-size-\${size});
                    font-weight: var(--font-weight-\${['3xl', '2xl', 'xl'].includes(size) ? 'bold' : 'regular'});
                ">Дизайн-система EduKit</span>
            \`;
      wrap.append(row);
    });
    return wrap;
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display: flex; gap: 24px; font-family: monospace; font-size: 12px;';
    ['sm', 'md', 'lg', 'pill'].forEach(r => {
      const el = document.createElement('div');
      el.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 8px;';
      el.innerHTML = \`
                <div style="width: 96px; height: 64px; border-radius: var(--radius-\${r});
                    background: var(--color-semantic-feedback-info-bg);
                    border: 2px solid var(--color-semantic-action-primary);"></div>
                <div>radius-\${r}</div>
            \`;
      wrap.append(el);
    });
    return wrap;
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display: flex; gap: 32px; padding: 16px; font-family: monospace; font-size: 12px;';
    ['sm', 'md', 'lg'].forEach(s => {
      const el = document.createElement('div');
      el.style.cssText = \`width: 120px; height: 80px; display: grid; place-items: center;
                border-radius: 12px; background: var(--color-semantic-background-surface);
                color: var(--color-semantic-text-default); box-shadow: var(--shadow-\${s});\`;
      el.textContent = \`shadow-\${s}\`;
      wrap.append(el);
    });
    return wrap;
  }
}`,...c.parameters?.docs?.source}}}})))()}u();export{r as Colors,s as Radii,a as SemanticColors,c as Shadows,i as Spacing,o as Typography,l as __namedExportsOrder,t as default};
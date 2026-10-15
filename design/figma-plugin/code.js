// Плагин строит макеты лабораторных по веб-дизайну из токенов и вёрстки.
// Всё создаётся настоящими средствами Figma: Variables, Text Styles, компоненты с Variants, Auto Layout, Layout Grid.

const SITE = 'https://guffy12.github.io/labs/';

// ---------- общие помощники ----------

function hex(h) {
  const n = parseInt(h.replace('#', ''), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

let AVAILABLE = null;
async function pickFont(family, styles) {
  if (!AVAILABLE) {
    AVAILABLE = {};
    for (const f of await figma.listAvailableFontsAsync()) {
      (AVAILABLE[f.fontName.family] = AVAILABLE[f.fontName.family] || []).push(f.fontName.style);
    }
  }
  const have = AVAILABLE[family] || [];
  for (const s of styles) if (have.indexOf(s) !== -1) return { family: family, style: s };
  return { family: 'Inter', style: 'Regular' };
}

const V = {}; // имя переменной -> Variable

function paint(varName) {
  return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', V[varName]);
}
function fill(node, varName) { node.fills = [paint(varName)]; }
function bind(node, field, varName) { node.setBoundVariable(field, V[varName]); }
function radius(node, varName) {
  for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) bind(node, k, varName);
}
function pad(node, vName, hName) {
  if (vName) { bind(node, 'paddingTop', vName); bind(node, 'paddingBottom', vName); }
  if (hName) { bind(node, 'paddingLeft', hName); bind(node, 'paddingRight', hName); }
}
function padPx(node, v, h) {
  if (v !== null) { node.paddingTop = v; node.paddingBottom = v; }
  if (h !== null) { node.paddingLeft = h; node.paddingRight = h; }
}

// Auto Layout фрейм: dir = 'VERTICAL' | 'HORIZONTAL'
function af(name, dir) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = dir;
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  f.fills = [];
  f.clipsContent = false;
  return f;
}

// добавить в Auto Layout родителя и растянуть по ширине
function add(parent, child, sizing) {
  parent.appendChild(child);
  if (sizing === 'FILL') child.layoutSizingHorizontal = 'FILL';
  return child;
}

let S = {}; // текстовые стили
async function txt(chars, style, colorVar, opts) {
  opts = opts || {};
  const t = figma.createText();
  t.fontName = S[style].fontName;
  t.characters = chars;
  await t.setTextStyleIdAsync(S[style].id);
  fill(t, colorVar);
  t.name = opts.name || chars.slice(0, 32);
  if (opts.align) t.textAlignHorizontal = opts.align;
  return t;
}

// SVG-иконка с цветом из переменной
function svgIcon(svg, colorVar, name) {
  const n = figma.createNodeFromSvg(svg);
  n.name = name;
  n.fills = [];
  for (const v of n.findAll(function (x) { return x.type === 'VECTOR'; })) {
    if (v.strokes && v.strokes.length) v.strokes = [paint(colorVar)];
    if (v.fills && v.fills.length) v.fills = [paint(colorVar)];
  }
  return n;
}

// сетка карточек: горизонтальный Auto Layout с переносом
function grid(parent, items, cols, contentW, gapPx, lastFull) {
  const g = af('Grid ' + cols + ' col', 'HORIZONTAL');
  g.layoutWrap = 'WRAP';
  g.itemSpacing = gapPx;
  g.counterAxisSpacing = gapPx;
  add(parent, g, 'FILL');
  const w = Math.floor((contentW - gapPx * (cols - 1)) / cols);
  items.forEach(function (it, i) {
    g.appendChild(it);
    const full = lastFull && cols > 1 && i === items.length - 1 && items.length % cols === 1;
    it.resize(full ? contentW : w, it.height);
    it.layoutSizingHorizontal = 'FIXED';
    it.layoutSizingVertical = 'HUG';
  });
  return g;
}

function placeRow(nodes, x0, y0, gap) {
  let x = x0;
  for (const n of nodes) { n.x = x; n.y = y0; x += n.width + gap; }
  return x;
}

// ---------- ЛР1: лендинг CodeStart ----------

const LR1 = {
  colors: {
    // имя: [светлая тема, тёмная тема] — значения из css/style.css
    'color/primary': ['#2563EB', '#2563EB'],
    'color/primary-hover': ['#1D4ED8', '#1D4ED8'],
    'color/primary-light': ['#3B82F6', '#3B82F6'],
    'color/secondary': ['#7C3AED', '#7C3AED'],
    'color/accent': ['#F59E0B', '#F59E0B'],
    'color/accent-hover': ['#D97706', '#D97706'],
    'color/text': ['#1F2937', '#F1F5F9'],
    'color/text-muted': ['#6B7280', '#94A3B8'],
    'color/bg': ['#FFFFFF', '#0F172A'],
    'color/bg-alt': ['#F9FAFB', '#1E293B'],
    'color/hero-bg': ['#EFF6FF', '#1E293B'],
    'color/border': ['#E5E7EB', '#1E293B'],
    'color/on-primary': ['#FFFFFF', '#FFFFFF'],
    'color/on-accent': ['#1F2937', '#1F2937'],
    'color/footer-bg': ['#111827', '#111827'],
    'color/footer-text': ['#9CA3AF', '#9CA3AF'],
  },
  // 3.4 методички: space/xs..xl; остальные шаги 8px-сетки из 3.3
  spacing: {
    'space/xs': 4, 'space/sm': 8, 'space/md': 16, 'space/lg': 32, 'space/xl': 64,
    'space/gap': 24, 'space/block': 48, 'space/2xl': 96, 'space/3xl': 128,
  },
  radius: { 'radius/sm': 4, 'radius/md': 8, 'radius/lg': 16, 'radius/pill': 999 },
  features: [
    ['users', 'Личный наставник', 'Практикующий разработчик проверяет каждое задание и отвечает в чате в течение дня'],
    ['code', 'Практика с первого урока', '80% времени — код: вёрстка, интерактив, работа с API и Git'],
    ['clock', 'Гибкий график', 'Уроки в записи и 8–10 часов в неделю — можно совмещать с работой'],
    ['briefcase', 'Помощь с работой', 'Разбор резюме, пробные собеседования и рекомендации партнёрам'],
  ],
  steps: [
    ['01', 'Оставьте заявку', 'Менеджер позвонит, ответит на вопросы и поможет выбрать поток'],
    ['02', 'Пройдите вводный модуль', 'Первые две недели бесплатно — поймёте, подходит ли вам формат'],
    ['03', 'Соберите портфолио', '5 проектов на GitHub и диплом, которые можно показать работодателю'],
  ],
  reviews: [
    ['Пришла из бухгалтерии без опыта в коде. Через полгода вышла джуном во фронтенд — наставник реально разбирал каждую ошибку.', '— Анна Смирнова'],
    ['Понравилось, что с первой недели делаешь настоящий сайт, а не читаешь теорию. Портфолио помогло на собеседовании.', '— Игорь Петров'],
    ['Учился по вечерам после работы, записи уроков выручали. Самое ценное — пробные собеседования в конце курса.', '— Дмитрий Козлов'],
  ],
  // сетка из 4.1 методички + перестройка блоков из 4.3
  bp: {
    mobile: { name: 'Mobile 375', w: 375, cols: 4, gutter: 16, margin: 16, feat: 1, how: 1, rev: 1, nav: false, heroRow: false, h1: 'h1m', heroPad: 'space/xl' },
    tablet: { name: 'Tablet 768', w: 768, cols: 8, gutter: 24, margin: 32, feat: 2, how: 3, rev: 2, nav: true, heroRow: false, h1: 'h1d', heroPad: 'space/2xl' },
    desktop: { name: 'Desktop 1440', w: 1440, cols: 12, gutter: 24, margin: 80, feat: 4, how: 3, rev: 3, nav: true, heroRow: true, h1: 'h1d', heroPad: 'space/2xl' },
  },
};

const ICONS = {
  users: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  code: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  clock: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  briefcase: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  moon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
  menu: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F2937" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  logoMark: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#2563EB"/><path d="M13 11l-5 5 5 5M19 11l5 5-5 5" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

async function lr1Variables() {
  const colors = figma.variables.createVariableCollection('LR1 Colors');
  const light = colors.modes[0].modeId;
  colors.renameMode(light, 'Light');
  let dark = null;
  try { dark = colors.addMode('Dark'); } catch (e) { dark = null; } // на бесплатном плане один режим
  for (const name in LR1.colors) {
    const v = figma.variables.createVariable(name, colors, 'COLOR');
    v.setValueForMode(light, hex(LR1.colors[name][0]));
    if (dark) v.setValueForMode(dark, hex(LR1.colors[name][1]));
    V[name] = v;
  }
  const spacing = figma.variables.createVariableCollection('LR1 Spacing');
  const sm = spacing.modes[0].modeId;
  for (const name in LR1.spacing) {
    const v = figma.variables.createVariable(name, spacing, 'FLOAT');
    v.setValueForMode(sm, LR1.spacing[name]);
    v.scopes = ['GAP', 'WIDTH_HEIGHT'];
    V[name] = v;
  }
  const radii = figma.variables.createVariableCollection('LR1 Radius');
  const rm = radii.modes[0].modeId;
  for (const name in LR1.radius) {
    const v = figma.variables.createVariable(name, radii, 'FLOAT');
    v.setValueForMode(rm, LR1.radius[name]);
    v.scopes = ['CORNER_RADIUS'];
    V[name] = v;
  }
  return { colors: colors, dark: dark };
}

async function lr1TextStyles() {
  const d800 = await pickFont('Manrope', ['ExtraBold', 'Extra Bold', 'Bold']);
  const d700 = await pickFont('Manrope', ['Bold', 'SemiBold', 'Semi Bold']);
  const b400 = await pickFont('Inter', ['Regular']);
  const b600 = await pickFont('Inter', ['Semi Bold', 'SemiBold', 'Medium']);
  for (const f of [d800, d700, b400, b600]) await figma.loadFontAsync(f);
  // модульная шкала 1.25 от 16px (3.2 методички): 12, 16, 20, 25, 31, 39, 49, 61, 76
  const defs = {
    h1d: ['LR1/Heading/H1 Desktop', d800, 56, 120],
    h1m: ['LR1/Heading/H1 Mobile', d800, 39, 120],
    h2: ['LR1/Heading/H2', d700, 31, 120],
    h3: ['LR1/Heading/H3', d700, 20, 120],
    num: ['LR1/Heading/Step number', d800, 31, 120],
    logo: ['LR1/Logo', d800, 15, 100],
    lead: ['LR1/Body/Lead', b400, 20, 160],
    body: ['LR1/Body/Base', b400, 16, 160],
    small: ['LR1/Body/Small', b600, 14, 160],
    caption: ['LR1/Body/Caption', b400, 12, 140],
    btn: ['LR1/Button/Medium', b600, 16, 100],
    btnLg: ['LR1/Button/Large', b600, 20, 100],
  };
  S = {};
  for (const k in defs) {
    const st = figma.createTextStyle();
    st.name = defs[k][0];
    st.fontName = defs[k][1];
    st.fontSize = defs[k][2];
    st.lineHeight = { unit: 'PERCENT', value: defs[k][3] };
    S[k] = st;
  }
  return { d800: d800, d700: d700, b400: b400 };
}

// ----- компоненты ЛР1 -----

async function lr1Components(page) {
  const area = af('Компоненты', 'VERTICAL');
  area.itemSpacing = 48;
  padPx(area, 48, 48);
  area.fills = [{ type: 'SOLID', color: hex('#FFFFFF') }];
  page.appendChild(area);
  area.appendChild(await txt('Компоненты (Variants)', 'h2', 'color/text'));

  // Кнопка: Type × State × Size
  const btnDefs = [
    ['Primary', 'Default', 'Medium'], ['Primary', 'Hover', 'Medium'], ['Primary', 'Disabled', 'Medium'],
    ['Secondary', 'Default', 'Medium'], ['Accent', 'Default', 'Medium'], ['Accent', 'Hover', 'Medium'],
    ['Accent', 'Default', 'Large'],
  ];
  const btns = [];
  for (const d of btnDefs) {
    const c = figma.createComponent();
    c.name = 'Type=' + d[0] + ', State=' + d[1] + ', Size=' + d[2];
    c.layoutMode = 'HORIZONTAL';
    c.primaryAxisSizingMode = 'AUTO';
    c.counterAxisSizingMode = 'AUTO';
    c.primaryAxisAlignItems = 'CENTER';
    c.counterAxisAlignItems = 'CENTER';
    if (d[2] === 'Large') pad(c, 'space/gap', 'space/block'); else pad(c, 'space/md', 'space/lg');
    radius(c, 'radius/md');
    let bg = 'color/primary', fg = 'color/on-primary';
    if (d[0] === 'Primary' && d[1] === 'Hover') bg = 'color/primary-hover';
    if (d[0] === 'Accent') { bg = d[1] === 'Hover' ? 'color/accent-hover' : 'color/accent'; fg = 'color/on-accent'; }
    if (d[0] === 'Secondary') {
      c.fills = [];
      c.strokes = [paint('color/primary')];
      c.strokeWeight = 2;
      c.strokeAlign = 'INSIDE';
      fg = 'color/primary';
    } else {
      fill(c, bg);
    }
    if (d[1] === 'Disabled') c.opacity = 0.5;
    const label = await txt('Кнопка', d[2] === 'Large' ? 'btnLg' : 'btn', fg, { name: 'Label' });
    c.appendChild(label);
    btns.push(c);
  }
  const btnSet = figma.combineAsVariants(btns, area);
  btnSet.name = 'Button';
  btnSet.layoutMode = 'HORIZONTAL';
  btnSet.layoutWrap = 'WRAP';
  btnSet.itemSpacing = 16;
  btnSet.counterAxisSpacing = 16;
  padPx(btnSet, 24, 24);
  btnSet.primaryAxisSizingMode = 'FIXED';
  btnSet.counterAxisSizingMode = 'AUTO';
  btnSet.resize(900, btnSet.height);
  const btnLabel = btnSet.addComponentProperty('Label', 'TEXT', 'Кнопка');
  for (const c of btnSet.children) c.findOne(function (n) { return n.name === 'Label'; }).componentPropertyReferences = { characters: btnLabel };

  // Иконки: отдельные компоненты, чтобы менять через Instance Swap
  const iconRow = af('Icons', 'HORIZONTAL');
  iconRow.itemSpacing = 24;
  area.appendChild(iconRow);
  const iconComp = {};
  for (const k of ['users', 'code', 'clock', 'briefcase']) {
    const c = figma.createComponent();
    c.name = 'Icon/' + k;
    c.resize(48, 48);
    c.fills = [];
    const ic = svgIcon(ICONS[k], 'color/primary', k);
    c.appendChild(ic);
    iconRow.appendChild(c);
    iconComp[k] = c;
  }

  // Logo
  const logo = figma.createComponent();
  logo.name = 'Logo';
  logo.layoutMode = 'HORIZONTAL';
  logo.primaryAxisSizingMode = 'AUTO';
  logo.counterAxisSizingMode = 'AUTO';
  logo.counterAxisAlignItems = 'CENTER';
  bind(logo, 'itemSpacing', 'space/sm');
  logo.fills = [];
  const mark = figma.createNodeFromSvg(ICONS.logoMark);
  mark.name = 'Mark';
  mark.fills = [];
  const markRect = mark.findOne(function (n) { return n.type === 'RECTANGLE' || n.type === 'VECTOR'; });
  if (markRect && markRect.fills.length) markRect.fills = [paint('color/primary')];
  logo.appendChild(mark);
  logo.appendChild(await txt('CodeStart', 'logo', 'color/primary', { name: 'Name' }));
  area.appendChild(logo);

  // Карточка преимущества: Icon (Instance Swap) + Title + Text
  const feat = figma.createComponent();
  feat.name = 'Feature card';
  feat.layoutMode = 'VERTICAL';
  feat.primaryAxisSizingMode = 'AUTO';
  feat.counterAxisSizingMode = 'FIXED';
  feat.resize(302, 100);
  pad(feat, 'space/lg', 'space/lg');
  bind(feat, 'itemSpacing', 'space/md');
  fill(feat, 'color/bg-alt');
  radius(feat, 'radius/lg');
  const featIcon = iconComp.users.createInstance();
  featIcon.name = 'Icon';
  feat.appendChild(featIcon);
  const ft = add(feat, await txt('Возможность', 'h3', 'color/text', { name: 'Title' }), 'FILL');
  const fx = add(feat, await txt('Краткое описание', 'body', 'color/text-muted', { name: 'Text' }), 'FILL');
  const pIcon = feat.addComponentProperty('Icon', 'INSTANCE_SWAP', iconComp.users.id);
  const pTitle = feat.addComponentProperty('Title', 'TEXT', 'Возможность');
  const pText = feat.addComponentProperty('Text', 'TEXT', 'Краткое описание');
  featIcon.componentPropertyReferences = { mainComponent: pIcon };
  ft.componentPropertyReferences = { characters: pTitle };
  fx.componentPropertyReferences = { characters: pText };
  area.appendChild(feat);

  // Шаг «Как это работает»
  const step = figma.createComponent();
  step.name = 'Step';
  step.layoutMode = 'VERTICAL';
  step.primaryAxisSizingMode = 'AUTO';
  step.counterAxisSizingMode = 'FIXED';
  step.resize(300, 100);
  bind(step, 'itemSpacing', 'space/sm');
  step.fills = [];
  const sn = add(step, await txt('01', 'num', 'color/primary-light', { name: 'Number' }), 'FILL');
  const st = add(step, await txt('Шаг', 'h3', 'color/text', { name: 'Title' }), 'FILL');
  const sx = add(step, await txt('Описание', 'body', 'color/text', { name: 'Text' }), 'FILL');
  const pNum = step.addComponentProperty('Number', 'TEXT', '01');
  const pST = step.addComponentProperty('Title', 'TEXT', 'Шаг');
  const pSX = step.addComponentProperty('Text', 'TEXT', 'Описание');
  sn.componentPropertyReferences = { characters: pNum };
  st.componentPropertyReferences = { characters: pST };
  sx.componentPropertyReferences = { characters: pSX };
  area.appendChild(step);

  // Отзыв
  const rev = figma.createComponent();
  rev.name = 'Review';
  rev.layoutMode = 'VERTICAL';
  rev.primaryAxisSizingMode = 'AUTO';
  rev.counterAxisSizingMode = 'FIXED';
  rev.resize(400, 100);
  pad(rev, 'space/gap', 'space/gap');
  bind(rev, 'itemSpacing', 'space/md');
  fill(rev, 'color/bg-alt');
  radius(rev, 'radius/md');
  rev.strokes = [paint('color/primary')];
  rev.strokeAlign = 'INSIDE';
  rev.strokeTopWeight = 0; rev.strokeRightWeight = 0; rev.strokeBottomWeight = 0; rev.strokeLeftWeight = 4;
  const rt = add(rev, await txt('Текст отзыва', 'body', 'color/text', { name: 'Text' }), 'FILL');
  const ra = add(rev, await txt('— Имя Фамилия', 'small', 'color/text-muted', { name: 'Author' }), 'FILL');
  const pRT = rev.addComponentProperty('Text', 'TEXT', 'Текст отзыва');
  const pRA = rev.addComponentProperty('Author', 'TEXT', '— Имя Фамилия');
  rt.componentPropertyReferences = { characters: pRT };
  ra.componentPropertyReferences = { characters: pRA };
  area.appendChild(rev);

  function variant(props) {
    return btnSet.children.find(function (c) {
      return c.name === 'Type=' + props[0] + ', State=' + props[1] + ', Size=' + props[2];
    });
  }
  return {
    area: area,
    button: function (label, type, size) {
      const i = variant([type, 'Default', size || 'Medium']).createInstance();
      const p = {}; p[btnLabel] = label; i.setProperties(p);
      return i;
    },
    logo: function () { return logo.createInstance(); },
    feature: function (d) {
      const i = feat.createInstance();
      const p = {}; p[pIcon] = iconComp[d[0]].id; p[pTitle] = d[1]; p[pText] = d[2]; i.setProperties(p);
      return i;
    },
    step: function (d) {
      const i = step.createInstance();
      const p = {}; p[pNum] = d[0]; p[pST] = d[1]; p[pSX] = d[2]; i.setProperties(p);
      return i;
    },
    review: function (d) {
      const i = rev.createInstance();
      const p = {}; p[pRT] = d[0]; p[pRA] = d[1]; i.setProperties(p);
      return i;
    },
  };
}

// ----- страница-макет на одной ширине -----

async function lr1Layout(bp, K, heroImage) {
  const contentW = bp.w - bp.margin * 2;
  const page = af(bp.name, 'VERTICAL');
  page.counterAxisSizingMode = 'FIXED';
  page.resize(bp.w, 100);
  page.primaryAxisSizingMode = 'AUTO';
  page.clipsContent = true;
  fill(page, 'color/bg');
  page.layoutGrids = [{
    pattern: 'COLUMNS', alignment: 'STRETCH', count: bp.cols, gutterSize: bp.gutter, offset: bp.margin,
    visible: true, color: { r: 1, g: 0.2, b: 0.2, a: 0.08 },
  }];

  function section(name, fillVar, padV) {
    const s = af(name, 'VERTICAL');
    add(page, s, 'FILL');
    padPx(s, null, bp.margin);
    pad(s, padV || 'space/xl', null);
    if (fillVar) fill(s, fillVar);
    return s;
  }

  // Header
  const header = af('Header', 'HORIZONTAL');
  add(page, header, 'FILL');
  header.primaryAxisAlignItems = 'SPACE_BETWEEN';
  header.counterAxisAlignItems = 'CENTER';
  padPx(header, null, bp.margin);
  pad(header, 'space/md', null);
  fill(header, 'color/bg');
  header.strokes = [paint('color/border')];
  header.strokeAlign = 'INSIDE';
  header.strokeTopWeight = 0; header.strokeRightWeight = 0; header.strokeLeftWeight = 0; header.strokeBottomWeight = 1;
  header.appendChild(K.logo());
  const actions = af('Actions', 'HORIZONTAL');
  actions.counterAxisAlignItems = 'CENTER';
  bind(actions, 'itemSpacing', bp.nav ? 'space/gap' : 'space/sm');
  header.appendChild(actions);
  if (bp.nav) {
    for (const l of ['Возможности', 'Как это работает', 'Отзывы']) actions.appendChild(await txt(l, 'body', 'color/text', { name: 'Nav link' }));
    actions.appendChild(K.button('Начать', 'Primary'));
  }
  const toggle = af('Theme toggle', 'HORIZONTAL');
  toggle.primaryAxisSizingMode = 'FIXED'; toggle.counterAxisSizingMode = 'FIXED';
  toggle.resize(44, 44);
  toggle.primaryAxisAlignItems = 'CENTER'; toggle.counterAxisAlignItems = 'CENTER';
  toggle.strokes = [paint('color/border')]; toggle.strokeWeight = 1;
  radius(toggle, 'radius/pill');
  toggle.appendChild(svgIcon(ICONS.moon, 'color/text', 'Moon'));
  actions.appendChild(toggle);
  if (!bp.nav) {
    const burger = af('Burger', 'HORIZONTAL');
    burger.primaryAxisSizingMode = 'FIXED'; burger.counterAxisSizingMode = 'FIXED';
    burger.resize(44, 44);
    burger.primaryAxisAlignItems = 'CENTER'; burger.counterAxisAlignItems = 'CENTER';
    burger.strokes = [paint('color/border')]; burger.strokeWeight = 1;
    radius(burger, 'radius/md');
    burger.appendChild(svgIcon(ICONS.menu, 'color/text', 'Menu'));
    actions.appendChild(burger);
  }

  // Hero: по центру → на десктопе две колонки (4.3)
  const hero = section('Hero', 'color/hero-bg', bp.heroPad);
  const heroInner = af('Hero inner', bp.heroRow ? 'HORIZONTAL' : 'VERTICAL');
  add(hero, heroInner, 'FILL');
  heroInner.counterAxisAlignItems = 'CENTER';
  bind(heroInner, 'itemSpacing', 'space/block');
  const heroText = af('Content', 'VERTICAL');
  add(heroInner, heroText, 'FILL');
  heroText.counterAxisAlignItems = bp.heroRow ? 'MIN' : 'CENTER';
  bind(heroText, 'itemSpacing', 'space/gap');
  const align = bp.heroRow ? 'LEFT' : 'CENTER';
  add(heroText, await txt('Станьте веб-разработчиком за 6 месяцев', bp.h1, 'color/text', { align: align, name: 'H1' }), 'FILL');
  const sub = await txt('Онлайн-курс с наставником: HTML, CSS, JavaScript и 5 проектов в портфолио к концу обучения', 'lead', 'color/text-muted', { align: align, name: 'Subtitle' });
  heroText.appendChild(sub);
  sub.layoutSizingHorizontal = 'FIXED';
  sub.resize(Math.min(640, bp.heroRow ? (contentW - 48) / 2 : contentW), sub.height);
  sub.textAutoResize = 'HEIGHT';
  heroText.appendChild(K.button('Попробовать бесплатно', 'Accent'));
  const photo = figma.createRectangle();
  photo.name = 'Photo';
  const photoW = bp.heroRow ? (contentW - 48) / 2 : Math.min(640, contentW);
  photo.resize(photoW, Math.round(photoW * 9 / 16));
  radius(photo, 'radius/lg');
  photo.fills = heroImage
    ? [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: heroImage.hash }]
    : [paint('color/border')];
  photo.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.12 }, offset: { x: 0, y: 12 }, radius: 24, spread: 0, visible: true, blendMode: 'NORMAL' }];
  heroInner.appendChild(photo);
  if (bp.heroRow) photo.layoutSizingHorizontal = 'FILL';

  // Features: 1 → 2 → 4 колонки
  const features = section('Features', 'color/bg');
  bind(features, 'itemSpacing', 'space/block');
  add(features, await txt('Возможности', 'h2', 'color/text', { align: 'CENTER', name: 'H2' }), 'FILL');
  grid(features, LR1.features.map(K.feature), bp.feat, contentW, 24, false);

  // How it works: 1 → 3 колонки
  const how = section('How it works', 'color/bg-alt');
  bind(how, 'itemSpacing', 'space/block');
  add(how, await txt('Как это работает', 'h2', 'color/text', { align: 'CENTER', name: 'H2' }), 'FILL');
  grid(how, LR1.steps.map(K.step), bp.how, contentW, 24, false);

  // Testimonials: 1 → 2 → 3 колонки, третий отзыв на планшете во всю ширину
  const reviews = section('Testimonials', 'color/bg');
  bind(reviews, 'itemSpacing', 'space/block');
  add(reviews, await txt('Отзывы', 'h2', 'color/text', { align: 'CENTER', name: 'H2' }), 'FILL');
  grid(reviews, LR1.reviews.map(K.review), bp.rev, contentW, 24, true);

  // CTA
  const cta = section('CTA', 'color/primary', 'space/2xl');
  cta.counterAxisAlignItems = 'CENTER';
  bind(cta, 'itemSpacing', 'space/gap');
  add(cta, await txt('Готовы начать?', 'h2', 'color/on-primary', { align: 'CENTER', name: 'H2' }), 'FILL');
  cta.appendChild(K.button('Присоединиться', 'Accent', 'Large'));

  // Footer
  const footer = af('Footer', bp.nav ? 'HORIZONTAL' : 'VERTICAL');
  add(page, footer, 'FILL');
  padPx(footer, null, bp.margin);
  pad(footer, 'space/lg', null);
  fill(footer, 'color/footer-bg');
  bind(footer, 'itemSpacing', 'space/md');
  footer.primaryAxisAlignItems = bp.nav ? 'SPACE_BETWEEN' : 'MIN';
  footer.counterAxisAlignItems = 'CENTER';
  footer.appendChild(await txt('© 2026 CodeStart', 'small', 'color/footer-text', { name: 'Copyright' }));
  const fnav = af('Footer nav', 'HORIZONTAL');
  bind(fnav, 'itemSpacing', 'space/md');
  footer.appendChild(fnav);
  fnav.appendChild(await txt('Политика конфиденциальности', 'small', 'color/footer-text'));
  fnav.appendChild(await txt('Контакты', 'small', 'color/footer-text'));

  return page;
}

// ----- токены на холсте -----

async function lr1TokensBoard(page) {
  const board = af('Токены', 'VERTICAL');
  board.itemSpacing = 32;
  padPx(board, 48, 48);
  board.fills = [{ type: 'SOLID', color: hex('#FFFFFF') }];
  page.appendChild(board);
  board.appendChild(await txt('Дизайн-токены (Local Variables)', 'h2', 'color/text'));

  board.appendChild(await txt('Colors', 'h3', 'color/text'));
  const sw = af('Swatches', 'HORIZONTAL');
  sw.layoutWrap = 'WRAP';
  sw.itemSpacing = 16; sw.counterAxisSpacing = 16;
  sw.primaryAxisSizingMode = 'FIXED';
  sw.resize(880, 100);
  board.appendChild(sw);
  for (const name in LR1.colors) {
    const cell = af(name, 'VERTICAL');
    cell.itemSpacing = 6;
    const r = figma.createRectangle();
    r.resize(96, 64);
    r.fills = [paint(name)];
    r.strokes = [{ type: 'SOLID', color: hex('#E5E7EB') }];
    r.cornerRadius = 8;
    cell.appendChild(r);
    cell.appendChild(await txt(name, 'caption', 'color/text'));
    cell.appendChild(await txt(LR1.colors[name][0], 'caption', 'color/text-muted'));
    sw.appendChild(cell);
  }

  board.appendChild(await txt('Spacing (8px grid)', 'h3', 'color/text'));
  for (const name in LR1.spacing) {
    const row = af(name, 'HORIZONTAL');
    row.itemSpacing = 16;
    row.counterAxisAlignItems = 'CENTER';
    const label = await txt(name + ' = ' + LR1.spacing[name], 'caption', 'color/text');
    row.appendChild(label);
    label.resize(140, label.height);
    label.textAutoResize = 'HEIGHT';
    const bar = figma.createRectangle();
    bar.resize(LR1.spacing[name], 16);
    bind(bar, 'width', name);
    bar.fills = [paint('color/primary')];
    row.appendChild(bar);
    board.appendChild(row);
  }

  board.appendChild(await txt('Radius', 'h3', 'color/text'));
  const rr = af('Radius', 'HORIZONTAL');
  rr.itemSpacing = 24;
  board.appendChild(rr);
  for (const name in LR1.radius) {
    const cell = af(name, 'VERTICAL');
    cell.itemSpacing = 6;
    const r = figma.createRectangle();
    r.resize(80, 80);
    r.fills = [paint('color/bg-alt')];
    r.strokes = [paint('color/primary')];
    radius(r, name);
    cell.appendChild(r);
    cell.appendChild(await txt(name, 'caption', 'color/text'));
    rr.appendChild(cell);
  }

  board.appendChild(await txt('Типографика: модульная шкала 1.25 (Major Third), база 16px', 'h3', 'color/text'));
  const d800 = S.h1d.fontName, b400 = S.body.fontName;
  for (const size of [76, 61, 49, 39, 31, 25, 20, 16, 12]) {
    const t = figma.createText();
    t.fontName = size >= 25 ? d800 : b400;
    t.fontSize = size;
    t.characters = size + 'px — ' + (size >= 25 ? 'Manrope' : 'Inter') + ' — Станьте веб-разработчиком';
    t.fills = [paint('color/text')];
    board.appendChild(t);
  }
  board.appendChild(await txt('Текстовые стили: LR1/Heading/*, LR1/Body/*, LR1/Button/* (панель Local styles)', 'body', 'color/text-muted'));
  return board;
}

async function lr1Moodboard(page) {
  const mb = figma.createFrame();
  mb.name = 'Мудборд';
  mb.resize(1440, 900);
  mb.fills = [{ type: 'SOLID', color: hex('#F3F4F6') }];
  page.appendChild(mb);
  const title = await txt('Мудборд: лендинг онлайн-курса CodeStart', 'h2', 'color/text');
  mb.appendChild(title);
  title.x = 48; title.y = 40;
  const hint = await txt('Вставь сюда 5–7 скриншотов референсов (Dribbble, Behance, Land-book) и подпиши источник', 'body', 'color/text-muted');
  mb.appendChild(hint);
  hint.x = 48; hint.y = 92;
  for (let i = 0; i < 6; i++) {
    const r = figma.createRectangle();
    r.name = 'Референс ' + (i + 1);
    r.resize(424, 330);
    r.x = 48 + (i % 3) * 456;
    r.y = 150 + Math.floor(i / 3) * 362;
    r.cornerRadius = 12;
    r.fills = [{ type: 'SOLID', color: hex('#FFFFFF') }];
    r.strokes = [{ type: 'SOLID', color: hex('#9CA3AF') }];
    r.dashPattern = [8, 6];
    mb.appendChild(r);
    const l = await txt('Референс ' + (i + 1), 'small', 'color/text-muted');
    mb.appendChild(l);
    l.x = r.x + 16; l.y = r.y + 16;
  }
  return mb;
}

async function buildLR1() {
  const page = figma.createPage();
  page.name = 'ЛР1 — CodeStart';
  await figma.setCurrentPageAsync(page);

  const vars = await lr1Variables();
  await lr1TextStyles();

  let heroImage = null;
  try { heroImage = await figma.createImageAsync(SITE + 'design-lr1/img/hero-students-800.jpg'); } catch (e) { heroImage = null; }

  const moodboard = await lr1Moodboard(page);
  const tokens = await lr1TokensBoard(page);
  const K = await lr1Components(page);
  placeRow([moodboard, tokens, K.area], 0, 0, 120);

  const mobile = await lr1Layout(LR1.bp.mobile, K, heroImage);
  const tablet = await lr1Layout(LR1.bp.tablet, K, heroImage);
  const desktop = await lr1Layout(LR1.bp.desktop, K, heroImage);
  for (const f of [mobile, tablet, desktop]) page.appendChild(f);
  const top = Math.max(moodboard.height, tokens.height, K.area.height) + 200;
  let x = placeRow([mobile, tablet, desktop], 0, top, 120);

  // Задание 1: тёмная тема — тот же макет с режимом Dark коллекции цветов
  let darkNote = '';
  if (vars.dark) {
    const darkFrame = desktop.clone();
    darkFrame.name = 'Desktop 1440 — Dark';
    darkFrame.setExplicitVariableModeForCollection(vars.colors, vars.dark);
    page.appendChild(darkFrame);
    darkFrame.x = x; darkFrame.y = top;
  } else {
    darkNote = ' Режим Dark не создан: на бесплатном плане Figma один режим у коллекции.';
  }

  figma.viewport.scrollAndZoomIntoView(page.children);
  return 'ЛР1 готова: переменные, текстовые стили, компоненты, макеты 375/768/1440.' + darkNote + (heroImage ? '' : ' Фото не загрузилось — заполнитель.');
}

// ---------- запуск ----------

(async function () {
  try {
    let msg = '';
    if (figma.command === 'lr1') msg = await buildLR1();
    else msg = 'Неизвестная команда';
    figma.closePlugin(msg);
  } catch (e) {
    console.error(e);
    figma.closePlugin('Ошибка: ' + (e && e.message ? e.message : e));
  }
})();

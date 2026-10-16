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

// ---------- дизайн-системы ЛР2 и ЛР4: общие помощники ----------

// области применения переменных: в пикерах Figma токен виден только там, где он нужен
const SCOPES = {
  bg: ['FRAME_FILL', 'SHAPE_FILL'],
  text: ['TEXT_FILL', 'SHAPE_FILL'],
  stroke: ['STROKE_COLOR'],
  any: ['ALL_FILLS', 'STROKE_COLOR', 'EFFECT_COLOR'],
};

// переменная с областью применения и CSS-именем (Dev Mode показывает var(--...))
function mkVar(collection, name, type, scopes, css) {
  const v = figma.variables.createVariable(name, collection, type);
  v.scopes = scopes;
  if (css) v.setVariableCodeSyntax('WEB', 'var(--' + css + ')');
  V[name] = v;
  return v;
}
function alias(name) { return { type: 'VARIABLE_ALIAS', id: V[name].id }; }

// коллекция с режимами Light/Dark; на бесплатном плане второй режим не создаётся
function themedCollection(name) {
  const c = figma.variables.createVariableCollection(name);
  const light = c.modes[0].modeId;
  c.renameMode(light, 'Light');
  let dark = null;
  try { dark = c.addMode('Dark'); } catch (e) { dark = null; }
  return { collection: c, light: light, dark: dark };
}
function valueCollection(name) {
  const c = figma.variables.createVariableCollection(name);
  c.renameMode(c.modes[0].modeId, 'Value');
  return { collection: c, mode: c.modes[0].modeId };
}

function shadowFx(y, blur, a) {
  return { type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: a }, offset: { x: 0, y: y }, radius: blur, spread: 0, visible: true, blendMode: 'NORMAL' };
}
// кольцо фокуса: тень без размытия с разбросом (аналог outline / box-shadow 0 0 0 3px)
function ringFx(h, a, spread) {
  const c = hex(h);
  return { type: 'DROP_SHADOW', color: { r: c.r, g: c.g, b: c.b, a: a }, offset: { x: 0, y: 0 }, radius: 0, spread: spread, visible: true, blendMode: 'NORMAL' };
}
let E = {}; // стили эффектов
function effectStyle(key, name, effects) {
  const s = figma.createEffectStyle();
  s.name = name;
  s.effects = effects;
  E[key] = s;
  return s;
}
async function fx(node, key) { await node.setEffectStyleIdAsync(E[key].id); }

// defs: ключ -> [имя, шрифт, размер, межстрочный %, переменная размера]
async function makeTextStyles(prefix, defs) {
  S = {};
  for (const k in defs) {
    const d = defs[k];
    await figma.loadFontAsync(d[1]);
    const st = figma.createTextStyle();
    st.name = prefix + d[0];
    st.fontName = d[1];
    st.fontSize = d[2];
    st.lineHeight = { unit: 'PERCENT', value: d[3] };
    if (d[4] && V[d[4]]) st.setBoundVariable('fontSize', V[d[4]]);
    S[k] = st;
  }
}

// компонент с Auto Layout
function cmp(name, dir) {
  const c = figma.createComponent();
  c.name = name;
  c.layoutMode = dir || 'HORIZONTAL';
  c.primaryAxisSizingMode = 'AUTO';
  c.counterAxisSizingMode = 'AUTO';
  c.fills = [];
  return c;
}
// компонент фиксированной ширины, высота по содержимому
function cmpW(name, dir, w) {
  const c = cmp(name, dir);
  c.resize(w, 40);
  if (c.layoutMode === 'VERTICAL') c.primaryAxisSizingMode = 'AUTO'; else c.counterAxisSizingMode = 'AUTO';
  return c;
}

// набор вариантов сеткой с переносом
function variantSet(comps, parent, name, width, description) {
  const set = figma.combineAsVariants(comps, parent);
  set.name = name;
  set.layoutMode = 'HORIZONTAL';
  set.layoutWrap = 'WRAP';
  set.itemSpacing = 16;
  set.counterAxisSpacing = 16;
  padPx(set, 24, 24);
  set.primaryAxisSizingMode = 'FIXED';
  set.resize(width, set.height);
  set.counterAxisSizingMode = 'AUTO';
  set.fills = [{ type: 'SOLID', color: hex('#FFFFFF') }];
  set.strokes = [{ type: 'SOLID', color: hex('#9747FF') }];
  set.dashPattern = [6, 4];
  set.cornerRadius = 8;
  if (description) set.description = description;
  return set;
}

function insideInstance(n, root) {
  for (let p = n.parent; p && p !== root; p = p.parent) if (p.type === 'INSTANCE') return true;
  return false;
}
// TEXT-свойство: ссылка из одноимённых текстовых слоёв компонента или каждого варианта набора
function textProp(owner, layerName, prop, value) {
  const key = owner.addComponentProperty(prop, 'TEXT', value);
  const roots = owner.type === 'COMPONENT_SET' ? owner.children : [owner];
  for (const r of roots) {
    for (const t of r.findAll(function (n) { return n.type === 'TEXT' && n.name === layerName && !insideInstance(n, r); })) {
      t.componentPropertyReferences = { characters: key };
    }
  }
  return key;
}
function propKey(owner, prop) {
  const defs = owner.componentPropertyDefinitions;
  for (const k in defs) if (k.split('#')[0] === prop) return k;
  return null;
}
// экземпляр варианта по значениям свойств: variant(set, {variant: 'primary', size: 'md'})
function variantOf(set, props) {
  return set.children.find(function (c) {
    const have = c.name.split(', ');
    for (const k in props) if (have.indexOf(k + '=' + props[k]) === -1) return false;
    return true;
  });
}
// экземпляр компонента или варианта набора с подстановкой TEXT-свойств
function inst(owner, props, texts) {
  const base = owner.type === 'COMPONENT_SET' ? variantOf(owner, props || {}) : owner;
  const i = base.createInstance();
  if (texts) {
    const p = {};
    for (const k in texts) { const key = propKey(owner, k); if (key) p[key] = texts[k]; }
    i.setProperties(p);
  }
  return i;
}

// прототип: While hovering → Change to (вариант hover)
const HOVER_T = { type: 'SMART_ANIMATE', easing: { type: 'EASE_OUT' }, duration: 0.15 };
async function hoverVariants(set, from, to) {
  let n = 0;
  for (const c of set.children) {
    if (c.name.indexOf(from) === -1) continue;
    const target = set.children.find(function (x) { return x.name === c.name.replace(from, to); });
    if (!target) continue;
    await c.setReactionsAsync([{ trigger: { type: 'ON_HOVER' }, actions: [{ type: 'NODE', destinationId: target.id, navigation: 'CHANGE_TO', transition: HOVER_T }] }]);
    n++;
  }
  return n;
}

// перекрасить векторы иконки (в т. ч. внутри экземпляра)
function tint(node, varName) {
  for (const v of node.findAll(function (x) { return x.type === 'VECTOR'; })) {
    if (v.strokes.length) v.strokes = [paint(varName)];
    if (v.fills.length) v.fills = [paint(varName)];
  }
}

function hug(frame) { frame.primaryAxisSizingMode = 'AUTO'; frame.counterAxisSizingMode = 'AUTO'; return frame; }
function box(name, w, h) {
  const f = af(name, 'HORIZONTAL');
  f.primaryAxisSizingMode = 'FIXED';
  f.counterAxisSizingMode = 'FIXED';
  f.resize(w, h);
  f.primaryAxisAlignItems = 'CENTER';
  f.counterAxisAlignItems = 'CENTER';
  return f;
}
function borderBottom(node, varName, w) {
  node.strokes = [paint(varName)];
  node.strokeAlign = 'INSIDE';
  node.strokeTopWeight = 0; node.strokeLeftWeight = 0; node.strokeRightWeight = 0; node.strokeBottomWeight = w;
}
function borderTop(node, varName, w) {
  node.strokes = [paint(varName)];
  node.strokeAlign = 'INSIDE';
  node.strokeBottomWeight = 0; node.strokeLeftWeight = 0; node.strokeRightWeight = 0; node.strokeTopWeight = w;
}
function stroke(node, varName, w, align) {
  node.strokes = [paint(varName)];
  node.strokeWeight = w;
  node.strokeAlign = align || 'INSIDE';
}
function tinted(varName, opacity) { return Object.assign({}, paint(varName), { opacity: opacity }); }

function imageRect(w, h, hash, placeholderVar) {
  const r = figma.createRectangle();
  r.name = 'Image';
  r.resize(w, h);
  r.fills = hash ? [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: hash }] : [paint(placeholderVar)];
  return r;
}
async function siteImage(path) {
  try { return (await figma.createImageAsync(SITE + path)).hash; } catch (e) { return null; }
}

// ----- доски с токенами -----

let DOC = {}; // текстовые стили и цвета подписей текущей дизайн-системы
async function doc(chars, kind, name) {
  if (kind === 'muted') return txt(chars, DOC.cap, DOC.muted, { name: name });
  return txt(chars, DOC[kind], DOC.text, { name: name });
}
async function docSection(parent, title, note) {
  const s = af(title, 'VERTICAL');
  s.itemSpacing = 40;
  padPx(s, 48, 48);
  s.fills = [{ type: 'SOLID', color: hex('#FFFFFF') }];
  s.cornerRadius = 24;
  parent.appendChild(s);
  s.appendChild(await doc(title, 'h2'));
  if (note) s.appendChild(await doc(note, 'body'));
  return s;
}
// группа: заголовок + ряд с переносом (или колонка)
async function docGroup(parent, title, vertical, width) {
  const g = af(title, 'VERTICAL');
  g.itemSpacing = 16;
  parent.appendChild(g);
  g.appendChild(await doc(title, 'h3'));
  const row = af('Items', vertical ? 'VERTICAL' : 'HORIZONTAL');
  row.itemSpacing = vertical ? 12 : 24;
  g.appendChild(row);
  if (!vertical) {
    row.layoutWrap = 'WRAP';
    row.counterAxisSpacing = 24;
    row.primaryAxisSizingMode = 'FIXED';
    row.resize(width || 1240, 10);
    row.counterAxisSizingMode = 'AUTO';
  }
  return row;
}
async function swatch(parent, varName, label, value) {
  const cell = af(varName, 'VERTICAL');
  cell.itemSpacing = 6;
  parent.appendChild(cell);
  const r = figma.createRectangle();
  r.name = 'Swatch';
  r.resize(136, 72);
  r.cornerRadius = 8;
  r.fills = [paint(varName)];
  r.strokes = [{ type: 'SOLID', color: hex('#E5E7EB') }];
  cell.appendChild(r);
  for (const s of [[label, 'cap'], [value, 'muted']]) {
    const t = await doc(s[0], s[1]);
    cell.appendChild(t);
    t.resize(136, t.height);
    t.textAutoResize = 'HEIGHT';
  }
}
async function docSpacing(parent, map, colorVar) {
  for (const name in map) {
    const row = af(name, 'HORIZONTAL');
    row.itemSpacing = 16;
    row.counterAxisAlignItems = 'CENTER';
    parent.appendChild(row);
    const label = await doc(name + ' = ' + map[name] + 'px', 'cap');
    row.appendChild(label);
    label.resize(160, label.height);
    label.textAutoResize = 'HEIGHT';
    const bar = figma.createRectangle();
    bar.name = 'Bar';
    bar.resize(map[name], 16);
    bind(bar, 'width', name);
    bar.fills = [paint(colorVar)];
    row.appendChild(bar);
  }
}
async function docRadius(parent, map, fillVar, strokeVar) {
  for (const name in map) {
    const cell = af(name, 'VERTICAL');
    cell.itemSpacing = 8;
    parent.appendChild(cell);
    const r = figma.createRectangle();
    r.resize(96, 96);
    r.fills = [paint(fillVar)];
    r.strokes = [paint(strokeVar)];
    r.strokeWeight = 2;
    radius(r, name);
    cell.appendChild(r);
    cell.appendChild(await doc(name + ' = ' + map[name], 'cap'));
  }
}
async function docShadows(parent, keys, fillVar) {
  for (const k of keys) {
    const cell = af(E[k].name, 'VERTICAL');
    cell.itemSpacing = 12;
    parent.appendChild(cell);
    const r = figma.createRectangle();
    r.resize(180, 110);
    r.cornerRadius = 12;
    r.fills = [paint(fillVar)];
    await fx(r, k);
    cell.appendChild(r);
    cell.appendChild(await doc(E[k].name, 'cap'));
  }
}
async function docType(parent, list, colorVar) {
  for (const d of list) {
    const row = af(d[0], 'VERTICAL');
    row.itemSpacing = 4;
    parent.appendChild(row);
    row.appendChild(await doc(d[1], 'muted'));
    row.appendChild(await txt(d[2] || 'Освойте IT-профессию с наставником', d[0], colorVar, { name: 'Sample' }));
  }
}
function rightOfContent(page, node, gap) {
  let x = 0;
  for (const n of page.children) if (n !== node) x = Math.max(x, n.x + n.width);
  node.x = page.children.length > 1 ? x + (gap || 200) : 0;
  node.y = 0;
}

// ---------- ЛР2: дизайн-система CodeStart (UI Kit) ----------

const LR2 = {
  // tokens.css: 2.1 + дополнение 9.2; gray-800 и white в CSS записаны литералами (#1F2937, #FFFFFF)
  primitives: {
    'blue-50': '#EFF6FF', 'blue-400': '#60A5FA', 'blue-500': '#3B82F6', 'blue-600': '#2563EB', 'blue-700': '#1D4ED8',
    'gray-50': '#F9FAFB', 'gray-100': '#F3F4F6', 'gray-300': '#D1D5DB', 'gray-500': '#6B7280', 'gray-700': '#374151',
    'gray-800': '#1F2937', 'gray-900': '#111827',
    'green-500': '#10B981', 'red-500': '#EF4444', 'amber-500': '#F59E0B', 'white': '#FFFFFF',
  },
  // семантика: [светлая тема, тёмная тема, область применения]
  semantic: {
    'color-bg': ['gray-50', 'gray-900', 'bg'],
    'color-surface': ['white', 'gray-800', 'bg'],
    'color-text': ['gray-900', 'gray-50', 'text'],
    'color-text-muted': ['gray-500', 'gray-300', 'text'],
    'color-border': ['gray-300', 'gray-700', 'stroke'],
    'color-primary': ['blue-600', 'blue-500', 'any'],
    'color-primary-hover': ['blue-700', 'blue-600', 'any'],
    'color-link': ['blue-600', 'blue-400', 'text'],
    'color-success': ['green-500', 'green-500', 'any'],
    'color-error': ['red-500', 'red-500', 'any'],
    'color-warning': ['amber-500', 'amber-500', 'any'],
    'color-action-bg': ['blue-600', 'blue-700', 'bg'],
    'color-action-bg-hover': ['blue-700', 'blue-600', 'bg'],
    'color-on-action': ['white', 'white', 'text'], // в CSS кнопок #fff
  },
  spacing: { 'space-1': 4, 'space-2': 8, 'space-3': 12, 'space-4': 16, 'space-6': 24, 'space-8': 32, 'space-12': 48, 'space-16': 64, 'space-24': 96 },
  radius: { 'radius-sm': 4, 'radius-md': 8, 'radius-lg': 16, 'radius-xl': 24, 'radius-pill': 999 },
  fontSize: { 'fs-xs': 12, 'fs-sm': 14, 'fs-base': 16, 'fs-lg': 18, 'fs-xl': 20, 'fs-2xl': 24, 'fs-3xl': 30, 'fs-4xl': 36, 'fs-5xl': 48, 'fs-6xl': 60 },
  type: [
    ['d6', '--fs-6xl · 60 / 1.15 · Manrope 800'], ['d5', '--fs-5xl · 48 / 1.15 · Manrope 800'], ['d4', '--fs-4xl · 36 / 1.15 · Manrope 800'],
    ['d3', '--fs-3xl · 30 / 1.3 · Manrope 700'], ['d2', '--fs-2xl · 24 / 1.3 · Manrope 700'], ['d1', '--fs-xl · 20 / 1.3 · Manrope 700'],
    ['lg', '--fs-lg · 18 / 1.6 · Inter 400'], ['base', '--fs-base · 16 / 1.6 · Inter 400'], ['sm', '--fs-sm · 14 / 1.6 · Inter 400'], ['xs', '--fs-xs · 12 / 1.6 · Inter 400'],
  ],
  pages: ['Главная', 'Курсы', 'Курс', 'Преподаватели', 'Контакты', 'Блог', 'Статья'],
};

async function lr2Variables() {
  const prim = valueCollection('LR2 Primitives');
  for (const name in LR2.primitives) mkVar(prim.collection, name, 'COLOR', [], name).setValueForMode(prim.mode, hex(LR2.primitives[name]));
  const color = themedCollection('LR2 Color');
  for (const name in LR2.semantic) {
    const d = LR2.semantic[name];
    const v = mkVar(color.collection, name, 'COLOR', SCOPES[d[2]], name);
    v.setValueForMode(color.light, alias(d[0]));
    if (color.dark) v.setValueForMode(color.dark, alias(d[1]));
  }
  const sp = valueCollection('LR2 Spacing');
  for (const name in LR2.spacing) mkVar(sp.collection, name, 'FLOAT', ['GAP', 'WIDTH_HEIGHT'], name).setValueForMode(sp.mode, LR2.spacing[name]);
  const rd = valueCollection('LR2 Radius');
  for (const name in LR2.radius) mkVar(rd.collection, name, 'FLOAT', ['CORNER_RADIUS'], name).setValueForMode(rd.mode, LR2.radius[name]);
  const ty = valueCollection('LR2 Typography');
  for (const name in LR2.fontSize) mkVar(ty.collection, name, 'FLOAT', ['FONT_SIZE'], name).setValueForMode(ty.mode, LR2.fontSize[name]);
  return color;
}

async function lr2Foundations() {
  const f = {
    d800: await pickFont('Manrope', ['ExtraBold', 'Extra Bold', 'Bold']),
    d700: await pickFont('Manrope', ['Bold', 'SemiBold', 'Semi Bold']),
    r: await pickFont('Inter', ['Regular']),
    m: await pickFont('Inter', ['Medium', 'Regular']),
    sb: await pickFont('Inter', ['Semi Bold', 'SemiBold', 'Medium']),
    b: await pickFont('Inter', ['Bold', 'Semi Bold', 'SemiBold']),
    xb: await pickFont('Inter', ['Extra Bold', 'ExtraBold', 'Bold']),
  };
  await makeTextStyles('LR2/', {
    d6: ['Display/6xl', f.d800, 60, 115, 'fs-6xl'],
    d5: ['Display/5xl', f.d800, 48, 115, 'fs-5xl'],
    d4: ['Display/4xl', f.d800, 36, 115, 'fs-4xl'],
    d3: ['Heading/3xl', f.d700, 30, 130, 'fs-3xl'],
    d2: ['Heading/2xl', f.d700, 24, 130, 'fs-2xl'],
    d1: ['Heading/xl', f.d700, 20, 130, 'fs-xl'],
    lg: ['Body/lg', f.r, 18, 160, 'fs-lg'],
    base: ['Body/base', f.r, 16, 160, 'fs-base'],
    sm: ['Body/sm', f.r, 14, 160, 'fs-sm'],
    xs: ['Body/xs', f.r, 12, 160, 'fs-xs'],
    label: ['Label/field', f.m, 14, 160, 'fs-sm'],
    nav: ['Label/nav', f.m, 16, 160, 'fs-base'],
    badge: ['Label/badge', f.sb, 12, 160, 'fs-xs'],
    role: ['Label/role', f.sb, 14, 160, 'fs-sm'],
    price: ['Label/price', f.b, 16, 160, 'fs-base'],
    btnSm: ['Button/sm', f.sb, 14, 100, 'fs-sm'],
    btn: ['Button/md', f.sb, 16, 100, 'fs-base'],
    btnLg: ['Button/lg', f.sb, 18, 100, 'fs-lg'],
  });
  E = {};
  effectStyle('sm', 'LR2/shadow-sm', [shadowFx(1, 2, 0.05)]);
  effectStyle('md', 'LR2/shadow-md', [shadowFx(4, 12, 0.08)]);
  effectStyle('lg', 'LR2/shadow-lg', [shadowFx(12, 24, 0.12)]);
  effectStyle('focus', 'LR2/focus-ring', [ringFx('#2563EB', 1, 3)]);
  effectStyle('focusInput', 'LR2/focus-input', [ringFx('#2563EB', 0.15, 3)]);
  DOC = { h2: 'd4', h3: 'd1', body: 'base', cap: 'xs', text: 'color-text', muted: 'color-text-muted' };
  return f;
}

// 6.1: variant × state × size
async function lr2Buttons(parent) {
  const sizes = { sm: ['space-2', 'space-4', 'btnSm'], md: ['space-3', 'space-6', 'btn'], lg: ['space-4', 'space-8', 'btnLg'] };
  const comps = [];
  for (const variant of ['primary', 'secondary', 'ghost']) for (const state of ['default', 'hover', 'focus', 'disabled']) for (const size of ['sm', 'md', 'lg']) {
    const c = cmp('variant=' + variant + ', state=' + state + ', size=' + size);
    c.primaryAxisAlignItems = 'CENTER';
    c.counterAxisAlignItems = 'CENTER';
    bind(c, 'itemSpacing', 'space-2');
    pad(c, sizes[size][0], sizes[size][1]);
    radius(c, 'radius-md');
    const hover = state === 'hover';
    let bg = null, border = null, fg = 'color-text';
    if (variant === 'primary') { bg = hover ? 'color-action-bg-hover' : 'color-action-bg'; border = bg; fg = 'color-on-action'; }
    if (variant === 'secondary') {
      if (hover) { bg = 'color-action-bg-hover'; border = bg; fg = 'color-on-action'; } else { border = 'color-primary'; fg = 'color-primary'; }
    }
    if (variant === 'ghost' && hover) bg = 'color-surface';
    c.fills = bg ? [paint(bg)] : [];
    if (border) stroke(c, border, 2, 'OUTSIDE'); // border: 2px solid — снаружи, как box-sizing кнопки
    if (state === 'focus') await fx(c, 'focus');
    if (state === 'disabled') c.opacity = 0.5;
    c.appendChild(await txt('Кнопка', sizes[size][2], fg, { name: 'Label' }));
    comps.push(c);
  }
  const set = variantSet(comps, parent, 'Button', 1320, 'Кнопка (6.1). variant: primary / secondary / ghost, state: default / hover / focus / disabled, size: sm / md / lg. Цвета, отступы и радиус — переменные LR2.');
  textProp(set, 'Label', 'Label', 'Кнопка');
  await hoverVariants(set, 'state=default', 'state=hover');
  return set;
}

async function lr2Badge(parent) {
  const c = cmp('Badge');
  pad(c, 'space-1', 'space-3');
  radius(c, 'radius-pill');
  c.fills = [tinted('color-primary', 0.12)]; // color-mix(primary 12%)
  c.appendChild(await txt('С нуля', 'badge', 'color-text', { name: 'Label' }));
  parent.appendChild(c);
  textProp(c, 'Label', 'Label', 'С нуля');
  c.description = 'Бейдж уровня курса (.badge)';
  return c;
}

// 6.3: Text input, Textarea, Select × состояния; Checkbox; поле формы
async function lr2Inputs(parent) {
  const chevron = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
  const kinds = { text: 'Ваше имя', textarea: 'Расскажите, чему хотите научиться', select: 'Выберите курс' };
  const comps = [];
  for (const kind in kinds) for (const state of ['default', 'focus', 'error', 'disabled']) {
    const c = cmp('type=' + kind + ', state=' + state);
    c.resize(320, kind === 'textarea' ? 140 : 48);
    if (kind !== 'textarea') c.counterAxisSizingMode = 'AUTO';
    pad(c, 'space-3', 'space-4');
    radius(c, 'radius-md');
    fill(c, 'color-surface');
    stroke(c, state === 'focus' ? 'color-primary' : state === 'error' ? 'color-error' : 'color-border', 2);
    if (state === 'focus') await fx(c, 'focusInput');
    if (state === 'disabled') c.opacity = 0.5;
    c.primaryAxisAlignItems = kind === 'select' ? 'SPACE_BETWEEN' : 'MIN';
    c.counterAxisAlignItems = kind === 'textarea' ? 'MIN' : 'CENTER';
    const value = state === 'focus' || state === 'error';
    c.appendChild(await txt(value && kind === 'text' ? (state === 'error' ? 'ivan@' : 'Иван') : kinds[kind], 'base', value && kind === 'text' ? 'color-text' : 'color-text-muted', { name: 'Value' }));
    if (kind === 'select') c.appendChild(svgIcon(chevron, 'color-text-muted', 'Chevron'));
    comps.push(c);
  }
  const set = variantSet(comps, parent, 'Input', 1440, 'Поля ввода (6.3): text / textarea / select × default / focus / error / disabled. Фокус — рамка primary и кольцо 3px 15%.');

  const check = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  const cbs = [];
  for (const checked of [false, true]) for (const state of ['default', 'disabled']) {
    const c = cmp('checked=' + checked + ', state=' + state);
    c.counterAxisAlignItems = 'CENTER';
    bind(c, 'itemSpacing', 'space-3');
    const b = box('Box', 20, 20);
    radius(b, 'radius-sm');
    if (checked) { fill(b, 'color-primary'); b.appendChild(svgIcon(check, 'color-on-action', 'Check')); }
    else { fill(b, 'color-surface'); stroke(b, 'color-border', 2); }
    c.appendChild(b);
    c.appendChild(await txt('Согласен на обработку персональных данных', 'sm', 'color-text-muted', { name: 'Label' }));
    if (state === 'disabled') c.opacity = 0.5;
    cbs.push(c);
  }
  const cbSet = variantSet(cbs, parent, 'Checkbox', 760, 'Чекбокс согласия в формах (.checkbox)');
  textProp(cbSet, 'Label', 'Label', 'Согласен на обработку персональных данных');

  const field = cmp('Form field', 'VERTICAL');
  bind(field, 'itemSpacing', 'space-2');
  field.appendChild(await txt('Имя', 'label', 'color-text', { name: 'Label' }));
  field.appendChild(inst(set, { type: 'text', state: 'default' }));
  field.appendChild(await txt('Как к вам обращаться', 'sm', 'color-text-muted', { name: 'Hint' }));
  parent.appendChild(field);
  textProp(field, 'Label', 'Label', 'Имя');
  textProp(field, 'Hint', 'Hint', 'Как к вам обращаться');
  field.description = 'Поле формы: подпись + Input + подсказка (.field)';
  return { input: set, checkbox: cbSet, field: field };
}

// изображения для карточек берутся из захваченных макетов страницы «Макеты»
async function capturedImage(frameName, minW, square) {
  const page = figma.root.children.find(function (p) { return p.name === 'Макеты'; });
  if (!page) return null;
  await page.loadAsync();
  const f = page.children.find(function (n) { return n.name === frameName; });
  if (!f) return null;
  const n = f.findOne(function (x) {
    return 'fills' in x && Array.isArray(x.fills) && x.fills.some(function (p) { return p.type === 'IMAGE'; }) &&
      x.width >= minW && (!square || Math.abs(x.width - x.height) < 4);
  });
  return n ? n.fills.find(function (p) { return p.type === 'IMAGE'; }).imageHash : null;
}

async function lr2CardBody(c) {
  const body = af('Body', 'VERTICAL');
  add(c, body, 'FILL');
  pad(body, 'space-6', 'space-6');
  bind(body, 'itemSpacing', 'space-2');
  return body;
}

// 6.2: Course Card (default/hover), Blog Post Card, Teacher Card
async function lr2Cards(parent, badge) {
  const img = {
    course: await capturedImage('Курсы — Desktop 1440', 300),
    post: await capturedImage('Блог — Desktop 1440', 300),
    teacher: await capturedImage('Преподаватели — Desktop 1440', 200, true),
  };
  const courses = [];
  for (const state of ['default', 'hover']) {
    const c = cmpW('state=' + state, 'VERTICAL', 360);
    fill(c, 'color-surface');
    radius(c, 'radius-lg');
    c.clipsContent = true;
    await fx(c, state === 'hover' ? 'lg' : 'sm');
    c.appendChild(imageRect(360, 203, img.course, 'color-border'));
    const body = await lr2CardBody(c);
    body.appendChild(badge.createInstance());
    add(body, await txt('Frontend-разработчик', 'd1', state === 'hover' ? 'color-primary' : 'color-text', { name: 'Title' }), 'FILL');
    add(body, await txt('Вёрстка, JavaScript и React: от первой страницы до SPA', 'base', 'color-text-muted', { name: 'Text' }), 'FILL');
    const meta = af('Meta', 'HORIZONTAL');
    add(body, meta, 'FILL');
    meta.primaryAxisAlignItems = 'SPACE_BETWEEN';
    meta.counterAxisAlignItems = 'CENTER';
    meta.appendChild(await txt('8 месяцев', 'sm', 'color-text-muted', { name: 'Duration' }));
    meta.appendChild(await txt('6 900 ₽/мес', 'price', 'color-text', { name: 'Price' }));
    courses.push(c);
  }
  const courseSet = variantSet(courses, parent, 'Course Card', 800, 'Карточка курса (6.2): hover — тень shadow-lg и заголовок primary (While hovering → Change to).');
  for (const p of [['Title', 'Frontend-разработчик'], ['Text', 'Вёрстка, JavaScript и React: от первой страницы до SPA'], ['Duration', '8 месяцев'], ['Price', '6 900 ₽/мес']]) textProp(courseSet, p[0], p[0], p[1]);
  await hoverVariants(courseSet, 'state=default', 'state=hover');

  const post = cmpW('Blog Post Card', 'VERTICAL', 360);
  fill(post, 'color-surface');
  radius(post, 'radius-lg');
  post.clipsContent = true;
  await fx(post, 'sm');
  post.appendChild(imageRect(360, 203, img.post, 'color-border'));
  let body = await lr2CardBody(post);
  add(body, await txt('12 сентября 2026 · 7 мин', 'sm', 'color-text-muted', { name: 'Meta' }), 'FILL');
  add(body, await txt('Как найти первую работу в IT без опыта', 'd1', 'color-text', { name: 'Title' }), 'FILL');
  add(body, await txt('Разбираем, с чего начать, как собрать портфолио и пройти первое собеседование', 'base', 'color-text-muted', { name: 'Text' }), 'FILL');
  parent.appendChild(post);
  for (const p of [['Meta', '12 сентября 2026 · 7 мин'], ['Title', 'Как найти первую работу в IT без опыта'], ['Text', 'Разбираем, с чего начать, как собрать портфолио и пройти первое собеседование']]) textProp(post, p[0], p[0], p[1]);
  post.description = 'Карточка статьи блога';

  const teacher = cmpW('Teacher Card', 'VERTICAL', 280);
  fill(teacher, 'color-surface');
  radius(teacher, 'radius-lg');
  teacher.clipsContent = true;
  await fx(teacher, 'sm');
  teacher.appendChild(imageRect(280, 280, img.teacher, 'color-border'));
  body = await lr2CardBody(teacher);
  add(body, await txt('Елена Иванова', 'd1', 'color-text', { name: 'Name' }), 'FILL');
  add(body, await txt('Frontend-разработчик', 'role', 'color-link', { name: 'Role' }), 'FILL');
  add(body, await txt('10 лет в разработке, тимлид фронтенда в финтехе', 'base', 'color-text-muted', { name: 'Text' }), 'FILL');
  parent.appendChild(teacher);
  for (const p of [['Name', 'Елена Иванова'], ['Role', 'Frontend-разработчик'], ['Text', '10 лет в разработке, тимлид фронтенда в финтехе']]) textProp(teacher, p[0], p[0], p[1]);
  teacher.description = 'Карточка преподавателя: квадратное фото, роль цветом ссылки (.card__role)';
  return { course: courseSet, post: post, teacher: teacher, images: img };
}

// Navigation: Header и Footer со страницы «Макеты», хлебные крошки, пагинация
async function lr2Navigation(parent) {
  const made = [];
  const mk = figma.root.children.find(function (p) { return p.name === 'Макеты'; });
  if (mk) {
    await mk.loadAsync();
    const hs = mk.findOne(function (n) { return n.type === 'COMPONENT_SET' && n.name === 'Header'; });
    const fs = mk.findOne(function (n) { return n.type === 'COMPONENT_SET' && n.name === 'Footer'; });
    for (const s of [[hs, 'Breakpoint=Desktop, Page=Главная'], [hs, 'Breakpoint=Mobile, Page=Курсы'], [fs, 'Breakpoint=Desktop']]) {
      if (!s[0]) continue;
      const v = s[0].children.find(function (c) { return c.name === s[1]; });
      if (v) { const i = v.createInstance(); parent.appendChild(i); made.push(i.name); }
    }
  }

  const crumbs = cmp('Breadcrumbs');
  bind(crumbs, 'itemSpacing', 'space-2');
  for (const it of [['Главная', 'link'], ['/', 'sep'], ['Курсы', 'link'], ['/', 'sep'], ['Frontend-разработчик', 'current']]) {
    const t = await txt(it[0], 'sm', it[1] === 'link' ? 'color-link' : it[1] === 'sep' ? 'color-border' : 'color-text-muted', { name: it[1] === 'current' ? 'Current' : it[0] });
    if (it[1] === 'link') t.textDecoration = 'UNDERLINE';
    crumbs.appendChild(t);
  }
  parent.appendChild(crumbs);
  textProp(crumbs, 'Current', 'Current', 'Frontend-разработчик');
  crumbs.description = 'Хлебные крошки внутренних страниц';

  const items = [];
  for (const state of ['default', 'hover', 'current']) {
    const c = cmp('state=' + state);
    c.resize(44, 44);
    c.primaryAxisSizingMode = 'AUTO';
    c.minWidth = 44;
    c.primaryAxisAlignItems = 'CENTER';
    c.counterAxisAlignItems = 'CENTER';
    pad(c, null, 'space-3');
    radius(c, 'radius-md');
    stroke(c, state === 'default' ? 'color-border' : state === 'hover' ? 'color-primary' : 'color-action-bg', 1);
    if (state === 'current') fill(c, 'color-action-bg');
    c.appendChild(await txt('2', 'base', state === 'current' ? 'color-on-action' : state === 'hover' ? 'color-primary' : 'color-text', { name: 'Label' }));
    items.push(c);
  }
  const item = variantSet(items, parent, 'Pagination item', 260, 'Кнопка пагинации');
  textProp(item, 'Label', 'Label', '2');
  await hoverVariants(item, 'state=default', 'state=hover');
  const pg = cmp('Pagination');
  bind(pg, 'itemSpacing', 'space-2');
  pg.appendChild(inst(item, { state: 'current' }, { Label: '1' }));
  pg.appendChild(inst(item, { state: 'default' }, { Label: '2' }));
  pg.appendChild(inst(item, { state: 'default' }, { Label: '→' }));
  parent.appendChild(pg);
  return made;
}

async function buildLR2Kit() {
  let page = figma.root.children.find(function (p) { return p.name === 'Design System'; });
  if (!page) { page = figma.createPage(); page.name = 'Design System'; }
  await figma.setCurrentPageAsync(page);

  const color = await lr2Variables();
  const fonts = await lr2Foundations();

  const kit = af('UI Kit — CodeStart', 'VERTICAL');
  kit.itemSpacing = 64;
  padPx(kit, 64, 64);
  kit.fills = [{ type: 'SOLID', color: hex('#F3F4F6') }];
  page.appendChild(kit);
  kit.appendChild(await txt('UI Kit — онлайн-школа CodeStart (ЛР2)', 'd6', 'color-text', { name: 'Title' }));

  // Colors
  let s = await docSection(kit, 'Colors', 'Примитивы (--blue-600) → семантика (--color-primary). Компоненты используют только семантические токены (LR2 Color, режимы Light / Dark).');
  let g = await docGroup(s, 'Примитивные токены (LR2 Primitives)');
  for (const n in LR2.primitives) await swatch(g, n, '--' + n, LR2.primitives[n]);
  g = await docGroup(s, 'Семантические токены (LR2 Color): светлая / тёмная тема');
  for (const n in LR2.semantic) await swatch(g, n, '--' + n, LR2.semantic[n][0] + ' / ' + LR2.semantic[n][1]);

  // Typography
  s = await docSection(kit, 'Typography', 'Manrope — заголовки, Inter — текст. Текстовые стили LR2/*, размер шрифта привязан к переменным --fs-*.');
  g = await docGroup(s, 'Размеры (--fs-*)', true);
  await docType(g, LR2.type, 'color-text');
  g = await docGroup(s, 'Начертания (--fw-*)');
  for (const w of [['400 regular', fonts.r], ['500 medium', fonts.m], ['600 semibold', fonts.sb], ['700 bold', fonts.b], ['800 black', fonts.xb]]) {
    await figma.loadFontAsync(w[1]);
    const t = figma.createText();
    t.fontName = w[1];
    t.fontSize = 20;
    t.characters = 'Inter ' + w[0];
    t.fills = [paint('color-text')];
    g.appendChild(t);
  }

  // Spacing / Radius / Shadows
  s = await docSection(kit, 'Spacing, Radius, Shadows', 'Отступы по сетке 8pt (--space-*), радиусы (--radius-*), тени (--shadow-*) из tokens.css 2.3.');
  g = await docGroup(s, 'Отступы', true);
  await docSpacing(g, LR2.spacing, 'color-primary');
  g = await docGroup(s, 'Радиусы');
  await docRadius(g, LR2.radius, 'color-bg', 'color-primary');
  g = await docGroup(s, 'Тени и фокус');
  await docShadows(g, ['sm', 'md', 'lg', 'focus'], 'color-surface');

  // Buttons
  s = await docSection(kit, 'Buttons', 'Primary, Secondary, Ghost × Default / Hover / Focus / Disabled × sm / md / lg. В прототипе Default → Hover по наведению.');
  const buttons = await lr2Buttons(s);

  // Inputs
  s = await docSection(kit, 'Inputs', 'Text input, Textarea, Select, Checkbox и поле формы с подписью.');
  const inputs = await lr2Inputs(s);

  // Cards
  s = await docSection(kit, 'Cards', 'Course Card (с hover-вариантом), Blog Post Card, Teacher Card. Тексты — свойства компонента.');
  const cardRow = af('Cards', 'HORIZONTAL');
  cardRow.itemSpacing = 32;
  cardRow.counterAxisAlignItems = 'MIN';
  s.appendChild(cardRow);
  const badge = await lr2Badge(cardRow);
  const cards = await lr2Cards(cardRow, badge);

  // Navigation
  s = await docSection(kit, 'Navigation', 'Header (активная страница), Footer — экземпляры компонентов со страницы «Макеты»; хлебные крошки и пагинация.');
  const nav = await lr2Navigation(s);

  // Тёмная тема: те же компоненты с режимом Dark коллекции LR2 Color
  let darkNote = ' Режим Dark не создан: на бесплатном плане у коллекции один режим.';
  if (color.dark) {
    s = await docSection(kit, 'Dark theme', 'Те же экземпляры с режимом Dark коллекции LR2 Color.');
    const row = af('Dark preview', 'HORIZONTAL');
    row.itemSpacing = 32;
    padPx(row, 32, 32);
    row.cornerRadius = 16;
    fill(row, 'color-bg');
    s.appendChild(row);
    row.appendChild(inst(buttons, { variant: 'primary', state: 'default', size: 'md' }));
    row.appendChild(inst(buttons, { variant: 'secondary', state: 'default', size: 'md' }));
    row.appendChild(inst(inputs.input, { type: 'text', state: 'focus' }));
    row.appendChild(inst(cards.course, { state: 'default' }));
    row.setExplicitVariableModeForCollection(color.collection, color.dark);
    darkNote = '';
  }

  rightOfContent(page, kit);
  figma.viewport.scrollAndZoomIntoView([kit]);
  const noImg = Object.keys(cards.images).filter(function (k) { return !cards.images[k]; });
  return 'ЛР2 UI Kit готов: переменные, стили, Button (' + buttons.children.length + ' вариантов), Input, Checkbox, карточки, навигация (' + nav.length + ' экз.).' +
    darkNote + (noImg.length ? ' Нет фото для: ' + noImg.join(', ') + ' (нет страницы «Макеты»).' : '');
}

// ---------- ЛР2: интерактивный прототип (шаг 4) ----------

const LR2_LINKS = {
  'Главная': 'Главная', 'Курсы': 'Курсы', 'Преподаватели': 'Преподаватели', 'Блог': 'Блог', 'Контакты': 'Контакты',
  'Войти': 'Контакты', 'Все курсы': 'Курсы', 'Выбрать курс': 'Курсы', 'Оставить заявку': 'Контакты', 'Получить консультацию': 'Контакты',
  'Frontend-разработчик': 'Курс', 'Веб-дизайнер': 'Курс', 'Python-разработчик': 'Курс', 'Аналитик данных': 'Курс', 'JavaScript Pro': 'Курс', 'UX-исследователь': 'Курс',
  'Как найти первую работу в IT без опыта': 'Статья', 'Рабочее место разработчика: что нужно на старте': 'Статья', 'Портфолио фронтендера: 5 проектов для старта': 'Статья',
};
const NAV_T = { type: 'SMART_ANIMATE', easing: { type: 'EASE_OUT' }, duration: 0.25 };
const MENU_T = { type: 'MOVE_IN', direction: 'LEFT', matchLayers: false, easing: { type: 'EASE_OUT' }, duration: 0.25 };

function navigate(id) { return { type: 'NODE', destinationId: id, navigation: 'NAVIGATE', transition: NAV_T, resetScrollPosition: true }; }
// кликабельный слой: ссылка-обёртка текста, если она есть
function clickable(t) {
  const p = t.parent;
  return p && (p.type === 'FRAME') && p.children.length === 1 ? p : t;
}

async function buildLR2Prototype() {
  const page = figma.root.children.find(function (p) { return p.name === 'Макеты'; });
  if (!page) return 'Нет страницы «Макеты» — сначала нужны макеты ЛР2.';
  await figma.setCurrentPageAsync(page);

  // переменные UI Kit, если он уже собран
  for (const v of await figma.variables.getLocalVariablesAsync()) V[v.name] = v;
  const solid = function (name, h) { return V[name] ? paint(name) : { type: 'SOLID', color: hex(h) }; };

  const frames = {}; // 'Главная|Desktop' -> frame
  for (const n of page.children) {
    const m = n.type === 'FRAME' && n.name.match(/^(.+) — (Desktop|Tablet|Mobile) \d+$/);
    if (m) { frames[m[1] + '|' + m[2]] = n; n.clipsContent = true; }
  }
  const dest = function (ru, bp) { const f = frames[ru + '|' + bp]; return f ? f.id : null; };
  let links = 0;

  // мобильное меню (4.3): оверлей, Move In справа
  let menu = page.children.find(function (n) { return n.name === 'Menu Open — Mobile 375'; });
  if (!menu && frames['Главная|Mobile']) {
    const d700 = await pickFont('Manrope', ['Bold', 'SemiBold', 'Semi Bold']);
    await figma.loadFontAsync(d700);
    menu = figma.createFrame();
    menu.name = 'Menu Open — Mobile 375';
    menu.resize(375, 812);
    menu.layoutMode = 'VERTICAL';
    menu.primaryAxisSizingMode = 'FIXED';
    menu.counterAxisSizingMode = 'FIXED';
    menu.paddingTop = menu.paddingBottom = menu.paddingLeft = menu.paddingRight = 16;
    menu.itemSpacing = 48;
    menu.fills = [solid('color-bg', '#F9FAFB')];
    page.appendChild(menu);
    const close = figma.createFrame();
    close.name = 'Закрыть меню';
    close.resize(44, 44);
    close.cornerRadius = 999;
    close.strokes = [solid('color-border', '#D1D5DB')];
    close.fills = [];
    close.layoutMode = 'HORIZONTAL';
    close.primaryAxisAlignItems = 'CENTER';
    close.counterAxisAlignItems = 'CENTER';
    close.appendChild(figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>'));
    const top = figma.createFrame();
    top.name = 'Top';
    top.layoutMode = 'HORIZONTAL';
    top.primaryAxisAlignItems = 'MAX';
    top.fills = [];
    menu.appendChild(top);
    top.layoutSizingHorizontal = 'FILL';
    top.layoutSizingVertical = 'HUG';
    top.appendChild(close);
    await close.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'CLOSE' }] }]);
    const navCol = figma.createFrame();
    navCol.name = 'Mobile nav';
    navCol.layoutMode = 'VERTICAL';
    navCol.itemSpacing = 24;
    navCol.fills = [];
    navCol.primaryAxisSizingMode = 'AUTO';
    navCol.counterAxisSizingMode = 'AUTO';
    menu.appendChild(navCol);
    for (const ru of ['Главная', 'Курсы', 'Преподаватели', 'Блог', 'Контакты']) {
      const t = figma.createText();
      t.fontName = d700;
      t.fontSize = 30;
      t.characters = ru;
      t.fills = [solid('color-text', '#111827')];
      navCol.appendChild(t);
      if (dest(ru, 'Mobile')) { await t.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [navigate(dest(ru, 'Mobile'))] }]); links++; }
    }
    const mob = frames['Главная|Mobile'];
    menu.x = mob.x + mob.width + 80;
    menu.y = mob.y;
  }

  // Header и Footer: связи в главных компонентах, экземпляры на всех страницах получают их автоматически
  const sets = page.findAll(function (n) { return n.type === 'COMPONENT_SET' && (n.name === 'Header' || n.name === 'Footer'); });
  let burgers = 0;
  for (const set of sets) for (const v of set.children) {
    const bp = (v.name.match(/Breakpoint=(\w+)/) || [])[1];
    if (!bp) continue;
    for (const t of v.findAll(function (n) { return n.type === 'TEXT' && !insideInstance(n, v); })) {
      const ru = LR2_LINKS[t.characters.trim()];
      if (ru && dest(ru, bp)) { await clickable(t).setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [navigate(dest(ru, bp))] }]); links++; }
    }
    const logo = v.findOne(function (n) { return n.type === 'INSTANCE' && n.name === 'Logo'; });
    if (logo && dest('Главная', bp)) { await logo.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [navigate(dest('Главная', bp))] }]); links++; }
    if (set.name === 'Header' && bp === 'Mobile' && menu) {
      const squares = v.findAll(function (n) { return (n.type === 'FRAME' || n.type === 'INSTANCE') && Math.abs(n.width - 44) < 1 && Math.abs(n.height - 44) < 1; });
      squares.sort(function (a, b) { return a.absoluteTransform[0][2] - b.absoluteTransform[0][2]; });
      const burger = squares[squares.length - 1];
      if (burger) {
        await burger.setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [{ type: 'NODE', destinationId: menu.id, navigation: 'OVERLAY', transition: MENU_T }] }]);
        burgers++;
      }
    }
  }

  // ссылки в содержимом страниц: кнопки, карточки курсов и статей, хлебные крошки
  for (const key in frames) {
    const f = frames[key];
    const bp = key.split('|')[1];
    for (const t of f.findAllWithCriteria({ types: ['TEXT'] })) {
      if (insideInstance(t, f)) continue;
      const ru = LR2_LINKS[t.characters.trim()];
      const id = ru && dest(ru, bp);
      if (!id || id === f.id) continue;
      await clickable(t).setReactionsAsync([{ trigger: { type: 'ON_CLICK' }, actions: [navigate(id)] }]);
      links++;
    }
  }

  const starts = [];
  for (const bp of ['Desktop', 'Tablet', 'Mobile']) if (frames['Главная|' + bp]) starts.push({ nodeId: frames['Главная|' + bp].id, name: bp });
  page.flowStartingPoints = starts;
  return 'Прототип ЛР2: ' + links + ' переходов (On Click → Navigate, Smart Animate 250 мс), бургер → оверлей меню (' + burgers + '), потоки: ' + starts.map(function (s) { return s.name; }).join(', ') + '.';
}

// ---------- ЛР4: дизайн-система EduKit ----------

const LR4 = {
  // tokens/colors.json (primitive) — имена переменных как в Style Dictionary: --color-primitive-blue-600
  primitives: {
    'blue/50': '#EFF6FF', 'blue/100': '#DBEAFE', 'blue/300': '#93C5FD', 'blue/400': '#60A5FA', 'blue/500': '#3B82F6', 'blue/600': '#2563EB', 'blue/700': '#1D4ED8',
    'gray/50': '#F9FAFB', 'gray/100': '#F3F4F6', 'gray/300': '#D1D5DB', 'gray/500': '#6B7280', 'gray/700': '#374151', 'gray/800': '#1F2937', 'gray/900': '#111827',
    'green/100': '#D1FAE5', 'green/400': '#34D399', 'green/700': '#047857', 'green/900': '#064E3B',
    'amber/100': '#FEF3C7', 'amber/400': '#FBBF24', 'amber/800': '#92400E', 'amber/900': '#78350F',
    'red/100': '#FEE2E2', 'red/400': '#F87171', 'red/600': '#DC2626', 'red/700': '#B91C1C', 'red/900': '#7F1D1D',
    'white': '#FFFFFF',
  },
  // tokens/colors.json (semantic) и tokens-dark/colors.json: [светлая, тёмная, область]
  semantic: {
    'background/default': ['gray/50', 'gray/900', 'bg'],
    'background/surface': ['white', 'gray/800', 'bg'],
    'background/muted': ['gray/100', 'gray/700', 'bg'],
    'text/default': ['gray/900', 'gray/50', 'text'],
    'text/muted': ['gray/500', 'gray/300', 'text'],
    'border/default': ['gray/300', 'gray/700', 'stroke'],
    'action/primary': ['blue/600', 'blue/400', 'any'],
    'action/primary-hover': ['blue/700', 'blue/300', 'any'],
    'action/on-primary': ['white', 'gray/900', 'text'],
    'action/danger': ['red/600', 'red/400', 'any'],
    'action/danger-hover': ['red/700', 'red/100', 'any'],
    'feedback/info-bg': ['blue/100', 'blue/700', 'bg'],
    'feedback/info-text': ['blue/700', 'blue/50', 'text'],
    'feedback/success-bg': ['green/100', 'green/900', 'bg'],
    'feedback/success-text': ['green/700', 'green/100', 'text'],
    'feedback/warning-bg': ['amber/100', 'amber/900', 'bg'],
    'feedback/warning-text': ['amber/800', 'amber/100', 'text'],
    'feedback/error-bg': ['red/100', 'red/900', 'bg'],
    'feedback/error-text': ['red/700', 'red/100', 'text'],
  },
  space: { 'space/1': 4, 'space/2': 8, 'space/3': 12, 'space/4': 16, 'space/6': 24, 'space/8': 32, 'space/12': 48, 'space/16': 64 },
  radius: { 'radius/sm': 4, 'radius/md': 8, 'radius/lg': 16, 'radius/pill': 999 },
  fontSize: { 'font/size/xs': 12, 'font/size/sm': 14, 'font/size/base': 16, 'font/size/lg': 20, 'font/size/xl': 24, 'font/size/2xl': 30, 'font/size/3xl': 36 },
  fontWeight: { 'font/weight/regular': 400, 'font/weight/medium': 500, 'font/weight/semibold': 600, 'font/weight/bold': 700 },
  motion: { 'motion/duration/fast': 150, 'motion/duration/base': 250, 'motion/duration/slow': 400 },
  type: [
    ['h1', 'font-size-3xl · 36 / 1.15 · Manrope 700'], ['h2', 'font-size-2xl · 30 / 1.15 · Manrope 700'], ['h3', 'font-size-xl · 24 / 1.15 · Manrope 700'],
    ['title', 'font-size-lg · 20 / 1.15 · Manrope 700'], ['lg', 'font-size-lg · 20 / 1.6 · Inter 400'], ['base', 'font-size-base · 16 / 1.6 · Inter 400'],
    ['sm', 'font-size-sm · 14 / 1.6 · Inter 400'], ['xs', 'font-size-xs · 12 / 1.6 · Inter 400'],
  ],
  // src/components/atoms/Icon/icons.js (Lucide, ISC)
  icons: {
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  },
};
const css4 = function (name) { return name.replace(/\//g, '-'); };

async function lr4Variables() {
  const prim = valueCollection('Primitives');
  for (const name in LR4.primitives) mkVar(prim.collection, name, 'COLOR', [], 'color-primitive-' + css4(name)).setValueForMode(prim.mode, hex(LR4.primitives[name]));
  const color = themedCollection('Color');
  for (const name in LR4.semantic) {
    const d = LR4.semantic[name];
    const v = mkVar(color.collection, name, 'COLOR', SCOPES[d[2]], 'color-semantic-' + css4(name));
    v.setValueForMode(color.light, alias(d[0]));
    if (color.dark) v.setValueForMode(color.dark, alias(d[1]));
  }
  const sp = valueCollection('Spacing');
  for (const name in LR4.space) mkVar(sp.collection, name, 'FLOAT', ['GAP', 'WIDTH_HEIGHT'], css4(name)).setValueForMode(sp.mode, LR4.space[name]);
  const rd = valueCollection('Radius');
  for (const name in LR4.radius) mkVar(rd.collection, name, 'FLOAT', ['CORNER_RADIUS'], css4(name)).setValueForMode(rd.mode, LR4.radius[name]);
  const ty = valueCollection('Typography');
  for (const name in LR4.fontSize) mkVar(ty.collection, name, 'FLOAT', ['FONT_SIZE'], css4(name)).setValueForMode(ty.mode, LR4.fontSize[name]);
  for (const name in LR4.fontWeight) mkVar(ty.collection, name, 'FLOAT', ['FONT_WEIGHT'], css4(name)).setValueForMode(ty.mode, LR4.fontWeight[name]);
  const mo = valueCollection('Motion');
  for (const name in LR4.motion) mkVar(mo.collection, name, 'FLOAT', [], css4(name)).setValueForMode(mo.mode, LR4.motion[name]);
  return color;
}

async function lr4Foundations() {
  const f = {
    d700: await pickFont('Manrope', ['Bold', 'SemiBold', 'Semi Bold']),
    r: await pickFont('Inter', ['Regular']),
    m: await pickFont('Inter', ['Medium', 'Regular']),
    sb: await pickFont('Inter', ['Semi Bold', 'SemiBold', 'Medium']),
    b: await pickFont('Inter', ['Bold', 'Semi Bold', 'SemiBold']),
  };
  await makeTextStyles('EduKit/', {
    h1: ['Display/3xl', f.d700, 36, 115, 'font/size/3xl'],
    h2: ['Display/2xl', f.d700, 30, 115, 'font/size/2xl'],
    h3: ['Display/xl', f.d700, 24, 115, 'font/size/xl'],
    title: ['Display/lg', f.d700, 20, 115, 'font/size/lg'],
    lg: ['Body/lg', f.r, 20, 160, 'font/size/lg'],
    base: ['Body/base', f.r, 16, 160, 'font/size/base'],
    sm: ['Body/sm', f.r, 14, 160, 'font/size/sm'],
    xs: ['Body/xs', f.r, 12, 160, 'font/size/xs'],
    medium: ['Label/base medium', f.m, 16, 160, 'font/size/base'],
    smMedium: ['Label/sm medium', f.m, 14, 160, 'font/size/sm'],
    smSemi: ['Label/sm semibold', f.sb, 14, 160, 'font/size/sm'],
    xsSemi: ['Label/xs semibold', f.sb, 12, 160, 'font/size/xs'],
    avMd: ['Label/avatar md', f.sb, 16, 100, 'font/size/base'],
    avLg: ['Label/avatar lg', f.sb, 24, 100, 'font/size/xl'],
    price: ['Label/price', f.b, 20, 160, 'font/size/lg'],
    btnSm: ['Button/sm', f.sb, 14, 100, 'font/size/sm'],
    btn: ['Button/md', f.sb, 16, 100, 'font/size/base'],
    btnLg: ['Button/lg', f.sb, 20, 100, 'font/size/lg'],
  });
  E = {};
  effectStyle('sm', 'shadow/sm', [shadowFx(1, 2, 0.05)]);
  effectStyle('md', 'shadow/md', [shadowFx(4, 12, 0.08)]);
  effectStyle('lg', 'shadow/lg', [shadowFx(12, 24, 0.12)]);
  effectStyle('focus', 'focus/ring', [ringFx('#2563EB', 1, 3)]);
  effectStyle('focusDanger', 'focus/ring-danger', [ringFx('#DC2626', 1, 3)]);
  effectStyle('focusInput', 'focus/input', [ringFx('#2563EB', 0.25, 3)]);
  DOC = { h2: 'h1', h3: 'title', body: 'base', cap: 'xs', text: 'text/default', muted: 'text/muted' };
  return f;
}

// ----- атомы -----

async function lr4Icons(parent) {
  const row = af('Icons', 'HORIZONTAL');
  row.itemSpacing = 24;
  parent.appendChild(row);
  const icons = {};
  for (const k in LR4.icons) {
    const c = figma.createComponent();
    c.name = 'Icon/' + k;
    c.resize(20, 20);
    c.fills = [];
    c.appendChild(svgIcon('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + LR4.icons[k] + '</svg>', 'text/default', k));
    c.description = 'Иконка Lucide ' + k + ' (20px); подставляется в слоты через Instance Swap';
    row.appendChild(c);
    icons[k] = c;
  }
  return icons;
}

async function lr4Buttons(parent, icons) {
  const sizes = { sm: ['space/2', 'space/4', 'btnSm'], md: ['space/3', 'space/6', 'btn'], lg: ['space/4', 'space/8', 'btnLg'] };
  const comps = [];
  for (const variant of ['primary', 'secondary', 'ghost', 'danger']) for (const size of ['sm', 'md', 'lg']) for (const state of ['default', 'hover', 'focus', 'disabled']) {
    const c = cmp('variant=' + variant + ', size=' + size + ', state=' + state);
    c.primaryAxisAlignItems = 'CENTER';
    c.counterAxisAlignItems = 'CENTER';
    bind(c, 'itemSpacing', 'space/2');
    pad(c, sizes[size][0], sizes[size][1]);
    radius(c, 'radius/md');
    const hover = state === 'hover';
    let bg = null, border = null, fg = 'text/default';
    if (variant === 'primary') { bg = hover ? 'action/primary-hover' : 'action/primary'; border = bg; fg = 'action/on-primary'; }
    if (variant === 'danger') { bg = hover ? 'action/danger-hover' : 'action/danger'; border = bg; fg = 'action/on-primary'; }
    if (variant === 'secondary') {
      border = 'action/primary';
      if (hover) { bg = 'action/primary'; fg = 'action/on-primary'; } else fg = 'action/primary';
    }
    if (variant === 'ghost' && hover) bg = 'background/muted';
    c.fills = bg ? [paint(bg)] : [];
    if (border) stroke(c, border, 2, 'OUTSIDE');
    if (state === 'focus') await fx(c, variant === 'danger' ? 'focusDanger' : 'focus');
    if (state === 'disabled') c.opacity = 0.5;
    const ic = icons.check.createInstance();
    ic.name = 'Icon';
    tint(ic, fg);
    c.appendChild(ic);
    c.appendChild(await txt('Кнопка', sizes[size][2], fg, { name: 'Label' }));
    comps.push(c);
  }
  const set = variantSet(comps, parent, 'Button', 1700, 'Atom Button: variant (primary, secondary, ghost, danger) × size (sm, md, lg) × state (default, hover, focus, disabled). Слот иконки — Instance Swap.');
  textProp(set, 'Label', 'Label', 'Кнопка');
  const show = set.addComponentProperty('Show icon', 'BOOLEAN', false);
  const swap = set.addComponentProperty('Icon', 'INSTANCE_SWAP', icons.check.id, {
    preferredValues: Object.keys(icons).map(function (k) { return { type: 'COMPONENT', key: icons[k].key }; }),
  });
  for (const v of set.children) {
    const ic = v.findOne(function (n) { return n.type === 'INSTANCE' && n.name === 'Icon'; });
    ic.componentPropertyReferences = { visible: show, mainComponent: swap };
  }
  await hoverVariants(set, 'state=default', 'state=hover');
  return set;
}

async function lr4Inputs(parent) {
  const kinds = { text: ['Иван Петров', 'Иван'], email: ['name@example.com', 'ivan@'], password: ['Пароль', '••••••••'] };
  const comps = [];
  for (const kind in kinds) for (const state of ['default', 'hover', 'focus', 'error', 'disabled']) {
    const c = cmpW('type=' + kind + ', state=' + state, 'HORIZONTAL', 360);
    c.counterAxisAlignItems = 'CENTER';
    pad(c, 'space/3', 'space/4');
    radius(c, 'radius/md');
    fill(c, state === 'disabled' ? 'background/muted' : 'background/surface');
    stroke(c, { hover: 'text/muted', focus: 'action/primary', error: 'action/danger' }[state] || 'border/default', 2);
    if (state === 'focus') await fx(c, 'focusInput');
    if (state === 'disabled') c.opacity = 0.5;
    const filled = state === 'focus' || state === 'error';
    c.appendChild(await txt(kinds[kind][filled ? 1 : 0], 'base', filled ? 'text/default' : 'text/muted', { name: 'Value' }));
    comps.push(c);
  }
  return variantSet(comps, parent, 'Input', 1600, 'Atom Input: type (text, email, password) × state (default, hover, focus, error = aria-invalid, disabled)');
}

async function lr4Controls(parent, icons) {
  const sets = {};
  for (const kind of ['Checkbox', 'Radio', 'Switch']) {
    const comps = [];
    for (const checked of [false, true]) for (const disabled of [false, true]) {
      const c = cmp('checked=' + checked + ', disabled=' + disabled);
      c.counterAxisAlignItems = 'CENTER';
      bind(c, 'itemSpacing', 'space/3');
      let ctl;
      if (kind === 'Checkbox') {
        ctl = box('Box', 20, 20);
        radius(ctl, 'radius/sm');
        if (checked) { fill(ctl, 'action/primary'); const ic = icons.check.createInstance(); ic.name = 'Check'; tint(ic, 'action/on-primary'); ctl.appendChild(ic); }
        else { fill(ctl, 'background/surface'); stroke(ctl, 'border/default', 2); }
      } else if (kind === 'Radio') {
        ctl = box('Circle', 20, 20);
        radius(ctl, 'radius/pill');
        fill(ctl, 'background/surface');
        stroke(ctl, checked ? 'action/primary' : 'border/default', 2);
        if (checked) { const dot = figma.createEllipse(); dot.name = 'Dot'; dot.resize(10, 10); dot.fills = [paint('action/primary')]; ctl.appendChild(dot); }
      } else {
        ctl = box('Track', 44, 24);
        radius(ctl, 'radius/pill');
        ctl.paddingLeft = ctl.paddingRight = 2;
        ctl.primaryAxisAlignItems = checked ? 'MAX' : 'MIN';
        fill(ctl, checked ? 'action/primary' : 'border/default');
        const knob = figma.createEllipse();
        knob.name = 'Knob';
        knob.resize(20, 20);
        knob.fills = [paint('background/surface')];
        await fx(knob, 'sm');
        ctl.appendChild(knob);
      }
      c.appendChild(ctl);
      c.appendChild(await txt({ Checkbox: 'Запомнить меня', Radio: 'Онлайн-формат', Switch: 'Уведомления о старте' }[kind], 'base', 'text/default', { name: 'Label' }));
      if (disabled) c.opacity = 0.5;
      comps.push(c);
    }
    sets[kind] = variantSet(comps, parent, kind, 900, 'Atom ' + kind + ': checked × disabled');
    textProp(sets[kind], 'Label', 'Label', { Checkbox: 'Запомнить меня', Radio: 'Онлайн-формат', Switch: 'Уведомления о старте' }[kind]);
  }
  return sets;
}

async function lr4Badges(parent) {
  const comps = [];
  const labels = { info: 'Скоро', success: 'Набор открыт', warning: 'Осталось 3 места', error: 'Набор закрыт' };
  for (const v in labels) {
    const c = cmp('variant=' + v);
    c.counterAxisAlignItems = 'CENTER';
    pad(c, 'space/1', 'space/3');
    radius(c, 'radius/pill');
    fill(c, 'feedback/' + v + '-bg');
    c.appendChild(await txt(labels[v], 'xsSemi', 'feedback/' + v + '-text', { name: 'Label' }));
    comps.push(c);
  }
  const set = variantSet(comps, parent, 'Badge', 640, 'Atom Badge: info, success, warning, error — фон и текст из feedback-токенов');
  textProp(set, 'Label', 'Label', 'Набор открыт');
  return set;
}

async function lr4Avatars(parent, photo) {
  const comps = [];
  const sz = { sm: [32, 'xsSemi'], md: [48, 'avMd'], lg: [72, 'avLg'] };
  for (const type of ['initials', 'image']) for (const size in sz) {
    const c = cmp('type=' + type + ', size=' + size);
    c.resize(sz[size][0], sz[size][0]);
    c.primaryAxisAlignItems = 'CENTER';
    c.counterAxisAlignItems = 'CENTER';
    radius(c, 'radius/pill');
    c.clipsContent = true;
    if (type === 'image' && photo) c.fills = [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: photo }];
    else {
      fill(c, 'feedback/info-bg');
      c.appendChild(await txt('АС', sz[size][1], 'feedback/info-text', { name: 'Initials' }));
    }
    comps.push(c);
  }
  const set = variantSet(comps, parent, 'Avatar', 640, 'Atom Avatar: инициалы или фото × sm 32 / md 48 / lg 72');
  return set;
}

async function lr4Spinners(parent) {
  const comps = [];
  const sz = { sm: [16, 2], md: [32, 3], lg: [48, 4] };
  for (const size in sz) {
    const s = sz[size][0], w = sz[size][1];
    const c = figma.createComponent();
    c.name = 'size=' + size;
    c.resize(s, s);
    c.fills = [];
    for (const part of ['Track', 'Arc']) {
      const e = figma.createEllipse();
      e.name = part;
      e.resize(s, s);
      e.arcData = part === 'Track'
        ? { startingAngle: 0, endingAngle: 2 * Math.PI, innerRadius: 1 - 2 * w / s }
        : { startingAngle: -Math.PI / 2, endingAngle: 0, innerRadius: 1 - 2 * w / s };
      e.fills = [paint(part === 'Track' ? 'border/default' : 'action/primary')];
      c.appendChild(e);
    }
    comps.push(c);
  }
  return variantSet(comps, parent, 'Spinner', 300, 'Atom Spinner: кольцо border-default, дуга action-primary');
}

// ----- молекулы -----

async function lr4Molecules(parent, a) {
  const out = {};
  // Form Field: label + input + helper / error
  const ff = [];
  for (const state of ['default', 'error']) {
    const c = cmpW('state=' + state, 'VERTICAL', 360);
    bind(c, 'itemSpacing', 'space/2');
    add(c, await txt('Email', 'smMedium', 'text/default', { name: 'Label' }), 'FILL');
    add(c, inst(a.input, { type: 'email', state: state === 'error' ? 'error' : 'default' }), 'FILL');
    add(c, await txt(state === 'error' ? 'Введите email в формате name@example.com' : 'Мы не передаём адрес третьим лицам', 'sm', state === 'error' ? 'feedback/error-text' : 'text/muted', { name: 'Message' }), 'FILL');
    ff.push(c);
  }
  out.field = variantSet(ff, parent, 'Form Field', 820, 'Molecule: Label + Input + helper text / error');
  textProp(out.field, 'Label', 'Label', 'Email');

  // Search Bar: поле с иконкой + кнопка
  const sb = cmpW('Search Bar', 'HORIZONTAL', 480);
  bind(sb, 'itemSpacing', 'space/2');
  const field = af('Field', 'HORIZONTAL');
  add(sb, field, 'FILL');
  field.counterAxisAlignItems = 'CENTER';
  pad(field, 'space/3', 'space/4');
  bind(field, 'itemSpacing', 'space/3');
  radius(field, 'radius/md');
  fill(field, 'background/surface');
  stroke(field, 'border/default', 2);
  const si = a.icons.search.createInstance();
  si.name = 'Icon';
  tint(si, 'text/muted');
  field.appendChild(si);
  field.appendChild(await txt('Python, дизайн, аналитика…', 'base', 'text/muted', { name: 'Placeholder' }));
  sb.appendChild(inst(a.button, { variant: 'primary', size: 'md', state: 'default' }, { Label: 'Найти' }));
  parent.appendChild(sb);
  textProp(sb, 'Placeholder', 'Placeholder', 'Python, дизайн, аналитика…');
  sb.description = 'Molecule: поле поиска с иконкой и кнопкой';
  out.search = sb;

  // Pagination
  const items = [];
  for (const state of ['default', 'hover', 'current', 'disabled']) {
    const c = cmp('state=' + state);
    c.resize(44, 44);
    c.primaryAxisSizingMode = 'AUTO';
    c.minWidth = 44;
    c.primaryAxisAlignItems = 'CENTER';
    c.counterAxisAlignItems = 'CENTER';
    pad(c, null, 'space/3');
    radius(c, 'radius/md');
    stroke(c, state === 'hover' || state === 'current' ? 'action/primary' : 'border/default', 1);
    if (state === 'current') fill(c, 'action/primary');
    if (state === 'disabled') c.opacity = 0.5;
    c.appendChild(await txt('2', 'base', state === 'current' ? 'action/on-primary' : state === 'hover' ? 'action/primary' : 'text/default', { name: 'Label' }));
    items.push(c);
  }
  const item = variantSet(items, parent, 'Pagination Item', 320, 'Кнопка пагинации: current = aria-current="page"');
  textProp(item, 'Label', 'Label', '2');
  await hoverVariants(item, 'state=default', 'state=hover');
  const pg = cmp('Pagination');
  bind(pg, 'itemSpacing', 'space/2');
  for (const p of [['disabled', '←'], ['current', '1'], ['default', '2'], ['default', '3'], ['default', '→']]) pg.appendChild(inst(item, { state: p[0] }, { Label: p[1] }));
  parent.appendChild(pg);
  pg.description = 'Molecule: пагинация';
  out.pagination = pg;

  // Breadcrumbs
  const bc = cmp('Breadcrumbs');
  bind(bc, 'itemSpacing', 'space/2');
  for (const it of [['Главная', 1], ['/', 0], ['Курсы', 1], ['/', 0], ['Frontend-разработчик', 2]]) {
    const t = await txt(it[0], 'sm', it[1] === 1 ? 'action/primary' : 'text/muted', { name: it[1] === 2 ? 'Current' : it[0] });
    if (it[1] === 1) t.textDecoration = 'UNDERLINE';
    bc.appendChild(t);
  }
  parent.appendChild(bc);
  textProp(bc, 'Current', 'Current', 'Frontend-разработчик');
  bc.description = 'Molecule: хлебные крошки, текущая страница без ссылки';
  out.breadcrumbs = bc;

  // Tabs
  const tabs = [];
  for (const selected of [false, true]) {
    const c = cmp('selected=' + selected, 'VERTICAL');
    pad(c, 'space/3', null);
    c.appendChild(await txt('Программа', 'medium', selected ? 'action/primary' : 'text/muted', { name: 'Label' }));
    if (selected) borderBottom(c, 'action/primary', 2);
    tabs.push(c);
  }
  const tab = variantSet(tabs, parent, 'Tab', 320, 'Вкладка: selected = aria-selected');
  textProp(tab, 'Label', 'Label', 'Программа');
  const tw = cmpW('Tabs', 'VERTICAL', 560);
  const list = af('Tab list', 'HORIZONTAL');
  add(tw, list, 'FILL');
  bind(list, 'itemSpacing', 'space/4');
  borderBottom(list, 'border/default', 1);
  list.appendChild(inst(tab, { selected: 'true' }, { Label: 'Программа' }));
  list.appendChild(inst(tab, { selected: 'false' }, { Label: 'Преподаватели' }));
  list.appendChild(inst(tab, { selected: 'false' }, { Label: 'Отзывы' }));
  const panel = af('Panel', 'VERTICAL');
  add(tw, panel, 'FILL');
  pad(panel, 'space/4', null);
  add(panel, await txt('HTML и CSS, JavaScript, инструменты, React, дипломный проект.', 'base', 'text/default', { name: 'Panel text' }), 'FILL');
  parent.appendChild(tw);
  tw.description = 'Molecule: вкладки (tablist + panel)';
  out.tabs = tw;

  // Tooltip
  const tips = [];
  for (const placement of ['top', 'bottom']) {
    const c = cmp('placement=' + placement, 'VERTICAL');
    c.counterAxisAlignItems = 'CENTER';
    bind(c, 'itemSpacing', 'space/2');
    const bubble = af('Bubble', 'HORIZONTAL');
    pad(bubble, 'space/2', 'space/3');
    radius(bubble, 'radius/md');
    fill(bubble, 'text/default');
    await fx(bubble, 'md');
    bubble.appendChild(await txt('Ответит в течение рабочего дня', 'sm', 'background/surface', { name: 'Text' }));
    const trigger = af('Trigger', 'HORIZONTAL');
    pad(trigger, 'space/2', 'space/3');
    radius(trigger, 'radius/sm');
    stroke(trigger, 'action/primary', 1);
    trigger.dashPattern = [4, 3];
    trigger.appendChild(await txt('Что такое наставник?', 'base', 'action/primary', { name: 'Trigger label' }));
    if (placement === 'top') { c.appendChild(bubble); c.appendChild(trigger); } else { c.appendChild(trigger); c.appendChild(bubble); }
    tips.push(c);
  }
  out.tooltip = variantSet(tips, parent, 'Tooltip', 640, 'Molecule Tooltip: placement top / bottom');
  textProp(out.tooltip, 'Text', 'Text', 'Ответит в течение рабочего дня');
  return out;
}

// ----- организмы -----

async function lr4Organisms(parent, a, m, photos) {
  const out = {};
  // Header: гость / вошедший пользователь (как stories Guest и LoggedIn)
  const hs = [];
  for (const user of ['guest', 'logged-in']) {
    const c = cmpW('user=' + user, 'HORIZONTAL', 1200);
    c.primaryAxisAlignItems = 'SPACE_BETWEEN';
    c.counterAxisAlignItems = 'CENTER';
    pad(c, 'space/4', 'space/6');
    fill(c, 'background/surface');
    borderBottom(c, 'border/default', 1);
    c.appendChild(await txt('EduKit', 'h3', 'action/primary', { name: 'Brand' }));
    const nav = af('Nav', 'HORIZONTAL');
    bind(nav, 'itemSpacing', 'space/6');
    c.appendChild(nav);
    const active = user === 'guest' ? 'Курсы' : 'Блог';
    for (const l of ['Курсы', 'Преподаватели', 'Блог', 'Контакты']) {
      const link = af('Link', 'VERTICAL');
      pad(link, 'space/2', null);
      link.appendChild(await txt(l, 'medium', l === active ? 'action/primary' : 'text/muted', { name: l }));
      if (l === active) borderBottom(link, 'action/primary', 2);
      nav.appendChild(link);
    }
    const actions = af('Actions', 'HORIZONTAL');
    actions.counterAxisAlignItems = 'CENTER';
    bind(actions, 'itemSpacing', 'space/2');
    c.appendChild(actions);
    if (user === 'guest') {
      actions.appendChild(inst(a.button, { variant: 'ghost', size: 'sm', state: 'default' }, { Label: 'Войти' }));
      actions.appendChild(inst(a.button, { variant: 'primary', size: 'sm', state: 'default' }, { Label: 'Регистрация' }));
    } else {
      actions.appendChild(inst(a.avatar, { type: 'initials', size: 'sm' }));
      actions.appendChild(await txt('Анна Смирнова', 'smMedium', 'text/default', { name: 'User' }));
    }
    hs.push(c);
  }
  out.header = variantSet(hs, parent, 'Header', 1260, 'Organism Header: бренд, навигация с активной страницей (aria-current), действия');

  // Footer
  const ft = cmpW('Footer', 'VERTICAL', 1200);
  ft.paddingTop = 48; ft.paddingBottom = 24; ft.paddingLeft = 24; ft.paddingRight = 24;
  bind(ft, 'paddingTop', 'space/12'); bind(ft, 'paddingBottom', 'space/6'); bind(ft, 'paddingLeft', 'space/6'); bind(ft, 'paddingRight', 'space/6');
  bind(ft, 'itemSpacing', 'space/8');
  fill(ft, 'background/surface');
  borderTop(ft, 'border/default', 1);
  const grid = af('Grid', 'HORIZONTAL');
  add(ft, grid, 'FILL');
  bind(grid, 'itemSpacing', 'space/8');
  const brandCol = af('Brand', 'VERTICAL');
  add(grid, brandCol, 'FILL');
  brandCol.appendChild(await txt('EduKit', 'h3', 'action/primary', { name: 'Brand' }));
  for (const col of [['Обучение', ['Все курсы', 'Преподаватели', 'Корпоративным клиентам']], ['Школа', ['Блог', 'Контакты', 'Вакансии']], ['Соцсети', ['Telegram', 'ВКонтакте', 'YouTube']]]) {
    const cl = af(col[0], 'VERTICAL');
    add(grid, cl, 'FILL');
    bind(cl, 'itemSpacing', 'space/2');
    const title = await txt(col[0], 'smSemi', 'text/default', { name: 'Title' });
    cl.appendChild(title);
    for (const l of col[1]) cl.appendChild(await txt(l, 'sm', 'text/muted', { name: 'Link' }));
  }
  const copy = af('Copy', 'HORIZONTAL');
  add(ft, copy, 'FILL');
  bind(copy, 'paddingTop', 'space/6');
  borderTop(copy, 'border/default', 1);
  copy.appendChild(await txt('© 2026 EduKit. Все права защищены.', 'sm', 'text/muted', { name: 'Copyright' }));
  parent.appendChild(ft);
  ft.description = 'Organism Footer: колонки ссылок и копирайт';
  out.footer = ft;

  // Media-слоты карточки (Instance Swap)
  const media = {};
  for (const md of [['Course photo', 360, 203, photos.course], ['Article photo', 360, 203, photos.article], ['User photo', 360, 360, photos.user]]) {
    const c = figma.createComponent();
    c.name = 'Media/' + md[0];
    c.resize(md[1], md[2]);
    c.fills = [];
    const r = imageRect(md[1], md[2], md[3], 'background/muted');
    c.appendChild(r);
    r.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' };
    parent.appendChild(c);
    media[md[0]] = c;
  }

  // Card: course / article / user × default / hover
  const cards = [];
  for (const type of ['course', 'article', 'user']) for (const state of ['default', 'hover']) {
    const c = cmpW('type=' + type + ', state=' + state, 'VERTICAL', 360);
    fill(c, 'background/surface');
    stroke(c, 'border/default', 1);
    radius(c, 'radius/lg');
    c.clipsContent = true;
    await fx(c, state === 'hover' ? 'lg' : 'sm');
    const mi = media[{ course: 'Course photo', article: 'Article photo', user: 'User photo' }[type]].createInstance();
    mi.name = 'Media';
    c.appendChild(mi);
    const body = af('Body', 'VERTICAL');
    add(c, body, 'FILL');
    pad(body, 'space/6', 'space/6');
    bind(body, 'itemSpacing', 'space/2');
    if (type === 'course') {
      body.appendChild(inst(a.badge, { variant: 'success' }, { Label: 'Набор открыт' }));
      add(body, await txt('Frontend-разработчик', 'title', 'text/default', { name: 'Title' }), 'FILL');
      add(body, await txt('8 месяцев, наставник и 5 проектов в портфолио', 'base', 'text/muted', { name: 'Text' }), 'FILL');
      body.appendChild(await txt('6 900 ₽/мес', 'price', 'text/default', { name: 'Price' }));
      body.appendChild(inst(a.button, { variant: 'primary', size: 'md', state: 'default' }, { Label: 'Записаться' }));
    } else if (type === 'article') {
      body.appendChild(await txt('12 сентября 2026 · 7 мин', 'sm', 'text/muted', { name: 'Meta' }));
      add(body, await txt('Как найти первую работу в IT без опыта', 'title', 'text/default', { name: 'Title' }), 'FILL');
      add(body, await txt('Разбираем, с чего начать и как собрать портфолио', 'base', 'text/muted', { name: 'Text' }), 'FILL');
      body.appendChild(inst(a.button, { variant: 'secondary', size: 'sm', state: 'default' }, { Label: 'Читать' }));
    } else {
      body.appendChild(await txt('Наставник Frontend', 'smSemi', 'action/primary', { name: 'Role' }));
      add(body, await txt('Елена Иванова', 'title', 'text/default', { name: 'Title' }), 'FILL');
      add(body, await txt('10 лет в разработке, тимлид фронтенда в финтехе', 'base', 'text/muted', { name: 'Text' }), 'FILL');
    }
    cards.push(c);
  }
  out.card = variantSet(cards, parent, 'Card', 1200, 'Organism Card: type (course, article, user) × state (default, hover). Фото — слот Media через Instance Swap.');
  textProp(out.card, 'Title', 'Title', 'Frontend-разработчик');
  const mediaKey = out.card.addComponentProperty('Media', 'INSTANCE_SWAP', media['Course photo'].id, {
    preferredValues: Object.keys(media).map(function (k) { return { type: 'COMPONENT', key: media[k].key }; }),
  });
  for (const v of out.card.children) v.findOne(function (n) { return n.type === 'INSTANCE' && n.name === 'Media'; }).componentPropertyReferences = { mainComponent: mediaKey };
  await hoverVariants(out.card, 'state=default', 'state=hover');

  // Modal (stories Confirm и Danger)
  const modals = [];
  for (const variant of ['primary', 'danger']) {
    const c = cmpW('variant=' + variant, 'VERTICAL', 480);
    pad(c, 'space/8', 'space/8');
    fill(c, 'background/surface');
    stroke(c, 'border/default', 1);
    radius(c, 'radius/lg');
    await fx(c, 'lg');
    const danger = variant === 'danger';
    add(c, await txt(danger ? 'Отменить запись?' : 'Записаться на курс?', 'h3', 'text/default', { name: 'Title' }), 'FILL');
    const text = await txt(danger ? 'Место в потоке освободится, вернуть его можно будет только при наличии свободных мест.' : 'Менеджер свяжется с вами в течение дня и расскажет о старте потока.', 'base', 'text/muted', { name: 'Text' });
    add(c, text, 'FILL');
    c.itemSpacing = 12;
    const act = af('Actions', 'HORIZONTAL');
    add(c, act, 'FILL');
    act.primaryAxisAlignItems = 'MAX';
    bind(act, 'itemSpacing', 'space/3');
    act.paddingTop = 12;
    act.appendChild(inst(a.button, { variant: 'ghost', size: 'md', state: 'default' }, { Label: danger ? 'Оставить' : 'Отмена' }));
    act.appendChild(inst(a.button, { variant: variant, size: 'md', state: 'default' }, { Label: danger ? 'Отменить запись' : 'Записаться' }));
    modals.push(c);
  }
  out.modal = variantSet(modals, parent, 'Modal', 1080, 'Organism Modal: подтверждение / опасное действие');

  // Table (stories Default и Striped)
  const cols = [['Курс', 240], ['Старт', 140], ['Стоимость', 160], ['Статус', 180]];
  const rows = [
    ['Frontend-разработчик', '14 октября', '6 900 ₽/мес', 'success', 'Набор открыт'],
    ['Python-разработчик', '21 октября', '7 400 ₽/мес', 'warning', 'Осталось 3 места'],
    ['Веб-дизайнер', '4 ноября', '5 900 ₽/мес', 'info', 'Скоро'],
    ['UX-исследователь', '—', '5 400 ₽/мес', 'error', 'Набор закрыт'],
  ];
  const tables = [];
  for (const striped of [false, true]) {
    const c = cmp('striped=' + striped, 'VERTICAL');
    c.appendChild(await txt('Ближайшие потоки', 'smSemi', 'text/default', { name: 'Caption' }));
    c.itemSpacing = 12;
    const t = af('Table', 'VERTICAL');
    fill(t, 'background/surface');
    c.appendChild(t);
    for (let r = -1; r < rows.length; r++) {
      const row = af(r < 0 ? 'Head' : 'Row ' + (r + 1), 'HORIZONTAL');
      t.appendChild(row);
      if (r < 0) fill(row, 'background/muted');
      else if (striped && r % 2 === 1) fill(row, 'background/default');
      for (let k = 0; k < cols.length; k++) {
        const cell = box(r < 0 ? cols[k][0] : 'Cell', cols[k][1], 48);
        cell.primaryAxisAlignItems = 'MIN';
        pad(cell, 'space/3', 'space/4');
        borderBottom(cell, 'border/default', 1);
        row.appendChild(cell);
        if (r < 0) cell.appendChild(await txt(cols[k][0], 'smSemi', 'text/default'));
        else if (k === 3) cell.appendChild(inst(a.badge, { variant: rows[r][3] }, { Label: rows[r][4] }));
        else cell.appendChild(await txt(rows[r][k], 'sm', 'text/default'));
      }
    }
    tables.push(c);
  }
  out.table = variantSet(tables, parent, 'Table', 1560, 'Organism Table: заголовок на background-muted, статус — Badge; striped — чётные строки background-default');

  // Form
  const form = cmpW('Form', 'VERTICAL', 420);
  pad(form, 'space/8', 'space/8');
  bind(form, 'itemSpacing', 'space/4');
  fill(form, 'background/surface');
  stroke(form, 'border/default', 1);
  radius(form, 'radius/lg');
  add(form, await txt('Заявка на курс', 'h3', 'text/default', { name: 'Title' }), 'FILL');
  add(form, inst(m.field, { state: 'default' }, { Label: 'Email' }), 'FILL');
  form.appendChild(inst(a.controls.Checkbox, { checked: 'true', disabled: 'false' }, { Label: 'Согласен на обработку данных' }));
  form.appendChild(inst(a.button, { variant: 'primary', size: 'md', state: 'default' }, { Label: 'Отправить заявку' }));
  form.appendChild(await txt('Ответим в течение рабочего дня', 'sm', 'text/muted', { name: 'Status' }));
  parent.appendChild(form);
  form.description = 'Organism Form: Form Field + Checkbox + Button';
  out.form = form;
  return out;
}

async function buildLR4() {
  // новый файл: первая страница становится Foundations; если страницу создать нельзя (лимит 3 страниц
  // на бесплатном плане), всё строится на одной странице
  const pageNamed = async function (name) {
    let p = figma.root.children.find(function (x) { return x.name === name; });
    if (!p) { try { p = figma.createPage(); p.name = name; } catch (e) { p = null; } }
    if (p) await p.loadAsync();
    return p;
  };
  const first = figma.root.children[0];
  await first.loadAsync();
  let foundations;
  if (figma.root.children.length === 1 && first.children.length === 0) { foundations = first; foundations.name = 'EduKit — Foundations'; }
  else foundations = (await pageNamed('EduKit — Foundations')) || figma.currentPage;
  const comps = (await pageNamed('EduKit — Components')) || foundations;

  await figma.setCurrentPageAsync(foundations);
  const color = await lr4Variables();
  const fonts = await lr4Foundations();

  // Foundations: доска токенов
  const board = af('EduKit — токены', 'VERTICAL');
  board.itemSpacing = 64;
  padPx(board, 64, 64);
  board.fills = [{ type: 'SOLID', color: hex('#F3F4F6') }];
  foundations.appendChild(board);
  board.appendChild(await txt('EduKit — дизайн-токены (ЛР4)', 'h1', 'text/default', { name: 'Title' }));
  let s = await docSection(board, 'Colors', 'tokens/colors.json: примитивы → семантика ({color.primitive.*}); тёмная тема — tokens-dark/colors.json (режим Dark).');
  let g = await docGroup(s, 'Primitives');
  for (const n in LR4.primitives) await swatch(g, n, '--color-primitive-' + css4(n), LR4.primitives[n]);
  g = await docGroup(s, 'Semantic: Light / Dark');
  for (const n in LR4.semantic) await swatch(g, n, '--color-semantic-' + css4(n), LR4.semantic[n][0] + ' / ' + LR4.semantic[n][1]);
  s = await docSection(board, 'Typography', 'tokens/typography.json: Manrope (display), Inter (body); размеры текстовых стилей привязаны к переменным font/size/*.');
  g = await docGroup(s, 'Размеры', true);
  await docType(g, LR4.type, 'text/default');
  g = await docGroup(s, 'Начертания (font/weight/*)');
  for (const w of [['400 regular', fonts.r], ['500 medium', fonts.m], ['600 semibold', fonts.sb], ['700 bold', fonts.b]]) {
    await figma.loadFontAsync(w[1]);
    const t = figma.createText();
    t.fontName = w[1];
    t.fontSize = 20;
    t.characters = 'Inter ' + w[0];
    t.fills = [paint('text/default')];
    g.appendChild(t);
  }
  s = await docSection(board, 'Spacing, Radius, Shadows, Motion', 'spacing.json, radii.json, shadows.json, motion.json (длительности — переменные Motion: fast 150, base 250, slow 400 мс).');
  g = await docGroup(s, 'Отступы', true);
  await docSpacing(g, LR4.space, 'action/primary');
  g = await docGroup(s, 'Радиусы');
  await docRadius(g, LR4.radius, 'background/muted', 'action/primary');
  g = await docGroup(s, 'Тени и фокус');
  await docShadows(g, ['sm', 'md', 'lg', 'focus'], 'background/surface');
  rightOfContent(foundations, board);

  // Components: атомы, молекулы, организмы
  await figma.setCurrentPageAsync(comps);
  const photos = {
    course: await siteImage('design-lr3/a/img/photos/hero-800.jpg'),
    article: await siteImage('design-lr1/img/hero-students-800.jpg'),
  };
  photos.user = photos.article;

  const atoms = await docSection(comps, 'Atoms', 'Button, Input, Checkbox, Radio, Switch, Badge, Icon, Avatar, Spinner');
  const a = {};
  g = await docGroup(atoms, 'Icon (Instance Swap)');
  a.icons = await lr4Icons(g);
  g = await docGroup(atoms, 'Button', true);
  a.button = await lr4Buttons(g, a.icons);
  g = await docGroup(atoms, 'Input', true);
  a.input = await lr4Inputs(g);
  g = await docGroup(atoms, 'Checkbox, Radio, Switch', true);
  a.controls = await lr4Controls(g, a.icons);
  g = await docGroup(atoms, 'Badge, Avatar, Spinner');
  a.badge = await lr4Badges(g);
  a.avatar = await lr4Avatars(g, photos.user);
  a.spinner = await lr4Spinners(g);

  const molecules = await docSection(comps, 'Molecules', 'Form Field, Search Bar, Pagination, Breadcrumbs, Tabs, Tooltip');
  g = await docGroup(molecules, 'Molecules', false, 1700);
  const m = await lr4Molecules(g, a);

  const organisms = await docSection(comps, 'Organisms', 'Header, Footer, Card, Modal, Table, Form');
  g = await docGroup(organisms, 'Organisms', true);
  const o = await lr4Organisms(g, a, m, photos);
  const sections = [atoms, molecules, organisms];

  // Тёмная тема: Задание — смена темы без правки компонентов
  let darkNote = ' Режим Dark не создан: на бесплатном плане у коллекции один режим.';
  if (color.dark) {
    const dk = await docSection(comps, 'Dark theme', 'Те же экземпляры с режимом Dark коллекции Color — компоненты не меняются.');
    const row = af('Dark preview', 'HORIZONTAL');
    row.itemSpacing = 32;
    padPx(row, 32, 32);
    row.cornerRadius = 16;
    fill(row, 'background/default');
    dk.appendChild(row);
    row.appendChild(inst(o.card, { type: 'course', state: 'default' }));
    row.appendChild(o.form.createInstance());
    row.appendChild(inst(o.modal, { variant: 'danger' }));
    row.setExplicitVariableModeForCollection(color.collection, color.dark);
    sections.push(dk);
    darkNote = '';
  }
  placeRow(sections, comps === foundations ? board.x + board.width + 200 : 0, board.y, 160);
  figma.viewport.scrollAndZoomIntoView(sections);
  return 'ЛР4 EduKit готова: токены (Primitives, Color, Spacing, Radius, Typography, Motion), Button ' + a.button.children.length + ' вариантов, атомы, молекулы, организмы.' +
    darkNote + (photos.course ? '' : ' Фото не загрузились — заполнители.');
}

// ---------- запуск ----------

(async function () {
  try {
    let msg = '';
    // команды ЛР2 и ЛР4 читают соседние страницы (макеты, компоненты Header/Footer)
    if (figma.command !== 'lr1') await figma.loadAllPagesAsync();
    if (figma.command === 'lr1') msg = await buildLR1();
    else if (figma.command === 'lr2kit') msg = await buildLR2Kit();
    else if (figma.command === 'lr2proto') msg = await buildLR2Prototype();
    else if (figma.command === 'lr4') msg = await buildLR4();
    else msg = 'Неизвестная команда';
    figma.closePlugin(msg);
  } catch (e) {
    console.error(e);
    figma.closePlugin('Ошибка: ' + (e && e.message ? e.message : e));
  }
})();

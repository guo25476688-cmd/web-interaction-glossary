/* ============================================================
 * 线谱版（voigt.html）的页面逻辑
 * 数据、实例、简繁转换都来自与标准版共用的文件，
 * 这里只负责：画色域与轨道线、排版词条、搜索、我的清单。
 * ============================================================ */

TERMS.forEach(function (t) {
  var pm = PM[t.id] || {}
  t.vs = t.vs || pm.vs || ''
  t.spec = t.spec || pm.spec || []
  t.ref = t.ref || []
})

var CL = CATS.filter(function (c) {
  return c.id !== 'all'
})
var state = { q: '', cat: 'feedback', picks: [], name: '' }
try {
  var saved = JSON.parse(localStorage.getItem('wig-picks')) || {}
  state.name = saved.name || ''
  state.picks = (saved.picks || []).filter(function (id) {
    return TERMS.some(function (t) {
      return t.id === id
    })
  })
} catch (e) {}

function byId(id) {
  return TERMS.filter(function (t) {
    return t.id === id
  })[0]
}
function catOf(id) {
  return CL.filter(function (c) {
    return c.id === id
  })[0]
}
function countOf(id) {
  return TERMS.filter(function (t) {
    return t.cat === id
  }).length
}
function no(t) {
  return ('00' + (TERMS.indexOf(t) + 1)).slice(-3)
}
function $(id) {
  return document.getElementById(id)
}

/* ---------- 搜索（与标准版相同的算法） ---------- */
function buildIndex() {
  TERMS.forEach(function (t) {
    var name = [t.zh, t.en, t.alias.join(' ')].join(' ').toLowerCase()
    var all = [name, t.plain, t.desc].join(' ').toLowerCase()
    t._name = name + ' ' + (conv ? conv(name) : '')
    t._hay = all + ' ' + (conv ? conv(all) : '')
  })
}
function tokens(q) {
  var out = []
  ;(q.match(/[a-z0-9]+|[一-鿿]+/g) || []).forEach(function (w) {
    if (/[a-z0-9]/.test(w[0]) || w.length === 1) return out.push(w)
    for (var i = 0; i < w.length - 1; i++) out.push(w.slice(i, i + 2))
  })
  return out
}
function score(t, q) {
  var s = 0
  if (t._name.indexOf(q) > -1) s += 100
  if (t._hay.indexOf(q) > -1) s += 40
  var tk = tokens(q)
  if (tk.length) {
    var hit =
      tk.filter(function (k) {
        return t._hay.indexOf(k) > -1
      }).length / tk.length
    if (hit >= 0.34) s += hit * 30
  }
  return s
}
function currentList() {
  var q = state.q.trim().toLowerCase()
  if (!q) {
    return TERMS.filter(function (t) {
      return t.cat === state.cat
    })
  }
  return TERMS.map(function (t) {
    return [t, score(t, q)]
  })
    .filter(function (x) {
      return x[1] > 0
    })
    .sort(function (a, b) {
      return b[1] - a[1]
    })
    .map(function (x) {
      return x[0]
    })
}

/* ---------- 画面：水彩色域、轨道线、沿线排布的文字 ---------- */
var NS = 'http://www.w3.org/2000/svg'
var INK = '#1c1c1c'
var RED = '#d9655b'
// 水彩色：蓝、桃、品红、粉、浅绿、淡橘
var WASH = ['#7cc3d9', '#f3b59b', '#c9589a', '#e7b3d6', '#cfe6d0', '#f6cdb9']
// 分类的英文名，沿着轨道线排
var CEN = {
  feedback: 'Feedback',
  nav: 'Navigation',
  input: 'Input controls',
  display: 'Content display',
  section: 'Page sections',
  page: 'Page types',
  flow: 'Common flows',
  mobile: 'Mobile and gesture',
  system: 'System states',
  state: 'State and motion',
  concept: 'Concepts'
}

function el(tag, attrs, parent) {
  var e = document.createElementNS(NS, tag)
  for (var k in attrs) e.setAttribute(k, attrs[k])
  parent.appendChild(e)
  return e
}
// 水彩滤镜：边缘略微不规则，再轻轻晕开
function defs(svg, id) {
  var d = el('defs', {}, svg)
  var f = el('filter', { id: id, x: '-20%', y: '-20%', width: '140%', height: '140%' }, d)
  el('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.018, numOctaves: 2, seed: 4, result: 'n' }, f)
  el('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: 14, result: 'd' }, f)
  el('feGaussianBlur', { in: 'd', stdDeviation: 1.4 }, f)
}
// 一个轨道节点：几块水彩色域 + 一圈细线 + 沿线的英文 + 圈内的中文
function orbit(svg, o) {
  var g = el('g', { class: 'node', transform: 'rotate(' + o.rot + ' ' + o.cx + ' ' + o.cy + ')' }, svg)
  if (o.id) g.setAttribute('data-cat', o.id)
  o.blobs.forEach(function (b) {
    el(
      'ellipse',
      {
        class: 'blob',
        cx: o.cx + b[0],
        cy: o.cy + b[1],
        rx: b[2],
        ry: b[3],
        fill: b[4],
        opacity: 0.72,
        filter: 'url(#' + o.wash + ')',
        style: 'mix-blend-mode:multiply'
      },
      g
    )
  })
  el('ellipse', { class: 'ring', cx: o.cx, cy: o.cy, rx: o.rx, ry: o.ry, fill: 'none', stroke: INK, 'stroke-width': 0.8 }, g)
  // 文字路径：从左端出发，沿上半圈走，放不下就绕到下半圈
  var r1 = o.rx + 5
  var r2 = o.ry + 5
  var pid = o.wash + '-p' + o.key
  el(
    'path',
    {
      id: pid,
      fill: 'none',
      d: 'M' + (o.cx - r1) + ' ' + o.cy + ' A' + r1 + ' ' + r2 + ' 0 0 1 ' + (o.cx + r1) + ' ' + o.cy + ' A' + r1 + ' ' + r2 + ' 0 0 1 ' + (o.cx - r1) + ' ' + o.cy
    },
    g
  )
  var text = el('text', { class: 'mono', 'font-size': o.size || 14, 'letter-spacing': 2.2, fill: INK }, g)
  var tp = el('textPath', { href: '#' + pid, startOffset: '5%' }, text)
  tp.textContent = o.label.toUpperCase()
  if (o.zh) {
    var zh = el('text', { x: o.cx, y: o.cy + 5, 'text-anchor': 'middle', 'font-size': 13, 'letter-spacing': 1, fill: INK }, g)
    zh.textContent = o.zh
  }
  // 透明的点击区域，盖在最上面
  var hit = el('ellipse', { cx: o.cx, cy: o.cy, rx: o.rx + 8, ry: o.ry + 12, fill: 'transparent' }, g)
  if (o.onclick) hit.addEventListener('click', o.onclick)
  return g
}

// 首屏的大图：标题和 11 个分类沿对角线一路排下来
function drawCascade() {
  var svg = $('cascade')
  svg.innerHTML = ''
  defs(svg, 'wa')
  // 右上方几条平行的长线
  for (var k = 0; k < 5; k++) {
    el(
      'path',
      {
        d: 'M' + (300 + k * 24) + ' -10 C' + (560 + k * 18) + ' ' + (190 + k * 8) + ', ' + (640 + k * 12) + ' ' + (440 - k * 16) + ', 1210 ' + (500 - k * 20),
        fill: 'none',
        stroke: INK,
        'stroke-width': 0.6
      },
      svg
    )
  }
  var pts = []
  var all = [{ label: 'Interaction lexicon', title: true }].concat(CL)
  all.forEach(function (c, i) {
    pts.push([150 + i * 80 + (i % 2 ? 26 : -14), 92 + i * 54])
  })
  // 节点之间的细红线
  for (var j = 0; j < pts.length - 1; j += 2) {
    el(
      'path',
      {
        d: 'M' + (pts[j][0] + 20) + ' ' + (pts[j][1] - 30) + ' Q' + (pts[j][0] + 90) + ' ' + (pts[j][1] + 40) + ' ' + (pts[j + 1][0] - 30) + ' ' + (pts[j + 1][1] + 30) + ' T' + (pts[j + 1][0] + 70) + ' ' + (pts[j + 1][1] + 70),
        fill: 'none',
        stroke: RED,
        'stroke-width': 0.6
      },
      svg
    )
  }
  all.forEach(function (c, i) {
    var a = WASH[i % WASH.length]
    var b = WASH[(i * 2 + 3) % WASH.length]
    orbit(svg, {
      wash: 'wa',
      key: i,
      id: c.title ? null : c.id,
      cx: pts[i][0],
      cy: pts[i][1],
      rx: c.title ? 96 : 78 + (i % 3) * 10,
      ry: c.title ? 30 : 24 + (i % 2) * 5,
      rot: -5 + (i % 4) * 2,
      label: c.title ? c.label : CEN[c.id],
      size: c.title ? 19 : 13,
      zh: c.title ? T('交互辞典') : T(c.zh) + '  ' + countOf(c.id),
      blobs: [
        [-46 + (i % 3) * 30, -8 + (i % 2) * 22, 52, 34, a],
        [40 - (i % 4) * 22, 16 - (i % 3) * 14, 44, 27, b]
      ],
      onclick: c.title
        ? null
        : function () {
            App.cat(c.id, true)
          }
    })
  })
}
// 词条区上方的小标题：当前分类的一个轨道节点
function drawHead(c) {
  var svg = $('chead')
  svg.innerHTML = ''
  defs(svg, 'wb')
  var i = c ? CL.indexOf(c) + 1 : 0
  orbit(svg, {
    wash: 'wb',
    key: 0,
    cx: 150,
    cy: 66,
    rx: 110,
    ry: 30,
    rot: -5,
    label: c ? CEN[c.id] : 'Search results',
    size: 15,
    zh: '',
    blobs: [
      [-58, 0, 56, 30, WASH[i % WASH.length]],
      [-10, 20, 44, 20, WASH[(i * 2 + 3) % WASH.length]]
    ]
  })
}

/* ---------- 页面 ---------- */
function cardHTML(t) {
  return `<article id="t-${t.id}" class="flex flex-col">
    <div class="mono text-xs" style="color:var(--mag)">No.${no(t)}</div>
    <h3 class="ttl mt-1 text-2xl">${t.zh}</h3>
    <button class="mono soft mt-1 self-start text-sm hover:text-black" title="点击复制英文术语" data-en="${t.en}" onclick="App.copy(this.dataset.en)">${t.en}</button>
    <div class="specimen mt-4"><div data-demo class="demo">${t.demo}</div></div>
    <div class="flex-1 text-sm leading-relaxed">
      <div class="lab">大白话</div>
      <p class="mt-1">${t.plain}。<span class="soft">${t.desc}</span></p>
      ${t.vs ? `<div class="lab">易混淆</div><p class="mt-1">${t.vs}</p>` : ''}
      <div class="lab">也叫</div>
      <p class="soft mt-1">${t.alias.join(' / ')}</p>
      ${
        t.ref.length
          ? `<div class="lab">真实案例</div><p class="mt-1">${t.ref
              .map(function (r) {
                return `<a href="${REFS[r].url}" target="_blank" rel="noopener" class="underline">${REFS[r].name}</a>`
              })
              .join(' / ')}</p>`
          : ''
      }
    </div>
    <div class="says mt-5 border-t pt-2" style="border-color:var(--ink);border-top-width:0.6px">
      <div class="soft flex items-center gap-4 text-sm">
        <button class="tab on" onclick="App.pane(this,0)">对 AI 说</button>
        <button class="tab" onclick="App.pane(this,1)">写进 PRD</button>
        <button class="ml-auto hover:text-black" title="复制当前内容" aria-label="复制当前内容" onclick="App.copyPane(this,'${t.id}')"><i class="fa fa-copy"></i></button>
        <button data-pick="${t.id}" class="pick border px-2 text-xs" style="border-color:var(--ink);border-width:0.6px" title="加入我的清单" onclick="App.pick('${t.id}')"></button>
      </div>
      <p class="pane mt-2 text-sm leading-relaxed">${t.prompt}</p>
      <ul class="pane mt-2 hidden space-y-1 text-sm">${t.spec
        .map(function (s) {
          return '<li class="flex gap-2"><span>+</span><span>' + s + '</span></li>'
        })
        .join('')}</ul>
    </div>
  </article>`
}

function shellHTML() {
  var langBtn = function (id, label) {
    var off = id === 'tw' && !conv
    return `<button ${off ? 'disabled' : ''} class="lang ${lang === id ? 'on' : ''} border px-2 py-0.5 disabled:opacity-40" style="border-color:var(--ink);border-width:0.6px" onclick="App.lang('${id}')">${label}</button>`
  }
  return `<div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-xs">
      <div class="mono">Interaction lexicon / ${TERMS.length} terms</div>
      <div class="flex items-center gap-3">
        <a href="index.html" class="soft underline">切换到标准版</a>
        <span class="flex">${langBtn('cn', '简')}${langBtn('tw', '繁')}</span>
      </div>
    </div>

    <header class="relative mx-auto max-w-6xl px-6">
      <svg id="cascade" viewBox="0 0 1200 780" class="hidden w-full md:block" role="img" aria-label="十一组分类"></svg>
      <div class="max-w-sm py-6 md:absolute md:bottom-6 md:left-6 md:py-0">
        <h1 class="ttl text-3xl leading-snug md:text-4xl">见过千百次，<br>却叫不出名字。</h1>
        <p class="soft mt-4 text-sm leading-relaxed">弹窗、抽屉、标签页，是所有界面里反复出现的「原型」。看见它，命名它，说出它。</p>
        <label class="mt-6 flex items-center gap-3 border-b pb-2" style="border-color:var(--ink);border-bottom-width:0.6px">
          <span class="mono text-xs">+</span>
          <input id="search" type="search" autocomplete="off" class="w-full bg-transparent text-sm font-light outline-none placeholder:text-neutral-400" placeholder="搜索术语，或用大白话描述你见过的那个东西…" oninput="App.search(this.value)">
        </label>
      </div>
      <div class="flex flex-wrap gap-2 pb-4 text-xs md:hidden">
        ${CL.map(function (c) {
          return `<button data-row="${c.id}" class="chip border px-2 py-1" style="border-color:var(--ink);border-width:0.6px" onclick="App.cat('${c.id}',true)">${c.zh} ${countOf(c.id)}</button>`
        }).join('')}
      </div>
    </header>

    <section id="list" class="mx-auto mt-10 max-w-6xl scroll-mt-4 px-6 pb-28">
      <div class="flex items-end justify-between">
        <div class="flex items-end gap-2">
          <svg id="chead" viewBox="0 0 300 120" class="w-56 shrink-0" aria-hidden="true"></svg>
          <h2 id="head" class="ttl pb-4 text-2xl"></h2>
        </div>
        <span id="meta" class="mono soft pb-4 text-xs"></span>
      </div>
      <div id="entries" class="mt-6 grid gap-x-10 gap-y-16 md:grid-cols-2 xl:grid-cols-3"></div>
      <div id="none" class="soft hidden py-20 text-center">没有找到匹配的术语，换个说法试试？</div>
      <div class="mt-20 text-sm">
        <div class="lab">去哪找真实案例</div>
        <p class="mt-2">${Object.keys(REFS)
          .map(function (k) {
            return `<a href="${REFS[k].url}" target="_blank" rel="noopener" class="mr-4 underline">${REFS[k].name}</a>`
          })
          .join('')}</p>
      </div>
    </section>

    <button onclick="App.drawer(true)" class="fixed bottom-6 right-6 z-30 border bg-white px-4 py-2 text-sm" style="border-color:var(--ink);border-width:0.6px">
      我的清单 <span id="pickN" class="mono" style="color:var(--mag)">0</span>
    </button>
    <div id="mask" class="fixed inset-0 z-40 hidden bg-black/20" onclick="App.drawer(false)"></div>
    <aside id="drawer" class="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm translate-x-full flex-col border-l bg-white transition-transform duration-300" style="border-color:var(--ink);border-left-width:0.6px" aria-label="我的清单">
      <div class="flex items-center justify-between px-4 py-3">
        <h2 class="ttl text-lg">我的清单</h2>
        <button onclick="App.drawer(false)" aria-label="关闭" class="soft px-2"><i class="fa fa-times"></i></button>
      </div>
      <div class="px-4"><input id="pname" class="w-full border-b bg-transparent py-1 text-sm font-light outline-none" style="border-color:var(--ink);border-bottom-width:0.6px" placeholder="产品或页面名称，如：某某 App 首页" oninput="App.name(this.value)"></div>
      <ul id="pickList" class="flex-1 overflow-y-auto px-4 pt-2 text-sm"></ul>
      <div class="space-y-2 p-4 text-sm">
        <button class="w-full py-2 text-white" style="background:var(--ink)" onclick="App.exportList('prd')">复制 PRD 要点</button>
        <button class="w-full border py-2" style="border-color:var(--ink);border-width:0.6px" onclick="App.exportList('ai')">复制 AI 原型提示词</button>
        <button class="w-full border py-2" style="border-color:var(--ink);border-width:0.6px" onclick="App.exportList('comp')">复制竞品拆解表</button>
        <button class="soft w-full py-1 text-xs" onclick="App.clearPicks()">清空清单</button>
      </div>
    </aside>`
}

function renderEntries() {
  var q = state.q.trim()
  var items = currentList()
  var c = q ? null : catOf(state.cat)
  drawHead(c)
  $('head').textContent = T(c ? c.zh : '搜索结果')
  $('meta').textContent = (c ? ('0' + (CL.indexOf(c) + 1)).slice(-2) + ' / ' : '') + items.length + ' terms'
  $('entries').innerHTML = T(items.map(cardHTML).join(''))
  $('none').classList.toggle('hidden', items.length > 0)
  document.querySelectorAll('[data-cat]').forEach(function (n) {
    n.classList.toggle('on', !q && n.getAttribute('data-cat') === state.cat)
  })
  document.querySelectorAll('[data-row]').forEach(function (b) {
    b.classList.toggle('on', !q && b.dataset.row === state.cat)
  })
  syncPicks()
}

function render() {
  document.documentElement.lang = lang === 'tw' ? 'zh-Hant' : 'zh-Hans'
  document.title = T('交互辞典 · 线谱版')
  $('app').innerHTML = T(shellHTML())
  $('search').value = state.q
  $('pname').value = state.name
  drawCascade()
  renderEntries()
}

/* ---------- 我的清单（与标准版共用同一份本地存储） ---------- */
function savePicks() {
  try {
    localStorage.setItem('wig-picks', JSON.stringify({ picks: state.picks, name: state.name }))
  } catch (e) {}
}
function syncPicks() {
  document.querySelectorAll('[data-pick]').forEach(function (b) {
    var on = state.picks.indexOf(b.dataset.pick) > -1
    b.textContent = T(on ? '✓ 已加入' : '＋ 清单')
    b.classList.toggle('on', on)
  })
  $('pickN').textContent = state.picks.length
  $('pickList').innerHTML = T(
    state.picks.length
      ? state.picks
          .map(function (id) {
            var t = byId(id)
            return `<li class="flex items-center gap-2 border-b border-neutral-200 py-2"><span class="flex-1">${t.zh} <span class="soft text-xs">${t.en}</span></span><button onclick="App.pick('${id}')" aria-label="移除" class="soft px-1"><i class="fa fa-times"></i></button></li>`
          })
          .join('')
      : '<li class="soft py-8 text-center">清单还是空的。<br>在词条下方点「＋ 清单」，把需求或竞品页面里用到的交互收集到这里。</li>'
  )
}
function specText(t) {
  return (
    '【' + t.zh + ' ' + t.en + '】需求要点\n' +
    t.spec
      .map(function (s) {
        return '- [ ] ' + s
      })
      .join('\n')
  )
}
function exportText(kind) {
  var list = state.picks.map(byId)
  var name = state.name.trim()
  if (kind === 'prd') {
    return (
      '# ' + (name || '（填写页面名称）') + ' 交互需求要点\n\n' +
      list
        .map(function (t) {
          return (
            '## ' + t.zh + '（' + t.en + '）\n' +
            t.spec
              .map(function (s) {
                return '- [ ] ' + s
              })
              .join('\n')
          )
        })
        .join('\n\n')
    )
  }
  if (kind === 'ai') {
    return (
      '请帮我做' + (name ? '「' + name + '」的' : '一个') +
      '网页原型，使用 HTML + Tailwind CSS，单文件即可。页面需要包含以下交互与区块：\n\n' +
      list
        .map(function (t, i) {
          return i + 1 + '. 【' + t.zh + ' ' + t.en + '】' + t.prompt
        })
        .join('\n')
    )
  }
  return (
    '# 竞品交互拆解：' + (name || '（填写产品名称）') + '\n\n' +
    '| 交互 / 区块 | 英文术语 | 出现位置 | 做得好的地方 | 可改进的地方 |\n' +
    '| --- | --- | --- | --- | --- |\n' +
    list
      .map(function (t) {
        return '| ' + t.zh + ' | ' + t.en + ' |  |  |  |'
      })
      .join('\n')
  )
}

var tipTimer
var App = {
  search: function (v) {
    state.q = v
    renderEntries()
  },
  cat: function (id, scroll) {
    state.cat = id
    state.q = ''
    $('search').value = ''
    renderEntries()
    if (scroll) $('list').scrollIntoView({ behavior: 'smooth' })
  },
  lang: function (id) {
    lang = id
    try {
      localStorage.setItem('wig-lang', id)
    } catch (e) {}
    render()
  },
  tip: function (msg) {
    var tip = $('tip')
    tip.textContent = T(msg)
    tip.classList.remove('opacity-0')
    clearTimeout(tipTimer)
    tipTimer = setTimeout(function () {
      tip.classList.add('opacity-0')
    }, 1500)
  },
  pane: function (el, i) {
    var box = el.closest('.says')
    box.querySelectorAll('.tab').forEach(function (b, j) {
      b.classList.toggle('on', j === i)
    })
    box.querySelectorAll('.pane').forEach(function (p, j) {
      p.classList.toggle('hidden', j !== i)
    })
  },
  copyPane: function (el, id) {
    var panes = el.closest('.says').querySelectorAll('.pane')
    var t = byId(id)
    App.copy(T(panes[0].classList.contains('hidden') ? specText(t) : t.prompt))
  },
  pick: function (id) {
    var i = state.picks.indexOf(id)
    if (i > -1) state.picks.splice(i, 1)
    else state.picks.push(id)
    savePicks()
    syncPicks()
  },
  name: function (v) {
    state.name = v
    savePicks()
  },
  clearPicks: function () {
    state.picks = []
    savePicks()
    syncPicks()
  },
  drawer: function (open) {
    $('mask').classList.toggle('hidden', !open)
    $('drawer').classList.toggle('translate-x-full', !open)
  },
  exportList: function (kind) {
    if (!state.picks.length) return App.tip('清单还是空的，先添加几个术语')
    App.copy(T(exportText(kind)))
  },
  copy: function (text) {
    var done = function () {
      App.tip('已复制到剪贴板')
    }
    var fallback = function () {
      var ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
      done()
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback)
    } else {
      fallback()
    }
  }
}

buildIndex()
render()

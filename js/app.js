TERMS.forEach(function (t) {
  var pm = PM[t.id] || {}
  t.vs = t.vs || pm.vs || ''
  t.spec = t.spec || pm.spec || []
  t.ref = t.ref || []
})

/* ============================================================
 * 4. 搜索与「不知道叫什么」反查
 *    中文按相邻两个字切分后比对重合度，所以用大白话描述也能命中
 * ============================================================ */
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

/* ============================================================
 * 5. 页面渲染
 * ============================================================ */
var state = { q: '', cat: 'all', picks: [], name: '' }
try {
  var saved = JSON.parse(localStorage.getItem('wig-picks')) || {}
  state.name = saved.name || ''
  state.picks = (saved.picks || []).filter(function (id) {
    return TERMS.some(function (t) {
      return t.id === id
    })
  })
} catch (e) {}

function catName(id) {
  return CATS.filter(function (c) {
    return c.id === id
  })[0].zh
}

function cardHTML(t) {
  return `<article id="t-${t.id}" class="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <header class="flex items-start justify-between gap-2 px-4 pt-4">
      <div>
        <h3 class="font-semibold text-slate-900">${t.zh}
          <button class="ml-1 rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-sm font-medium text-indigo-600 hover:bg-indigo-100" title="点击复制英文术语" onclick="App.copy('${t.en}')">${t.en}</button>
        </h3>
        <p class="mt-1 text-xs text-slate-400">也叫：${t.alias.join('、')}</p>
      </div>
      <div class="flex shrink-0 flex-col items-end gap-1 text-xs">
        <span class="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">${catName(t.cat)}</span>
        <button data-pick="${t.id}" onclick="App.pick('${t.id}')" class="rounded-full border px-2 py-0.5 transition" title="加入我的清单，用于竞品拆解或批量导出"></button>
      </div>
    </header>
    <div data-demo class="relative m-4 flex h-48 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm">${t.demo}</div>
    <div class="flex-1 space-y-1 px-4 text-sm leading-relaxed">
      <p><span class="font-medium text-slate-900">大白话：</span>${t.plain}。</p>
      <p class="text-slate-500">${t.desc}</p>
      ${t.vs ? `<p class="text-amber-700"><span class="font-medium">易混淆：</span>${t.vs}</p>` : ''}
      ${
        t.ref.length
          ? `<p class="text-xs text-slate-400">看真实案例：${t.ref
              .map(function (r) {
                return `<a href="${REFS[r].url}" target="_blank" rel="noopener" class="text-indigo-600 hover:underline">${REFS[r].name} <i class="fa fa-external-link"></i></a>`
              })
              .join(' · ')}</p>`
          : ''
      }
    </div>
    <div class="m-4 mt-3 overflow-hidden rounded-lg bg-slate-900 text-xs leading-relaxed text-slate-100">
      <div class="flex items-center border-b border-slate-700 text-slate-400">
        <button class="tab px-3 py-2 text-white" onclick="App.pane(this,0)"><i class="fa fa-magic"></i> 对 AI 说</button>
        <button class="tab px-3 py-2" onclick="App.pane(this,1)"><i class="fa fa-file-text-o"></i> 写进 PRD</button>
        <button class="ml-auto px-3 py-2 hover:text-white" title="复制当前内容" aria-label="复制当前内容" onclick="App.copyPane(this,'${t.id}')"><i class="fa fa-copy"></i></button>
      </div>
      <p class="pane p-3">${t.prompt}</p>
      <ul class="pane hidden space-y-1 p-3">
        ${t.spec
          .map(function (s) {
            return `<li class="flex gap-2"><i class="fa fa-square-o mt-0.5 text-slate-500"></i><span>${s}</span></li>`
          })
          .join('')}
      </ul>
    </div>
  </article>`
}

function pageHTML() {
  var langBtn = function (id, label) {
    var on = lang === id
    var off = id === 'tw' && !conv
    return `<button ${off ? 'disabled title="繁体转换组件加载失败"' : ''} onclick="App.lang('${id}')" class="rounded-md px-3 py-1 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${on ? 'bg-white font-medium text-indigo-600 shadow' : 'text-white/80 hover:text-white'}">${label}</button>`
  }
  return `<header class="bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
      <div class="mx-auto max-w-7xl px-4 pb-10 pt-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 font-semibold"><i class="fa fa-book"></i> 网页交互术语图鉴</div>
          <div class="flex rounded-lg bg-white/20 p-0.5">${langBtn('cn', '简体')}${langBtn('tw', '繁体')}</div>
        </div>
        <h1 class="mt-10 text-3xl font-bold md:text-4xl">说得出名字，才写得清需求</h1>
        <p class="mt-3 max-w-2xl text-white/80">给产品经理的交互术语手册：${TERMS.length} 个术语都能亲手点一点，并附上 PRD 要点、易混淆对比和可以直接复制给 AI 的提示词。</p>
        <div class="relative mt-6 max-w-2xl">
          <i class="fa fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input id="search" type="search" autocomplete="off" oninput="App.search(this.value)" placeholder="搜索术语，或用大白话描述你看到的效果…" class="w-full rounded-xl py-3 pl-11 pr-4 text-slate-900 shadow-lg outline-none focus:ring-4 focus:ring-white/40">
        </div>
        <div class="mt-3 flex max-w-3xl flex-wrap items-center gap-2 text-sm">
          <span class="text-white/70">不知道叫什么？试试：</span>
          ${EXAMPLES.map(function (e) {
            return `<button class="rounded-full bg-white/15 px-3 py-1 hover:bg-white/30" onclick="App.search(this.textContent,true)">${e}</button>`
          }).join('')}
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-7xl px-4 py-6">
      <div class="flex flex-wrap items-center gap-2">
        ${CATS.map(function (c) {
          var n =
            c.id === 'all'
              ? TERMS.length
              : TERMS.filter(function (t) {
                  return t.cat === c.id
                }).length
          return `<button data-cat="${c.id}" onclick="App.cat('${c.id}')" class="rounded-full border px-4 py-1.5 text-sm transition"><i class="fa fa-${c.icon}"></i> ${c.zh} <span class="opacity-60">${n}</span></button>`
        }).join('')}
        <span id="count" class="ml-auto text-sm text-slate-400"></span>
      </div>
      <div id="grid" class="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">${TERMS.map(cardHTML).join('')}</div>
      <div id="none" class="hidden py-20 text-center text-slate-400">
        <i class="fa fa-search text-4xl"></i>
        <p class="mt-3">没有找到匹配的术语，换个说法试试？</p>
        <button class="mt-3 text-indigo-600" onclick="App.search('',true)">清空搜索</button>
      </div>
      <section class="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 class="text-lg font-semibold text-slate-900"><i class="fa fa-crosshairs text-indigo-600"></i> 用它做竞品分析</h2>
        <ol class="mt-3 grid gap-3 text-sm md:grid-cols-3">
          <li class="rounded-xl bg-slate-50 p-3"><b class="text-indigo-600">1.</b> 打开竞品页面，从上到下看一遍。</li>
          <li class="rounded-xl bg-slate-50 p-3"><b class="text-indigo-600">2.</b> 每看到一个交互或区块，在这里搜到它，点卡片右上角的「＋ 清单」。</li>
          <li class="rounded-xl bg-slate-50 p-3"><b class="text-indigo-600">3.</b> 打开「我的清单」，复制竞品拆解表，填上位置和优缺点。</li>
        </ol>
        <h3 class="mt-5 text-sm font-medium text-slate-900">去哪找真实案例</h3>
        <div class="mt-2 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          ${Object.keys(REFS)
            .map(function (k) {
              var r = REFS[k]
              return `<a href="${r.url}" target="_blank" rel="noopener" class="rounded-xl border p-3 transition hover:border-indigo-400 hover:shadow"><div class="font-medium text-indigo-600">${r.name} <i class="fa fa-external-link text-xs"></i></div><p class="mt-1 text-xs text-slate-500">${r.note}</p></a>`
            })
            .join('')}
        </div>
      </section>
    </main>
    <footer class="border-t bg-white pb-24 pt-6 text-center text-sm text-slate-400">
      网页交互术语图鉴 · 开源教学项目 · 欢迎补充新的术语
    </footer>
    <button onclick="App.drawer(true)" class="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm text-white shadow-xl transition hover:bg-indigo-700">
      <i class="fa fa-list-ul"></i> 我的清单 <span id="pickN" class="rounded-full bg-white/25 px-2 text-xs">0</span>
    </button>
    <div id="mask" class="fixed inset-0 z-40 hidden bg-black/40" onclick="App.drawer(false)"></div>
    <aside id="drawer" class="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm translate-x-full flex-col bg-white shadow-2xl transition-transform duration-300" aria-label="我的清单">
      <div class="flex items-center justify-between border-b px-4 py-3">
        <h2 class="font-semibold text-slate-900"><i class="fa fa-list-ul text-indigo-600"></i> 我的清单</h2>
        <button onclick="App.drawer(false)" aria-label="关闭" class="px-2 text-slate-400 hover:text-slate-700"><i class="fa fa-times"></i></button>
      </div>
      <div class="border-b p-4">
        <input id="pname" class="${I}" placeholder="产品或页面名称，如：某某 App 首页" oninput="App.name(this.value)">
      </div>
      <ul id="pickList" class="flex-1 divide-y overflow-y-auto text-sm"></ul>
      <div class="space-y-2 border-t p-4 text-sm">
        <button class="w-full rounded-lg bg-indigo-600 py-2 text-white hover:bg-indigo-700" onclick="App.exportList('prd')"><i class="fa fa-file-text-o"></i> 复制 PRD 要点</button>
        <button class="w-full rounded-lg border border-slate-300 py-2 hover:border-indigo-400 hover:text-indigo-600" onclick="App.exportList('ai')"><i class="fa fa-magic"></i> 复制 AI 原型提示词</button>
        <button class="w-full rounded-lg border border-slate-300 py-2 hover:border-indigo-400 hover:text-indigo-600" onclick="App.exportList('comp')"><i class="fa fa-crosshairs"></i> 复制竞品拆解表</button>
        <button class="w-full py-1 text-xs text-slate-400 hover:text-rose-600" onclick="App.clearPicks()">清空清单</button>
      </div>
    </aside>`
}

function apply() {
  var q = state.q.trim().toLowerCase()
  var shown = 0
  TERMS.forEach(function (t) {
    var s = q ? score(t, q) : 1
    var ok = s > 0 && (state.cat === 'all' || t.cat === state.cat)
    var el = document.getElementById('t-' + t.id)
    el.classList.toggle('hidden', !ok)
    // 有搜索词时按匹配度排序，否则保持原始顺序
    el.style.order = q ? String(1000 - Math.round(s)) : ''
    if (ok) shown++
  })
  document.getElementById('count').textContent =
    T('共 ') + shown + T(' 个术语')
  document.getElementById('none').classList.toggle('hidden', shown > 0)
  document.querySelectorAll('[data-cat]').forEach(function (b) {
    var on = b.dataset.cat === state.cat
    b.classList.toggle('bg-indigo-600', on)
    b.classList.toggle('border-indigo-600', on)
    b.classList.toggle('text-white', on)
    b.classList.toggle('bg-white', !on)
    b.classList.toggle('border-slate-200', !on)
  })
}

function render() {
  document.documentElement.lang = lang === 'tw' ? 'zh-Hant' : 'zh-Hans'
  document.title = T('网页交互术语图鉴')
  // 整页 HTML 一次性做简繁转换（只会改动中文字符）
  document.getElementById('app').innerHTML = T(pageHTML())
  document.getElementById('search').value = state.q
  document.getElementById('pname').value = state.name
  apply()
  syncPicks()
}

/* ============================================================
 * 6. 我的清单：收集术语，批量导出 PRD 要点 / AI 提示词 / 竞品拆解表
 * ============================================================ */
function byId(id) {
  return TERMS.filter(function (t) {
    return t.id === id
  })[0]
}

function savePicks() {
  try {
    localStorage.setItem(
      'wig-picks',
      JSON.stringify({ picks: state.picks, name: state.name })
    )
  } catch (e) {}
}

function syncPicks() {
  document.querySelectorAll('[data-pick]').forEach(function (b) {
    var on = state.picks.indexOf(b.dataset.pick) > -1
    b.textContent = T(on ? '✓ 已加入' : '＋ 清单')
    b.classList.toggle('bg-indigo-600', on)
    b.classList.toggle('border-indigo-600', on)
    b.classList.toggle('text-white', on)
    b.classList.toggle('text-slate-500', !on)
  })
  document.getElementById('pickN').textContent = state.picks.length
  document.getElementById('pickList').innerHTML = T(
    state.picks.length
      ? state.picks
          .map(function (id) {
            var t = byId(id)
            return `<li class="flex items-center gap-2 px-4 py-2"><span class="flex-1">${t.zh} <span class="font-mono text-xs text-indigo-600">${t.en}</span></span><button onclick="App.pick('${id}')" aria-label="移除" class="px-1 text-slate-400 hover:text-rose-600"><i class="fa fa-times"></i></button></li>`
          })
          .join('')
      : '<li class="p-6 text-center text-slate-400">清单还是空的。<br>在术语卡片右上角点「＋ 清单」，把需求或竞品页面里用到的交互收集到这里。</li>'
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
  search: function (v, fill) {
    state.q = v
    if (v.trim()) state.cat = 'all'
    if (fill) document.getElementById('search').value = v
    apply()
  },
  cat: function (id) {
    state.cat = id
    apply()
  },
  lang: function (id) {
    lang = id
    try {
      localStorage.setItem('wig-lang', id)
    } catch (e) {}
    render()
  },
  tip: function (msg) {
    var tip = document.getElementById('tip')
    tip.textContent = T(msg)
    tip.classList.remove('opacity-0')
    clearTimeout(tipTimer)
    tipTimer = setTimeout(function () {
      tip.classList.add('opacity-0')
    }, 1500)
  },
  // 卡片底部「对 AI 说 / 写进 PRD」切换
  pane: function (el, i) {
    var box = el.parentElement.parentElement
    box.querySelectorAll('.tab').forEach(function (b, j) {
      b.classList.toggle('text-white', j === i)
    })
    box.querySelectorAll('.pane').forEach(function (p, j) {
      p.classList.toggle('hidden', j !== i)
    })
  },
  copyPane: function (el, id) {
    var panes = el.parentElement.parentElement.querySelectorAll('.pane')
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
    document.getElementById('mask').classList.toggle('hidden', !open)
    document
      .getElementById('drawer')
      .classList.toggle('translate-x-full', !open)
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

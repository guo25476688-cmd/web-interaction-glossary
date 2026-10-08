/* ============================================================
 * 1. 语言：所有文案都用简体书写，繁体由 OpenCC 实时转换
 * ============================================================ */
var lang = 'cn'
try {
  lang = localStorage.getItem('wig-lang') || 'cn'
} catch (e) {}
var conv = null
try {
  conv = OpenCC.Converter({ from: 'cn', to: 'twp' })
} catch (e) {}
if (!conv) lang = 'cn'

function T(s) {
  return lang === 'tw' && conv ? conv(s) : s
}

/* ============================================================
 * 2. 实例里复用的样式与小工具（D = Demo helpers）
 * ============================================================ */
var B =
  'px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 active:scale-95 transition'
var G =
  'px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm hover:border-indigo-400 hover:text-indigo-600 active:scale-95 transition'
var I =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-200'
var P = 'h-7 w-7 rounded border border-slate-300 text-xs'
var FILLER = '<p>这里是一段页面内容，用来把区域撑高，方便滚动。</p>'

var D = {
  // 在当前实例范围内查找元素
  q: function (el, sel) {
    return el.closest('[data-demo]').querySelector(sel)
  },
  qa: function (el, sel) {
    return el.closest('[data-demo]').querySelectorAll(sel)
  },
  // 切换 class（默认切换 hidden）
  tog: function (el, sel, cls) {
    D.q(el, sel).classList.toggle(cls || 'hidden')
  },
  toast: function (el) {
    var t = document.createElement('div')
    t.className =
      'flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg'
    t.innerHTML =
      '<i class="fa fa-check-circle text-emerald-400"></i>' +
      T('保存成功')
    D.q(el, '.ts').appendChild(t)
    setTimeout(function () {
      t.remove()
    }, 2000)
  },
  skel: function (el) {
    var s = D.q(el, '.sk')
    var c = D.q(el, '.ct')
    s.classList.remove('hidden')
    c.classList.add('hidden')
    setTimeout(function () {
      s.classList.add('hidden')
      c.classList.remove('hidden')
    }, 1500)
  },
  spin: function (el) {
    var icon = el.querySelector('i')
    var text = el.querySelector('span')
    el.disabled = true
    icon.classList.remove('hidden')
    text.textContent = T('提交中…')
    setTimeout(function () {
      el.disabled = false
      icon.classList.add('hidden')
      text.textContent = T('提交')
    }, 1500)
  },
  prog: function (el) {
    var bar = D.q(el, '.pb')
    var txt = D.q(el, '.pt')
    var p = 0
    el.disabled = true
    var timer = setInterval(function () {
      p += 10
      bar.style.width = p + '%'
      txt.textContent = p + '%'
      if (p >= 100) {
        clearInterval(timer)
        el.disabled = false
      }
    }, 200)
    bar.style.width = '0%'
  },
  tab: function (el, i) {
    D.qa(el, '.tb').forEach(function (b, j) {
      b.classList.toggle('border-indigo-600', j === i)
      b.classList.toggle('text-indigo-600', j === i)
      b.classList.toggle('border-transparent', j !== i)
    })
    D.qa(el, '.tp').forEach(function (p, j) {
      p.classList.toggle('hidden', j !== i)
    })
  },
  page: function (el, n) {
    var d = el.closest('[data-demo]')
    var c = +d.dataset.p || 1
    c = n === '-' ? Math.max(1, c - 1) : n === '+' ? Math.min(5, c + 1) : n
    d.dataset.p = c
    D.qa(el, '.pg').forEach(function (b, j) {
      b.classList.toggle('bg-indigo-600', j + 1 === c)
      b.classList.toggle('text-white', j + 1 === c)
    })
  },
  drawer: function (el) {
    D.tog(el, '.mk')
    D.tog(el, '.dr', 'translate-x-full')
  },
  step: function (el) {
    var d = el.closest('[data-demo]')
    var s = ((+d.dataset.s || 0) + 1) % 3
    d.dataset.s = s
    D.qa(el, '.st').forEach(function (c, i) {
      c.classList.toggle('bg-indigo-600', i <= s)
      c.classList.toggle('text-white', i <= s)
      c.classList.toggle('bg-slate-200', i > s)
    })
  },
  ac: function (el) {
    var v = el.value.trim()
    var list = D.q(el, '.acl')
    var shown = 0
    list.querySelectorAll('li').forEach(function (li) {
      var ok = v && li.textContent.indexOf(v) > -1
      li.classList.toggle('hidden', !ok)
      if (ok) shown++
    })
    list.classList.toggle('hidden', !shown)
  },
  acPick: function (li) {
    D.q(li, 'input').value = li.textContent
    D.q(li, '.acl').classList.add('hidden')
  },
  valid: function (el) {
    var msg = D.q(el, '.vm')
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)
    if (!el.value) {
      el.style.borderColor = ''
      msg.textContent = ''
      return
    }
    el.style.borderColor = ok ? '#10b981' : '#f43f5e'
    msg.style.color = ok ? '#059669' : '#e11d48'
    msg.textContent = T(ok ? '✓ 格式正确' : '✗ 邮箱格式不正确')
  },
  rate: function (el, n) {
    D.qa(el, '.fa-star').forEach(function (s, i) {
      s.classList.toggle('text-amber-400', i < n)
      s.classList.toggle('text-slate-300', i >= n)
    })
    D.q(el, '.rt').textContent = n + T(' 分')
  },
  drop: function (el, files) {
    el.classList.remove('border-indigo-500', 'bg-indigo-50')
    if (files && files.length) {
      el.querySelector('.dt').textContent = T('已选择：') + files[0].name
    }
  },
  car: function (el, dir) {
    var d = el.closest('[data-demo]')
    var i = ((+d.dataset.i || 0) + dir + 3) % 3
    d.dataset.i = i
    D.q(el, '.cs').style.transform = 'translateX(-' + i * 100 + '%)'
    D.qa(el, '.dot').forEach(function (dot, j) {
      dot.classList.toggle('opacity-50', j !== i)
    })
  },
  inf: function (el) {
    var ul = el.querySelector('ul')
    var n = ul.children.length
    if (el.scrollTop + el.clientHeight < el.scrollHeight - 10) return
    if (n >= 40) {
      el.querySelector('.more').textContent = T('没有更多了')
      return
    }
    for (var i = 1; i <= 5; i++) {
      var li = document.createElement('li')
      li.className = 'px-3 py-2'
      li.textContent = T('第 ') + (n + i) + T(' 条内容')
      ul.appendChild(li)
    }
  },
  drag: null,
  over: function (el, e) {
    var src = D.drag
    if (!src || src === el || src.parentElement !== el.parentElement) return
    var r = el.getBoundingClientRect()
    var before = e.clientY < r.top + r.height / 2
    el.parentElement.insertBefore(src, before ? el : el.nextSibling)
  },
  ctx: function (el, e) {
    var m = el.querySelector('.cm')
    var r = el.getBoundingClientRect()
    m.classList.remove('hidden')
    m.style.left = Math.min(e.clientX - r.left, r.width - 120) + 'px'
    m.style.top = Math.min(e.clientY - r.top, r.height - 100) + 'px'
  }
}

/* ============================================================
 * 术语扩充（二）：移动端与手势 / 引导与系统状态 / 动效 / 页面区块
 * ============================================================ */

/* ---------- 本文件实例用到的小工具 ---------- */
D.tabbar = function (el) {
  D.choose(el, 'text-indigo-600', 'text-slate-400')
  D.q(el, '.tv').textContent = el.textContent.trim()
}
// 从底部滑出的面板（底部弹层、操作菜单共用）
D.sheet = function (el) {
  D.tog(el, '.mk')
  D.tog(el, '.sh', 'translate-y-full')
}
// 下拉刷新：按住列表向下拖
D.ptr = {
  down: function (el, e) {
    el.dataset.y = e.clientY
    el.classList.remove('transition-transform')
    el.setPointerCapture(e.pointerId)
  },
  move: function (el, e) {
    if (!el.dataset.y) return
    var dy = Math.max(0, Math.min(70, e.clientY - el.dataset.y))
    el.dataset.dy = dy
    el.style.transform = 'translateY(' + dy + 'px)'
    D.q(el, '.ph').textContent = T(dy > 50 ? '松开立即刷新' : '继续下拉…')
  },
  up: function (el) {
    if (!el.dataset.y) return
    var hint = D.q(el, '.ph')
    var pulled = +el.dataset.dy > 50
    el.dataset.y = ''
    el.dataset.dy = 0
    el.classList.add('transition-transform')
    el.style.transform = pulled ? 'translateY(36px)' : ''
    if (!pulled) return
    hint.textContent = T('刷新中…')
    setTimeout(function () {
      var li = document.createElement('li')
      li.className = 'px-3 py-2 text-indigo-600'
      li.textContent = T('刚刚刷新出来的新内容')
      el.querySelector('ul').prepend(li)
      el.style.transform = ''
    }, 1000)
  }
}
D.longpress = function (el, down) {
  var bar = el.querySelector('.lb')
  clearTimeout(el._t)
  bar.style.transition = down ? 'width .6s linear' : 'none'
  bar.style.width = down ? '100%' : '0'
  if (!down) return
  D.q(el, '.lm').textContent = ''
  el._t = setTimeout(function () {
    D.q(el, '.lm').textContent = T('✓ 已触发长按：弹出操作菜单')
  }, 600)
}
D.zoom = function (el, s) {
  var d = el.closest('[data-demo]')
  s = Math.max(1, Math.min(3, s))
  d.dataset.s = s
  D.q(el, '.zi').style.transform = 'scale(' + s + ')'
  D.q(el, '.zr').value = s
}
D.tour = function (el) {
  var d = el.closest('[data-demo]')
  var t = ((+d.dataset.t || 0) + 1) % 3
  d.dataset.t = t
  D.qa(el, '.tg').forEach(function (x, i) {
    x.classList.toggle('ring-4', i === t - 1)
  })
  D.qa(el, '.tb2').forEach(function (x, i) {
    x.classList.toggle('hidden', i !== t - 1)
  })
  D.q(el, '.ts2').classList.toggle('hidden', t !== 0)
}
D.autosave = function (el) {
  var status = D.q(el, '.sv')
  status.textContent = T('保存中…')
  clearTimeout(el._t)
  el._t = setTimeout(function () {
    status.textContent =
      T('✓ 已自动保存 ') + new Date().toTimeString().slice(0, 8)
  }, 800)
}
D.undoDel = function (el) {
  var bar = D.q(el, '.ud')
  D.last = el.closest('li')
  D.last.classList.add('hidden')
  bar.classList.remove('hidden')
  clearTimeout(bar._t)
  bar._t = setTimeout(function () {
    bar.classList.add('hidden')
  }, 4000)
}
D.undo = function (el) {
  if (D.last) D.last.classList.remove('hidden')
  D.q(el, '.ud').classList.add('hidden')
}
D.keys = function (el, e) {
  var k = []
  if (e.ctrlKey) k.push('Ctrl')
  if (e.metaKey) k.push('⌘')
  if (e.altKey) k.push('Alt')
  if (e.shiftKey) k.push('Shift')
  if (['Control', 'Meta', 'Alt', 'Shift'].indexOf(e.key) < 0) {
    k.push(e.key === ' ' ? 'Space' : e.key.length === 1 ? e.key.toUpperCase() : e.key)
  }
  el.querySelector('.kk').textContent = k.join(' + ')
}
// 滚动到可见区域时，移除元素 data-in 里列出的 class（懒加载、滚动触发动画共用）
D.inview = function (el) {
  el.querySelectorAll('[data-in]').forEach(function (x) {
    if (x.offsetTop > el.scrollTop + el.clientHeight - 16) return
    x.dataset.in.split(' ').forEach(function (c) {
      x.classList.remove(c)
    })
  })
}
D.debounce = function (el) {
  var d = el.closest('[data-demo]')
  d.dataset.n = (+d.dataset.n || 0) + 1
  D.q(el, '.dn').textContent = d.dataset.n
  clearTimeout(el._t)
  el._t = setTimeout(function () {
    d.dataset.m = (+d.dataset.m || 0) + 1
    D.q(el, '.dm').textContent = d.dataset.m
  }, 500)
}
D.like = function (el) {
  var icon = el.querySelector('i')
  var num = el.querySelector('.ln')
  var on = icon.classList.toggle('fa-heart')
  icon.classList.toggle('fa-heart-o', !on)
  el.classList.toggle('text-rose-500', on)
  num.textContent = +num.textContent + (on ? 1 : -1)
  var status = D.q(el, '.ls')
  status.textContent = T('界面已先更新，正在同步到服务器…')
  clearTimeout(el._t)
  el._t = setTimeout(function () {
    status.textContent = T('✓ 服务器已确认')
  }, 900)
}
D.captcha = function (el) {
  if (+el.value < 98) return (el.value = 0)
  el.disabled = true
  D.q(el, '.cm2').textContent = T('✓ 验证通过')
}
D.countup = function (el) {
  var out = D.q(el, '.cu')
  var target = 12800
  var start = performance.now()
  ;(function step(now) {
    var p = Math.min(1, (now - start) / 1200)
    out.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US')
    if (p < 1) requestAnimationFrame(step)
  })(start)
}
D.type = function (el) {
  var out = D.q(el, '.tw')
  var text = T('你好，我是你的 AI 产品助理。')
  var i = 0
  clearInterval(out._t)
  out.textContent = ''
  out._t = setInterval(function () {
    out.textContent = text.slice(0, ++i)
    if (i >= text.length) clearInterval(out._t)
  }, 90)
}
D.ripple = function (el, e) {
  var r = el.getBoundingClientRect()
  var dot = document.createElement('span')
  dot.className = 'pointer-events-none absolute h-10 w-10 rounded-full bg-white/50'
  dot.style.left = e.clientX - r.left - 20 + 'px'
  dot.style.top = e.clientY - r.top - 20 + 'px'
  dot.style.animation = 'wig-ripple .6s ease-out forwards'
  el.appendChild(dot)
  setTimeout(function () {
    dot.remove()
  }, 600)
}
D.subscribe = function (el) {
  var input = D.q(el, 'input')
  var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)
  var msg = D.q(el, '.nm')
  msg.textContent = T(ok ? '✓ 订阅成功（这里只是演示，不会真的发送）' : '请输入正确的邮箱')
  msg.style.color = ok ? '#059669' : '#e11d48'
}

TERMS.push(
  /* ---------------- 移动端与手势 ---------------- */
  {
    id: 'tabbar',
    cat: 'mobile',
    zh: '底部标签栏',
    en: 'Tab Bar',
    alias: ['底部导航', 'Bottom Navigation', '底栏'],
    plain: '手机 App 最下面那一排图标：首页、发现、消息、我的，点哪个切到哪个',
    desc: 'App 的一级导航，放最重要的三到五个入口，拇指最容易够到。',
    prompt:
      '移动端页面底部加一个固定的 Tab Bar 底部标签栏：4 个入口「首页 / 发现 / 消息 / 我的」，每项为图标加文字，当前项为蓝色，其余为灰色，点击切换页面。',
    vs: '网页顶部的横向导航是 Navbar；同一页面内切换内容的是 Tabs。',
    spec: [
      '放哪几个入口（建议 3–5 个）及顺序',
      '每个入口的图标、文字与选中态',
      '哪些入口需要显示红点或未读数',
      '进入二级页面后标签栏是否隐藏'
    ],
    demo: `<div class="absolute inset-0 flex flex-col bg-white text-xs">
        <div class="flex flex-1 items-center justify-center text-slate-400">当前页面：<span class="tv ml-1 font-medium text-slate-900">首页</span></div>
        <nav class="grid grid-cols-4 border-t py-1.5 text-center">
          <button class="text-indigo-600" onclick="D.tabbar(this)"><i class="fa fa-home block text-lg"></i>首页</button>
          <button class="text-slate-400" onclick="D.tabbar(this)"><i class="fa fa-compass block text-lg"></i>发现</button>
          <button class="text-slate-400" onclick="D.tabbar(this)"><i class="fa fa-comment block text-lg"></i>消息</button>
          <button class="text-slate-400" onclick="D.tabbar(this)"><i class="fa fa-user block text-lg"></i>我的</button>
        </nav>
      </div>`
  },
  {
    id: 'bottomsheet',
    cat: 'mobile',
    zh: '底部弹层',
    en: 'Bottom Sheet',
    alias: ['半屏弹窗', '底部面板', '底部抽屉'],
    plain: '手机上从屏幕底部升起来的面板，顶上有一条小横杠，往下一拉就收回去',
    desc: '移动端代替居中弹窗的主流做法，单手更容易操作。',
    prompt:
      '点击「选择规格」时从屏幕底部滑出 Bottom Sheet 底部弹层：顶部有拖拽横条，面板圆角，占屏幕约一半高度，背后有半透明遮罩，点击遮罩或下拉关闭。',
    vs: '只是列出几个操作选项用 Action Sheet；桌面端从侧边出来的是 Drawer。',
    spec: [
      '面板高度：固定、随内容自适应，还是可拖到全屏',
      '关闭方式：下拉、点遮罩、关闭按钮',
      '内容超出时面板内部能否滚动',
      '键盘弹起时面板如何避让'
    ],
    demo: `<button class="${B}" onclick="D.sheet(this)">选择规格</button>
      <div class="mk absolute inset-0 hidden bg-black/30" onclick="D.sheet(this)"></div>
      <div class="sh absolute inset-x-0 bottom-0 translate-y-full rounded-t-2xl bg-white p-3 text-xs shadow-xl transition-transform duration-300">
        <div class="mx-auto mb-2 h-1 w-8 rounded-full bg-slate-300"></div>
        <div class="mb-2 font-semibold text-slate-900">选择规格</div>
        <div class="mb-3 flex gap-2"><span class="rounded border border-indigo-600 px-2 py-1 text-indigo-600">标准版</span><span class="rounded border px-2 py-1">专业版</span></div>
        <button class="${B} w-full" onclick="D.sheet(this)">确定</button>
      </div>`
  },
  {
    id: 'actionsheet',
    cat: 'mobile',
    zh: '操作菜单',
    en: 'Action Sheet',
    alias: ['动作面板', '底部操作列表', 'ActionSheet'],
    plain: '手机上点「更多」后，从底部升起一列选项，最下面单独有个「取消」',
    desc: '让用户从几个操作里选一个，是移动端版的下拉菜单。',
    prompt:
      '点击头像时从底部弹出 Action Sheet 操作菜单：选项为「拍照 / 从相册选择」，危险操作「删除头像」标红，最下方有独立的「取消」按钮。',
    vs: '面板里要放表单或复杂内容用 Bottom Sheet。',
    spec: [
      '有哪些选项及顺序',
      '危险操作是否标红、是否再次确认',
      '是否有标题或说明文字',
      '取消方式：取消按钮、点遮罩'
    ],
    demo: `<button class="${G}" onclick="D.sheet(this)">更换头像</button>
      <div class="mk absolute inset-0 hidden bg-black/30" onclick="D.sheet(this)"></div>
      <div class="sh absolute inset-x-0 bottom-0 translate-y-full space-y-1.5 bg-slate-100 p-2 text-center text-xs transition-transform duration-300">
        <ul class="divide-y overflow-hidden rounded-xl bg-white" onclick="D.sheet(this)">
          <li class="cursor-pointer py-2">拍照</li><li class="cursor-pointer py-2">从相册选择</li><li class="cursor-pointer py-2 text-rose-600">删除头像</li>
        </ul>
        <button class="w-full rounded-xl bg-white py-2 font-medium" onclick="D.sheet(this)">取消</button>
      </div>`
  },
  {
    id: 'pulltorefresh',
    cat: 'mobile',
    zh: '下拉刷新',
    en: 'Pull to Refresh',
    alias: ['下拉更新', '下拉加载'],
    plain: '手机上把列表往下拉一下再松手，顶上转个圈，内容就更新了',
    desc: '移动端刷新内容的标准手势，用户已经形成习惯。',
    prompt:
      '消息列表支持 Pull to Refresh 下拉刷新：在列表顶部向下拖动时显示「继续下拉」，超过阈值后变为「松开立即刷新」，松手后显示加载动画并请求最新数据，完成后回弹。',
    vs: '到底部加载更早的内容是 Infinite Scroll（上拉加载）。',
    spec: [
      '哪些页面支持下拉刷新',
      '下拉、松手、刷新中、完成各阶段的提示',
      '刷新后新内容出现在哪里，是否提示「更新了 N 条」',
      '刷新失败时的提示'
    ],
    demo: `<div class="absolute inset-0 overflow-hidden bg-slate-200 text-xs">
        <div class="ph pt-2.5 text-center text-slate-500">继续下拉…</div>
        <div class="absolute inset-0 cursor-grab touch-none select-none bg-white" onpointerdown="D.ptr.down(this,event)" onpointermove="D.ptr.move(this,event)" onpointerup="D.ptr.up(this)" onpointercancel="D.ptr.up(this)">
          <ul class="divide-y">
            <li class="px-3 py-2 font-medium text-slate-900">按住这里往下拖，再松手</li>
            <li class="px-3 py-2">第 1 条消息</li><li class="px-3 py-2">第 2 条消息</li><li class="px-3 py-2">第 3 条消息</li>
          </ul>
        </div>
      </div>`
  },
  {
    id: 'swipeaction',
    cat: 'mobile',
    zh: '滑动操作',
    en: 'Swipe Actions',
    alias: ['左滑删除', '侧滑菜单', 'Swipe to Delete'],
    plain: '在手机列表里把某一行往左一滑，右边露出「删除」「置顶」按钮',
    desc: '把每一行的操作藏起来，保持列表干净；微信聊天列表就是这样。',
    prompt:
      '消息列表的每一行支持 Swipe Actions 滑动操作：向左滑动时右侧露出黄色「置顶」和红色「删除」按钮，点击删除后该行消失，同一时间只允许一行处于展开状态。',
    vs: '桌面端没有滑动手势，对应的是悬停显示操作按钮或右键菜单。',
    spec: [
      '左滑、右滑分别露出哪些操作',
      '删除等危险操作是否需要再次确认',
      '如何让用户发现这个隐藏操作（首次引导）',
      '桌面端的替代方式'
    ],
    demo: `<div class="w-56 text-xs">
        <ul class="divide-y overflow-hidden rounded-lg border bg-white">
          ${['小王：需求文档我看完了', '小李：设计稿已更新', '小张：周五前给到']
            .map(function (m) {
              return `<li class="wig-noscrollbar flex snap-x snap-mandatory overflow-x-auto"><div class="w-full shrink-0 snap-start px-3 py-2.5">${m}</div><button class="w-12 shrink-0 snap-end bg-amber-500 text-white">置顶</button><button class="w-12 shrink-0 snap-end bg-rose-600 text-white" onclick="this.closest('li').remove()">删除</button></li>`
            })
            .join('')}
        </ul>
        <p class="mt-2 text-center text-slate-400">把某一行向左滑（电脑上按住 Shift 滚动滚轮）</p>
      </div>`
  },
  {
    id: 'longpress',
    cat: 'mobile',
    zh: '长按',
    en: 'Long Press',
    alias: ['按住', '长按菜单', 'Press and Hold'],
    plain: '手指按住一个东西不松开，过一会儿弹出菜单，比如长按微信消息出来「复制、转发」',
    desc: '移动端的「右键」，用来唤出次要操作，但用户不容易发现。',
    prompt:
      '聊天消息支持 Long Press 长按：按住消息超过 600 毫秒后在消息上方弹出操作菜单「复制 / 转发 / 删除」，并伴随轻微震动反馈，未达到时长松手则不触发。',
    vs: '桌面端对应的是 Context Menu 右键菜单。',
    spec: [
      '哪些元素支持长按，长按后出现什么',
      '触发所需的按住时长',
      '是否有触感或视觉反馈',
      '同样的功能是否另有看得见的入口（长按不易被发现）'
    ],
    demo: `<div class="text-center text-xs">
        <button class="relative select-none overflow-hidden rounded-xl bg-indigo-600 px-5 py-3 text-sm text-white" style="touch-action:none" oncontextmenu="event.preventDefault()" onpointerdown="D.longpress(this,true)" onpointerup="D.longpress(this,false)" onpointerleave="D.longpress(this,false)">
          <span class="lb absolute inset-y-0 left-0 bg-white/30" style="width:0"></span><span class="relative">按住我不放</span>
        </button>
        <p class="lm mt-3 h-4 text-emerald-600"></p>
      </div>`
  },
  {
    id: 'pinch',
    cat: 'mobile',
    zh: '双指缩放',
    en: 'Pinch to Zoom',
    alias: ['捏合缩放', '手势缩放', 'Pinch'],
    plain: '两根手指在屏幕上张开就放大、捏拢就缩小，看图片和地图时最常用',
    desc: '查看图片、地图、画布细节的标准手势。',
    prompt:
      '图片查看器支持 Pinch to Zoom 双指缩放：双指张开放大、捏合缩小，缩放范围 1–3 倍，放大后可单指拖动查看，双击在 1 倍和 2 倍之间切换。',
    spec: [
      '哪些内容可以缩放',
      '最小、最大缩放倍数',
      '是否支持双击放大、放大后拖动',
      '桌面端的替代方式（滚轮、缩放按钮）'
    ],
    demo: `<div class="w-56 text-xs">
        <div class="flex h-24 items-center justify-center overflow-hidden rounded-lg bg-slate-200" onwheel="event.preventDefault();D.zoom(this,(+this.closest('[data-demo]').dataset.s||1)-event.deltaY*0.01)">
          <div class="zi flex h-14 w-20 items-center justify-center rounded bg-gradient-to-br from-sky-400 to-emerald-400 text-white transition-transform"><i class="fa fa-picture-o text-xl"></i></div>
        </div>
        <input type="range" min="1" max="3" step="0.1" value="1" class="zr mt-2 w-full accent-indigo-600" aria-label="缩放倍数" oninput="D.zoom(this,+this.value)">
        <p class="text-center text-slate-400">在图上双指捏合（触控板）或拖动滑块</p>
      </div>`
  },
  {
    id: 'picker',
    cat: 'mobile',
    zh: '滚轮选择器',
    en: 'Picker',
    alias: ['滚轮', 'Wheel Picker', '滚动选择'],
    plain: '手机上选日期时出现的那种上下滚动的轮子，停在中间那一格的就是选中的',
    desc: '移动端代替下拉框的选择方式，适合手指滑动操作。',
    prompt:
      '「出生年份」使用 Picker 滚轮选择器：从底部弹出，选项纵向排列并可上下滑动，中间一行为选中项并有高亮条，滑动停止时自动吸附对齐，顶部有「取消 / 确定」。',
    vs: '桌面端用 Select 或 Date Picker。',
    spec: [
      '有几列，各列的选项范围',
      '默认选中项',
      '各列之间是否联动（如年月决定天数）',
      '确认方式：点「确定」还是滑动即生效'
    ],
    demo: `<div class="relative h-28 w-40 overflow-hidden rounded-lg border bg-white text-sm">
        <div class="pointer-events-none absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 border-y border-indigo-300 bg-indigo-50"></div>
        <ul class="wig-noscrollbar relative h-full snap-y snap-mandatory overflow-y-auto py-10 text-center">
          ${[1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000]
            .map(function (y) {
              return `<li class="h-8 snap-center leading-8">${y} 年</li>`
            })
            .join('')}
        </ul>
      </div>`
  },

  /* ---------------- 引导与系统状态 ---------------- */
  {
    id: 'onboarding',
    cat: 'system',
    zh: '新手引导',
    en: 'Onboarding Tour',
    alias: ['功能引导', 'Coach Mark', '引导气泡'],
    plain: '第一次用的时候，一个气泡指着某个按钮告诉你这是干嘛的，点「下一步」再指向下一个',
    desc: '帮新用户快速认识关键功能。步骤越少越好，一定要能跳过。',
    prompt:
      '用户首次进入时启动 Onboarding Tour 新手引导：依次高亮「新建」按钮和「消息」图标，旁边显示带说明文字的气泡，气泡内有步骤计数和「下一步」按钮，可随时跳过。',
    vs: '常驻的简短说明用 Tooltip；引导是一次性的、有先后顺序的。',
    spec: [
      '什么时候触发（首次登录、新功能上线）',
      '共几步，每步指向哪个元素、说什么',
      '能否跳过，之后还能否重新查看',
      '是否记录已看过（换设备后是否再次出现）'
    ],
    demo: `<div class="absolute inset-0 bg-white p-3 text-xs">
        <div class="flex items-center justify-between">
          <button class="tg rounded bg-indigo-600 px-2 py-1 text-white ring-indigo-300"><i class="fa fa-plus"></i> 新建</button>
          <span class="tg rounded-full p-1 ring-indigo-300"><i class="fa fa-bell text-lg text-slate-500"></i></span>
        </div>
        <div class="tb2 absolute left-3 top-12 hidden w-36 rounded-lg bg-slate-800 p-2 text-white">点这里创建你的第一份文档。<button class="mt-1 block text-indigo-300" onclick="D.tour(this)">下一步（1/2）</button></div>
        <div class="tb2 absolute right-3 top-12 hidden w-36 rounded-lg bg-slate-800 p-2 text-white">同事的评论会出现在这里。<button class="mt-1 block text-indigo-300" onclick="D.tour(this)">完成（2/2）</button></div>
        <div class="ts2 absolute inset-x-0 bottom-6 text-center"><button class="${G}" onclick="D.tour(this)">开始引导</button></div>
      </div>`
  },
  {
    id: 'errorpage',
    cat: 'system',
    zh: '错误页',
    en: 'Error Page',
    alias: ['404 页面', '500 页面', '页面不存在'],
    plain: '打开一个不存在的网址时看到的那一页，写着大大的 404 和「页面走丢了」',
    desc: '出错时别让用户卡死：说明发生了什么，并给一条出路。',
    prompt:
      '做一个 404 Error Page 错误页：居中显示大号「404」、标题「页面走丢了」、一句说明，下方是「返回首页」按钮，整体保留网站的导航栏。',
    vs: '页面正常但没有数据用 Empty State；错误页是整个页面都打不开。',
    spec: [
      '区分哪些错误：页面不存在（404）、无权限（403）、服务器出错（500）',
      '每种错误的文案（用人话，不要只写错误码）',
      '提供的出路：返回首页、返回上一页、重试、联系客服'
    ],
    demo: `<div class="text-center">
        <div class="text-4xl font-black text-slate-300">404</div>
        <div class="mt-1 font-semibold text-slate-900">页面走丢了</div>
        <p class="mb-3 text-xs text-slate-400">你访问的页面不存在或已被删除</p>
        <button class="${B}">返回首页</button>
      </div>`
  },
  {
    id: 'offline',
    cat: 'system',
    zh: '离线提示',
    en: 'Offline State',
    alias: ['断网提示', '网络异常', '弱网状态'],
    plain: '网断了的时候，页面顶上冒出一条「网络已断开」，网好了它又自己消失',
    desc: '让用户知道问题出在网络上，而不是产品坏了。',
    prompt:
      '检测到断网时在页面顶部显示 Offline 离线提示条：灰色背景、「网络已断开，请检查连接」文案；网络恢复后提示变为绿色「网络已恢复」并在 2 秒后自动消失。',
    spec: [
      '断网时哪些功能还能用、哪些要禁用',
      '提示的位置与文案',
      '断网期间的操作是否暂存，联网后是否自动重试',
      '网络恢复后的表现'
    ],
    demo: `<div class="absolute inset-0 bg-white text-xs">
        <div class="of hidden bg-slate-700 px-3 py-1.5 text-center text-white"><i class="fa fa-wifi"></i> 网络已断开，请检查连接</div>
        <div class="p-3 text-center"><p class="mb-3 text-slate-400">页面内容…</p><button class="${G}" onclick="D.tog(this,'.of')">模拟断网 / 恢复</button></div>
      </div>`
  },
  {
    id: 'permission',
    cat: 'system',
    zh: '权限申请',
    en: 'Permission Request',
    alias: ['授权弹窗', '系统权限', '权限请求'],
    plain: '弹出一个框问你「是否允许访问位置 / 相机 / 通知」，有「允许」和「不允许」两个按钮',
    desc: '使用定位、相机、通知等能力前必须征得用户同意。时机和理由决定了同意率。',
    prompt:
      '在用户点击「查找附近门店」时才发起定位的 Permission Request 权限申请：先显示自定义说明弹窗解释用途，用户同意后再调用系统授权；被拒绝时提示可手动选择城市。',
    spec: [
      '需要哪些权限，分别在什么时机申请（用到时再要，不要一打开就要）',
      '申请前是否先解释用途',
      '用户拒绝后的降级方案',
      '如何引导已拒绝的用户重新开启'
    ],
    demo: `<div class="text-center text-xs">
        <div class="pd w-52 rounded-xl bg-white p-3 shadow-lg">
          <i class="fa fa-map-marker text-2xl text-indigo-600"></i>
          <div class="my-1 font-semibold text-slate-900">允许使用你的位置吗？</div>
          <p class="mb-2 text-slate-500">用于查找离你最近的门店。</p>
          <div class="grid grid-cols-2 gap-2"><button class="${G}" onclick="D.tog(this,'.pd');D.q(this,'.pr2').textContent=T('已拒绝：改为手动选择城市')">不允许</button><button class="${B}" onclick="D.tog(this,'.pd');D.q(this,'.pr2').textContent=T('已允许：显示附近的门店')">允许</button></div>
        </div>
        <p class="pr2 text-slate-500"></p>
        <button class="mt-1 text-indigo-600" onclick="D.q(this,'.pd').classList.remove('hidden');D.q(this,'.pr2').textContent=''">重新演示</button>
      </div>`
  },
  {
    id: 'autosave',
    cat: 'system',
    zh: '自动保存',
    en: 'Autosave',
    alias: ['实时保存', '草稿保存', '自动存草稿'],
    plain: '你一边打字它一边自己存，角落里显示「已保存」，不用你点保存按钮',
    desc: '避免因误关页面、断网而丢失内容，在线文档的标配。',
    prompt:
      '编辑器支持 Autosave 自动保存：用户停止输入 1 秒后自动保存，右上角状态依次显示「保存中…」和「已自动保存 + 时间」，保存失败时显示红色提示和重试按钮。',
    vs: '修改需要用户明确确认才生效的场景（如支付设置），仍应使用「保存」按钮。',
    spec: [
      '触发时机：停止输入多久后、或每隔多久',
      '保存状态如何展示（保存中、已保存、失败）',
      '保存失败或断网时怎么办',
      '多人同时编辑或多端编辑时的冲突处理'
    ],
    demo: `<div class="w-52 text-xs">
        <div class="sv mb-1 h-4 text-right text-slate-400">尚未修改</div>
        <textarea rows="3" class="${I} resize-none" placeholder="在这里随便打点字…" oninput="D.autosave(this)"></textarea>
      </div>`
  },
  {
    id: 'undo',
    cat: 'system',
    zh: '撤销',
    en: 'Undo',
    alias: ['撤回', '反悔', 'Undo Toast'],
    plain: '删掉东西后底下冒出一条「已删除」，旁边有个「撤销」，几秒内点它就能恢复',
    desc: '比「你确定吗」的弹窗更顺畅：先执行，再给反悔的机会。',
    prompt:
      '删除列表项时不弹确认框，而是立即移除并在底部显示带 Undo 撤销按钮的提示「已删除」，4 秒内点击「撤销」可恢复该项，超时后才真正删除。',
    vs: '后果严重且无法恢复的操作，仍应使用二次确认（Popconfirm 或 Modal）。',
    spec: [
      '哪些操作支持撤销',
      '可撤销的时间窗口有多长',
      '撤销后恢复到什么状态（位置、顺序）',
      '连续多次操作时，撤销的是哪一次'
    ],
    demo: `<div class="relative h-full w-56 py-3 text-xs">
        <ul class="divide-y rounded-lg border bg-white">
          ${['周报', '会议纪要', '竞品分析']
            .map(function (x) {
              return `<li class="flex items-center justify-between px-3 py-1.5">${x}<button class="text-slate-400 hover:text-rose-600" aria-label="删除" onclick="D.undoDel(this)"><i class="fa fa-trash-o"></i></button></li>`
            })
            .join('')}
        </ul>
        <div class="ud absolute inset-x-0 bottom-2 flex hidden items-center justify-between rounded-lg bg-slate-800 px-3 py-2 text-white">已删除<button class="font-medium text-indigo-300" onclick="D.undo(this)">撤销</button></div>
      </div>`
  },
  {
    id: 'darkmode',
    cat: 'system',
    zh: '深色模式',
    en: 'Dark Mode',
    alias: ['暗色模式', '夜间模式', '主题切换'],
    plain: '点一下月亮图标，整个页面从白底黑字变成黑底白字，晚上看不刺眼',
    desc: '提供浅色、深色两套配色，通常默认跟随系统设置。',
    prompt:
      '网站支持 Dark Mode 深色模式：导航栏右侧有太阳 / 月亮切换按钮，默认跟随系统设置，切换时背景和文字颜色带过渡，用户的选择保存在本地下次仍然生效。',
    spec: [
      '提供哪些选项：浅色、深色、跟随系统',
      '默认值是什么，用户的选择保存在哪里',
      '图片、图表、品牌色在深色下如何处理',
      '是否所有页面都要支持'
    ],
    demo: `<div class="dkb w-52 rounded-xl border p-4 text-xs transition-colors duration-300 bg-white">
        <div class="mb-2 flex items-center justify-between"><b>设置</b><button class="h-7 w-7 rounded-full border" aria-label="切换深色模式" onclick="var b=D.q(this,'.dkb');['bg-white','bg-slate-900','text-slate-100','border-slate-700'].forEach(function(c){b.classList.toggle(c)});this.firstChild.classList.toggle('fa-sun-o');this.firstChild.classList.toggle('fa-moon-o')"><i class="fa fa-moon-o"></i></button></div>
        <p class="opacity-70">点右上角的图标，切换浅色与深色。</p>
      </div>`
  },
  {
    id: 'shortcut',
    cat: 'system',
    zh: '快捷键',
    en: 'Keyboard Shortcut',
    alias: ['键盘快捷键', '热键', 'Hotkey'],
    plain: '不用鼠标点，直接按键盘上几个键的组合就能完成操作，比如 Ctrl + S 保存',
    desc: '给高频用户的效率工具，工具类、编辑类产品尤其重要。',
    prompt:
      '为编辑器添加 Keyboard Shortcut 快捷键：Ctrl/Cmd + S 保存、Ctrl/Cmd + K 打开命令面板、Esc 关闭弹窗，并在对应按钮的 Tooltip 中显示快捷键提示。',
    spec: [
      '哪些操作有快捷键，分别是什么',
      'Windows 与 Mac 的按键差异（Ctrl 与 ⌘）',
      '是否与浏览器或系统快捷键冲突',
      '用户如何得知有哪些快捷键（提示、快捷键列表）'
    ],
    demo: `<div tabindex="0" class="w-52 cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-4 text-center text-xs outline-none focus:border-indigo-500" onkeydown="D.keys(this,event)">
        <p class="mb-2 text-slate-400">先点一下这里，再按任意组合键</p>
        <kbd class="kk inline-block min-h-[28px] min-w-[60px] rounded-lg border bg-slate-100 px-3 py-1 font-mono text-sm text-slate-900 shadow-sm">…</kbd>
      </div>`
  },
  {
    id: 'lazyload',
    cat: 'system',
    zh: '懒加载',
    en: 'Lazy Loading',
    alias: ['延迟加载', '按需加载', '图片懒加载'],
    plain: '图片不是一打开页面就全部加载，而是你滚到哪儿，哪儿的图才开始显示出来',
    desc: '让页面首屏打开更快、更省流量，图片多的页面必备。',
    prompt:
      '图片列表使用 Lazy Loading 懒加载：图片进入可视区域前显示灰色占位块，滚动到附近时才开始加载，加载完成后淡入显示，占位块与图片尺寸一致避免页面跳动。',
    vs: 'Infinite Scroll 是「到底了再多拿一批数据」；懒加载是「数据已有，图片晚点再下」。',
    spec: [
      '哪些内容需要懒加载（图片、视频、页面模块）',
      '加载前的占位样式',
      '提前多远开始加载',
      '加载失败时显示什么'
    ],
    demo: `<div class="absolute inset-0 space-y-2 overflow-y-auto p-3 text-xs" onscroll="D.inview(this)">
        <p class="font-medium text-slate-700">向下滚动，图片滚到才加载 ↓</p>
        ${['from-indigo-400 to-fuchsia-400', 'from-sky-400 to-emerald-400', 'from-amber-400 to-rose-400', 'from-teal-400 to-indigo-400']
          .map(function (g, i) {
            return `<div class="h-20 rounded-lg bg-slate-200"><div class="h-full rounded-lg bg-gradient-to-br ${g} transition-opacity duration-700 ${i ? 'opacity-0' : ''}" ${i ? 'data-in="opacity-0"' : ''}></div></div>`
          })
          .join('')}
      </div>`
  },
  {
    id: 'debounce',
    cat: 'system',
    zh: '防抖',
    en: 'Debounce',
    alias: ['输入防抖', '节流', 'Throttle'],
    plain: '在搜索框里连续打字时，不是每打一个字就搜一次，而是等你停下来半秒才去搜',
    desc: '减少不必要的请求，让页面不卡、服务器压力小。常和开发沟通时提到。',
    prompt:
      '搜索框的联想请求加上 Debounce 防抖：用户停止输入 500 毫秒后才发起请求，连续输入期间不请求，新的请求发出时取消尚未返回的旧请求。',
    vs: '节流（Throttle）是「每隔固定时间最多执行一次」，常用于滚动；防抖是「停下来才执行」，常用于输入。',
    spec: [
      '哪些操作需要防抖（搜索联想、自动保存、窗口缩放）',
      '等待时长（常见 300–500 毫秒）',
      '等待期间界面是否显示加载状态'
    ],
    demo: `<div class="w-52 text-xs">
        <input class="${I}" placeholder="快速连续打几个字" oninput="D.debounce(this)">
        <div class="mt-2 grid grid-cols-2 gap-2 text-center">
          <div class="rounded-lg bg-white p-2"><div class="dn text-lg font-bold text-slate-900">0</div>按键次数</div>
          <div class="rounded-lg bg-white p-2"><div class="dm text-lg font-bold text-indigo-600">0</div>实际请求次数</div>
        </div>
      </div>`
  },
  {
    id: 'optimistic',
    cat: 'system',
    zh: '乐观更新',
    en: 'Optimistic Update',
    alias: ['乐观 UI', '先响应后同步', 'Optimistic UI'],
    plain: '点赞时红心马上就亮了，其实这时候服务器还没回话；万一失败了再悄悄变回去',
    desc: '先假设操作会成功、立刻更新界面，让产品感觉非常快。',
    prompt:
      '点赞按钮使用 Optimistic Update 乐观更新：点击后图标立即变红、数字立即加一，同时在后台发送请求；如果请求失败，则回滚到之前的状态并提示「操作失败，请重试」。',
    vs: '涉及金钱、库存等必须以服务器结果为准的操作，应显示加载状态并等待返回。',
    spec: [
      '哪些操作适合（点赞、收藏、勾选等成功率高的轻操作）',
      '请求失败后如何回滚、如何提示',
      '用户快速连续点击时的处理'
    ],
    demo: `<div class="text-center text-xs">
        <button class="rounded-full border bg-white px-4 py-2 text-sm transition" onclick="D.like(this)"><i class="fa fa-heart-o"></i> <span class="ln">128</span></button>
        <p class="ls mt-3 h-4 text-slate-500"></p>
      </div>`
  },
  {
    id: 'captcha',
    cat: 'system',
    zh: '人机验证',
    en: 'CAPTCHA',
    alias: ['滑块验证', '图形验证码', '验证码'],
    plain: '登录时让你把滑块拖到最右边、或者点出图里的红绿灯，用来证明你不是机器人',
    desc: '拦截机器批量注册、刷接口，但会打断正常用户，能不出现就不出现。',
    prompt:
      '登录表单在连续输错 3 次密码后显示 CAPTCHA 滑块验证：用户把滑块拖到最右端即验证通过并显示绿色提示，未拖到底则回弹到起点。（实际项目接入第三方验证服务）',
    spec: [
      '在哪些场景出现（注册、登录、发短信、高频操作）',
      '是每次都出现，还是判定有风险时才出现',
      '验证失败后的重试方式',
      '无障碍替代方案（如语音验证）'
    ],
    demo: `<div class="w-52 text-center text-xs">
        <p class="mb-2 text-slate-500">把滑块拖到最右边</p>
        <input type="range" min="0" max="100" value="0" class="w-full accent-indigo-600" aria-label="滑块验证" onchange="D.captcha(this)">
        <p class="cm2 mt-2 h-4 text-emerald-600"></p>
      </div>`
  },

  /* ---------------- 状态与动效（补充） ---------------- */
  {
    id: 'parallax',
    cat: 'state',
    zh: '视差滚动',
    en: 'Parallax',
    alias: ['视差效果', 'Parallax Scrolling', '滚动视差'],
    plain: '往下滚的时候，背景动得慢、前面的字动得快，看起来有前后的立体感',
    desc: '让页面有纵深感，常见于品牌官网、活动页的首屏。',
    prompt:
      '首屏加入 Parallax 视差滚动效果：背景图的滚动速度为页面的一半，前景文字按正常速度滚动，形成前后层次感；移动端关闭该效果以保证性能。',
    spec: [
      '哪些区块使用，分几层，各层的速度差',
      '移动端是否保留（性能与耗电）',
      '是否尊重系统的「减少动态效果」设置'
    ],
    demo: `<div class="absolute inset-0 overflow-y-auto text-xs" onscroll="D.q(this,'.pb2').style.transform='translateY('+this.scrollTop*0.5+'px)'">
        <div class="relative h-[420px] overflow-hidden bg-slate-900">
          <div class="pb2 absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-indigo-500 to-slate-900"><span class="absolute right-8 top-6 h-10 w-10 rounded-full bg-amber-200"></span><span class="absolute left-6 top-16 h-2 w-2 rounded-full bg-white"></span><span class="absolute left-24 top-8 h-1 w-1 rounded-full bg-white"></span></div>
          <div class="relative space-y-24 p-4 text-white"><p class="text-base font-bold">向下滚动 ↓</p><p class="rounded-lg bg-white/10 p-3">前景文字滚得快</p><p class="rounded-lg bg-white/10 p-3">背景的月亮滚得慢</p></div>
        </div>
      </div>`
  },
  {
    id: 'scrollreveal',
    cat: 'state',
    zh: '滚动触发动画',
    en: 'Scroll-triggered Animation',
    alias: ['滚动显现', 'Scroll Reveal', '入场动画'],
    plain: '往下滚的时候，内容不是早就摆在那儿，而是滚到了才一块一块淡入、浮上来',
    desc: '引导视线、增加精致感。用得太多会让人觉得慢，重点内容用就够了。',
    prompt:
      '各内容区块添加 Scroll-triggered 滚动触发动画：元素进入视口时从下方 24px 处淡入上浮，时长 700ms，同一区块内的多个卡片依次延迟 100ms 出现，每个元素只播放一次。',
    vs: '跟随滚动进度连续变化的是 Parallax；这里是「到达某个位置时触发一次」。',
    spec: [
      '哪些元素需要入场动画，动画形式（淡入、上浮、缩放）',
      '只播放一次还是每次进入都播放',
      '多个元素之间是否依次错开',
      '是否尊重系统的「减少动态效果」设置'
    ],
    demo: `<div class="absolute inset-0 space-y-3 overflow-y-auto p-3 text-xs" onscroll="D.inview(this)">
        <p class="font-medium text-slate-700">向下滚动，卡片滚到才出现 ↓</p>
        <div class="h-20 rounded-lg bg-white p-3 shadow">第一张卡片</div>
        ${['第二张卡片', '第三张卡片', '第四张卡片']
          .map(function (x) {
            return `<div class="h-20 translate-y-6 rounded-lg bg-white p-3 opacity-0 shadow transition duration-700" data-in="opacity-0 translate-y-6">${x}</div>`
          })
          .join('')}
      </div>`
  },
  {
    id: 'marquee',
    cat: 'state',
    zh: '跑马灯',
    en: 'Marquee',
    alias: ['滚动字幕', '无限滚动条', '走马灯'],
    plain: '一行字或一排图标自己不停地横着滚过去，循环播放没有尽头',
    desc: '在有限宽度里展示很多内容：公告、客户 Logo、用户评价。',
    prompt:
      '用 Marquee 跑马灯展示客户名称：内容从右向左匀速无限循环滚动，首尾无缝衔接，鼠标悬停时暂停，左右两端有渐隐遮罩。',
    vs: '一次只展示一项并可手动切换的是 Carousel。',
    spec: [
      '滚动的内容与数量',
      '方向与速度',
      '悬停或点击时是否暂停',
      '内容很少、不足一屏时是否还滚动'
    ],
    demo: `<div class="w-full overflow-hidden bg-slate-900 py-3 text-xs text-white">
        <div class="flex w-max whitespace-nowrap" style="animation:wig-marquee 12s linear infinite" onmouseenter="this.style.animationPlayState='paused'" onmouseleave="this.style.animationPlayState='running'">
          ${[0, 1]
            .map(function () {
              return '<span class="pr-8">🔥 限时活动：新用户首月免费</span><span class="pr-8">📢 系统将于周日凌晨升级</span><span class="pr-8">🎉 累计用户突破 10 万</span>'
            })
            .join('')}
        </div>
      </div>`
  },
  {
    id: 'countup',
    cat: 'state',
    zh: '数字滚动',
    en: 'Count Up',
    alias: ['数字增长动画', '数字跳动', 'Number Animation'],
    plain: '数字不是直接显示出来，而是从 0 飞快地一路跳到最终的数',
    desc: '让关键数字更有冲击力，常用于数据指标区和数据大屏。',
    prompt:
      '数据指标区的数字使用 Count Up 数字滚动动画：进入视口时从 0 增长到目标值，时长约 1.2 秒，先快后慢，带千分位分隔符，只播放一次。',
    spec: [
      '哪些数字需要动画',
      '时长与触发时机（进入视口时、数据更新时）',
      '数字格式（千分位、小数位、单位）'
    ],
    demo: `<div class="text-center">
        <div class="cu text-3xl font-bold text-indigo-600">12,800</div>
        <p class="mb-3 text-xs text-slate-400">累计用户</p>
        <button class="${G}" onclick="D.countup(this)">重新播放</button>
      </div>`
  },
  {
    id: 'typewriter',
    cat: 'state',
    zh: '打字机效果',
    en: 'Typewriter Effect',
    alias: ['逐字输出', '流式输出', 'Streaming Text'],
    plain: '文字一个一个蹦出来，后面跟着一个闪烁的光标，AI 聊天回答时就是这样',
    desc: '营造「正在生成」的感觉；AI 产品里也用来减轻等待的焦虑。',
    prompt:
      'AI 回复使用 Typewriter 打字机效果逐字显示：每个字间隔约 90 毫秒，末尾有闪烁的光标，输出过程中页面自动滚动到最新内容，提供「停止生成」按钮。',
    spec: [
      '用在哪里（标题装饰、AI 回复）',
      '输出速度，是否可跳过或停止',
      '输出过程中页面是否自动跟随滚动',
      '输出完成后光标是否消失'
    ],
    demo: `<div class="w-56 text-center text-sm">
        <p class="mb-3 h-10 text-left text-slate-900"><span class="tw">你好，我是你的 AI 产品助理。</span><span class="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-indigo-600 align-middle"></span></p>
        <button class="${G}" onclick="D.type(this)">重新播放</button>
      </div>`
  },
  {
    id: 'ripple',
    cat: 'state',
    zh: '水波纹',
    en: 'Ripple Effect',
    alias: ['涟漪效果', '点击波纹', '微交互'],
    plain: '点按钮的时候，从你点的那个位置荡开一圈圈水波，安卓手机上很常见',
    desc: '一种微交互（Micro-interaction）：用很小的动画确认「点到了」。',
    prompt:
      '给按钮添加 Ripple 水波纹点击效果：点击时从鼠标点击的位置扩散出一个半透明白色圆形，逐渐放大并淡出，时长 600ms，不超出按钮边界。',
    vs: '只是缩小或变色的是 Active 按下态；水波纹会体现点击的具体位置。',
    spec: [
      '哪些元素使用（按钮、列表项、卡片）',
      '波纹的颜色与时长',
      '与整体设计风格是否一致'
    ],
    demo: `<button class="relative overflow-hidden rounded-xl bg-indigo-600 px-8 py-4 text-sm text-white shadow" onclick="D.ripple(this,event)">点击按钮的不同位置</button>`
  },

  /* ---------------- 页面区块（补充） ---------------- */
  {
    id: 'announcement',
    cat: 'section',
    zh: '公告条',
    en: 'Announcement Bar',
    alias: ['顶部通栏', '活动条', 'Top Banner'],
    plain: '网页最顶上、导航栏上面那一条细细的彩色横条，写着活动或新功能，右边能点叉关掉',
    desc: '全站最显眼的位置，用来推一件事：促销、新功能、重要通知。',
    prompt:
      '在导航栏上方加一条 Announcement Bar 公告条：通栏深色背景，居中显示一句活动文案和「了解详情」链接，右侧有关闭按钮，关闭后 7 天内不再显示。',
    vs: '嵌在页面内容里、针对某个模块的提示是 Alert。',
    spec: [
      '文案与跳转链接',
      '展示的时间范围与目标用户',
      '能否关闭，关闭后多久再出现',
      '多条公告同时存在时如何处理'
    ],
    demo: `<div class="absolute inset-0 bg-white text-xs">
        <div class="ab flex items-center justify-center gap-2 bg-indigo-600 px-3 py-1.5 text-white">🎉 新功能上线：AI 生成原型 <u class="cursor-pointer">了解详情</u><button class="absolute right-3" aria-label="关闭" onclick="D.tog(this,'.ab')"><i class="fa fa-times"></i></button></div>
        <nav class="flex h-9 items-center gap-4 border-b px-3"><b class="text-indigo-600">Logo</b><span>首页</span><span>课程</span></nav>
        <p class="p-3 text-slate-400">页面内容…</p>
      </div>`
  },
  {
    id: 'cookie',
    cat: 'section',
    zh: 'Cookie 提示',
    en: 'Cookie Banner',
    alias: ['Cookie 弹窗', '隐私同意', 'Consent Banner'],
    plain: '第一次打开国外网站时，底部弹出的「我们使用 Cookie」，让你选接受还是拒绝',
    desc: '面向海外（尤其欧洲）用户的产品，按法规必须征得用户同意。',
    prompt:
      '首次访问时在页面底部显示 Cookie Banner：一段说明文字、「隐私政策」链接，以及「仅必要」和「全部接受」两个按钮，用户选择后隐藏并记住选择。',
    spec: [
      '产品是否面向需要此提示的地区（先和法务确认）',
      '提供哪些选项：全部接受、仅必要、自定义',
      '用户选择前是否可以正常使用网站',
      '用户之后在哪里修改选择'
    ],
    demo: `<div class="absolute inset-0 bg-white text-xs">
        <p class="ck2 p-3 text-slate-400">页面内容…</p>
        <div class="cb2 absolute inset-x-2 bottom-2 rounded-xl bg-slate-800 p-3 text-white shadow-xl">
          <p class="mb-2">我们使用 Cookie 来改善体验。详见<u>隐私政策</u>。</p>
          <div class="flex justify-end gap-2"><button class="rounded border border-white/40 px-2 py-1" onclick="D.tog(this,'.cb2');D.q(this,'.ck2').textContent=T('你选择了：仅必要')">仅必要</button><button class="rounded bg-white px-2 py-1 text-slate-900" onclick="D.tog(this,'.cb2');D.q(this,'.ck2').textContent=T('你选择了：全部接受')">全部接受</button></div>
        </div>
      </div>`
  },
  {
    id: 'comparetable',
    cat: 'section',
    zh: '功能对比表',
    en: 'Comparison Table',
    alias: ['套餐对比表', '对比矩阵', 'Feature Matrix'],
    plain: '一张大表格，左边一列是功能，上面一行是各个套餐，中间打对勾或打叉',
    desc: '定价表的详细版，帮用户逐项比较「多花的钱买到了什么」。',
    prompt:
      '在定价表下方加 Comparison Table 功能对比表：首列为功能名称，其余列为「免费版 / 专业版 / 团队版」，用对勾和短横线表示是否包含，推荐套餐所在列高亮。',
    vs: '只展示各套餐的价格与卖点摘要是 Pricing Table。',
    spec: [
      '对比哪些功能项，如何分组',
      '用什么表示包含、不包含、有限额',
      '是否高亮推荐套餐',
      '移动端列太多时如何呈现'
    ],
    ref: ['saaspo'],
    demo: `<table class="w-56 text-center text-xs">
        <thead><tr class="text-slate-500"><th class="py-1 text-left font-medium">功能</th><th class="font-medium">免费</th><th class="rounded-t-lg bg-indigo-50 font-medium text-indigo-600">专业</th></tr></thead>
        <tbody class="divide-y">
          <tr><td class="py-1.5 text-left">基础原型</td><td><i class="fa fa-check text-emerald-500"></i></td><td class="bg-indigo-50"><i class="fa fa-check text-emerald-500"></i></td></tr>
          <tr><td class="py-1.5 text-left">AI 生成</td><td class="text-slate-300">—</td><td class="bg-indigo-50"><i class="fa fa-check text-emerald-500"></i></td></tr>
          <tr><td class="py-1.5 text-left">团队协作</td><td class="text-slate-300">—</td><td class="bg-indigo-50"><i class="fa fa-check text-emerald-500"></i></td></tr>
          <tr><td class="py-1.5 text-left">项目数量</td><td>3 个</td><td class="bg-indigo-50">不限</td></tr>
        </tbody>
      </table>`
  },
  {
    id: 'loginform',
    cat: 'section',
    zh: '登录表单',
    en: 'Login Form',
    alias: ['登录页', '注册登录', 'Sign In'],
    plain: '输账号、输密码、点登录的那一块，下面常有「忘记密码」和「用微信登录」',
    desc: '几乎每个产品都有，细节很多：登录方式、错误提示、找回密码。',
    prompt:
      '做一个居中的 Login Form 登录表单卡片：包含邮箱和密码输入框、「记住我」复选框、「忘记密码」链接、「登录」主按钮，下方用分隔线隔出「其他方式登录」，底部是「还没有账号？去注册」。',
    spec: [
      '支持哪些登录方式（密码、验证码、第三方）',
      '账号或密码错误时的提示文案，是否限制错误次数',
      '「记住我」的有效期，登录后跳转到哪里',
      '忘记密码与注册的入口和流程'
    ],
    ref: ['seesaw'],
    demo: `<div class="w-48 rounded-xl border bg-white p-3 text-[11px] shadow-sm">
        <div class="mb-2 text-center text-sm font-semibold text-slate-900">登录</div>
        <div class="mb-1.5 rounded border px-2 py-1 text-slate-400">邮箱</div>
        <div class="mb-1.5 rounded border px-2 py-1 text-slate-400">密码</div>
        <div class="mb-2 flex justify-between text-slate-400"><span><i class="fa fa-check-square text-indigo-600"></i> 记住我</span><span class="text-indigo-600">忘记密码</span></div>
        <div class="rounded bg-indigo-600 py-1 text-center text-white">登录</div>
        <div class="mt-2 text-center text-slate-400">还没有账号？<span class="text-indigo-600">去注册</span></div>
      </div>`
  },
  {
    id: 'dashboard',
    cat: 'section',
    zh: '仪表盘',
    en: 'Dashboard',
    alias: ['数据看板', '工作台', '控制台'],
    plain: '后台打开的第一页：上面几个大数字卡片，下面是图表和列表，一眼看到整体情况',
    desc: '把最重要的指标和待办集中在一页，是后台类产品的首页。',
    prompt:
      '做一个 Dashboard 仪表盘页面：左侧为侧边栏导航，主区域顶部是 3 个数据指标卡片，下方左侧为近 7 天趋势柱状图，右侧为最新动态列表。',
    spec: [
      '这一页要回答使用者的哪几个问题',
      '展示哪些指标，各自的口径与更新频率',
      '时间范围是否可切换',
      '不同角色看到的内容是否不同'
    ],
    ref: ['seesaw'],
    demo: `<div class="absolute inset-0 flex bg-slate-100 text-[10px]">
        <aside class="w-8 space-y-2 bg-slate-800 py-2 text-center text-slate-400"><i class="fa fa-home block text-white"></i><i class="fa fa-bar-chart block"></i><i class="fa fa-cog block"></i></aside>
        <div class="flex-1 space-y-2 p-2">
          <div class="grid grid-cols-3 gap-2">
            <div class="rounded bg-white p-1.5"><div class="text-slate-400">访问</div><b class="text-sm text-slate-900">1,280</b></div>
            <div class="rounded bg-white p-1.5"><div class="text-slate-400">注册</div><b class="text-sm text-slate-900">96</b></div>
            <div class="rounded bg-white p-1.5"><div class="text-slate-400">转化</div><b class="text-sm text-emerald-600">7.5%</b></div>
          </div>
          <div class="flex h-16 items-end gap-1.5 rounded bg-white p-2">
            ${[40, 60, 45, 80, 65, 90, 70]
              .map(function (v) {
                return `<div class="flex-1 rounded-t bg-indigo-400" style="height:${v}%"></div>`
              })
              .join('')}
          </div>
          <div class="rounded bg-white p-1.5 text-slate-400">最新动态：小王提交了新需求…</div>
        </div>
      </div>`
  },
  {
    id: 'newsletter',
    cat: 'section',
    zh: '邮件订阅',
    en: 'Newsletter Signup',
    alias: ['订阅框', '留资表单', 'Email Capture'],
    plain: '一个邮箱输入框加一个「订阅」按钮，常在页面底部，留下邮箱就能收到更新',
    desc: '用最低的门槛留住暂时不想注册的访客，是常见的线索收集方式。',
    prompt:
      '在页脚上方加 Newsletter Signup 邮件订阅区块：一句标题、一行说明，邮箱输入框与「订阅」按钮横向排列，提交后校验邮箱格式并在下方显示成功或错误提示。',
    vs: '目标是让用户立即注册或购买的是 CTA；订阅是更轻的一步。',
    spec: [
      '收集哪些信息（越少越好，通常只要邮箱）',
      '提交成功、格式错误、重复订阅时的提示',
      '用户会收到什么、多久一次（写清楚更容易获得信任）',
      '如何退订，以及隐私说明'
    ],
    demo: `<div class="w-56 text-center text-xs">
        <div class="font-semibold text-slate-900">订阅产品周报</div>
        <p class="mb-2 text-slate-400">每周一封，随时可退订</p>
        <div class="flex gap-1"><input class="${I} !py-1 !text-xs" placeholder="你的邮箱" aria-label="邮箱"><button class="shrink-0 rounded-lg bg-indigo-600 px-3 text-white" onclick="D.subscribe(this)">订阅</button></div>
        <p class="nm mt-1 h-4"></p>
      </div>`
  }
)

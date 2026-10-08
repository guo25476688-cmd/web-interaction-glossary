/* ============================================================
 * 术语扩充（一）：反馈提示 / 导航与查找 / 输入控件 / 内容展示
 * 写法与 terms-basic.js 相同，vs 和 spec 直接写在术语对象里
 * ============================================================ */

/* ---------- 本文件实例用到的小工具 ---------- */
D.countdown = function (el) {
  var n = 5
  el.disabled = true
  el.textContent = n + T(' 秒后可重发')
  var timer = setInterval(function () {
    n--
    if (n <= 0) {
      clearInterval(timer)
      el.disabled = false
      el.textContent = T('重新获取验证码')
    } else {
      el.textContent = n + T(' 秒后可重发')
    }
  }, 1000)
}
D.ring = function (el) {
  var d = el.closest('[data-demo]')
  var p = ((+d.dataset.p || 25) % 100) + 25
  d.dataset.p = p
  D.q(el, '.rg').style.strokeDashoffset = 176 * (1 - p / 100)
  D.q(el, '.rv').textContent = p + '%'
}
// 选中一组按钮中的一个（分段控件、筛选等）
D.choose = function (el, on, off) {
  Array.prototype.forEach.call(el.parentElement.children, function (b) {
    on.split(' ').forEach(function (c) {
      b.classList.toggle(c, b === el)
    })
    ;(off || '').split(' ').forEach(function (c) {
      if (c) b.classList.toggle(c, b !== el)
    })
  })
}
// 按输入内容过滤列表项；内容为空时全部显示
D.flt = function (el, sel) {
  var v = el.value.trim().toLowerCase()
  D.qa(el, sel).forEach(function (li) {
    li.classList.toggle('hidden', li.textContent.toLowerCase().indexOf(v) < 0)
  })
}
D.byKind = function (el, kind) {
  D.qa(el, '[data-k]').forEach(function (li) {
    li.classList.toggle('hidden', !!kind && li.dataset.k !== kind)
  })
}
// 按 data-n 数值排序（列表排序、表格排序共用）
D.sortBy = function (el, sel, desc) {
  var rows = Array.prototype.slice.call(D.qa(el, sel))
  rows
    .sort(function (a, b) {
      return (desc ? -1 : 1) * (a.dataset.n - b.dataset.n)
    })
    .forEach(function (r) {
      r.parentElement.appendChild(r)
    })
}
D.sortTable = function (el) {
  var d = el.closest('[data-demo]')
  d.dataset.desc = d.dataset.desc ? '' : '1'
  D.sortBy(el, 'tbody tr', d.dataset.desc)
  el.querySelector('i').className =
    'fa fa-sort-' + (d.dataset.desc ? 'desc' : 'asc')
}
D.otp = function (el, e) {
  el.value = el.value.replace(/\D/g, '').slice(0, 1)
  if (el.value && el.nextElementSibling) el.nextElementSibling.focus()
  var done = Array.prototype.every.call(el.parentElement.children, function (i) {
    return i.value
  })
  D.q(el, '.om').textContent = done ? T('✓ 已填完，自动提交') : ''
}
D.num = function (el, step) {
  var input = D.q(el, '.nv')
  input.value = Math.min(10, Math.max(1, (+input.value || 1) + step))
}
D.casc = function (el, i) {
  D.choose(el, 'bg-indigo-50 text-indigo-600')
  D.qa(el, '.cc').forEach(function (c, j) {
    c.classList.toggle('hidden', j !== i)
  })
}
D.cascPick = function (el) {
  var prov = D.q(el, '.cp .text-indigo-600').textContent.trim()
  D.q(el, '.cv').value = prov + ' / ' + el.textContent.trim()
}
D.xfer = function (el, toRight) {
  var lists = D.qa(el, '.xl')
  var from = lists[toRight ? 0 : 1]
  var to = lists[toRight ? 1 : 0]
  from.querySelectorAll('input:checked').forEach(function (c) {
    c.checked = false
    to.appendChild(c.parentElement)
  })
}
D.tagIn = function (el, e) {
  var v = el.value.trim()
  if (e.key !== 'Enter' || !v) return
  var chip = document.createElement('span')
  chip.className =
    'inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700'
  chip.textContent = v
  chip.onclick = function () {
    chip.remove()
  }
  el.parentElement.insertBefore(chip, el)
  el.value = ''
}
D.mention = function (el) {
  D.q(el, '.ml').classList.toggle('hidden', el.value.slice(-1) !== '@')
}
D.mentionPick = function (li) {
  var input = D.q(li, '.mi')
  input.value += li.textContent.trim() + ' '
  D.q(li, '.ml').classList.add('hidden')
  input.focus()
}
D.inlineEdit = function (el, save) {
  var text = D.q(el, '.it')
  var input = D.q(el, '.ii')
  if (save) {
    text.firstChild.textContent = input.value.trim() || text.firstChild.textContent
  } else {
    input.value = text.firstChild.textContent.trim()
  }
  text.classList.toggle('hidden', !save)
  input.classList.toggle('hidden', !!save)
  if (!save) input.focus()
}
D.pickDay = function (el) {
  D.qa(el, '.dy').forEach(function (d) {
    d.classList.toggle('bg-indigo-600', d === el)
    d.classList.toggle('text-white', d === el)
  })
}
D.bars = function (el) {
  D.qa(el, '.br').forEach(function (b) {
    var v = 20 + Math.round(Math.random() * 80)
    b.style.height = v + '%'
    b.title = v
  })
}
D.anchor = function (el, i) {
  var box = D.q(el, '.as')
  box.scrollTo({ top: box.children[i].offsetTop - box.offsetTop, behavior: 'smooth' })
  D.choose(el, 'text-indigo-600 border-indigo-600', 'border-transparent')
}

TERMS.push(
  /* ---------------- 反馈提示（补充） ---------------- */
  {
    id: 'notification',
    cat: 'feedback',
    zh: '通知提醒框',
    en: 'Notification',
    alias: ['通知卡片', '消息通知', 'Notice'],
    plain: '角落里弹出的一张小卡片，有标题、有内容，不点关闭就一直在',
    desc: '用于内容较多、或来自系统推送的消息，比如「你有一条新评论」。',
    prompt:
      '收到新消息时在页面右上角弹出 Notification 通知提醒框：包含图标、标题、一行描述和关闭按钮，默认停留 5 秒，鼠标悬停时不自动关闭。',
    vs: '只是告诉用户操作结果用 Toast；Notification 内容更多、停留更久，常由系统主动推送。',
    spec: [
      '哪些事件会触发通知，标题与正文怎么写',
      '停留多久、是否需要手动关闭',
      '点击通知后跳转到哪里',
      '多条通知同时出现时的排列与数量上限'
    ],
    demo: `<button class="${G}" onclick="D.tog(this,'.nt')">收到一条新消息</button>
      <div class="nt absolute right-2 top-2 hidden w-48 rounded-lg border bg-white p-3 text-xs shadow-lg">
        <div class="flex items-start gap-2">
          <i class="fa fa-comment mt-0.5 text-indigo-600"></i>
          <div class="flex-1"><div class="font-semibold text-slate-900">新的评论</div><p class="text-slate-500">小王回复了你的需求文档。</p></div>
          <button onclick="D.tog(this,'.nt')" aria-label="关闭"><i class="fa fa-times text-slate-400"></i></button>
        </div>
      </div>`
  },
  {
    id: 'result',
    cat: 'feedback',
    zh: '结果页',
    en: 'Result Page',
    alias: ['成功页', '失败页', 'Result'],
    plain: '提交或支付之后跳到的那一页：一个大对勾，写着「提交成功」，下面有两个按钮',
    desc: '给重要流程一个明确的结束，并告诉用户接下来能做什么。',
    prompt:
      '支付完成后跳转到 Result 结果页：居中显示绿色对勾图标、「支付成功」标题、订单号说明，下方是「查看订单」主按钮和「返回首页」次按钮。',
    spec: [
      '成功、失败、处理中三种结果各自的文案与图标',
      '提供哪些后续操作按钮，分别跳到哪里',
      '失败时是否说明原因并提供重试'
    ],
    demo: `<div class="text-center">
        <i class="fa fa-check-circle text-4xl text-emerald-500"></i>
        <div class="mt-1 font-semibold text-slate-900">支付成功</div>
        <p class="mb-3 text-xs text-slate-400">订单号 2026 1008 0001</p>
        <div class="flex justify-center gap-2"><button class="${B}">查看订单</button><button class="${G}">返回首页</button></div>
      </div>`
  },
  {
    id: 'countdown',
    cat: 'feedback',
    zh: '倒计时',
    en: 'Countdown',
    alias: ['验证码倒计时', '计时器', 'Timer'],
    plain: '点了「获取验证码」后按钮变灰，上面的秒数一秒一秒往下减，减到零才能再点',
    desc: '限制操作频率，或营造限时感（秒杀、优惠截止）。',
    prompt:
      '「获取验证码」按钮点击后进入 Countdown 倒计时：按钮禁用并显示「60 秒后可重发」，每秒减一，归零后恢复为「重新获取验证码」。',
    spec: [
      '倒计时时长',
      '倒计时期间按钮的状态与文案',
      '刷新页面后倒计时是否继续',
      '结束后的行为（恢复可点、自动跳转、活动结束）'
    ],
    demo: `<button class="${B} disabled:bg-slate-300" onclick="D.countdown(this)">获取验证码</button>`
  },
  {
    id: 'ringprogress',
    cat: 'feedback',
    zh: '环形进度',
    en: 'Circular Progress',
    alias: ['进度环', 'Progress Ring', '圆形进度条'],
    plain: '一个圆圈慢慢被颜色填满一圈，中间写着百分比',
    desc: '比横向进度条更省空间，常用于完成度、额度、评分等指标。',
    prompt:
      '用 Circular Progress 环形进度展示「资料完成度」：灰色圆环为底，蓝色圆弧按百分比填充并带过渡动画，中心显示百分比数字。',
    vs: '空间充足、需要强调过程用横向 Progress Bar。',
    spec: [
      '表示什么指标，数值如何计算',
      '不同区间是否用不同颜色（如低于 60% 标红）',
      '达到 100% 后的表现'
    ],
    demo: `<div class="flex items-center gap-5">
        <div class="relative h-20 w-20">
          <svg viewBox="0 0 64 64" class="h-full w-full -rotate-90"><circle cx="32" cy="32" r="28" fill="none" stroke="#e2e8f0" stroke-width="6"/><circle class="rg" cx="32" cy="32" r="28" fill="none" stroke="#4f46e5" stroke-width="6" stroke-linecap="round" stroke-dasharray="176" style="stroke-dashoffset:132;transition:stroke-dashoffset .5s"/></svg>
          <span class="rv absolute inset-0 flex items-center justify-center text-sm font-semibold">25%</span>
        </div>
        <button class="${G}" onclick="D.ring(this)">继续完善</button>
      </div>`
  },

  /* ---------------- 导航与查找（补充） ---------------- */
  {
    id: 'searchbar',
    cat: 'nav',
    zh: '搜索栏',
    en: 'Search Bar',
    alias: ['搜索框', 'Search', '搜索输入框'],
    plain: '带放大镜图标的输入框，打字后右边会出现一个小叉可以一键清空',
    desc: '内容多的产品里最直接的查找入口。',
    prompt:
      '页面顶部加一个 Search Bar 搜索栏：左侧放大镜图标，占位符为「搜索课程」，输入内容后右侧出现清空按钮，下方展示「最近搜索」标签，回车触发搜索。',
    vs: '边输入边给出建议的是 Autocomplete；按固定条件缩小范围的是 Filter。',
    spec: [
      '能搜哪些内容（标题、正文、标签）',
      '触发方式：回车、点击按钮还是边输入边搜',
      '是否显示搜索历史、热门搜索',
      '无结果时的提示与引导'
    ],
    demo: `<div class="w-56 text-xs">
        <div class="relative">
          <i class="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input class="${I} !px-8" placeholder="搜索课程" oninput="D.q(this,'.sx').classList.toggle('hidden',!this.value)">
          <button class="sx absolute right-2 top-1/2 hidden -translate-y-1/2 text-slate-400" aria-label="清空" onclick="var i=this.previousElementSibling;i.value='';i.focus();this.classList.add('hidden')"><i class="fa fa-times-circle"></i></button>
        </div>
        <div class="mt-2 flex flex-wrap gap-1 text-slate-500"><span class="text-slate-400">最近搜索：</span><span class="rounded bg-slate-200 px-1.5">原型</span><span class="rounded bg-slate-200 px-1.5">PRD 模板</span></div>
      </div>`
  },
  {
    id: 'filter',
    cat: 'nav',
    zh: '筛选',
    en: 'Filter',
    alias: ['筛选器', '过滤', '筛选条件'],
    plain: '列表上面那排条件按钮，点「只看某一类」后，下面的内容就只剩那一类',
    desc: '按条件缩小列表范围，电商、后台列表页必备。',
    prompt:
      '课程列表上方加一排 Filter 筛选按钮：「全部 / 设计 / 开发」，单选，选中项高亮，点击后列表立即只显示对应分类的课程。',
    vs: '改变顺序而不减少内容的是 Sort；自由输入关键词的是 Search。',
    spec: [
      '有哪些筛选维度，各自是单选还是多选',
      '多个条件之间是「并且」还是「或者」',
      '筛选后是否显示结果数量、能否一键清空',
      '筛选条件是否保留在链接中（方便分享和刷新）'
    ],
    demo: `<div class="w-52 text-xs">
        <div class="mb-2 flex gap-1">
          <button class="rounded-full border px-3 py-1 bg-indigo-600 text-white" onclick="D.choose(this,'bg-indigo-600 text-white');D.byKind(this,'')">全部</button>
          <button class="rounded-full border px-3 py-1" onclick="D.choose(this,'bg-indigo-600 text-white');D.byKind(this,'a')">设计</button>
          <button class="rounded-full border px-3 py-1" onclick="D.choose(this,'bg-indigo-600 text-white');D.byKind(this,'b')">开发</button>
        </div>
        <ul class="divide-y rounded-lg border bg-white">
          <li data-k="a" class="px-3 py-1.5">界面设计入门</li>
          <li data-k="b" class="px-3 py-1.5">前端开发基础</li>
          <li data-k="a" class="px-3 py-1.5">交互设计方法</li>
          <li data-k="b" class="px-3 py-1.5">数据库入门</li>
        </ul>
      </div>`
  },
  {
    id: 'sort',
    cat: 'nav',
    zh: '排序',
    en: 'Sort',
    alias: ['排序方式', 'Sorting'],
    plain: '选「价格从低到高」或「最新」，列表里的东西就换个先后顺序重新排',
    desc: '不减少内容，只改变先后顺序，帮助用户先看到最关心的。',
    prompt:
      '商品列表右上角加一个 Sort 排序下拉框，选项为「价格从低到高 / 价格从高到低」，切换后列表立即重新排序。',
    vs: '缩小范围的是 Filter。',
    spec: [
      '支持哪些排序方式，默认是哪种',
      '排序与筛选同时使用时的规则',
      '数值相同时的次级排序依据'
    ],
    demo: `<div class="w-52 text-xs">
        <select class="${I} mb-2 !py-1 !text-xs" onchange="D.sortBy(this,'li',this.value==='d')"><option value="a">价格从低到高</option><option value="d">价格从高到低</option></select>
        <ul class="divide-y rounded-lg border bg-white">
          <li data-n="19" class="flex justify-between px-3 py-1.5">入门版<b>¥19</b></li>
          <li data-n="59" class="flex justify-between px-3 py-1.5">进阶版<b>¥59</b></li>
          <li data-n="129" class="flex justify-between px-3 py-1.5">专业版<b>¥129</b></li>
        </ul>
      </div>`
  },
  {
    id: 'segmented',
    cat: 'nav',
    zh: '分段控件',
    en: 'Segmented Control',
    alias: ['分段选择器', 'Segmented', '按钮组'],
    plain: '几个按钮紧紧连成一条，像一个药丸，选中的那一格有白色滑块',
    desc: '在两到五个互斥的视图或选项之间快速切换，比如「日 / 周 / 月」。',
    prompt:
      '图表右上角加一个 Segmented Control 分段控件，选项为「日 / 周 / 月」，灰色圆角底，选中项为白色带阴影的滑块，切换后图表数据随之变化。',
    vs: '切换的是大块页面内容用 Tabs；选项多于 5 个用 Select。',
    spec: [
      '有哪几个选项、默认选中哪个',
      '切换后影响页面的哪一部分',
      '选项文字过长或小屏放不下时怎么处理'
    ],
    demo: `<div class="text-center text-xs">
        <div class="inline-flex rounded-lg bg-slate-200 p-0.5">
          <button class="rounded-md px-4 py-1 bg-white shadow" onclick="D.choose(this,'bg-white shadow');D.q(this,'.sg').textContent=this.textContent">日</button>
          <button class="rounded-md px-4 py-1" onclick="D.choose(this,'bg-white shadow');D.q(this,'.sg').textContent=this.textContent">周</button>
          <button class="rounded-md px-4 py-1" onclick="D.choose(this,'bg-white shadow');D.q(this,'.sg').textContent=this.textContent">月</button>
        </div>
        <p class="mt-3 text-slate-500">当前按「<span class="sg">日</span>」查看数据</p>
      </div>`
  },
  {
    id: 'anchor',
    cat: 'nav',
    zh: '锚点导航',
    en: 'Anchor Navigation',
    alias: ['页内导航', '目录导航', 'Table of Contents'],
    plain: '长页面旁边的小目录，点一下就滚到这一页里对应的那一段，页面不跳转',
    desc: '帮用户在一个很长的页面里快速定位，帮助文档和详情页最常见。',
    prompt:
      '在长文页面右侧加 Anchor Navigation 锚点导航：列出各小节标题，点击后平滑滚动到对应小节，滚动时自动高亮当前所在小节。',
    vs: '切换时只显示其中一块内容的是 Tabs；锚点导航的内容全部在同一页上。',
    spec: [
      '目录项来源（按标题层级自动生成还是手动指定）',
      '滚动时是否自动高亮当前小节',
      '导航自身是否固定在屏幕上',
      '移动端如何呈现（折叠、隐藏）'
    ],
    demo: `<div class="absolute inset-0 flex bg-white text-xs">
        <div class="as h-full flex-1 space-y-2 overflow-y-auto p-3 text-slate-500">
          <div><b class="text-slate-900">一、背景</b>${FILLER.repeat(3)}</div>
          <div><b class="text-slate-900">二、目标</b>${FILLER.repeat(3)}</div>
          <div><b class="text-slate-900">三、方案</b>${FILLER.repeat(5)}</div>
        </div>
        <nav class="w-16 shrink-0 border-l py-3">
          <button class="block w-full border-l-2 border-indigo-600 px-2 py-1 text-left text-indigo-600" onclick="D.anchor(this,0)">背景</button>
          <button class="block w-full border-l-2 border-transparent px-2 py-1 text-left" onclick="D.anchor(this,1)">目标</button>
          <button class="block w-full border-l-2 border-transparent px-2 py-1 text-left" onclick="D.anchor(this,2)">方案</button>
        </nav>
      </div>`
  },
  {
    id: 'command',
    cat: 'nav',
    zh: '命令面板',
    en: 'Command Palette',
    alias: ['快捷命令', '⌘K', '全局搜索面板'],
    plain: '按一个快捷键，屏幕中间弹出一个搜索框，打几个字就能直接跳到某个功能',
    desc: '给熟练用户的效率入口，功能很多的工具类产品常用。',
    prompt:
      '实现 Command Palette 命令面板：按 Ctrl/Cmd + K 在页面中央弹出带搜索框的面板，输入关键词实时过滤命令列表，支持上下键选择、回车执行、Esc 关闭。',
    vs: '只搜内容的是 Search Bar；命令面板搜的是「功能和操作」。',
    spec: [
      '唤起方式（快捷键、入口按钮）',
      '可以搜到什么：页面、操作、最近使用',
      '结果如何分组与排序',
      '键盘操作：上下选择、回车执行、Esc 关闭'
    ],
    demo: `<div class="w-56 overflow-hidden rounded-xl border bg-white text-xs shadow-lg">
        <div class="flex items-center gap-2 border-b px-3 py-2"><i class="fa fa-search text-slate-400"></i><input class="flex-1 outline-none" placeholder="输入命令，试试「新建」" oninput="D.flt(this,'li')"><kbd class="rounded bg-slate-100 px-1 text-[10px] text-slate-400">Esc</kbd></div>
        <ul class="py-1">
          <li class="cursor-pointer px-3 py-1.5 hover:bg-indigo-50"><i class="fa fa-plus w-4 text-slate-400"></i> 新建文档</li>
          <li class="cursor-pointer px-3 py-1.5 hover:bg-indigo-50"><i class="fa fa-folder-o w-4 text-slate-400"></i> 新建文件夹</li>
          <li class="cursor-pointer px-3 py-1.5 hover:bg-indigo-50"><i class="fa fa-cog w-4 text-slate-400"></i> 打开设置</li>
          <li class="cursor-pointer px-3 py-1.5 hover:bg-indigo-50"><i class="fa fa-moon-o w-4 text-slate-400"></i> 切换深色模式</li>
        </ul>
      </div>`
  },
  {
    id: 'megamenu',
    cat: 'nav',
    zh: '大型下拉菜单',
    en: 'Mega Menu',
    alias: ['超级菜单', '多列下拉菜单'],
    plain: '鼠标移到导航上，下面展开一大片分了好几列的菜单，电商网站的「全部分类」就是',
    desc: '入口非常多时，一次把所有分类铺开给用户看。',
    prompt:
      '导航栏的「产品」项使用 Mega Menu 大型下拉菜单：鼠标悬停时在下方展开通栏面板，分三列展示分类标题和链接，移出后收起。',
    vs: '只有几项的用普通 Dropdown Menu。',
    spec: [
      '分几列、每列的标题与包含的入口',
      '展开方式：悬停还是点击',
      '是否配图、是否有推荐位',
      '移动端如何呈现（通常改为逐级展开）'
    ],
    demo: `<div class="absolute inset-0 bg-white text-xs">
        <nav class="flex h-10 items-center gap-4 border-b px-3">
          <b class="text-indigo-600">Logo</b>
          <div class="group flex h-full items-center">
            <span class="cursor-pointer group-hover:text-indigo-600">产品 <i class="fa fa-angle-down"></i></span>
            <div class="invisible absolute inset-x-0 top-10 grid grid-cols-3 gap-2 border-b bg-white p-3 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
              <div><div class="mb-1 font-semibold text-slate-900">设计</div><p class="text-slate-500">原型<br>白板</p></div>
              <div><div class="mb-1 font-semibold text-slate-900">开发</div><p class="text-slate-500">代码托管<br>自动部署</p></div>
              <div><div class="mb-1 font-semibold text-slate-900">协作</div><p class="text-slate-500">文档<br>看板</p></div>
            </div>
          </div>
          <span>定价</span>
        </nav>
        <p class="p-3 text-slate-400">把鼠标移到「产品」上。</p>
      </div>`
  },

  /* ---------------- 输入控件（补充） ---------------- */
  {
    id: 'input',
    cat: 'input',
    zh: '输入框',
    en: 'Input',
    alias: ['文本框', 'Text Field', '单行输入'],
    plain: '最普通的那种能打一行字的框，上面有标题，下面常有一行小字说明',
    desc: '表单里最基础的控件，由标题、输入区、辅助说明三部分组成。',
    prompt:
      '做一个标准 Input 输入框：上方是标题「昵称」和红色必填星号，输入框带占位符，下方是灰色辅助说明「2–12 个字」，聚焦时边框变蓝。',
    vs: '需要输入多行文字用 Textarea。',
    spec: [
      '字段名称，是否必填',
      '字数或格式限制',
      '默认值、占位符与辅助说明文案',
      '是否可清空、是否禁用或只读'
    ],
    demo: `<label class="block w-52 text-xs">
        <span class="mb-1 block font-medium text-slate-900">昵称 <span class="text-rose-500">*</span></span>
        <input class="${I}" placeholder="请输入昵称">
        <span class="mt-1 block text-slate-400">2–12 个字，可使用中英文</span>
      </label>`
  },
  {
    id: 'textarea',
    cat: 'input',
    zh: '多行文本框',
    en: 'Textarea',
    alias: ['文本域', '多行输入', '字数统计'],
    plain: '能打好几行字的大输入框，右下角常显示「已输入多少 / 最多多少」',
    desc: '用于留言、备注、描述这类较长的文字输入。',
    prompt:
      '「问题描述」使用 Textarea 多行文本框：默认 3 行高，最多 50 字，右下角实时显示「已输入字数 / 50」，超出时数字变红。',
    spec: [
      '最少、最多字数',
      '高度是否随内容自动增长',
      '是否显示字数统计，超出后禁止输入还是仅提示',
      '是否允许换行、表情等特殊字符'
    ],
    demo: `<div class="w-52 text-xs">
        <textarea rows="3" maxlength="50" class="${I} resize-none" placeholder="请描述你遇到的问题" oninput="D.q(this,'.tc').textContent=this.value.length"></textarea>
        <div class="text-right text-slate-400"><span class="tc">0</span> / 50</div>
      </div>`
  },
  {
    id: 'password',
    cat: 'input',
    zh: '密码显隐',
    en: 'Password Toggle',
    alias: ['显示密码', '密码框', '小眼睛'],
    plain: '密码框右边那个小眼睛图标，点一下能看到自己输的密码，再点又变回圆点',
    desc: '让用户能核对自己输入的密码，减少输错。',
    prompt:
      '密码输入框右侧加 Password Toggle 密码显隐按钮：默认以圆点隐藏密码，点击眼睛图标后显示明文，图标同步切换为「闭眼」。',
    spec: [
      '默认隐藏还是显示',
      '密码规则（长度、字符类型）及其提示方式',
      '是否显示密码强度',
      '是否需要「确认密码」再输一次'
    ],
    demo: `<div class="relative w-48">
        <input type="password" value="abc12345" class="${I} pr-9" aria-label="密码">
        <button class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="显示或隐藏密码" onclick="var i=this.previousElementSibling,s=i.type==='password';i.type=s?'text':'password';this.firstChild.className='fa fa-eye'+(s?'-slash':'')"><i class="fa fa-eye"></i></button>
      </div>`
  },
  {
    id: 'otp',
    cat: 'input',
    zh: '验证码输入',
    en: 'OTP Input',
    alias: ['短信验证码', '格子输入框', 'PIN Input'],
    plain: '一排四到六个小格子，每格填一个数字，填完一格光标自动跳到下一格',
    desc: '输入短信或邮箱验证码时使用，格子数就是验证码位数。',
    prompt:
      '做一个 4 位的 OTP Input 验证码输入：四个独立的方格，每格只能输入一位数字，输入后自动聚焦下一格，全部填完自动提交，支持粘贴整串验证码。',
    spec: [
      '验证码位数，纯数字还是含字母',
      '填完后自动提交还是需要点按钮',
      '是否支持粘贴、是否自动读取短信',
      '输错后的提示，以及错误次数上限'
    ],
    demo: `<div class="text-center">
        <div class="flex gap-2">
          ${[0, 1, 2, 3]
            .map(function () {
              return `<input inputmode="numeric" maxlength="1" class="h-10 w-10 rounded-lg border border-slate-300 bg-white text-center text-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" aria-label="验证码" oninput="D.otp(this)">`
            })
            .join('')}
        </div>
        <p class="om mt-2 h-4 text-xs text-emerald-600"></p>
      </div>`
  },
  {
    id: 'numstepper',
    cat: 'input',
    zh: '数字步进器',
    en: 'Number Stepper',
    alias: ['计数器', '数量加减', 'Input Number'],
    plain: '购物车里改数量的那个：左边减号、中间数字、右边加号',
    desc: '在小范围内微调一个数量，比直接打数字更不容易出错。',
    prompt:
      '商品数量使用 Number Stepper 数字步进器：减号、数字、加号横向排列，每次加减 1，范围 1–10，到达上下限时对应按钮置灰。',
    vs: '范围大、不要求精确用 Slider。',
    spec: [
      '最小值、最大值与每次增减的步长',
      '是否允许直接输入数字',
      '到达上下限时的表现与提示（如库存不足）',
      '减到最小值时再减：禁用还是询问是否删除'
    ],
    demo: `<div class="flex items-center">
        <button class="h-8 w-8 rounded-l-lg border border-slate-300 bg-white" aria-label="减少" onclick="D.num(this,-1)">−</button>
        <input class="nv h-8 w-12 border-y border-slate-300 bg-white text-center text-sm outline-none" value="1" aria-label="数量" readonly>
        <button class="h-8 w-8 rounded-r-lg border border-slate-300 bg-white" aria-label="增加" onclick="D.num(this,1)">+</button>
        <span class="ml-3 text-xs text-slate-400">范围 1–10</span>
      </div>`
  },
  {
    id: 'cascader',
    cat: 'input',
    zh: '级联选择',
    en: 'Cascader',
    alias: ['联动选择', '多级选择', '省市区选择'],
    plain: '选完省份，右边才出现这个省的城市让你接着选，一级带出下一级',
    desc: '用于有层级关系的选项：地区、商品类目、组织架构。',
    prompt:
      '「所在地区」使用 Cascader 级联选择：点击后展开两列面板，左列选择省份后右列显示对应城市，选完后输入框显示「省 / 市」。',
    vs: '选项没有层级关系用普通 Select。',
    spec: [
      '共几级，每级的数据来源',
      '是否必须选到最后一级',
      '是否支持搜索',
      '回显格式（如「广东 / 深圳」）'
    ],
    demo: `<div class="w-52 text-xs">
        <input class="cv ${I} mb-2 !text-xs" placeholder="请选择省 / 市" readonly>
        <div class="flex h-24 overflow-hidden rounded-lg border bg-white">
          <ul class="cp w-1/2 border-r">
            <li class="cursor-pointer px-3 py-1.5 bg-indigo-50 text-indigo-600" onclick="D.casc(this,0)">广东</li>
            <li class="cursor-pointer px-3 py-1.5" onclick="D.casc(this,1)">浙江</li>
            <li class="cursor-pointer px-3 py-1.5" onclick="D.casc(this,2)">四川</li>
          </ul>
          <div class="w-1/2">
            ${[
              ['广州', '深圳', '珠海'],
              ['杭州', '宁波'],
              ['成都', '绵阳']
            ]
              .map(function (cities, i) {
                return `<ul class="cc ${i ? 'hidden' : ''}">${cities
                  .map(function (c) {
                    return `<li class="cursor-pointer px-3 py-1.5 hover:bg-indigo-50" onclick="D.cascPick(this)">${c}</li>`
                  })
                  .join('')}</ul>`
              })
              .join('')}
          </div>
        </div>
      </div>`
  },
  {
    id: 'transfer',
    cat: 'input',
    zh: '穿梭框',
    en: 'Transfer',
    alias: ['双栏选择', '左右穿梭', 'Dual List'],
    plain: '左右两个列表，勾选左边的项目点箭头就挪到右边，后台分配权限时常见',
    desc: '从大量候选项里挑出一批，同时能清楚看到「已选」和「未选」。',
    prompt:
      '「分配成员」使用 Transfer 穿梭框：左侧为「可选成员」，右侧为「已选成员」，勾选后点击中间的箭头按钮在两栏之间移动。',
    vs: '候选项不多时用一组 Checkbox 更简单。',
    spec: [
      '左右两栏各自的标题与数据来源',
      '是否支持搜索、全选',
      '已选数量是否有上限',
      '已选项是否可排序'
    ],
    demo: `<div class="flex items-center gap-2 text-xs">
        <ul class="xl h-28 w-24 space-y-1 overflow-y-auto rounded-lg border bg-white p-2">
          <li class="text-slate-400">可选</li>
          <label class="flex items-center gap-1"><input type="checkbox" class="accent-indigo-600">小王</label>
          <label class="flex items-center gap-1"><input type="checkbox" class="accent-indigo-600">小李</label>
          <label class="flex items-center gap-1"><input type="checkbox" class="accent-indigo-600">小张</label>
        </ul>
        <div class="space-y-1">
          <button class="${P}" aria-label="移到右边" onclick="D.xfer(this,true)">›</button><br>
          <button class="${P}" aria-label="移到左边" onclick="D.xfer(this,false)">‹</button>
        </div>
        <ul class="xl h-28 w-24 space-y-1 overflow-y-auto rounded-lg border bg-white p-2">
          <li class="text-slate-400">已选</li>
          <label class="flex items-center gap-1"><input type="checkbox" class="accent-indigo-600">小陈</label>
        </ul>
      </div>`
  },
  {
    id: 'colorpicker',
    cat: 'input',
    zh: '颜色选择器',
    en: 'Color Picker',
    alias: ['取色器', '调色板', '色板'],
    plain: '点一下色块弹出调色盘选颜色，或者直接从一排预设好的颜色里点一个',
    desc: '让用户自定义颜色：主题色、标签色、画笔色。',
    prompt:
      '「主题色」使用 Color Picker 颜色选择器：提供 5 个预设色块可直接点选，另有一个自定义色块点击后打开调色盘，右侧实时显示当前色值。',
    spec: [
      '是否提供预设颜色，有哪些',
      '是否允许自定义任意颜色',
      '是否支持透明度',
      '色值的显示与输入格式（如 #4F46E5）'
    ],
    demo: `<div class="text-center text-xs">
        <div class="mb-3 flex items-center gap-2">
          ${['#4f46e5', '#10b981', '#f59e0b', '#f43f5e', '#0ea5e9']
            .map(function (c) {
              return `<button class="h-7 w-7 rounded-full ring-2 ring-white" style="background:${c}" aria-label="${c}" onclick="D.q(this,'.cb').style.background='${c}';D.q(this,'.cx').textContent='${c}'"></button>`
            })
            .join('')}
          <input type="color" value="#4f46e5" class="h-8 w-8 cursor-pointer" aria-label="自定义颜色" oninput="D.q(this,'.cb').style.background=this.value;D.q(this,'.cx').textContent=this.value">
        </div>
        <div class="cb mx-auto flex h-10 w-40 items-center justify-center rounded-lg font-mono text-white" style="background:#4f46e5"><span class="cx">#4f46e5</span></div>
      </div>`
  },
  {
    id: 'taginput',
    cat: 'input',
    zh: '标签输入',
    en: 'Tag Input',
    alias: ['多值输入', 'Token Input', '标签输入框'],
    plain: '在输入框里打一个词按回车，它就变成一个小胶囊，可以接着打下一个',
    desc: '在一个输入框里填多个值：收件人、关键词、技能标签。',
    prompt:
      '「关键词」使用 Tag Input 标签输入：输入文字后按回车生成一个标签，标签带删除按钮，可连续添加多个，重复的标签不允许添加。',
    vs: '只能从固定选项里挑时用多选 Select。',
    spec: [
      '如何生成标签：回车、逗号还是空格',
      '数量上限与单个标签的长度限制',
      '是否允许重复、是否提供候选建议',
      '如何删除（点叉、退格键）'
    ],
    demo: `<div class="w-56 text-xs">
        <div class="flex flex-wrap items-center gap-1 rounded-lg border border-slate-300 bg-white p-2">
          <span class="inline-flex cursor-pointer items-center rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-700" onclick="this.remove()">原型</span>
          <input class="min-w-[80px] flex-1 outline-none" placeholder="输入后按回车" onkeydown="D.tagIn(this,event)">
        </div>
        <p class="mt-1 text-slate-400">点击标签可删除</p>
      </div>`
  },
  {
    id: 'mention',
    cat: 'input',
    zh: '@ 提及',
    en: 'Mention',
    alias: ['@某人', '艾特', '@ 功能'],
    plain: '在输入框里打一个 @，就弹出一串人名让你选，选中后对方会收到提醒',
    desc: '在评论、聊天、文档里点名某个人或引用某个对象。',
    prompt:
      '评论输入框支持 Mention @ 提及：输入 @ 时在光标下方弹出成员列表，继续输入可过滤，选中后插入「@姓名」并高亮，提交后被提及的人收到通知。',
    spec: [
      '可以 @ 的范围（全员、项目成员、好友）',
      '候选列表的排序与搜索规则',
      '被提及的人如何收到通知',
      '是否支持 @所有人，谁有权限使用'
    ],
    demo: `<div class="relative mt-4 w-52 self-start text-xs">
        <input class="mi ${I}" placeholder="输入 @ 试试" oninput="D.mention(this)">
        <ul class="ml absolute inset-x-0 top-full mt-1 hidden rounded-lg border bg-white py-1 shadow-lg">
          <li class="cursor-pointer px-3 py-1.5 hover:bg-indigo-50" onclick="D.mentionPick(this)">小王</li>
          <li class="cursor-pointer px-3 py-1.5 hover:bg-indigo-50" onclick="D.mentionPick(this)">小李</li>
          <li class="cursor-pointer px-3 py-1.5 hover:bg-indigo-50" onclick="D.mentionPick(this)">设计组</li>
        </ul>
      </div>`
  },
  {
    id: 'inlineedit',
    cat: 'input',
    zh: '行内编辑',
    en: 'Inline Edit',
    alias: ['就地编辑', '点击编辑', 'Click to Edit'],
    plain: '看着是普通文字，点一下它就原地变成输入框可以直接改，改完点别处就保存',
    desc: '省去「进入编辑页再保存」的步骤，适合改标题、改单个字段。',
    prompt:
      '文档标题支持 Inline Edit 行内编辑：默认显示为文字并带铅笔图标，点击后原地变为输入框并选中内容，按回车或失去焦点时保存，按 Esc 取消。',
    vs: '要同时改很多字段时，用完整的编辑表单更清楚。',
    spec: [
      '哪些字段可以行内编辑，如何提示「这里能改」',
      '保存方式：失去焦点、回车还是点确认',
      '如何取消修改',
      '保存失败时的提示与回滚'
    ],
    demo: `<div class="text-sm">
        <span class="it cursor-pointer rounded px-2 py-1 font-medium text-slate-900 hover:bg-slate-200" onclick="D.inlineEdit(this,false)">未命名的需求文档<i class="fa fa-pencil ml-2 text-xs text-slate-400"></i></span>
        <input class="ii ${I} hidden !w-48" aria-label="标题" onblur="D.inlineEdit(this,true)" onkeydown="if(event.key==='Enter')this.blur()">
        <p class="mt-2 text-center text-xs text-slate-400">点击标题直接修改</p>
      </div>`
  },
  {
    id: 'richtext',
    cat: 'input',
    zh: '富文本编辑器',
    en: 'Rich Text Editor',
    alias: ['编辑器', 'WYSIWYG', '所见即所得'],
    plain: '输入框上面有一排「加粗、斜体、列表」按钮，像一个迷你版的 Word',
    desc: '让用户写带格式的内容：文章、公告、商品详情。',
    prompt:
      '「公告内容」使用 Rich Text Editor 富文本编辑器：顶部工具栏提供加粗、斜体、下划线、无序列表，选中文字后点击按钮应用格式，所见即所得。',
    vs: '只需要纯文字时用 Textarea，成本低得多。',
    spec: [
      '需要哪些格式：标题、加粗、列表、链接、图片、表格',
      '图片与附件的大小、数量限制',
      '从外部粘贴内容时是否保留原格式',
      '内容在前台展示时的样式是否与编辑时一致'
    ],
    demo: `<div class="w-56 overflow-hidden rounded-lg border bg-white text-xs">
        <div class="flex gap-1 border-b bg-slate-50 p-1">
          <button class="h-6 w-6 rounded hover:bg-slate-200" aria-label="加粗" onmousedown="event.preventDefault();document.execCommand('bold')"><i class="fa fa-bold"></i></button>
          <button class="h-6 w-6 rounded hover:bg-slate-200" aria-label="斜体" onmousedown="event.preventDefault();document.execCommand('italic')"><i class="fa fa-italic"></i></button>
          <button class="h-6 w-6 rounded hover:bg-slate-200" aria-label="下划线" onmousedown="event.preventDefault();document.execCommand('underline')"><i class="fa fa-underline"></i></button>
        </div>
        <div contenteditable="true" class="h-20 overflow-y-auto p-2 outline-none" aria-label="编辑区">选中这段文字，再点上面的按钮试试。</div>
      </div>`
  },

  /* ---------------- 内容展示（补充） ---------------- */
  {
    id: 'table',
    cat: 'display',
    zh: '表格',
    en: 'Table',
    alias: ['数据表格', 'Data Table', 'Data Grid'],
    plain: '一行一行、一列一列的数据，点表头上的小箭头可以按这一列排序',
    desc: '后台产品的核心：展示、对比和操作大量结构化数据。',
    prompt:
      '用 Table 表格展示订单列表：列为「订单 / 金额 / 状态」，表头固定，点击「金额」表头可切换升序降序，鼠标悬停行高亮，状态用彩色标签显示。',
    vs: '每条内容差异大、偏浏览时用 Card 或 List。',
    spec: [
      '有哪些列，各列的顺序、宽度与对齐方式',
      '哪些列可排序、可筛选',
      '每行有哪些操作，是否支持批量操作',
      '内容过长、数据为空、列太多时如何处理（省略、固定列、横向滚动）'
    ],
    demo: `<table class="w-56 overflow-hidden rounded-lg bg-white text-left text-xs">
        <thead class="bg-slate-100 text-slate-500"><tr><th class="px-3 py-1.5 font-medium">订单</th><th class="cursor-pointer px-3 py-1.5 font-medium text-indigo-600" onclick="D.sortTable(this)">金额 <i class="fa fa-sort"></i></th><th class="px-3 py-1.5 font-medium">状态</th></tr></thead>
        <tbody class="divide-y">
          <tr data-n="129" class="hover:bg-indigo-50"><td class="px-3 py-1.5">A-001</td><td class="px-3 py-1.5">¥129</td><td class="px-3 py-1.5 text-emerald-600">已完成</td></tr>
          <tr data-n="39" class="hover:bg-indigo-50"><td class="px-3 py-1.5">A-002</td><td class="px-3 py-1.5">¥39</td><td class="px-3 py-1.5 text-amber-600">待支付</td></tr>
          <tr data-n="88" class="hover:bg-indigo-50"><td class="px-3 py-1.5">A-003</td><td class="px-3 py-1.5">¥88</td><td class="px-3 py-1.5 text-emerald-600">已完成</td></tr>
        </tbody>
      </table>`
  },
  {
    id: 'list',
    cat: 'display',
    zh: '列表',
    en: 'List',
    alias: ['列表项', 'List Item', '条目列表'],
    plain: '一条一条从上往下排的内容，每条左边是头像或图标，中间是标题和小字，右边有个箭头',
    desc: '移动端最常见的内容组织方式：消息、设置、联系人。',
    prompt:
      '用 List 列表展示消息：每个列表项左侧为头像，中间是加粗的标题和一行灰色摘要（超出省略），右侧是时间，项与项之间用细线分隔，点击整行进入详情。',
    vs: '需要多列对比数据用 Table；每条内容图文丰富用 Card。',
    spec: [
      '每个列表项包含哪些信息，哪些必须显示',
      '点击整行还是点击某个部分',
      '是否有左滑、长按等附加操作',
      '排序规则与加载方式（分页、无限滚动）'
    ],
    demo: `<ul class="w-56 divide-y rounded-lg border bg-white text-xs">
        ${[
          ['王', 'bg-indigo-500', '小王', '需求文档我看完了，有两个问题…', '09:30'],
          ['李', 'bg-emerald-500', '小李', '设计稿已更新，请查收', '昨天'],
          ['张', 'bg-amber-500', '小张', '好的，周五前给到', '周一']
        ]
          .map(function (m) {
            return `<li class="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-slate-50"><span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${m[1]} text-white">${m[0]}</span><div class="min-w-0 flex-1"><div class="font-medium text-slate-900">${m[2]}</div><div class="truncate text-slate-400">${m[3]}</div></div><span class="text-[10px] text-slate-400">${m[4]}</span></li>`
          })
          .join('')}
      </ul>`
  },
  {
    id: 'timeline',
    cat: 'display',
    zh: '时间轴',
    en: 'Timeline',
    alias: ['时间线', '动态流', '物流轨迹'],
    plain: '一条竖线上串着几个圆点，每个点旁边写着时间和发生了什么，像快递的物流信息',
    desc: '按时间顺序展示一系列事件：物流、审批记录、操作日志。',
    prompt:
      '用 Timeline 时间轴展示订单进度：竖向排列，每个节点为圆点加标题和时间，最新的节点在最上方并高亮为蓝色，其余为灰色。',
    vs: '表示「流程进行到第几步」用 Stepper；Timeline 记录的是已经发生的事。',
    spec: [
      '每个节点展示哪些信息（时间、事件、操作人）',
      '排序：最新的在上还是在下',
      '节点很多时是否折叠',
      '不同类型的事件是否用不同颜色或图标'
    ],
    demo: `<ol class="relative ml-2 space-y-3 border-l-2 border-slate-200 pl-4 text-xs">
        <li class="relative"><span class="absolute -left-[22px] top-0.5 h-3 w-3 rounded-full bg-indigo-600 ring-4 ring-indigo-100"></span><div class="font-medium text-slate-900">派送中</div><div class="text-slate-400">今天 09:20</div></li>
        <li class="relative"><span class="absolute -left-[22px] top-0.5 h-3 w-3 rounded-full bg-slate-300"></span><div>已到达本市</div><div class="text-slate-400">昨天 21:05</div></li>
        <li class="relative"><span class="absolute -left-[22px] top-0.5 h-3 w-3 rounded-full bg-slate-300"></span><div>已发货</div><div class="text-slate-400">10-06 14:30</div></li>
      </ol>`
  },
  {
    id: 'tree',
    cat: 'display',
    zh: '树形控件',
    en: 'Tree',
    alias: ['树形结构', '目录树', 'Tree View'],
    plain: '像电脑里的文件夹那样一层套一层，点小三角展开看里面还有什么',
    desc: '展示有上下级关系的内容：文件目录、组织架构、分类。',
    prompt:
      '用 Tree 树形控件展示文档目录：文件夹前有展开箭头，点击展开或收起子级，子级向右缩进，文件夹和文件使用不同图标。',
    spec: [
      '最多几层，数据来源',
      '默认展开到第几层',
      '是否可勾选、可拖拽调整层级',
      '节点上有哪些操作（新建、重命名、删除）'
    ],
    demo: `<div class="w-48 rounded-lg border bg-white p-3 text-xs">
        <details open><summary class="cursor-pointer list-none"><i class="fa fa-folder text-amber-400"></i> 产品文档</summary>
          <div class="ml-4 mt-1 space-y-1">
            <details><summary class="cursor-pointer list-none"><i class="fa fa-folder text-amber-400"></i> 需求</summary>
              <div class="ml-4 mt-1 space-y-1"><div><i class="fa fa-file-text-o text-slate-400"></i> 登录页 PRD</div><div><i class="fa fa-file-text-o text-slate-400"></i> 支付流程</div></div>
            </details>
            <div><i class="fa fa-file-text-o text-slate-400"></i> 竞品分析</div>
          </div>
        </details>
        <p class="mt-2 text-slate-400">点击文件夹展开或收起</p>
      </div>`
  },
  {
    id: 'kanban',
    cat: 'display',
    zh: '看板',
    en: 'Kanban',
    alias: ['看板视图', '任务看板', 'Board'],
    plain: '几列并排，每列是一个阶段（待办、进行中、已完成），里面的小卡片可以拖到别的列',
    desc: '把任务按状态分栏，一眼看清整体进度，项目管理工具的标志性视图。',
    prompt:
      '做一个 Kanban 看板：三列「待办 / 进行中 / 已完成」，每列内是任务卡片，卡片可以在列与列之间拖拽，拖入后归属到该列。',
    vs: '需要看很多字段、做批量操作时用 Table 视图。',
    spec: [
      '有哪几列（状态），列能否自定义',
      '卡片上显示哪些信息',
      '拖拽后是否立即改变状态，是否有流转限制',
      '某一列卡片很多时如何处理'
    ],
    demo: `<div class="grid w-full grid-cols-3 gap-2 px-3 text-xs">
        ${[
          ['待办', ['写 PRD', '画原型']],
          ['进行中', ['评审']],
          ['已完成', []]
        ]
          .map(function (col) {
            return `<div class="min-h-[120px] rounded-lg bg-slate-200 p-1.5" ondragover="event.preventDefault()" ondrop="if(D.drag)this.appendChild(D.drag)"><div class="mb-1 px-1 text-slate-500">${col[0]}</div>${col[1]
              .map(function (c) {
                return `<div draggable="true" class="mb-1 cursor-grab rounded bg-white px-2 py-1.5 shadow-sm" ondragstart="D.drag=this" ondragend="D.drag=null">${c}</div>`
              })
              .join('')}</div>`
          })
          .join('')}
      </div>`
  },
  {
    id: 'masonry',
    cat: 'display',
    zh: '瀑布流',
    en: 'Masonry',
    alias: ['瀑布流布局', 'Waterfall', '错落布局'],
    plain: '几列图片高高低低错落着往下排，每张图高度不一样，小红书和 Pinterest 就是这样',
    desc: '适合高度不一致的图片类内容，能把空间填满、显得内容丰富。',
    prompt:
      '图片列表使用 Masonry 瀑布流布局：桌面端 4 列、移动端 2 列，每张卡片宽度相同、高度随图片自适应，卡片间距 12px，滚动到底自动加载更多。',
    vs: '内容高度一致、需要整齐对比时用普通网格（Grid）。',
    spec: [
      '不同屏幕宽度下各显示几列',
      '卡片内除了图片还有什么（标题、作者、点赞数）',
      '图片加载前如何占位，避免页面跳动',
      '加载更多的方式'
    ],
    demo: `<div class="absolute inset-0 columns-3 gap-2 overflow-y-auto p-3">
        ${[
          ['h-16', 'bg-indigo-300'],
          ['h-24', 'bg-emerald-300'],
          ['h-12', 'bg-amber-300'],
          ['h-20', 'bg-rose-300'],
          ['h-14', 'bg-sky-300'],
          ['h-24', 'bg-fuchsia-300'],
          ['h-16', 'bg-teal-300'],
          ['h-12', 'bg-orange-300']
        ]
          .map(function (b) {
            return `<div class="mb-2 break-inside-avoid rounded-lg ${b[0]} ${b[1]}"></div>`
          })
          .join('')}
      </div>`
  },
  {
    id: 'calendar',
    cat: 'display',
    zh: '日历',
    en: 'Calendar',
    alias: ['日历视图', '月历', '日程表'],
    plain: '一个月的日期排成七列的格子，有安排的那天下面有个小点',
    desc: '按日期查看和安排事项：日程、排班、打卡。',
    prompt:
      '做一个 Calendar 月历视图：顶部显示年月和左右切换按钮，日期按周一到周日排成 7 列，今天高亮，有日程的日期下方显示小圆点，点击日期选中。',
    vs: '只是为了选一个日期填进表单用 Date Picker。',
    spec: [
      '支持哪些视图（月、周、日）',
      '日期格子里显示什么（事件、数量、状态）',
      '点击日期或事件后的行为',
      '一周从周一还是周日开始；节假日是否标注'
    ],
    demo: `<div class="w-52 rounded-lg border bg-white p-2 text-center text-xs">
        <div class="mb-1 flex items-center justify-between px-1 font-medium text-slate-900"><i class="fa fa-angle-left text-slate-400"></i>2026 年 10 月<i class="fa fa-angle-right text-slate-400"></i></div>
        <div class="grid grid-cols-7 gap-y-0.5">
          ${['一', '二', '三', '四', '五', '六', '日']
            .map(function (w) {
              return `<span class="text-slate-400">${w}</span>`
            })
            .join('')}
          <span></span><span></span><span></span>
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
            .map(function (d) {
              return `<button class="dy relative mx-auto h-6 w-6 rounded-full ${d === 8 ? 'bg-indigo-600 text-white' : ''}" onclick="D.pickDay(this)">${d}${d === 12 || d === 15 ? '<i class="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-rose-500"></i>' : ''}</button>`
            })
            .join('')}
        </div>
      </div>`
  },
  {
    id: 'chart',
    cat: 'display',
    zh: '图表',
    en: 'Chart',
    alias: ['数据可视化', '柱状图', '折线图'],
    plain: '用柱子、折线或饼图把一堆数字画出来，鼠标移上去能看到具体数值',
    desc: '让趋势和对比一眼可见。常见类型：柱状图比大小、折线图看趋势、饼图看占比。',
    prompt:
      '用柱状图（Bar Chart）展示最近 7 天的访问量：横轴为日期，纵轴为数量，柱子为蓝色，鼠标悬停时高亮并显示具体数值，数据变化时柱子高度带过渡动画。',
    spec: [
      '要回答什么问题，据此选图表类型（比大小、看趋势、看占比）',
      '横轴、纵轴分别是什么，单位与时间范围',
      '悬停时显示哪些信息，是否可点击下钻',
      '无数据、数据加载中时的表现'
    ],
    demo: `<div class="w-56 text-xs">
        <div class="flex h-24 items-end gap-2 border-b border-l border-slate-300 px-2">
          ${[40, 65, 50, 80, 60, 95, 70]
            .map(function (v) {
              return `<div class="br flex-1 rounded-t bg-indigo-400 transition-all duration-500 hover:bg-indigo-600" style="height:${v}%" title="${v}"></div>`
            })
            .join('')}
        </div>
        <div class="mt-2 flex items-center justify-between"><span class="text-slate-400">悬停柱子看数值</span><button class="${G} !py-0.5 !text-xs" onclick="D.bars(this)">换一组数据</button></div>
      </div>`
  },
  {
    id: 'compare',
    cat: 'display',
    zh: '对比滑块',
    en: 'Before / After Slider',
    alias: ['前后对比', '图片对比', 'Comparison Slider'],
    plain: '一张图中间有条竖线，左右拖动它，一边露出修改前、一边露出修改后',
    desc: '直观展示「前后差别」：修图、装修、AI 生成效果。',
    prompt:
      '做一个 Before / After 对比滑块：两张图片叠放，中间有可拖动的分隔线，向左右拖动时分别露出「处理前」和「处理后」的画面，两侧有文字标注。',
    spec: [
      '对比的两份内容分别是什么',
      '分隔线的初始位置',
      '移动端的操作方式（拖动、点击）',
      '是否需要「处理前 / 处理后」文字标注'
    ],
    demo: `<div class="w-56 text-xs">
        <div class="relative h-24 overflow-hidden rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500">
          <span class="absolute right-2 top-2 rounded bg-black/40 px-1 text-white">处理后</span>
          <div class="cw absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white bg-slate-400" style="width:50%"><span class="absolute left-2 top-2 whitespace-nowrap rounded bg-black/40 px-1 text-white">处理前</span></div>
        </div>
        <input type="range" min="0" max="100" value="50" class="mt-2 w-full accent-indigo-600" aria-label="对比位置" oninput="D.q(this,'.cw').style.width=this.value+'%'">
      </div>`
  }
)

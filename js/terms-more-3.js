/* ============================================================
 * 术语扩充（三·上）：反馈提示 / 按钮与输入 / 导航
 * ============================================================ */

/* ---------- 本文件实例用到的小工具 ---------- */
D.loadbar = function (el) {
  var bar = D.q(el, '.tl')
  bar.style.transition = 'none'
  bar.style.width = '0'
  bar.style.opacity = 1
  void bar.offsetWidth
  bar.style.transition = 'width 1s ease-out, opacity .3s'
  bar.style.width = '80%'
  setTimeout(function () {
    bar.style.width = '100%'
  }, 1000)
  setTimeout(function () {
    bar.style.opacity = 0
  }, 1400)
}
D.pageload = function (el) {
  var mask = D.q(el, '.pl')
  mask.classList.remove('hidden')
  setTimeout(function () {
    mask.classList.add('hidden')
  }, 1500)
}
D.comboPick = function (li) {
  D.q(li, 'input').value = li.textContent.trim()
  D.q(li, '.cl').classList.add('hidden')
}
D.multi = function (el) {
  var picked = Array.prototype.map.call(
    D.qa(el, 'input:checked'),
    function (c) {
      return c.parentElement.textContent.trim()
    }
  )
  D.q(el, '.mv').textContent = picked.length
    ? picked.join(T('、'))
    : T('请选择（可多选）')
}
D.range2 = function (el) {
  var inputs = D.qa(el, 'input')
  var a = +inputs[0].value
  var b = +inputs[1].value
  if (a > b) {
    if (el === inputs[0]) inputs[1].value = b = a
    else inputs[0].value = a = b
  }
  D.q(el, '.rv2').textContent = '¥' + a + ' – ¥' + b
}
D.quickRange = function (el, days) {
  var fmt = function (d) {
    return d.toISOString().slice(0, 10)
  }
  var end = new Date()
  var start = new Date(end.getTime() - (days - 1) * 86400000)
  var inputs = D.qa(el, 'input')
  inputs[0].value = fmt(start)
  inputs[1].value = fmt(end)
  D.choose(el, 'bg-indigo-600 text-white')
}
D.addImg = function (el) {
  var colors = ['bg-indigo-300', 'bg-emerald-300', 'bg-amber-300', 'bg-rose-300']
  var n = D.qa(el, '.im').length
  var tile = document.createElement('div')
  tile.className = 'im relative h-14 w-14 rounded-lg ' + colors[n % 4]
  tile.innerHTML =
    '<button class="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-slate-800 text-[10px] leading-4 text-white" aria-label="' +
    T('移除') +
    '">×</button>'
  tile.firstChild.onclick = function () {
    tile.remove()
    el.classList.remove('hidden')
  }
  el.parentElement.insertBefore(tile, el)
  el.classList.toggle('hidden', n + 1 >= 4)
}
D.emoji = function (el) {
  D.q(el, 'input').value += el.textContent
}
D.loadMore = function (el) {
  var ul = D.q(el, 'ul')
  el.disabled = true
  el.innerHTML = '<i class="fa fa-spinner fa-spin"></i> ' + T('加载中…')
  setTimeout(function () {
    var n = ul.children.length
    for (var i = 1; i <= 3; i++) {
      var li = document.createElement('li')
      li.className = 'px-3 py-1.5'
      li.textContent = T('第 ') + (n + i) + T(' 条内容')
      ul.appendChild(li)
    }
    ul.parentElement.scrollTop = ul.parentElement.scrollHeight
    el.disabled = n + 3 >= 9
    el.textContent = T(n + 3 >= 9 ? '没有更多了' : '加载更多')
  }, 800)
}
D.view = function (el, grid) {
  D.choose(el, 'bg-white shadow text-indigo-600')
  var box = D.q(el, '.vb')
  box.classList.toggle('grid-cols-2', grid)
  box.classList.toggle('grid-cols-1', !grid)
}
D.bubble = function (el) {
  var has = String(window.getSelection()).trim().length > 0
  D.q(el, '.bm').classList.toggle('hidden', !has)
}

TERMS.push(
  /* ---------------- 反馈提示（补充二） ---------------- */
  {
    id: 'loadingbar',
    cat: 'feedback',
    zh: '顶部加载条',
    en: 'Top Loading Bar',
    alias: ['页面进度条', 'NProgress', '加载进度线'],
    plain: '点了链接之后，页面顶上有一条细线从左跑到右，跑完页面就出来了',
    desc: '页面跳转时给一个轻量的「正在加载」信号，不遮挡任何内容。',
    prompt:
      '页面切换时在浏览器窗口最顶部显示 Top Loading Bar 加载条：高 3px 的蓝色细线，开始时快速增长到 80%，数据返回后走完到 100% 并淡出。',
    vs: '需要明确进度数值用 Progress Bar；某个区块在加载用 Skeleton 或 Spinner。',
    spec: [
      '哪些场景触发（页面跳转、全局请求）',
      '颜色与粗细',
      '加载很快时是否仍显示（避免闪一下）',
      '加载失败时加载条如何结束'
    ],
    demo: `<div class="absolute inset-0 bg-white text-xs">
        <div class="tl h-[3px] bg-indigo-600" style="width:0"></div>
        <nav class="flex h-9 items-center gap-4 border-b px-3"><b class="text-indigo-600">Logo</b><span>首页</span><span>课程</span></nav>
        <div class="p-3 text-center"><button class="${G}" onclick="D.loadbar(this)">跳转到另一个页面</button><p class="mt-2 text-slate-400">留意最顶上的那条细线</p></div>
      </div>`
  },
  {
    id: 'status',
    cat: 'feedback',
    zh: '状态指示',
    en: 'Status Indicator',
    alias: ['状态点', '在线状态', 'Status Dot'],
    plain: '头像角上或文字前面的一个小圆点，绿的表示在线、红的表示忙、灰的表示离线',
    desc: '用颜色加文字快速表明一个对象当前处于什么状态：人、订单、设备、任务。',
    prompt:
      '用 Status Indicator 状态指示展示成员状态：头像右下角有带白色描边的小圆点，绿色为在线、红色为忙碌、灰色为离线，列表中圆点后跟状态文字。',
    vs: '提示有新消息或数量用 Badge；状态指示表达的是「现在是什么状态」。',
    spec: [
      '共有哪几种状态，各自的颜色与文案',
      '状态如何变化（自动判断还是手动设置）',
      '是否只靠颜色区分（需配文字，照顾色弱用户）',
      '状态多久更新一次'
    ],
    demo: `<div class="text-center text-xs">
        <span class="relative inline-block"><span class="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 text-lg text-white">王</span><span class="sd absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full ring-2 ring-white" style="background:#10b981"></span></span>
        <div class="mt-3 inline-flex gap-1">
          <button class="rounded-full border px-2 py-0.5 bg-indigo-600 text-white" onclick="D.choose(this,'bg-indigo-600 text-white');D.q(this,'.sd').style.background='#10b981'">在线</button>
          <button class="rounded-full border px-2 py-0.5" onclick="D.choose(this,'bg-indigo-600 text-white');D.q(this,'.sd').style.background='#f43f5e'">忙碌</button>
          <button class="rounded-full border px-2 py-0.5" onclick="D.choose(this,'bg-indigo-600 text-white');D.q(this,'.sd').style.background='#94a3b8'">离线</button>
        </div>
      </div>`
  },
  {
    id: 'hovercard',
    cat: 'feedback',
    zh: '悬浮卡片',
    en: 'Hover Card',
    alias: ['资料卡', '用户名片', 'Profile Card'],
    plain: '鼠标移到一个人名或链接上，旁边浮出一张小名片，有头像、简介和关注按钮',
    desc: '不用跳转就能预览一个对象的概要信息。',
    prompt:
      '用户名支持 Hover Card 悬浮卡片：鼠标悬停 300 毫秒后在下方浮出名片，包含头像、姓名、职位、一句简介和「关注」按钮，鼠标移到卡片上时保持显示。',
    vs: '只有一句纯文字说明用 Tooltip；需要点击才打开的是 Popover。',
    spec: [
      '哪些对象有悬浮卡片（用户、链接、术语）',
      '卡片里展示哪些信息、有哪些操作',
      '悬停多久出现、移开多久消失',
      '移动端的替代方式（点击进入详情）'
    ],
    demo: `<p class="mt-5 self-start text-sm">这份需求由
        <span class="group relative"><b class="cursor-pointer text-indigo-600 underline decoration-dotted">@小王</b>
          <span class="invisible absolute left-1/2 top-full z-10 w-44 -translate-x-1/2 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
            <span class="block rounded-xl border bg-white p-3 text-xs shadow-lg">
              <span class="flex items-center gap-2"><span class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white">王</span><span><b class="block text-slate-900">小王</b><span class="text-slate-400">高级产品经理</span></span></span>
              <span class="my-2 block text-slate-500">负责增长方向，喜欢写文档。</span>
              <button class="w-full rounded bg-indigo-600 py-1 text-white">关注</button>
            </span>
          </span>
        </span> 提出</p>`
  },
  {
    id: 'pageloading',
    cat: 'feedback',
    zh: '全屏加载',
    en: 'Full-page Loading',
    alias: ['全局加载', '加载遮罩', 'Loading Overlay'],
    plain: '整个页面蒙上一层，中间一个圈在转，转完之前什么都点不了',
    desc: '用于必须等待、且期间不允许任何操作的场景，比如支付处理中。',
    prompt:
      '提交订单后显示 Full-page Loading 全屏加载：半透明白色遮罩覆盖整个页面，中央是旋转图标和「正在提交订单…」文字，期间禁止任何点击，完成后自动消失。',
    vs: '会完全打断用户，能用按钮内 Spinner 或局部 Skeleton 时就别用全屏加载。',
    spec: [
      '哪些操作需要全屏加载（尽量少）',
      '提示文案',
      '最长等待多久，超时后怎么办',
      '用户能否取消'
    ],
    demo: `<div class="text-center text-xs"><p class="mb-3 text-slate-400">页面内容…</p><button class="${B}" onclick="D.pageload(this)">提交订单</button></div>
      <div class="pl absolute inset-0 flex hidden flex-col items-center justify-center gap-2 bg-white/80 text-xs text-slate-600 backdrop-blur-sm"><i class="fa fa-circle-o-notch fa-spin text-2xl text-indigo-600"></i>正在提交订单…</div>`
  },
  {
    id: 'newbadge',
    cat: 'feedback',
    zh: '新功能标记',
    en: 'New Badge',
    alias: ['NEW 标签', '红点引导', '新功能提示'],
    plain: '菜单某一项后面挂着一个小小的「NEW」或红点，点进去看过之后它就没了',
    desc: '低打扰地告诉老用户「这里有新东西」，比弹窗温和得多。',
    prompt:
      '给新上线的菜单项添加 New Badge 新功能标记：文字右侧显示红色「NEW」小标签，用户点击进入该功能一次后标签永久消失，并记录在用户账号下。',
    vs: '需要一步步教用户怎么用时用 Onboarding Tour。',
    spec: [
      '哪些功能需要标记，标记显示多久',
      '样式：NEW 文字还是红点',
      '什么行为算「已看过」',
      '同时有多个新功能时是否都标记'
    ],
    demo: `<ul class="w-44 divide-y rounded-lg border bg-white text-xs">
        <li class="px-3 py-2">我的文档</li>
        <li class="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-slate-50" onclick="var b=this.querySelector('.nb');if(b)b.remove()">AI 生成原型<span class="nb rounded bg-rose-500 px-1 text-[10px] font-bold text-white">NEW</span></li>
        <li class="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-slate-50" onclick="var b=this.querySelector('.nb');if(b)b.remove()">团队空间<span class="nb h-2 w-2 rounded-full bg-rose-500"></span></li>
        <li class="px-3 py-2 text-slate-400">点带标记的菜单试试</li>
      </ul>`
  },

  /* ---------------- 按钮与输入（补充二） ---------------- */
  {
    id: 'button',
    cat: 'input',
    zh: '按钮',
    en: 'Button',
    alias: ['主按钮', '次按钮', 'Primary / Secondary Button'],
    plain: '能点的那个小方块。颜色最重的是「主按钮」，白底带边框的是「次按钮」，只有字的是「文字按钮」',
    desc: '最基础的控件。用视觉轻重区分主次：一个区域里只应有一个主按钮。',
    prompt:
      '定义一套 Button 按钮样式：主按钮为蓝色实心白字，次按钮为白底灰色边框，文字按钮无背景仅蓝色文字，危险按钮为红色实心；都包含悬停、按下、禁用三种状态。',
    vs: '跳转到别的页面用 Link；按钮是「执行一个操作」。',
    spec: [
      '这个按钮是主操作还是次操作（决定样式）',
      '按钮文案（动词开头，如「保存修改」）',
      '点击后的行为，以及加载中、禁用时的表现',
      '多个按钮并排时的顺序与对齐'
    ],
    demo: `<div class="space-y-3 text-center">
        <div class="flex flex-wrap justify-center gap-2">
          <button class="${B}">主按钮</button>
          <button class="${G}">次按钮</button>
          <button class="px-3 py-1.5 text-sm text-indigo-600 hover:underline">文字按钮</button>
        </div>
        <div class="flex flex-wrap justify-center gap-2">
          <button class="rounded-lg bg-rose-600 px-3 py-1.5 text-sm text-white hover:bg-rose-700">危险按钮</button>
          <button disabled class="cursor-not-allowed rounded-lg bg-slate-200 px-3 py-1.5 text-sm text-slate-400">禁用</button>
        </div>
      </div>`
  },
  {
    id: 'iconbutton',
    cat: 'input',
    zh: '图标按钮',
    en: 'Icon Button',
    alias: ['纯图标按钮', '工具栏按钮'],
    plain: '只有一个小图标、没有文字的按钮，比如铅笔代表编辑、垃圾桶代表删除',
    desc: '省空间，适合工具栏和列表行内操作；但图标含义必须一看就懂。',
    prompt:
      '表格每行末尾放一组 Icon Button 图标按钮：编辑、复制、删除，默认灰色，悬停时出现浅灰圆形背景并显示 Tooltip 说明，删除按钮悬停时变红。',
    vs: '含义不够直观、或是页面的主要操作时，用带文字的 Button。',
    spec: [
      '每个图标代表什么操作，是否足够通用易懂',
      '悬停时是否显示文字说明（建议都加）',
      '可点击区域是否够大（移动端至少 44px）',
      '是否有选中、禁用状态'
    ],
    demo: `<div class="flex items-center gap-1 rounded-xl border bg-white p-2 text-slate-500">
        ${[
          ['pencil', '编辑', 'hover:text-indigo-600'],
          ['clone', '复制', 'hover:text-indigo-600'],
          ['share-alt', '分享', 'hover:text-indigo-600'],
          ['trash-o', '删除', 'hover:text-rose-600']
        ]
          .map(function (b) {
            return `<span class="group relative"><button class="h-9 w-9 rounded-full transition hover:bg-slate-100 ${b[2]}" aria-label="${b[1]}"><i class="fa fa-${b[0]}"></i></button><span class="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-white opacity-0 transition group-hover:opacity-100">${b[1]}</span></span>`
          })
          .join('')}
      </div>`
  },
  {
    id: 'splitbutton',
    cat: 'input',
    zh: '分裂按钮',
    en: 'Split Button',
    alias: ['组合按钮', '下拉按钮', 'Button with Dropdown'],
    plain: '一个按钮被竖线分成两半：点左边直接执行，点右边的小箭头展开其他相关操作',
    desc: '一个最常用的默认操作，加几个相关的备选操作，共用一个位置。',
    prompt:
      '「发布」使用 Split Button 分裂按钮：左侧主区域点击后直接发布，右侧箭头区域点击后展开菜单，包含「定时发布」和「存为草稿」。',
    vs: '几个操作没有明显主次时，用普通 Dropdown Menu。',
    spec: [
      '默认操作是哪一个',
      '下拉里有哪些备选操作',
      '是否记住用户上次选择并设为默认'
    ],
    demo: `<div class="relative mt-6 self-start text-sm">
        <div class="inline-flex overflow-hidden rounded-lg bg-indigo-600 text-white">
          <button class="px-4 py-1.5 hover:bg-indigo-700">发布</button>
          <button class="border-l border-white/30 px-2 hover:bg-indigo-700" aria-label="更多发布方式" onclick="D.tog(this,'.sm')"><i class="fa fa-angle-down"></i></button>
        </div>
        <ul class="sm absolute right-0 top-full mt-1 hidden w-28 rounded-lg border bg-white py-1 text-xs shadow-lg" onclick="D.tog(this,'.sm')">
          <li class="cursor-pointer px-3 py-1.5 hover:bg-indigo-50">定时发布</li>
          <li class="cursor-pointer px-3 py-1.5 hover:bg-indigo-50">存为草稿</li>
        </ul>
      </div>`
  },
  {
    id: 'choicechips',
    cat: 'input',
    zh: '选择标签',
    en: 'Choice Chips',
    alias: ['规格选择', '选项胶囊', 'Selectable Chips'],
    plain: '买衣服选尺码时那一排小方块：S、M、L、XL，点哪个哪个就框起来',
    desc: '把选项直接摊开让用户点选，比下拉框更直观，电商规格选择最典型。',
    prompt:
      '「尺码」使用 Choice Chips 选择标签：选项「S / M / L / XL」横向排列，单选，选中项为蓝色边框和浅蓝底，缺货的选项置灰并显示删除线、不可点击。',
    vs: '选项很多放不下时用 Select；只是展示分类不可选的是 Tag。',
    spec: [
      '有哪些选项，单选还是多选',
      '默认是否选中某一项',
      '不可选的选项（如缺货）如何展示',
      '选中后是否联动其他内容（价格、图片、库存）'
    ],
    demo: `<div class="text-xs">
        <div class="mb-2 text-slate-400">尺码</div>
        <div class="flex gap-2">
          <button class="rounded-lg border px-3 py-1.5" onclick="D.choose(this,'border-indigo-600 bg-indigo-50 text-indigo-600')">S</button>
          <button class="rounded-lg border px-3 py-1.5 border-indigo-600 bg-indigo-50 text-indigo-600" onclick="D.choose(this,'border-indigo-600 bg-indigo-50 text-indigo-600')">M</button>
          <button class="rounded-lg border px-3 py-1.5" onclick="D.choose(this,'border-indigo-600 bg-indigo-50 text-indigo-600')">L</button>
          <button disabled class="cursor-not-allowed rounded-lg border border-dashed px-3 py-1.5 text-slate-300 line-through">XL</button>
        </div>
      </div>`
  },
  {
    id: 'combobox',
    cat: 'input',
    zh: '可搜索下拉框',
    en: 'Combobox',
    alias: ['搜索选择', 'Searchable Select', '下拉搜索'],
    plain: '点开下拉框后可以直接打字，选项会跟着过滤，只剩下匹配的那几个',
    desc: '选项很多（几十上百个）时，让用户用搜索代替滚动查找。',
    prompt:
      '「负责人」使用 Combobox 可搜索下拉框：点击后展开成员列表，输入文字实时过滤选项，支持键盘上下选择和回车确认，无匹配时显示「未找到成员」。',
    vs: '选项少用普通 Select；可以输入列表外任意内容的是 Autocomplete。',
    spec: [
      '选项来源与数量，是否需要远程搜索',
      '按什么匹配（名称、拼音、编号）',
      '无匹配结果时的提示',
      '是否允许清空已选值'
    ],
    demo: `<div class="relative mt-3 w-48 self-start text-xs">
        <input class="${I} !text-xs" placeholder="选择负责人，可输入搜索" onfocus="D.q(this,'.cl').classList.remove('hidden')" oninput="D.flt(this,'li')">
        <ul class="cl absolute inset-x-0 top-full mt-1 hidden rounded-lg border bg-white py-1 shadow-lg">
          ${['王小明', '李晓红', '张伟', '陈静']
            .map(function (n) {
              return `<li class="cursor-pointer px-3 py-1.5 hover:bg-indigo-50" onclick="D.comboPick(this)">${n}</li>`
            })
            .join('')}
        </ul>
      </div>`
  },
  {
    id: 'multiselect',
    cat: 'input',
    zh: '多选下拉框',
    en: 'Multi-select',
    alias: ['下拉多选', '多选选择器'],
    plain: '下拉框里每个选项前有个勾选框，可以勾好几个，框里显示你选了哪些',
    desc: '在有限空间里从较多选项中选出多个。',
    prompt:
      '「抄送人」使用 Multi-select 多选下拉框：展开后每个选项带复选框，可勾选多项，输入框内显示已选项，超过 3 个时显示为「已选 N 项」。',
    vs: '选项少时直接用一组 Checkbox；需要清楚对比已选和未选时用 Transfer。',
    spec: [
      '选项来源，最多可选几个',
      '已选项在框内如何显示（标签、数量）',
      '是否支持全选、搜索',
      '选项很多时的性能与加载方式'
    ],
    demo: `<div class="w-48 text-xs">
        <div class="mv mb-1 truncate rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-600">请选择（可多选）</div>
        <div class="space-y-1 rounded-lg border bg-white p-2 shadow">
          ${['产品组', '设计组', '研发组', '测试组']
            .map(function (n) {
              return `<label class="flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 hover:bg-indigo-50"><input type="checkbox" class="accent-indigo-600" onchange="D.multi(this)">${n}</label>`
            })
            .join('')}
        </div>
      </div>`
  },
  {
    id: 'rangeslider',
    cat: 'input',
    zh: '范围滑块',
    en: 'Range Slider',
    alias: ['双滑块', '区间选择', '价格区间'],
    plain: '一根横线上有两个圆点，分别拖动来框出一个范围，比如价格从多少到多少',
    desc: '选择一个数值区间，筛选价格、年龄、时间段时常用。',
    prompt:
      '「价格区间」使用 Range Slider 范围滑块：一条轨道上有两个滑块分别表示最低价和最高价，范围 0–500，拖动时实时显示「¥最低 – ¥最高」，两个滑块不能交叉。',
    vs: '只选一个值用 Slider。',
    spec: [
      '整体范围、步长与默认区间',
      '两个滑块能否重合，最小间距',
      '是否同时提供输入框精确填写',
      '松手后才生效还是拖动中实时生效'
    ],
    demo: `<div class="w-52 text-xs">
        <div class="rv2 mb-2 text-center text-sm font-medium text-slate-900">¥100 – ¥400</div>
        <label class="flex items-center gap-2 text-slate-400">最低<input type="range" min="0" max="500" step="10" value="100" class="flex-1 accent-indigo-600" oninput="D.range2(this)"></label>
        <label class="flex items-center gap-2 text-slate-400">最高<input type="range" min="0" max="500" step="10" value="400" class="flex-1 accent-indigo-600" oninput="D.range2(this)"></label>
      </div>`
  },
  {
    id: 'daterange',
    cat: 'input',
    zh: '日期范围选择',
    en: 'Date Range Picker',
    alias: ['时间范围', '起止日期', '日期区间'],
    plain: '选一个开始日期和一个结束日期，旁边常有「近 7 天」「近 30 天」这样的快捷按钮',
    desc: '数据报表、订单查询的标配，快捷选项能省掉大部分手动选择。',
    prompt:
      '报表页顶部使用 Date Range Picker 日期范围选择：开始日期和结束日期两个输入框，旁边提供「近 7 天 / 近 30 天」快捷选项，结束日期不能早于开始日期。',
    vs: '只选一天用 Date Picker。',
    spec: [
      '提供哪些快捷选项，默认选哪个',
      '最长可选跨度（如最多 90 天）',
      '是否包含今天；是否精确到时分',
      '选择后是否立即查询'
    ],
    demo: `<div class="w-56 text-xs">
        <div class="mb-2 flex gap-1">
          <button class="rounded-full border px-2 py-0.5" onclick="D.quickRange(this,7)">近 7 天</button>
          <button class="rounded-full border px-2 py-0.5" onclick="D.quickRange(this,30)">近 30 天</button>
        </div>
        <div class="flex items-center gap-1"><input type="date" class="${I} !px-1 !text-xs" aria-label="开始日期"><span class="text-slate-400">至</span><input type="date" class="${I} !px-1 !text-xs" aria-label="结束日期"></div>
      </div>`
  },
  {
    id: 'timepicker',
    cat: 'input',
    zh: '时间选择器',
    en: 'Time Picker',
    alias: ['时间控件', '时分选择'],
    plain: '点一下输入框，选几点几分，用来定闹钟、约会议时间',
    desc: '选择一天中的某个时刻，常和日期选择器搭配使用。',
    prompt:
      '「会议开始时间」使用 Time Picker 时间选择器：点击后选择小时和分钟，分钟以 15 分钟为一档，采用 24 小时制，下方提供「09:00 / 14:00」快捷选项。',
    spec: [
      '12 小时制还是 24 小时制',
      '分钟的间隔（1、5、15、30 分钟）',
      '可选的时间范围（如仅营业时间）',
      '是否涉及时区'
    ],
    demo: `<div class="text-center text-xs">
        <input type="time" value="09:00" step="900" class="tp ${I} !w-36" aria-label="时间">
        <div class="mt-2 flex justify-center gap-1">
          <button class="rounded-full border px-2 py-0.5" onclick="D.q(this,'.tp').value='09:00'">09:00</button>
          <button class="rounded-full border px-2 py-0.5" onclick="D.q(this,'.tp').value='14:00'">14:00</button>
          <button class="rounded-full border px-2 py-0.5" onclick="D.q(this,'.tp').value='19:30'">19:30</button>
        </div>
      </div>`
  },
  {
    id: 'imageupload',
    cat: 'input',
    zh: '图片上传',
    en: 'Image Upload',
    alias: ['上传预览', '图片墙', '多图上传'],
    plain: '一个带加号的方框，点一下选图，选完图变成小缩略图，角上有个叉可以删掉',
    desc: '上传后立刻看到缩略图，是发帖、评价、提交资料时的标准做法。',
    prompt:
      '「上传凭证」使用 Image Upload 图片上传：以方形缩略图网格展示已上传图片，每张右上角有删除按钮，末尾是带加号的添加按钮，最多 4 张，达到上限后隐藏添加按钮。',
    vs: '上传任意文件、强调拖拽时用 Dropzone。',
    spec: [
      '最多几张，单张大小与格式限制',
      '上传中、失败时缩略图上的表现',
      '是否可调整顺序、点击放大预览',
      '是否需要压缩或裁剪'
    ],
    demo: `<div class="text-xs">
        <div class="flex gap-2">
          <button class="flex h-14 w-14 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-indigo-400 hover:text-indigo-600" onclick="D.addImg(this)" aria-label="添加图片"><i class="fa fa-plus"></i></button>
        </div>
        <p class="mt-2 text-slate-400">点加号模拟上传，最多 4 张</p>
      </div>`
  },
  {
    id: 'cropper',
    cat: 'input',
    zh: '图片裁剪',
    en: 'Image Cropper',
    alias: ['头像裁剪', '裁切', 'Crop'],
    plain: '换头像的时候，图片上有个圆框，你可以放大缩小、挪动图片，决定框里留哪一部分',
    desc: '让用户自己决定图片的显示区域，避免系统自动裁切把脸切掉。',
    prompt:
      '上传头像后进入 Image Cropper 图片裁剪：图片上叠加圆形裁剪框，框外区域变暗，下方滑块控制缩放（1–3 倍），可拖动图片调整位置，点击「确定」后生成裁剪结果。',
    spec: [
      '裁剪框的形状与比例（圆形、1:1、16:9）',
      '缩放范围，是否支持旋转',
      '输出图片的尺寸与清晰度',
      '原图太小时如何提示'
    ],
    demo: `<div class="w-48 text-center text-xs">
        <div class="relative mx-auto h-24 w-24 overflow-hidden rounded-lg bg-slate-800">
          <div class="zi flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-300 to-rose-400 text-3xl text-white transition-transform"><i class="fa fa-user"></i></div>
          <div class="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white" style="box-shadow:0 0 0 999px rgba(0,0,0,.5)"></div>
        </div>
        <input type="range" min="1" max="3" step="0.1" value="1" class="zr mt-2 w-full accent-indigo-600" aria-label="缩放" oninput="D.zoom(this,+this.value)">
        <p class="text-slate-400">拖动滑块缩放，圆框内是保留的部分</p>
      </div>`
  },
  {
    id: 'emojipicker',
    cat: 'input',
    zh: '表情选择器',
    en: 'Emoji Picker',
    alias: ['表情面板', '表情键盘'],
    plain: '输入框旁边的笑脸按钮，点开是一格一格的表情，点一个就插进你的文字里',
    desc: '聊天、评论场景的常见配置，让表达更轻松。',
    prompt:
      '评论输入框右侧加 Emoji Picker 表情选择器：点击笑脸图标弹出表情面板，表情按网格排列，点击后插入到输入框光标位置，面板保持打开可连续选择。',
    spec: [
      '提供哪些表情，是否分类、可搜索',
      '是否显示最近使用',
      '是否支持自定义表情或贴纸',
      '各平台表情显示不一致时是否需要统一'
    ],
    demo: `<div class="w-52 text-xs">
        <div class="relative"><input class="${I} pr-8" placeholder="说点什么…" aria-label="评论"><button class="absolute right-2 top-1/2 -translate-y-1/2 text-base" aria-label="选择表情" onclick="D.tog(this,'.ep')">😀</button></div>
        <div class="ep mt-1 grid grid-cols-6 gap-1 rounded-lg border bg-white p-2 text-base shadow">
          ${['😀', '😂', '🥰', '😎', '🤔', '😭', '👍', '👏', '🙏', '🎉', '🔥', '❤️']
            .map(function (e) {
              return `<button class="rounded hover:bg-slate-100" onclick="D.emoji(this)">${e}</button>`
            })
            .join('')}
        </div>
      </div>`
  },
  {
    id: 'form',
    cat: 'input',
    zh: '表单',
    en: 'Form',
    alias: ['表单布局', '表单页', '信息填写'],
    plain: '一组输入框从上往下排好，每个上面有标题，必填的带红星，最底下是「取消」和「提交」',
    desc: '把多个输入控件组织成一个整体。布局、分组、校验和提交反馈共同决定填写体验。',
    prompt:
      '做一个「新建项目」Form 表单：标签在输入框上方，必填项带红色星号，包含项目名称（输入框）、类型（下拉）、是否公开（开关）；底部右对齐「取消」和「创建」按钮，提交时校验必填项。',
    spec: [
      '有哪些字段，哪些必填，如何分组和排序',
      '标签位置（上方、左侧）与布局（单列、多列）',
      '校验规则与时机，错误如何展示',
      '提交成功、失败后的反馈，是否防止重复提交'
    ],
    demo: `<div class="w-52 rounded-xl border bg-white p-3 text-[11px]">
        <label class="mb-2 block"><span class="mb-0.5 block text-slate-600">项目名称 <span class="text-rose-500">*</span></span><input class="${I} !py-1 !text-xs" placeholder="请输入"></label>
        <label class="mb-2 block"><span class="mb-0.5 block text-slate-600">类型 <span class="text-rose-500">*</span></span><select class="${I} !py-1 !text-xs"><option>网站</option><option>小程序</option></select></label>
        <div class="flex justify-end gap-2 border-t pt-2"><button class="rounded border px-2 py-1">取消</button><button class="rounded bg-indigo-600 px-2 py-1 text-white">创建</button></div>
      </div>`
  },

  /* ---------------- 导航（补充二） ---------------- */
  {
    id: 'link',
    cat: 'nav',
    zh: '文字链接',
    en: 'Link',
    alias: ['超链接', '链接', 'Hyperlink'],
    plain: '一段蓝色的字，鼠标移上去会出现下划线，点了会跳到别的页面',
    desc: '最基础的跳转方式。链到站外时通常带一个小箭头图标并在新窗口打开。',
    prompt:
      '正文中的 Link 文字链接使用蓝色，悬停时显示下划线；指向站外的链接在文字后加外链图标并在新标签页打开；不可用的链接置灰且不可点击。',
    vs: '执行操作（提交、删除）用 Button；链接只负责「去某个地方」。',
    spec: [
      '链接文字是否说清了去向（避免「点击这里」）',
      '当前页打开还是新标签页打开',
      '站外链接是否需要标识或跳转提醒',
      '访问过的链接是否变色'
    ],
    demo: `<div class="space-y-2 text-sm">
        <p>查看<span class="cursor-pointer text-indigo-600 hover:underline">使用文档</span>了解更多。</p>
        <p>前往<span class="cursor-pointer text-indigo-600 hover:underline">官方网站 <i class="fa fa-external-link text-xs"></i></span>（站外）</p>
        <p class="text-slate-300">暂不可用的链接</p>
      </div>`
  },
  {
    id: 'loadmore',
    cat: 'nav',
    zh: '加载更多',
    en: 'Load More',
    alias: ['查看更多', '点击加载', 'Show More'],
    plain: '列表底下有个「加载更多」按钮，点一下才多出来一批内容，不点就不加载',
    desc: '介于分页和无限滚动之间：由用户决定要不要继续看，页脚也不会永远够不着。',
    prompt:
      '评论列表底部放 Load More 加载更多按钮：点击后按钮显示加载动画并请求下一页，新内容追加到列表末尾，全部加载完后按钮变为「没有更多了」并禁用。',
    vs: '自动加载是 Infinite Scroll；需要跳到指定页用 Pagination。',
    spec: [
      '每次加载多少条',
      '按钮在加载中、加载失败、没有更多时的文案',
      '是否显示「已显示 N / 共 M 条」',
      '新内容出现后页面位置是否保持不跳动'
    ],
    demo: `<div class="w-52 text-xs">
        <div class="max-h-24 overflow-y-auto rounded-lg border bg-white"><ul class="divide-y"><li class="px-3 py-1.5">第 1 条内容</li><li class="px-3 py-1.5">第 2 条内容</li><li class="px-3 py-1.5">第 3 条内容</li></ul></div>
        <button class="mt-2 w-full rounded-lg border bg-white py-1.5 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 disabled:cursor-not-allowed disabled:text-slate-300" onclick="D.loadMore(this)">加载更多</button>
      </div>`
  },
  {
    id: 'moremenu',
    cat: 'nav',
    zh: '更多操作',
    en: 'More Menu',
    alias: ['三个点', 'Kebab Menu', '溢出菜单'],
    plain: '卡片或列表行右上角的三个小点「···」，点开是编辑、删除这些不常用的操作',
    desc: '把次要操作收起来，保持界面干净；是最常见的「藏操作」的地方。',
    prompt:
      '每张卡片右上角放一个 More Menu 更多操作按钮（三个点图标），点击后展开菜单「编辑 / 复制 / 删除」，删除项标红，点击菜单外部关闭。',
    vs: '最常用的一两个操作应直接露出为按钮，只把次要操作收进「更多」。',
    spec: [
      '哪些操作直接露出，哪些收进「更多」',
      '菜单项的顺序，危险操作是否置底标红',
      '不同权限的用户看到的菜单项是否不同',
      '移动端是否改为 Action Sheet'
    ],
    demo: `<div class="relative w-52 self-start rounded-xl border bg-white p-3 text-xs mt-4">
        <div class="flex items-start justify-between"><div><b class="text-slate-900">首页改版需求</b><p class="text-slate-400">更新于 2 小时前</p></div>
          <button class="h-6 w-6 rounded hover:bg-slate-100" aria-label="更多操作" onclick="D.tog(this,'.mm')"><i class="fa fa-ellipsis-h"></i></button></div>
        <ul class="mm absolute right-2 top-9 hidden w-24 rounded-lg border bg-white py-1 shadow-lg" onclick="D.tog(this,'.mm')">
          <li class="cursor-pointer px-3 py-1.5 hover:bg-indigo-50">编辑</li><li class="cursor-pointer px-3 py-1.5 hover:bg-indigo-50">复制</li><li class="cursor-pointer px-3 py-1.5 text-rose-600 hover:bg-rose-50">删除</li>
        </ul>
      </div>`
  },
  {
    id: 'viewswitch',
    cat: 'nav',
    zh: '视图切换',
    en: 'View Switcher',
    alias: ['列表/网格切换', '布局切换', 'View Toggle'],
    plain: '右上角两个小图标，一个是几条横线、一个是四个方块，点一下内容就在列表和网格之间切换',
    desc: '同一批数据提供不同的看法：列表信息密、网格更直观，也可以是看板、日历。',
    prompt:
      '文件页右上角加 View Switcher 视图切换：列表和网格两个图标按钮，当前视图高亮，切换后内容区在单列列表与多列卡片网格之间变化，并记住用户的选择。',
    vs: '切换的是不同内容用 Tabs；视图切换是「同一批内容换一种排法」。',
    spec: [
      '提供哪几种视图，默认是哪种',
      '各视图分别展示哪些字段',
      '切换后筛选、排序、选中状态是否保留',
      '是否记住用户的选择'
    ],
    demo: `<div class="w-52 text-xs">
        <div class="mb-2 flex justify-end"><div class="inline-flex rounded-lg bg-slate-200 p-0.5 text-slate-500">
          <button class="h-6 w-7 rounded-md bg-white text-indigo-600 shadow" aria-label="列表视图" onclick="D.view(this,false)"><i class="fa fa-list"></i></button>
          <button class="h-6 w-7 rounded-md" aria-label="网格视图" onclick="D.view(this,true)"><i class="fa fa-th-large"></i></button>
        </div></div>
        <div class="vb grid grid-cols-1 gap-1.5">
          ${['需求文档', '原型图', '会议纪要', '竞品分析']
            .map(function (f) {
              return `<div class="rounded-lg border bg-white px-2 py-1.5"><i class="fa fa-file-text-o text-slate-400"></i> ${f}</div>`
            })
            .join('')}
        </div>
      </div>`
  },
  {
    id: 'bubblemenu',
    cat: 'nav',
    zh: '浮动工具栏',
    en: 'Bubble Menu',
    alias: ['划词菜单', '选中工具栏', 'Selection Toolbar'],
    plain: '用鼠标选中一段文字后，文字上方自动冒出一小条工具栏：加粗、评论、复制',
    desc: '操作跟着选中的内容走，不用把鼠标移到页面顶部的工具栏。',
    prompt:
      '文档正文支持 Bubble Menu 浮动工具栏：用户选中文字后，在选区上方显示深色工具条，包含「加粗 / 评论 / 复制」图标按钮，取消选中后工具条消失。',
    vs: '点鼠标右键出现的是 Context Menu；浮动工具栏是选中文字后自动出现。',
    spec: [
      '选中哪些内容时出现（文字、图片、表格）',
      '工具栏上有哪些操作',
      '出现的位置，遮挡内容或靠近边缘时如何调整',
      '移动端如何与系统自带的选择菜单共存'
    ],
    demo: `<div class="relative w-52 pt-9 text-sm" onmouseup="D.bubble(this)" ontouchend="D.bubble(this)">
        <div class="bm absolute left-1/2 top-0 flex hidden -translate-x-1/2 gap-1 rounded-lg bg-slate-800 px-2 py-1 text-white shadow-lg"><i class="fa fa-bold p-1"></i><i class="fa fa-comment-o p-1"></i><i class="fa fa-copy p-1"></i></div>
        <p class="rounded-lg bg-white p-3 leading-relaxed">用鼠标拖动，选中这句话里的任意几个字试试。</p>
      </div>`
  }
)

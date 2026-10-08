/* ============================================================
 * 术语扩充（三·下）：内容展示与社交 / 移动端 / 系统状态
 * ============================================================ */

/* ---------- 本文件实例用到的小工具 ---------- */
D.send = function (el) {
  var input = D.q(el, '.ci')
  var box = D.q(el, '.cb3')
  var v = input.value.trim()
  if (!v) return
  var row = document.createElement('div')
  row.className = 'flex justify-end'
  row.innerHTML =
    '<span class="max-w-[70%] rounded-2xl rounded-br-sm bg-indigo-600 px-3 py-1.5 text-white"></span>'
  row.firstChild.textContent = v
  box.appendChild(row)
  box.scrollTop = box.scrollHeight
  input.value = ''
}
D.react = function (el) {
  var num = el.querySelector('.rn')
  var on = el.classList.toggle('bg-indigo-50')
  el.classList.toggle('border-indigo-400', on)
  el.classList.toggle('text-indigo-600', on)
  num.textContent = +num.textContent + (on ? 1 : -1)
}
D.play = function (el) {
  var d = el.closest('[data-demo]')
  var bar = D.q(el, '.vp')
  var icon = D.q(el, '.vi')
  var playing = !d._timer
  icon.className = 'vi fa fa-' + (playing ? 'pause' : 'play')
  D.q(el, '.vc').classList.toggle('hidden', playing)
  if (!playing) {
    clearInterval(d._timer)
    d._timer = null
    return
  }
  d._timer = setInterval(function () {
    var p = ((+d.dataset.p || 0) + 1) % 101
    d.dataset.p = p
    bar.style.width = p + '%'
    D.q(el, '.vt').textContent = '0:' + ('0' + Math.round(p * 0.3)).slice(-2) + ' / 0:30'
    if (p === 100) D.play(el)
  }, 100)
}
D.readAll = function (el) {
  D.qa(el, '.ur').forEach(function (x) {
    x.remove()
  })
  D.q(el, '.nd').classList.add('hidden')
}
D.qr = function (el) {
  D.qa(el, '.qc').forEach(function (c) {
    c.style.background = Math.random() > 0.5 ? '#0f172a' : 'transparent'
  })
  D.q(el, '.qx').classList.add('hidden')
  clearTimeout(el._t)
}
D.batch = function (el, all) {
  var boxes = D.qa(el, '.bc')
  if (all) {
    boxes.forEach(function (b) {
      b.checked = el.checked
    })
  }
  var n = Array.prototype.filter.call(boxes, function (b) {
    return b.checked
  }).length
  D.q(el, '.bs').checked = n === boxes.length
  D.q(el, '.bn').textContent = n
  D.q(el, '.ba').classList.toggle('invisible', !n)
}
D.leave = function (el) {
  var dirty = D.q(el, '.ui').value.trim()
  if (dirty) return D.q(el, '.ul').classList.remove('hidden')
  D.q(el, '.um').textContent = T('没有修改，直接离开了')
}
D.retry = function (el) {
  var d = el.closest('[data-demo]')
  var show = function (sel) {
    ;['.re', '.rs', '.rk'].forEach(function (s) {
      D.q(el, s).classList.toggle('hidden', s !== sel)
    })
  }
  show('.rs')
  setTimeout(function () {
    d.dataset.r = (+d.dataset.r || 0) + 1
    show(d.dataset.r % 2 ? '.re' : '.rk')
  }, 900)
}
D.copied = function (el) {
  var old = el.textContent
  App.copy(D.q(el, '.cc2').textContent)
  el.textContent = T('✓ 已复制')
  setTimeout(function () {
    el.textContent = old
  }, 1500)
}
D.splash = function (el, skip) {
  var sp = D.q(el, '.sp')
  var num = D.q(el, '.sc')
  clearInterval(sp._t)
  sp.classList.toggle('hidden', !!skip)
  if (skip) return
  var n = 3
  num.textContent = n
  sp._t = setInterval(function () {
    num.textContent = --n
    if (n <= 0) D.splash(el, true)
  }, 1000)
}

TERMS.push(
  /* ---------------- 内容展示与社交 ---------------- */
  {
    id: 'chatbubble',
    cat: 'display',
    zh: '聊天气泡',
    en: 'Chat Bubble',
    alias: ['消息气泡', '对话气泡', 'Message Bubble'],
    plain: '聊天界面里一条条圆角的小泡泡：对方的在左边是灰色，自己的在右边是彩色',
    desc: '即时通讯和 AI 对话产品的基本单元，靠左右位置和颜色区分是谁说的。',
    prompt:
      '做一个聊天界面：对方的 Chat Bubble 聊天气泡靠左、灰色背景并带头像，自己的靠右、蓝色背景白字；消息之间居中显示灰色时间戳；底部是输入框和发送按钮，发送后新气泡出现在最下方并自动滚动到底。',
    spec: [
      '支持哪些消息类型（文字、图片、文件、语音、卡片）',
      '消息状态：发送中、已发送、失败（可重发）、已读',
      '时间戳的显示规则（每条都显示还是间隔显示）',
      '长按或悬停消息时有哪些操作（复制、撤回、引用）'
    ],
    demo: `<div class="absolute inset-0 flex flex-col bg-white text-xs">
        <div class="cb3 flex-1 space-y-2 overflow-y-auto p-3">
          <div class="text-center text-[10px] text-slate-400">今天 09:30</div>
          <div class="flex gap-2"><span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">李</span><span class="max-w-[70%] rounded-2xl rounded-bl-sm bg-slate-100 px-3 py-1.5">设计稿更新了，你看一下？</span></div>
          <div class="flex justify-end"><span class="max-w-[70%] rounded-2xl rounded-br-sm bg-indigo-600 px-3 py-1.5 text-white">好的，马上看</span></div>
        </div>
        <div class="flex gap-1 border-t p-2"><input class="ci ${I} !py-1 !text-xs" placeholder="输入消息后回车" aria-label="消息" onkeydown="if(event.key==='Enter')D.send(this)"><button class="shrink-0 rounded-lg bg-indigo-600 px-3 text-white" onclick="D.send(this)">发送</button></div>
      </div>`
  },
  {
    id: 'comments',
    cat: 'display',
    zh: '评论区',
    en: 'Comment Thread',
    alias: ['评论列表', '楼中楼', '回复嵌套'],
    plain: '文章下面的留言：每条有头像、名字、内容和时间，别人的回复缩进一层排在它下面',
    desc: '让用户围绕内容讨论。嵌套层级和排序方式是设计的关键。',
    prompt:
      '文章底部做一个 Comment Thread 评论区：每条评论包含头像、昵称、内容、时间和「回复」按钮；回复以缩进方式嵌套在原评论下方，最多两层；点击「回复」在该评论下方展开输入框。',
    spec: [
      '最多嵌套几层，超过后如何展示（平铺并 @对方）',
      '排序方式：最新、最热，能否切换',
      '评论能否编辑、删除，是否需要审核',
      '回复很多时是否默认折叠'
    ],
    demo: `<div class="w-56 text-xs">
        <div class="flex gap-2"><span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">王</span>
          <div class="flex-1"><b class="text-slate-900">小王</b> <span class="text-slate-400">2 小时前</span><p>这个方案的埋点怎么做？</p>
            <button class="text-slate-400 hover:text-indigo-600" onclick="D.tog(this,'.rp')">回复</button>
            <div class="mt-2 flex gap-2 border-l-2 border-slate-200 pl-2"><span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">李</span><div><b class="text-slate-900">小李</b> <span class="text-slate-400">1 小时前</span><p>文档第三节有写。</p></div></div>
            <input class="rp ${I} mt-2 hidden !py-1 !text-xs" placeholder="回复 小王…" aria-label="回复">
          </div>
        </div>
      </div>`
  },
  {
    id: 'reactions',
    cat: 'display',
    zh: '表情回应',
    en: 'Reactions',
    alias: ['表情回复', '点赞表情', 'Emoji Reactions'],
    plain: '消息下面那几个带数字的小表情，点一下就算你也表态了，不用专门回一句话',
    desc: '用最低成本表达态度，减少「收到」「+1」这类刷屏消息。',
    prompt:
      '每条消息下方显示 Reactions 表情回应：已有的回应以「表情 + 数量」的小胶囊展示，点击可加入或取消自己的回应，自己回应过的胶囊高亮；末尾有添加表情的按钮。',
    vs: '只有「赞」一种的是点赞（Like）；Reactions 提供多种表情。',
    spec: [
      '可用的表情范围（固定几个还是任意表情）',
      '是否显示是谁回应的（悬停查看名单）',
      '一个人能否添加多种回应',
      '被回应的人是否收到通知'
    ],
    demo: `<div class="w-52 text-xs">
        <div class="rounded-2xl rounded-bl-sm bg-white px-3 py-2 shadow-sm">下周一上线，大家辛苦了！</div>
        <div class="mt-1.5 flex gap-1">
          <button class="rounded-full border bg-white px-2 py-0.5 transition" onclick="D.react(this)">👍 <span class="rn">3</span></button>
          <button class="rounded-full border bg-white px-2 py-0.5 transition" onclick="D.react(this)">🎉 <span class="rn">1</span></button>
          <button class="rounded-full border bg-white px-2 py-0.5 transition" onclick="D.react(this)">❤️ <span class="rn">2</span></button>
        </div>
        <p class="mt-2 text-slate-400">点表情加入或取消回应</p>
      </div>`
  },
  {
    id: 'videoplayer',
    cat: 'display',
    zh: '视频播放器',
    en: 'Video Player',
    alias: ['播放器', '播放控件', 'Media Player'],
    plain: '视频画面中间一个大播放键，底下一条进度条，还有时间、音量、全屏这些小按钮',
    desc: '由画面、播放控制条和各种状态（加载、暂停、结束）组成。',
    prompt:
      '做一个 Video Player 视频播放器：画面中央有大号播放按钮，底部控制条包含播放/暂停、可拖动的进度条、当前时间/总时长、音量和全屏按钮；播放时控制条 3 秒后自动隐藏，鼠标移动时重新显示。',
    spec: [
      '控制条包含哪些功能（倍速、清晰度、字幕、画中画）',
      '是否自动播放、是否默认静音、是否循环',
      '封面图、加载中、播放结束时分别显示什么',
      '是否记忆上次播放进度'
    ],
    demo: `<div class="w-56 overflow-hidden rounded-xl bg-slate-900 text-xs text-white">
        <div class="relative flex h-24 cursor-pointer items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900" onclick="D.play(this)"><span class="vc flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900"><i class="fa fa-play pl-0.5"></i></span></div>
        <div class="h-1 bg-white/20"><div class="vp h-full bg-indigo-400" style="width:0"></div></div>
        <div class="flex items-center gap-3 px-3 py-1.5"><button aria-label="播放或暂停" onclick="D.play(this)"><i class="vi fa fa-play"></i></button><span class="vt flex-1 font-mono text-[10px]">0:00 / 0:30</span><i class="fa fa-volume-up"></i><i class="fa fa-expand"></i></div>
      </div>`
  },
  {
    id: 'codeblock',
    cat: 'display',
    zh: '代码块',
    en: 'Code Block',
    alias: ['代码框', '代码片段', 'Code Snippet'],
    plain: '深色底、等宽字的一块区域，里面是代码，右上角有个「复制」按钮',
    desc: '技术文档、开发者产品、AI 对话里展示代码的标准形式。',
    prompt:
      '文档中的 Code Block 代码块：深色背景、等宽字体、语法高亮，左上角显示语言名称，右上角有复制按钮，点击后按钮文字变为「已复制」并在 2 秒后恢复，过长时横向滚动。',
    spec: [
      '是否需要语法高亮、行号',
      '是否提供复制按钮',
      '代码很长时：横向滚动还是自动换行，是否限制高度',
      '是否显示语言名称或文件名'
    ],
    demo: `<div class="w-56 overflow-hidden rounded-lg bg-slate-900 text-xs">
        <div class="flex items-center justify-between bg-slate-800 px-3 py-1 text-slate-400"><span>bash</span><button class="hover:text-white" onclick="D.copied(this)">复制</button></div>
        <pre class="overflow-x-auto p-3 font-mono text-emerald-300"><code class="cc2">npm install
npm run dev</code></pre>
      </div>`
  },
  {
    id: 'divider',
    cat: 'display',
    zh: '分隔线',
    en: 'Divider',
    alias: ['分割线', '分隔符', 'Separator'],
    plain: '一条浅浅的细线，把上下或左右两块内容隔开；有时线中间还夹着一个「或」字',
    desc: '最轻量的分组方式。能用留白分开的地方就不必加线。',
    prompt:
      '登录表单中使用 Divider 分隔线：密码登录与第三方登录之间放一条带文字的分隔线，线条为浅灰色、中间是「或」字；页脚链接之间用竖向分隔线隔开。',
    vs: '内容需要更强的独立感时用 Card 包起来。',
    spec: [
      '横向还是竖向',
      '是否带文字',
      '线条的颜色、粗细与上下间距',
      '是否真的需要（留白可能已足够）'
    ],
    demo: `<div class="w-52 text-xs text-slate-600">
        <p>上面的一段内容</p>
        <hr class="my-2 border-slate-300">
        <p>下面的一段内容</p>
        <div class="my-3 flex items-center gap-2 text-slate-400"><span class="h-px flex-1 bg-slate-300"></span>或<span class="h-px flex-1 bg-slate-300"></span></div>
        <div class="flex items-center justify-center gap-2"><span>帮助</span><span class="h-3 w-px bg-slate-300"></span><span>隐私</span><span class="h-3 w-px bg-slate-300"></span><span>条款</span></div>
      </div>`
  },
  {
    id: 'filelist',
    cat: 'display',
    zh: '文件列表',
    en: 'File List',
    alias: ['附件列表', '文件项', 'Attachments'],
    plain: '一行一个文件：前面是文件类型的小图标，中间是文件名和大小，后面是下载和删除',
    desc: '展示已上传的附件或可下载的资料。',
    prompt:
      '用 File List 文件列表展示附件：每行左侧为按类型区分颜色的文件图标，中间是文件名（过长省略）和文件大小，右侧是下载与删除图标按钮，悬停时整行高亮。',
    spec: [
      '每个文件展示哪些信息（名称、大小、时间、上传人）',
      '支持哪些操作（预览、下载、删除、重命名）',
      '上传中、失败的文件如何显示',
      '文件名过长时如何截断（保留扩展名）'
    ],
    demo: `<ul class="w-56 divide-y rounded-lg border bg-white text-xs">
        ${[
          ['file-pdf-o', 'text-rose-500', '产品需求文档 v2.pdf', '1.2 MB'],
          ['file-excel-o', 'text-emerald-600', '数据埋点表.xlsx', '86 KB'],
          ['file-image-o', 'text-sky-500', '首页原型图.png', '540 KB']
        ]
          .map(function (f) {
            return `<li class="flex items-center gap-2 px-3 py-2 hover:bg-slate-50"><i class="fa fa-${f[0]} ${f[1]} text-lg"></i><div class="min-w-0 flex-1"><div class="truncate text-slate-900">${f[2]}</div><div class="text-[10px] text-slate-400">${f[3]}</div></div><i class="fa fa-download cursor-pointer text-slate-400 hover:text-indigo-600"></i><i class="fa fa-trash-o cursor-pointer text-slate-400 hover:text-rose-600" onclick="this.closest('li').remove()"></i></li>`
          })
          .join('')}
      </ul>`
  },
  {
    id: 'imagegrid',
    cat: 'display',
    zh: '九宫格图片',
    en: 'Image Grid',
    alias: ['图片网格', '宫格图', 'Photo Grid'],
    plain: '朋友圈那种把几张图排成整齐方格的样子，图太多时最后一格写着「+5」',
    desc: '在固定区域内整齐展示多张图片，数量不同排法也不同。',
    prompt:
      '动态中的多张图片用 Image Grid 九宫格展示：图片裁成正方形，3 列排列，间距 4px；超过 9 张时第 9 格叠加半透明遮罩并显示「+N」，点击任意图片进入大图预览。',
    vs: '图片高度不一、强调浏览用 Masonry；一次只看一张用 Carousel。',
    spec: [
      '1 张、2 张、4 张、9 张时各自的排法',
      '最多显示几张，超出如何提示',
      '图片的裁切方式（居中裁成方形）',
      '点击后的行为（大图预览、左右切换）'
    ],
    demo: `<div class="grid w-40 grid-cols-3 gap-1">
        ${['bg-indigo-300', 'bg-emerald-300', 'bg-amber-300', 'bg-rose-300', 'bg-sky-300', 'bg-fuchsia-300', 'bg-teal-300', 'bg-orange-300']
          .map(function (c) {
            return `<div class="aspect-square cursor-zoom-in rounded ${c}"></div>`
          })
          .join('')}
        <div class="relative aspect-square cursor-zoom-in rounded bg-slate-400"><span class="absolute inset-0 flex items-center justify-center rounded bg-black/50 text-sm font-medium text-white">+5</span></div>
      </div>`
  },
  {
    id: 'descriptions',
    cat: 'display',
    zh: '描述列表',
    en: 'Description List',
    alias: ['详情字段', '键值对', 'Key-Value List'],
    plain: '详情页里一排排「名称：内容」，比如「订单号：xxx」「下单时间：xxx」',
    desc: '详情页的主体：把一个对象的各项属性整齐地列出来，只读不可编辑。',
    prompt:
      '订单详情页用 Description List 描述列表展示信息：两列布局，每项为灰色的字段名和黑色的字段值，订单号右侧带复制图标，状态用彩色标签显示，移动端变为单列。',
    vs: '多条记录横向对比用 Table；描述列表展示的是「一条记录的所有字段」。',
    spec: [
      '展示哪些字段，如何分组和排序',
      '每行几列，字段名与值如何对齐',
      '值为空时显示什么（如「—」）',
      '哪些字段可复制、可点击跳转'
    ],
    demo: `<dl class="grid w-56 grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 rounded-lg border bg-white p-3 text-xs">
        <dt class="text-slate-400">订单号</dt><dd class="text-slate-900">A-2026-0001 <i class="fa fa-copy cursor-pointer text-slate-400"></i></dd>
        <dt class="text-slate-400">下单时间</dt><dd class="text-slate-900">2026-10-08 09:30</dd>
        <dt class="text-slate-400">状态</dt><dd><span class="rounded bg-emerald-50 px-1.5 text-emerald-600">已完成</span></dd>
        <dt class="text-slate-400">备注</dt><dd class="text-slate-300">—</dd>
      </dl>`
  },
  {
    id: 'notifcenter',
    cat: 'display',
    zh: '消息中心',
    en: 'Notification Center',
    alias: ['通知列表', '站内信', '消息面板'],
    plain: '点右上角的小铃铛，展开一列通知，没看过的前面有个蓝点，顶上有「全部已读」',
    desc: '集中存放所有通知，用户错过了弹出的提醒也能回来找到。',
    prompt:
      '导航栏的铃铛图标点击后展开 Notification Center 消息中心面板：顶部是标题和「全部已读」按钮，下方为通知列表，未读项左侧有蓝色圆点，点击通知跳转到对应页面并标为已读。',
    vs: '实时弹出的单条提醒是 Notification 或 Toast；消息中心是它们的「收件箱」。',
    spec: [
      '有哪些通知类型，是否分类（评论、系统、待办）',
      '已读、未读的规则，是否支持全部已读',
      '通知保留多久，能否删除',
      '用户能否设置接收哪些通知'
    ],
    demo: `<div class="w-56 text-xs">
        <div class="mb-1 flex justify-end pr-2"><span class="relative text-lg text-slate-600"><i class="fa fa-bell"></i><span class="nd absolute -right-1 -top-0.5 h-2 w-2 rounded-full bg-rose-500"></span></span></div>
        <div class="rounded-xl border bg-white shadow-lg">
          <div class="flex items-center justify-between border-b px-3 py-1.5"><b class="text-slate-900">通知</b><button class="text-indigo-600" onclick="D.readAll(this)">全部已读</button></div>
          <ul class="divide-y">
            <li class="flex items-center gap-2 px-3 py-1.5"><span class="ur h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600"></span>小王评论了你的文档</li>
            <li class="flex items-center gap-2 px-3 py-1.5"><span class="ur h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600"></span>你有一个待审批的需求</li>
            <li class="px-3 py-1.5 text-slate-400">系统将于周日升级</li>
          </ul>
        </div>
      </div>`
  },
  {
    id: 'sharepanel',
    cat: 'display',
    zh: '分享面板',
    en: 'Share Panel',
    alias: ['分享弹窗', '分享菜单', 'Share Sheet'],
    plain: '点「分享」后弹出的那一排圆形图标：发给好友、发到朋友圈、复制链接、生成海报',
    desc: '把内容传播出去的入口，分享渠道和分享出去后的样子都要设计。',
    prompt:
      '点击「分享」按钮弹出 Share Panel 分享面板：一排带文字的圆形图标，包括「微信 / 微博 / 复制链接 / 生成海报」，点击「复制链接」后提示「链接已复制」。',
    spec: [
      '支持哪些分享渠道，顺序如何',
      '分享出去的内容长什么样（标题、摘要、封面图）',
      '分享的链接是否带来源参数，便于统计',
      '被分享者未登录时打开看到什么'
    ],
    demo: `<div class="w-56 rounded-xl border bg-white p-3 text-center text-[11px] shadow">
        <div class="mb-2 text-xs font-medium text-slate-900">分享到</div>
        <div class="grid grid-cols-4 gap-1">
          ${[
            ['weixin', 'bg-emerald-500', '微信'],
            ['weibo', 'bg-rose-500', '微博'],
            ['link', 'bg-indigo-500', '复制链接'],
            ['picture-o', 'bg-amber-500', '生成海报']
          ]
            .map(function (s) {
              return `<button onclick="App.tip('已选择：${s[2]}')"><span class="mx-auto mb-1 flex h-9 w-9 items-center justify-center rounded-full ${s[1]} text-white"><i class="fa fa-${s[0]}"></i></span>${s[2]}</button>`
            })
            .join('')}
        </div>
      </div>`
  },
  {
    id: 'qrcode',
    cat: 'display',
    zh: '二维码',
    en: 'QR Code',
    alias: ['扫码登录', '扫一扫', '二维码卡片'],
    plain: '一个由黑白小方块组成的方形图案，拿手机扫一下就能登录、付款或打开页面',
    desc: '连接电脑和手机的桥梁。除了图案本身，过期、已扫描等状态也要设计。',
    prompt:
      '登录页提供 QR Code 扫码登录：居中显示二维码和「使用手机 App 扫码登录」提示；二维码 60 秒后过期，过期时叠加半透明遮罩和「已过期，点击刷新」；扫码成功后显示「请在手机上确认」。',
    spec: [
      '扫码后做什么（登录、支付、下载、加好友）',
      '有效期多长，过期后如何刷新',
      '各状态的展示：等待扫码、已扫码待确认、成功、失效',
      '无法扫码时的替代方式'
    ],
    demo: `<div class="text-center text-xs">
        <div class="relative mx-auto h-24 w-24 rounded-lg border bg-white p-1.5">
          <div class="grid h-full w-full grid-cols-9" style="grid-template-rows:repeat(9,1fr)">
            ${Array.apply(null, Array(81))
              .map(function (_, i) {
                return `<span class="qc" style="background:${(i * 7 + (i % 5) * 3) % 3 ? 'transparent' : '#0f172a'}"></span>`
              })
              .join('')}
          </div>
          <div class="qx absolute inset-0 flex hidden cursor-pointer flex-col items-center justify-center rounded-lg bg-white/90 text-slate-700" onclick="D.qr(this)"><i class="fa fa-refresh mb-1 text-lg"></i>已过期，点击刷新</div>
        </div>
        <button class="mt-2 text-indigo-600" onclick="D.tog(this,'.qx')">模拟过期</button>
        <p class="text-slate-400">示意图，不是真实二维码</p>
      </div>`
  },
  {
    id: 'watermark',
    cat: 'display',
    zh: '水印',
    en: 'Watermark',
    alias: ['页面水印', '防泄漏水印', '版权水印'],
    plain: '页面背景上铺满一层淡淡的、斜着的字，一般是你的名字或工号，截图也会带上',
    desc: '企业内部系统用来防止截图外泄、追溯来源；也用于标注版权。',
    prompt:
      '后台页面添加全屏 Watermark 水印：内容为当前用户的姓名和工号后四位，浅灰色、倾斜 20 度、平铺整个页面，不影响鼠标点击下方内容。',
    spec: [
      '水印内容（姓名、工号、时间）',
      '覆盖范围：全站还是仅敏感页面',
      '深浅程度（既能追溯又不影响阅读）',
      '导出、打印的文件是否也带水印'
    ],
    demo: `<div class="absolute inset-0 overflow-hidden bg-white p-3 text-xs">
        <b class="text-slate-900">内部资料 · 2026 年度规划</b>
        <p class="mt-1 text-slate-500">这里是一段敏感内容，背景上平铺着查看者的姓名，截图外传时可以追溯到人。</p>
        <button class="${G} mt-2" onclick="D.tog(this,'.wm')">显示 / 隐藏水印</button>
        <div class="wm pointer-events-none absolute -inset-10 flex -rotate-12 flex-wrap content-start gap-x-6 gap-y-5 text-sm text-slate-900/10">${'<span>王小明 8826</span>'.repeat(40)}</div>
      </div>`
  },
  {
    id: 'batchactions',
    cat: 'display',
    zh: '批量操作',
    en: 'Batch Actions',
    alias: ['多选操作', '批量处理', 'Bulk Actions'],
    plain: '在列表里勾选几条后，上方出现一条操作栏，写着「已选几项」和「删除、导出」',
    desc: '一次处理多条数据，是后台列表提升效率的关键功能。',
    prompt:
      '表格支持 Batch Actions 批量操作：每行首列为复选框，表头有全选框；勾选任意行后在列表上方出现操作栏，显示「已选 N 项」以及「导出」「删除」按钮，取消全部勾选后操作栏消失。',
    spec: [
      '支持哪些批量操作',
      '全选的范围：当前页还是全部数据',
      '部分数据不满足条件时如何处理（跳过并提示）',
      '批量操作的进度与结果反馈（成功几条、失败几条）'
    ],
    demo: `<div class="w-56 text-xs">
        <div class="ba invisible mb-1 flex items-center justify-between rounded-lg bg-indigo-600 px-3 py-1.5 text-white"><span>已选 <b class="bn">0</b> 项</span><span class="flex gap-3"><span class="cursor-pointer">导出</span><span class="cursor-pointer">删除</span></span></div>
        <ul class="divide-y rounded-lg border bg-white">
          <li class="bg-slate-50 px-3 py-1.5 text-slate-500"><label class="flex items-center gap-2"><input type="checkbox" class="bs accent-indigo-600" onchange="D.batch(this,true)">全选</label></li>
          ${['首页改版需求', '支付流程优化', '消息中心重构']
            .map(function (x) {
              return `<li class="px-3 py-1.5"><label class="flex cursor-pointer items-center gap-2"><input type="checkbox" class="bc accent-indigo-600" onchange="D.batch(this)">${x}</label></li>`
            })
            .join('')}
        </ul>
      </div>`
  },

  /* ---------------- 移动端与手势（补充） ---------------- */
  {
    id: 'appbar',
    cat: 'mobile',
    zh: '顶部导航栏',
    en: 'App Bar',
    alias: ['标题栏', 'Navigation Bar', '页面头部'],
    plain: '手机页面最上面那一条：左边是返回箭头，中间是页面标题，右边是「更多」或「分享」',
    desc: '告诉用户「我在哪」，并提供返回和当前页的主要操作。',
    prompt:
      '移动端页面顶部做一个 App Bar 顶部导航栏：左侧为返回箭头，中间居中显示页面标题（过长省略），右侧为分享图标按钮，栏本身固定在顶部不随内容滚动。',
    vs: '网页上放多个栏目链接的是 Navbar；App 底部切换一级页面的是 Tab Bar。',
    spec: [
      '左侧是返回、关闭还是菜单',
      '标题内容，过长时如何处理',
      '右侧放哪些操作（最多两三个）',
      '滚动时是否固定、是否变色或隐藏'
    ],
    demo: `<div class="absolute inset-0 bg-slate-50 text-xs">
        <div class="flex h-10 items-center justify-between border-b bg-white px-3">
          <button aria-label="返回" onclick="D.q(this,'.am').textContent=T('点了返回：回到上一页')"><i class="fa fa-angle-left text-xl"></i></button>
          <b class="text-sm text-slate-900">订单详情</b>
          <button aria-label="分享" onclick="D.q(this,'.am').textContent=T('点了分享：弹出分享面板')"><i class="fa fa-share-square-o text-base"></i></button>
        </div>
        <p class="am p-3 text-center text-slate-400">页面内容…</p>
      </div>`
  },
  {
    id: 'indexbar',
    cat: 'mobile',
    zh: '字母索引',
    en: 'Index Bar',
    alias: ['索引栏', '通讯录索引', 'A-Z 索引'],
    plain: '通讯录最右边那一竖排 A 到 Z 的小字母，点哪个字母就跳到那个字母开头的联系人',
    desc: '在很长的、按字母排序的列表里快速定位：联系人、城市、品牌。',
    prompt:
      '城市选择页使用 Index Bar 字母索引：列表按首字母分组并带分组标题，右侧固定一列字母，点击或滑动到某个字母时列表滚动到对应分组，并在屏幕中央短暂显示该字母。',
    vs: '桌面端长页面的目录是 Anchor Navigation。',
    spec: [
      '按什么分组（首字母、拼音）',
      '没有内容的字母是否显示',
      '是否有「热门」「最近」等特殊分组',
      '滑动选择时的反馈（放大提示、震动）'
    ],
    demo: `<div class="absolute inset-0 flex bg-white text-xs">
        <div class="as h-full flex-1 overflow-y-auto">
          ${[
            ['B', ['北京', '保定', '包头']],
            ['C', ['成都', '长沙', '重庆']],
            ['S', ['上海', '深圳', '苏州', '沈阳']]
          ]
            .map(function (g) {
              return `<div><div class="bg-slate-100 px-3 py-0.5 text-slate-500">${g[0]}</div>${g[1]
                .map(function (c) {
                  return `<div class="border-b px-3 py-2">${c}</div>`
                })
                .join('')}</div>`
            })
            .join('')}
        </div>
        <nav class="flex w-6 flex-col items-center justify-center gap-2 text-[10px] font-bold text-slate-400">
          <button class="text-indigo-600" onclick="D.anchor(this,0)">B</button><button onclick="D.anchor(this,1)">C</button><button onclick="D.anchor(this,2)">S</button>
        </nav>
      </div>`
  },
  {
    id: 'safearea',
    cat: 'mobile',
    zh: '安全区',
    en: 'Safe Area',
    alias: ['刘海屏适配', '安全区域', '底部横条'],
    plain: '手机屏幕上被刘海、圆角和底部小横条占掉的地方不能放按钮，剩下能放心用的区域就叫安全区',
    desc: '全面屏手机的必备适配。按钮贴底时没留出安全区，就会被小横条挡住、很难点。',
    prompt:
      '移动端页面适配 Safe Area 安全区：顶部导航栏避开状态栏和刘海，底部的固定按钮栏在按钮下方额外留出与设备底部安全区等高的空白，背景色延伸到屏幕边缘。',
    spec: [
      '哪些元素贴近屏幕边缘（顶部栏、底部按钮、悬浮按钮）',
      '背景是否延伸到安全区外，内容是否留在安全区内',
      '横屏时两侧的安全区',
      '在无刘海的旧机型上的表现'
    ],
    demo: `<div class="flex items-center gap-4 text-xs">
        <div class="relative h-40 w-20 overflow-hidden rounded-2xl border-4 border-slate-800 bg-white">
          <div class="sf flex h-5 items-start justify-center bg-rose-200"><span class="h-2.5 w-8 rounded-b-lg bg-slate-800"></span></div>
          <div class="flex h-[104px] items-center justify-center bg-emerald-50 text-center text-emerald-700">安全区<br>内容放这里</div>
          <div class="sf flex h-5 items-center justify-center bg-rose-200"><span class="h-1 w-8 rounded-full bg-slate-800"></span></div>
        </div>
        <div class="w-24 space-y-2 text-slate-500"><p><span class="inline-block h-2 w-2 bg-rose-300"></span> 刘海与底部横条区域，不要放按钮</p><button class="text-indigo-600" onclick="D.qa(this,'.sf').forEach(function(x){x.classList.toggle('bg-rose-200')})">隐藏 / 显示标注</button></div>
      </div>`
  },

  /* ---------------- 引导与系统状态（补充） ---------------- */
  {
    id: 'unsaved',
    cat: 'system',
    zh: '离开确认',
    en: 'Unsaved Changes',
    alias: ['未保存提示', '离开提醒', '退出挽留'],
    plain: '表单填了一半想关掉页面时，弹出来问你「内容还没保存，确定要离开吗」',
    desc: '防止用户因误触返回或关闭而丢失已填写的内容。',
    prompt:
      '表单页添加 Unsaved Changes 离开确认：当用户已修改但未保存时，点击返回、切换页面或关闭标签页都会弹出确认框「有未保存的修改，确定离开吗？」，提供「继续编辑」和「放弃修改」。',
    vs: '能做 Autosave 的地方优先自动保存，就不需要这个打断了。',
    spec: [
      '哪些页面需要（长表单、编辑器）',
      '怎样算「有修改」（改过又改回去算不算）',
      '拦截哪些离开方式（返回、关闭标签页、点其他菜单）',
      '确认框的文案与按钮'
    ],
    demo: `<div class="w-52 text-center text-xs">
        <input class="ui ${I} !text-xs" placeholder="先随便输点内容" aria-label="表单内容">
        <button class="${G} mt-2" onclick="D.leave(this)">← 离开此页面</button>
        <p class="um mt-1 h-4 text-slate-400"></p>
      </div>
      <div class="ul absolute inset-0 flex hidden items-center justify-center bg-black/40">
        <div class="w-48 rounded-xl bg-white p-3 text-xs shadow-xl"><b class="text-slate-900">有未保存的修改</b><p class="my-2 text-slate-500">现在离开，已填写的内容会丢失。</p><div class="flex justify-end gap-2"><button class="rounded border px-2 py-1" onclick="D.tog(this,'.ul');D.q(this,'.ui').value=''">放弃修改</button><button class="rounded bg-indigo-600 px-2 py-1 text-white" onclick="D.tog(this,'.ul')">继续编辑</button></div></div>
      </div>`
  },
  {
    id: 'sessiontimeout',
    cat: 'system',
    zh: '登录过期',
    en: 'Session Timeout',
    alias: ['登录失效', '会话过期', '重新登录'],
    plain: '放着页面很久没动，再点的时候弹出「登录已过期，请重新登录」',
    desc: '出于安全，登录状态会在一段时间后失效；处理不好就会让用户丢掉正在做的事。',
    prompt:
      '处理 Session Timeout 登录过期：登录状态失效后用户再次操作时，弹出不可关闭的对话框「登录已过期，请重新登录」，点击按钮跳转登录页，登录成功后回到原页面并尽量保留未提交的内容。',
    spec: [
      '多久不操作算过期，过期前是否提前提醒',
      '过期时的提示方式（弹窗还是直接跳转）',
      '重新登录后是否回到原来的页面',
      '用户未保存的内容如何处理'
    ],
    demo: `<div class="text-center text-xs"><p class="mb-3 text-slate-400">页面内容…</p><button class="${G}" onclick="D.tog(this,'.so')">模拟登录过期</button></div>
      <div class="so absolute inset-0 flex hidden items-center justify-center bg-black/40">
        <div class="w-48 rounded-xl bg-white p-4 text-center text-xs shadow-xl"><i class="fa fa-clock-o text-2xl text-amber-500"></i><div class="my-1 font-semibold text-slate-900">登录已过期</div><p class="mb-3 text-slate-500">为了账号安全，请重新登录。</p><button class="${B} w-full" onclick="D.tog(this,'.so')">重新登录</button></div>
      </div>`
  },
  {
    id: 'retry',
    cat: 'system',
    zh: '失败重试',
    en: 'Error and Retry',
    alias: ['加载失败', '重新加载', '错误状态'],
    plain: '内容没加载出来时，那块地方显示「加载失败」，下面有个「重试」按钮',
    desc: '网络请求总会失败，关键是出错的那一块自己说明情况并给出重试，而不是整页白屏。',
    prompt:
      '列表加载失败时在列表区域内显示 Error and Retry 错误状态：一个警示图标、「加载失败，请检查网络」文案和「重试」按钮；点击重试后显示加载动画并重新请求，成功后展示内容。',
    vs: '整个页面打不开用 Error Page；没有数据但请求成功用 Empty State。',
    spec: [
      '哪些区块可能加载失败，各自的错误文案',
      '是否自动重试，重试几次',
      '失败时是否保留上一次的旧数据',
      '多次失败后的引导（联系客服、稍后再试）'
    ],
    demo: `<div class="text-center text-xs">
        <div class="re"><i class="fa fa-exclamation-circle text-3xl text-rose-400"></i><p class="my-2 text-slate-500">加载失败，请检查网络</p><button class="${G}" onclick="D.retry(this)">重试</button></div>
        <div class="rs hidden text-slate-500"><i class="fa fa-spinner fa-spin text-2xl text-indigo-600"></i><p class="mt-2">正在重新加载…</p></div>
        <div class="rk hidden"><i class="fa fa-check-circle text-3xl text-emerald-500"></i><p class="my-2 text-slate-500">加载成功，内容出来了</p><button class="text-indigo-600" onclick="D.retry(this)">再演示一次</button></div>
      </div>`
  },
  {
    id: 'copyclip',
    cat: 'system',
    zh: '一键复制',
    en: 'Copy to Clipboard',
    alias: ['复制按钮', '点击复制', '复制链接'],
    plain: '邀请码、链接旁边有个「复制」按钮，点一下就复制好了，按钮会变成「已复制」',
    desc: '省去手动选中再复制的麻烦，订单号、链接、代码旁边都该有。',
    prompt:
      '邀请链接右侧放 Copy to Clipboard 一键复制按钮：点击后将链接写入剪贴板，按钮文字变为「已复制」并显示对勾，1.5 秒后恢复原样。',
    spec: [
      '哪些内容值得提供复制（编号、链接、代码、地址）',
      '复制成功的反馈形式（按钮变化或 Toast）',
      '复制的内容是否带额外文案（如分享语）',
      '复制失败时的提示'
    ],
    demo: `<div class="w-56 text-xs">
        <div class="mb-1 text-slate-400">你的邀请链接</div>
        <div class="flex overflow-hidden rounded-lg border bg-white"><span class="cc2 flex-1 truncate px-3 py-1.5 font-mono text-slate-600">example.com/invite/8826</span><button class="shrink-0 bg-indigo-600 px-3 text-white" onclick="D.copied(this)">复制</button></div>
      </div>`
  },
  {
    id: 'splash',
    cat: 'system',
    zh: '开屏页',
    en: 'Splash Screen',
    alias: ['启动页', '闪屏', '开屏广告'],
    plain: '打开 App 的头几秒先看到的那一整屏：一个 Logo 或一张广告，右上角有「跳过 3」',
    desc: '用启动的等待时间展示品牌或广告。停留太久、跳过按钮太小都会招人烦。',
    prompt:
      'App 启动时显示 Splash Screen 开屏页：全屏展示品牌 Logo 和标语，右上角有带倒计时的「跳过」按钮，3 秒后或点击跳过后淡出并进入首页。',
    spec: [
      '展示品牌还是广告，内容由谁配置',
      '停留时长，能否跳过',
      '多久展示一次（每次启动、每天一次）',
      '点击内容区域是否跳转'
    ],
    demo: `<div class="absolute inset-0 flex items-center justify-center bg-white text-xs">
        <div class="text-center"><p class="mb-2 text-slate-400">这里是 App 首页</p><button class="${G}" onclick="D.splash(this)">重新打开 App</button></div>
        <div class="sp absolute inset-0 flex flex-col items-center justify-center bg-indigo-600 text-white">
          <button class="absolute right-3 top-3 rounded-full bg-black/20 px-2 py-0.5" onclick="D.splash(this,true)">跳过 <span class="sc">3</span></button>
          <i class="fa fa-book text-4xl"></i><div class="mt-2 text-sm font-semibold">交互术语图鉴</div><div class="text-white/70">说得出名字，才写得清需求</div>
        </div>
      </div>`
  },
  {
    id: 'updateprompt',
    cat: 'system',
    zh: '版本更新提示',
    en: 'Update Prompt',
    alias: ['升级弹窗', '新版本提醒', '强制更新'],
    plain: '打开 App 时弹出「发现新版本」，列着更新了什么，有「立即更新」和「稍后」',
    desc: '引导用户升级。分为可跳过的普通更新，和不更新就不能用的强制更新。',
    prompt:
      '检测到新版本时弹出 Update Prompt 版本更新提示：显示版本号和 2–3 条更新内容，提供「立即更新」主按钮和「稍后再说」次按钮；强制更新时不显示「稍后再说」且弹窗不可关闭。',
    vs: '介绍新功能怎么用的是 Onboarding Tour 或 New Badge；这里是让用户升级软件本身。',
    spec: [
      '普通更新还是强制更新，判断规则是什么',
      '更新说明的文案（写用户能感知的变化）',
      '用户选择「稍后」后多久再次提醒',
      '网页端是否需要「有新版本，刷新页面」的提示'
    ],
    demo: `<div class="up w-48 rounded-xl bg-white p-4 text-xs shadow-xl">
        <div class="mb-1 flex items-center gap-2"><i class="fa fa-rocket text-indigo-600"></i><b class="text-slate-900">发现新版本 2.1</b></div>
        <ul class="mb-3 list-disc pl-4 text-slate-500"><li>新增 AI 生成原型</li><li>优化了打开速度</li></ul>
        <div class="flex gap-2"><button class="flex-1 rounded border py-1" onclick="D.tog(this,'.up');D.tog(this,'.ua')">稍后再说</button><button class="flex-1 rounded bg-indigo-600 py-1 text-white" onclick="D.tog(this,'.up');D.tog(this,'.ua')">立即更新</button></div>
      </div>
      <button class="ua hidden text-xs text-indigo-600" onclick="D.tog(this,'.up');D.tog(this,'.ua')">再次显示更新提示</button>`
  }
)

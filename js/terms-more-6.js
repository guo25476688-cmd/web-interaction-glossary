/* ============================================================
 * 术语扩充（五）：概念与方法
 * 这些词不是界面上的某个控件，而是工作中天天会听到的概念。
 * 实例区放的是示意图或小实验；
 * 「对 AI 说」是如何让 AI 帮你做这件事，「写进 PRD」是使用时要想清楚的问题。
 * ============================================================ */

/* ---------- 本文件实例用到的小工具 ---------- */
// 一排切换按钮，点哪个就显示第几个 .pn 面板
function pickRow(labels) {
  return `<div class="mb-2 inline-flex rounded-lg bg-slate-200 p-0.5 text-xs">${labels
    .map(function (l, i) {
      return `<button class="rounded-md px-2.5 py-0.5 ${i ? '' : 'bg-white shadow'}" onclick="D.panel(this,${i})">${l}</button>`
    })
    .join('')}</div>`
}
// 只切换面板，不改按钮样式（原型示例里用来模拟页面跳转）
D.show = function (el, i) {
  D.qa(el, '.pn').forEach(function (p, j) {
    p.classList.toggle('hidden', j !== i)
  })
}
D.panel = function (el, i) {
  D.choose(el, 'bg-white shadow')
  D.show(el, i)
}
D.bp = function (el) {
  var w = +el.value
  var box = D.q(el, '.bb')
  var cols = w < 768 ? 1 : w < 1024 ? 2 : 3
  box.style.width = (w / 1440) * 100 + '%'
  box.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)'
  D.q(el, '.bl').textContent =
    w + 'px · ' + T(w < 768 ? '手机：1 列' : w < 1024 ? '平板：2 列' : '桌面：3 列')
}
D.track = function (el, name) {
  var log = D.q(el, '.tk')
  var line = document.createElement('div')
  line.textContent =
    new Date().toTimeString().slice(0, 8) + '  click  ' + name
  log.prepend(line)
  if (log.children.length > 4) log.lastChild.remove()
}
D.gray = function (el) {
  var p = +el.value
  D.qa(el, '.gu').forEach(function (u, i) {
    u.classList.toggle('text-indigo-600', i < p / 5)
    u.classList.toggle('text-slate-300', i >= p / 5)
  })
  D.q(el, '.gl').textContent = p + '%'
}
D.api = function (el) {
  var out = D.q(el, '.ao')
  el.disabled = true
  out.textContent = T('→ 请求：GET /orders/1001\n  等待服务器响应…')
  setTimeout(function () {
    out.textContent = T('→ 请求：GET /orders/1001\n← 响应：{ "状态": "已发货", "金额": 79 }')
    el.disabled = false
  }, 900)
}

TERMS.push(
  /* ---------------- 设计产出物 ---------------- */
  {
    id: 'wireframe',
    cat: 'concept',
    zh: '线框图',
    en: 'Wireframe',
    alias: ['线稿', '草图', '低保真原型'],
    plain: '只用灰色方块和线条画出页面上「哪里放什么」的草图，不管颜色和好不好看',
    desc: '用最低成本确认页面结构和信息主次。画得越糙，大家越敢提意见。',
    prompt:
      '帮我画一个「订单列表页」的线框图（Wireframe）：只用灰色方块、线条和文字标注表达布局与内容层级，不要颜色和图片，图片位置用带叉的方框表示，并标出每个区块的名称。',
    vs: '线框图只管结构；高保真稿才定颜色、字体和细节。',
    spec: [
      '这一稿要确认的是什么（结构、流程，而不是样式）',
      '每个区块放什么内容、优先级如何',
      '是否覆盖了主要页面和关键状态'
    ],
    demo: `<div class="w-48 space-y-1.5 rounded-lg border-2 border-slate-400 bg-white p-2">
        <div class="h-3 w-16 bg-slate-400"></div>
        <div class="flex h-14 items-center justify-center border border-slate-400 text-slate-400" style="background:linear-gradient(to top right,transparent 49%,#94a3b8 50%,transparent 51%),linear-gradient(to bottom right,transparent 49%,#94a3b8 50%,transparent 51%)"></div>
        <div class="h-2 bg-slate-300"></div><div class="h-2 w-4/5 bg-slate-300"></div>
        <div class="ml-auto h-5 w-14 border border-slate-400 text-center text-[10px] leading-5 text-slate-500">按钮</div>
      </div>`
  },
  {
    id: 'fidelity',
    cat: 'concept',
    zh: '保真度',
    en: 'Fidelity',
    alias: ['低保真', '高保真', 'Lo-fi / Hi-fi'],
    plain: '设计稿做得有多「像真的」：低保真是灰色草图，高保真是和最终上线几乎一模一样',
    desc: '保真度越高越费时间。早期讨论方向用低保真，定稿和交付开发用高保真。',
    prompt:
      '先给我这个页面的低保真版本（灰色方块加文字标注，用来确认结构），确认后再做高保真版本（真实的文案、配色、图标和间距）。',
    spec: [
      '当前阶段需要哪种保真度（别在方向没定时就做高保真）',
      '评审时提醒大家看什么（低保真看结构，高保真看细节）',
      '高保真稿是否使用了真实的文案和数据'
    ],
    demo: `<div class="text-center">${pickRow(['低保真', '高保真'])}
        <div class="pn mx-auto w-44 space-y-1.5 rounded-lg border-2 border-slate-400 bg-white p-2"><div class="h-10 bg-slate-300"></div><div class="h-2 bg-slate-300"></div><div class="h-2 w-2/3 bg-slate-300"></div><div class="h-5 border border-slate-400 text-[10px] leading-5 text-slate-500">按钮</div></div>
        <div class="pn mx-auto hidden w-44 overflow-hidden rounded-xl bg-white text-left text-xs shadow"><div class="h-10 bg-gradient-to-br from-indigo-400 to-fuchsia-400"></div><div class="p-2"><b class="text-slate-900">AI 编程入门</b><p class="mb-1 text-[10px] text-slate-500">零基础也能学会</p><div class="rounded bg-indigo-600 py-0.5 text-center text-white">立即报名</div></div></div>
      </div>`
  },
  {
    id: 'prototype',
    cat: 'concept',
    zh: '原型',
    en: 'Prototype',
    alias: ['可交互原型', '可点击原型', 'Demo'],
    plain: '能点、能跳转的「假产品」：看着像真的，点按钮也会换页面，但背后没有真实功能',
    desc: '用来在开发之前验证流程是否走得通，也是和团队沟通最直观的方式。',
    prompt:
      '帮我做一个可点击的原型（Prototype）：包含「列表页」和「详情页」两个页面，点击列表中的任意一项进入详情页，详情页左上角的返回按钮回到列表页，数据用写死的示例数据即可。',
    vs: '线框图和设计稿是静态的图；原型是能操作的。',
    spec: [
      '原型要验证的是哪条流程',
      '需要做到多真（能点通主流程即可，还是要像真的）',
      '给谁看、用来做什么（内部评审、用户测试、给老板演示）'
    ],
    demo: `<div class="w-44 overflow-hidden rounded-xl border bg-white text-xs">
        <div class="pn"><div class="border-b px-2 py-1 font-semibold text-slate-900">订单列表</div><ul class="divide-y"><li class="flex cursor-pointer justify-between px-2 py-1.5 hover:bg-indigo-50" onclick="D.show(this,1)">订单 A-001<i class="fa fa-angle-right"></i></li><li class="flex cursor-pointer justify-between px-2 py-1.5 hover:bg-indigo-50" onclick="D.show(this,1)">订单 A-002<i class="fa fa-angle-right"></i></li></ul><p class="px-2 py-1 text-[10px] text-slate-400">点一条订单试试</p></div>
        <div class="pn hidden"><div class="border-b px-2 py-1 font-semibold text-slate-900"><button class="mr-1 text-indigo-600" onclick="D.show(this,0)"><i class="fa fa-angle-left"></i> 返回</button>订单详情</div><p class="p-2 text-slate-500">金额 ¥79 · 已发货<br>这是一个写死的假页面。</p></div>
      </div>`
  },
  {
    id: 'userflow',
    cat: 'concept',
    zh: '用户流程图',
    en: 'User Flow',
    alias: ['流程图', '任务流程', 'Flowchart'],
    plain: '用方框和箭头画出用户完成一件事要走的每一步，遇到分岔的地方用菱形表示',
    desc: '把「用户怎么从 A 走到 B」画清楚，分支和异常情况在这一步最容易被发现。',
    prompt:
      '帮我梳理「用户下单」的用户流程图（User Flow）：从进入商品页开始，到支付成功结束，用方框表示页面或操作、菱形表示判断（如是否登录、库存是否充足），并画出每个分支和异常情况的走向。',
    vs: '信息架构讲的是「内容怎么组织」；用户流程讲的是「一件事怎么一步步做完」。',
    spec: [
      '流程的起点和终点是什么',
      '有哪些判断分支（登录与否、成功与否）',
      '每个异常分支最后去哪',
      '哪一步最可能让用户放弃'
    ],
    demo: `<div class="flex flex-col items-center text-[11px]">
        <div class="rounded-full border-2 border-slate-400 bg-white px-3">点击购买</div><i class="fa fa-long-arrow-down text-slate-400"></i>
        <div class="flex items-center gap-1"><div class="flex h-9 w-9 rotate-45 items-center justify-center border-2 border-amber-400 bg-amber-50"><span class="-rotate-45 whitespace-nowrap text-[10px]">已登录?</span></div><span class="ml-3 text-slate-400">否 →</span><div class="rounded border-2 border-slate-400 bg-white px-2">登录页</div></div>
        <span class="text-slate-400">是 ↓</span>
        <div class="rounded border-2 border-slate-400 bg-white px-3">确认订单</div><i class="fa fa-long-arrow-down text-slate-400"></i>
        <div class="rounded-full border-2 border-emerald-500 bg-emerald-50 px-3">支付成功</div>
      </div>`
  },
  {
    id: 'ia',
    cat: 'concept',
    zh: '信息架构',
    en: 'Information Architecture',
    alias: ['IA', '站点地图', '产品结构图'],
    plain: '一个产品里所有页面和功能是怎么分门别类、一层套一层组织起来的，像一棵倒过来的树',
    desc: '决定用户能不能找到东西。导航怎么设计，是信息架构的直接体现。',
    prompt:
      '帮我规划一个在线课程网站的信息架构（Information Architecture）：用树状结构列出一级栏目、二级页面和主要功能，说明每个栏目放什么内容，并指出哪些应放在主导航、哪些放在个人中心。',
    vs: '用户流程是「一条路怎么走」；信息架构是「整张地图怎么画」。',
    spec: [
      '有哪些内容和功能，按什么逻辑分类',
      '层级有多深（一般不超过三层）',
      '分类的叫法用户是否看得懂',
      '同一内容是否需要多个入口'
    ],
    demo: `<div class="text-center text-[11px]">
        <div class="mx-auto w-fit rounded bg-indigo-600 px-3 py-0.5 text-white">首页</div>
        <div class="mx-auto h-2 w-px bg-slate-400"></div><div class="mx-auto h-px w-36 bg-slate-400"></div>
        <div class="flex justify-center gap-2">
          ${[
            ['课程', ['分类', '详情']],
            ['社区', ['问答', '动态']],
            ['我的', ['订单', '设置']]
          ]
            .map(function (n) {
              return `<div><div class="mx-auto h-2 w-px bg-slate-400"></div><div class="rounded border-2 border-indigo-400 bg-white px-2">${n[0]}</div><div class="mx-auto h-2 w-px bg-slate-400"></div><div class="space-y-1">${n[1]
                .map(function (c) {
                  return `<div class="rounded border bg-white px-2 text-slate-500">${c}</div>`
                })
                .join('')}</div></div>`
            })
            .join('')}
        </div>
      </div>`
  },
  {
    id: 'persona',
    cat: 'concept',
    zh: '用户画像',
    en: 'Persona',
    alias: ['人物角色', '典型用户', 'User Persona'],
    plain: '给目标用户编一个有名有姓的代表人物：多大、做什么、想要什么、烦什么',
    desc: '让团队讨论时有一个具体的人可以对照，而不是各自想象不同的「用户」。',
    prompt:
      '基于以下调研信息，帮我整理 2 个用户画像（Persona）：每个包含姓名、年龄、职业、使用场景、核心目标、主要痛点和一句代表性的话。调研信息：【粘贴访谈或问卷结论】',
    vs: '数据平台里按标签圈出来的「用户画像」是统计意义上的人群；这里说的是为设计服务的虚构典型人物。',
    spec: [
      '画像是否来自真实调研，而不是凭空想象',
      '每个画像的目标和痛点是什么',
      '这次的需求主要服务哪一个画像'
    ],
    demo: `<div class="w-52 rounded-xl border bg-white p-3 text-xs">
        <div class="mb-2 flex items-center gap-2"><span class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-base text-white">林</span><div><b class="text-slate-900">林小满 · 26 岁</b><div class="text-[10px] text-slate-400">入行一年的产品经理</div></div></div>
        <p><b class="text-emerald-600">目标</b> 把需求讲清楚，少被开发追问</p>
        <p><b class="text-rose-500">痛点</b> 见过那个效果，但说不出它叫什么</p>
        <p class="mt-1 border-l-2 pl-2 italic text-slate-400">“就是那个…点一下会弹出来的东西”</p>
      </div>`
  },
  {
    id: 'userstory',
    cat: 'concept',
    zh: '用户故事',
    en: 'User Story',
    alias: ['需求描述', '故事卡', '验收标准'],
    plain: '用一句固定格式的话写需求：「作为谁，我想要做什么，这样我就能得到什么」',
    desc: '逼着自己从用户的角度说清楚「为谁做、做什么、为什么」，后面再附上验收标准。',
    prompt:
      '把下面这个需求改写成用户故事（User Story），格式为「作为【角色】，我想要【功能】，以便【价值】」，并补充 3–5 条可验证的验收标准。需求：【粘贴你的需求】',
    vs: 'PRD 是完整的需求文档；用户故事是其中一条条最小的需求单元。',
    spec: [
      '角色是否具体（不要写「作为用户」）',
      '「以便」后面的价值是否真实',
      '验收标准是否可以被测试验证',
      '这条故事是否小到一个迭代能做完'
    ],
    demo: `<div class="w-56 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-3 text-xs leading-relaxed">
        <p>作为<b class="text-indigo-600">经常出差的销售</b>，</p>
        <p>我想要<b class="text-indigo-600">用手机拍照上传发票</b>，</p>
        <p>以便<b class="text-indigo-600">不用回公司也能提交报销</b>。</p>
        <div class="mt-2 border-t border-amber-200 pt-1 text-[10px] text-slate-500"><b>验收标准</b><br>☑ 支持拍照和相册选择<br>☑ 自动识别金额并可修改</div>
      </div>`
  },
  {
    id: 'journeymap',
    cat: 'concept',
    zh: '用户旅程图',
    en: 'Journey Map',
    alias: ['体验地图', '用户旅程', 'Customer Journey'],
    plain: '把用户从知道你到用完你的全过程分成几个阶段，画出每个阶段他在做什么、心情是好是坏',
    desc: '用来找出体验的低谷在哪，那里往往就是最值得做的需求。',
    prompt:
      '帮我画一张「用户第一次在我们平台买课」的用户旅程图（Journey Map）：按「了解 / 比较 / 下单 / 学习 / 复购」分阶段，每个阶段列出用户行为、接触点、情绪高低和痛点，并标出最大的机会点。',
    vs: '用户流程图画的是产品内的操作步骤；旅程图还包括产品外的经历和用户的情绪。',
    spec: [
      '画的是哪类用户、完成哪件事的旅程',
      '每个阶段的行为、接触点、想法与情绪',
      '情绪的最低点在哪，原因是什么',
      '对应的改进机会'
    ],
    demo: `<div class="w-56 text-center text-[11px]">
        <div class="grid grid-cols-4 gap-1">
          ${[
            ['了解', '😀', 'mt-1'],
            ['比较', '😐', 'mt-4'],
            ['下单', '😣', 'mt-8'],
            ['学习', '😊', 'mt-2']
          ]
            .map(function (s) {
              return `<div><div class="rounded bg-indigo-100 py-0.5 text-indigo-700">${s[0]}</div><div class="${s[2]} text-xl">${s[1]}</div></div>`
            })
            .join('')}
        </div>
        <p class="mt-2 rounded bg-rose-50 px-2 py-1 text-rose-600">低谷：下单时要填的信息太多 → 机会点</p>
      </div>`
  },
  {
    id: 'mvp',
    cat: 'concept',
    zh: '最小可行产品',
    en: 'MVP',
    alias: ['Minimum Viable Product', '最小版本', '第一版'],
    plain: '先只做最核心的那一点点功能就上线，看看有没有人要，再决定要不要接着做大',
    desc: '用最少的投入验证最关键的假设。难点不在「做什么」，而在「忍住先不做什么」。',
    prompt:
      '这是我的产品想法：【描述】。帮我定义它的 MVP：指出要验证的核心假设是什么，列出第一版必须有的功能和可以暂缓的功能，并说明用什么数据判断假设是否成立。',
    spec: [
      '这一版要验证的假设是什么',
      '哪些功能是验证假设所必需的，其余一律暂缓',
      '用什么指标判断成败',
      '砍掉的功能里，有没有会让核心流程走不通的'
    ],
    demo: `<div class="w-52 text-xs">
        <div class="mb-1 text-slate-400">一个记账 App 的第一版</div>
        <ul class="space-y-1">
          <li class="flex justify-between rounded bg-white px-2 py-1">记一笔<span class="rounded bg-emerald-100 px-1 text-emerald-700">必须有</span></li>
          <li class="flex justify-between rounded bg-white px-2 py-1">看本月合计<span class="rounded bg-emerald-100 px-1 text-emerald-700">必须有</span></li>
          <li class="flex justify-between rounded bg-white px-2 py-1 text-slate-400 line-through">多人共享账本<span class="rounded bg-slate-200 px-1 no-underline">以后再说</span></li>
          <li class="flex justify-between rounded bg-white px-2 py-1 text-slate-400 line-through">自动同步银行卡<span class="rounded bg-slate-200 px-1">以后再说</span></li>
        </ul>
      </div>`
  },

  /* ---------------- 设计基础 ---------------- */
  {
    id: 'designsystem',
    cat: 'concept',
    zh: '设计系统',
    en: 'Design System',
    alias: ['组件库', '设计规范', 'UI Kit'],
    plain: '团队统一用的一套「零件箱」：规定好颜色、字号、按钮长什么样，大家都从里面拿，不各画各的',
    desc: '让产品各处长得一致，也让设计和开发不用重复造轮子。写需求时优先用已有组件。',
    prompt:
      '帮我为这个项目定义一套简单的设计系统（Design System）：包含主色与辅助色、字号层级、间距规则，以及按钮、输入框、卡片三种基础组件在各状态下的样式，并用这套规范重做当前页面。',
    vs: '组件库是设计系统里「可直接用的零件」那一部分；设计系统还包括规范和使用原则。',
    spec: [
      '需求里用到的控件，现有组件库里是否已经有',
      '如果要新做一个组件，理由是什么',
      '新组件是否考虑了复用，而不是只为这一个页面'
    ],
    demo: `<div class="w-56 space-y-2 text-[11px]">
        <div><span class="text-slate-400">颜色</span><div class="mt-0.5 flex gap-1"><span class="h-5 w-5 rounded bg-indigo-600"></span><span class="h-5 w-5 rounded bg-slate-900"></span><span class="h-5 w-5 rounded bg-emerald-500"></span><span class="h-5 w-5 rounded bg-rose-500"></span><span class="h-5 w-5 rounded border bg-white"></span></div></div>
        <div><span class="text-slate-400">字号</span><div class="flex items-baseline gap-2 text-slate-900"><b class="text-lg">标题</b><span class="text-sm">正文</span><span class="text-[10px]">辅助</span></div></div>
        <div><span class="text-slate-400">组件</span><div class="mt-0.5 flex items-center gap-1"><span class="rounded bg-indigo-600 px-2 py-0.5 text-white">按钮</span><span class="rounded border bg-white px-2 py-0.5 text-slate-400">输入框</span><span class="rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-700">标签</span></div></div>
      </div>`
  },
  {
    id: 'breakpoint',
    cat: 'concept',
    zh: '断点',
    en: 'Breakpoint',
    alias: ['响应式断点', '屏幕尺寸', '栅格断点'],
    plain: '事先约定的几个屏幕宽度，屏幕窄到某个数就换一种排版，比如小于 768 就算手机',
    desc: '响应式布局的「分界线」。和开发沟通适配时，说断点比说「手机上」更准确。',
    prompt:
      '这个页面按三个断点（Breakpoint）适配：宽度小于 768px 为手机，卡片 1 列、导航收进汉堡菜单；768–1023px 为平板，卡片 2 列；1024px 及以上为桌面，卡片 3 列并显示完整导航。',
    spec: [
      '项目用哪几个断点（先问开发，通常已有约定）',
      '每个断点下布局怎么变（列数、显示与隐藏、导航形式）',
      '设计稿至少要出哪几个宽度'
    ],
    demo: `<div class="w-full px-3 text-xs">
        <input type="range" min="360" max="1440" step="10" value="1440" class="w-full accent-indigo-600" aria-label="屏幕宽度" oninput="D.bp(this)">
        <div class="bl mb-1 text-center font-medium text-slate-900">1440px · 桌面：3 列</div>
        <div class="bb mx-auto grid gap-1 rounded border border-indigo-300 p-1" style="width:100%;grid-template-columns:repeat(3,1fr)"><div class="h-5 rounded bg-indigo-300"></div><div class="h-5 rounded bg-indigo-300"></div><div class="h-5 rounded bg-indigo-300"></div></div>
        <div class="mt-1 flex justify-between text-[10px] text-slate-400"><span>手机 &lt;768</span><span>平板 768–1023</span><span>桌面 ≥1024</span></div>
      </div>`
  },
  {
    id: 'grid',
    cat: 'concept',
    zh: '栅格系统',
    en: 'Grid System',
    alias: ['网格', '12 栏栅格', '栅格布局'],
    plain: '把页面宽度等分成 12 条看不见的竖栏，所有内容都对齐到这些栏上，页面才显得整齐',
    desc: '设计和开发共用的对齐规则。说「这块占 8 栏、那块占 4 栏」双方都听得懂。',
    prompt:
      '页面使用 12 栏栅格系统（Grid System）：内容区最大宽度 1200px，栏间距 24px；主内容占 8 栏、侧边栏占 4 栏；平板下各占 12 栏上下堆叠。',
    spec: [
      '项目用几栏栅格、栏间距多少（通常已有约定）',
      '各区块各占几栏',
      '不同断点下占栏数如何变化'
    ],
    demo: `<div class="w-56 text-xs">
        <div class="relative h-24">
          <div class="gg absolute inset-0 grid grid-cols-12 gap-1">${'<div class="bg-rose-200/60"></div>'.repeat(12)}</div>
          <div class="relative grid h-full grid-cols-12 gap-1 py-2"><div class="col-span-8 flex items-center justify-center rounded bg-indigo-500/80 text-white">主内容 8 栏</div><div class="col-span-4 flex items-center justify-center rounded bg-slate-500/80 text-white">侧栏 4 栏</div></div>
        </div>
        <button class="mt-2 text-indigo-600" onclick="D.tog(this,'.gg','invisible')">显示 / 隐藏栅格线</button>
      </div>`
  },
  {
    id: 'hierarchy',
    cat: 'concept',
    zh: '视觉层级',
    en: 'Visual Hierarchy',
    alias: ['信息层级', '主次关系', '视觉权重'],
    plain: '让重要的东西更大更醒目、次要的更小更淡，这样人一眼就知道该先看哪儿',
    desc: '「没有审美」的页面，多半不是配色问题，而是所有东西一样大、一样重。',
    prompt:
      '重新调整这个卡片的视觉层级（Visual Hierarchy）：标题最大最粗，价格用强调色突出，说明文字缩小并改为灰色，只保留一个实心主按钮，其余操作弱化为文字链接。',
    spec: [
      '这个页面上最重要的一条信息是什么',
      '第二、第三重要的是什么',
      '主按钮是否只有一个',
      '评审时眯起眼睛看，最先看到的是不是最重要的那个'
    ],
    demo: `<div class="text-center">${pickRow(['没有层级', '有层级'])}
        <div class="pn mx-auto w-44 rounded-lg border bg-white p-2 text-left text-xs text-slate-700"><p>AI 编程入门课</p><p>零基础也能学会做网站</p><p>价格 199 元</p><p>立即报名 加入收藏</p></div>
        <div class="pn mx-auto hidden w-44 rounded-lg border bg-white p-2 text-left"><b class="text-sm text-slate-900">AI 编程入门课</b><p class="text-[10px] text-slate-400">零基础也能学会做网站</p><p class="my-1 text-lg font-bold text-rose-600">¥199</p><div class="flex items-center gap-2 text-xs"><span class="rounded bg-indigo-600 px-3 py-1 text-white">立即报名</span><span class="text-slate-400">收藏</span></div></div>
      </div>`
  },
  {
    id: 'whitespace',
    cat: 'concept',
    zh: '留白',
    en: 'Whitespace',
    alias: ['间距', '负空间', '呼吸感'],
    plain: '内容和内容之间故意空出来的地方。空得够，页面才透气；挤在一起就显得乱',
    desc: '留白不是浪费，它负责分组：离得近的被看作一组，离得远的被看作无关。',
    prompt:
      '增加这个页面的留白（Whitespace）：卡片内边距改为 24px，标题与正文间距 8px，不同分组之间间距 32px，让相关的内容靠近、不相关的内容拉开。',
    spec: [
      '哪些内容属于同一组（应该靠近）',
      '组与组之间是否拉开了足够的距离',
      '是否为了「一屏放完」而把所有东西挤在一起'
    ],
    demo: `<div class="text-center">${pickRow(['拥挤', '舒适'])}
        <div class="pn mx-auto w-44 rounded-lg border bg-white p-1 text-left text-xs leading-tight text-slate-700"><b>账号信息</b><p>昵称：小王</p><p>手机：138****8826</p><b>通知设置</b><p>邮件通知：开</p><p>短信通知：关</p></div>
        <div class="pn mx-auto hidden w-44 rounded-lg border bg-white p-3 text-left text-xs text-slate-700"><b class="text-slate-900">账号信息</b><p class="mt-1">昵称：小王</p><p>手机：138****8826</p><b class="mt-3 block text-slate-900">通知设置</b><p class="mt-1">邮件通知：开</p><p>短信通知：关</p></div>
      </div>`
  },
  {
    id: 'states',
    cat: 'concept',
    zh: '组件状态',
    en: 'Component States',
    alias: ['状态全集', '交互状态', '状态设计'],
    plain: '同一个按钮在不同情况下的不同样子：平时、鼠标移上去、按下去、不能点、正在加载',
    desc: '新手写需求最常漏的部分。只画了「正常的样子」，开发就会来问其他状态怎么办。',
    prompt:
      '为这个按钮补全所有组件状态（Component States）：默认、悬停、按下、聚焦、禁用、加载中，并在一个页面上并排展示出来。',
    spec: [
      '控件：默认、悬停、按下、聚焦、禁用、加载',
      '数据区域：加载中、空、正常、出错',
      '输入框另加：已填写、校验通过、校验失败',
      '写需求时逐个过一遍，不适用的标明「无」'
    ],
    demo: `<div class="grid grid-cols-3 gap-x-3 gap-y-2 text-center text-[10px] text-slate-400">
        <div><div class="rounded bg-indigo-600 py-1 text-xs text-white">提交</div>默认</div>
        <div><div class="rounded bg-indigo-700 py-1 text-xs text-white shadow-md">提交</div>悬停</div>
        <div><div class="scale-95 rounded bg-indigo-800 py-1 text-xs text-white">提交</div>按下</div>
        <div><div class="rounded bg-indigo-600 py-1 text-xs text-white ring-4 ring-indigo-200">提交</div>聚焦</div>
        <div><div class="rounded bg-slate-200 py-1 text-xs text-slate-400">提交</div>禁用</div>
        <div><div class="rounded bg-indigo-400 px-2 py-1 text-xs text-white"><i class="fa fa-spinner fa-spin"></i> 提交中</div>加载</div>
      </div>`
  },
  {
    id: 'affordance',
    cat: 'concept',
    zh: '可供性',
    en: 'Affordance',
    alias: ['示能', '功能可见性', '操作暗示'],
    plain: '一个东西长得像不像「能点」。按钮看着像按钮，人就知道去按；长得像普通文字，就没人发现能点',
    desc: '好的设计不需要说明书：样子本身就在告诉你它能做什么。',
    prompt:
      '提高这些可点击元素的可供性（Affordance）：按钮使用实心背景和圆角，链接使用蓝色并在悬停时加下划线，可点击的卡片在悬停时上浮并显示手型光标，让用户不看说明也知道哪里能点。',
    spec: [
      '可点击的元素看起来像不像能点',
      '不可点击的元素有没有长得像按钮或链接',
      '可滑动、可拖拽的地方有没有暗示（露出半个、拖拽手柄）'
    ],
    demo: `<div class="w-52 space-y-3 text-center text-sm">
        <div><span class="text-slate-600">立即报名</span><p class="text-[10px] text-rose-500">✗ 看不出能点</p></div>
        <div><span class="cursor-pointer rounded-lg bg-indigo-600 px-4 py-1.5 text-white shadow transition hover:-translate-y-0.5 hover:shadow-lg">立即报名</span><p class="mt-2 text-[10px] text-emerald-600">✓ 一看就知道是按钮</p></div>
      </div>`
  },
  {
    id: 'a11y',
    cat: 'concept',
    zh: '无障碍',
    en: 'Accessibility',
    alias: ['可访问性', 'a11y', '适老化'],
    plain: '让视力不好、不方便用鼠标、年纪大的人也能正常使用：字够清楚、对比够强、键盘也能操作',
    desc: '不只是照顾少数人：阳光下看手机、单手操作时，每个人都会受益。',
    prompt:
      '检查并提升这个页面的无障碍（Accessibility）：正文与背景的对比度不低于 4.5:1，所有图片添加替代文字，所有功能可用键盘 Tab 键操作并有清晰的聚焦样式，表单输入框都有对应的标签。',
    spec: [
      '文字与背景的对比度是否足够',
      '是否只靠颜色传达信息（错误除了变红还应有文字或图标）',
      '字号与可点击区域是否够大',
      '是否有政策或客户要求必须达到的标准（如适老化）'
    ],
    demo: `<div class="text-center">${pickRow(['对比度不足', '对比度合格'])}
        <div class="pn mx-auto w-44 rounded-lg bg-white p-3 text-xs"><p class="text-slate-300">这行浅灰色的字很难看清</p><div class="mt-2 rounded bg-indigo-200 py-1 text-white">提交</div></div>
        <div class="pn mx-auto hidden w-44 rounded-lg bg-white p-3 text-xs"><p class="text-slate-800">这行深色的字清楚易读</p><div class="mt-2 rounded bg-indigo-600 py-1 text-white">提交</div></div>
      </div>`
  },
  {
    id: 'fold',
    cat: 'concept',
    zh: '首屏线',
    en: 'Above the Fold',
    alias: ['首屏内', '第一屏', '折叠线'],
    plain: '打开页面不用往下滚就能看到的那一屏。这一屏的下边缘那条看不见的线，就叫首屏线',
    desc: '最重要的信息和主按钮要放在首屏内，因为有相当一部分人根本不会往下滚。',
    prompt:
      '调整页面布局，确保首屏（Above the Fold）内包含：一句话说明产品是什么、主要卖点和「免费试用」主按钮；在常见的 1366×768 和 375×667 屏幕上都不需要滚动就能看到。',
    vs: '页面区块里的「首屏 Hero」是指放在这个位置的那个区块；这里说的是位置本身。',
    spec: [
      '首屏内必须出现哪些内容',
      '按哪些屏幕尺寸来衡量（不同设备首屏高度不同）',
      '首屏底部是否有「下面还有内容」的暗示'
    ],
    demo: `<div class="relative h-full w-36 py-2 text-[10px]">
        <div class="h-full overflow-hidden rounded-lg border-2 border-slate-400 bg-white p-1.5">
          <div class="mb-1 h-3 w-10 bg-slate-300"></div><div class="mb-1 h-12 rounded bg-indigo-100 text-center leading-[48px] text-indigo-600">标题 + 主按钮</div>
          <div class="mt-9 h-6 rounded bg-slate-200 text-center leading-6 text-slate-400">滚动后才看到</div><div class="mt-1 h-6 rounded bg-slate-200"></div>
        </div>
        <div class="absolute inset-x-[-12px] top-[92px] border-t-2 border-dashed border-rose-500"><span class="absolute -top-4 right-0 bg-slate-50 px-1 text-rose-500">首屏线</span></div>
      </div>`
  },
  {
    id: 'touchtarget',
    cat: 'concept',
    zh: '点击热区',
    en: 'Touch Target',
    alias: ['触控区域', '可点击范围', '热区'],
    plain: '一个按钮真正能被点到的范围。图标看着很小，但它周围一圈其实也算，这一圈就是热区',
    desc: '手指比鼠标粗得多。热区太小或挨得太近，用户就会点不中或点错。',
    prompt:
      '检查移动端所有可点击元素的点击热区（Touch Target）：每个不小于 44×44 像素，相邻热区之间至少间隔 8 像素；图标本身较小的，用内边距把热区撑大。',
    spec: [
      '移动端最小热区（常用 44×44 或 48×48）',
      '相邻可点击元素之间的间距',
      '小图标的热区是否向外扩展了'
    ],
    demo: `<div class="flex items-end gap-8 text-center text-[10px]">
        <div><div class="mx-auto flex h-5 w-5 items-center justify-center border border-dashed border-rose-500"><i class="fa fa-times text-slate-600"></i></div><p class="mt-2 text-rose-500">✗ 20×20<br>很难点中</p></div>
        <div><div class="mx-auto flex h-11 w-11 items-center justify-center border border-dashed border-emerald-500 bg-emerald-50"><i class="fa fa-times text-slate-600"></i></div><p class="mt-2 text-emerald-600">✓ 44×44<br>图标一样大，热区更大</p></div>
      </div>`
  },

  /* ---------------- 设计原则 ---------------- */
  {
    id: 'fitts',
    cat: 'concept',
    zh: '费茨定律',
    en: "Fitts's Law",
    alias: ['菲茨定律', 'Fitts Law'],
    plain: '目标越大、离得越近，就越容易点中。所以重要的按钮要做大，并且放在手边',
    desc: '解释了为什么主按钮要大、要靠近用户刚操作完的位置，而危险按钮要远一点。',
    prompt:
      '依据费茨定律（Fitts\'s Law）优化这个表单：把「提交」主按钮放大并放在表单最后一个输入框的正下方，把「清空」这类危险操作缩小并移到远离主按钮的位置。',
    spec: [
      '最常用的操作是否够大、够近',
      '危险操作是否和常用操作拉开了距离',
      '移动端主按钮是否在拇指容易够到的区域'
    ],
    demo: `<div class="w-56 text-[10px]">
        <div class="relative h-20 rounded-lg border bg-white">
          <i class="fa fa-mouse-pointer absolute left-3 top-8 text-slate-500"></i>
          <span class="absolute left-12 top-5 flex h-10 w-20 items-center justify-center rounded-lg bg-indigo-600 text-xs text-white">近 + 大</span>
          <span class="absolute right-2 top-1 flex h-4 w-8 items-center justify-center rounded bg-slate-400 text-white">远+小</span>
        </div>
        <p class="mt-1 text-center text-slate-500">从鼠标位置出发，左边的按钮更快、更不容易点偏</p>
      </div>`
  },
  {
    id: 'hick',
    cat: 'concept',
    zh: '希克定律',
    en: "Hick's Law",
    alias: ['席克定律', '选择过载', 'Hick Law'],
    plain: '选项越多，人做决定就越慢。给三个选项很快能选，给二十个就开始纠结甚至放弃',
    desc: '解释了为什么要分步骤、要给推荐选项、要把不常用的收起来。',
    prompt:
      '依据希克定律（Hick\'s Law）简化这个页面：把一次性展示的 12 个选项按类别分成 3 组，默认只展示最常用的 4 个，其余放进「更多」；并标出一个推荐选项。',
    spec: [
      '一次性让用户做的选择有几个，能不能减少',
      '能否分组、分步骤，或者给出推荐',
      '不常用的选项能否默认收起'
    ],
    demo: `<div class="flex gap-4 text-center text-[10px]">
        <div><div class="w-20 space-y-1">${['方案 A', '方案 B', '方案 C'].map(function (x) { return `<div class="rounded border bg-white py-1 text-xs">${x}</div>` }).join('')}</div><p class="mt-1 text-emerald-600">3 个：很快选好</p></div>
        <div><div class="grid w-28 grid-cols-3 gap-1">${Array.apply(null, Array(12)).map(function (_, i) { return `<div class="rounded border bg-white py-0.5">${i + 1}</div>` }).join('')}</div><p class="mt-1 text-rose-500">12 个：开始纠结</p></div>
      </div>`
  },
  {
    id: 'progressive',
    cat: 'concept',
    zh: '渐进式披露',
    en: 'Progressive Disclosure',
    alias: ['逐步展示', '按需展示', '高级选项'],
    plain: '一开始只给你看最常用的那几项，剩下的收在「高级设置」里，需要的人自己点开',
    desc: '让新手不被吓到，又不耽误老手。是处理复杂功能最常用的办法。',
    prompt:
      '用渐进式披露（Progressive Disclosure）简化这个创建表单：默认只显示名称和类型两个必填项，其余选项收进可展开的「高级设置」，展开状态下次打开时保持。',
    spec: [
      '哪些是大多数人都要用的（默认展示）',
      '哪些是少数人才用的（收起来）',
      '收起来的内容入口是否容易发现',
      '收起的选项默认值是否合理'
    ],
    demo: `<div class="w-52 rounded-lg border bg-white p-3 text-xs">
        <label class="mb-2 block">项目名称<input class="${I} mt-0.5 !py-1 !text-xs" placeholder="请输入"></label>
        <details><summary class="cursor-pointer list-none text-indigo-600"><i class="fa fa-angle-right"></i> 高级设置（可选）</summary>
          <div class="mt-2 space-y-1 border-t pt-2 text-slate-600"><label class="flex justify-between">公开可见<input type="checkbox" class="accent-indigo-600"></label><label class="flex justify-between">允许评论<input type="checkbox" checked class="accent-indigo-600"></label></div>
        </details>
      </div>`
  },
  {
    id: 'defaults',
    cat: 'concept',
    zh: '默认值',
    en: 'Default',
    alias: ['默认选项', '预设值', '缺省值'],
    plain: '你什么都不改时，系统替你选好的那个选项。绝大多数人不会去改它',
    desc: '因为多数人不改，所以默认值几乎就是在替用户做决定，必须选对多数人最有利的那个。',
    prompt:
      '为这个表单的每个字段设置合理的默认值（Default）：配送方式默认选最常用的「标准配送」，数量默认 1，日期默认今天，并在默认选项旁标注「推荐」。',
    spec: [
      '每个选项的默认值是什么',
      '默认值是否对大多数用户有利',
      '涉及授权、付费、营销订阅的选项不应默认勾选',
      '是否记住用户上一次的选择'
    ],
    demo: `<div class="w-52 space-y-1.5 text-xs">
        <div class="text-slate-400">配送方式</div>
        <label class="flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-2 py-1.5"><input type="radio" name="demo-def" checked class="accent-indigo-600">标准配送 · 免费<span class="ml-auto rounded bg-indigo-50 px-1 text-indigo-600">默认</span></label>
        <label class="flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-2 py-1.5"><input type="radio" name="demo-def" class="accent-indigo-600">次日达 · ¥12</label>
        <p class="text-[10px] text-slate-400">大多数人不会改默认选项</p>
      </div>`
  },
  {
    id: 'darkpattern',
    cat: 'concept',
    zh: '暗黑模式',
    en: 'Dark Pattern',
    alias: ['欺骗性设计', '诱导设计', 'Deceptive Design'],
    plain: '故意把界面设计得让人上当：同意按钮很大很亮，拒绝却藏在角落里几乎看不见',
    desc: '短期能把数据做好看，长期伤害信任，还可能违规。要能认出来，更要能拒绝做。',
    prompt:
      '检查这个页面有没有暗黑模式（Dark Pattern）：例如默认勾选的营销授权、被刻意弱化的拒绝按钮、制造虚假紧迫感的倒计时、难以找到的取消入口，并给出对用户诚实的替代方案。',
    vs: '注意不要和「深色模式（Dark Mode）」混淆，那只是界面的深色配色。',
    spec: [
      '接受和拒绝两个选项是否同样容易看到、点到',
      '是否有默认勾选的授权或付费项',
      '取消、退订是否和开通一样容易',
      '文案是否如实说明了后果'
    ],
    demo: `<div class="relative w-52 rounded-xl border bg-white p-3 text-center text-xs">
        <span class="absolute -right-2 -top-2 rotate-6 rounded bg-rose-500 px-1.5 text-[10px] text-white">反面示例</span>
        <b class="text-slate-900">开启消息推送？</b>
        <div class="mt-2 rounded-lg bg-indigo-600 py-2 text-sm font-bold text-white">好的，全部开启</div>
        <div class="mt-1 text-[9px] text-slate-300">暂不</div>
        <label class="mt-1 flex items-center justify-center gap-1 text-[9px] text-slate-300"><input type="checkbox" checked disabled class="h-2 w-2">同意接收营销短信</label>
      </div>`
  },
  {
    id: 'edgecase',
    cat: 'concept',
    zh: '边界情况',
    en: 'Edge Case',
    alias: ['异常情况', '极端情况', '边缘场景'],
    plain: '不常发生、但一定会发生的特殊情况：名字特别长、一条数据都没有、图片加载不出来',
    desc: '设计稿里永远是完美数据，线上永远不是。提前想到边界情况，是需求写得专业的标志。',
    prompt:
      '帮我列出这个卡片组件需要处理的边界情况（Edge Case）并给出处理方式：标题超长、没有图片或图片加载失败、数值为 0 或非常大、没有任何数据、用户没有权限。',
    spec: [
      '内容：超长、为空、含特殊字符或表情',
      '数量：0 个、1 个、非常多',
      '网络：慢、断开、请求失败',
      '用户：未登录、无权限、连续快速点击'
    ],
    demo: `<div class="text-center">${pickRow(['正常', '超长', '空数据', '图挂了'])}
        <div class="pn mx-auto flex w-44 items-center gap-2 rounded-lg border bg-white p-2 text-left text-xs"><span class="h-9 w-9 shrink-0 rounded bg-gradient-to-br from-indigo-300 to-fuchsia-300"></span><div class="min-w-0"><b class="block text-slate-900">小王</b><span class="text-slate-400">3 个项目</span></div></div>
        <div class="pn mx-auto flex hidden w-44 items-center gap-2 rounded-lg border bg-white p-2 text-left text-xs"><span class="h-9 w-9 shrink-0 rounded bg-gradient-to-br from-indigo-300 to-fuchsia-300"></span><div class="min-w-0"><b class="block truncate text-slate-900">一个名字特别特别特别长的用户</b><span class="text-slate-400">12,345 个项目</span></div></div>
        <div class="pn mx-auto hidden w-44 rounded-lg border bg-white p-2 text-xs text-slate-400"><i class="fa fa-inbox text-lg"></i><br>还没有成员</div>
        <div class="pn mx-auto flex hidden w-44 items-center gap-2 rounded-lg border bg-white p-2 text-left text-xs"><span class="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-slate-200 text-slate-400"><i class="fa fa-picture-o"></i></span><div><b class="block text-slate-900">小王</b><span class="text-slate-400">0 个项目</span></div></div>
      </div>`
  },

  /* ---------------- 数据与上线 ---------------- */
  {
    id: 'tracking',
    cat: 'concept',
    zh: '埋点',
    en: 'Event Tracking',
    alias: ['数据埋点', '打点', '事件上报'],
    plain: '在按钮和页面上悄悄装「计数器」：谁点了、什么时候点的、点了多少次，都会被记下来',
    desc: '没有埋点就没有数据，功能上线后好不好只能靠猜。埋点需求要和功能需求一起提。',
    prompt:
      '帮我为「课程详情页」设计埋点方案（Event Tracking）：用表格列出需要记录的事件，包含事件名称、触发时机（页面浏览、按钮点击等）、需要携带的属性（课程 ID、来源渠道等），以及每个事件用来回答什么问题。',
    spec: [
      '想通过数据回答什么问题（先有问题，再定埋点）',
      '记录哪些事件，各自的触发时机',
      '每个事件带哪些属性',
      '是否涉及用户隐私，是否需要用户同意'
    ],
    demo: `<div class="w-56 text-xs">
        <div class="mb-2 flex justify-center gap-2"><button class="${B} !py-1 !text-xs" onclick="D.track(this,'buy_button')">立即购买</button><button class="${G} !py-1 !text-xs" onclick="D.track(this,'fav_button')">收藏</button></div>
        <div class="tk h-16 overflow-hidden rounded-lg bg-slate-900 p-2 font-mono text-[10px] text-emerald-300"><div class="text-slate-500">点上面的按钮，这里会记下一条…</div></div>
      </div>`
  },
  {
    id: 'funnel',
    cat: 'concept',
    zh: '漏斗',
    en: 'Funnel',
    alias: ['转化漏斗', '漏斗分析', '转化率'],
    plain: '一个流程里每一步都会走掉一些人，把每步剩下的人数画成上宽下窄的图，就像个漏斗',
    desc: '用来找出用户主要在哪一步流失。流失最多的那一步，就是最该优化的地方。',
    prompt:
      '用漏斗图（Funnel）展示注册流程的转化：步骤依次为「访问首页 → 点击注册 → 填写手机号 → 完成注册」，每一步显示人数和相对上一步的转化率，并标出流失最严重的一步。',
    spec: [
      '漏斗包含哪几步，每一步对应哪个埋点事件',
      '统计的时间范围和人群',
      '转化率按上一步算还是按第一步算',
      '流失最多的一步，可能的原因是什么'
    ],
    demo: `<div class="w-56 space-y-1 text-xs text-white">
        ${[
          ['访问首页', '1000', 'w-full', 'bg-indigo-600'],
          ['点击注册', '420 · 42%', 'w-4/5', 'bg-indigo-500'],
          ['填手机号', '180 · 43%', 'w-3/5', 'bg-indigo-400'],
          ['完成注册', '150 · 83%', 'w-2/5', 'bg-emerald-500']
        ]
          .map(function (s) {
            return `<div class="mx-auto flex justify-between rounded px-2 py-1 ${s[2]} ${s[3]}"><span>${s[0]}</span><span>${s[1]}</span></div>`
          })
          .join('')}
        <p class="pt-1 text-center text-[10px] text-rose-500">前两步流失最多，优先优化</p>
      </div>`
  },
  {
    id: 'abtest',
    cat: 'concept',
    zh: 'A/B 测试',
    en: 'A/B Testing',
    alias: ['对照实验', 'AB 实验', '分流测试'],
    plain: '同一个页面做两个版本，一半人看 A、一半人看 B，哪个版本数据好就用哪个',
    desc: '用真实数据代替争论。前提是流量足够大，并且一次只改一个地方。',
    prompt:
      '帮我设计一个 A/B 测试（A/B Testing）方案：假设是「把按钮文案从『立即注册』改为『免费试用』能提高点击率」，请给出对照组与实验组的定义、流量分配比例、核心指标、需要的样本量估算和判定标准。',
    vs: '灰度发布是为了「安全地上线」；A/B 测试是为了「比较哪个更好」。',
    spec: [
      '要验证的假设是什么',
      '两个版本只差哪一处',
      '看哪个指标，提升多少算有效',
      '流量怎么分、跑多久（样本太少结论不可信）'
    ],
    demo: `<div class="w-56 text-center text-xs">
        <div class="mb-1 text-slate-400">访客随机分成两半</div>
        <div class="grid grid-cols-2 gap-2">
          <div class="rounded-lg border bg-white p-2"><div class="text-slate-400">A 版 · 50%</div><div class="my-1 rounded bg-indigo-600 py-1 text-white">立即注册</div><b class="text-slate-900">点击率 3.1%</b></div>
          <div class="rounded-lg border-2 border-emerald-500 bg-white p-2"><div class="text-slate-400">B 版 · 50%</div><div class="my-1 rounded bg-indigo-600 py-1 text-white">免费试用</div><b class="text-emerald-600">点击率 4.6% ✓</b></div>
        </div>
      </div>`
  },
  {
    id: 'grayrelease',
    cat: 'concept',
    zh: '灰度发布',
    en: 'Gradual Rollout',
    alias: ['灰度', '分批上线', '金丝雀发布'],
    plain: '新功能不是一下子给所有人，而是先放给一小部分人用，没问题再慢慢扩大到全部',
    desc: '万一有问题只影响少数人，可以及时撤回。重要功能上线的标准做法。',
    prompt:
      '帮我制定这个新功能的灰度发布（Gradual Rollout）计划：分 5%、20%、50%、100% 四个阶段，说明每个阶段的放量对象、观察时长、需要盯的指标，以及出现什么情况时立即回滚。',
    vs: 'A/B 测试是比较两个版本哪个好；灰度是同一个新版本分批放出去。',
    spec: [
      '先放给谁（内部员工、某个地区、按比例随机）',
      '分几批，每批观察多久',
      '盯哪些指标，什么情况下暂停或回滚',
      '灰度期间新旧用户看到的不一样，客服是否知情'
    ],
    demo: `<div class="w-56 text-center text-xs">
        <div class="mb-1 flex flex-wrap justify-center gap-1 text-base">${Array.apply(null, Array(20)).map(function (_, i) { return `<i class="gu fa fa-user ${i < 1 ? 'text-indigo-600' : 'text-slate-300'}"></i>` }).join('')}</div>
        <input type="range" min="5" max="100" step="5" value="5" class="w-full accent-indigo-600" aria-label="放量比例" oninput="D.gray(this)">
        <p class="text-slate-500">已有 <b class="gl text-indigo-600">5%</b> 的用户看到新版本</p>
      </div>`
  },
  {
    id: 'retention',
    cat: 'concept',
    zh: '留存',
    en: 'Retention',
    alias: ['留存率', '次日留存', '用户留存'],
    plain: '今天来的一批新用户，明天还有多少人回来、一周后还有多少人回来',
    desc: '衡量产品是否真的有用的核心指标。拉来再多人，留不住都是白费。',
    prompt:
      '用折线图展示新用户的留存曲线（Retention）：横轴为注册后的第 1、3、7、14、30 天，纵轴为留存率，并在图下方用一句话说明曲线在哪一天之后趋于平稳。',
    vs: '活跃（DAU）看的是「今天有多少人用」；留存看的是「同一批人后来还用不用」。',
    spec: [
      '「留下来」怎么定义（打开 App，还是完成了某个关键动作）',
      '看哪几个时间点（次日、7 日、30 日）',
      '按哪一批用户算（按注册日期分组）',
      '这个需求预期影响哪一段留存'
    ],
    demo: `<div class="w-56 text-xs">
        <div class="flex h-24 items-end gap-2 border-b border-l border-slate-300 px-2">
          ${[
            ['当天', 100],
            ['次日', 42],
            ['3 日', 30],
            ['7 日', 22],
            ['30 日', 18]
          ]
            .map(function (d) {
              return `<div class="flex h-full flex-1 flex-col justify-end text-center"><span class="text-[10px] text-slate-500">${d[1]}%</span><div class="rounded-t bg-indigo-400" style="height:${d[1]}%"></div></div>`
            })
            .join('')}
        </div>
        <div class="flex gap-2 px-2 text-center text-[10px] text-slate-400"><span class="flex-1">当天</span><span class="flex-1">次日</span><span class="flex-1">3 日</span><span class="flex-1">7 日</span><span class="flex-1">30 日</span></div>
      </div>`
  },
  {
    id: 'heatmap',
    cat: 'concept',
    zh: '热力图',
    en: 'Heatmap',
    alias: ['点击热图', '点击分布', '注意力热图'],
    plain: '把大家在页面上点得多的地方涂成红色、点得少的涂成蓝色，一眼看出哪里最受关注',
    desc: '直观地看到用户实际在点哪里，常常会发现大家在点根本不能点的东西。',
    prompt:
      '在页面截图上叠加点击热力图（Heatmap）：点击密集的区域显示为红色，逐渐过渡到黄色和蓝色，并在旁边列出点击量最高的 5 个元素及其占比。',
    spec: [
      '看的是点击、滚动深度还是鼠标停留',
      '统计的时间范围与人群',
      '有没有大量点击落在不可点击的元素上',
      '重要的按钮是否处在少有人到达的位置'
    ],
    demo: `<div class="relative w-44 overflow-hidden rounded-lg border bg-white p-2">
        <div class="mb-1 h-3 w-12 bg-slate-300"></div><div class="mb-1 h-10 rounded bg-slate-200"></div><div class="mb-1 h-2 bg-slate-200"></div><div class="mb-1 h-2 w-3/4 bg-slate-200"></div><div class="h-5 w-16 rounded bg-slate-300"></div>
        <span class="absolute left-3 top-24 h-12 w-16 rounded-full bg-red-500/70 blur-md"></span><span class="absolute left-6 top-6 h-10 w-20 rounded-full bg-amber-400/60 blur-md"></span><span class="absolute right-3 top-1 h-6 w-8 rounded-full bg-sky-400/50 blur-md"></span>
        <p class="relative mt-2 text-center text-[10px] text-slate-500">红色：点击最多的地方</p>
      </div>`
  },

  /* ---------------- 协作沟通 ---------------- */
  {
    id: 'usabilitytest',
    cat: 'concept',
    zh: '可用性测试',
    en: 'Usability Testing',
    alias: ['用户测试', '走查', '易用性测试'],
    plain: '找几个真实用户来，给他们一个任务，看他们能不能自己做完，卡在哪里',
    desc: '上线前发现问题最便宜的办法。通常找 5 个人就能暴露大部分主要问题。',
    prompt:
      '帮我为这个原型准备一份可用性测试（Usability Testing）方案：包含 3 个让用户完成的任务（描述场景但不提示操作步骤）、每个任务的成功标准、需要观察记录的内容，以及测试后要问的 3 个问题。',
    vs: 'A/B 测试看的是大量用户的数据；可用性测试是近距离观察少数人为什么卡住。',
    spec: [
      '要测试哪几个任务',
      '找什么样的人、找几个',
      '怎样算任务成功',
      '观察时不提示、不解释，只记录卡在哪里'
    ],
    demo: `<table class="w-56 text-center text-xs">
        <thead class="text-slate-400"><tr><th class="py-1 text-left font-normal">任务</th><th class="font-normal">甲</th><th class="font-normal">乙</th><th class="font-normal">丙</th><th class="font-normal">丁</th><th class="font-normal">戊</th></tr></thead>
        <tbody class="divide-y bg-white">
          <tr><td class="px-1 py-1.5 text-left">找到课程</td>${'<td class="text-emerald-500">✓</td>'.repeat(5)}</tr>
          <tr><td class="px-1 py-1.5 text-left">完成报名</td><td class="text-emerald-500">✓</td><td class="text-rose-500">✗</td><td class="text-emerald-500">✓</td><td class="text-rose-500">✗</td><td class="text-rose-500">✗</td></tr>
          <tr><td class="px-1 py-1.5 text-left">申请退款</td><td class="text-emerald-500">✓</td><td class="text-emerald-500">✓</td><td class="text-rose-500">✗</td><td class="text-emerald-500">✓</td><td class="text-emerald-500">✓</td></tr>
        </tbody>
        <caption class="caption-bottom pt-1 text-[10px] text-rose-500">「完成报名」5 人中 3 人失败，优先修</caption>
      </table>`
  },
  {
    id: 'handoff',
    cat: 'concept',
    zh: '设计交付',
    en: 'Design Handoff',
    alias: ['标注', '切图', '设计走查'],
    plain: '设计师把定稿交给开发时，要标清楚每个东西多大、间距多少、什么颜色，开发才能照着做',
    desc: '设计稿到代码之间最容易走样的一环。上线前还要对照设计稿检查一遍，叫设计走查。',
    prompt:
      '严格按照这份设计标注实现页面：卡片内边距 16px、圆角 12px，标题 16px 加粗、颜色 #1C1917，正文 14px、颜色 #57534E，按钮高度 36px；完成后列出与标注不一致的地方。',
    spec: [
      '交付物是否齐全（各页面、各状态、各断点）',
      '尺寸、间距、颜色、字体是否有标注或可在工具里查看',
      '图标、图片等素材是否已提供',
      '上线前由谁做设计走查'
    ],
    demo: `<div class="relative w-64 py-4 pr-24 text-[10px]">
        <div class="rounded-xl border bg-white p-4"><b class="text-sm text-slate-900">卡片标题</b><div class="mt-2 rounded bg-indigo-600 py-1.5 text-center text-xs text-white">按钮</div></div>
        <span class="absolute left-0 top-4 flex h-4 w-4 items-center justify-center bg-rose-500/20 text-rose-600">16</span>
        <span class="absolute right-0 top-7 text-rose-600">← 字号 14 加粗</span>
        <span class="absolute right-0 bottom-7 text-rose-600">← 高 28 #4F46E5</span>
        <span class="absolute left-14 top-0 text-rose-600">圆角 12</span>
      </div>`
  },
  {
    id: 'api',
    cat: 'concept',
    zh: '接口',
    en: 'API',
    alias: ['前后端接口', '数据接口', '请求与响应'],
    plain: '页面（前端）向服务器（后端）要数据时走的「窗口」：页面按约定问一句，服务器按约定答一句',
    desc: '页面上所有会变的数据都来自接口。听懂「这个字段接口没返回」「接口超时了」是和开发沟通的基础。',
    prompt:
      '这个页面的数据先用模拟接口（Mock API）实现：定义「获取订单详情」接口的请求参数和返回的 JSON 字段，前端按加载中、成功、失败三种状态分别展示，之后可以直接替换成真实接口。',
    spec: [
      '页面上哪些内容是写死的，哪些来自接口',
      '每个数据项的含义、格式和可能为空的情况',
      '接口慢或失败时页面怎么表现',
      '哪些操作需要调用接口保存'
    ],
    demo: `<div class="w-56 text-xs">
        <div class="mb-2 flex items-center justify-between text-center"><div class="rounded-lg border bg-white px-2 py-1"><i class="fa fa-desktop text-indigo-600"></i><div>前端页面</div></div><div class="flex-1 text-[10px] text-slate-400">请求 →<br>← 响应</div><div class="rounded-lg border bg-white px-2 py-1"><i class="fa fa-database text-emerald-600"></i><div>后端服务器</div></div></div>
        <button class="${G} mb-1 w-full !py-1 !text-xs disabled:opacity-50" onclick="D.api(this)">查询订单 1001</button>
        <pre class="ao h-9 overflow-hidden rounded bg-slate-900 p-1.5 font-mono text-[10px] leading-tight text-emerald-300"></pre>
      </div>`
  }
)

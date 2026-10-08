/* ============================================================
 * 3. 术语数据
 *    新增术语：复制一个对象，改掉各字段即可。
 *    - plain  大白话描述，同时用于「不知道叫什么」反查，写得越口语越好
 *    - demo   放进实例区的 HTML，交互通过上面的 D 工具完成
 * ============================================================ */
var CATS = [
  { id: 'all', zh: '全部', icon: 'th-large' },
  { id: 'feedback', zh: '反馈提示', icon: 'bell' },
  { id: 'nav', zh: '导航', icon: 'compass' },
  { id: 'input', zh: '输入控件', icon: 'keyboard-o' },
  { id: 'display', zh: '内容展示', icon: 'clone' },
  { id: 'section', zh: '页面区块', icon: 'columns' },
  { id: 'page', zh: '页面类型', icon: 'file-o' },
  { id: 'flow', zh: '常见流程', icon: 'random' },
  { id: 'mobile', zh: '移动端与手势', icon: 'mobile' },
  { id: 'system', zh: '引导与系统状态', icon: 'life-ring' },
  { id: 'state', zh: '状态与动效', icon: 'magic' }
]

// 灵感图库：用于找真实案例、做竞品分析（只放链接，不搬运截图）
var REFS = {
  supahero: {
    name: 'Supahero',
    url: 'https://supahero.io',
    note: '专门收集网站首屏（Hero）设计'
  },
  saaspo: {
    name: 'Saaspo',
    url: 'https://saaspo.com',
    note: 'SaaS 落地页图库，可按区块类型筛选'
  },
  seesaw: {
    name: 'Seesaw',
    url: 'https://www.seesaw.website',
    note: '综合网站灵感图库，按页面类型和风格筛选'
  },
  searchsystem: {
    name: 'Search System',
    url: 'https://searchsystem.co',
    note: '偏视觉与平面风格的设计参考'
  }
}

var EXAMPLES = [
  '鼠标放上去冒出来的小字',
  '几秒后自动消失的提示',
  '从侧边滑出来的面板',
  '三条杠的菜单按钮',
  '加载时的灰色方块',
  '点击问题展开答案',
  '图片自动左右切换',
  '滚动时固定在顶部',
  '打开网站第一眼看到的大标题',
  '几个套餐并排比价格'
]

var TERMS = [
  /* ---------------- 反馈提示 ---------------- */
  {
    id: 'modal',
    cat: 'feedback',
    zh: '模态框',
    en: 'Modal',
    alias: ['Dialog', '对话框', '弹窗'],
    plain: '盖在页面正中间的弹窗，背景变暗，不处理完它就点不了后面的内容',
    desc: '用于必须立刻处理的事情：确认、填写表单、重要提示。会打断用户，所以别滥用。',
    prompt:
      '点击「提交」按钮时弹出一个模态框（Modal）：居中显示，带半透明黑色遮罩，包含标题、说明文字和「取消 / 确定」两个按钮，点击遮罩或取消可关闭。',
    demo: `<button class="${B}" onclick="D.tog(this,'.ov')">打开对话框</button>
      <div class="ov hidden absolute inset-0 flex items-center justify-center bg-black/40" onclick="if(event.target===this)D.tog(this,'.ov')">
        <div class="w-52 rounded-xl bg-white p-4 shadow-xl">
          <div class="mb-1 font-semibold">确认提交？</div>
          <p class="mb-3 text-xs text-slate-500">提交后将无法修改。</p>
          <div class="flex justify-end gap-2">
            <button class="${G}" onclick="D.tog(this,'.ov')">取消</button>
            <button class="${B}" onclick="D.tog(this,'.ov')">确定</button>
          </div>
        </div>
      </div>`
  },
  {
    id: 'toast',
    cat: 'feedback',
    zh: '轻提示',
    en: 'Toast',
    alias: ['Snackbar', 'Message', '消息提示'],
    plain: '操作后在角落或顶部弹出、几秒后自动消失的小提示，不用手动关',
    desc: '用来告诉用户「刚才的操作成功/失败了」，不打断当前操作。',
    prompt:
      '保存成功后在页面右上角显示一个 Toast 轻提示，内容为「保存成功」，带绿色对勾图标，2 秒后自动淡出消失，多条提示向下堆叠。',
    demo: `<button class="${B}" onclick="D.toast(this)">保存</button>
      <div class="ts absolute right-2 top-2 space-y-1"></div>`
  },
  {
    id: 'tooltip',
    cat: 'feedback',
    zh: '文字提示',
    en: 'Tooltip',
    alias: ['气泡提示', '悬浮提示'],
    plain: '鼠标放上去（悬停）时冒出来的一行小字说明，鼠标移开就消失',
    desc: '给图标或按钮补一句简短解释。只能放纯文字，内容多请用 Popover。',
    prompt:
      '给这个问号图标加一个 Tooltip：鼠标悬停时在图标上方显示深色小气泡，文字为「我是文字提示」，带淡入动画，鼠标移开后消失。',
    demo: `<span class="group relative">
        <button class="${G}"><i class="fa fa-question-circle"></i> 把鼠标移上来</button>
        <span class="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">我是文字提示</span>
      </span>`
  },
  {
    id: 'popover',
    cat: 'feedback',
    zh: '气泡卡片',
    en: 'Popover',
    alias: ['弹出框', '浮层'],
    plain: '点一下按钮，在它旁边弹出一个小卡片，里面可以有标题、文字甚至按钮',
    desc: '比 Tooltip 内容更丰富、可以交互；比 Modal 更轻，不会挡住整个页面。',
    prompt:
      '点击「查看详情」按钮时，在按钮下方弹出一个 Popover 气泡卡片，包含标题、一段说明和「知道了」按钮，点击卡片外部区域自动关闭。',
    demo: `<div class="relative mt-4 self-start">
        <button class="${G}" onclick="D.tog(this,'.pp')">点我查看详情</button>
        <div class="pp absolute left-1/2 top-full mt-2 hidden w-44 -translate-x-1/2 rounded-lg border bg-white p-3 text-xs shadow-lg">
          <div class="mb-1 font-semibold">会员权益</div>
          <p class="mb-2 text-slate-500">内容比文字提示更多，还能放按钮。</p>
          <button class="text-indigo-600" onclick="D.tog(this,'.pp')">知道了</button>
        </div>
      </div>`
  },
  {
    id: 'popconfirm',
    cat: 'feedback',
    zh: '气泡确认框',
    en: 'Popconfirm',
    alias: ['二次确认', 'Confirmation'],
    plain: '点删除这类危险按钮时，旁边冒出一个小气泡再问一次「确定吗」',
    desc: '防止误操作的轻量二次确认，比弹出整个模态框更省事。',
    prompt:
      '点击「删除」按钮时不要直接删除，先在按钮上方弹出 Popconfirm 气泡确认框，提示「确定要删除吗？」，提供「取消」和「删除」两个按钮。',
    demo: `<div class="relative mb-5 self-end">
        <button class="rounded-lg bg-rose-600 px-3 py-1.5 text-sm text-white" onclick="D.tog(this,'.pc')"><i class="fa fa-trash"></i> 删除</button>
        <div class="pc absolute bottom-full left-1/2 mb-2 hidden w-48 -translate-x-1/2 rounded-lg border bg-white p-3 text-xs shadow-lg">
          <p class="mb-2"><i class="fa fa-exclamation-circle text-amber-500"></i> 确定要删除吗？</p>
          <div class="flex justify-end gap-2">
            <button class="${G}" onclick="D.tog(this,'.pc')">取消</button>
            <button class="${B}" onclick="D.tog(this,'.pc')">删除</button>
          </div>
        </div>
      </div>`
  },
  {
    id: 'alert',
    cat: 'feedback',
    zh: '警告提示条',
    en: 'Alert',
    alias: ['Banner', '横幅', '通知条'],
    plain: '嵌在页面里的一条带颜色的通知，一直显示着，直到用户点叉关掉',
    desc: '用于需要持续可见的信息：系统公告、表单整体报错、风险提醒。',
    prompt:
      '在页面顶部放一个黄色的 Alert 警告提示条，左侧是警告图标，中间是公告文字，右侧有一个关闭按钮，点击后提示条消失。',
    demo: `<div class="w-full space-y-2 px-3">
        <div class="al flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
          <i class="fa fa-exclamation-triangle mt-0.5"></i>
          <span class="flex-1">系统将于今晚 23:00 维护，请提前保存。</span>
          <button onclick="D.tog(this,'.al')" aria-label="关闭"><i class="fa fa-times"></i></button>
        </div>
        <button class="text-xs text-indigo-600" onclick="D.tog(this,'.al')">切换显示</button>
      </div>`
  },
  {
    id: 'skeleton',
    cat: 'feedback',
    zh: '骨架屏',
    en: 'Skeleton',
    alias: ['Skeleton Screen', '占位图'],
    plain: '内容还没加载出来时，先显示的灰色方块和线条占位，还会一闪一闪',
    desc: '让用户提前看到页面的大致结构，比一个转圈圈感觉更快。',
    prompt:
      '列表数据加载期间显示 Skeleton 骨架屏：用灰色圆形代替头像、灰色长条代替文字，带呼吸闪烁动画，数据返回后替换为真实内容。',
    demo: `<div class="w-full px-4">
        <div class="sk flex hidden animate-pulse gap-3">
          <div class="h-10 w-10 rounded-full bg-slate-300"></div>
          <div class="flex-1 space-y-2 py-1">
            <div class="h-3 w-1/2 rounded bg-slate-300"></div>
            <div class="h-3 rounded bg-slate-300"></div>
            <div class="h-3 w-4/5 rounded bg-slate-300"></div>
          </div>
        </div>
        <div class="ct flex gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white"><i class="fa fa-user"></i></div>
          <div class="flex-1 text-xs">
            <div class="font-semibold">小明</div>
            <p class="text-slate-500">加载完成后，灰色占位块被真实内容替换。</p>
          </div>
        </div>
        <button class="${G} mt-3" onclick="D.skel(this)">重新加载</button>
      </div>`
  },
  {
    id: 'spinner',
    cat: 'feedback',
    zh: '加载指示器',
    en: 'Spinner',
    alias: ['Loading', '加载中', '转圈'],
    plain: '一直转圈圈的小图标，告诉你「正在处理，请稍等」',
    desc: '用于时长不确定的短等待，常放在按钮里或页面中央。',
    prompt:
      '点击「提交」后按钮进入 Loading 状态：按钮内显示旋转的 Spinner 图标，文字变为「提交中…」，按钮禁用防止重复点击，请求完成后恢复。',
    demo: `<button class="${B} disabled:opacity-60" onclick="D.spin(this)"><i class="fa fa-spinner fa-spin hidden"></i> <span>提交</span></button>`
  },
  {
    id: 'progress',
    cat: 'feedback',
    zh: '进度条',
    en: 'Progress Bar',
    alias: ['Progress', '进度'],
    plain: '一根慢慢被填满的横条，显示任务完成了百分之多少',
    desc: '用于能算出进度的等待，例如上传、下载、多步骤任务。',
    prompt:
      '文件上传时显示一个 Progress Bar 进度条：灰色轨道、蓝色填充，宽度随上传百分比平滑增长，右侧显示百分比数字。',
    demo: `<div class="w-full px-4">
        <div class="h-2 overflow-hidden rounded-full bg-slate-200"><div class="pb h-full bg-indigo-600 transition-all duration-200" style="width:0%"></div></div>
        <div class="mt-2 flex items-center justify-between text-xs">
          <span class="pt">0%</span>
          <button class="${G} disabled:opacity-50" onclick="D.prog(this)">开始上传</button>
        </div>
      </div>`
  },
  {
    id: 'badge',
    cat: 'feedback',
    zh: '徽标',
    en: 'Badge',
    alias: ['红点', '角标', '未读数'],
    plain: '图标右上角的小红点或红色数字，提示有几条未读消息',
    desc: '吸引注意力，提示有新内容或数量。',
    prompt:
      '在铃铛图标右上角加一个 Badge 徽标：红色圆形背景、白色数字，显示未读消息数量，数量为 0 时隐藏，超过 99 显示「99+」。',
    demo: `<div class="flex items-center gap-6">
        <span class="relative text-2xl text-slate-600"><i class="fa fa-bell"></i><span class="bd absolute -right-2 -top-1 h-[18px] min-w-[18px] rounded-full bg-rose-500 px-1 text-center text-[10px] leading-[18px] text-white">3</span></span>
        <button class="${G}" onclick="var b=D.q(this,'.bd');b.textContent=+b.textContent+1">来一条新消息</button>
      </div>`
  },
  {
    id: 'empty',
    cat: 'feedback',
    zh: '空状态',
    en: 'Empty State',
    alias: ['缺省页', '暂无数据'],
    plain: '列表里一条数据都没有时，显示的插图加一句「暂无内容」',
    desc: '避免页面一片空白，并引导用户下一步该做什么。',
    prompt:
      '订单列表为空时显示 Empty State 空状态：居中展示一个灰色图标、文案「还没有任何订单」，下方放一个「去逛逛」按钮引导用户。',
    demo: `<div class="text-center text-slate-400">
        <i class="fa fa-inbox text-4xl"></i>
        <p class="my-2 text-xs">还没有任何订单</p>
        <button class="${B}">去逛逛</button>
      </div>`
  },

  /* ---------------- 导航 ---------------- */
  {
    id: 'navbar',
    cat: 'nav',
    zh: '导航栏',
    en: 'Navbar',
    alias: ['Navigation Bar', 'Header', '顶栏'],
    plain: '网页最上面那一横条，放着 Logo、几个栏目链接和登录按钮',
    desc: '网站的总入口，几乎每个页面都会出现。',
    prompt:
      '做一个顶部 Navbar 导航栏：左侧 Logo，中间是「首页 / 课程 / 关于」链接，当前页高亮，右侧是「登录」按钮，滚动时固定在顶部。',
    demo: `<div class="absolute inset-0 bg-white">
        <nav class="flex h-10 items-center gap-4 border-b px-3 text-xs">
          <b class="text-indigo-600">Logo</b>
          <span class="cursor-pointer font-medium text-indigo-600">首页</span>
          <span class="cursor-pointer hover:text-indigo-600">课程</span>
          <span class="cursor-pointer hover:text-indigo-600">关于</span>
          <button class="ml-auto rounded bg-indigo-600 px-2 py-1 text-white">登录</button>
        </nav>
        <p class="p-3 text-xs text-slate-400">页面内容…</p>
      </div>`
  },
  {
    id: 'tabs',
    cat: 'nav',
    zh: '标签页',
    en: 'Tabs',
    alias: ['选项卡', 'Tab'],
    plain: '一排并列的标题，点哪个下面就切换成哪个的内容，页面不跳转',
    desc: '在同一块区域里切换几组平级的内容。',
    prompt:
      '用 Tabs 标签页组织内容，包含「简介 / 目录 / 评价」三个标签，当前标签下方有蓝色下划线，点击切换对应内容，页面不刷新。',
    demo: `<div class="absolute inset-0 bg-white text-xs">
        <div class="flex border-b">
          <button class="tb border-b-2 border-indigo-600 px-4 py-2 text-indigo-600" onclick="D.tab(this,0)">简介</button>
          <button class="tb border-b-2 border-transparent px-4 py-2" onclick="D.tab(this,1)">目录</button>
          <button class="tb border-b-2 border-transparent px-4 py-2" onclick="D.tab(this,2)">评价</button>
        </div>
        <div class="p-3 text-slate-500">
          <p class="tp">这是一门零基础也能学的 AI 编程课。</p>
          <p class="tp hidden">第 1 章 · 第 2 章 · 第 3 章</p>
          <p class="tp hidden">★★★★★ 讲得很清楚！</p>
        </div>
      </div>`
  },
  {
    id: 'breadcrumb',
    cat: 'nav',
    zh: '面包屑',
    en: 'Breadcrumb',
    alias: ['路径导航'],
    plain: '页面顶部那串「首页 > 分类 > 当前页」的小字，告诉你现在在哪一层',
    desc: '显示当前页面在网站层级中的位置，并能一键回到上级。',
    prompt:
      '在页面标题上方加一个 Breadcrumb 面包屑导航：「首页 > 课程 > 第 1 章」，用箭头分隔，前两级可点击跳转，最后一级为当前页不可点击。',
    demo: `<nav class="text-xs text-slate-500">
        <span class="cursor-pointer hover:text-indigo-600">首页</span>
        <i class="fa fa-angle-right mx-1"></i>
        <span class="cursor-pointer hover:text-indigo-600">课程</span>
        <i class="fa fa-angle-right mx-1"></i>
        <span class="font-medium text-slate-900">第 1 章</span>
      </nav>`
  },
  {
    id: 'pagination',
    cat: 'nav',
    zh: '分页器',
    en: 'Pagination',
    alias: ['分页', '翻页'],
    plain: '列表底部那排「上一页 1 2 3 下一页」的页码按钮',
    desc: '数据太多时分成多页显示，用户手动翻页。',
    prompt:
      '在列表底部添加 Pagination 分页器：包含上一页、页码 1–5、下一页，当前页码高亮，在第一页时「上一页」不可用。',
    demo: `<div class="flex items-center gap-1">
        <button class="${P}" onclick="D.page(this,'-')" aria-label="上一页">‹</button>
        ${[1, 2, 3, 4, 5]
          .map(function (n) {
            return `<button class="pg ${P} ${n === 1 ? 'bg-indigo-600 text-white' : ''}" onclick="D.page(this,${n})">${n}</button>`
          })
          .join('')}
        <button class="${P}" onclick="D.page(this,'+')" aria-label="下一页">›</button>
      </div>`
  },
  {
    id: 'dropdown',
    cat: 'nav',
    zh: '下拉菜单',
    en: 'Dropdown Menu',
    alias: ['Dropdown', '下拉'],
    plain: '点一下按钮，下面展开一列可以点的操作选项',
    desc: '把不常用的操作收起来，节省空间。常见于头像菜单、「更多」按钮。',
    prompt:
      '点击右上角头像时展开 Dropdown 下拉菜单，包含「个人资料 / 设置 / 退出登录」三项，鼠标悬停时该项高亮，点击菜单外部自动收起。',
    demo: `<div class="relative mt-4 self-start">
        <button class="${G}" onclick="D.tog(this,'.dm')">我的账号 <i class="fa fa-angle-down"></i></button>
        <ul class="dm absolute left-0 top-full mt-1 hidden w-32 rounded-lg border bg-white py-1 text-xs shadow-lg" onclick="D.tog(this,'.dm')">
          <li class="cursor-pointer px-3 py-1.5 hover:bg-indigo-50">个人资料</li>
          <li class="cursor-pointer px-3 py-1.5 hover:bg-indigo-50">设置</li>
          <li class="cursor-pointer px-3 py-1.5 text-rose-600 hover:bg-rose-50">退出登录</li>
        </ul>
      </div>`
  },
  {
    id: 'drawer',
    cat: 'nav',
    zh: '抽屉',
    en: 'Drawer',
    alias: ['侧边抽屉', 'Side Sheet', 'Offcanvas'],
    plain: '从屏幕侧边滑出来的面板，像拉开抽屉一样，常用来放筛选、设置或详情',
    desc: '能放比弹窗更多的内容，同时保留对原页面的感知。',
    prompt:
      '点击「筛选」按钮时从页面右侧滑出一个 Drawer 抽屉面板，宽度 320px，带滑入动画和半透明遮罩，点击遮罩或关闭按钮收起。',
    demo: `<button class="${B}" onclick="D.drawer(this)">打开抽屉</button>
      <div class="mk absolute inset-0 hidden bg-black/30" onclick="D.drawer(this)"></div>
      <aside class="dr absolute inset-y-0 right-0 w-40 translate-x-full bg-white p-3 text-xs shadow-xl transition-transform duration-300">
        <div class="mb-2 font-semibold">筛选条件</div>
        <p class="mb-3 text-slate-500">我是从右边滑出来的。</p>
        <button class="${G}" onclick="D.drawer(this)">关闭</button>
      </aside>`
  },
  {
    id: 'hamburger',
    cat: 'nav',
    zh: '汉堡菜单',
    en: 'Hamburger Menu',
    alias: ['汉堡按钮', '三道杠'],
    plain: '手机网页角落那个三条杠的菜单按钮，点一下才展开导航',
    desc: '小屏幕放不下完整导航时，把它收进一个图标里。',
    prompt:
      '在移动端（屏幕宽度小于 768px）把导航链接收进 Hamburger Menu 汉堡菜单：右上角显示三条杠图标，点击后展开纵向导航列表。',
    demo: `<div class="absolute inset-0 bg-white">
        <div class="flex h-10 items-center justify-between border-b px-3">
          <b class="text-xs text-indigo-600">Logo</b>
          <button onclick="D.tog(this,'.hm')" aria-label="菜单"><i class="fa fa-bars text-lg"></i></button>
        </div>
        <ul class="hm hidden divide-y border-b text-xs">
          <li class="px-3 py-2">首页</li><li class="px-3 py-2">课程</li><li class="px-3 py-2">关于</li>
        </ul>
        <p class="p-3 text-xs text-slate-400">点右上角的「三条杠」试试。</p>
      </div>`
  },
  {
    id: 'stepper',
    cat: 'nav',
    zh: '步骤条',
    en: 'Stepper',
    alias: ['Steps', '分步引导', '向导'],
    plain: '一排带数字的圆圈连成线，告诉你一共几步、现在做到第几步',
    desc: '把复杂流程拆成几步，例如注册、下单、填写长表单。',
    prompt:
      '在下单流程顶部加一个 Stepper 步骤条，共三步「填写 / 支付 / 完成」，已完成和当前步骤为蓝色，未完成为灰色，点击「下一步」推进。',
    demo: `<div class="text-center">
        <div class="mb-4 flex items-center text-xs">
          <span class="st flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white">1</span><span class="mx-1">填写</span>
          <span class="mx-1 h-px w-5 bg-slate-300"></span>
          <span class="st flex h-7 w-7 items-center justify-center rounded-full bg-slate-200">2</span><span class="mx-1">支付</span>
          <span class="mx-1 h-px w-5 bg-slate-300"></span>
          <span class="st flex h-7 w-7 items-center justify-center rounded-full bg-slate-200">3</span><span class="mx-1">完成</span>
        </div>
        <button class="${G}" onclick="D.step(this)">下一步</button>
      </div>`
  },
  {
    id: 'backtop',
    cat: 'nav',
    zh: '回到顶部',
    en: 'Back to Top',
    alias: ['返回顶部', 'Scroll to Top'],
    plain: '页面往下滚一段后，右下角出现的向上箭头按钮，点一下回到最上面',
    desc: '长页面的便捷操作，通常滚动一段距离后才出现。',
    prompt:
      '添加 Back to Top 回到顶部按钮：页面向下滚动超过一屏后在右下角淡入一个圆形向上箭头按钮，点击后平滑滚动回页面顶部。',
    demo: `<div class="absolute inset-0">
        <div class="sc h-full space-y-3 overflow-y-auto p-3 text-xs text-slate-500" onscroll="D.q(this,'.bt').classList.toggle('hidden',this.scrollTop<40)">
          <p class="font-medium text-slate-700">在这里向下滚动 ↓</p>${FILLER.repeat(10)}
        </div>
        <button class="bt absolute bottom-3 right-3 hidden h-9 w-9 rounded-full bg-indigo-600 text-white shadow-lg" onclick="D.q(this,'.sc').scrollTo({top:0,behavior:'smooth'})" aria-label="回到顶部"><i class="fa fa-arrow-up"></i></button>
      </div>`
  },

  /* ---------------- 输入控件 ---------------- */
  {
    id: 'switch',
    cat: 'input',
    zh: '开关',
    en: 'Switch',
    alias: ['Toggle', '切换开关'],
    plain: '像手机设置里那种左右滑动的小开关，点一下开、再点一下关',
    desc: '用于立即生效的二选一设置，例如开启通知、深色模式。',
    prompt:
      '把「接收通知」做成 Switch 开关：关闭时灰色、开启时蓝色，圆形滑块带左右滑动的过渡动画，切换后立即生效无需点保存。',
    demo: `<label class="flex cursor-pointer items-center gap-3">
        <input type="checkbox" class="peer sr-only" onchange="D.q(this,'.sw').textContent=T(this.checked?'已开启':'已关闭')">
        <span class="relative h-6 w-11 rounded-full bg-slate-300 transition after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:bg-indigo-600 peer-checked:after:translate-x-5"></span>
        <span class="sw text-xs">已关闭</span>
      </label>`
  },
  {
    id: 'checkbox',
    cat: 'input',
    zh: '复选框',
    en: 'Checkbox',
    alias: ['多选框', '勾选框'],
    plain: '可以打勾的小方框，一组里面能同时勾选好几个',
    desc: '用于多选，或单独一个表示「同意 / 不同意」。',
    prompt:
      '「兴趣爱好」使用 Checkbox 复选框，提供「阅读 / 运动 / 音乐」三个选项，允许多选，点击文字也能勾选。',
    demo: `<div class="space-y-2 text-sm">
        <div class="text-xs text-slate-400">兴趣爱好（可多选）</div>
        <label class="flex items-center gap-2"><input type="checkbox" checked class="accent-indigo-600"> 阅读</label>
        <label class="flex items-center gap-2"><input type="checkbox" class="accent-indigo-600"> 运动</label>
        <label class="flex items-center gap-2"><input type="checkbox" class="accent-indigo-600"> 音乐</label>
      </div>`
  },
  {
    id: 'radio',
    cat: 'input',
    zh: '单选框',
    en: 'Radio Button',
    alias: ['Radio', '单选按钮'],
    plain: '可以点选的小圆圈，一组里面只能选中一个，选了这个另一个就取消',
    desc: '用于几个互斥选项里选一个，选项较少时比下拉框更直观。',
    prompt:
      '「配送方式」使用 Radio 单选框，提供「快递 / 自提 / 同城配送」三个选项，只能选择其中一个，默认选中第一个。',
    demo: `<div class="space-y-2 text-sm">
        <div class="text-xs text-slate-400">配送方式（只能选一个）</div>
        <label class="flex items-center gap-2"><input type="radio" name="demo-radio" checked class="accent-indigo-600"> 快递</label>
        <label class="flex items-center gap-2"><input type="radio" name="demo-radio" class="accent-indigo-600"> 自提</label>
        <label class="flex items-center gap-2"><input type="radio" name="demo-radio" class="accent-indigo-600"> 同城配送</label>
      </div>`
  },
  {
    id: 'select',
    cat: 'input',
    zh: '下拉选择框',
    en: 'Select',
    alias: ['选择器', '下拉框'],
    plain: '点一下展开一列选项，选中一个后收起并显示在框里',
    desc: '选项较多（超过 5 个）时用它代替单选框，省空间。',
    prompt:
      '「所在城市」使用 Select 下拉选择框，默认显示「请选择城市」，展开后列出城市列表，选中后显示在框内。',
    demo: `<select class="${I} !w-44">
        <option>请选择城市</option><option>北京</option><option>上海</option><option>广州</option><option>深圳</option>
      </select>`
  },
  {
    id: 'slider',
    cat: 'input',
    zh: '滑块',
    en: 'Slider',
    alias: ['Range', '滑动条'],
    plain: '一根横线上有个可以左右拖的圆点，用来调音量、价格范围这种数值',
    desc: '在一个范围内快速选数值，不要求特别精确时使用。',
    prompt:
      '用 Slider 滑块调节音量，范围 0–100，拖动时右侧实时显示当前数值，滑块和已选轨道为蓝色。',
    demo: `<div class="flex items-center gap-3 text-xs">
        <i class="fa fa-volume-up text-slate-400"></i>
        <input type="range" min="0" max="100" value="40" class="w-40 accent-indigo-600" oninput="D.q(this,'.sv').textContent=this.value">
        <span class="sv w-6 font-mono">40</span>
      </div>`
  },
  {
    id: 'placeholder',
    cat: 'input',
    zh: '占位符',
    en: 'Placeholder',
    alias: ['占位文字', '提示文字'],
    plain: '输入框里灰色的提示字，一开始打字它就消失',
    desc: '提示该填什么或填写格式，但不能代替输入框的标题。',
    prompt:
      '给手机号输入框加上 Placeholder 占位符「请输入 11 位手机号」，文字为浅灰色，用户开始输入后自动消失。',
    demo: `<input class="${I} !w-52" placeholder="请输入 11 位手机号">`
  },
  {
    id: 'autocomplete',
    cat: 'input',
    zh: '自动补全',
    en: 'Autocomplete',
    alias: ['搜索建议', '联想输入', 'Typeahead'],
    plain: '在输入框打字时，下面自动列出可能想输入的内容，点一下就填进去',
    desc: '减少打字、避免输错，搜索框和地址输入最常见。',
    prompt:
      '城市输入框支持 Autocomplete 自动补全：用户输入时在下方显示匹配的城市建议列表，点击某项后填入输入框并关闭列表。',
    demo: `<div class="relative mt-4 w-48 self-start">
        <input class="${I}" placeholder="试试输入「州」" oninput="D.ac(this)">
        <ul class="acl absolute inset-x-0 top-full mt-1 hidden overflow-hidden rounded-lg border bg-white text-xs shadow">
          ${['北京', '上海', '广州', '深圳', '杭州', '苏州', '成都']
            .map(function (c) {
              return `<li class="hidden cursor-pointer px-3 py-1.5 hover:bg-indigo-50" onclick="D.acPick(this)">${c}</li>`
            })
            .join('')}
        </ul>
      </div>`
  },
  {
    id: 'chip',
    cat: 'input',
    zh: '标签',
    en: 'Tag',
    alias: ['Chip', '胶囊标签', '徽章'],
    plain: '圆角小胶囊形状的词，用来标记分类或已选条件，旁边常带个小叉可以删掉',
    desc: '展示分类、状态或用户已选择的多个条目。',
    prompt:
      '已选的筛选条件用 Tag 标签（Chip）展示：圆角胶囊样式、浅蓝底深蓝字，每个标签右侧有关闭图标，点击可移除该标签。',
    demo: `<div class="flex flex-wrap justify-center gap-2 px-4">
        ${['设计', '前端', 'AI', '产品', '运营']
          .map(function (x) {
            return `<span class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-700">${x}<button onclick="this.parentElement.remove()" aria-label="移除"><i class="fa fa-times"></i></button></span>`
          })
          .join('')}
      </div>`
  },
  {
    id: 'validation',
    cat: 'input',
    zh: '表单校验',
    en: 'Form Validation',
    alias: ['输入校验', '错误提示', 'Inline Validation'],
    plain: '填错的时候输入框变红，下面出现一行红字告诉你哪里不对',
    desc: '在提交前就告诉用户哪里填错了、该怎么改。',
    prompt:
      '给邮箱输入框加实时表单校验（Form Validation）：格式错误时边框变红并在下方显示红色错误文字，格式正确时边框变绿并显示对勾。',
    demo: `<div class="w-52">
        <input class="${I}" placeholder="请输入邮箱" oninput="D.valid(this)">
        <p class="vm mt-1 h-4 text-xs"></p>
      </div>`
  },
  {
    id: 'rating',
    cat: 'input',
    zh: '评分',
    en: 'Rating',
    alias: ['星级评分', 'Rate'],
    plain: '一排五颗星星，点第几颗就是打几分',
    desc: '收集或展示用户的满意度。',
    prompt:
      '添加 Rating 星级评分组件：5 颗星，点击第 N 颗时前 N 颗变为金色，右侧显示当前分数。',
    demo: `<div class="flex items-center gap-1">
        ${[1, 2, 3, 4, 5]
          .map(function (n) {
            return `<i class="fa fa-star cursor-pointer text-2xl text-slate-300 transition" onclick="D.rate(this,${n})"></i>`
          })
          .join('')}
        <span class="rt ml-2 w-10 text-xs text-slate-500">未评分</span>
      </div>`
  },
  {
    id: 'dropzone',
    cat: 'input',
    zh: '拖拽上传',
    en: 'Dropzone',
    alias: ['Drag & Drop Upload', '上传区'],
    plain: '一个虚线框，把文件从电脑里拖进去就能上传，也可以点它来选文件',
    desc: '比单纯的「选择文件」按钮更直观，适合上传图片和文档。',
    prompt:
      '做一个 Dropzone 拖拽上传区域：虚线边框、中间是上传图标和提示文字，文件拖到上方时边框高亮变蓝，松手后显示文件名，点击也能选择文件。',
    demo: `<div class="w-full px-4">
        <label class="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 py-6 text-xs text-slate-500 transition"
          ondragover="event.preventDefault();this.classList.add('border-indigo-500','bg-indigo-50')"
          ondragleave="this.classList.remove('border-indigo-500','bg-indigo-50')"
          ondrop="event.preventDefault();D.drop(this,event.dataTransfer.files)">
          <i class="fa fa-cloud-upload text-2xl"></i>
          <span class="dt">把文件拖到这里，或点击选择</span>
          <input type="file" class="hidden" onchange="D.drop(this.parentElement,this.files)">
        </label>
      </div>`
  },
  {
    id: 'datepicker',
    cat: 'input',
    zh: '日期选择器',
    en: 'Date Picker',
    alias: ['日历选择', '日期控件'],
    plain: '点输入框弹出一个小日历，点某一天就把日期填进去',
    desc: '避免用户手打日期造成的格式错误。',
    prompt:
      '「出生日期」使用 Date Picker 日期选择器：点击输入框弹出日历面板，可切换年月，选中日期后以 YYYY-MM-DD 格式填入。',
    demo: `<input type="date" class="${I} !w-44">`
  },

  /* ---------------- 内容展示 ---------------- */
  {
    id: 'card',
    cat: 'display',
    zh: '卡片',
    en: 'Card',
    alias: ['卡片布局'],
    plain: '一个带圆角和阴影的小方块，里面装着图片、标题、简介和按钮',
    desc: '把一组相关信息打包成一个独立单元，常排成网格展示。',
    prompt:
      '课程列表用 Card 卡片展示：每张卡片圆角带轻微阴影，上方是封面图，下方是标题、一行简介和「查看详情」链接，悬停时阴影加深。',
    demo: `<div class="w-44 overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
        <div class="h-14 bg-gradient-to-br from-indigo-400 to-fuchsia-400"></div>
        <div class="p-3">
          <div class="text-xs font-semibold">AI 编程入门</div>
          <p class="mb-2 text-[11px] text-slate-500">图片、标题、说明装在一个盒子里。</p>
          <button class="text-xs text-indigo-600">查看详情 →</button>
        </div>
      </div>`
  },
  {
    id: 'accordion',
    cat: 'display',
    zh: '手风琴',
    en: 'Accordion',
    alias: ['折叠面板', 'Collapse', 'FAQ'],
    plain: '点击标题（问题）展开下面的内容（答案），再点收起；常见问题页面最常用',
    desc: '把大段内容折叠起来，用户只展开自己关心的部分。',
    prompt:
      '「常见问题」用 Accordion 手风琴展示：每个问题是一行可点击的标题，点击展开答案并旋转右侧箭头，同一时间只展开一项。',
    demo: `<div class="w-full px-4 text-xs">
        <details name="demo-acc" open class="group border-b py-2">
          <summary class="flex cursor-pointer list-none justify-between font-medium">可以退款吗？<i class="fa fa-angle-down transition group-open:rotate-180"></i></summary>
          <p class="mt-1 text-slate-500">7 天内可无理由退款。</p>
        </details>
        <details name="demo-acc" class="group border-b py-2">
          <summary class="flex cursor-pointer list-none justify-between font-medium">需要编程基础吗？<i class="fa fa-angle-down transition group-open:rotate-180"></i></summary>
          <p class="mt-1 text-slate-500">不需要，零基础可学。</p>
        </details>
        <details name="demo-acc" class="group py-2">
          <summary class="flex cursor-pointer list-none justify-between font-medium">如何联系客服？<i class="fa fa-angle-down transition group-open:rotate-180"></i></summary>
          <p class="mt-1 text-slate-500">点击右下角的在线客服。</p>
        </details>
      </div>`
  },
  {
    id: 'carousel',
    cat: 'display',
    zh: '轮播图',
    en: 'Carousel',
    alias: ['Slider', 'Swiper', 'Banner 轮播', '幻灯片'],
    plain: '一组图片自动或手动左右切换，首页顶部那种滚动大广告图',
    desc: '在有限空间里轮流展示多张图片或多条内容。',
    prompt:
      '首页顶部做一个 Carousel 轮播图：3 张横幅图，每 3 秒自动切换，带左右箭头和底部圆点指示器，切换时有滑动动画，悬停时暂停。',
    demo: `<div class="relative h-28 w-56 overflow-hidden rounded-xl text-white">
        <div class="cs flex h-full transition-transform duration-500">
          <div class="flex h-full w-56 shrink-0 items-center justify-center bg-indigo-500 text-2xl font-bold">1</div>
          <div class="flex h-full w-56 shrink-0 items-center justify-center bg-emerald-500 text-2xl font-bold">2</div>
          <div class="flex h-full w-56 shrink-0 items-center justify-center bg-amber-500 text-2xl font-bold">3</div>
        </div>
        <button class="absolute left-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-black/30" onclick="D.car(this,-1)" aria-label="上一张">‹</button>
        <button class="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-black/30" onclick="D.car(this,1)" aria-label="下一张">›</button>
        <div class="absolute inset-x-0 bottom-2 flex justify-center gap-1">
          <span class="dot h-1.5 w-1.5 rounded-full bg-white"></span>
          <span class="dot h-1.5 w-1.5 rounded-full bg-white opacity-50"></span>
          <span class="dot h-1.5 w-1.5 rounded-full bg-white opacity-50"></span>
        </div>
      </div>`
  },
  {
    id: 'avatar',
    cat: 'display',
    zh: '头像',
    en: 'Avatar',
    alias: ['头像组', 'Avatar Group'],
    plain: '代表用户的圆形小图片，没有照片时显示名字的第一个字；多个叠在一起叫头像组',
    desc: '标识用户身份，头像组用来表示「有哪些人参与」。',
    prompt:
      '用 Avatar 头像组展示参与成员：圆形头像带白色描边、相互重叠排列，无头像时显示姓名首字，超过 3 人时最后显示「+5」。',
    demo: `<div class="flex -space-x-2 text-sm font-medium text-white">
        <span class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 ring-2 ring-white">王</span>
        <span class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">李</span>
        <span class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 ring-2 ring-white">张</span>
        <span class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300 text-xs text-slate-600 ring-2 ring-white">+5</span>
      </div>`
  },
  {
    id: 'lightbox',
    cat: 'display',
    zh: '灯箱',
    en: 'Lightbox',
    alias: ['图片预览', '大图查看', 'Image Viewer'],
    plain: '点小图后，背景变黑、图片放大显示在屏幕中间，再点一下关掉',
    desc: '不离开当前页面查看大图。',
    prompt:
      '图片支持 Lightbox 灯箱预览：点击缩略图后全屏显示黑色半透明背景，大图居中并带放大动画，点击背景或按 Esc 关闭。',
    demo: `<div class="text-center">
        <div class="mx-auto h-16 w-24 cursor-zoom-in rounded-lg bg-gradient-to-br from-sky-400 to-emerald-400" onclick="D.tog(this,'.lb')"></div>
        <p class="mt-2 text-xs text-slate-400">点击缩略图放大</p>
      </div>
      <div class="lb absolute inset-0 flex hidden cursor-zoom-out items-center justify-center bg-black/80" onclick="D.tog(this,'.lb')">
        <div class="h-32 w-52 rounded-lg bg-gradient-to-br from-sky-400 to-emerald-400"></div>
      </div>`
  },
  {
    id: 'infinite',
    cat: 'display',
    zh: '无限滚动',
    en: 'Infinite Scroll',
    alias: ['滚动加载', '上拉加载', '瀑布流加载'],
    plain: '刷到底部自动加载更多内容，永远刷不完，像刷短视频、朋友圈那样',
    desc: '代替分页器，适合信息流这类「随便逛逛」的内容。',
    prompt:
      '列表使用 Infinite Scroll 无限滚动：滚动到距离底部 100px 时自动请求并追加下一页数据，加载时底部显示「加载中」，全部加载完显示「没有更多了」。',
    demo: `<div class="absolute inset-0 overflow-y-auto bg-white text-xs" onscroll="D.inf(this)">
        <ul class="divide-y">
          ${[1, 2, 3, 4, 5, 6, 7, 8]
            .map(function (n) {
              return `<li class="px-3 py-2">第 ${n} 条内容</li>`
            })
            .join('')}
        </ul>
        <p class="more py-2 text-center text-slate-400">滚到底部自动加载更多…</p>
      </div>`
  },
  {
    id: 'truncate',
    cat: 'display',
    zh: '文本截断',
    en: 'Truncate',
    alias: ['省略号', 'Ellipsis', '展开收起'],
    plain: '文字太长放不下时，末尾变成三个点「…」，常配一个「展开」按钮',
    desc: '保持布局整齐，避免长文本把页面撑乱。',
    prompt:
      '简介文字超过一行时做 Truncate 文本截断：超出部分显示省略号，下方提供「展开 / 收起」按钮切换显示全文。',
    demo: `<div class="w-52 text-xs">
        <p class="tr truncate">这是一段非常非常长的课程简介文字，一行肯定是放不下的，所以后面的内容会被省略掉。</p>
        <button class="mt-2 text-indigo-600" onclick="D.tog(this,'.tr','truncate')">展开 / 收起</button>
      </div>`
  },
  {
    id: 'sticky',
    cat: 'display',
    zh: '吸顶',
    en: 'Sticky',
    alias: ['粘性定位', '固定表头', 'Sticky Header'],
    plain: '页面滚动时，某个栏目滚到顶就固定在顶部不动，不会跟着滚走',
    desc: '让导航、表头、操作栏在滚动时始终可见。',
    prompt:
      '把分类栏做成 Sticky 吸顶效果：正常时随页面滚动，滚动到视口顶部后固定在顶部并出现底部阴影。',
    demo: `<div class="absolute inset-0 overflow-y-auto bg-white text-xs">
        <p class="p-3 font-medium">在这里向下滚动 ↓</p>
        <div class="sticky top-0 bg-indigo-600 px-3 py-2 text-white shadow">我滚到顶部后就吸住不动</div>
        <div class="space-y-3 p-3 text-slate-500">${FILLER.repeat(10)}</div>
      </div>`
  },

  /* ---------------- 状态与动效 ---------------- */
  {
    id: 'hover',
    cat: 'state',
    zh: '悬停',
    en: 'Hover',
    alias: ['鼠标悬停', '悬浮态', 'Hover State'],
    plain: '鼠标移到某个东西上面（还没点）时，它变色、浮起来或出现阴影',
    desc: '告诉用户「这个东西可以点」。注意：触屏设备没有悬停。',
    prompt:
      '给卡片添加 Hover 悬停效果：鼠标移入时卡片上浮 4px、阴影加深、边框变为蓝色，过渡时长 300ms。',
    demo: `<div class="cursor-pointer rounded-xl border bg-white px-5 py-4 text-xs transition duration-300 hover:-translate-y-1 hover:border-indigo-400 hover:text-indigo-600 hover:shadow-lg">把鼠标移到我身上</div>`
  },
  {
    id: 'focus',
    cat: 'state',
    zh: '聚焦',
    en: 'Focus',
    alias: ['焦点', '焦点态', 'Focus Ring'],
    plain: '点进输入框或按 Tab 键选中某个元素时，它外面亮起来的那圈光环',
    desc: '标示键盘当前正在操作哪个元素，对无障碍访问很重要。',
    prompt:
      '输入框 Focus 聚焦时边框变为蓝色，并在外侧显示一圈 4px 的浅蓝色光环（focus ring），带过渡动画。',
    demo: `<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200" placeholder="点我，看外圈光环">`
  },
  {
    id: 'active',
    cat: 'state',
    zh: '按下态',
    en: 'Active',
    alias: ['Pressed', '点击态', '按压效果'],
    plain: '鼠标按住按钮还没松开的那一瞬间，按钮缩小或颜色变深',
    desc: '给点击一个即时的「按下去了」的手感反馈。',
    prompt:
      '给按钮添加 Active 按下态：按住时按钮缩小到 90%、背景色加深、阴影消失，松开后恢复。',
    demo: `<button class="rounded-xl bg-indigo-600 px-5 py-3 text-sm text-white shadow-lg transition active:scale-90 active:bg-indigo-800 active:shadow-none">按住我不放</button>`
  },
  {
    id: 'disabled',
    cat: 'state',
    zh: '禁用态',
    en: 'Disabled',
    alias: ['不可用', '置灰'],
    plain: '按钮是灰色的，点了没反应，要满足某个条件后才能点',
    desc: '表示当前不能操作，最好同时让用户知道原因。',
    prompt:
      '「注册」按钮默认为 Disabled 禁用态：灰色背景、鼠标指针显示为禁止符号、点击无效；勾选「同意协议」后才变为可点击的蓝色。',
    demo: `<div class="space-y-3 text-center text-xs">
        <label class="flex items-center gap-2"><input type="checkbox" class="accent-indigo-600" onchange="D.q(this,'.db').disabled=!this.checked"> 我已阅读并同意协议</label>
        <button disabled class="db ${B} disabled:cursor-not-allowed disabled:bg-slate-300">注册</button>
      </div>`
  },
  {
    id: 'transition',
    cat: 'state',
    zh: '过渡动画',
    en: 'Transition',
    alias: ['过渡', '缓动', 'Animation'],
    plain: '东西不是「啪」一下变过去，而是平滑地慢慢变过去',
    desc: '让状态变化更自然，帮助用户看清「发生了什么」。',
    prompt:
      '给这个元素的位置变化加上 Transition 过渡动画，时长 500ms，缓动函数 ease-in-out，不要瞬间跳变。',
    demo: `<div class="w-full px-6 text-xs">
        <div class="mb-1 text-slate-400">没有过渡</div>
        <div class="mb-2 h-7"><div class="bx h-7 w-7 rounded-lg bg-slate-400"></div></div>
        <div class="mb-1 text-slate-400">有过渡</div>
        <div class="mb-3 h-7"><div class="bx h-7 w-7 rounded-lg bg-indigo-600 transition-transform duration-500"></div></div>
        <button class="${G}" onclick="D.qa(this,'.bx').forEach(function(b){b.classList.toggle('translate-x-40')})">移动</button>
      </div>`
  },
  {
    id: 'dnd',
    cat: 'state',
    zh: '拖拽排序',
    en: 'Drag and Drop',
    alias: ['拖放', 'DnD', 'Sortable'],
    plain: '按住一个东西不放，把它拖到别的位置再松手，用来调整顺序',
    desc: '直接操作对象来排序或移动，看板和列表排序最常见。',
    prompt:
      '任务列表支持 Drag and Drop 拖拽排序：每项左侧有拖拽手柄，拖动时该项半透明，其他项实时让位，松手后保存新顺序。',
    demo: `<ul class="w-44 space-y-1 text-xs">
        ${['写需求文档', '画原型图', '让 AI 写代码']
          .map(function (x) {
            return `<li draggable="true" class="flex cursor-grab items-center gap-2 rounded-lg border bg-white px-3 py-2" ondragstart="D.drag=this;this.classList.add('opacity-40')" ondragend="this.classList.remove('opacity-40');D.drag=null" ondragover="event.preventDefault();D.over(this,event)"><i class="fa fa-bars text-slate-300"></i>${x}</li>`
          })
          .join('')}
        <li class="pt-1 text-center text-slate-400">拖动调整顺序（电脑端）</li>
      </ul>`
  },
  {
    id: 'contextmenu',
    cat: 'state',
    zh: '右键菜单',
    en: 'Context Menu',
    alias: ['上下文菜单', '快捷菜单'],
    plain: '点鼠标右键时，在鼠标位置弹出的操作菜单',
    desc: '提供与当前对象相关的快捷操作，适合工具类应用。',
    prompt:
      '在文件列表上实现自定义 Context Menu 右键菜单：右键点击时在鼠标位置显示「复制 / 重命名 / 删除」菜单，点击其他位置关闭。',
    demo: `<div class="absolute inset-0 flex items-center justify-center text-xs text-slate-400" oncontextmenu="event.preventDefault();D.ctx(this,event)" onclick="this.querySelector('.cm').classList.add('hidden')">
        在这片区域点鼠标右键
        <ul class="cm absolute hidden w-28 rounded-lg border bg-white py-1 text-slate-700 shadow-lg">
          <li class="cursor-pointer px-3 py-1.5 hover:bg-indigo-50">复制</li>
          <li class="cursor-pointer px-3 py-1.5 hover:bg-indigo-50">重命名</li>
          <li class="cursor-pointer px-3 py-1.5 text-rose-600 hover:bg-rose-50">删除</li>
        </ul>
      </div>`
  },
  {
    id: 'fab',
    cat: 'state',
    zh: '悬浮按钮',
    en: 'FAB',
    alias: ['Floating Action Button', '浮动按钮'],
    plain: '一直漂在屏幕右下角的圆形按钮，通常是个加号，用来发帖或新建',
    desc: '把页面最重要的那个操作固定在最顺手的位置。',
    prompt:
      '在页面右下角添加一个 FAB 悬浮按钮（Floating Action Button）：圆形、蓝色、带加号图标和阴影，固定定位不随页面滚动，悬停时放大。',
    demo: `<div class="absolute inset-0 bg-white p-3 text-xs text-slate-400">
        页面内容…
        <button class="absolute bottom-3 right-3 h-11 w-11 rounded-full bg-indigo-600 text-white shadow-lg transition hover:scale-110" aria-label="新建"><i class="fa fa-plus"></i></button>
      </div>`
  },
  {
    id: 'overlay',
    cat: 'state',
    zh: '遮罩层',
    en: 'Overlay',
    alias: ['Backdrop', 'Mask', '蒙层', '蒙版'],
    plain: '弹窗出现时盖住整个页面的那层半透明黑色，有时还带毛玻璃模糊',
    desc: '把注意力集中到弹出的内容上，并阻止操作下层页面。',
    prompt:
      '弹窗打开时显示 Overlay 遮罩层：覆盖整个页面的 50% 透明黑色背景，带背景模糊（backdrop-blur），点击遮罩关闭弹窗。',
    demo: `<div class="absolute inset-0 p-3 text-xs text-slate-500">
        <p class="mb-3">这是下层的页面内容。遮罩出现后，它会变暗、变模糊，而且点不到。</p>
        <button class="${G}" onclick="D.tog(this,'.ok')">显示遮罩</button>
        <div class="ok absolute inset-0 flex hidden items-center justify-center bg-black/50 text-white backdrop-blur-sm" onclick="D.tog(this,'.ok')">点击任意处关闭</div>
      </div>`
  },
  {
    id: 'responsive',
    cat: 'state',
    zh: '响应式布局',
    en: 'Responsive',
    alias: ['自适应', 'Responsive Design', '断点'],
    plain: '同一个网页在电脑上并排显示，到手机上自动变成一列往下排',
    desc: '让页面在不同屏幕宽度下都好用，不用单独做手机版。',
    prompt:
      '卡片列表做成 Responsive 响应式布局：桌面端（≥1024px）一行 3 列，平板（≥768px）一行 2 列，手机端 1 列，间距保持一致。',
    demo: `<div class="w-full px-3 text-xs">
        <input type="range" min="30" max="100" value="100" class="w-full accent-indigo-600" oninput="D.q(this,'.rs').style.width=this.value+'%'" aria-label="屏幕宽度">
        <div class="rs mx-auto mt-2 flex flex-wrap gap-2 rounded-lg border border-indigo-300 p-2" style="width:100%">
          <div class="h-6 min-w-[72px] flex-1 rounded bg-indigo-300"></div>
          <div class="h-6 min-w-[72px] flex-1 rounded bg-indigo-300"></div>
          <div class="h-6 min-w-[72px] flex-1 rounded bg-indigo-300"></div>
        </div>
        <p class="mt-1 text-center text-slate-400">向左拖动滑块，模拟屏幕变窄</p>
      </div>`
  },

  /* ---------------- 导航（补充） ---------------- */
  {
    id: 'sidebar',
    cat: 'nav',
    zh: '侧边栏',
    en: 'Sidebar',
    alias: ['侧边导航', 'Side Nav', '左侧菜单'],
    plain: '后台系统左边那一竖条菜单，可以收起来只剩图标',
    desc: '入口很多的后台、工具类产品常用它代替顶部导航栏。',
    prompt:
      '后台页面使用左侧 Sidebar 侧边栏导航：宽 220px，每项为图标加文字，当前页高亮，底部有收起按钮，收起后只显示图标（宽 64px）。',
    vs: '入口少的官网、内容站用顶部 Navbar；临时出现的侧边面板是 Drawer。',
    spec: [
      '菜单项、分组与顺序，是否有二级菜单',
      '能否收起；收起状态是否记住',
      '不同角色（权限）看到的菜单是否不同',
      '移动端如何呈现（通常改为抽屉）'
    ],
    demo: `<div class="absolute inset-0 flex bg-white text-xs">
        <aside class="w-24 shrink-0 space-y-1 border-r bg-slate-50 p-2 transition-all">
          <div class="flex items-center gap-2 rounded bg-indigo-100 px-2 py-1.5 text-indigo-700"><i class="fa fa-home"></i><span class="sl">首页</span></div>
          <div class="flex items-center gap-2 rounded px-2 py-1.5"><i class="fa fa-bar-chart"></i><span class="sl">数据</span></div>
          <div class="flex items-center gap-2 rounded px-2 py-1.5"><i class="fa fa-cog"></i><span class="sl">设置</span></div>
        </aside>
        <div class="flex-1 p-3 text-slate-400">
          <p class="mb-3">页面内容…</p>
          <button class="${G}" onclick="var a=D.q(this,'aside');a.classList.toggle('w-24');a.classList.toggle('w-10');D.qa(this,'.sl').forEach(function(x){x.classList.toggle('hidden')})">收起 / 展开</button>
        </div>
      </div>`
  },

  /* ---------------- 页面区块 ---------------- */
  {
    id: 'hero',
    cat: 'section',
    zh: '首屏',
    en: 'Hero',
    alias: ['Hero Section', '头图区', '首屏大图'],
    plain: '打开网站第一眼看到的那一大块：大标题、一句介绍、一两个按钮，旁边或背后配张大图',
    desc: '决定用户几秒内是否继续往下看，是落地页最重要的区块。',
    prompt:
      '页面顶部做一个 Hero 首屏区块：左侧是大标题、一句副标题和「免费开始 / 观看演示」两个按钮，右侧是产品截图，移动端改为上下排列。',
    spec: [
      '主标题与副标题文案（一句话讲清产品价值）',
      '主按钮、次按钮的文案与跳转目标',
      '配图或视频的内容',
      '移动端的排布方式'
    ],
    ref: ['supahero', 'saaspo'],
    demo: `<div class="absolute inset-0 flex items-center gap-3 bg-white p-4">
        <div class="flex-1">
          <div class="text-base font-bold leading-tight text-slate-900">让 AI 帮你把想法变成产品</div>
          <p class="my-2 text-[11px] text-slate-500">零基础也能做出自己的网站。</p>
          <div class="flex gap-2 text-[11px]">
            <button class="rounded bg-indigo-600 px-2 py-1 text-white">免费开始</button>
            <button class="rounded border px-2 py-1">观看演示</button>
          </div>
        </div>
        <div class="h-24 w-28 shrink-0 rounded-lg bg-gradient-to-br from-indigo-300 to-fuchsia-300"></div>
      </div>`
  },
  {
    id: 'cta',
    cat: 'section',
    zh: '行动号召',
    en: 'CTA',
    alias: ['Call to Action', '转化按钮', '行动按钮'],
    plain: '页面里最想让你点的那个按钮或那一条横幅，比如「免费试用」「立即购买」',
    desc: '把用户引向你最希望他完成的那一个动作，一个页面只应有一个主目标。',
    prompt:
      '在页面底部加一个 CTA 行动号召区块：通栏蓝色背景，居中显示一句标题、一行说明和一个白色的「立即免费试用」按钮。',
    spec: [
      '希望用户完成的唯一目标动作是什么',
      '按钮文案（动词开头）与跳转目标',
      '在页面中出现几次、分别在什么位置'
    ],
    ref: ['saaspo'],
    demo: `<div class="w-full px-4">
        <div class="rounded-xl bg-indigo-600 p-5 text-center text-white">
          <div class="font-semibold">准备好开始了吗？</div>
          <p class="my-1 text-[11px] text-white/80">注册即可免费试用 14 天</p>
          <button class="mt-1 rounded-lg bg-white px-4 py-1.5 text-xs font-medium text-indigo-600 transition hover:scale-105">立即免费试用</button>
        </div>
      </div>`
  },
  {
    id: 'features',
    cat: 'section',
    zh: '功能介绍区',
    en: 'Feature Section',
    alias: ['Features', '特性区', '卖点区'],
    plain: '几个小图标配标题和一句话，并排介绍产品有哪些功能或卖点',
    desc: '用最短的篇幅回答「这个产品能帮我做什么」。',
    prompt:
      '做一个 Feature Section 功能介绍区：三列布局，每列包含一个圆形图标、功能标题和一句说明，移动端变为单列。',
    spec: [
      '列出几个卖点（建议 3–6 个）及其优先级',
      '每个卖点的标题与一句话说明',
      '是否可点击进入详情'
    ],
    ref: ['saaspo'],
    demo: `<div class="grid w-full grid-cols-3 gap-2 px-3 text-center text-[11px]">
        ${[
          ['bolt', '上手快', '十分钟做出第一个页面'],
          ['shield', '更安全', '数据全程加密存储'],
          ['users', '可协作', '多人实时一起编辑']
        ]
          .map(function (f) {
            return `<div><div class="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600"><i class="fa fa-${f[0]}"></i></div><div class="font-semibold text-slate-900">${f[1]}</div><p class="text-slate-500">${f[2]}</p></div>`
          })
          .join('')}
      </div>`
  },
  {
    id: 'pricing',
    cat: 'section',
    zh: '定价表',
    en: 'Pricing Table',
    alias: ['Pricing', '套餐对比', '价格方案'],
    plain: '几个套餐并排放，列出价格和包含的功能，中间那个常标着「推荐」',
    desc: '帮用户快速比较并选定套餐，通常会突出最想卖的那一个。',
    prompt:
      '做一个 Pricing Table 定价表：三个套餐卡片并排，中间的「专业版」带「推荐」角标并高亮，顶部有「月付 / 年付」切换，切换后价格随之变化。',
    spec: [
      '套餐数量、名称、价格与计费周期（月付 / 年付）',
      '每个套餐的权益列表，哪个是推荐套餐',
      '按钮文案与点击后的流程（注册、支付、联系销售）',
      '优惠信息如何展示（年付折扣、限时价）'
    ],
    ref: ['saaspo'],
    demo: `<div class="w-full px-3 text-center text-[11px]">
        <button class="mb-2 rounded-full border bg-white px-3 py-0.5" onclick="var d=this.closest('[data-demo]');d.dataset.y=d.dataset.y?'':'1';D.qa(this,'.pv').forEach(function(p){p.textContent=d.dataset.y?p.dataset.y:p.dataset.m});this.textContent=T(d.dataset.y?'当前：年付（点击切换）':'当前：月付（点击切换）')">当前：月付（点击切换）</button>
        <div class="grid grid-cols-3 items-end gap-2">
          <div class="rounded-lg border bg-white p-2"><div>免费版</div><div class="pv text-base font-bold text-slate-900" data-m="¥0" data-y="¥0">¥0</div><div class="text-slate-400">基础功能</div></div>
          <div class="rounded-lg border-2 border-indigo-600 bg-white p-2 pb-4"><div class="mx-auto mb-1 w-fit rounded-full bg-indigo-600 px-2 text-[10px] text-white">推荐</div><div>专业版</div><div class="pv text-base font-bold text-indigo-600" data-m="¥39" data-y="¥390">¥39</div><div class="text-slate-400">全部功能</div></div>
          <div class="rounded-lg border bg-white p-2"><div>团队版</div><div class="pv text-base font-bold text-slate-900" data-m="¥99" data-y="¥990">¥99</div><div class="text-slate-400">多人协作</div></div>
        </div>
      </div>`
  },
  {
    id: 'testimonial',
    cat: 'section',
    zh: '客户评价',
    en: 'Testimonials',
    alias: ['用户证言', '口碑墙', 'Social Proof'],
    plain: '带头像和名字的用户好评，用引号括起来的一段话',
    desc: '借别人的口来证明产品可信，比自己夸自己更有说服力。',
    prompt:
      '做一个 Testimonials 客户评价区块：卡片内是一段带引号的评价文字，下方是用户头像、姓名和职位，多条评价排成三列。',
    spec: [
      '评价内容来源，是否已获得用户授权',
      '展示哪些信息：头像、姓名、公司、职位',
      '展示数量与排列方式（网格、轮播、滚动墙）'
    ],
    ref: ['saaspo'],
    demo: `<div class="w-56 rounded-xl border bg-white p-4 text-xs shadow-sm">
        <i class="fa fa-quote-left text-indigo-300"></i>
        <p class="my-2 text-slate-600">用了一周，我们团队的原型产出速度快了一倍。</p>
        <div class="flex items-center gap-2">
          <span class="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">林</span>
          <div><div class="font-semibold text-slate-900">林小姐</div><div class="text-[10px] text-slate-400">某公司 产品经理</div></div>
        </div>
      </div>`
  },
  {
    id: 'logocloud',
    cat: 'section',
    zh: 'Logo 墙',
    en: 'Logo Cloud',
    alias: ['客户 Logo', '合作伙伴', 'Logo Wall'],
    plain: '一排灰色的公司商标，上面写着「他们都在用」',
    desc: '用知名客户或合作伙伴的商标快速建立信任，常紧跟在首屏下面。',
    prompt:
      '在首屏下方加一个 Logo Cloud 客户 Logo 墙：一行小标题「已有 1000+ 团队在使用」，下面是一排统一为灰色的客户 Logo，悬停时恢复彩色。',
    spec: [
      '展示哪些客户或伙伴，是否已获得授权',
      'Logo 数量、排序与统一的显示样式（灰度 / 彩色）',
      '是否可点击跳转到客户案例'
    ],
    ref: ['saaspo'],
    demo: `<div class="px-4 text-center text-xs">
        <p class="mb-3 text-slate-400">已有 1000+ 团队在使用</p>
        <div class="flex flex-wrap justify-center gap-x-5 gap-y-2 font-semibold text-slate-400">
          ${[
            ['cube', '方块科技'],
            ['leaf', '绿叶'],
            ['paper-plane', '纸飞机'],
            ['diamond', '钻石云'],
            ['bolt', '闪电']
          ]
            .map(function (l) {
              return `<span class="transition hover:text-indigo-600"><i class="fa fa-${l[0]}"></i> ${l[1]}</span>`
            })
            .join('')}
        </div>
      </div>`
  },
  {
    id: 'bento',
    cat: 'section',
    zh: '便当盒布局',
    en: 'Bento Grid',
    alias: ['Bento', '宫格布局', '不规则网格'],
    plain: '大小不一的圆角方块拼成一整块，像日式便当盒的格子',
    desc: '用格子大小区分信息的主次，适合一屏内展示多个卖点。',
    prompt:
      '用 Bento Grid 便当盒布局展示功能亮点：圆角卡片组成的不规则网格，其中一张大卡片占两列，其余为小卡片，间距统一，移动端变为单列。',
    spec: [
      '一共几格，每格放什么内容',
      '哪一格最重要（占最大面积）',
      '移动端的排列顺序'
    ],
    ref: ['saaspo', 'seesaw'],
    demo: `<div class="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-2 p-3 text-xs font-medium text-white">
        <div class="col-span-2 flex items-center justify-center rounded-xl bg-indigo-500">主打功能</div>
        <div class="flex items-center justify-center rounded-xl bg-fuchsia-400">数据</div>
        <div class="flex items-center justify-center rounded-xl bg-amber-400">协作</div>
        <div class="col-span-2 flex items-center justify-center rounded-xl bg-emerald-500">集成与扩展</div>
      </div>`
  },
  {
    id: 'stats',
    cat: 'section',
    zh: '数据指标区',
    en: 'Stats',
    alias: ['数字展示', 'Metrics', 'KPI 卡片'],
    plain: '几个特别大的数字并排，下面配小字说明，比如「10 万+ 用户」',
    desc: '用数字证明实力；在后台里则是展示核心指标的卡片。',
    prompt:
      '做一个 Stats 数据指标区：三组数据并排，每组是加粗的大数字加一行灰色说明，进入视口时数字从 0 滚动增长到目标值。',
    spec: [
      '展示哪几个指标，数据来源与口径',
      '数据是写死的还是实时更新，多久更新一次',
      '数值很大时的显示规则（万、亿、千分位）'
    ],
    ref: ['saaspo'],
    demo: `<div class="grid w-full grid-cols-3 px-3 text-center">
        <div><div class="text-xl font-bold text-indigo-600">10 万+</div><div class="text-[11px] text-slate-500">注册用户</div></div>
        <div><div class="text-xl font-bold text-indigo-600">99.9%</div><div class="text-[11px] text-slate-500">服务可用性</div></div>
        <div><div class="text-xl font-bold text-indigo-600">4.9</div><div class="text-[11px] text-slate-500">用户评分</div></div>
      </div>`
  },
  {
    id: 'footer',
    cat: 'section',
    zh: '页脚',
    en: 'Footer',
    alias: ['底部栏', '网站底部'],
    plain: '网页最底下那块深色区域，放着一堆链接、联系方式和版权信息',
    desc: '收纳次要但必须有的入口：关于我们、帮助、协议、备案号。',
    prompt:
      '做一个深色背景的 Footer 页脚：上方分三列展示「产品 / 支持 / 公司」链接，底部一行是版权信息和备案号，移动端各列纵向堆叠。',
    spec: [
      '链接分组与每组包含的入口',
      '必须展示的合规信息：版权、备案号、协议',
      '是否包含订阅邮箱、社交媒体、语言切换'
    ],
    ref: ['saaspo', 'seesaw'],
    demo: `<div class="absolute inset-0 flex flex-col bg-white text-[11px]">
        <p class="flex-1 p-3 text-slate-400">页面内容…</p>
        <footer class="bg-slate-900 p-3 text-slate-400">
          <div class="grid grid-cols-3 gap-2">
            <div><div class="mb-1 text-white">产品</div>功能<br>定价</div>
            <div><div class="mb-1 text-white">支持</div>帮助中心<br>联系我们</div>
            <div><div class="mb-1 text-white">公司</div>关于我们<br>加入我们</div>
          </div>
          <div class="mt-2 border-t border-slate-700 pt-2 text-[10px]">© 2026 示例公司 · 用户协议 · 隐私政策</div>
        </footer>
      </div>`
  }
]

/* ============================================================
 * 3.1 产品经理视角的补充：易混淆对比（vs）与 PRD / 评审要点（spec）
 *     也可以像上面的「页面区块」那样直接写在术语对象里
 * ============================================================ */
var PM = {
  modal: {
    vs: '内容多、需要对照原页面时用 Drawer；只是补充说明用 Popover；不需要用户做决定用 Toast。',
    spec: [
      '触发：点击哪个元素、满足什么条件时打开',
      '关闭：点遮罩、关闭按钮、Esc 是否都能关；有未保存内容时怎么处理',
      '按钮：主次按钮的文案，点击后的行为与跳转',
      '异常：提交失败时弹窗是否保留、错误如何提示'
    ]
  },
  toast: {
    vs: '需要用户确认或做决定用 Modal；需要一直显示用 Alert。',
    spec: [
      '文案：成功、失败、警告各自的提示文案',
      '位置与时长：出现在哪里，停留几秒',
      '多条同时出现时：堆叠、排队还是覆盖',
      '是否带操作，如「撤销」'
    ]
  },
  tooltip: {
    vs: '内容多或需要点击操作用 Popover。',
    spec: [
      '触发元素与提示文案（建议不超过一行）',
      '出现方向，空间不足时是否自动换向',
      '移动端没有悬停：改为点击显示，还是不显示'
    ]
  },
  popover: {
    vs: '只有一句说明用 Tooltip；需要强制处理用 Modal。',
    spec: [
      '触发方式：点击还是悬停',
      '内容：标题、正文、可操作项',
      '关闭方式：点击外部、再次点击按钮、内部关闭按钮',
      '位置：相对触发元素的方向，是否跟随滚动'
    ]
  },
  popconfirm: {
    vs: '后果严重或需要填写理由时用 Modal。',
    spec: [
      '哪些操作需要二次确认（删除、退出、覆盖等不可逆操作）',
      '确认文案要说明后果，而不只是「确定吗」',
      '确认、取消后各自的行为与反馈'
    ]
  },
  alert: {
    vs: '短暂反馈用 Toast；必须立即处理用 Modal。',
    spec: [
      '类型与颜色：信息、成功、警告、错误',
      '展示位置与范围：全站顶部还是某个模块内',
      '能否关闭；关闭后多久再次出现',
      '是否带链接或操作按钮'
    ]
  },
  skeleton: {
    vs: '等待很短或区域很小用 Spinner；能算出进度用 Progress Bar。',
    spec: [
      '哪些区域使用骨架屏',
      '骨架形状是否对应真实内容的布局',
      '加载超时或失败时显示什么（重试入口）'
    ]
  },
  spinner: {
    vs: '整块内容加载用 Skeleton；能算出进度用 Progress Bar。',
    spec: [
      '哪些操作会出现加载状态',
      '加载期间能否重复点击或进行其他操作',
      '超时时间与超时后的提示'
    ]
  },
  progress: {
    vs: '无法估算进度时用 Spinner。',
    spec: [
      '进度如何计算（按文件大小、按步骤数）',
      '能否取消或暂停',
      '完成与失败后的表现'
    ]
  },
  badge: {
    vs: '承载文字分类用 Tag。',
    spec: [
      '显示数字还是只显示红点',
      '数量上限的显示规则（如 99+）',
      '何时消失：点击后、查看后还是全部已读后'
    ]
  },
  empty: {
    spec: [
      '区分三种情况：首次使用无数据、搜索无结果、加载失败',
      '每种情况的文案与插图',
      '引导操作：按钮文案与跳转目标'
    ]
  },
  navbar: {
    vs: '入口很多的后台类产品用 Sidebar。',
    spec: [
      '包含哪些入口及顺序，当前页如何高亮',
      '登录前后的差异（登录按钮 / 头像）',
      '滚动时是否固定在顶部',
      '移动端如何收起（见汉堡菜单）'
    ]
  },
  tabs: {
    vs: '步骤有先后顺序用 Stepper；内容需要同时看到用手风琴或直接平铺。',
    spec: [
      '有哪些标签、默认选中哪个',
      '切换后是否保留各标签内的状态（滚动位置、已填内容）',
      '标签太多放不下时：横向滚动还是收进「更多」',
      '当前标签是否体现在链接中（刷新后保持）'
    ]
  },
  breadcrumb: {
    spec: [
      '层级来源：按页面层级还是按访问路径',
      '哪些层级可点击',
      '层级过深或名称过长时如何省略'
    ]
  },
  pagination: {
    vs: '信息流类内容用 Infinite Scroll；需要定位和回看时用分页。',
    spec: [
      '每页条数，是否允许用户修改',
      '是否显示总数、是否支持跳转到指定页',
      '筛选或排序变化后是否回到第一页'
    ]
  },
  dropdown: {
    vs: '「选一个值」用 Select；这里是「执行一个操作」。',
    spec: [
      '菜单项列表、顺序与分组',
      '危险操作（如删除）是否标红并二次确认',
      '不可用的菜单项：隐藏还是置灰'
    ]
  },
  drawer: {
    vs: '内容简短、需强制处理用 Modal；内容很多且独立时用新页面。',
    spec: [
      '从哪一侧滑出、宽度多少',
      '关闭方式；有未保存内容时是否拦截',
      '打开后下层页面能否继续操作（是否有遮罩）'
    ]
  },
  hamburger: {
    spec: [
      '在多大的屏幕宽度下出现',
      '展开形式：下拉、全屏还是侧边抽屉',
      '展开后包含哪些入口，是否有二级菜单'
    ]
  },
  stepper: {
    vs: '各部分没有先后顺序用 Tabs。',
    spec: [
      '共几步、每步名称',
      '能否跳步或返回修改，返回后数据是否保留',
      '中途退出是否保存草稿'
    ]
  },
  backtop: {
    spec: [
      '滚动多远后出现',
      '位置，是否与其他悬浮按钮（客服、FAB）冲突'
    ]
  },
  switch: {
    vs: '需要点「保存」才生效的表单里用 Checkbox。',
    spec: [
      '开与关各自的含义与默认值',
      '切换后是否立即生效；失败时是否回滚并提示',
      '关闭时是否需要二次确认（如关闭重要通知）'
    ]
  },
  checkbox: {
    vs: '只能选一个用 Radio；立即生效的开关用 Switch。',
    spec: [
      '选项列表与默认勾选项',
      '最少、最多可选几个',
      '是否需要「全选」'
    ]
  },
  radio: {
    vs: '选项超过 5 个用 Select；可多选用 Checkbox。',
    spec: [
      '选项列表与默认选中项',
      '是否允许不选',
      '选中后是否联动显示其他字段'
    ]
  },
  select: {
    vs: '选项少于 5 个时用 Radio 更直观。',
    spec: [
      '选项来源：固定列表还是接口返回',
      '默认值与占位文案',
      '是否支持搜索、多选；选项很多时如何处理'
    ]
  },
  slider: {
    spec: [
      '最小值、最大值、步长与默认值',
      '是否需要同时支持直接输入数字',
      '是单点还是范围（双滑块）'
    ]
  },
  placeholder: {
    vs: '必须一直可见的说明应写成标题或辅助文字，而不是占位符。',
    spec: [
      '每个输入框的占位文案',
      '格式要求是否需要常驻显示（占位符在输入后会消失）'
    ]
  },
  autocomplete: {
    spec: [
      '建议数据的来源，输入几个字后开始提示',
      '最多显示几条，如何排序',
      '无匹配结果时显示什么；是否允许输入列表外的值'
    ]
  },
  chip: {
    vs: '提示数量或新消息用 Badge。',
    spec: [
      '标签来源：固定、用户自建还是系统生成',
      '能否删除、能否点击筛选',
      '数量过多时：换行、滚动还是折叠成 +N'
    ]
  },
  validation: {
    spec: [
      '每个字段的校验规则与对应的错误文案',
      '校验时机：输入时、失去焦点时还是提交时',
      '提交失败后是否自动定位到第一个错误项'
    ]
  },
  rating: {
    spec: [
      '几分制，是否支持半星',
      '评分后能否修改',
      '是否必须同时填写文字评价'
    ]
  },
  dropzone: {
    spec: [
      '支持的文件类型、大小与数量上限',
      '上传中、成功、失败各状态的表现',
      '能否删除或重新上传；不符合要求时的提示'
    ]
  },
  datepicker: {
    spec: [
      '可选范围（如不能选过去的日期）',
      '选单日还是日期范围，是否包含时间',
      '默认值与显示格式'
    ]
  },
  card: {
    spec: [
      '卡片包含哪些信息、优先级如何',
      '整卡可点击还是仅按钮可点击',
      '标题过长、图片缺失时的处理'
    ]
  },
  accordion: {
    vs: '各部分同等重要且需频繁切换用 Tabs。',
    spec: [
      '默认展开哪一项',
      '是否允许同时展开多项',
      '内容很长时是否限制高度'
    ]
  },
  carousel: {
    spec: [
      '图片数量上限与排序规则',
      '是否自动播放、间隔几秒、悬停是否暂停',
      '每张图点击后跳转到哪里',
      '只有一张时是否隐藏箭头和指示点'
    ]
  },
  avatar: {
    spec: [
      '无头像时的默认显示（首字、默认图）',
      '点击头像后的行为',
      '头像组最多显示几个，超出如何展示'
    ]
  },
  lightbox: {
    spec: [
      '是否支持多图左右切换',
      '是否支持缩放、下载',
      '关闭方式：点背景、关闭按钮、Esc'
    ]
  },
  infinite: {
    vs: '需要跳到指定位置或看到总量时用 Pagination。',
    spec: [
      '每次加载多少条，距离底部多远时触发',
      '加载中、加载失败、全部加载完的提示',
      '返回列表时是否恢复到之前的滚动位置'
    ]
  },
  truncate: {
    spec: [
      '最多显示几行或多少字',
      '查看全文的方式：展开、悬停提示还是进详情页'
    ]
  },
  sticky: {
    spec: [
      '哪个元素吸顶，从什么位置开始',
      '多个吸顶元素同时存在时的层叠关系',
      '移动端是否保留（会占用屏幕高度）'
    ]
  },
  hover: {
    spec: [
      '哪些元素有悬停效果，效果是什么',
      '移动端没有悬停，对应的信息如何呈现'
    ]
  },
  focus: {
    spec: [
      '页面打开时是否自动聚焦到某个输入框',
      'Tab 键切换的顺序是否符合预期'
    ]
  },
  active: {
    spec: ['按下反馈的形式（缩放、变色）', '是否需要防止重复点击']
  },
  disabled: {
    vs: '用户完全无权使用的功能，考虑直接隐藏而不是禁用。',
    spec: [
      '在什么条件下禁用、什么条件下恢复',
      '是否需要告诉用户禁用的原因（提示文字或 Tooltip）'
    ]
  },
  transition: {
    spec: [
      '哪些变化需要动画，时长大约多少',
      '是否尊重系统的「减少动态效果」设置'
    ]
  },
  dnd: {
    spec: [
      '哪些元素可拖、可以放到哪里',
      '拖动过程中的视觉反馈',
      '松手后是否立即保存；移动端的替代方案'
    ]
  },
  contextmenu: {
    spec: [
      '在哪些对象上可以右键，菜单项有哪些',
      '移动端的替代方式（长按或「更多」按钮）',
      '是否保留浏览器默认的右键菜单'
    ]
  },
  fab: {
    spec: [
      '它代表哪一个最重要的操作',
      '位置，是否遮挡内容，滚动时是否隐藏'
    ]
  },
  overlay: {
    spec: [
      '透明度，是否模糊背景',
      '点击遮罩是否关闭',
      '出现时是否禁止下层页面滚动'
    ]
  },
  responsive: {
    spec: [
      '需要适配哪些设备（手机、平板、桌面）',
      '各宽度下的布局变化：几列、哪些内容隐藏或收起',
      '图片与表格在小屏下如何处理'
    ]
  }
}

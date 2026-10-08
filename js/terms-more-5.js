/* ============================================================
 * 术语扩充（四）：页面类型 / 常见流程
 * 这一批的实例是线框示意图：页面类型展示「由哪些区块组成」，
 * 流程展示「一共几步、每步用户看到什么」
 * ============================================================ */

/* ---------- 线框图小零件 ---------- */
// 灰色占位块，中间写着这一块是什么
function wfBox(label, cls) {
  return `<div class="flex items-center justify-center rounded bg-slate-200 text-[10px] text-slate-500 ${cls || ''}">${label}</div>`
}
// 假输入框、假按钮、小标题（流程示意用）
function wfInput(text) {
  return `<div class="mx-auto mb-1.5 w-40 rounded border px-2 py-1 text-left text-slate-400">${text}</div>`
}
function wfBtn(text) {
  return `<div class="mx-auto w-40 rounded bg-indigo-600 py-1 text-white">${text}</div>`
}
function wfTitle(text, sub) {
  return `<div class="mb-1.5 font-semibold text-slate-900">${text}</div>${sub ? `<p class="mb-1.5 text-slate-400">${sub}</p>` : ''}`
}
// 可点击的分步流程：steps = [[步骤名, 这一步的画面 HTML], ...]
function flowDemo(steps) {
  return `<div class="absolute inset-0 flex flex-col bg-white text-xs">
      <div class="flex items-center gap-1 overflow-hidden border-b bg-slate-50 px-2 py-1.5 text-[10px]">
        ${steps
          .map(function (s, i) {
            return `<span class="fl whitespace-nowrap rounded-full px-1.5 py-0.5 ${i ? 'text-slate-400' : 'bg-indigo-600 text-white'}">${i + 1} ${s[0]}</span>`
          })
          .join('<i class="fa fa-angle-right text-slate-300"></i>')}
      </div>
      <div class="flex flex-1 items-center justify-center p-2">
        ${steps
          .map(function (s, i) {
            return `<div class="fs w-full text-center ${i ? 'hidden' : ''}">${s[1]}</div>`
          })
          .join('')}
      </div>
      <div class="flex justify-between border-t px-3 py-1.5"><button class="text-slate-400" onclick="D.flow(this,-1)">‹ 上一步</button><button class="font-medium text-indigo-600" onclick="D.flow(this,1)">下一步 ›</button></div>
    </div>`
}
D.flow = function (el, dir) {
  var d = el.closest('[data-demo]')
  var screens = D.qa(el, '.fs')
  var i = (+d.dataset.f || 0) + dir
  if (i >= screens.length) i = 0
  if (i < 0) i = 0
  d.dataset.f = i
  screens.forEach(function (s, j) {
    s.classList.toggle('hidden', j !== i)
  })
  D.qa(el, '.fl').forEach(function (s, j) {
    s.classList.toggle('bg-indigo-600', j === i)
    s.classList.toggle('text-white', j === i)
    s.classList.toggle('text-slate-400', j !== i)
  })
}
D.master = function (el) {
  D.choose(el, 'bg-indigo-50 text-indigo-600')
  D.q(el, '.md').textContent = el.dataset.t
}
D.cart = function (el) {
  var total = 0
  D.qa(el, '.ci2').forEach(function (c) {
    if (c.checked) total += +c.dataset.n
  })
  D.q(el, '.ct2').textContent = '¥' + total
}

TERMS.push(
  /* ---------------- 页面类型 ---------------- */
  {
    id: 'landing',
    cat: 'page',
    zh: '落地页',
    en: 'Landing Page',
    alias: ['着陆页', '营销页', 'LP'],
    plain: '点广告或推广链接进去后看到的那个长页面，从上到下只为说服你做一件事：注册或购买',
    desc: '为一次推广、一个目标而做的单页。所有区块都服务于同一个转化动作。',
    prompt:
      '做一个产品 Landing Page 落地页，从上到下依次是：导航栏、首屏 Hero、客户 Logo 墙、功能介绍区、客户评价、定价表、行动号召 CTA、页脚；全页只有一个主按钮文案「免费试用」，并在多个区块重复出现。',
    vs: '官网首页要照顾多种访客、入口很多；落地页只有一个目标，通常连导航都会简化。',
    spec: [
      '流量从哪来、目标人群是谁（决定首屏说什么）',
      '唯一的转化目标是什么（注册、留资、下单）',
      '区块的先后顺序与每块要传达的一句话',
      '转化如何统计，是否做 A/B 测试'
    ],
    ref: ['saaspo', 'seesaw'],
    demo: `<div class="absolute inset-0 space-y-1.5 overflow-y-auto bg-white p-3">
        ${wfBox('导航栏', 'h-5')}${wfBox('首屏 Hero：标题 + 主按钮', 'h-14 !bg-indigo-100 !text-indigo-600')}${wfBox('客户 Logo 墙', 'h-5')}${wfBox('功能介绍区', 'h-10')}${wfBox('客户评价', 'h-8')}${wfBox('定价表', 'h-10')}${wfBox('行动号召 CTA', 'h-8 !bg-indigo-100 !text-indigo-600')}${wfBox('页脚', 'h-6')}
        <p class="text-center text-[10px] text-slate-400">向下滚动看完整结构</p>
      </div>`
  },
  {
    id: 'listpage',
    cat: 'page',
    zh: '列表页',
    en: 'List Page',
    alias: ['管理列表', '表格页', '查询页'],
    plain: '后台里最常见的一种页：上面是搜索和筛选，中间是一张表，底下是翻页',
    desc: '用来查找和管理一批同类数据：订单、用户、商品。后台产品里数量最多的页面。',
    prompt:
      '做一个订单管理 List Page 列表页：顶部是标题和「新建」按钮，下面是搜索框与筛选条件区，中间是数据表格（含批量勾选和每行操作），底部是分页器；筛选条件变化时表格即时刷新。',
    vs: '查看单条数据的全部信息是 Detail Page。',
    spec: [
      '默认展示哪些数据、按什么排序',
      '提供哪些搜索与筛选条件',
      '表格有哪些列，每行有哪些操作，是否支持批量操作',
      '空数据、加载中、无权限时的表现'
    ],
    demo: `<div class="absolute inset-0 space-y-1.5 bg-white p-3">
        <div class="flex gap-1.5">${wfBox('页面标题', 'h-5 flex-1')}${wfBox('+ 新建', 'h-5 w-12 !bg-indigo-100 !text-indigo-600')}</div>
        <div class="flex gap-1.5">${wfBox('搜索', 'h-6 flex-1')}${wfBox('筛选', 'h-6 w-12')}${wfBox('筛选', 'h-6 w-12')}</div>
        ${wfBox('表格：一行一条数据，行末是操作', 'h-20')}
        <div class="flex justify-end">${wfBox('分页器', 'h-5 w-24')}</div>
      </div>`
  },
  {
    id: 'detailpage',
    cat: 'page',
    zh: '详情页',
    en: 'Detail Page',
    alias: ['详情', '查看页', '单据详情'],
    plain: '在列表里点开某一条后看到的那一页，把这一条的所有信息都列出来',
    desc: '完整呈现一个对象：基本信息、当前状态、关联数据和可以对它做的操作。',
    prompt:
      '做一个订单 Detail Page 详情页：顶部是面包屑，接着是标题行（订单号、状态标签、右侧的操作按钮），下面用描述列表展示基本信息，再用标签页分别展示「商品明细 / 物流信息 / 操作记录」。',
    vs: '修改信息用编辑表单；详情页以只读展示为主。',
    spec: [
      '展示哪些信息，如何分组与排序',
      '不同状态下可用的操作按钮分别是什么',
      '有哪些关联数据（明细、日志、评论）',
      '数据不存在或无权查看时的表现'
    ],
    demo: `<div class="absolute inset-0 space-y-1.5 bg-white p-3">
        ${wfBox('面包屑', 'h-4 w-28')}
        <div class="flex gap-1.5">${wfBox('标题 + 状态标签', 'h-6 flex-1')}${wfBox('操作按钮', 'h-6 w-16 !bg-indigo-100 !text-indigo-600')}</div>
        ${wfBox('基本信息：描述列表', 'h-12')}
        ${wfBox('标签页：明细 / 物流 / 记录', 'h-5')}
        ${wfBox('当前标签页的内容', 'h-12')}
      </div>`
  },
  {
    id: 'masterdetail',
    cat: 'page',
    zh: '主从布局',
    en: 'Master-Detail',
    alias: ['双栏布局', '列表-详情', '收件箱布局'],
    plain: '像邮箱那样：左边一列是邮件列表，点哪一封，右边就显示那一封的内容，页面不跳转',
    desc: '列表和详情同屏显示，适合需要频繁切换查看的场景：邮件、消息、工单。',
    prompt:
      '消息页面采用 Master-Detail 主从布局：左侧窄栏为会话列表，右侧宽栏显示当前选中会话的内容，点击左侧列表项时右侧即时切换、选中项高亮；移动端改为先显示列表，点击后进入详情页。',
    vs: '列表和详情是两个独立页面、需要来回跳转的是「列表页 + 详情页」。',
    spec: [
      '左右两栏各自的宽度，能否拖动调整',
      '默认选中哪一项，未选中时右侧显示什么',
      '切换时右侧未保存的内容如何处理',
      '移动端如何呈现（通常拆成两页）'
    ],
    demo: `<div class="absolute inset-0 flex bg-white text-xs">
        <ul class="w-24 shrink-0 divide-y border-r">
          <li class="cursor-pointer px-2 py-2 bg-indigo-50 text-indigo-600" data-t="小王：需求文档我看完了，有两个问题想和你确认。" onclick="D.master(this)">小王</li>
          <li class="cursor-pointer px-2 py-2" data-t="小李：设计稿已更新，请查收。" onclick="D.master(this)">小李</li>
          <li class="cursor-pointer px-2 py-2" data-t="小张：好的，周五前给到。" onclick="D.master(this)">小张</li>
        </ul>
        <div class="flex-1 p-3"><div class="mb-1 text-[10px] text-slate-400">右侧显示选中项的内容</div><p class="md text-slate-700">小王：需求文档我看完了，有两个问题想和你确认。</p></div>
      </div>`
  },
  {
    id: 'settings',
    cat: 'page',
    zh: '设置页',
    en: 'Settings Page',
    alias: ['偏好设置', '账号设置', '配置页'],
    plain: '放各种开关和选项的那一页：改头像、改密码、通知要不要开，左边通常有分类',
    desc: '集中管理账号与偏好。项目多时按主题分组，并把危险操作单独放在最后。',
    prompt:
      '做一个 Settings Page 设置页：左侧为分类导航「账号 / 通知 / 隐私」，右侧为当前分类的设置项，每项包含标题、一行说明和右侧的控件（开关或按钮）；「注销账号」等危险操作放在页面底部并标红。',
    spec: [
      '有哪些设置项，如何分类',
      '每项是立即生效还是需要点「保存」',
      '默认值是什么',
      '危险操作（注销、清空数据）放在哪里、如何确认'
    ],
    demo: `<div class="absolute inset-0 flex bg-white text-xs">
        <ul class="w-16 shrink-0 space-y-1 border-r p-2"><li class="rounded bg-indigo-50 px-2 py-1 text-indigo-600">通知</li><li class="px-2 py-1">账号</li><li class="px-2 py-1">隐私</li></ul>
        <div class="flex-1 divide-y px-3">
          ${[
            ['消息通知', '有新评论时提醒我', true],
            ['邮件周报', '每周一发送数据周报', false],
            ['声音', '收到消息时播放提示音', true]
          ]
            .map(function (s) {
              return `<label class="flex cursor-pointer items-center justify-between py-2"><span><b class="block text-slate-900">${s[0]}</b><span class="text-[10px] text-slate-400">${s[1]}</span></span><input type="checkbox" ${s[2] ? 'checked' : ''} class="peer sr-only"><span class="relative h-4 w-7 rounded-full bg-slate-300 transition after:absolute after:left-0.5 after:top-0.5 after:h-3 after:w-3 after:rounded-full after:bg-white after:transition peer-checked:bg-indigo-600 peer-checked:after:translate-x-3"></span></label>`
            })
            .join('')}
        </div>
      </div>`
  },
  {
    id: 'profile',
    cat: 'page',
    zh: '个人中心',
    en: 'Profile Page',
    alias: ['我的', '个人主页', '用户中心'],
    plain: 'App 里「我的」那一页：最上面是头像和昵称，下面是我的订单、收藏、设置这些入口',
    desc: '用户个人信息与个人相关功能的总入口。',
    prompt:
      '做一个移动端 Profile Page 个人中心：顶部是头像、昵称和「编辑资料」入口，下方是一行数据统计（关注、粉丝、获赞），再往下是功能入口列表「我的订单 / 我的收藏 / 设置」，每行右侧有箭头。',
    vs: '别人看到的你的公开主页，和自己看到的「我的」页面，通常是两套设计。',
    spec: [
      '展示哪些个人信息，哪些可编辑',
      '有哪些功能入口，如何分组和排序',
      '未登录时这一页显示什么',
      '哪些入口需要显示红点或数量'
    ],
    demo: `<div class="absolute inset-0 bg-slate-100 text-xs">
        <div class="flex items-center gap-2 bg-indigo-600 p-3 text-white"><span class="flex h-10 w-10 items-center justify-center rounded-full bg-white/30 text-base">王</span><div><b>小王</b><div class="text-[10px] text-white/70">编辑资料 ›</div></div></div>
        <div class="grid grid-cols-3 bg-white py-1.5 text-center"><div><b class="text-slate-900">128</b><div class="text-[10px] text-slate-400">关注</div></div><div><b class="text-slate-900">56</b><div class="text-[10px] text-slate-400">粉丝</div></div><div><b class="text-slate-900">1.2k</b><div class="text-[10px] text-slate-400">获赞</div></div></div>
        <ul class="mt-1.5 divide-y bg-white"><li class="flex justify-between px-3 py-1.5"><span><i class="fa fa-file-text-o w-4 text-slate-400"></i> 我的订单</span><i class="fa fa-angle-right text-slate-300"></i></li><li class="flex justify-between px-3 py-1.5"><span><i class="fa fa-star-o w-4 text-slate-400"></i> 我的收藏</span><i class="fa fa-angle-right text-slate-300"></i></li><li class="flex justify-between px-3 py-1.5"><span><i class="fa fa-cog w-4 text-slate-400"></i> 设置</span><i class="fa fa-angle-right text-slate-300"></i></li></ul>
      </div>`
  },
  {
    id: 'searchresults',
    cat: 'page',
    zh: '搜索结果页',
    en: 'Search Results Page',
    alias: ['搜索页', '结果列表', 'SERP'],
    plain: '搜完之后看到的那一页：上面是你搜的词，下面一条条结果，你搜的字被标成了彩色',
    desc: '把搜到的内容按相关性排好，并帮用户继续缩小范围。',
    prompt:
      '做一个 Search Results Page 搜索结果页：顶部搜索框保留关键词，下方是类型标签「全部 / 文档 / 用户」和「共找到 N 条结果」，结果列表中每条包含标题、摘要和来源，命中的关键词高亮显示；无结果时给出修改建议。',
    spec: [
      '结果按什么排序（相关性、时间）',
      '每条结果展示哪些信息，关键词是否高亮',
      '是否按类型分组或提供筛选',
      '无结果时的提示与推荐（换个词、热门内容）'
    ],
    demo: `<div class="absolute inset-0 bg-white p-3 text-xs">
        <div class="mb-1.5 flex items-center gap-2 rounded-lg border px-2 py-1"><i class="fa fa-search text-slate-400"></i>原型</div>
        <div class="mb-1.5 flex gap-3 border-b pb-1 text-slate-400"><b class="text-indigo-600">全部</b><span>文档</span><span>用户</span><span class="ml-auto text-[10px]">共 3 条结果</span></div>
        <div class="mb-1.5"><b class="text-slate-900">如何快速画<mark class="bg-amber-200">原型</mark></b><p class="truncate text-slate-400">本文介绍三种画<mark class="bg-amber-200">原型</mark>的方法，适合零基础…</p></div>
        <div><b class="text-slate-900">低保真<mark class="bg-amber-200">原型</mark>模板</b><p class="truncate text-slate-400">一套可直接复用的线框图<mark class="bg-amber-200">原型</mark>组件…</p></div>
      </div>`
  },
  {
    id: 'productpage',
    cat: 'page',
    zh: '商品详情页',
    en: 'Product Detail Page',
    alias: ['PDP', '商详页', '宝贝详情'],
    plain: '电商里点开一个商品后的那一页：左边是大图，右边是名字、价格、选规格，还有「加入购物车」',
    desc: '电商转化的核心页面，要在一屏内回答：这是什么、多少钱、怎么买。',
    prompt:
      '做一个 Product Detail Page 商品详情页：左侧是商品主图和缩略图，右侧依次是商品标题、价格（含划线原价）、规格选择标签、数量步进器，以及「加入购物车」和「立即购买」两个按钮；下方是图文详情和用户评价。',
    spec: [
      '首屏必须展示哪些信息（图片、标题、价格、促销）',
      '规格如何选择，选中后价格、库存、图片是否联动',
      '缺货、下架、限购时的展示与按钮状态',
      '详情、评价、推荐的顺序'
    ],
    demo: `<div class="absolute inset-0 flex gap-3 bg-white p-3 text-xs">
        <div class="w-24 shrink-0"><div class="h-24 rounded-lg bg-gradient-to-br from-amber-200 to-rose-300"></div><div class="mt-1 flex gap-1"><span class="h-5 flex-1 rounded bg-slate-200 ring-1 ring-indigo-600"></span><span class="h-5 flex-1 rounded bg-slate-200"></span><span class="h-5 flex-1 rounded bg-slate-200"></span></div></div>
        <div class="flex-1"><b class="text-slate-900">纯棉基础款 T 恤</b><div class="my-1"><b class="text-base text-rose-600">¥79</b> <s class="text-slate-400">¥129</s></div>
          <div class="mb-1.5 flex gap-1"><span class="rounded border border-indigo-600 px-1.5 text-indigo-600">M</span><span class="rounded border px-1.5">L</span><span class="rounded border px-1.5">XL</span></div>
          <div class="space-y-1"><div class="rounded border border-indigo-600 py-1 text-center text-indigo-600">加入购物车</div><div class="rounded bg-indigo-600 py-1 text-center text-white">立即购买</div></div></div>
      </div>`
  },
  {
    id: 'cart',
    cat: 'page',
    zh: '购物车',
    en: 'Shopping Cart',
    alias: ['购物袋', 'Cart', '购物清单'],
    plain: '把想买的东西先放进去的那一页：能勾选、改数量、删除，最下面显示合计和「去结算」',
    desc: '下单前的暂存与确认。合计金额要随勾选和数量实时变化。',
    prompt:
      '做一个 Shopping Cart 购物车页面：每个商品一行，包含勾选框、缩略图、名称、规格、单价和数量步进器；底部固定栏显示「全选」、已选商品合计金额和「去结算」按钮，勾选或修改数量时合计实时更新。',
    spec: [
      '每个商品展示哪些信息，能做哪些操作（改数量、改规格、删除、移入收藏）',
      '合计的计算规则（优惠、运费何时计入）',
      '商品失效、缺货、涨价时如何提示',
      '未登录时能否加入购物车，登录后是否合并'
    ],
    demo: `<div class="absolute inset-0 flex flex-col bg-white text-xs">
        <ul class="flex-1 divide-y px-3">
          ${[
            ['纯棉 T 恤', 'M / 白色', 79, 'bg-amber-200'],
            ['帆布包', '米色', 59, 'bg-sky-200'],
            ['棒球帽', '黑色', 49, 'bg-rose-200']
          ]
            .map(function (g, i) {
              return `<li><label class="flex cursor-pointer items-center gap-2 py-1.5"><input type="checkbox" ${i < 2 ? 'checked' : ''} data-n="${g[2]}" class="ci2 accent-indigo-600" onchange="D.cart(this)"><span class="h-7 w-7 rounded ${g[3]}"></span><span class="flex-1"><b class="block text-slate-900">${g[0]}</b><span class="text-[10px] text-slate-400">${g[1]}</span></span><b>¥${g[2]}</b></label></li>`
            })
            .join('')}
        </ul>
        <div class="flex items-center justify-between border-t px-3 py-1.5">合计：<b class="ct2 mr-auto text-sm text-rose-600">¥138</b><span class="rounded-full bg-indigo-600 px-3 py-1 text-white">去结算</span></div>
      </div>`
  },
  {
    id: 'checkoutpage',
    cat: 'page',
    zh: '结算页',
    en: 'Checkout Page',
    alias: ['确认订单', '下单页', '订单确认页'],
    plain: '付款前最后确认的那一页：收货地址、买的东西、用哪种方式付，最下面是总价和「提交订单」',
    desc: '离成交最近的一页。每多一个要填的字段、每多一个疑问，都会流失一批用户。',
    prompt:
      '做一个 Checkout Page 结算页：从上到下依次是收货地址卡片、商品清单摘要、支付方式单选、金额明细（商品金额、运费、优惠、实付），底部固定栏显示实付金额和「提交订单」按钮。',
    vs: '购物车是「挑选和暂存」；结算页是「确认并付款」，不应再让用户改商品。',
    spec: [
      '需要用户填写或确认哪些信息（越少越好）',
      '金额明细如何展示（原价、优惠、运费、实付）',
      '支持哪些支付方式，默认选哪个',
      '提交失败（库存不足、价格变动、支付失败）时的处理'
    ],
    demo: `<div class="absolute inset-0 flex flex-col bg-slate-100 text-xs">
        <div class="flex-1 space-y-1.5 p-2">
          <div class="rounded bg-white px-2 py-1.5"><i class="fa fa-map-marker text-indigo-600"></i> 小王 138****8826<div class="text-[10px] text-slate-400">深圳市南山区某某路 1 号</div></div>
          <div class="rounded bg-white px-2 py-1.5">纯棉 T 恤 × 1、帆布包 × 1</div>
          <div class="rounded bg-white px-2 py-1.5"><label class="mr-3"><input type="radio" name="demo-pay" checked class="accent-indigo-600"> 微信支付</label><label><input type="radio" name="demo-pay" class="accent-indigo-600"> 支付宝</label></div>
          <div class="flex justify-between rounded bg-white px-2 py-1.5 text-slate-400"><span>商品 ¥138 · 运费 ¥0 · 优惠 −¥10</span></div>
        </div>
        <div class="flex items-center justify-between border-t bg-white px-3 py-1.5">实付 <b class="mr-auto text-sm text-rose-600">¥128</b><span class="rounded-full bg-indigo-600 px-3 py-1 text-white">提交订单</span></div>
      </div>`
  },
  {
    id: 'feed',
    cat: 'page',
    zh: '信息流',
    en: 'Feed',
    alias: ['动态流', '时间线', 'Timeline Feed'],
    plain: '一条接一条往下刷的内容，每条有头像、文字、图片，下面是点赞、评论、转发',
    desc: '社交和内容产品的主页形态。内容排序规则（时间还是推荐）决定了产品的气质。',
    prompt:
      '做一个 Feed 信息流页面：内容以卡片形式纵向排列，每张卡片包含作者头像和昵称、发布时间、正文、配图，以及底部的点赞、评论、转发按钮和数量；滚动到底部自动加载更多。',
    vs: '按用户主动搜索或筛选得到的是列表；信息流是系统推给用户的、刷不完的内容。',
    spec: [
      '内容按什么排序（时间倒序、算法推荐、混排）',
      '每条内容展示哪些信息，长文是否折叠',
      '有哪些互动操作',
      '加载更多与下拉刷新的规则，是否穿插广告'
    ],
    demo: `<div class="absolute inset-0 space-y-2 overflow-y-auto bg-slate-100 p-2 text-xs">
        ${[
          ['王', 'bg-indigo-500', '小王', '今天把新版首页的需求评审过了，下周开始开发。', true],
          ['李', 'bg-emerald-500', '小李', '分享一个画原型的小技巧：先定信息层级，再考虑样式。', false]
        ]
          .map(function (p) {
            return `<div class="rounded-lg bg-white p-2"><div class="mb-1 flex items-center gap-2"><span class="flex h-6 w-6 items-center justify-center rounded-full ${p[1]} text-white">${p[0]}</span><b class="text-slate-900">${p[2]}</b><span class="text-[10px] text-slate-400">2 小时前</span></div><p>${p[3]}</p>${p[4] ? '<div class="mt-1 h-12 rounded bg-gradient-to-br from-indigo-200 to-fuchsia-200"></div>' : ''}<div class="mt-1.5 flex gap-4 text-slate-400"><span><i class="fa fa-heart-o"></i> 12</span><span><i class="fa fa-comment-o"></i> 3</span><span><i class="fa fa-share"></i> 转发</span></div></div>`
          })
          .join('')}
      </div>`
  },
  {
    id: 'article',
    cat: 'page',
    zh: '文章页',
    en: 'Article Page',
    alias: ['内容页', '正文页', '博客文章'],
    plain: '读一篇文章的那一页：大标题、作者和时间、正文，读完下面有相关推荐',
    desc: '以阅读为中心的页面。行宽、字号、行距比任何装饰都重要。',
    prompt:
      '做一个 Article Page 文章页：正文区居中且最大宽度约 700px，顶部是大标题、作者头像与发布时间，正文使用较大字号和 1.8 倍行距，文末是点赞与分享按钮，下方是「相关文章」推荐列表。',
    spec: [
      '正文支持哪些格式（标题层级、图片、代码、引用）',
      '除正文外展示哪些信息（作者、时间、阅读量、标签）',
      '文末放什么（互动、评论、相关推荐、订阅）',
      '是否需要目录、阅读进度'
    ],
    demo: `<div class="absolute inset-0 overflow-y-auto bg-white px-6 py-3 text-xs">
        <h4 class="text-sm font-bold text-slate-900">写好一份 PRD 的三个习惯</h4>
        <div class="my-1.5 flex items-center gap-1.5 text-[10px] text-slate-400"><span class="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-white">王</span>小王 · 2026-10-08 · 阅读 5 分钟</div>
        <p class="leading-relaxed text-slate-600">先写清楚「为什么做」，再写「做什么」。很多返工都是因为背景没讲明白。</p>
        <p class="mt-1.5 leading-relaxed text-slate-600">每个交互都说出它的名字，并写明各种状态下的表现。</p>
        <div class="mt-2 border-t pt-1.5 text-slate-400">相关文章：如何做竞品分析 ›</div>
      </div>`
  },
  {
    id: 'helpcenter',
    cat: 'page',
    zh: '帮助中心',
    en: 'Help Center',
    alias: ['客服中心', '支持页', 'FAQ 页'],
    plain: '遇到问题时去的那一页：最上面一个大搜索框，下面是问题分类和常见问题，找不到还能联系客服',
    desc: '让用户自己解决问题，减少客服压力。搜索和分类是核心。',
    prompt:
      '做一个 Help Center 帮助中心首页：顶部是标题「有什么可以帮你？」和大号搜索框，下方是三个问题分类卡片（账号、支付、使用），再往下是「常见问题」列表，页面底部提供「联系客服」入口。',
    spec: [
      '问题如何分类',
      '搜索范围与无结果时的引导',
      '常见问题由谁维护、如何排序',
      '自助解决不了时的人工入口（在线客服、工单、电话）'
    ],
    demo: `<div class="absolute inset-0 bg-white p-3 text-center text-xs">
        <b class="text-slate-900">有什么可以帮你？</b>
        <div class="mx-auto my-1.5 flex w-44 items-center gap-2 rounded-full border px-3 py-1 text-slate-400"><i class="fa fa-search"></i>搜索问题</div>
        <div class="grid grid-cols-3 gap-1.5">${[['user-o', '账号'], ['credit-card', '支付'], ['book', '使用']].map(function (c) { return `<div class="rounded-lg border py-1.5"><i class="fa fa-${c[0]} text-indigo-600"></i><div>${c[1]}</div></div>` }).join('')}</div>
        <ul class="mt-1.5 divide-y text-left text-slate-600"><li class="py-1">如何修改绑定的手机号？</li><li class="py-1">付款后多久可以开发票？</li></ul>
        <div class="mt-1 text-indigo-600"><i class="fa fa-headphones"></i> 联系客服</div>
      </div>`
  },
  {
    id: 'docs',
    cat: 'page',
    zh: '文档页',
    en: 'Documentation Page',
    alias: ['三栏文档', '开发文档', '知识库页面'],
    plain: '看产品说明书的那种页面：左边是章节目录，中间是正文，右边是这一页的小标题',
    desc: '经典的三栏结构：左栏在整个文档里导航，右栏在当前页面里导航。',
    prompt:
      '做一个 Documentation Page 文档页，采用三栏布局：左侧为可折叠的章节目录树，中间为正文（最大宽度 760px），右侧为当前页面的小标题锚点导航；顶部有搜索框，正文底部有「上一篇 / 下一篇」。',
    spec: [
      '目录的层级与组织方式',
      '是否需要搜索、版本切换、多语言',
      '正文底部放什么（上下篇、反馈「是否有帮助」）',
      '移动端三栏如何收起'
    ],
    demo: `<div class="absolute inset-0 flex gap-2 bg-white p-2 text-[10px]">
        <div class="w-16 shrink-0 space-y-1 border-r pr-1.5 text-slate-500"><b class="block text-slate-900">开始使用</b><div class="rounded bg-indigo-50 px-1 text-indigo-600">快速上手</div><div class="px-1">安装</div><b class="block pt-1 text-slate-900">进阶</b><div class="px-1">自定义</div></div>
        <div class="flex-1 space-y-1.5"><b class="block text-xs text-slate-900">快速上手</b>${wfBox('正文段落', 'h-8')}${wfBox('代码块', 'h-8 !bg-slate-800 !text-slate-300')}${wfBox('正文段落', 'h-6')}<div class="flex justify-between text-indigo-600"><span>‹ 上一篇</span><span>下一篇 ›</span></div></div>
        <div class="w-12 shrink-0 space-y-1 border-l pl-1.5 text-slate-400"><b class="block text-slate-500">本页目录</b><div class="text-indigo-600">准备</div><div>第一步</div><div>第二步</div></div>
      </div>`
  },
  {
    id: 'changelog',
    cat: 'page',
    zh: '更新日志',
    en: 'Changelog',
    alias: ['版本记录', '更新记录', 'Release Notes'],
    plain: '按时间倒着排的一页，一段一段写着「几月几号，新增了什么、修复了什么」',
    desc: '告诉用户产品在持续变好，也是老用户了解新功能的固定去处。',
    prompt:
      '做一个 Changelog 更新日志页面：按时间倒序排列，每个版本包含版本号、发布日期和若干条更新内容，每条前面带彩色类型标签「新增 / 优化 / 修复」。',
    vs: '打开 App 时弹出的是 Update Prompt；更新日志是随时可查的历史记录。',
    spec: [
      '更新内容的分类（新增、优化、修复）',
      '写给谁看（用户还是开发者），用什么口吻',
      '是否配图或视频',
      '发布后如何通知用户'
    ],
    demo: `<div class="absolute inset-0 overflow-y-auto bg-white p-3 text-xs">
        ${[
          ['2.1', '2026-10-08', [['新增', 'bg-emerald-100 text-emerald-700', 'AI 生成原型'], ['优化', 'bg-sky-100 text-sky-700', '打开速度提升 30%']]],
          ['2.0', '2026-09-15', [['新增', 'bg-emerald-100 text-emerald-700', '团队空间'], ['修复', 'bg-amber-100 text-amber-700', '导出偶尔失败的问题']]]
        ]
          .map(function (v) {
            return `<div class="mb-2"><b class="text-slate-900">版本 ${v[0]}</b> <span class="text-[10px] text-slate-400">${v[1]}</span><ul class="mt-1 space-y-1">${v[2]
              .map(function (c) {
                return `<li><span class="mr-1 rounded px-1 text-[10px] ${c[1]}">${c[0]}</span>${c[2]}</li>`
              })
              .join('')}</ul></div>`
          })
          .join('')}
      </div>`
  },
  {
    id: 'maintenance',
    cat: 'page',
    zh: '维护页',
    en: 'Maintenance Page',
    alias: ['系统维护中', '停服公告', '升级中页面'],
    plain: '系统升级的时候打开网站，只看到一页「系统维护中，预计几点恢复」',
    desc: '计划内停机时用来替换整个网站的一页，重点是说清楚什么时候恢复。',
    prompt:
      '做一个 Maintenance Page 维护页：居中显示扳手图标、标题「系统维护中」、说明文字和预计恢复时间，下方提供客服联系方式；页面保持品牌配色，不显示任何功能入口。',
    vs: '意外出错显示的是 Error Page；维护页是计划内的、提前知道的。',
    spec: [
      '维护前是否提前公告（见公告条）',
      '文案：原因、预计恢复时间',
      '维护期间哪些功能仍可用',
      '恢复后是否通知用户'
    ],
    demo: `<div class="text-center">
        <i class="fa fa-wrench text-4xl text-slate-300"></i>
        <div class="mt-1 font-semibold text-slate-900">系统维护中</div>
        <p class="text-xs text-slate-500">我们正在升级服务，给你带来不便请谅解。</p>
        <p class="mt-2 inline-block rounded-full bg-amber-50 px-3 py-0.5 text-xs text-amber-700">预计今天 06:00 恢复</p>
      </div>`
  },

  /* ---------------- 常见流程 ---------------- */
  {
    id: 'signupflow',
    cat: 'flow',
    zh: '注册流程',
    en: 'Sign-up Flow',
    alias: ['注册', '开户流程', 'Registration'],
    plain: '第一次用一个产品时要走的那几步：填手机号、收验证码、设密码，然后才算有了账号',
    desc: '新用户的第一道门。每多一步、每多一个必填项，都会流失一部分人。',
    prompt:
      '实现手机号 Sign-up Flow 注册流程，共四步：输入手机号并勾选同意协议、输入短信验证码（60 秒后可重发）、设置密码、注册成功并自动登录进入首页；每一步都有返回和错误提示。',
    spec: [
      '支持哪些注册方式（手机、邮箱、第三方）',
      '必填信息有哪些（能晚点再问的就别在注册时问）',
      '手机号已注册、验证码错误或过期时的处理',
      '注册成功后去哪（首页、新手引导）'
    ],
    demo: flowDemo([
      ['手机号', wfTitle('注册账号') + wfInput('请输入手机号') + wfBtn('获取验证码')],
      ['验证码', wfTitle('输入验证码', '已发送至 138****8826') + wfInput('4 位验证码') + wfBtn('下一步')],
      ['设密码', wfTitle('设置密码') + wfInput('8–16 位，含字母和数字') + wfBtn('完成注册')],
      ['完成', '<i class="fa fa-check-circle text-3xl text-emerald-500"></i>' + wfTitle('注册成功', '正在进入首页…')]
    ])
  },
  {
    id: 'passwordreset',
    cat: 'flow',
    zh: '找回密码',
    en: 'Password Reset',
    alias: ['忘记密码', '重置密码', 'Forgot Password'],
    plain: '忘了密码时点「忘记密码」，验证一下是你本人，然后重新设一个新密码',
    desc: '每个有账号体系的产品都必须有，既要方便本人，又要防住别人。',
    prompt:
      '实现 Password Reset 找回密码流程：登录页点击「忘记密码」，输入注册手机号，通过短信验证码验证身份，设置新密码（需输入两次），成功后提示并跳转回登录页。',
    spec: [
      '入口在哪',
      '用什么验证身份（短信、邮箱、密保问题）',
      '账号不存在时如何提示（避免泄露谁注册过）',
      '重置成功后是否让其他设备下线'
    ],
    demo: flowDemo([
      ['填账号', wfTitle('找回密码') + wfInput('注册时的手机号') + wfBtn('下一步')],
      ['验证', wfTitle('验证身份', '验证码已发送') + wfInput('短信验证码') + wfBtn('验证')],
      ['新密码', wfTitle('设置新密码') + wfInput('新密码') + wfInput('再输入一次') + wfBtn('确定')],
      ['成功', '<i class="fa fa-check-circle text-3xl text-emerald-500"></i>' + wfTitle('密码已重置', '请用新密码登录')]
    ])
  },
  {
    id: 'onboardingflow',
    cat: 'flow',
    zh: '新用户引导流程',
    en: 'Onboarding Flow',
    alias: ['首次使用流程', '欢迎流程', '激活流程'],
    plain: '注册完第一次进来时，先让你选选身份、兴趣，或者带你建第一个项目，然后才进主界面',
    desc: '把新用户尽快带到第一次「原来这么好用」的时刻。步骤要少，并且必须能跳过。',
    prompt:
      '注册成功后进入 Onboarding Flow 新用户引导流程：第一步欢迎页，第二步选择角色（产品 / 设计 / 开发），第三步引导创建第一个项目，完成后进入主界面；每一步右上角都有「跳过」。',
    vs: 'Onboarding Tour 是进入界面后指着按钮讲解的气泡；Onboarding Flow 是进入界面前的几步设置。',
    spec: [
      '希望新用户最先完成的关键动作是什么',
      '共几步，每步收集什么信息，用来做什么',
      '能否跳过，跳过后默认值是什么',
      '如何衡量效果（完成率、次日留存）'
    ],
    demo: flowDemo([
      ['欢迎', '<i class="fa fa-hand-peace-o text-3xl text-indigo-600"></i>' + wfTitle('欢迎加入', '花 30 秒完成设置') + wfBtn('开始')],
      ['选角色', wfTitle('你的角色是？') + '<div class="mb-1.5 flex justify-center gap-1"><span class="rounded border border-indigo-600 px-2 py-1 text-indigo-600">产品</span><span class="rounded border px-2 py-1">设计</span><span class="rounded border px-2 py-1">开发</span></div>' + wfBtn('下一步')],
      ['建项目', wfTitle('创建第一个项目') + wfInput('项目名称') + wfBtn('创建')],
      ['进入', '<i class="fa fa-rocket text-3xl text-indigo-600"></i>' + wfTitle('一切就绪', '进入你的工作台')]
    ])
  },
  {
    id: 'checkoutflow',
    cat: 'flow',
    zh: '下单支付流程',
    en: 'Checkout Flow',
    alias: ['购买流程', '支付流程', '交易流程'],
    plain: '从点「去结算」到看见「支付成功」之间的那几步：确认订单、选支付方式、付钱、出结果',
    desc: '直接决定收入的一条路径，每一步的流失都要盯着看。',
    prompt:
      '实现 Checkout Flow 下单支付流程：购物车点击「去结算」进入确认订单页，提交后拉起支付（展示应付金额和支付方式），支付完成跳转结果页；支付失败或取消时可重新支付，订单保留 15 分钟。',
    spec: [
      '从哪里进入（购物车、立即购买）',
      '每一步用户需要确认或填写什么',
      '支付失败、取消、超时未支付的处理',
      '支付成功后的引导（查看订单、继续逛）'
    ],
    demo: flowDemo([
      ['购物车', wfTitle('购物车', '已选 2 件，合计 ¥138') + wfBtn('去结算')],
      ['确认', wfTitle('确认订单', '地址、商品、优惠') + wfBtn('提交订单')],
      ['支付', wfTitle('支付 ¥128', '请在 15 分钟内完成') + wfBtn('确认支付')],
      ['结果', '<i class="fa fa-check-circle text-3xl text-emerald-500"></i>' + wfTitle('支付成功', '查看订单 · 继续逛逛')]
    ])
  },
  {
    id: 'paywall',
    cat: 'flow',
    zh: '付费墙',
    en: 'Paywall',
    alias: ['会员拦截', '升级提示', '付费解锁'],
    plain: '免费的部分用到头了，后面的内容或功能被一把锁挡住，告诉你「升级会员才能继续」',
    desc: '免费转付费的关键节点。出现的时机和给出的理由，比按钮的颜色重要得多。',
    prompt:
      '免费用户使用到达上限时显示 Paywall 付费墙：被限制的内容模糊处理并叠加锁图标，弹层说明升级后能得到什么，展示套餐选项和「立即升级」按钮，并保留关闭入口；支付成功后立即解锁并回到原位置。',
    spec: [
      '免费与付费的边界在哪（次数、功能、内容）',
      '在什么时机出现（刚好需要时，而不是一打开就拦）',
      '付费墙上说什么：解锁后的价值，而不只是价格',
      '支付成功后如何回到被打断的地方'
    ],
    demo: flowDemo([
      ['触发', wfTitle('今日免费次数已用完') + '<div class="relative mx-auto mb-1.5 h-10 w-40 overflow-hidden rounded bg-slate-200"><div class="absolute inset-0 flex items-center justify-center backdrop-blur"><i class="fa fa-lock text-slate-500"></i></div></div>' + wfBtn('了解专业版')],
      ['选套餐', wfTitle('升级专业版', '不限次数 · 导出高清 · 团队协作') + '<div class="mb-1.5 flex justify-center gap-1"><span class="rounded border px-2 py-1">月付 ¥39</span><span class="rounded border border-indigo-600 px-2 py-1 text-indigo-600">年付 ¥390</span></div>' + wfBtn('立即升级')],
      ['支付', wfTitle('支付 ¥390') + wfBtn('确认支付')],
      ['解锁', '<i class="fa fa-unlock text-3xl text-emerald-500"></i>' + wfTitle('已解锁', '回到刚才的位置继续')]
    ])
  },
  {
    id: 'approval',
    cat: 'flow',
    zh: '审批流',
    en: 'Approval Flow',
    alias: ['审批流程', '工作流', 'Workflow'],
    plain: '提交一个申请后，要一级一级让领导点「同意」，中间谁不同意就被打回来重改',
    desc: '企业内部系统的核心：报销、请假、合同、上线，都是不同的审批流。',
    prompt:
      '实现报销单的 Approval Flow 审批流：申请人提交后依次由直属主管、财务审批，每个节点可「通过」或「驳回并填写原因」，驳回后回到申请人修改重提；详情页用时间轴展示每个节点的处理人、结果和时间。',
    spec: [
      '有哪些审批节点，顺序审批还是多人会签',
      '每个节点的审批人如何确定（固定的人、按部门、按金额）',
      '驳回后退到哪一步，能否撤回、转交、加签',
      '超时未审批怎么办，各节点如何通知'
    ],
    demo: flowDemo([
      ['提交', wfTitle('报销申请', '差旅费 ¥860') + wfBtn('提交审批')],
      ['主管', wfTitle('等待主管审批') + '<div class="flex justify-center gap-2"><span class="rounded border border-rose-400 px-3 py-1 text-rose-500">驳回</span><span class="rounded bg-indigo-600 px-3 py-1 text-white">通过</span></div>'],
      ['财务', wfTitle('等待财务审批', '主管已通过 · 10-08 10:20') + '<div class="flex justify-center gap-2"><span class="rounded border border-rose-400 px-3 py-1 text-rose-500">驳回</span><span class="rounded bg-indigo-600 px-3 py-1 text-white">通过</span></div>'],
      ['完成', '<i class="fa fa-check-circle text-3xl text-emerald-500"></i>' + wfTitle('审批通过', '款项将在 3 个工作日内到账')]
    ])
  },
  {
    id: 'publishflow',
    cat: 'flow',
    zh: '发布流程',
    en: 'Publish Flow',
    alias: ['内容发布', '草稿与发布', '上架流程'],
    plain: '写完东西不是直接公开，而是先存草稿、预览一下、提交审核，通过了别人才看得到',
    desc: '内容从「只有自己可见」到「所有人可见」的过程，中间的每个状态都要定义清楚。',
    prompt:
      '文章支持 Publish Flow 发布流程：编辑时自动保存为草稿，可随时预览；点击「发布」后进入待审核状态，审核通过后变为已发布并对外可见；已发布的文章可修改后重新提交，或下线回到草稿。',
    spec: [
      '内容有哪些状态（草稿、待审核、已发布、已下线）',
      '各状态之间如何流转，由谁操作',
      '是否支持定时发布',
      '已发布内容修改后，线上显示旧版还是新版'
    ],
    demo: flowDemo([
      ['草稿', wfTitle('编辑中', '<span class="rounded bg-slate-200 px-1">草稿</span> 已自动保存') + wfBtn('预览')],
      ['预览', wfTitle('预览效果', '确认无误后发布') + wfBtn('提交发布')],
      ['审核', '<i class="fa fa-hourglass-half text-3xl text-amber-500"></i>' + wfTitle('审核中', '通常 1 小时内完成')],
      ['已发布', '<i class="fa fa-globe text-3xl text-emerald-500"></i>' + wfTitle('已发布', '所有人可见 · 可下线或再次编辑')]
    ])
  },
  {
    id: 'importflow',
    cat: 'flow',
    zh: '数据导入',
    en: 'Import Flow',
    alias: ['批量导入', 'Excel 导入', '导入向导'],
    plain: '把一个表格文件传上去批量建数据：先下模板、再上传、对一下列，最后告诉你成功几条失败几条',
    desc: '后台系统的常见功能。难点不在上传，而在出错的那几行怎么告诉用户。',
    prompt:
      '实现客户数据的 Import Flow 导入流程：第一步下载模板并上传 Excel 文件，第二步将文件的列与系统字段对应，第三步预览并标出有问题的行，第四步执行导入并显示成功、失败数量，失败的数据可下载后修改重传。',
    spec: [
      '支持的文件格式、大小与行数上限',
      '是否提供模板，字段如何匹配',
      '校验规则，以及出错时：整批失败还是跳过错误行',
      '导入结果如何反馈，失败数据如何处理'
    ],
    demo: flowDemo([
      ['上传', wfTitle('上传文件', '先下载模板，按格式填写') + '<div class="mx-auto mb-1.5 w-40 rounded border-2 border-dashed py-2 text-slate-400"><i class="fa fa-cloud-upload"></i> 选择 Excel 文件</div>'],
      ['匹配', wfTitle('字段匹配') + '<div class="mx-auto mb-1.5 w-40 space-y-1 text-left"><div class="flex justify-between"><span>姓名</span><span class="text-indigo-600">→ 客户名称</span></div><div class="flex justify-between"><span>电话</span><span class="text-indigo-600">→ 手机号</span></div></div>' + wfBtn('下一步')],
      ['预览', wfTitle('校验结果', '共 100 行 · <span class="text-rose-500">2 行有问题</span>') + wfBtn('跳过错误行并导入')],
      ['结果', '<i class="fa fa-check-circle text-3xl text-emerald-500"></i>' + wfTitle('导入完成', '成功 98 条 · 失败 2 条（下载）')]
    ])
  },
  {
    id: 'invite',
    cat: 'flow',
    zh: '邀请流程',
    en: 'Invite Flow',
    alias: ['邀请好友', '拉新', '裂变'],
    plain: '把一个专属链接发给朋友，朋友通过它注册了，你们俩都能拿到奖励',
    desc: '让老用户带来新用户。要同时设计好邀请人和被邀请人两边看到的东西。',
    prompt:
      '实现 Invite Flow 邀请流程：邀请人在活动页生成专属链接或海报并分享；被邀请人打开后看到「好友送你 30 天会员」的落地页并注册；注册成功后双方各获得奖励并收到通知，邀请人可在记录页查看进度。',
    spec: [
      '邀请人和被邀请人各得到什么奖励',
      '怎样算邀请成功（注册、首次使用、首次付费）',
      '被邀请人打开链接看到什么',
      '如何防止刷量，邀请记录在哪里查看'
    ],
    demo: flowDemo([
      ['生成', wfTitle('邀请好友', '每邀请 1 人，双方各得 30 天会员') + wfBtn('复制邀请链接')],
      ['打开', wfTitle('小王邀请你加入', '注册即送 30 天会员') + wfBtn('立即领取')],
      ['注册', wfTitle('完成注册') + wfInput('手机号') + wfBtn('注册')],
      ['奖励', '<i class="fa fa-gift text-3xl text-rose-500"></i>' + wfTitle('奖励已到账', '你和小王各获得 30 天会员')]
    ])
  },
  {
    id: 'feedback',
    cat: 'flow',
    zh: '意见反馈',
    en: 'Feedback Flow',
    alias: ['问题反馈', '吐槽入口', '用户反馈'],
    plain: '想吐槽或者报个问题时点「反馈」：选个类型、写几句话、传张截图，提交后告诉你收到了',
    desc: '产品收集真实声音的渠道。门槛越低收到的反馈越多，但也要便于后续分类处理。',
    prompt:
      '实现 Feedback Flow 意见反馈：在「我的」页面和帮助中心提供入口，表单包含反馈类型单选（功能建议 / 问题报告 / 其他）、描述文本框、可选的截图上传和联系方式，提交后显示感谢页并告知处理时效。',
    spec: [
      '入口放在哪些位置',
      '收集哪些信息，哪些必填（越少越好）',
      '是否自动附带设备、版本、页面等信息',
      '提交后用户能否查看处理进度与回复'
    ],
    demo: flowDemo([
      ['入口', wfTitle('我的') + '<div class="mx-auto w-40 rounded border px-2 py-1 text-left"><i class="fa fa-commenting-o text-indigo-600"></i> 意见反馈 ›</div>'],
      ['填写', '<div class="mb-1.5 flex justify-center gap-1"><span class="rounded border border-indigo-600 px-1.5 text-indigo-600">功能建议</span><span class="rounded border px-1.5">问题报告</span></div>' + wfInput('描述你的想法…') + wfInput('+ 添加截图（选填）') + wfBtn('提交')],
      ['感谢', '<i class="fa fa-heart text-3xl text-rose-500"></i>' + wfTitle('感谢你的反馈', '我们会在 3 个工作日内回复')]
    ])
  },
  {
    id: 'cancelflow',
    cat: 'flow',
    zh: '退订流程',
    en: 'Cancellation Flow',
    alias: ['取消订阅', '退订挽留', '取消续费'],
    plain: '想取消会员自动续费时走的那几步：问你为什么要走、给个优惠试着留你，最后确认取消',
    desc: '用户离开前的最后一次沟通。可以挽留，但取消必须容易找到、容易完成。',
    prompt:
      '实现 Cancellation Flow 退订流程：设置页提供清晰的「取消订阅」入口，点击后询问取消原因（单选），根据原因展示一次挽留方案（如折扣或暂停订阅），用户仍可一键确认取消，取消后说明会员有效期至何时。',
    spec: [
      '取消入口是否容易找到（故意藏起来会带来投诉与合规风险）',
      '是否询问原因，选项有哪些',
      '提供什么挽留方案，只出现一次',
      '取消后权益何时终止，如何恢复订阅'
    ],
    demo: flowDemo([
      ['入口', wfTitle('会员管理', '专业版 · 11-08 自动续费') + '<div class="text-slate-400 underline">取消订阅</div>'],
      ['原因', wfTitle('方便告诉我们原因吗？') + '<div class="mx-auto mb-1.5 w-40 space-y-1 text-left"><div><i class="fa fa-dot-circle-o text-indigo-600"></i> 价格太高</div><div><i class="fa fa-circle-o text-slate-300"></i> 用得不多</div></div>' + wfBtn('继续')],
      ['挽留', wfTitle('要不要试试半价续费？', '接下来 3 个月 ¥19 / 月') + wfBtn('接受优惠') + '<div class="mt-1 text-slate-400 underline">仍然取消</div>'],
      ['完成', wfTitle('已取消自动续费', '会员可用至 11-08，随时欢迎回来')]
    ])
  },
  {
    id: 'refund',
    cat: 'flow',
    zh: '退款售后',
    en: 'Refund Flow',
    alias: ['退货退款', '售后流程', '申请退款'],
    plain: '买的东西不想要了，在订单里点「申请退款」，选原因、等审核、寄回去，最后钱退回来',
    desc: '电商和付费产品必须有的逆向流程，状态多、角色多，最容易出体验问题。',
    prompt:
      '实现 Refund Flow 退款售后流程：订单详情页点击「申请售后」，选择类型（仅退款 / 退货退款）和原因并上传凭证，提交后等待商家审核，通过后填写退货物流单号，商家收货后退款原路返回；全程用步骤条展示进度。',
    spec: [
      '哪些订单可以申请，时限是多久',
      '售后类型与原因选项，是否需要凭证',
      '各环节的处理方与时限，超时如何处理',
      '退款金额如何计算（运费、优惠券、部分退款），退到哪里'
    ],
    demo: flowDemo([
      ['申请', wfTitle('申请售后') + '<div class="mb-1.5 flex justify-center gap-1"><span class="rounded border px-1.5">仅退款</span><span class="rounded border border-indigo-600 px-1.5 text-indigo-600">退货退款</span></div>' + wfInput('退款原因') + wfBtn('提交申请')],
      ['审核', '<i class="fa fa-hourglass-half text-3xl text-amber-500"></i>' + wfTitle('等待商家审核', '预计 24 小时内处理')],
      ['寄回', wfTitle('请寄回商品') + wfInput('填写物流单号') + wfBtn('提交')],
      ['退款', '<i class="fa fa-check-circle text-3xl text-emerald-500"></i>' + wfTitle('退款成功', '¥79 已原路退回')]
    ])
  },
  {
    id: 'deleteaccount',
    cat: 'flow',
    zh: '注销账号',
    en: 'Account Deletion',
    alias: ['删除账号', '账号注销', '销户'],
    plain: '彻底不用了想把账号删掉：先告诉你删了会丢什么，再验证是你本人，过几天冷静期才真正删',
    desc: '法规要求必须提供的功能。要让用户清楚后果，同时防止误操作和盗号注销。',
    prompt:
      '实现 Account Deletion 注销账号流程：设置页底部提供入口，第一步列出注销后将失去的内容并要求勾选确认，第二步通过短信验证码验证身份，提交后进入 7 天冷静期，期间重新登录即可撤销，到期后永久删除。',
    spec: [
      '入口位置（必须能找到）',
      '注销前要告知和检查什么（余额、未完成订单、会员）',
      '如何验证身份',
      '是否有冷静期，数据何时真正删除，同一手机号能否再注册'
    ],
    demo: flowDemo([
      ['告知', wfTitle('注销后将无法恢复') + '<ul class="mx-auto mb-1.5 w-40 list-disc pl-4 text-left text-slate-500"><li>所有文档与项目</li><li>剩余 23 天会员</li></ul>' + wfBtn('我已了解，继续')],
      ['验证', wfTitle('验证身份') + wfInput('短信验证码') + wfBtn('确认注销')],
      ['冷静期', '<i class="fa fa-clock-o text-3xl text-amber-500"></i>' + wfTitle('已提交注销申请', '7 天内重新登录可撤销')]
    ])
  }
)

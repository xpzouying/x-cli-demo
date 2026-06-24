/* ============================================================
   x-cli homepage — behavior
   Ports the prototype's DCLogic component to vanilla JS:
   - the static data (examples / scenes / clis) that fed {{ }}
   - <sc-for> loops become render functions
   - the hero terminal typing animation
   ============================================================ */

/* ---------- data (verbatim from the prototype's renderVals) ---------- */

const examples = [
  {
    prompt: "帮我规划 6 月去京都的 5 天行程",
    lines: [
      { glyph: "▸", mark: "#6f6f6f", color: "#9a9a9a", text: "agent 调度 ctrip-cli + booking-cli ..." },
      { glyph: "✓", mark: "#4ade80", color: "#cfcfcf", text: "机票时段 · 酒店对比 · 景点动线 已排好" },
    ],
  },
  {
    prompt: "上海张江找两室一厅，月租 5000 以内",
    lines: [
      { glyph: "▸", mark: "#6f6f6f", color: "#9a9a9a", text: "agent 同时跑 58 / 安居客 + 3 个海外平台 ..." },
      { glyph: "✓", mark: "#4ade80", color: "#cfcfcf", text: "五个平台跑完，对照清单已生成" },
    ],
  },
  {
    prompt: "画一只穿西装的柴犬站在 Times Square",
    lines: [
      { glyph: "▸", mark: "#6f6f6f", color: "#9a9a9a", text: "agent 调用 chatgpt-image-cli ..." },
      { glyph: "✓", mark: "#4ade80", color: "#cfcfcf", text: "图片已按命名规则落到本地文件夹" },
    ],
  },
];

const scenes = [
  {
    num: "01", tag: "出行 · 住宿",
    title: "一句话规划完整行程",
    cmd: "帮我规划 6 月去京都的 5 天行程",
    desc: "等你刷完牙回来，机票时段、酒店对比、景点动线已经排好，直接照着走。约束条件 agent 会自己落到搜索里。",
    clis: ["ctrip-cli", "booking-cli", "travel-planning"],
  },
  {
    num: "02", tag: "租房",
    title: "一次找完几个国家的房",
    cmd: "上海张江找两室一厅，月租 5000 以内",
    desc: "把预算、户型、通勤一次说清楚，agent 同时跑五个平台、按条件过滤好，给你一份对照清单。国内合租到海外长租，话术不变。",
    clis: ["58 / 安居客", "rightmove", "idealista", "rental-assistant"],
  },
  {
    num: "03", tag: "升学",
    title: "高考志愿，把信息摆齐",
    cmd: "江苏考生，580 分能上哪些 211",
    desc: "把官方分数线、近三年录取位次、对应专业拉齐，按你的偏好排出冲、稳、保三档。它不替你做选择，但数据一个清单看完。",
    clis: ["gaokao-cli", "gaokao-assistant"],
  },
  {
    num: "04", tag: "出图",
    title: "让 AI 画图，不用一张张存",
    cmd: "画一只穿西装的柴犬站在 Times Square",
    desc: "用你已登录的 Chrome 直接调 ChatGPT 或 Gemini 出图，按命名规则落到本地。没有 API key 注册，三十张图等你写完文档就在桌面上。",
    clis: ["chatgpt-image-cli", "nanobanana-cli"],
  },
  {
    num: "05", tag: "搜索 · 整理",
    title: "一个话题搜完读完整理完",
    cmd: "搜 2025 值得用的本地 AI 模型，拿回前 10 篇正文",
    desc: "agent 替你跑搜索、顺着结果抓正文，可以综合成一份摘要，也可以保留原文自己看。研究选题、看领域新进展，先汇总到一处。",
    clis: ["google-cli", "baidu-cli"],
  },
];

const clis = [
  { name: "ctrip-cli", use: "携程 · 机票酒店", dist: "release" },
  { name: "booking-cli", use: "Booking 海外住宿", dist: "release" },
  { name: "58-cli", use: "58 同城租房", dist: "release" },
  { name: "anjuke-cli", use: "安居客租房", dist: "release" },
  { name: "apartments-cli", use: "Apartments 租房", dist: "release" },
  { name: "rightmove-cli", use: "Rightmove · 伦敦", dist: "release" },
  { name: "idealista-cli", use: "Idealista · 马德里", dist: "release" },
  { name: "gaokao-cli", use: "高考分数线位次", dist: "release" },
  { name: "chatgpt-image-cli", use: "ChatGPT 出图", dist: "release" },
  { name: "nanobanana-cli", use: "Gemini 出图", dist: "release" },
  { name: "google-cli", use: "Google 搜索抓正文", dist: "release" },
  { name: "baidu-cli", use: "百度搜索抓正文", dist: "release" },
  { name: "twitter-cli", use: "Twitter / X", dist: "brew" },
  { name: "xiaohongshu-cli", use: "小红书攻略", dist: "brew" },
];

/* ---------- helpers ---------- */

const cn = "'PingFang SC','Microsoft YaHei',system-ui,sans-serif";

// Escape user-facing text before it touches innerHTML.
function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

/* ---------- static renders (were <sc-for> loops) ---------- */

function renderScenes() {
  document.getElementById("scenes-grid").innerHTML = scenes.map((s) => `
    <div class="scene-card" style="display:flex; flex-direction:column; padding:18px 20px; border:1px solid #1e1e1e; border-radius:14px; background:#0e0e0e;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
        <span style="font-size:12px; color:#4ade80; font-weight:700;">${esc(s.num)}</span>
        <span style="font-size:11px; color:#5a5a5a;">${esc(s.tag)}</span>
      </div>
      <h3 style="font-size:17px; font-weight:700; color:#fafafa; margin:0 0 10px; font-family:${cn}; letter-spacing:-0.2px;">${esc(s.title)}</h3>
      <div style="padding:9px 12px; border-left:2px solid #4ade80; background:#0a0a0a; border-radius:0 8px 8px 0; margin-bottom:11px;">
        <span style="color:#4ade80; font-size:12.5px;">$ </span>
        <span style="color:#d4d4d4; font-size:13px; font-family:'PingFang SC','Microsoft YaHei',monospace;">${esc(s.cmd)}</span>
      </div>
      <p style="margin:0 0 13px; color:#8a8a8a; font-size:13px; line-height:1.65; font-family:${cn};">${esc(s.desc)}</p>
      <div style="margin-top:auto; display:flex; flex-wrap:wrap; gap:7px;">
        ${s.clis.map((c) => `<span style="padding:4px 9px; border:1px solid #232323; border-radius:6px; background:#121212; font-size:11.5px; color:#9a9a9a;">${esc(c)}</span>`).join("")}
      </div>
    </div>`).join("");
}

function renderClis() {
  document.getElementById("clis-grid").innerHTML = clis.map((c) => `
    <div class="cli-item" style="display:flex; align-items:center; gap:12px; padding:12px 14px; border:1px solid #1c1c1c; border-radius:11px; background:#0e0e0e;">
      <span style="display:inline-flex; align-items:center; justify-content:center; width:34px; height:34px; flex-shrink:0; border:1px solid #232323; border-radius:8px; background:#121212; color:#4ade80; font-size:12px; font-weight:700;">&gt;_</span>
      <div style="min-width:0; flex:1;">
        <div style="font-size:13.5px; font-weight:600; color:#e5e5e5; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(c.name)}</div>
        <div style="font-size:11.5px; color:#6f6f6f; font-family:${cn};">${esc(c.use)}</div>
      </div>
      <span style="flex-shrink:0; font-size:10px; padding:3px 7px; border-radius:5px; background:#141414; border:1px solid #232323; color:#7a7a7a;">${esc(c.dist)}</span>
    </div>`).join("");
}

/* ---------- hero terminal: the two state setters the loop drives ---------- */

const heroPromptEl = document.getElementById("hero-prompt");
const heroLinesEl = document.getElementById("hero-lines");

// Set the typed-so-far prompt text after the "你 ▸" marker.
function setHeroPrompt(text) {
  heroPromptEl.textContent = text;
}

// Render the result lines revealed so far (a slice of example.lines).
function renderHeroLines(lines) {
  heroLinesEl.innerHTML = lines.map((line) => `
    <div style="display:flex; gap:10px; align-items:baseline; font-family:'PingFang SC','Microsoft YaHei',monospace;">
      <span style="flex-shrink:0; color:${esc(line.mark)};">${esc(line.glyph)}</span>
      <span style="color:${esc(line.color)};">${esc(line.text)}</span>
    </div>`).join("");
}

/* ---------- hero animation loop ----------
   YOUR TURN ─ implement the choreography of the terminal demo.

   This is the one piece of the page with real UX trade-offs, so it's
   worth your hand. The prototype cycles forever through `examples`,
   and for each one it: clears the screen → types the prompt out
   character-by-character → pauses → reveals the result lines one at a
   time → holds → moves to the next example.

   You have these primitives already wired up:
     • setHeroPrompt(text)        — show typed-so-far prompt text
     • renderHeroLines(lines)     — show a slice of ex.lines
     • await wait(ms)             — pause without blocking the page
     • examples[]                 — the data to cycle through

   Decisions that actually change the feel — make them yours:
     • Per-character typing delay (prototype used ~55ms). Faster reads
       snappier; slower feels more "live terminal".
     • Pause lengths between phases, and the hold before looping.
     • Loop forever, or stop after one pass once the user has seen it?
       (Forever draws the eye but never settles; one pass respects a
        reader who scrolled down to actually read.)

   Replace the body below with your version.
*/
async function runHeroCycle() {
  // TODO(you): drive setHeroPrompt / renderHeroLines / wait across `examples`.
  // Placeholder so the terminal isn't blank before you implement it:
  const ex = examples[0];
  setHeroPrompt(ex.prompt);
  renderHeroLines(ex.lines);
}

/* ---------- boot ---------- */

renderScenes();
renderClis();
runHeroCycle();

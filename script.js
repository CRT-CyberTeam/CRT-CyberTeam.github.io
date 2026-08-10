(() => {
  "use strict";

  const CONTACT = Object.freeze({ telegram: "@xxxx", email: "xxx@example.com" });
  const zh = {
    "header.catalog": "服务清单 / 01-10",
    "intro.line": "专业二进制安全团队，多年实战经验，涵盖游戏/工具/钱包类APP复刻、定制化目标逆向分析（加固对抗/协议还原/行为分析）、定制化目标漏洞挖掘、去中心化匿名通讯系统、海外多平台数据采集服务、Android漏洞、移动应用保护、区块链交易等各项二进制服务。",
    "catalog.title": "项目清单",
    "item.1.title": "Google Play 开发者账号与上架",
    "item.1.copy": "开发者账号、高置信度、上架问题解决、马甲包、广告 SDK 接入咨询与广告买量咨询。",
    "item.2.title": "广告变现框架",
    "item.2.copy": "现成广告变现框架，带拉活、保活、体外弹窗、VMP、混淆等关键保护。",
    "item.3.title": "定制化目标漏洞挖掘",
    "item.3.copy": "定制化目标漏洞挖掘服务，已有 Android 全版本保活、0-click BAL 体外弹窗、通知窃取等 20+ 0day，以及 1day 复现服务。",
    "item.4.title": "游戏、工具、钱包类 App 复刻",
    "item.4.copy": "深度分析与复刻服务，交付核心业务逻辑、关键资源和技术栈分析。",
    "item.5.title": "群控定制化",
    "item.5.copy": "一机多开与群控定制，可绕过所有 App 风控。",
    "item.6.title": "定制化目标渗透测试",
    "item.6.copy": "定制化目标渗透测试服务。",
    "item.7.title": "定制化目标逆向分析",
    "item.7.copy": "包含加固对抗、协议还原、行为分析、风控对抗等服务方向。",
    "item.8.title": "定制化目标数据采集",
    "item.8.copy": "Google 数据、电商数据、社交数据、视频内容、职场数据等定制化采集服务；可攻破目标数据链路中的风控。",
    "item.9.title": "Gmail 与 Google Play Keybox",
    "item.9.copy": "Gmail 邮箱售卖，Google Play Keybox 售卖。",
    "item.10.title": "去中心化匿名通讯系统",
    "item.10.copy": "DChat 去中心化匿名通讯系统售卖。",
    "contact.title": "Telegram / 邮箱",
    "contact.copyButton": "复制",
    "footer.text": "CRTEAM / 服务清单 / 01-10"
  };

  const i18nNodes = Array.from(document.querySelectorAll("[data-i18n]"));
  const english = new Map(i18nNodes.map((node) => [node.dataset.i18n, node.innerHTML]));
  let language = "en";

  function storedLanguage() {
    try { return localStorage.getItem("crteam-language") === "zh" ? "zh" : "en"; }
    catch { return "en"; }
  }

  function applyLanguage(next, persist = true) {
    language = next === "zh" ? "zh" : "en";
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    i18nNodes.forEach((node) => { node.innerHTML = language === "zh" ? (zh[node.dataset.i18n] || english.get(node.dataset.i18n)) : english.get(node.dataset.i18n); });
    document.querySelectorAll("[data-lang]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.lang === language)));
    document.title = language === "zh" ? "CRTeam | 服务清单" : "CRTeam | Service List";
    if (persist) try { localStorage.setItem("crteam-language", language); } catch { /* Direct file previews may block storage. */ }
  }

  document.querySelectorAll("[data-lang]").forEach((button) => button.addEventListener("click", () => applyLanguage(button.dataset.lang)));
  applyLanguage(storedLanguage(), false);

  document.querySelectorAll(".js-telegram").forEach((node) => { node.textContent = CONTACT.telegram; });
  document.querySelectorAll(".js-email").forEach((node) => { node.textContent = CONTACT.email; });
  document.querySelector("#year").textContent = new Date().getFullYear();

  async function copy(value) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(value);
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }

  document.querySelectorAll("[data-copy]").forEach((button) => button.addEventListener("click", async () => {
    const label = button.querySelector("b");
    try {
      await copy(CONTACT[button.dataset.copy]);
      button.classList.add("copied");
      label.textContent = language === "zh" ? "已复制" : "Copied";
      window.setTimeout(() => { button.classList.remove("copied"); label.textContent = language === "zh" ? "复制" : "Copy"; }, 1500);
    } catch {
      label.textContent = language === "zh" ? "重试" : "Retry";
    }
  }));

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canvas = document.querySelector("#signal-canvas");
  const ctx = canvas.getContext("2d");
  let nodes = [];
  let width = 1;
  let height = 1;

  function resize() {
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, box.width);
    height = Math.max(1, box.height);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(28, Math.min(62, Math.round((width * height) / 10000)));
    nodes = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - .5) * .11,
      vy: (Math.random() - .5) * .11,
      size: index % 11 === 0 ? 1.9 : .5 + Math.random(),
      phase: Math.random() * Math.PI * 2,
    }));
    draw(performance.now());
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    nodes.forEach((a, index) => {
      for (let j = index + 1; j < nodes.length; j += 1) {
        const b = nodes[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance > 135) continue;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(75,240,141,${(1 - distance / 135) * .18})`;
        ctx.lineWidth = .65;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(54,212,230,${.48 + Math.sin(time * .0014 + a.phase) * .24})`;
      ctx.fill();
    });
  }

  function animate(time) {
    nodes.forEach((node) => {
      node.x += node.vx * 16;
      node.y += node.vy * 16;
      if (node.x < -8) node.x = width + 8;
      if (node.x > width + 8) node.x = -8;
      if (node.y < -8) node.y = height + 8;
      if (node.y > height + 8) node.y = -8;
    });
    draw(time);
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();
  if (!reducedMotion.matches) requestAnimationFrame(animate);
})();

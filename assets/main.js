// LP用スクリプト。失敗しても本文・CTAはそのまま表示される。
(function () {
  "use strict";
  try {
    // 固定CTA：ヒーローのCTAが見えなくなってから、最終CTAが見えるまでの間だけ表示
    var bar = document.querySelector("[data-sticky-cta]");
    if (bar) {
      var size = function () { document.documentElement.style.setProperty("--sticky-cta-height", bar.offsetHeight + "px"); };
      size();
      if ("ResizeObserver" in window) new ResizeObserver(size).observe(bar);
      else window.addEventListener("resize", size);
    }
    var hero = document.querySelector(".hero-cta");
    var fin = document.querySelector(".final-cta");
    if (bar && hero && "IntersectionObserver" in window) {
      var heroVisible = true, finVisible = false;
      var update = function () { bar.classList.toggle("is-shown", !heroVisible && !finVisible); };
      new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; update(); }).observe(hero);
      if (fin) new IntersectionObserver(function (e) { finVisible = e[0].isIntersecting; update(); }).observe(fin);
    }
    // クリック計測（GA4設定時のみ）。外部への遷移クリックであり、登録完了ではない。
    document.addEventListener("click", function (e) {
      var a = e.target.closest("[data-cta]");
      if (a && typeof window.gtag === "function") {
        window.gtag("event", "cta_click", { cta_placement: a.getAttribute("data-cta"), link_url: a.href });
      }
    });
  } catch (err) { if (window.console) console.error(err); }
})();

// 申込フォーム：締切（data-closes-at）を過ぎたら表示を消す（公開ページの更新までの補助）
const hideClosedApply = () => document.querySelectorAll("[data-closes-at]").forEach((el) => {
  const t = Date.parse(el.dataset.closesAt);
  if (t && Date.now() >= t) { const g = el.closest("[data-apply-group]"); el.remove(); if (g && !g.querySelector("[data-closes-at]")) g.remove(); }
});
hideClosedApply();
setInterval(hideClosedApply, 60000);
addEventListener("pageshow", hideClosedApply);
document.addEventListener("visibilitychange", () => { if (!document.hidden) hideClosedApply(); });

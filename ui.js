/* ============================================================
   ui.js — 教材ページ共通の定型スクリプト

   各ページが毎回書いていた「タブの切り替え」「全画面表示の
   トグル」をここに集約する。ページ側は描き直しの中身だけを
   書けばよい。

   使い方:
     <script src="ui.js"></script>   ← ページ本体のスクリプトより前

     ChemUI.tabs({ onChange: key => DRAW[key]() });
     ChemUI.fullscreen({ onChange: () => redrawAll() });
     ChemUI.bindRange('one-temp', { onInput: () => DRAW.one() });
     ChemUI.setRange('one-temp', 300);   // 値をコードから変えるとき

   前提とするマークアップ:
     <nav class="tabs" id="tabs" role="tablist">
       <button role="tab" data-tab="xxx" aria-selected="true">…</button>
     </nav>
     <section class="panel active" id="panel-xxx">…</section>

   キーボード操作（←→/Home/End）は site-shell.js が担当する。
   ============================================================ */

const ChemUI = (() => {

  /* ---- タブ切り替え ------------------------------------- */
  const tabs = ({ list = '#tabs', onChange, onLeave } = {}) => {
    const nav = document.querySelector(list);
    if (!nav) return { select: () => {} };
    const buttons = [...nav.querySelectorAll('[role="tab"]')];

    const select = key => {
      buttons.forEach(b => {
        const on = b.dataset.tab === key;
        b.setAttribute('aria-selected', String(on));
        const panel = document.getElementById('panel-' + b.dataset.tab);
        if (panel) panel.classList.toggle('active', on);
      });
      onChange?.(key);
    };

    buttons.forEach(btn => btn.addEventListener('click', () => {
      // 見えていないタブでアニメーションが回り続けないように
      onLeave?.(buttons.find(b => b.getAttribute('aria-selected') === 'true')?.dataset.tab);
      select(btn.dataset.tab);
    }));

    return { select, current: () => buttons.find(b => b.getAttribute('aria-selected') === 'true')?.dataset.tab };
  };

  /* ---- 全画面表示（授業投影用）-------------------------- */
  const fullscreen = ({ button = '#fullscreenBtn', onChange } = {}) => {
    const btn = document.querySelector(button);
    if (!btn) return;

    btn.addEventListener('click', async () => {
      try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
        else await document.exitFullscreen();
      } catch (e) { /* 全画面が使えない環境では何もしない */ }
    });

    document.addEventListener('fullscreenchange', () => {
      const on = !!document.fullscreenElement;
      const label = on ? '全画面を終了' : '全画面表示';
      document.body.classList.toggle('is-fullscreen', on);
      const text = btn.querySelector('.btn-text');
      if (text) text.textContent = label;
      btn.setAttribute('aria-label', label);
      // レイアウトが変わるので、SVG などは描き直しが要る
      onChange?.(on);
    });
  };

  /* ---- スライダーと数値表示の同期 ------------------------ */
  /* <div class="ctrl">
       <label>温度 <span class="val" data-for="t-temp"></span></label>
       <input type="range" id="t-temp" data-unit="K">
     </div>                                                    */
  const syncers = new Map();

  const bindRange = (id, { format, onInput } = {}) => {
    const input = document.getElementById(id);
    if (!input) return;
    const out = document.querySelector(`.val[data-for="${id}"]`);
    const unit = input.dataset.unit || '';
    const sync = () => {
      if (out) out.textContent = format ? format(+input.value) : `${input.value}${unit ? ' ' + unit : ''}`;
      onInput?.(+input.value);
    };
    input.addEventListener('input', sync);
    syncers.set(id, sync);
    sync();
    return sync;
  };

  /* スライダーの値をコードから変えるときは必ずこれを使う。
     input.value への代入では input イベントが飛ばないので、
     数値表示が古いまま取り残される（「最初から」ボタンの類で
     起こりがち）。 */
  const setRange = (id, value) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.value = value;
    syncers.get(id)?.();
  };

  return { tabs, fullscreen, bindRange, setRange };
})();

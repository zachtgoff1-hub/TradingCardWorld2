(function(){
  'use strict';
  if(window._EXPANSION_PACK_LOADED) return;
  window._EXPANSION_PACK_LOADED = true;

  // === CSS injection ===
  const style = document.createElement('style');
  style.textContent = `
/* ============================== ADVENTURE BOARD (expansion) ============================== */
#adventure{flex-direction:column;background:radial-gradient(ellipse at top,#1a1f3a 0%,var(--bg) 60%)}
.adv-top{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(0,0,0,.7);border-bottom:1px solid var(--bdr);font-size:var(--fs-xs);gap:8px;flex-shrink:0}
.adv-hp-wrap{display:flex;align-items:center;gap:6px;flex:1;min-width:0}
.adv-hp-lbl{font-family:'Black Ops One',cursive;color:var(--gold);font-size:var(--fs-xs);letter-spacing:1px}
.adv-hp-bar{flex:1;height:10px;background:rgba(0,0,0,.6);border:1px solid var(--bdr);border-radius:5px;overflow:hidden;max-width:140px}
.adv-hp-fill{height:100%;background:linear-gradient(90deg,var(--green),#22c55e);transition:width .5s}
.adv-hp-fill.med{background:linear-gradient(90deg,var(--gold),var(--orange))}
.adv-hp-fill.low{background:linear-gradient(90deg,var(--red),#dc2626)}
.adv-spaces{font-family:'Black Ops One',cursive;color:var(--gold);font-size:var(--fs-xs);letter-spacing:1px}
.adv-inv-btn{padding:5px 10px;background:rgba(255,203,5,.18);border:1px solid var(--gold);border-radius:8px;color:var(--gold);font-family:'Black Ops One',cursive;font-size:var(--fs-xs);cursor:pointer;letter-spacing:.5px}
.adv-board-wrap{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow-y:auto;padding:8px}
#advBoardSvg{display:block;width:100%;max-width:520px;height:auto;filter:drop-shadow(0 4px 14px rgba(0,0,0,.5))}
.adv-tile{transition:transform .3s, filter .3s}
.adv-tile.current{filter:drop-shadow(0 0 8px var(--gold));animation:tile-pulse 1.2s ease-in-out infinite}
@keyframes tile-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
.adv-pawn{transition:transform .3s ease-in-out}
.adv-bottom{flex-shrink:0;background:#0a0e18;border-top:3px solid var(--gold);padding:10px;padding-bottom:max(10px,calc(10px + env(safe-area-inset-bottom)))}
.adv-log{padding:8px 12px;font-size:var(--fs-sm);background:rgba(0,0,0,.55);border-radius:8px;min-height:34px;margin-bottom:10px;color:var(--soft);line-height:1.4}
.adv-log b{color:var(--gold)}
.adv-dice-btn{width:100%;padding:18px;background:linear-gradient(135deg,var(--gold),var(--orange));border:3px solid #fff;border-radius:14px;color:#000;font-family:'Black Ops One',cursive;font-size:var(--fs-lg);letter-spacing:3px;cursor:pointer;min-height:62px;box-shadow:0 0 18px rgba(255,203,5,.5)}
.adv-dice-btn:active{transform:scale(.97)}
.adv-dice-btn:disabled{opacity:.45;filter:grayscale(.4)}

#advPick{padding-bottom:30px}
.adv-flash{position:fixed;inset:0;pointer-events:none;z-index:5000;opacity:0}
.adv-flash.green{animation:advFlashG .8s}
.adv-flash.red{animation:advFlashR .8s}
@keyframes advFlashG{0%{opacity:0;background:transparent}30%{opacity:.65;background:radial-gradient(circle,rgba(34,197,94,.7),transparent 70%)}100%{opacity:0}}
@keyframes advFlashR{0%{opacity:0;background:transparent}30%{opacity:.65;background:radial-gradient(circle,rgba(238,21,21,.7),transparent 70%)}100%{opacity:0}}

.adv-tray{position:fixed;left:0;right:0;bottom:0;background:linear-gradient(180deg,rgba(10,14,24,.95),rgba(10,14,24,.99));border-top:3px solid var(--gold);padding:14px;z-index:9000;transform:translateY(100%);transition:transform .3s;padding-bottom:max(14px,calc(14px + env(safe-area-inset-bottom)))}
.adv-tray.on{transform:translateY(0)}
.adv-tray-title{font-family:'Black Ops One',cursive;font-size:var(--fs-base);color:var(--gold);letter-spacing:2px;margin-bottom:10px;text-align:center}
.adv-tray-list{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;max-height:42vh;overflow-y:auto}
.adv-tray-item{padding:10px;background:rgba(255,255,255,.05);border:1px solid var(--bdr);border-radius:10px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;font-family:'Black Ops One',cursive;font-size:var(--fs-xs)}
.adv-tray-item:active{transform:scale(.97)}
.adv-tray-item .ic{font-size:1.6rem}
.adv-tray-item .nm{color:var(--gold);letter-spacing:.6px}
.adv-tray-item .ds{font-family:'Share Tech Mono',monospace;font-size:.55rem;color:var(--soft);letter-spacing:.4px}
.adv-tray-close{display:block;width:100%;margin-top:10px;padding:10px;background:rgba(255,80,80,.18);border:1px solid var(--red);color:#fff;border-radius:8px;font-family:'Black Ops One',cursive;font-size:var(--fs-sm);cursor:pointer}

.adv-fight{position:fixed;inset:0;background:rgba(0,0,0,.94);display:none;flex-direction:column;z-index:8000}
.adv-fight.on{display:flex}
.adv-fight-arena{flex:1;background:linear-gradient(180deg,#1a3a5a,#5a8aaa);position:relative;display:flex;align-items:center;justify-content:space-between;padding:24px;overflow:hidden}
.adv-fight-side{display:flex;flex-direction:column;align-items:center;gap:6px;width:130px}
.adv-fight-art{width:100px;height:100px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.08);border-radius:50%;border:3px solid var(--gold);filter:drop-shadow(0 4px 8px rgba(0,0,0,.6))}
.adv-fight-art img{max-width:90px;max-height:90px;image-rendering:pixelated}
.adv-fight-art .emoji{font-size:3.5rem}
.adv-fight-foe .adv-fight-art{border-color:var(--red)}
.adv-fight-name{font-family:'Black Ops One',cursive;font-size:var(--fs-base);color:#fff;text-align:center}
.adv-fight-hp-bar{width:120px;height:10px;background:rgba(0,0,0,.7);border:1px solid var(--bdr);border-radius:5px;overflow:hidden}
.adv-fight-hp-fill{height:100%;background:linear-gradient(90deg,var(--green),#22c55e);transition:width .4s}
.adv-fight-hp-num{font-family:'Black Ops One',cursive;font-size:var(--fs-xs);color:var(--gold)}
.adv-fight-vs{font-family:'Black Ops One',cursive;font-size:2rem;color:var(--gold);text-shadow:0 0 14px rgba(255,203,5,.6)}
.adv-fight-controls{flex-shrink:0;background:#0a0e18;border-top:3px solid var(--gold);padding:12px;padding-bottom:max(12px,calc(12px + env(safe-area-inset-bottom)))}
.adv-fight-log{padding:10px;background:rgba(0,0,0,.55);border-radius:8px;font-size:var(--fs-sm);min-height:46px;line-height:1.4;margin-bottom:10px;color:var(--soft)}
.adv-fight-log b{color:var(--gold)}
.adv-fight-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.adv-fight-actions button{padding:14px 8px;background:linear-gradient(160deg,var(--panel),var(--panel2));border:2px solid var(--gold);border-radius:10px;color:#fff;font-family:'Black Ops One',cursive;font-size:var(--fs-sm);cursor:pointer;letter-spacing:1px;min-height:50px}
.adv-fight-actions button:active{transform:scale(.96)}
.adv-fight-actions button:disabled{opacity:.4}
.adv-fight-actions button.fight{border-color:var(--red);background:linear-gradient(160deg,#2a0808,#3a0a0a)}
.adv-fight-actions button.bag{border-color:var(--gold)}
.adv-fight-actions button.swap{border-color:var(--blue)}
.adv-fight-actions button.flee{border-color:var(--mut)}
.adv-fight-pickactive{position:absolute;inset:0;background:rgba(0,0,0,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;gap:8px;z-index:6}
.adv-fight-pickrow{display:flex;align-items:center;gap:10px;width:100%;max-width:340px;padding:10px;background:rgba(255,255,255,.05);border:1px solid var(--bdr);border-radius:10px;cursor:pointer}
.adv-fight-pickrow:active{transform:scale(.98)}
.adv-fight-pickrow.fainted{opacity:.4}
.adv-fight-pickrow .ic{width:40px;height:40px;display:flex;align-items:center;justify-content:center}
.adv-fight-pickrow .ic img{max-width:40px;max-height:40px;image-rendering:pixelated}
.adv-fight-pickrow .ic .emoji{font-size:1.8rem}
.adv-fight-pickrow .info{flex:1}
.adv-fight-pickrow .nm{font-family:'Black Ops One',cursive;font-size:var(--fs-sm);color:#fff}
.adv-fight-pickrow .hp-num{font-size:var(--fs-xs);color:var(--soft)}

/* ============================== LANE DUEL (expansion) ============================== */
#lane{flex-direction:column;background:linear-gradient(180deg,#3a0a0a 0%,#1a0a0a 50%,#0a1a3a 100%)}
.lane-top{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(0,0,0,.78);border-bottom:1px solid var(--bdr);font-size:var(--fs-xs);gap:6px;flex-shrink:0}
.lane-top .turn{color:var(--gold);font-family:'Black Ops One',cursive;letter-spacing:1px}
.lane-top .elx{color:#a855f7;font-family:'Black Ops One',cursive}.lane-top .elx b{color:#fff;font-size:var(--fs-base)}
.lane-top .end-btn{padding:6px 12px;background:var(--gold);color:#000;border:none;border-radius:8px;font-family:'Black Ops One',cursive;font-size:var(--fs-xs);cursor:pointer;letter-spacing:1px}
.lane-top .end-btn:disabled{opacity:.4}
.lane-board{flex:1;display:flex;flex-direction:column;gap:3px;padding:6px;overflow-y:auto}
.lane-tower-row{display:flex;justify-content:center}
.lane-tower{padding:8px 18px;border-radius:10px;border:2px solid var(--gold);background:linear-gradient(135deg,rgba(255,203,5,.18),rgba(238,21,21,.18));text-align:center;font-family:'Black Ops One',cursive;font-size:var(--fs-sm);color:var(--gold);min-width:200px}
.lane-tower.king{font-size:var(--fs-base);min-width:260px}
.lane-tower.foe{border-color:var(--red);color:var(--red);background:linear-gradient(135deg,rgba(238,21,21,.22),rgba(238,21,21,.1))}
.lane-tower.dead{opacity:.3;border-style:dashed}
.lane-tower .hpbar{margin-top:4px;height:8px;background:rgba(0,0,0,.5);border-radius:4px;overflow:hidden}
.lane-tower .hpbar div{height:100%;background:var(--gold);border-radius:4px;transition:width .4s}
.lane-tower.foe .hpbar div{background:var(--red)}
.lane-zone{display:flex;justify-content:center;min-height:60px;background:rgba(0,0,0,.32);border:1px dashed rgba(255,255,255,.18);border-radius:10px;padding:6px;position:relative;cursor:pointer;flex-wrap:wrap;gap:5px;align-content:center}
.lane-zone.deploy{border-color:var(--gold);background:rgba(255,203,5,.08);cursor:pointer}
.lane-zone.deploy.can{border-style:solid;box-shadow:0 0 10px rgba(255,203,5,.35)}
.lane-zone .row-lbl{position:absolute;top:2px;left:6px;font-size:.55rem;color:var(--mut);font-family:'Black Ops One',cursive;letter-spacing:.5px;pointer-events:none}
.lane-unit{display:flex;flex-direction:column;align-items:center;gap:2px;padding:4px 6px;background:linear-gradient(160deg,var(--panel),var(--panel2));border:2px solid var(--bdr);border-radius:8px;min-width:55px;position:relative}
.lane-unit.foe{border-color:var(--red)}
.lane-unit.ply{border-color:var(--gold)}
.lane-unit .uart{width:32px;height:32px;display:flex;align-items:center;justify-content:center}
.lane-unit .uart img{max-width:30px;max-height:30px;image-rendering:pixelated}
.lane-unit .uart .emoji{font-size:1.4rem}
.lane-unit .uname{font-family:'Black Ops One',cursive;font-size:.55rem;color:#fff;line-height:1;white-space:nowrap;max-width:50px;overflow:hidden;text-overflow:ellipsis}
.lane-unit .uhp{font-family:'Black Ops One',cursive;font-size:.55rem;color:var(--gold)}
.lane-unit.frozen{filter:hue-rotate(180deg) brightness(1.2);outline:2px solid var(--cyan)}
.lane-controls{flex-shrink:0;background:#0a0e18;border-top:3px solid var(--gold);padding:8px;padding-bottom:max(8px,calc(8px + env(safe-area-inset-bottom)))}
.lane-log{padding:6px 10px;background:rgba(0,0,0,.55);border-radius:8px;font-size:var(--fs-xs);min-height:24px;line-height:1.3;margin-bottom:8px;color:var(--soft)}
.lane-log b{color:var(--gold)}
.lane-spell-row{display:flex;gap:6px;margin-bottom:6px}
.lane-spell{flex:1;padding:8px 4px;background:linear-gradient(135deg,#7c3aed,#3b82f6);border:1px solid #a855f7;border-radius:8px;color:#fff;font-family:'Black Ops One',cursive;font-size:var(--fs-xs);cursor:pointer;display:flex;flex-direction:column;gap:2px;align-items:center;min-height:46px}
.lane-spell:active{transform:scale(.96)}
.lane-spell:disabled{opacity:.4}
.lane-spell.selected{outline:2px solid var(--gold);outline-offset:1px}
.lane-spell .ic{font-size:1.1rem}
.lane-spell .cost{font-size:.55rem;color:#ffe680}
.lane-hand{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px}
.lane-hand-card{flex-shrink:0;width:80px;background:linear-gradient(160deg,var(--panel),var(--panel2));border:2px solid var(--bdr);border-radius:10px;padding:6px;text-align:center;cursor:pointer;position:relative;min-height:108px}
.lane-hand-card:active{transform:scale(.96)}
.lane-hand-card.selected{border-color:var(--gold);box-shadow:0 0 12px rgba(255,203,5,.5);transform:translateY(-4px)}
.lane-hand-card.disabled{opacity:.4}
.lane-hand-card.cant-afford{filter:grayscale(.7);opacity:.5;cursor:not-allowed}
.lane-hand-card.cant-afford:active{transform:none}
.lane-spell.cant-afford{filter:grayscale(.7);opacity:.5;cursor:not-allowed}
.lane-zone.spell-target{box-shadow:inset 0 0 14px rgba(168,85,247,.4);border-color:#a855f7}
.lane-top .lane-foe-hand{color:var(--red);font-family:'Black Ops One',cursive;letter-spacing:.5px}
.lane-top .lane-foe-hand b{color:#fff;font-size:var(--fs-base)}
.adv-boss-preview{padding:10px 14px;background:linear-gradient(135deg,rgba(168,85,247,.18),rgba(238,21,21,.12));border:2px solid #a855f7;border-radius:12px;margin:10px 14px}
.adv-bp-label{font-family:'Black Ops One',cursive;font-size:11px;color:#a855f7;letter-spacing:2px;margin-bottom:6px;text-align:center}
.adv-bp-card{display:flex;align-items:center;gap:12px}
.adv-bp-ico{font-size:2.2rem;flex-shrink:0}
.adv-bp-info{flex:1;min-width:0}
.adv-bp-name{font-family:'Black Ops One',cursive;font-size:14px;color:#fff;letter-spacing:1px}
.adv-bp-desc{font-size:11px;color:rgba(255,255,255,.7);margin-top:2px;line-height:1.3}
@keyframes dmgFloat{0%{opacity:0;transform:translateX(-50%) translateY(0)}15%{opacity:1}100%{opacity:0;transform:translateX(-50%) translateY(-50px)}}
.lane-hand-card .uart{height:42px;display:flex;align-items:center;justify-content:center}
.lane-hand-card .uart img{max-width:42px;max-height:42px;image-rendering:pixelated}
.lane-hand-card .uart .emoji{font-size:1.7rem}
.lane-hand-card .nm{font-family:'Black Ops One',cursive;font-size:var(--fs-xs);margin-top:3px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lane-hand-card .ec{position:absolute;top:2px;left:2px;width:22px;height:22px;background:linear-gradient(135deg,#a855f7,#ec4899);border-radius:50%;border:1px solid #fff;display:flex;align-items:center;justify-content:center;font-family:'Black Ops One',cursive;font-size:var(--fs-xs);color:#fff}
.lane-hand-card .stats{font-family:'Black Ops One',cursive;font-size:.55rem;color:var(--gold);margin-top:2px}

.toast{position:fixed;left:50%;top:80px;transform:translateX(-50%);padding:10px 18px;background:rgba(0,0,0,.92);border:1px solid var(--gold);border-radius:10px;color:var(--gold);font-family:'Black Ops One',cursive;font-size:var(--fs-sm);letter-spacing:1px;z-index:9500;animation:toast-pop 2s ease forwards;pointer-events:none}
@keyframes toast-pop{0%{opacity:0;transform:translate(-50%,-10px)}10%,80%{opacity:1;transform:translate(-50%,0)}100%{opacity:0;transform:translate(-50%,-10px)}}

.mini-dice{display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9700;align-items:center;justify-content:center;flex-direction:column;gap:12px}
.mini-dice.on{display:flex}
.mini-dice .face{width:100px;height:100px;border-radius:14px;border:3px solid var(--gold);background:linear-gradient(135deg,var(--panel),var(--panel2));display:flex;align-items:center;justify-content:center;font-family:'Black Ops One',cursive;font-size:3.6rem;color:var(--gold);animation:dice-spin 1s ease-out forwards}
@keyframes dice-spin{0%{transform:rotate(0)}100%{transform:rotate(720deg)}}
.mini-dice .lbl{color:#fff;font-family:'Black Ops One',cursive;font-size:var(--fs-base);letter-spacing:1px;max-width:80vw;text-align:center}

.exp-continue-pill{display:flex;align-items:center;gap:10px;padding:10px 14px;background:linear-gradient(135deg,rgba(34,197,94,.25),rgba(22,163,74,.15));border:2px solid #22c55e;border-radius:14px;width:300px;max-width:92vw;color:#fff;font-family:'Black Ops One',cursive;font-size:13px;cursor:pointer;letter-spacing:1.5px;margin-bottom:10px}
.exp-continue-pill:active{transform:scale(.97)}
.exp-continue-pill .ic{font-size:1.6rem}
.exp-continue-pill .sub{display:block;font-size:9px;opacity:.85;font-family:'Share Tech Mono',monospace;letter-spacing:.5px;margin-top:2px}

@keyframes laneDeploy{0%{transform:translateY(40px) scale(.6);opacity:0;filter:drop-shadow(0 0 12px var(--gold))}60%{transform:translateY(-4px) scale(1.08);opacity:1}100%{transform:translateY(0) scale(1);filter:none}}
.lane-unit-deploy{animation:laneDeploy .42s cubic-bezier(.2,.8,.3,1.1) both}
`;
  document.head.appendChild(style);

  // === HTML screens injection (waits for body) ===
  function injectScreens(){
    if(!document.body) return setTimeout(injectScreens, 50);
    const wrap = document.createElement('div');
    wrap.innerHTML = `
<!-- ============================== ADVENTURE: PICK PARTY ============================== -->
<div class="screen" id="advPick">
  <div class="topbar"><button class="back" onclick="goScreen('home')">‹ BACK</button><div class="ttl">PICK YOUR PARTY</div><div class="meta"><span id="advPickCount">0</span>/8</div></div>
  <div class="select-bar"><div class="ct">PARTY: <b id="advPickB">0</b> / 8 — pick 8 for the journey</div></div>
  <div class="page-body"><div class="roster-grid" id="advPickGrid"></div></div>
  <div class="start-bar"><button class="clear-btn" onclick="advPickClear()">CLEAR</button><button class="start-btn" id="advPickStart" disabled onclick="advStart()">▶ START QUEST</button></div>
</div>

<!-- ============================== ADVENTURE: PLAYING ============================== -->
<div class="screen" id="adventure">
  <div class="adv-top">
    <div class="adv-hp-wrap">
      <span class="adv-hp-lbl">PARTY</span>
      <div class="adv-hp-bar"><div class="adv-hp-fill" id="advHpFill" style="width:100%"></div></div>
      <span class="adv-hp-lbl" id="advHpNum">800/800</span>
    </div>
    <div class="adv-spaces" id="advSpaces">SPACE 1/25</div>
    <button class="adv-inv-btn" onclick="advOpenInv()">🎒 <span id="advInvCt">0</span></button>
    <button class="adv-inv-btn" onclick="advQuit()" style="background:rgba(238,21,21,.18);border-color:var(--red);color:#fff">✕</button>
  </div>
  <div class="adv-board-wrap">
    <svg id="advBoardSvg" viewBox="0 0 540 720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="advTrail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FFCB05"/>
          <stop offset="100%" stop-color="#EE1515"/>
        </linearGradient>
        <radialGradient id="advBossGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff"/>
          <stop offset="60%" stop-color="#A855F7"/>
          <stop offset="100%" stop-color="#4c1d95"/>
        </radialGradient>
      </defs>
      <g id="advPathGroup"></g>
      <g id="advTilesGroup"></g>
      <g id="advPawnGroup">
        <circle id="advPawnShadow" cx="60" cy="100" r="14" fill="rgba(0,0,0,.4)"/>
        <text id="advPawn" class="adv-pawn" x="60" y="108" text-anchor="middle" font-size="32" filter="drop-shadow(0 0 6px gold)">🚶</text>
      </g>
    </svg>
  </div>
  <div class="adv-bottom">
    <div class="adv-log" id="advLog">Tap ROLL DICE to start your journey!</div>
    <button class="adv-dice-btn" id="advDiceBtn" onclick="advRollDice()">🎲 ROLL DICE</button>
  </div>
</div>

<!-- Inventory tray -->
<div class="adv-tray" id="advTray">
  <div class="adv-tray-title">🎒 INVENTORY</div>
  <div class="adv-tray-list" id="advTrayList"></div>
  <button class="adv-tray-close" onclick="advCloseInv()">CLOSE</button>
</div>

<!-- Adventure mini battle modal -->
<div class="adv-fight" id="advFight">
  <div class="adv-fight-arena">
    <div class="adv-fight-side adv-fight-foe">
      <div class="adv-fight-art" id="advFightFoeArt"><span class="emoji">❓</span></div>
      <div class="adv-fight-name" id="advFightFoeName">FOE</div>
      <div class="adv-fight-hp-bar"><div class="adv-fight-hp-fill" id="advFightFoeHp" style="width:100%"></div></div>
      <div class="adv-fight-hp-num" id="advFightFoeHpNum">100/100</div>
    </div>
    <div class="adv-fight-vs">VS</div>
    <div class="adv-fight-side">
      <div class="adv-fight-art" id="advFightPlyArt"><span class="emoji">❓</span></div>
      <div class="adv-fight-name" id="advFightPlyName">YOU</div>
      <div class="adv-fight-hp-bar"><div class="adv-fight-hp-fill" id="advFightPlyHp" style="width:100%"></div></div>
      <div class="adv-fight-hp-num" id="advFightPlyHpNum">100/100</div>
    </div>
    <div class="adv-fight-pickactive" id="advFightPick" style="display:none">
      <div style="font-family:'Black Ops One',cursive;font-size:var(--fs-lg);color:var(--gold);letter-spacing:2px;margin-bottom:14px">CHOOSE A FIGHTER</div>
      <div id="advFightPickList" style="display:flex;flex-direction:column;gap:8px;width:100%;max-width:340px"></div>
    </div>
  </div>
  <div class="adv-fight-controls">
    <div class="adv-fight-log" id="advFightLog">A wild fighter appeared!</div>
    <div class="adv-fight-actions">
      <button class="fight" id="advFightAtk" onclick="advFightAttack()">⚔️ ATTACK</button>
      <button class="bag" id="advFightBag" onclick="advFightOpenBag()">🎒 ITEM</button>
      <button class="swap" id="advFightSwap" onclick="advFightSwap()">🔄 SWAP</button>
      <button class="flee" id="advFightFlee" onclick="advFightFlee()">🏃 FLEE</button>
    </div>
  </div>
</div>

<!-- ============================== LANE: PICK DECK ============================== -->
<div class="screen" id="lanePick">
  <div class="topbar"><button class="back" onclick="goScreen('home')">‹ BACK</button><div class="ttl">BUILD LANE DECK</div><div class="meta"><span id="lanePickCount">0</span>/6</div></div>
  <div class="select-bar"><div class="ct">DECK: <b id="lanePickB">0</b> / 6 — pick 6 (3 spells included free)</div></div>
  <div class="page-body"><div class="roster-grid" id="lanePickGrid"></div></div>
  <div class="start-bar"><button class="clear-btn" onclick="lanePickClear()">CLEAR</button><button class="start-btn" id="lanePickStart" disabled onclick="laneStart()">▶ START DUEL</button></div>
</div>

<!-- ============================== LANE: PLAYING ============================== -->
<div class="screen" id="lane">
  <div class="lane-top">
    <div class="turn" id="laneTurn">TURN 1 — YOUR PHASE</div>
    <span class="lane-foe-hand">🎴 <b id="laneFoeHand">0</b></span>
    <div class="elx">⚡ <b id="laneElx">5</b>/10</div>
    <button class="end-btn" id="laneEnd" onclick="laneEndTurn()">▶ END TURN</button>
    <button class="adv-inv-btn" onclick="laneQuit()" style="background:rgba(238,21,21,.18);border-color:var(--red);color:#fff;padding:5px 8px">✕</button>
  </div>
  <div class="lane-board" id="laneBoard"></div>
  <div class="lane-controls">
    <div class="lane-log" id="laneLog">Tap a card or spell, then tap a deploy zone.</div>
    <div class="lane-spell-row" id="laneSpells"></div>
    <div class="lane-hand" id="laneHand"></div>
  </div>
</div>

<!-- Adventure flash overlay -->
<div class="adv-flash" id="advFlash"></div>

<!-- Mini dice (adventure/lane) -->
<div class="mini-dice" id="miniDice">
  <div class="face" id="miniDiceFace">?</div>
  <div class="lbl" id="miniDiceLabel">Rolling D6...</div>
</div>
`;
    while(wrap.firstChild) document.body.appendChild(wrap.firstChild);
  }
  injectScreens();

  // === Mode logic ===
  function $(id){return document.getElementById(id)}
  function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
  function effect(at,dt){const TC=window.TYPE_CHART||{};const r=(TC[at]||{})[dt];return r==null?1:r}
  function artHTML(p){
    if(typeof window.artHTML === 'function') return window.artHTML(p);
    if(p && p.pid && typeof window.pokeUrl === 'function'){return `<img src="${window.pokeUrl(p.pid)}" alt="${p.n}" onerror="this.outerHTML='<span class=emoji>${p.fb||'❓'}</span>'">`}
    return `<span class="emoji">${(p&&(p.fb||p.ico))||'❓'}</span>`;
  }
  function buildCardEl(h,selected,onclick){
    if(typeof window.buildCardEl === 'function') return window.buildCardEl(h,selected,onclick);
    const el=document.createElement('div');el.className='hero-card'+(selected?' selected':'');el.onclick=onclick;
    el.innerHTML=`<div class="elixir-badge">${h.elixir||3}</div><div class="pokeart">${artHTML(h)}</div><div class="name">${h.n}</div><div class="stats"><div class="stat"><span>HP</span><b>${h.hp}</b></div><div class="stat"><span>ATK</span><b>${h.atk}</b></div></div>`;
    return el;
  }
  function tone(f,d,t,v){if(typeof window.tone==='function')return window.tone(f,d,t,v)}
  function tt(f,d,t,v){ try{ if(typeof window.tone==='function') window.tone(f,d,t,v); else if(window.AudioContext||window.webkitAudioContext){const ctx=tt._ctx||(tt._ctx=new (window.AudioContext||window.webkitAudioContext)());const o=ctx.createOscillator();const g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+d);o.start();o.stop(ctx.currentTime+d);} }catch(e){} }
  var sfx = {
    dice: ()=>{ for(let i=0;i<4;i++) setTimeout(()=>tt(700+Math.random()*400,0.04,'square',0.05), i*70); },
    step: ()=>tt(400,0.06,'square',0.05),
    battle: ()=>{ tt(220,0.15,'sawtooth',0.08); setTimeout(()=>tt(330,0.12,'sawtooth',0.08),120); },
    hit: ()=>tt(180,0.08,'square',0.1),
    heal: ()=>{ tt(523,0.12,'sine',0.1); setTimeout(()=>tt(659,0.15,'sine',0.1),100); },
    powerup: ()=>{ tt(523,0.08,'triangle',0.08); setTimeout(()=>tt(659,0.08,'triangle',0.08),80); setTimeout(()=>tt(784,0.12,'triangle',0.08),160); },
    trap: ()=>tt(110,0.25,'sawtooth',0.1),
    treasure: ()=>{ for(let i=0;i<3;i++) setTimeout(()=>tt(600+i*100,0.1,'sine',0.07), i*80); },
    win: ()=>{ tt(523,0.15,'triangle',0.1); setTimeout(()=>tt(659,0.15,'triangle',0.1),150); setTimeout(()=>tt(784,0.25,'triangle',0.1),300); },
    lose: ()=>{ tt(330,0.2,'sawtooth',0.1); setTimeout(()=>tt(220,0.3,'sawtooth',0.1),200); },
    deploy: ()=>tt(500,0.06,'square',0.06),
    spell: ()=>{ tt(800,0.08,'sine',0.07); setTimeout(()=>tt(1000,0.06,'sine',0.07),50); },
    freeze: ()=>tt(900,0.18,'sine',0.06),
    fireball: ()=>{ tt(180,0.1,'sawtooth',0.1); setTimeout(()=>tt(120,0.18,'sawtooth',0.1),100); }
  };
  function sfxClick(){if(typeof window.sfxClick==='function')window.sfxClick()}
  function sfxSelect(){if(typeof window.sfxSelect==='function')window.sfxSelect()}
  function sfxHit(){if(typeof window.sfxHit==='function')window.sfxHit()}
  function sfxHeal(){if(typeof window.sfxHeal==='function')window.sfxHeal()}
  function sfxFaint(){if(typeof window.sfxFaint==='function')window.sfxFaint()}
  function sfxDice(){if(typeof window.sfxDice==='function')window.sfxDice()}
  function sfxStep(){if(typeof window.sfxStep==='function')window.sfxStep()}
  function sfxTreasure(){if(typeof window.sfxTreasure==='function')window.sfxTreasure()}
  function sfxTrap(){if(typeof window.sfxTrap==='function')window.sfxTrap()}
  function sfxVictory(){if(typeof window.sfxVictory==='function')window.sfxVictory()}
  function sfxDefeat(){if(typeof window.sfxDefeat==='function')window.sfxDefeat()}
  function loadStore(){return (typeof window.loadStore==='function')?window.loadStore():(JSON.parse(localStorage.getItem('tcw_store')||'{}'))}
  function saveStore(s){if(typeof window.saveStore==='function')return window.saveStore(s);localStorage.setItem('tcw_store',JSON.stringify(s))}
  function goScreenInner(id){if(typeof window.goScreenInner==='function')return window.goScreenInner(id);document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));const el=$(id);if(el)el.classList.add('on')}

  function toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2000)}
  function showDmgFloat(targetSelector, value, color){
    const el = document.querySelector(targetSelector);
    if(!el) return;
    const r = el.getBoundingClientRect();
    const f = document.createElement('div');
    f.className = 'dmg-float';
    f.style.cssText = 'position:fixed;left:'+(r.left+r.width/2)+'px;top:'+r.top+'px;color:'+(color||'#ee1515')+';font-family:Black Ops One,cursive;font-size:1.6rem;font-weight:bold;text-shadow:0 0 6px rgba(0,0,0,.9);pointer-events:none;z-index:9999;animation:dmgFloat 1.1s ease-out forwards';
    f.textContent = value;
    document.body.appendChild(f);
    setTimeout(()=>f.remove(), 1100);
  }
  function flashScreen(color){const fx=$('advFlash');if(!fx)return;fx.classList.remove('green','red');void fx.offsetWidth;fx.classList.add(color)}

  function getAdventure(){const s=loadStore();return s.adventure||{runs:0,wins:0,losses:0,lastClear:0}}
  function setAdventure(a){const s=loadStore();s.adventure=a;saveStore(s)}
  function getLane(){const s=loadStore();return s.lane||{wins:0,losses:0}}
  function setLane(l){const s=loadStore();s.lane=l;saveStore(s)}

  function saveAdvRun(){
    if(!advState) return;
    try{
      const s=loadStore();
      s.advRun={
        party: advState.party.map(p=>({id:p.id,n:p.n,fb:p.fb,pid:p.pid,t:p.t,atk:p.atk,def:p.def,spd:p.spd,hp:p.hp,hpMax:p.hpMax,xp:p.xp||0,fainted:!!p.fainted})),
        pos: advState.space,
        types: advState.types,
        inventory: advState.inventory.map(i=>({k:i.k,ic:i.ic,n:i.n,desc:i.desc})),
        shieldNext: !!advState.shieldNext,
        atkBuffNext: !!advState.atkBuffNext,
        rerollAvailable: advState.rerollAvailable||0,
        log: (advState.log||[]).slice(-12),
      };
      saveStore(s);
    }catch(e){}
  }
  function clearAdvRun(){try{const s=loadStore();delete s.advRun;saveStore(s);}catch(e){}}
  function hasAdvRun(){try{const s=loadStore();return !!(s&&s.advRun&&Array.isArray(s.advRun.party)&&s.advRun.party.length);}catch(e){return false}}

  /* ============================== ADVENTURE BOARD ============================== */
  let advState=null;
  let advPickList=[];

  window.renderAdvPick = function(){
    advPickList=[];
    $('advPickB').textContent=0;$('advPickCount').textContent=0;$('advPickStart').disabled=true;
    // Boss preview banner
    const pickBody = $('advPickGrid') && $('advPickGrid').parentElement;
    if(pickBody){
      const oldBanner = pickBody.parentElement && pickBody.parentElement.querySelector('.adv-boss-preview');
      if(oldBanner) oldBanner.remove();
      const BOSSES = window.BOSSES;
      if(Array.isArray(BOSSES) && BOSSES.length){
        const boss = BOSSES[BOSSES.length-1];
        if(boss){
          const banner = document.createElement('div');
          banner.className = 'adv-boss-preview';
          banner.innerHTML = `<div class="adv-bp-label">⚠️ FINAL BOSS</div><div class="adv-bp-card"><span class="adv-bp-ico">${boss.ico||'👑'}</span><div class="adv-bp-info"><div class="adv-bp-name">${boss.n||'???'}</div><div class="adv-bp-desc">${boss.desc||''}</div></div></div>`;
          pickBody.parentElement.insertBefore(banner, pickBody);
        }
      }
    }
    const grid=$('advPickGrid');grid.innerHTML='';
    const ROSTER=window.ROSTER||[];
    ROSTER.forEach(h=>{
      const el=buildCardEl(h,false,()=>{
        const i=advPickList.indexOf(h.id);
        if(i>=0)advPickList.splice(i,1);
        else if(advPickList.length<8)advPickList.push(h.id);
        else return;
        tone(660,0.06,'sine',0.1);
        renderAdvPickRefresh();
      });
      grid.appendChild(el);
    });
  };
  function renderAdvPickRefresh(){
    $('advPickB').textContent=advPickList.length;$('advPickCount').textContent=advPickList.length;
    $('advPickStart').disabled=advPickList.length!==8;
    const cards=$('advPickGrid').children;
    const ROSTER=window.ROSTER||[];
    ROSTER.forEach((h,i)=>{cards[i]&&cards[i].classList.toggle('selected',advPickList.includes(h.id))});
  }
  window.advPickClear = function(){advPickList=[];renderAdvPickRefresh()};

  function buildBoardWaypoints(){
    const W=540,H=720,pad=70;
    const colXs=[pad+0*((W-2*pad)/4),pad+1*((W-2*pad)/4),pad+2*((W-2*pad)/4),pad+3*((W-2*pad)/4),pad+4*((W-2*pad)/4)];
    const rowYs=[110,230,350,470,590,690];
    const wp=[];
    for(let c=0;c<5;c++)wp.push({x:colXs[c],y:rowYs[0]});
    for(let c=4;c>=0;c--)wp.push({x:colXs[c],y:rowYs[1]});
    for(let c=0;c<5;c++)wp.push({x:colXs[c],y:rowYs[2]});
    for(let c=4;c>=0;c--)wp.push({x:colXs[c],y:rowYs[3]});
    for(let c=0;c<4;c++)wp.push({x:colXs[c],y:rowYs[4]});
    wp.push({x:colXs[2],y:rowYs[5]});
    return wp.slice(0,25);
  }

  const SPACE_TYPES={
    battle:{ic:'⚔️',color:'#EE1515',name:'BATTLE'},
    power:{ic:'🎁',color:'#22D3EE',name:'POWER-UP'},
    heal:{ic:'❤️',color:'#22C55E',name:'HEAL'},
    treasure:{ic:'💎',color:'#FFCB05',name:'TREASURE'},
    trap:{ic:'⚠️',color:'#7F1D1D',name:'TRAP'},
    skip:{ic:'⏩',color:'#3B82F6',name:'SKIP'},
    rest:{ic:'🛌',color:'#A855F7',name:'REST'},
    mystery:{ic:'❓',color:'#F472B6',name:'MYSTERY'},
    boss:{ic:'👑',color:'url(#advBossGrad)',name:'BOSS'},
  };

  function buildSpaceTypes(){
    const arr=new Array(25).fill('battle');
    const set=(num,t)=>arr[num-1]=t;
    [1,4,7,10,12,14,17,19,21,23].forEach(n=>set(n,'battle'));
    [2,8,15,20].forEach(n=>set(n,'power'));
    [5,11,18].forEach(n=>set(n,'heal'));
    [3,13,22].forEach(n=>set(n,'treasure'));
    [6,16].forEach(n=>set(n,'trap'));
    set(9,'skip');
    set(24,'rest');
    set(25,'boss');
    return arr;
  }

  window.advStart = function(){
    if(advPickList.length!==8)return;
    if(hasAdvRun()){
      if(!confirm('Start a fresh run? Your saved run will be lost.'))return;
      clearAdvRun();
    }
    sfxClick();
    const ROSTER=window.ROSTER||[];
    const party=advPickList.map(id=>{const r=ROSTER.find(x=>x.id===id);return{id:r.id,n:r.n,fb:r.fb,pid:r.pid,t:r.t,atk:r.atk,def:r.def,spd:r.spd,hpMax:r.hp,hp:r.hp,xp:0,fainted:false}});
    advState={
      party,space:0,types:buildSpaceTypes(),waypoints:buildBoardWaypoints(),
      inventory:[],shieldNext:false,atkBuffNext:false,log:[],busy:false,pendingSteps:0,rerollAvailable:0,
    };
    const adv=getAdventure();adv.runs=(adv.runs||0)+1;setAdventure(adv);
    goScreenInner('adventure');
    drawAdvBoard();advUpdateHUD();
    advLog('🎲 Welcome! Tap ROLL DICE to begin.');
    saveAdvRun();
  };

  window.advResume = function(){
    if(!hasAdvRun())return;
    try{
      const s=loadStore();const r=s.advRun;
      const ROSTER=window.ROSTER||[];
      const party=r.party.map(p=>{
        const ros=ROSTER.find(x=>x.id===p.id)||{};
        return{id:p.id,n:p.n||ros.n,fb:p.fb||ros.fb,pid:p.pid||ros.pid,t:p.t||ros.t,atk:p.atk||ros.atk,def:p.def||ros.def,spd:p.spd||ros.spd,hpMax:p.hpMax,hp:p.hp,xp:p.xp||0,fainted:!!p.fainted};
      });
      advState={
        party,
        space:r.pos||0,
        types:Array.isArray(r.types)&&r.types.length===25?r.types:buildSpaceTypes(),
        waypoints:buildBoardWaypoints(),
        inventory:Array.isArray(r.inventory)?r.inventory.slice():[],
        shieldNext:!!r.shieldNext,atkBuffNext:!!r.atkBuffNext,
        log:Array.isArray(r.log)?r.log.slice():[],
        busy:false,pendingSteps:0,rerollAvailable:r.rerollAvailable||0,
      };
      goScreenInner('adventure');
      drawAdvBoard();
      movePawn(Math.max(0,advState.space-1));
      advUpdateHUD();
      highlightCurrentTile();
      advLog('▶ Resumed your run at space '+advState.space+'/25.');
    }catch(e){clearAdvRun();}
  };

  function drawAdvBoard(){
    const pathG=$('advPathGroup');pathG.innerHTML='';
    const tilesG=$('advTilesGroup');tilesG.innerHTML='';
    const wp=advState.waypoints;
    let d='M '+wp[0].x+' '+wp[0].y;
    for(let i=1;i<wp.length;i++){
      const a=wp[i-1],b=wp[i];
      if(a.y===b.y){d+=' L '+b.x+' '+b.y}
      else{
        const mx=(a.x+b.x)/2;
        d+=' Q '+mx+' '+a.y+' '+mx+' '+((a.y+b.y)/2);
        d+=' Q '+mx+' '+b.y+' '+b.x+' '+b.y;
      }
    }
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d',d);path.setAttribute('stroke','url(#advTrail)');path.setAttribute('stroke-width',12);path.setAttribute('fill','none');path.setAttribute('stroke-linecap','round');path.setAttribute('opacity',.55);
    pathG.appendChild(path);
    wp.forEach((p,i)=>{
      const type=advState.types[i];const meta=SPACE_TYPES[type];
      const g=document.createElementNS('http://www.w3.org/2000/svg','g');
      g.setAttribute('class','adv-tile');g.setAttribute('data-idx',i);
      const r=type==='boss'?26:18;
      const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
      c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('r',r);c.setAttribute('fill',meta.color);c.setAttribute('stroke','#fff');c.setAttribute('stroke-width',2);
      g.appendChild(c);
      const t=document.createElementNS('http://www.w3.org/2000/svg','text');
      t.setAttribute('x',p.x);t.setAttribute('y',p.y+(type==='boss'?9:7));t.setAttribute('text-anchor','middle');t.setAttribute('font-size',type==='boss'?22:18);t.textContent=meta.ic;
      g.appendChild(t);
      const n=document.createElementNS('http://www.w3.org/2000/svg','text');
      n.setAttribute('x',p.x);n.setAttribute('y',p.y-r-4);n.setAttribute('text-anchor','middle');n.setAttribute('font-size',10);n.setAttribute('fill','#fff');n.setAttribute('font-family','Black Ops One,cursive');n.textContent=i+1;
      g.appendChild(n);
      tilesG.appendChild(g);
    });
    highlightCurrentTile();
    movePawn(0);
  }
  function highlightCurrentTile(){
    document.querySelectorAll('#advTilesGroup .adv-tile').forEach(t=>t.classList.remove('current'));
    const next=advState.space;
    if(next>=0&&next<25){
      const t=document.querySelector(`#advTilesGroup .adv-tile[data-idx="${next}"]`);
      if(t)t.classList.add('current');
    }
  }
  function movePawn(idx){
    const wp=advState.waypoints[idx]||advState.waypoints[0];
    const p=$('advPawn');p.setAttribute('x',wp.x);p.setAttribute('y',wp.y+8);
    const s=$('advPawnShadow');s.setAttribute('cx',wp.x);s.setAttribute('cy',wp.y+18);
  }

  function advUpdateHUD(){
    const totalHp=advState.party.reduce((s,p)=>s+p.hp,0);
    const maxHp=advState.party.reduce((s,p)=>s+p.hpMax,0);
    const frac=totalHp/maxHp;
    const fill=$('advHpFill');
    fill.style.width=(frac*100).toFixed(1)+'%';
    fill.classList.remove('med','low');
    if(frac<.25)fill.classList.add('low');else if(frac<.5)fill.classList.add('med');
    $('advHpNum').textContent=totalHp+'/'+maxHp;
    $('advSpaces').textContent='SPACE '+(advState.space)+'/25';
    $('advInvCt').textContent=advState.inventory.length;
  }
  function advLog(msg){$('advLog').innerHTML=msg;advState.log.push(msg.replace(/<[^>]+>/g,''))}

  window.advRollDice = async function(){
    if(advState.busy)return;advState.busy=true;
    $('advDiceBtn').disabled=true;
    sfx.dice();
    await advRollAndStep(false);
    if(advState.space<25)advState.busy=false;
    $('advDiceBtn').disabled=advState.busy||advState.space>=25;
    saveAdvRun();
  };

  async function advRollAndStep(skipDiceAnim){
    let roll;
    if(!skipDiceAnim){roll=await advShowDice()}else{roll=advState.pendingSteps;advState.pendingSteps=0}
    advLog(`🎲 You rolled <b>${roll}</b>! Moving…`);
    for(let s=0;s<roll;s++){
      if(advState.space>=25)break;
      advState.space++;
      movePawn(advState.space-1);
      sfxStep();sfx.step();
      await sleep(280);
    }
    advUpdateHUD();highlightCurrentTile();
    saveAdvRun();
    await advTriggerSpace(advState.space);
    saveAdvRun();
  }

  function advShowDice(){return new Promise(resolve=>{
    const md=$('miniDice');const face=$('miniDiceFace');const lbl=$('miniDiceLabel');
    md.classList.add('on');lbl.textContent='Rolling D6...';
    sfxDice();
    const tick=setInterval(()=>{face.textContent=(Math.floor(Math.random()*6)+1)},80);
    setTimeout(()=>{
      clearInterval(tick);
      const n=Math.floor(Math.random()*6)+1;
      face.textContent=n;
      lbl.textContent='You rolled '+n+'!';
      setTimeout(()=>{md.classList.remove('on');resolve(n)},650);
    },900);
  })}

  async function advTriggerSpace(idx1){
    if(idx1<1||idx1>25){advState.busy=false;return}
    const type=advState.types[idx1-1];
    switch(type){
      case 'battle':await advDoBattle(false);break;
      case 'power':advDoPowerUp();break;
      case 'heal':await advDoHeal();break;
      case 'treasure':advDoTreasure();break;
      case 'trap':await advDoTrap();break;
      case 'skip':await advDoSkip();break;
      case 'rest':advDoRest();break;
      case 'mystery':await advDoMystery();break;
      case 'boss':await advDoBoss();break;
    }
    advUpdateHUD();
    if(advState.party.every(p=>p.fainted||p.hp<=0)&&type!=='boss'){advGameOver(false)}
  }

  const POWERUPS=[
    {k:'potion',ic:'🧪',n:'Healing Potion',desc:'Heal 50 HP to one party member'},
    {k:'damage',ic:'⚡',n:'Damage Buff',desc:'Next attack deals +25 damage'},
    {k:'shield',ic:'🛡️',n:'Shield',desc:'Block the next attack'},
    {k:'energy',ic:'🔋',n:'Energy Boost',desc:'Skip cooldown / extra dice roll'},
    {k:'reroll',ic:'🔄',n:'Reroll',desc:'Redo your last dice roll'},
  ];

  function advDoPowerUp(){
    const p=POWERUPS[Math.floor(Math.random()*POWERUPS.length)];
    advState.inventory.push({...p});
    advLog(`🎁 Found a <b>${p.n}</b>!`);
    toast('Got '+p.ic+' '+p.n);sfxTreasure();sfx.powerup();
    saveAdvRun();
  }
  async function advDoHeal(){
    flashScreen('green');sfxHeal();sfx.heal();
    advState.party.forEach(p=>{if(!p.fainted&&p.hp>0){p.hp=Math.min(p.hpMax,p.hp+50)}});
    advLog('❤️ Healing aura — all party +50 HP!');
    saveAdvRun();
    await sleep(700);
  }
  function advDoTreasure(){
    const alive=advState.party.filter(p=>!p.fainted);
    if(alive.length){const tgt=alive[Math.floor(Math.random()*alive.length)];tgt.xp+=50;advLog(`💎 Treasure! ${tgt.n} gained 50 XP.`)}
    toast('+50 XP');sfxTreasure();sfx.treasure();
    saveAdvRun();
  }
  async function advDoTrap(){
    flashScreen('red');sfxTrap();sfx.trap();
    advState.party.forEach(p=>{if(!p.fainted){p.hp=Math.max(0,p.hp-30);if(p.hp<=0)p.fainted=true}});
    advLog('⚠️ TRAP! Party took 30 damage each!');
    saveAdvRun();
    await sleep(800);
  }
  async function advDoSkip(){
    advLog('⏩ Skip space! Auto-advancing 3 spaces…');
    await sleep(500);
    advState.pendingSteps=3;
    await advRollAndStep(true);
  }
  function advDoRest(){
    advState.shieldNext=true;
    advLog('🛌 You rest by the campfire. Shield buff active for next battle!');
    sfxHeal();toast('🛡 Shield ready');
  }
  async function advDoMystery(){
    const types=['power','treasure','heal','trap'];
    const t=types[Math.floor(Math.random()*types.length)];
    advLog(`❓ MYSTERY → ${SPACE_TYPES[t].name}!`);
    await sleep(600);
    if(t==='power')advDoPowerUp();
    else if(t==='treasure')advDoTreasure();
    else if(t==='heal')await advDoHeal();
    else await advDoTrap();
  }

  let advFightState=null;
  function advDoBattle(isBoss){sfx.battle();return new Promise(resolve=>{advFightOpen(isBoss,resolve)})}
  function advFoeLevelForPos(pos){
    if(pos>20)return 11;
    if(pos>=13)return 9;
    if(pos>=5)return 7;
    return 5;
  }
  function advFightOpen(isBoss,onClose){
    const ROSTER=window.ROSTER||[];
    let foe;
    if(isBoss){
      const bossIds=['mewtwo','mew','dragonite'];
      const found=bossIds.map(id=>ROSTER.find(r=>r.id===id)).filter(Boolean);
      const pool=found.length?found:[...ROSTER].sort((a,b)=>b.hp-a.hp).slice(0,3);
      advFightState={isBoss:true,foeTeam:pool.map(r=>buildFighter(r,1.4)),foeIdx:0,onClose,foeLevel:11};
      advFightShowPick(true);
      return;
    }
    const pool=ROSTER.filter(r=>r.id!==advState.party[0].id);
    const r=pool[Math.floor(Math.random()*pool.length)];
    const lv=advFoeLevelForPos(advState.space||0);
    const hpScale=1+(lv-5)*0.06;
    const atkScale=1+(lv-5)*0.05;
    foe=buildFighterScaled(r,hpScale,atkScale);
    foe._lv=lv;
    advFightState={isBoss:false,foe,plyIdx:null,onClose,foeLevel:lv};
    advFightShowPick(false);
  }
  function buildFighter(r,scale){return{id:r.id,n:r.n,fb:r.fb,pid:r.pid,t:r.t,hpMax:Math.round(r.hp*scale),hp:Math.round(r.hp*scale),atk:Math.round(r.atk*scale),def:Math.round(r.def*scale),spd:r.spd,fainted:false}}
  function buildFighterScaled(r,hpScale,atkScale){return{id:r.id,n:r.n,fb:r.fb,pid:r.pid,t:r.t,hpMax:Math.round(r.hp*hpScale),hp:Math.round(r.hp*hpScale),atk:Math.round(r.atk*atkScale),def:Math.round(r.def*hpScale),spd:r.spd,fainted:false}}
  function advFightShowPick(isBoss){
    $('advFight').classList.add('on');
    $('advFightPick').style.display='flex';
    const list=$('advFightPickList');list.innerHTML='';
    const pickTitle=isBoss?'BOSS BATTLE — pick 3 to face the King':'CHOOSE A FIGHTER';
    $('advFightPick').firstElementChild.textContent=pickTitle;
    const allowed=isBoss?3:1;
    const chosen=[];
    function refreshRows(){
      list.innerHTML='';
      advState.party.forEach((p,i)=>{
        const row=document.createElement('div');
        row.className='adv-fight-pickrow'+((p.fainted||p.hp<=0)?' fainted':'')+(chosen.includes(i)?' selected':'');
        if(chosen.includes(i))row.style.borderColor='var(--gold)';
        row.innerHTML=`<div class="ic">${artHTML(p)}</div><div class="info"><div class="nm">${p.n}</div><div class="hp-num">HP ${p.hp}/${p.hpMax}</div></div>`;
        if(!p.fainted&&p.hp>0)row.onclick=()=>{
          const ci=chosen.indexOf(i);
          if(ci>=0){chosen.splice(ci,1)}
          else if(chosen.length<allowed){chosen.push(i)}
          if(chosen.length===allowed){
            $('advFightPick').style.display='none';
            if(isBoss){advFightStartBoss(chosen)}else{advFightStartSolo(chosen[0])}
          }else{refreshRows()}
        };
        list.appendChild(row);
      });
      if(isBoss){
        const hint=document.createElement('div');hint.style.cssText='color:var(--soft);font-size:11px;margin-top:8px;font-family:Black Ops One,cursive';hint.textContent='Selected: '+chosen.length+'/3';
        list.appendChild(hint);
      }
    }
    refreshRows();
  }
  function advFightStartSolo(plyIdx){
    advFightState.plyIdx=plyIdx;
    const ply=advState.party[plyIdx];
    advFightState.ply={...ply,_partyIdx:plyIdx};
    advFightUpdate();
    const lv=advFightState.foeLevel||5;
    $('advFightLog').innerHTML='A LEVEL '+lv+' <b>'+advFightState.foe.n+'</b> appears!';
  }
  function advFightStartBoss(plyIdxArr){
    advFightState.plyTeam=plyIdxArr.map(idx=>{const p=advState.party[idx];return{...p,_partyIdx:idx}});
    advFightState.plyTeamIdx=0;
    advFightState.ply=advFightState.plyTeam[0];
    advFightState.foe=advFightState.foeTeam[0];
    advFightUpdate();
    $('advFightLog').innerHTML='⚔️ Boss Battle! <b>'+advFightState.foe.n+'</b> stands ready!';
  }
  function advFightUpdate(){
    const ply=advFightState.ply,foe=advFightState.foe;
    $('advFightFoeName').textContent=foe.n;
    $('advFightFoeArt').innerHTML=artHTML(foe);
    $('advFightFoeHpNum').textContent=foe.hp+'/'+foe.hpMax;
    $('advFightFoeHp').style.width=Math.max(0,foe.hp/foe.hpMax*100)+'%';
    $('advFightPlyName').textContent=ply.n;
    $('advFightPlyArt').innerHTML=artHTML(ply);
    $('advFightPlyHpNum').textContent=ply.hp+'/'+ply.hpMax;
    $('advFightPlyHp').style.width=Math.max(0,ply.hp/ply.hpMax*100)+'%';
  }
  window.advFightAttack = async function(){
    if(advFightState.busy)return;advFightState.busy=true;
    const ply=advFightState.ply,foe=advFightState.foe;
    const plyFirst=ply.spd>=foe.spd;
    const bonus=advState.atkBuffNext?25:0;
    if(plyFirst){
      await advFightDoAttack(ply,foe,'ply',bonus);
      if(foe.hp>0)await advFightDoAttack(foe,ply,'foe',0,advState.shieldNext);
    }else{
      await advFightDoAttack(foe,ply,'foe',0,advState.shieldNext);
      if(ply.hp>0)await advFightDoAttack(ply,foe,'ply',bonus);
    }
    if(advState.atkBuffNext)advState.atkBuffNext=false;
    if(advState.shieldNext)advState.shieldNext=false;
    if(foe.hp<=0)return advFightFoeKO();
    if(ply.hp<=0)return advFightPlyKO();
    advFightState.busy=false;
  };
  async function advFightDoAttack(att,def,attSide,atkBonus,shielded){
    const eff=effect(att.t,def.t);
    let dmg=Math.max(1,Math.round(((att.atk+atkBonus)*1.6 - def.def*0.7)*eff));
    if(shielded){$('advFightLog').innerHTML='🛡️ Shield blocked the first attack!';dmg=0;await sleep(700)}
    if(dmg>0){
      def.hp=Math.max(0,def.hp-dmg);
      sfxHit();sfx.hit();
      let msg=`<b>${att.n}</b> hits ${def.n} for <b>${dmg}</b>!`;
      if(eff>1)msg+=' Super effective!';else if(eff<1)msg+=' Resisted.';
      $('advFightLog').innerHTML=msg;
      // Damage float on the side that took damage
      const targetSel = (attSide==='ply') ? '#advFightFoeArt' : '#advFightPlyArt';
      showDmgFloat(targetSel, '-'+dmg, '#ee1515');
      advFightUpdate();
    }
    if(att._partyIdx!=null){const p=advState.party[att._partyIdx];p.hp=att.hp}
    if(def._partyIdx!=null){const p=advState.party[def._partyIdx];p.hp=def.hp}
    await sleep(900);
  }
  async function advFightFoeKO(){
    sfxFaint();
    $('advFightLog').innerHTML='🎉 <b>'+advFightState.foe.n+'</b> fainted!';
    await sleep(1100);
    if(advFightState.isBoss){
      advFightState.foeIdx++;
      if(advFightState.foeIdx>=advFightState.foeTeam.length){
        advFightClose();advGameOver(true);return;
      }
      advFightState.foe=advFightState.foeTeam[advFightState.foeIdx];
      advFightUpdate();
      $('advFightLog').innerHTML='Foe sent out <b>'+advFightState.foe.n+'</b>!';
      advFightState.busy=false;return;
    }
    const ply=advFightState.ply;
    if(ply._partyIdx!=null){advState.party[ply._partyIdx].xp+=30}
    advFightClose();
    advLog('🎉 You defeated the wild '+advFightState.foe.n+'!');
  }
  async function advFightPlyKO(){
    sfxFaint();
    const ply=advFightState.ply;
    if(ply._partyIdx!=null){const p=advState.party[ply._partyIdx];p.hp=0;p.fainted=true}
    saveAdvRun();
    $('advFightLog').innerHTML='💀 Your <b>'+ply.n+'</b> fainted!';
    await sleep(1100);
    if(advFightState.isBoss){
      advFightState.plyTeamIdx++;
      if(advFightState.plyTeamIdx>=advFightState.plyTeam.length){
        advFightClose();advGameOver(false);return;
      }
      advFightState.ply=advFightState.plyTeam[advFightState.plyTeamIdx];
      advFightUpdate();advFightState.busy=false;return;
    }
    advFightClose();
    advLog('💀 Your '+ply.n+' fainted in battle…');
    if(advState.party.every(p=>p.fainted||p.hp<=0)){advGameOver(false)}
  }
  function advFightClose(){
    $('advFight').classList.remove('on');
    const cb=advFightState&&advFightState.onClose;
    advFightState=null;
    advState.busy=false;
    $('advDiceBtn').disabled=advState.space>=25;
    saveAdvRun();
    if(cb)cb();
  }
  window.advFightOpenBag = function(){
    const usable=advState.inventory.filter(i=>['potion','damage','shield'].includes(i.k));
    if(!usable.length){toast('No usable items');return}
    const it=usable[0];
    const idx=advState.inventory.indexOf(it);
    if(it.k==='potion'){const ply=advFightState.ply;const heal=Math.min(50,ply.hpMax-ply.hp);ply.hp+=heal;if(ply._partyIdx!=null)advState.party[ply._partyIdx].hp=ply.hp;sfxHeal();sfx.heal();$('advFightLog').innerHTML='🧪 Used Potion! +'+heal+' HP.';showDmgFloat('#advFightPlyArt','+'+heal,'#22c55e');advFightUpdate()}
    else if(it.k==='damage'){advState.atkBuffNext=true;$('advFightLog').innerHTML='⚡ Damage Buff active!'}
    else if(it.k==='shield'){advState.shieldNext=true;$('advFightLog').innerHTML='🛡️ Shield raised!'}
    advState.inventory.splice(idx,1);advUpdateHUD();saveAdvRun();
  };
  window.advFightSwap = function(){
    if(advFightState.isBoss&&advFightState.plyTeam){
      advFightState.plyTeamIdx=(advFightState.plyTeamIdx+1)%advFightState.plyTeam.length;
      advFightState.ply=advFightState.plyTeam[advFightState.plyTeamIdx];
      advFightUpdate();
      $('advFightLog').innerHTML='🔄 Swapped to <b>'+advFightState.ply.n+'</b>!';
      return;
    }
    const cur=advFightState.ply._partyIdx;
    for(let off=1;off<advState.party.length;off++){
      const i=(cur+off)%advState.party.length;
      const p=advState.party[i];
      if(!p.fainted&&p.hp>0){
        advFightState.ply={...p,_partyIdx:i};
        advFightUpdate();
        $('advFightLog').innerHTML='🔄 Swapped to <b>'+p.n+'</b>!';
        return;
      }
    }
    toast('No fighters left to swap to');
  };
  window.advFightFlee = function(){
    if(Math.random()<0.6){$('advFightLog').innerHTML='💨 Got away safely!';setTimeout(()=>advFightClose(),700)}
    else{$('advFightLog').innerHTML="Couldn't escape!"}
  };
  function advDoBoss(){return new Promise(resolve=>{advFightOpen(true,resolve)})}

  window.advOpenInv = function(){
    const list=$('advTrayList');list.innerHTML='';
    if(!advState.inventory.length){list.innerHTML='<div style="grid-column:1/-1;color:var(--soft);text-align:center;padding:20px">No items yet. Land on 🎁 spaces!</div>'}
    else advState.inventory.forEach((it,i)=>{
      const el=document.createElement('div');el.className='adv-tray-item';
      el.innerHTML=`<div class="ic">${it.ic}</div><div class="nm">${it.n}</div><div class="ds">${it.desc}</div>`;
      el.onclick=()=>advUseInvItem(i);
      list.appendChild(el);
    });
    $('advTray').classList.add('on');
  };
  window.advCloseInv = function(){$('advTray').classList.remove('on');sfxClick()};
  function advUseInvItem(i){
    const it=advState.inventory[i];if(!it)return;
    switch(it.k){
      case 'potion':{
        const target=advState.party.find(p=>!p.fainted&&p.hp<p.hpMax);
        if(!target){toast('All members at full HP');return}
        const heal=Math.min(50,target.hpMax-target.hp);
        target.hp+=heal;
        toast(`+${heal} HP to ${target.n}`);sfxHeal();sfx.heal();break;
      }
      case 'damage':advState.atkBuffNext=true;toast('⚡ ATK buff queued');break;
      case 'shield':advState.shieldNext=true;toast('🛡 Shield queued');break;
      case 'energy':{
        window.advCloseInv();advState.inventory.splice(i,1);advUpdateHUD();saveAdvRun();
        toast('🔋 Extra roll!');window.advRollDice();return;
      }
      case 'reroll':toast('🔄 Reroll stored');advState.rerollAvailable++;break;
    }
    advState.inventory.splice(i,1);
    advUpdateHUD();saveAdvRun();window.advOpenInv();
  }
  window.advQuit = function(){if(!confirm('Quit your adventure? Progress will be lost.'))return;clearAdvRun();advState=null;goScreenInner('home');refreshContinuePill();};
  function advGameOver(won){
    advState.busy=true;
    const adv=getAdventure();
    if(won){
      adv.wins=(adv.wins||0)+1;adv.lastClear=Date.now();
      sfxVictory();sfx.win();
      if($('endTitle')){$('endTitle').textContent='ADVENTURE CHAMPION!';$('endTitle').className='end-title win'}
      if($('endSub'))$('endSub').textContent='You conquered the 25-space board and the boss!';
    }else{
      adv.losses=(adv.losses||0)+1;
      sfxDefeat();sfx.lose();
      if($('endTitle')){$('endTitle').textContent='Defeated…';$('endTitle').className='end-title lose'}
      if($('endSub'))$('endSub').textContent='Your party fell. Try again.';
    }
    setAdventure(adv);
    clearAdvRun();
    if($('endStats'))$('endStats').innerHTML=`Reached space <b>${advState.space}</b>/25 · Items collected: ${advState.inventory.length}<br>Total runs: ${adv.runs} · Wins: ${adv.wins||0} · Losses: ${adv.losses||0}`;
    if($('endNext')){$('endNext').textContent='▶ NEW QUEST';$('endNext').onclick=()=>{$('endOverlay').classList.remove('on');refreshContinuePill();goScreenInner('advPick')}}
    if($('endOverlay'))$('endOverlay').classList.add('on');
    refreshContinuePill();
  }

  /* ============================== ONE-LANE BATTLE ============================== */
  let lanePickList=[];
  let laneState=null;

  window.renderLanePick = function(){
    lanePickList=[];
    $('lanePickB').textContent=0;$('lanePickCount').textContent=0;$('lanePickStart').disabled=true;
    const grid=$('lanePickGrid');grid.innerHTML='';
    const ROSTER=window.ROSTER||[];
    ROSTER.forEach(h=>{
      const el=buildCardEl(h,false,()=>{
        const i=lanePickList.indexOf(h.id);
        if(i>=0)lanePickList.splice(i,1);
        else if(lanePickList.length<6)lanePickList.push(h.id);
        else return;
        tone(660,0.06,'sine',0.1);
        renderLanePickRefresh();
      });
      grid.appendChild(el);
    });
  };
  function renderLanePickRefresh(){
    $('lanePickB').textContent=lanePickList.length;$('lanePickCount').textContent=lanePickList.length;
    $('lanePickStart').disabled=lanePickList.length!==6;
    const cards=$('lanePickGrid').children;
    const ROSTER=window.ROSTER||[];
    ROSTER.forEach((h,i)=>{cards[i]&&cards[i].classList.toggle('selected',lanePickList.includes(h.id))});
  }
  window.lanePickClear = function(){lanePickList=[];renderLanePickRefresh()};

  const SPELLS=[
    {id:'fireball',n:'FIREBALL',ic:'🔥',cost:3,desc:'250 dmg lane'},
    {id:'freeze',n:'FREEZE',ic:'❄️',cost:2,desc:'Lane skips next turn'},
    {id:'heal',n:'HEAL',ic:'❤️',cost:4,desc:'+500 tower HP'},
  ];

  window.laneStart = function(){
    if(lanePickList.length!==6)return;
    sfxClick();
    const ROSTER=window.ROSTER||[];
    const deck=lanePickList.map(id=>{const r=ROSTER.find(x=>x.id===id);return{id:r.id,n:r.n,fb:r.fb,pid:r.pid,t:r.t,hp:Math.round(r.hp*1.5),hpMax:Math.round(r.hp*1.5),atk:r.atk,cost:Math.max(1,r.elixir||3),isSpell:false}});
    const pool=[...ROSTER].sort(()=>Math.random()-0.5).slice(0,6);
    const foeDeck=pool.map(r=>({id:r.id,n:r.n,fb:r.fb,pid:r.pid,t:r.t,hp:Math.round(r.hp*1.5),hpMax:Math.round(r.hp*1.5),atk:r.atk,cost:Math.max(1,r.elixir||3),isSpell:false}));
    laneState={
      deck:[...deck],hand:[],foeDeck:[...foeDeck],foeHand:[],
      elixir:5,foeElixir:5,
      plyKing:{hp:2500,max:2500},plyFront:{hp:1500,max:1500},
      foeKing:{hp:2500,max:2500},foeFront:{hp:1500,max:1500},
      rows:[[],[],[],[],[]],
      turn:1,phase:'ply',
      selectedCard:null,selectedSpell:null,
      busy:false,log:[],
    };
    laneDraw('ply',4);laneDraw('foe',4);
    goScreenInner('lane');
    laneRender();
    laneLog('Turn 1 — your phase. Deploy a card or cast a spell.');
  };

  function laneDraw(side,n){
    const ROSTER=window.ROSTER||[];
    const deck=side==='ply'?laneState.deck:laneState.foeDeck;
    const hand=side==='ply'?laneState.hand:laneState.foeHand;
    for(let i=0;i<n;i++){
      if(!deck.length){
        const orig=side==='ply'?lanePickList.map(id=>ROSTER.find(x=>x.id===id)):[...ROSTER].sort(()=>Math.random()-0.5).slice(0,6);
        orig.forEach(r=>{deck.push({id:r.id,n:r.n,fb:r.fb,pid:r.pid,t:r.t,hp:Math.round(r.hp*1.5),hpMax:Math.round(r.hp*1.5),atk:r.atk,cost:Math.max(1,r.elixir||3),isSpell:false})});
        for(let j=deck.length-1;j>0;j--){const k=Math.floor(Math.random()*(j+1));[deck[j],deck[k]]=[deck[k],deck[j]]}
      }
      if(deck.length&&hand.length<6)hand.push(deck.shift());
    }
  }
  function laneLog(msg){$('laneLog').innerHTML=msg;laneState&&laneState.log.push(msg.replace(/<[^>]+>/g,''))}

  function laneRender(){
    const ls=laneState;
    $('laneTurn').textContent='TURN '+ls.turn+' — '+(ls.phase==='ply'?'YOUR PHASE':'FOE PHASE');
    $('laneElx').textContent=ls.elixir;
    const fhEl=$('laneFoeHand');if(fhEl)fhEl.textContent=ls.foeHand.length;
    $('laneEnd').disabled=ls.phase!=='ply'||ls.busy;
    const b=$('laneBoard');b.innerHTML='';
    const fkr=document.createElement('div');fkr.className='lane-tower-row';
    fkr.innerHTML=`<div class="lane-tower king foe ${ls.foeKing.hp<=0?'dead':''}" data-tower="foeKing">👑 FOE KING ${Math.max(0,ls.foeKing.hp)}/${ls.foeKing.max}<div class="hpbar"><div style="width:${Math.max(0,ls.foeKing.hp/ls.foeKing.max*100)}%"></div></div></div>`;
    b.appendChild(fkr);
    const ffr=document.createElement('div');ffr.className='lane-tower-row';
    ffr.innerHTML=`<div class="lane-tower foe ${ls.foeFront.hp<=0?'dead':''}" data-tower="foeFront">🏰 FOE FRONT ${Math.max(0,ls.foeFront.hp)}/${ls.foeFront.max}<div class="hpbar"><div style="width:${Math.max(0,ls.foeFront.hp/ls.foeFront.max*100)}%"></div></div></div>`;
    b.appendChild(ffr);
    for(let i=0;i<5;i++){
      const z=document.createElement('div');
      const isPlyDeploy=i===4;
      const showCardHint=ls.selectedCard!=null&&isPlyDeploy;
      const showSpellHint=ls.selectedSpell!=null;
      z.className='lane-zone'+(isPlyDeploy?' deploy':'')+(showCardHint?' can':'')+(showSpellHint?' spell-target':'');
      z.dataset.row=i;
      z.innerHTML=`<div class="row-lbl">ROW ${i+1}${isPlyDeploy?' · DEPLOY':''}</div>`;
      ls.rows[i].forEach(u=>{
        const el=document.createElement('div');
        el.className='lane-unit '+(u.side==='ply'?'ply':'foe')+(u.frozen?' frozen':'');
        if(u._justDeployed){el.classList.add('lane-unit-deploy');setTimeout(()=>{u._justDeployed=false;},420);}
        el.innerHTML=`<div class="uart">${artHTML(u)}</div><div class="uname">${u.n}</div><div class="uhp">${Math.max(0,u.hp)}/${u.hpMax}</div>`;
        z.appendChild(el);
      });
      z.onclick=(e)=>{laneZoneClick(i)};
      b.appendChild(z);
    }
    const pfr=document.createElement('div');pfr.className='lane-tower-row';
    pfr.innerHTML=`<div class="lane-tower ${ls.plyFront.hp<=0?'dead':''}" data-tower="plyFront">🏰 YOUR FRONT ${Math.max(0,ls.plyFront.hp)}/${ls.plyFront.max}<div class="hpbar"><div style="width:${Math.max(0,ls.plyFront.hp/ls.plyFront.max*100)}%"></div></div></div>`;
    b.appendChild(pfr);
    const pkr=document.createElement('div');pkr.className='lane-tower-row';
    pkr.innerHTML=`<div class="lane-tower king ${ls.plyKing.hp<=0?'dead':''}" data-tower="plyKing">👑 YOUR KING ${Math.max(0,ls.plyKing.hp)}/${ls.plyKing.max}<div class="hpbar"><div style="width:${Math.max(0,ls.plyKing.hp/ls.plyKing.max*100)}%"></div></div></div>`;
    b.appendChild(pkr);

    const spellsEl=$('laneSpells');spellsEl.innerHTML='';
    SPELLS.forEach((s,i)=>{
      const phaseOk=ls.phase==='ply'&&!ls.busy;
      const canAfford=ls.elixir>=s.cost;
      const can=canAfford&&phaseOk;
      const sel=ls.selectedSpell===i;
      const btn=document.createElement('button');
      btn.className='lane-spell'+(sel?' selected':'')+(!canAfford&&phaseOk?' cant-afford':'');
      btn.disabled=!can;
      btn.innerHTML=`<div class="ic">${s.ic}</div>${s.n}<div class="cost">${s.cost}⚡</div>`;
      btn.onclick=()=>{
        if(!phaseOk)return;
        if(!canAfford){laneLog('Not enough elixir!');return}
        laneSelSpell(i);
      };
      spellsEl.appendChild(btn);
    });

    const handEl=$('laneHand');handEl.innerHTML='';
    ls.hand.forEach((c,idx)=>{
      const phaseOk=ls.phase==='ply'&&!ls.busy;
      const canAfford=ls.elixir>=c.cost;
      const can=canAfford&&phaseOk;
      const sel=ls.selectedCard===idx;
      const el=document.createElement('div');
      el.className='lane-hand-card'+(sel?' selected':'')+(can?'':' disabled')+(!canAfford&&phaseOk?' cant-afford':'');
      if(!can)el.setAttribute('disabled','');
      el.innerHTML=`<div class="ec">${c.cost}</div><div class="uart">${artHTML(c)}</div><div class="nm">${c.n}</div><div class="stats">HP ${c.hp} · ⚔ ${c.atk}</div>`;
      el.onclick=()=>{
        if(!phaseOk)return;
        if(!canAfford){laneLog('Not enough elixir!');return}
        laneSelCard(idx);
      };
      handEl.appendChild(el);
    });
  }

  function laneSelCard(idx){
    if(laneState.selectedCard===idx){laneState.selectedCard=null}
    else{laneState.selectedCard=idx;laneState.selectedSpell=null}
    tone(660,0.06,'sine',0.1);
    laneRender();
  }
  function laneSelSpell(idx){
    if(laneState.selectedSpell===idx){laneState.selectedSpell=null}
    else{laneState.selectedSpell=idx;laneState.selectedCard=null}
    tone(660,0.06,'sine',0.1);
    laneRender();
  }

  function laneZoneClick(rowIdx){
    const ls=laneState;
    if(ls.phase!=='ply'||ls.busy)return;
    if(ls.selectedCard!=null){
      if(rowIdx!==4){laneLog('Deploy your cards in your bottom row (Row 5).');return}
      const c=ls.hand[ls.selectedCard];if(!c)return;
      if(ls.elixir<c.cost){laneLog('Not enough elixir!');return}
      ls.elixir-=c.cost;
      ls.hand.splice(ls.selectedCard,1);
      ls.selectedCard=null;
      const unit={...c,side:'ply',frozen:false,_justDeployed:true};
      ls.rows[4].push(unit);
      laneDraw('ply',1);
      laneLog(`Deployed <b>${c.n}</b> to Row 5.`);
      sfxClick();sfx.deploy();laneRender();return;
    }
    if(ls.selectedSpell!=null){
      const s=SPELLS[ls.selectedSpell];if(!s)return;
      if(ls.elixir<s.cost){laneLog('Not enough elixir!');return}
      ls.elixir-=s.cost;
      ls.selectedSpell=null;
      if(s.id==='fireball'){sfx.fireball();laneCastFireball(rowIdx);}
      else if(s.id==='freeze'){sfx.freeze();laneCastFreeze(rowIdx);}
      else if(s.id==='heal'){sfx.heal();laneCastHeal();}
      else sfx.spell();
      sfxHit();laneRender();return;
    }
  }

  function laneCastFireball(row){
    const ls=laneState;let killed=0;
    ls.rows[row].forEach(u=>{if(u.side==='foe'){u.hp=Math.max(0,u.hp-250);if(u.hp<=0)killed++}});
    if(row<=2&&ls.foeFront.hp>0){ls.foeFront.hp=Math.max(0,ls.foeFront.hp-100)}
    laneLog(`🔥 Fireball hit Row ${row+1}! ${killed?killed+" KO'd!":''}`);
    laneCleanupRows();
  }
  function laneCastFreeze(row){
    const ls=laneState;let n=0;
    ls.rows[row].forEach(u=>{if(u.side==='foe'){u.frozen=true;n++}});
    laneLog(`❄️ Freeze on Row ${row+1}! ${n} enemy unit${n!==1?'s':''} frozen.`);
  }
  function laneCastHeal(){
    const ls=laneState;
    if(ls.plyFront.hp>0){ls.plyFront.hp=Math.min(ls.plyFront.max,ls.plyFront.hp+500);laneLog('❤️ Front Tower healed +500!')}
    else{ls.plyKing.hp=Math.min(ls.plyKing.max,ls.plyKing.hp+500);laneLog('❤️ King Tower healed +500!')}
    sfxHeal();
  }
  function laneCleanupRows(){const ls=laneState;for(let i=0;i<5;i++)ls.rows[i]=ls.rows[i].filter(u=>u.hp>0)}

  window.laneEndTurn = async function(){
    const ls=laneState;
    if(ls.phase!=='ply'||ls.busy)return;
    ls.busy=true;sfxClick();laneLog('Resolving combat…');
    await sleep(400);
    await laneStepSimulation();
    if(laneCheckEnd())return;
    ls.phase='foe';laneRender();
    await sleep(500);
    await laneFoeTurn();
    if(laneCheckEnd())return;
    await sleep(300);
    await laneStepSimulation();
    if(laneCheckEnd())return;
    ls.turn++;ls.phase='ply';
    ls.elixir=Math.min(10,ls.elixir+5);
    ls.foeElixir=Math.min(10,ls.foeElixir+5);
    laneDraw('ply',1);laneDraw('foe',1);
    for(let i=0;i<5;i++)ls.rows[i].forEach(u=>{if(u.frozen)u.frozen=false});
    laneLog('Turn '+ls.turn+' — your phase. Elixir refilled to '+ls.elixir+'.');
    ls.busy=false;
    laneRender();
  };

  async function laneStepSimulation(){
    const ls=laneState;
    const newRows=[[],[],[],[],[]];
    for(let i=0;i<5;i++){
      ls.rows[i].forEach(u=>{
        if(u.frozen){newRows[i].push(u);return}
        let target=u.side==='ply'?i-1:i+1;
        if(target<0)target=-1;
        if(target>4)target=5;
        if(target>=0&&target<=4)newRows[target].push(u);
        else{
          if(u.side==='ply'){
            if(ls.foeFront.hp>0){ls.foeFront.hp=Math.max(0,ls.foeFront.hp-u.atk);laneLog(`<b>${u.n}</b> hits FOE FRONT for ${u.atk}!`)}
            else{ls.foeKing.hp=Math.max(0,ls.foeKing.hp-u.atk);laneLog(`<b>${u.n}</b> hits FOE KING for ${u.atk}!`)}
          }else{
            if(ls.plyFront.hp>0){ls.plyFront.hp=Math.max(0,ls.plyFront.hp-u.atk);laneLog(`<b>${u.n}</b> hits YOUR FRONT for ${u.atk}!`)}
            else{ls.plyKing.hp=Math.max(0,ls.plyKing.hp-u.atk);laneLog(`<b>${u.n}</b> hits YOUR KING for ${u.atk}!`)}
          }
        }
      });
    }
    ls.rows=newRows;
    await sleep(400);
    for(let i=0;i<5;i++){
      const plyU=ls.rows[i].filter(u=>u.side==='ply'&&!u.frozen);
      const foeU=ls.rows[i].filter(u=>u.side==='foe'&&!u.frozen);
      if(plyU.length&&foeU.length){
        const totalPlyAtk=plyU.reduce((s,u)=>s+u.atk,0);
        const totalFoeAtk=foeU.reduce((s,u)=>s+u.atk,0);
        foeU.forEach(u=>u.hp=Math.max(0,u.hp-Math.round(totalPlyAtk/foeU.length)));
        plyU.forEach(u=>u.hp=Math.max(0,u.hp-Math.round(totalFoeAtk/plyU.length)));
        laneLog(`⚔ Row ${i+1}: ${plyU.length} vs ${foeU.length} clash!`);
        sfxHit();
      }
    }
    laneCleanupRows();
    laneRender();
    await sleep(500);
  }

  async function laneFoeTurn(){
    const ls=laneState;
    // Detect threats: any player units past midfield (rows 0..2 are foe-side)
    const playerNearTower = ls.rows.some((row,ri)=>ri<=2 && row.some(u=>u.side==='ply'));
    // Sort affordable cards by cost descending (strongest first)
    const affordable = ls.foeHand
      .map((c,i)=>({c,i}))
      .filter(x=>x.c.cost<=ls.foeElixir)
      .sort((a,b)=>b.c.cost-a.c.cost);
    if(!affordable.length)return;
    const toDeploy = [];
    if(playerNearTower){
      // Defensive: deploy strongest affordable to counter
      toDeploy.push(affordable[0]);
    } else if(ls.foeElixir>=7){
      // Push hard with multiple cards
      let e=ls.foeElixir;
      for(const x of affordable){
        if(x.c.cost<=e){toDeploy.push(x);e-=x.c.cost;if(toDeploy.length>=2)break;}
      }
    } else if(Math.random()<0.7){
      // Random single deploy
      toDeploy.push(affordable[Math.floor(Math.random()*affordable.length)]);
    }
    // else save elixir
    // Sort by original index DESC so splices don't shift later picks
    toDeploy.sort((a,b)=>b.i-a.i);
    for(const x of toDeploy){
      if(ls.foeElixir<x.c.cost)continue;
      ls.foeElixir-=x.c.cost;
      ls.foeHand.splice(x.i,1);
      laneDraw('foe',1);
      const unit={...x.c,side:'foe',frozen:false,_justDeployed:true};
      ls.rows[0].push(unit);
      laneLog(`Foe deployed <b>${x.c.n}</b>!`);
      sfx.deploy();
      laneRender();
      await sleep(450);
    }
  }

  function laneCheckEnd(){
    const ls=laneState;
    if(ls.foeKing.hp<=0){laneWin();return true}
    if(ls.plyKing.hp<=0){laneLose();return true}
    return false;
  }

  function laneWin(){
    sfxVictory();sfx.win();
    const lane=getLane();lane.wins=(lane.wins||0)+1;setLane(lane);
    if($('endTitle')){$('endTitle').textContent='VICTORY!';$('endTitle').className='end-title win'}
    if($('endSub'))$('endSub').textContent='You stormed the king tower!';
    if($('endStats'))$('endStats').innerHTML=`Turns: <b>${laneState.turn}</b> · Lane wins: ${lane.wins} · Lane losses: ${lane.losses||0}`;
    if($('endNext')){$('endNext').textContent='▶ NEW DUEL';$('endNext').onclick=()=>{$('endOverlay').classList.remove('on');goScreenInner('lanePick')}}
    if($('endOverlay'))$('endOverlay').classList.add('on');
    laneState.busy=true;
  }
  function laneLose(){
    sfxDefeat();sfx.lose();
    const lane=getLane();lane.losses=(lane.losses||0)+1;setLane(lane);
    if($('endTitle')){$('endTitle').textContent='DEFEAT';$('endTitle').className='end-title lose'}
    if($('endSub'))$('endSub').textContent='Your king fell.';
    if($('endStats'))$('endStats').innerHTML=`Turns: <b>${laneState.turn}</b> · Lane wins: ${lane.wins||0} · Lane losses: ${lane.losses}`;
    if($('endNext')){$('endNext').textContent='↻ RETRY';$('endNext').onclick=()=>{$('endOverlay').classList.remove('on');goScreenInner('lanePick')}}
    if($('endOverlay'))$('endOverlay').classList.add('on');
    laneState.busy=true;
  }
  window.laneQuit = function(){if(!confirm('Quit lane duel?'))return;laneState=null;goScreenInner('home')};

  // === Home menu button injection ===
  function addHomeButtons(){
    const home = document.getElementById('home');
    if(!home) return setTimeout(addHomeButtons, 100);
    if(home.querySelector('.exp-mode-pill')) return;
    const pills = home.querySelectorAll('.mode-pill');
    let storyPill = null;
    pills.forEach(p => { if(/story|gym|villain|sith|gauntlet|tournament|goat/i.test(p.textContent)) storyPill = p; });
    const anchor = storyPill ? storyPill.nextElementSibling : home.firstChild;
    const insertAfter = anchor && anchor.nextSibling ? anchor.nextSibling : null;

    const advPill = document.createElement('div');
    advPill.className = 'mode-pill exp-mode-pill';
    advPill.textContent = '🗺️ ADVENTURE BOARD';
    const advBtn = document.createElement('button');
    advBtn.className = 'menu-btn';
    advBtn.onclick = () => (window.goScreen||goScreenInner)('advPick');
    advBtn.innerHTML = '<span class="ico">🎲</span><span class="lbl">ADVENTURE QUEST<span class="sub">8-card party · 25 spaces · boss at end</span></span><span class="arr">›</span>';

    const lanePill = document.createElement('div');
    lanePill.className = 'mode-pill exp-mode-pill';
    lanePill.textContent = '⚔️ ONE-LANE BATTLE';
    const laneBtn = document.createElement('button');
    laneBtn.className = 'menu-btn';
    laneBtn.onclick = () => (window.goScreen||goScreenInner)('lanePick');
    laneBtn.innerHTML = '<span class="ico">🛤️</span><span class="lbl">LANE DUEL<span class="sub">Solo lane · towers · spells</span></span><span class="arr">›</span>';

    // Continue pill (added before advPill if there's a saved run)
    const continuePill = document.createElement('button');
    continuePill.className = 'exp-continue-pill exp-continue-adv';
    continuePill.style.display = 'none';
    continuePill.innerHTML = '<span class="ic">▶</span><span>CONTINUE QUEST<span class="sub">Resume saved run</span></span>';
    continuePill.onclick = () => {
      if(typeof window.advResume === 'function'){window.advResume();}
    };

    if(insertAfter){
      home.insertBefore(continuePill, insertAfter);
      home.insertBefore(advPill, insertAfter);
      home.insertBefore(advBtn, insertAfter);
      home.insertBefore(lanePill, insertAfter);
      home.insertBefore(laneBtn, insertAfter);
    } else {
      home.appendChild(continuePill);
      home.appendChild(advPill);
      home.appendChild(advBtn);
      home.appendChild(lanePill);
      home.appendChild(laneBtn);
    }
    refreshContinuePill();
  }
  function refreshContinuePill(){
    try{
      const home = document.getElementById('home');
      if(!home) return;
      const pill = home.querySelector('.exp-continue-adv');
      if(!pill) return;
      if(hasAdvRun()){
        const s=loadStore();const r=s.advRun;
        const sub=pill.querySelector('.sub');
        if(sub) sub.textContent='Space '+(r.pos||0)+'/25 · '+(r.party?r.party.filter(p=>!p.fainted&&p.hp>0).length:0)+' alive';
        pill.style.display='flex';
      } else {
        pill.style.display='none';
      }
    }catch(e){}
  }
  window._expRefreshContinuePill = refreshContinuePill;
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addHomeButtons);
  else addHomeButtons();

  // === goScreenInner patch for advPick / lanePick routing ===
  function patchGoScreen(){
    if(typeof window.goScreenInner !== 'function') return setTimeout(patchGoScreen, 100);
    if(window._EXPANSION_PATCHED_GS) return;
    window._EXPANSION_PATCHED_GS = true;
    const orig = window.goScreenInner;
    window.goScreenInner = function(id){
      orig(id);
      if(id === 'advPick' && typeof window.renderAdvPick === 'function') window.renderAdvPick();
      if(id === 'lanePick' && typeof window.renderLanePick === 'function') window.renderLanePick();
      if(id === 'home' && typeof window._expRefreshContinuePill === 'function') window._expRefreshContinuePill();
    };
  }
  patchGoScreen();

})();

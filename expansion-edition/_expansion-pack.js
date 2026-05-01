(function(){
  'use strict';
  if(window._EXPANSION_PACK_LOADED) return;
  window._EXPANSION_PACK_LOADED = true;

  // === Bridge host classic-script top-level const bindings (ROSTER, BOSSES) onto window ===
  // Host games declare `let ROSTER = [...]` and `const BOSSES = [...]` at top level.
  // Classic-script let/const create bindings in the *global lexical environment* — visible
  // to other classic scripts by bare name, but NOT exposed on `window`. So `window.ROSTER`
  // is undefined, and the rest of this IIFE (which uses `window.ROSTER`) gets nothing.
  // We bridge them onto `window` using indirect eval, which evaluates in the global lexical
  // scope (not the IIFE's strict-mode scope), so it can reach the host's lexical bindings.
  // We also re-run the bridge on every roster/boss lookup in case the host declares them
  // later than expected.
  function _bridgeRosterBosses(){
    if(window.ROSTER && Array.isArray(window.ROSTER) && window.ROSTER.length){ /* good */ }
    else {
      try{ if(typeof ROSTER !== 'undefined' && Array.isArray(ROSTER) && ROSTER.length) window.ROSTER = ROSTER; }catch(e){}
    }
    if(!window.ROSTER || !window.ROSTER.length){
      try{
        var r = (0,eval)('(typeof ROSTER!=="undefined" && Array.isArray(ROSTER)) ? ROSTER : null');
        if(r && r.length) window.ROSTER = r;
      }catch(e){}
    }
    if(window.BOSSES && Array.isArray(window.BOSSES) && window.BOSSES.length){ /* good */ }
    else {
      try{ if(typeof BOSSES !== 'undefined' && Array.isArray(BOSSES)) window.BOSSES = BOSSES; }catch(e){}
    }
    if(!window.BOSSES){
      try{
        var b = (0,eval)('(typeof BOSSES!=="undefined" && Array.isArray(BOSSES)) ? BOSSES : null');
        if(b) window.BOSSES = b;
      }catch(e){}
    }
  }
  window._bridgeRosterBosses = _bridgeRosterBosses;
  _bridgeRosterBosses(); // run immediately
  setTimeout(_bridgeRosterBosses, 0); // run again deferred
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _bridgeRosterBosses);
  window.addEventListener('load', _bridgeRosterBosses);

  // === Spell-aware roster filter for 1v1/adventure contexts ===
  // Spells (isSpell:true) are deck-only cards meant for board-style modes (Quick Board, Lane Duel).
  // They must NOT appear as standalone fighters in turn-battle / story / adventure modes.
  function nonSpellRoster(){
    _bridgeRosterBosses();
    var r = window.ROSTER || [];
    return r.filter(function(c){ return !c.isSpell; });
  }
  window._nonSpellRoster = nonSpellRoster;

  // === CSS injection ===
  const style = document.createElement('style');
  style.textContent = `
/* ============================== ADVENTURE BOARD (expansion) ============================== */
#adventure{flex-direction:column;background:radial-gradient(ellipse at top,#1a1f3a 0%,var(--bg) 60%)}
.adv-top{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(0,0,0,.7);border-bottom:1px solid var(--bdr);font-size:var(--fs-xs);gap:8px;flex-shrink:0}
.adv-hp-wrap{display:flex;align-items:center;gap:6px;flex:1;min-width:0}
.adv-hp-lbl{font-family:'Inter',sans-serif;font-weight:800;color:var(--gold);font-size:var(--fs-xs);letter-spacing:1px}
.adv-hp-bar{flex:1;height:10px;background:rgba(0,0,0,.6);border:1px solid var(--bdr);border-radius:5px;overflow:hidden;max-width:140px}
.adv-hp-fill{height:100%;background:linear-gradient(90deg,var(--green),#22c55e);transition:width .5s}
.adv-hp-fill.med{background:linear-gradient(90deg,var(--gold),var(--orange))}
.adv-hp-fill.low{background:linear-gradient(90deg,var(--red),#dc2626)}
.adv-spaces{font-family:'Inter',sans-serif;font-weight:800;color:var(--gold);font-size:var(--fs-xs);letter-spacing:1px}
.adv-inv-btn{padding:5px 10px;background:rgba(255,203,5,.18);border:1px solid var(--gold);border-radius:8px;color:var(--gold);font-family:'Inter',sans-serif;font-weight:800;font-size:var(--fs-xs);cursor:pointer;letter-spacing:.5px}
.adv-board-wrap{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow-y:auto;padding:8px}
#advBoardSvg{display:block;width:100%;max-width:520px;height:auto;filter:drop-shadow(0 4px 14px rgba(0,0,0,.5))}
.adv-tile{transition:transform .3s, filter .3s}
.adv-tile.current{filter:drop-shadow(0 0 8px var(--gold));animation:tile-pulse 1.2s ease-in-out infinite}
@keyframes tile-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
.adv-pawn{transition:transform .3s ease-in-out}
.adv-bottom{flex-shrink:0;background:#0a0e18;border-top:3px solid var(--gold);padding:10px;padding-bottom:max(10px,calc(10px + env(safe-area-inset-bottom)))}
.adv-log{padding:8px 12px;font-size:var(--fs-sm);background:rgba(0,0,0,.55);border-radius:8px;min-height:34px;margin-bottom:10px;color:var(--soft);line-height:1.4}
.adv-log b{color:var(--gold)}
.adv-dice-btn{width:100%;padding:18px;background:linear-gradient(135deg,var(--gold),var(--orange));border:3px solid #fff;border-radius:14px;color:#000;font-family:'Inter',sans-serif;font-weight:800;font-size:var(--fs-lg);letter-spacing:3px;cursor:pointer;min-height:62px;box-shadow:0 0 18px rgba(255,203,5,.5)}
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
.adv-tray-title{font-family:'Inter',sans-serif;font-weight:800;font-size:var(--fs-base);color:var(--gold);letter-spacing:2px;margin-bottom:10px;text-align:center}
.adv-tray-list{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;max-height:42vh;overflow-y:auto}
.adv-tray-item{padding:10px;background:rgba(255,255,255,.05);border:1px solid var(--bdr);border-radius:10px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;font-family:'Inter',sans-serif;font-weight:800;font-size:var(--fs-xs)}
.adv-tray-item:active{transform:scale(.97)}
.adv-tray-item .ic{font-size:1.6rem}
.adv-tray-item .nm{color:var(--gold);letter-spacing:.6px}
.adv-tray-item .ds{font-family:'Share Tech Mono',monospace;font-size:.55rem;color:var(--soft);letter-spacing:.4px}
.adv-tray-close{display:block;width:100%;margin-top:10px;padding:10px;background:rgba(255,80,80,.18);border:1px solid var(--red);color:#fff;border-radius:8px;font-family:'Inter',sans-serif;font-weight:800;font-size:var(--fs-sm);cursor:pointer}

.adv-fight{position:fixed;inset:0;background:rgba(0,0,0,.94);display:none;flex-direction:column;z-index:8000}
.adv-fight.on{display:flex}
.adv-fight-arena{flex:1;background:linear-gradient(180deg,#1a3a5a,#5a8aaa);position:relative;display:flex;align-items:center;justify-content:space-between;padding:24px;overflow:hidden}
.adv-fight-side{display:flex;flex-direction:column;align-items:center;gap:6px;width:130px}
.adv-fight-art{width:100px;height:100px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.08);border-radius:50%;border:3px solid var(--gold);filter:drop-shadow(0 4px 8px rgba(0,0,0,.6))}
.adv-fight-art img{max-width:90px;max-height:90px;image-rendering:pixelated}
.adv-fight-art .emoji{font-size:3.5rem}
.adv-fight-foe .adv-fight-art{border-color:var(--red)}
.adv-fight-name{font-family:'Inter',sans-serif;font-weight:800;font-size:var(--fs-base);color:#fff;text-align:center}
.adv-fight-hp-bar{width:120px;height:10px;background:rgba(0,0,0,.7);border:1px solid var(--bdr);border-radius:5px;overflow:hidden}
.adv-fight-hp-fill{height:100%;background:linear-gradient(90deg,var(--green),#22c55e);transition:width .4s}
.adv-fight-hp-num{font-family:'Inter',sans-serif;font-weight:800;font-size:var(--fs-xs);color:var(--gold)}
.adv-fight-vs{font-family:'Inter',sans-serif;font-weight:800;font-size:2rem;color:var(--gold);text-shadow:0 0 14px rgba(255,203,5,.6)}
.adv-fight-controls{flex-shrink:0;background:#0a0e18;border-top:3px solid var(--gold);padding:12px;padding-bottom:max(12px,calc(12px + env(safe-area-inset-bottom)))}
.adv-fight-log{padding:10px;background:rgba(0,0,0,.55);border-radius:8px;font-size:var(--fs-sm);min-height:46px;line-height:1.4;margin-bottom:10px;color:var(--soft)}
.adv-fight-log b{color:var(--gold)}
.adv-fight-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.adv-fight-actions button{padding:14px 8px;background:linear-gradient(160deg,var(--panel),var(--panel2));border:2px solid var(--gold);border-radius:10px;color:#fff;font-family:'Inter',sans-serif;font-weight:800;font-size:var(--fs-sm);cursor:pointer;letter-spacing:1px;min-height:50px}
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
.adv-fight-pickrow .nm{font-family:'Inter',sans-serif;font-weight:800;font-size:var(--fs-sm);color:#fff}
.adv-fight-pickrow .hp-num{font-size:var(--fs-xs);color:var(--soft)}

/* ============================== LANE DUEL (expansion) ============================== */
#lane{flex-direction:column;background:linear-gradient(180deg,#3a0a0a 0%,#1a0a0a 50%,#0a1a3a 100%)}
.lane-top{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(0,0,0,.78);border-bottom:1px solid var(--bdr);font-size:var(--fs-xs);gap:6px;flex-shrink:0}
.lane-top .turn{color:var(--gold);font-family:'Inter',sans-serif;font-weight:800;letter-spacing:1px}
.lane-top .elx{color:#a855f7;font-family:'Inter',sans-serif;font-weight:800}.lane-top .elx b{color:#fff;font-size:var(--fs-base)}
.lane-top .end-btn{padding:6px 12px;background:var(--gold);color:#000;border:none;border-radius:8px;font-family:'Inter',sans-serif;font-weight:800;font-size:var(--fs-xs);cursor:pointer;letter-spacing:1px}
.lane-top .end-btn:disabled{opacity:.4}
.lane-board{flex:1;display:flex;flex-direction:column;gap:3px;padding:6px;overflow-y:auto}
.lane-tower-row{display:flex;justify-content:center}
.lane-tower{padding:8px 18px;border-radius:10px;border:2px solid var(--gold);background:linear-gradient(135deg,rgba(255,203,5,.18),rgba(238,21,21,.18));text-align:center;font-family:'Inter',sans-serif;font-weight:800;font-size:var(--fs-sm);color:var(--gold);min-width:200px}
.lane-tower.king{font-size:var(--fs-base);min-width:260px}
.lane-tower.foe{border-color:var(--red);color:var(--red);background:linear-gradient(135deg,rgba(238,21,21,.22),rgba(238,21,21,.1))}
.lane-tower.dead{opacity:.3;border-style:dashed}
.lane-tower .hpbar{margin-top:4px;height:8px;background:rgba(0,0,0,.5);border-radius:4px;overflow:hidden}
.lane-tower .hpbar div{height:100%;background:var(--gold);border-radius:4px;transition:width .4s}
.lane-tower.foe .hpbar div{background:var(--red)}
.lane-zone{display:flex;justify-content:center;min-height:60px;background:rgba(0,0,0,.32);border:1px dashed rgba(255,255,255,.18);border-radius:10px;padding:6px;position:relative;cursor:pointer;flex-wrap:wrap;gap:5px;align-content:center}
.lane-zone.deploy{border-color:var(--gold);background:rgba(255,203,5,.08);cursor:pointer}
.lane-zone.deploy.can{border-style:solid;box-shadow:0 0 10px rgba(255,203,5,.35)}
.lane-zone .row-lbl{position:absolute;top:2px;left:6px;font-size:.55rem;color:var(--mut);font-family:'Inter',sans-serif;font-weight:800;letter-spacing:.5px;pointer-events:none}
.lane-unit{display:flex;flex-direction:column;align-items:center;gap:2px;padding:4px 6px;background:linear-gradient(160deg,var(--panel),var(--panel2));border:2px solid var(--bdr);border-radius:8px;min-width:55px;position:relative}
.lane-unit.foe{border-color:var(--red)}
.lane-unit.ply{border-color:var(--gold)}
.lane-unit .uart{width:32px;height:32px;display:flex;align-items:center;justify-content:center}
.lane-unit .uart img{max-width:30px;max-height:30px;image-rendering:pixelated}
.lane-unit .uart .emoji{font-size:1.4rem}
.lane-unit .uname{font-family:'Inter',sans-serif;font-weight:800;font-size:.55rem;color:#fff;line-height:1;white-space:nowrap;max-width:50px;overflow:hidden;text-overflow:ellipsis}
.lane-unit .uhp{font-family:'Inter',sans-serif;font-weight:800;font-size:.55rem;color:var(--gold)}
.lane-unit.frozen{filter:hue-rotate(180deg) brightness(1.2);outline:2px solid var(--cyan)}
.lane-controls{flex-shrink:0;background:#0a0e18;border-top:3px solid var(--gold);padding:8px;padding-bottom:max(8px,calc(8px + env(safe-area-inset-bottom)))}
.lane-log{padding:6px 10px;background:rgba(0,0,0,.55);border-radius:8px;font-size:var(--fs-xs);min-height:24px;line-height:1.3;margin-bottom:8px;color:var(--soft)}
.lane-log b{color:var(--gold)}
.lane-spell-row{display:flex;gap:6px;margin-bottom:6px}
.lane-spell{flex:1;padding:8px 4px;background:linear-gradient(135deg,#7c3aed,#3b82f6);border:1px solid #a855f7;border-radius:8px;color:#fff;font-family:'Inter',sans-serif;font-weight:800;font-size:var(--fs-xs);cursor:pointer;display:flex;flex-direction:column;gap:2px;align-items:center;min-height:46px}
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
.lane-top .lane-foe-hand{color:var(--red);font-family:'Inter',sans-serif;font-weight:800;letter-spacing:.5px}
.lane-top .lane-foe-hand b{color:#fff;font-size:var(--fs-base)}
.adv-boss-preview{padding:10px 14px;background:linear-gradient(135deg,rgba(168,85,247,.18),rgba(238,21,21,.12));border:2px solid #a855f7;border-radius:12px;margin:10px 14px}
.adv-bp-label{font-family:'Inter',sans-serif;font-weight:800;font-size:11px;color:#a855f7;letter-spacing:2px;margin-bottom:6px;text-align:center}
.adv-bp-card{display:flex;align-items:center;gap:12px}
.adv-bp-ico{font-size:2.2rem;flex-shrink:0}
.adv-bp-info{flex:1;min-width:0}
.adv-bp-name{font-family:'Inter',sans-serif;font-weight:800;font-size:14px;color:#fff;letter-spacing:1px}
.adv-bp-desc{font-size:11px;color:rgba(255,255,255,.7);margin-top:2px;line-height:1.3}
@keyframes dmgFloat{0%{opacity:0;transform:translateX(-50%) translateY(0)}15%{opacity:1}100%{opacity:0;transform:translateX(-50%) translateY(-50px)}}
.lane-hand-card .uart{height:42px;display:flex;align-items:center;justify-content:center}
.lane-hand-card .uart img{max-width:42px;max-height:42px;image-rendering:pixelated}
.lane-hand-card .uart .emoji{font-size:1.7rem}
.lane-hand-card .nm{font-family:'Inter',sans-serif;font-weight:800;font-size:var(--fs-xs);margin-top:3px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lane-hand-card .ec{position:absolute;top:2px;left:2px;width:22px;height:22px;background:linear-gradient(135deg,#a855f7,#ec4899);border-radius:50%;border:1px solid #fff;display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;font-weight:800;font-size:var(--fs-xs);color:#fff}
.lane-hand-card .stats{font-family:'Inter',sans-serif;font-weight:800;font-size:.55rem;color:var(--gold);margin-top:2px}

.toast{position:fixed;left:50%;top:80px;transform:translateX(-50%);padding:10px 18px;background:rgba(0,0,0,.92);border:1px solid var(--gold);border-radius:10px;color:var(--gold);font-family:'Inter',sans-serif;font-weight:800;font-size:var(--fs-sm);letter-spacing:1px;z-index:9500;animation:toast-pop 2s ease forwards;pointer-events:none}
@keyframes toast-pop{0%{opacity:0;transform:translate(-50%,-10px)}10%,80%{opacity:1;transform:translate(-50%,0)}100%{opacity:0;transform:translate(-50%,-10px)}}

.mini-dice{display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9700;align-items:center;justify-content:center;flex-direction:column;gap:12px}
.mini-dice.on{display:flex}
.mini-dice .face{width:100px;height:100px;border-radius:14px;border:3px solid var(--gold);background:linear-gradient(135deg,var(--panel),var(--panel2));display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;font-weight:800;font-size:3.6rem;color:var(--gold);animation:dice-spin 1s ease-out forwards}
@keyframes dice-spin{0%{transform:rotate(0)}100%{transform:rotate(720deg)}}
.mini-dice .lbl{color:#fff;font-family:'Inter',sans-serif;font-weight:800;font-size:var(--fs-base);letter-spacing:1px;max-width:80vw;text-align:center}

.exp-continue-pill{display:flex;align-items:center;gap:10px;padding:10px 14px;background:linear-gradient(135deg,rgba(34,197,94,.25),rgba(22,163,74,.15));border:2px solid #22c55e;border-radius:14px;width:300px;max-width:92vw;color:#fff;font-family:'Inter',sans-serif;font-weight:800;font-size:13px;cursor:pointer;letter-spacing:1.5px;margin-bottom:10px}
.exp-continue-pill:active{transform:scale(.97)}
.exp-continue-pill .ic{font-size:1.6rem}
.exp-continue-pill .sub{display:block;font-size:9px;opacity:.85;font-family:'Share Tech Mono',monospace;letter-spacing:.5px;margin-top:2px}

@keyframes laneDeploy{0%{transform:translateY(40px) scale(.6);opacity:0;filter:drop-shadow(0 0 12px var(--gold))}60%{transform:translateY(-4px) scale(1.08);opacity:1}100%{transform:translateY(0) scale(1);filter:none}}
.lane-unit-deploy{animation:laneDeploy .42s cubic-bezier(.2,.8,.3,1.1) both}

/* ============================== EXPANSION POLISH FEATURES ============================== */
/* 1. Settings gear + modal */
.exp-settings-btn{position:fixed;top:max(12px,env(safe-area-inset-top));right:12px;z-index:60;width:42px;height:42px;border-radius:50%;background:rgba(0,0,0,.7);border:1px solid var(--bdr);color:var(--gold);font-size:20px;display:flex;align-items:center;justify-content:center;cursor:pointer}
.exp-settings-btn:active{transform:scale(.94)}
.exp-settings-overlay{position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:9500;display:none;flex-direction:column;align-items:center;justify-content:center;padding:24px;font-family:'Inter',sans-serif}
.exp-settings-overlay.on{display:flex}
.exp-settings-card{background:linear-gradient(160deg,var(--panel),var(--panel2));border:2px solid var(--gold);border-radius:16px;padding:20px;width:100%;max-width:340px}
.exp-settings-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--bdr)}
.exp-settings-row:last-child{border-bottom:none}
.exp-settings-row .lbl{color:#fff;font-weight:700;letter-spacing:1px}
.exp-toggle{width:54px;height:30px;background:rgba(255,255,255,.15);border:1px solid var(--bdr);border-radius:15px;position:relative;cursor:pointer;transition:.2s}
.exp-toggle.on{background:#22c55e}
.exp-toggle::after{content:'';position:absolute;top:2px;left:2px;width:24px;height:24px;background:#fff;border-radius:50%;transition:.2s}
.exp-toggle.on::after{left:27px}
.exp-settings-btn-wide{width:100%;padding:12px;margin-top:14px;background:rgba(238,21,21,.18);border:1px solid var(--red);color:#fff;border-radius:10px;font-weight:700;cursor:pointer;letter-spacing:1px}
.exp-settings-close{width:100%;padding:12px;margin-top:8px;background:transparent;border:1px solid var(--bdr);color:var(--soft);border-radius:10px;font-weight:600;cursor:pointer;letter-spacing:1px}
.exp-settings-btn-alt{width:100%;padding:12px;margin-top:8px;background:rgba(255,255,255,.06);border:1px solid var(--bdr);color:#fff;border-radius:10px;font-weight:700;cursor:pointer;letter-spacing:1px}

/* 2. Stats screen */
#expStats{flex-direction:column;background:radial-gradient(ellipse at top,#1a1f3a 0%,var(--bg) 60%);font-family:'Inter',sans-serif}
.exp-stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
.exp-stats-card{background:linear-gradient(160deg,var(--panel),var(--panel2));border:1px solid var(--bdr);border-radius:12px;padding:14px;text-align:center}
.exp-stats-card .v{font-family:'Inter',sans-serif;font-weight:800;font-size:1.6rem;color:var(--gold);display:block}
.exp-stats-card .k{font-size:.7rem;color:var(--soft);letter-spacing:1px;margin-top:4px}
.exp-stats-row{display:flex;align-items:center;gap:10px;padding:10px;background:rgba(255,255,255,.04);border:1px solid var(--bdr);border-radius:10px;margin-bottom:6px}
.exp-stats-row .ico{font-size:1.4rem}
.exp-stats-row .gn{flex:1;font-weight:700;letter-spacing:1px}
.exp-stats-row .nums{font-size:.65rem;color:var(--soft)}
.exp-stats-section{font-family:'Inter',sans-serif;font-weight:800;color:var(--gold);font-size:.78rem;letter-spacing:2px;margin:14px 0 8px;padding-left:4px;border-left:3px solid var(--gold)}
.exp-stats-section:first-child{margin-top:0}

/* 3. Lane card preview */
.lane-card-preview{position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:9700;display:none;flex-direction:column;align-items:center;justify-content:center;padding:20px}
.lane-card-preview.on{display:flex}
.lane-card-preview-card{background:linear-gradient(160deg,var(--panel),var(--panel2));border:2px solid var(--gold);border-radius:16px;padding:20px;width:100%;max-width:320px;color:#fff;font-family:'Inter',sans-serif}
.lane-card-preview .nm{font-size:1.4rem;font-weight:800;color:var(--gold);text-align:center;margin-bottom:10px;letter-spacing:1px}
.lane-card-preview .pa{display:flex;justify-content:center;align-items:center;height:80px;background:rgba(0,0,0,.3);border-radius:10px;margin-bottom:10px}
.lane-card-preview .pa img{max-height:74px;max-width:74px}
.lane-card-preview .pa .emoji{font-size:3rem}
.lane-card-preview .stats{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px}
.lane-card-preview .stat{padding:6px 10px;background:rgba(0,0,0,.3);border-radius:6px;display:flex;justify-content:space-between;font-size:.75rem}
.lane-card-preview .stat b{color:var(--gold);font-weight:800}
.lane-card-preview .moves{font-size:.7rem;color:var(--soft);line-height:1.6}
.lane-card-preview-close{margin-top:12px;width:100%;padding:12px;background:rgba(255,255,255,.06);border:1px solid var(--bdr);color:#fff;border-radius:10px;font-weight:700;letter-spacing:1px;cursor:pointer}

/* 4. Adventure tutorial */
.exp-tutorial{position:fixed;inset:0;background:rgba(0,0,0,.94);z-index:9800;display:none;flex-direction:column;align-items:center;justify-content:center;padding:24px;font-family:'Inter',sans-serif;color:#fff}
.exp-tutorial.on{display:flex}
.exp-tutorial h2{color:var(--gold);font-size:1.6rem;font-weight:800;margin-bottom:12px;letter-spacing:1px;text-align:center}
.exp-tutorial p{font-size:.9rem;line-height:1.5;margin-bottom:8px;max-width:340px}
.exp-tutorial p b{color:var(--gold)}
.exp-tutorial-btn{margin-top:16px;padding:14px 28px;background:linear-gradient(135deg,var(--gold),#f59e0b);color:#000;border:none;border-radius:10px;font-weight:800;letter-spacing:1px;cursor:pointer;font-size:1rem}

/* 5. Daily challenge pill */
.exp-daily-pill{display:flex;align-items:center;gap:10px;padding:14px 16px;background:linear-gradient(135deg,#7c3aed,#3b82f6);border:2px solid #a855f7;border-radius:14px;width:auto;color:#fff;font-weight:700;cursor:pointer;letter-spacing:1px;margin:0 0 6px}
.exp-daily-pill .ic{font-size:1.6rem}
.exp-daily-pill .info{flex:1;min-width:0}
.exp-daily-pill .nm{font-size:.9rem;letter-spacing:1.4px;font-weight:800}
.exp-daily-pill .sm{font-size:.65rem;opacity:.85;margin-top:2px;font-family:'Share Tech Mono',monospace;letter-spacing:.5px}
.exp-daily-pill.cleared{background:linear-gradient(135deg,#16a34a,#15803d);border-color:#22c55e}
.exp-daily-pill.failed{background:linear-gradient(135deg,#7f1d1d,#450a0a);border-color:var(--red);opacity:.7}

/* 6. Saved deck strip + save button (expansion adv/lane) */
.exp-deck-strip{display:flex;gap:8px;overflow-x:auto;padding:8px 14px;background:rgba(0,0,0,.35);border-bottom:1px solid var(--bdr);scroll-snap-type:x mandatory}
.exp-deck-strip:empty{display:none}
.exp-deck-strip-empty{padding:14px;text-align:center;color:var(--soft);font-size:.7rem;font-family:'Inter',sans-serif;font-weight:600;letter-spacing:.5px}
.exp-deck-card{flex-shrink:0;background:linear-gradient(160deg,var(--panel),var(--panel2));border:2px solid var(--bdr);border-radius:10px;padding:8px 10px;min-width:140px;max-width:200px;cursor:pointer;position:relative;scroll-snap-align:start}
.exp-deck-card:hover{border-color:var(--gold)}
.exp-deck-card:active{transform:scale(.96)}
.exp-deck-card .nm{font-family:'Inter',sans-serif;font-weight:800;font-size:.78rem;color:var(--gold);letter-spacing:.5px;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.exp-deck-card .ct{font-family:'Inter',sans-serif;font-weight:600;font-size:.6rem;color:var(--soft);letter-spacing:.3px;line-height:1.3}
.exp-deck-card .x{position:absolute;top:2px;right:2px;width:20px;height:20px;background:rgba(238,21,21,.4);border:1px solid var(--red);color:#fff;border-radius:50%;font-size:11px;display:flex;align-items:center;justify-content:center;cursor:pointer;line-height:1}
.exp-deck-card .x:hover{background:var(--red)}
.exp-save-btn{padding:10px 14px;background:linear-gradient(135deg,#16a34a,#15803d);border:1px solid #22c55e;color:#fff;font-family:'Inter',sans-serif;font-weight:800;border-radius:8px;cursor:pointer;letter-spacing:.5px;font-size:.78rem}
.exp-save-btn:active{transform:scale(.96)}
.exp-save-btn:disabled{opacity:.4;cursor:not-allowed}

/* 7. Randomize button + team stats panel (expansion adv/lane pick) */
/* Pick screen start-bar wraps to fit 4 buttons on narrow phones */
#advPick .start-bar,#lanePick .start-bar{flex-wrap:wrap!important;gap:6px!important;padding:10px!important}
#advPick .start-bar > *,#lanePick .start-bar > *{flex:1 1 auto;min-width:80px}
#advPick .start-bar .start-btn,#lanePick .start-bar .start-btn{flex:1 1 100%;min-width:0;order:99}
.exp-rnd-btn{padding:10px 14px;background:linear-gradient(135deg,#7c3aed,#3b82f6);border:1px solid #a855f7;color:#fff;font-family:'Inter',sans-serif;font-weight:800;border-radius:8px;cursor:pointer;letter-spacing:.5px;font-size:.78rem;display:flex;align-items:center;justify-content:center;gap:6px}
.exp-rnd-btn:active{transform:scale(.96)}
.exp-team-stats{padding:8px 12px;background:linear-gradient(135deg,rgba(255,203,5,.08),rgba(0,0,0,.3));border-bottom:1px solid var(--bdr);font-family:'Inter',sans-serif;font-size:.7rem;color:var(--soft);letter-spacing:.3px;font-weight:600;display:none}
.exp-team-stats.on{display:block}
.exp-team-stats-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.exp-team-stats-stat{display:flex;align-items:center;gap:4px;white-space:nowrap}
.exp-team-stats-stat b{color:var(--gold);font-weight:800;font-size:.85rem}
.exp-team-stats-types{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.exp-team-stats-type{padding:2px 7px;background:rgba(255,255,255,.06);border:1px solid var(--bdr);border-radius:8px;font-size:.62rem}
.exp-team-stats-type b{color:var(--gold);font-weight:800}

/* Live deck preview strip — selected cards shown as mini-cards on pick screens */
.exp-pick-preview{display:flex;gap:6px;padding:8px 12px;overflow-x:auto;background:rgba(0,0,0,.32);border-bottom:1px solid var(--bdr);min-height:74px;align-items:center}
.exp-pick-preview-empty{color:var(--soft);font-family:'Inter',sans-serif;font-weight:600;font-size:.7rem;letter-spacing:.5px;text-align:center;width:100%}
.exp-pick-preview .pick{flex:0 0 auto;width:60px;border:1px solid var(--bdr);border-radius:8px;background:rgba(255,255,255,.04);padding:4px;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;position:relative;transition:transform .12s}
.exp-pick-preview .pick:hover{background:rgba(238,21,21,.18);border-color:var(--red);transform:translateY(-2px)}
.exp-pick-preview .pick:hover .x{display:flex}
.exp-pick-preview .pick .x{display:none;position:absolute;inset:0;align-items:center;justify-content:center;font-size:18px;color:#fff;background:rgba(220,38,38,.85);border-radius:8px;font-family:'Inter',sans-serif;font-weight:800}
.exp-pick-preview .pick .pa{width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:#0a0a18;border-radius:6px;overflow:hidden}
.exp-pick-preview .pick .pa img{width:100%;height:100%;object-fit:cover}
.exp-pick-preview .pick .pa .emoji{font-size:24px}
.exp-pick-preview .pick .nm{font-family:'Inter',sans-serif;font-weight:800;font-size:.5rem;color:#fff;text-align:center;line-height:1.05;max-width:56px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;letter-spacing:.2px}
.exp-pick-preview .pick .ex{position:absolute;top:-3px;left:-3px;background:#7c3aed;color:#fff;font-family:'Inter',sans-serif;font-weight:800;font-size:9px;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1px solid #000}

/* Expansion decks panel — shown on MY DECKS page above original decks list */
.exp-decks-panel{padding:12px;margin:8px 12px 12px;background:linear-gradient(135deg,rgba(124,58,237,.14),rgba(59,130,246,.06));border:1px solid #a855f7;border-radius:12px}
.exp-decks-panel-title{font-family:'Inter',sans-serif;font-weight:800;font-size:.85rem;color:#a855f7;letter-spacing:1.5px;margin-bottom:10px}
.exp-decks-panel-section{margin-bottom:10px}
.exp-decks-panel-section:last-child{margin-bottom:0}
.exp-decks-panel-subhead{font-family:'Inter',sans-serif;font-weight:800;font-size:.72rem;color:var(--gold);letter-spacing:1px;margin-bottom:6px;display:flex;align-items:center;gap:6px}
.exp-decks-panel-empty{font-family:'Inter',sans-serif;font-weight:600;font-size:.65rem;color:var(--soft);font-style:italic;letter-spacing:.3px;padding:6px 0}
.exp-decks-panel-row{display:flex;align-items:center;gap:8px;padding:8px 10px;background:rgba(255,255,255,.04);border:1px solid var(--bdr);border-radius:8px;margin-bottom:4px}
.exp-decks-panel-row .nm{flex:1;font-family:'Inter',sans-serif;font-weight:800;font-size:.78rem;color:#fff;letter-spacing:.5px}
.exp-decks-panel-row .ct{font-family:'Inter',sans-serif;font-weight:600;font-size:.6rem;color:var(--soft);letter-spacing:.3px;margin-right:8px}
.exp-decks-panel-row .load{padding:7px 10px;background:var(--gold);color:#000;border:none;border-radius:6px;font-family:'Inter',sans-serif;font-weight:800;font-size:.65rem;cursor:pointer;letter-spacing:.5px}
.exp-decks-panel-row .del{padding:7px 8px;background:transparent;color:var(--red);border:1px solid var(--red);border-radius:6px;font-family:'Inter',sans-serif;font-weight:800;font-size:.65rem;cursor:pointer;letter-spacing:.5px}
`;
  document.head.appendChild(style);

  // === iPhone-friendly home redesign — overrides v4 compact grid ===
  // Replaces cramped 2-col grid with single-column layout, bigger tap targets,
  // section dividers, and clearer hierarchy. Apple HIG recommends 44pt min hit
  // targets; we use ~72px tall buttons.
  const homeStyle = document.createElement('style');
  homeStyle.textContent = `
/* Single-column home layout overriding v4 grid */
#home.on{display:flex!important;flex-direction:column!important;align-items:stretch!important;padding:18px 14px max(20px,calc(18px + env(safe-area-inset-bottom))) 14px!important;gap:6px!important;overflow-y:auto;justify-content:flex-start!important}

/* Logo block — centered, breathable */
#home > img{display:block!important;max-height:62px!important;max-width:60%!important;margin:4px auto 6px!important}
#home > .logo-main{text-align:center!important;font-size:1.7rem!important;letter-spacing:4px!important;margin:4px 0 2px!important;line-height:1.05!important}
#home > .logo-sub{text-align:center!important;font-size:.95rem!important;letter-spacing:5px!important;margin:0 0 4px!important;line-height:1.05!important}
#home > .logo-tag{text-align:center!important;font-size:.62rem!important;letter-spacing:2.5px!important;margin:0 0 10px!important;line-height:1.2!important}
#home > .shield,#home > .pokeball{display:flex!important;width:62px!important;height:62px!important;font-size:28px!important;margin:4px auto 6px!important;border-width:3px!important}

/* Section dividers (mode-pill) — restored as visible labels above each group */
#home > .mode-pill{
  display:block!important;
  width:auto!important;max-width:none!important;
  padding:7px 12px!important;
  margin:10px 2px 4px!important;
  background:linear-gradient(90deg,rgba(255,203,5,.15),transparent)!important;
  border-left:3px solid var(--gold,#ffcb05)!important;
  border-radius:0 6px 6px 0!important;
  font-family:'Inter',sans-serif;font-weight:800!important;
  font-size:.72rem!important;
  color:var(--gold,#ffcb05)!important;
  letter-spacing:2.5px!important;
  text-transform:uppercase!important;
  text-align:left!important;
}
#home > .mode-pill:first-of-type{margin-top:6px!important}

/* Big iPhone-friendly menu buttons */
#home > .menu-btn{
  width:auto!important;
  max-width:none!important;
  min-height:68px!important;
  padding:14px 18px!important;
  margin:0 0 6px 0!important;
  font-size:.95rem!important;
  gap:14px!important;
  letter-spacing:1.4px!important;
  border-radius:14px!important;
  border:2px solid var(--bdr,rgba(255,255,255,.18))!important;
  display:flex!important;
  align-items:center!important;
  background:linear-gradient(135deg,rgba(255,255,255,.06),rgba(0,0,0,.18))!important;
  box-shadow:0 4px 10px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.06)!important;
  transition:transform .12s,box-shadow .12s,border-color .12s!important;
}
#home > .menu-btn:hover{border-color:var(--gold,#ffcb05)!important;box-shadow:0 4px 14px rgba(255,203,5,.18),inset 0 1px 0 rgba(255,255,255,.08)!important}
#home > .menu-btn:active{transform:scale(.97)!important;box-shadow:0 2px 5px rgba(0,0,0,.5)!important}
#home > .menu-btn .ico{font-size:1.85rem!important;width:42px!important;text-align:center!important;flex-shrink:0!important;line-height:1!important}
#home > .menu-btn .lbl{font-size:.92rem!important;line-height:1.15!important;flex:1!important;min-width:0!important;letter-spacing:1.4px!important;color:#fff!important}
#home > .menu-btn .sub{font-family:'Share Tech Mono',monospace!important;font-size:.62rem!important;letter-spacing:.4px!important;margin-top:4px!important;display:block!important;opacity:.72!important;color:var(--soft,rgba(255,255,255,.7))!important;text-transform:none!important;line-height:1.3!important}
#home > .menu-btn .arr{display:inline-block!important;font-size:1.5rem!important;color:var(--gold,#ffcb05)!important;margin-left:6px!important;flex-shrink:0!important}

/* Highlight game-mode buttons (turn battle, board, story, adventure, lane) with gold accent.
   Utility buttons (decks, profile, roster, rules) get a quieter look. */
#home > .menu-btn[onclick*="quick-tb"],
#home > .menu-btn[onclick*="quick-bb"],
#home > .menu-btn[onclick*="story"],
#home > .menu-btn[onclick*="advPick"],
#home > .menu-btn[onclick*="lanePick"],
#home > .menu-btn.tb-story-btn{
  border-color:rgba(255,203,5,.45)!important;
  background:linear-gradient(135deg,rgba(255,203,5,.14),rgba(238,21,21,.06))!important;
}
#home > .menu-btn[onclick*="decks"],
#home > .menu-btn[onclick*="profile"],
#home > .menu-btn[onclick*="roster"],
#home > .menu-btn[onclick*="rules"]{
  border-color:rgba(255,255,255,.14)!important;
  background:linear-gradient(135deg,rgba(255,255,255,.04),rgba(0,0,0,.2))!important;
  min-height:60px!important;
  padding:11px 16px!important;
}

/* Continue Quest pill — make it pop above adventure button */
.exp-continue-pill{
  min-height:64px!important;
  padding:14px 16px!important;
  font-size:13px!important;
  margin:0 0 4px!important;
}

/* Inline spacers (the existing <div style="height:8px"> between sections) */
#home > div[style*="height:8px"]{display:block!important;height:14px!important}

/* Smaller iPhones / shorter viewports — still single column, just tighter */
@media(max-height:720px){
  #home.on{padding:14px 12px max(16px,calc(14px + env(safe-area-inset-bottom))) 12px!important;gap:5px!important}
  #home > img{max-height:48px!important;margin:2px auto 4px!important}
  #home > .logo-main{font-size:1.4rem!important;letter-spacing:3px!important}
  #home > .logo-sub{font-size:.8rem!important;letter-spacing:4px!important}
  #home > .logo-tag{font-size:.55rem!important;margin-bottom:6px!important}
  #home > .menu-btn{min-height:58px!important;padding:11px 14px!important;font-size:.85rem!important;margin-bottom:4px!important}
  #home > .menu-btn[onclick*="decks"],#home > .menu-btn[onclick*="profile"],#home > .menu-btn[onclick*="roster"],#home > .menu-btn[onclick*="rules"]{min-height:50px!important;padding:8px 14px!important}
  #home > .menu-btn .ico{font-size:1.55rem!important;width:36px!important}
  #home > .menu-btn .lbl{font-size:.82rem!important}
  #home > .menu-btn .sub{font-size:.55rem!important;margin-top:2px!important}
  #home > .mode-pill{margin:8px 2px 3px!important;font-size:.65rem!important;padding:6px 10px!important}
  #home > div[style*="height:8px"]{height:8px!important}
}
`;
  document.head.appendChild(homeStyle);

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
  <div class="start-bar"><button class="clear-btn" onclick="advPickClear()">CLEAR</button><button class="exp-rnd-btn" id="advPickRnd" onclick="expRandomize('adv')">🎲 RANDOM</button><button class="exp-save-btn" id="advPickSave" onclick="expSaveDeckBtn('adv')">💾 SAVE AS DECK</button><button class="start-btn" id="advPickStart" disabled onclick="advStart()">▶ START QUEST</button></div>
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
      <div style="font-family:'Inter',sans-serif;font-weight:800;font-size:var(--fs-lg);color:var(--gold);letter-spacing:2px;margin-bottom:14px">CHOOSE A FIGHTER</div>
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
  <div class="start-bar"><button class="clear-btn" onclick="lanePickClear()">CLEAR</button><button class="exp-rnd-btn" id="lanePickRnd" onclick="expRandomize('lane')">🎲 RANDOM</button><button class="exp-save-btn" id="lanePickSave" onclick="expSaveDeckBtn('lane')">💾 SAVE AS DECK</button><button class="start-btn" id="lanePickStart" disabled onclick="laneStart()">▶ START DUEL</button></div>
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

<!-- Settings overlay -->
<div class="exp-settings-overlay" id="expSettingsOverlay">
  <div class="exp-settings-card">
    <div style="font-family:'Inter',sans-serif;font-weight:800;color:var(--gold);text-align:center;font-size:1.2rem;letter-spacing:2px;margin-bottom:6px">⚙️ SETTINGS</div>
    <div class="exp-settings-row">
      <span class="lbl">🔊 SOUND</span>
      <div class="exp-toggle" id="expSoundToggle"></div>
    </div>
    <div class="exp-settings-row">
      <span class="lbl" style="font-size:.8rem">📖 SHOW ADVENTURE TUTORIAL</span>
      <button class="exp-settings-btn-alt" style="width:auto;padding:8px 14px;margin:0" id="expShowTutorialBtn">SHOW</button>
    </div>
    <button class="exp-settings-btn-wide" id="expClearProgressBtn">🗑️ CLEAR ADVENTURE RUN</button>
    <button class="exp-settings-close" id="expSettingsCloseBtn">✕ CLOSE</button>
  </div>
</div>

<!-- Adventure tutorial overlay -->
<div class="exp-tutorial" id="expTutorial">
  <h2>🗺️ ADVENTURE QUEST</h2>
  <p>Pick <b>8 cards</b> for your party. They share one HP pool.</p>
  <p>Roll the <b>🎲 dice</b> to move along 25 spaces.</p>
  <p>Spaces trigger different events: <b>⚔️ battles</b>, <b>🎁 power-ups</b>, <b>❤️ heals</b>, <b>⚠️ traps</b>.</p>
  <p>Save power-ups for the <b>👑 boss</b> at the end!</p>
  <button class="exp-tutorial-btn" id="expTutorialOk">GOT IT</button>
</div>

<!-- ============================== EXPANSION STATS SCREEN ============================== -->
<div class="screen" id="expStats">
  <div class="topbar"><button class="back" onclick="goScreen('home')">‹ BACK</button><div class="ttl">📊 STATS</div><div class="meta"></div></div>
  <div class="page-body" id="expStatsBody" style="padding:14px;overflow-y:auto"></div>
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
  // === Sound toggle ===
  var soundEnabled = (function(){try{return localStorage.getItem('expSoundEnabled')!=='0'}catch(e){return true}})();
  function tone(f,d,t,v){if(!soundEnabled)return;if(typeof window.tone==='function')return window.tone(f,d,t,v)}
  function tt(f,d,t,v){ if(!soundEnabled)return; try{ if(typeof window.tone==='function') window.tone(f,d,t,v); else if(window.AudioContext||window.webkitAudioContext){const ctx=tt._ctx||(tt._ctx=new (window.AudioContext||window.webkitAudioContext)());const o=ctx.createOscillator();const g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+d);o.start();o.stop(ctx.currentTime+d);} }catch(e){} }
  // Seeded RNG (mulberry32) for daily challenges
  function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  var dailySeededRng = null; // when non-null, advStart uses this for buildSpaceTypes
  var dailyMode = false;
  function todaySeed(){return parseInt((new Date()).toISOString().slice(0,10).replace(/-/g,''))}
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

  /* ============================== EXPANSION DECK LIBRARY (adv + lane) ============================== */
  function getExpDecks(mode){
    var s=loadStore();
    s.decks=s.decks||{};
    var key='exp_'+mode;
    return s.decks[key]||[];
  }
  function setExpDecks(mode, decks){
    var s=loadStore();
    s.decks=s.decks||{};
    s.decks['exp_'+mode]=decks;
    saveStore(s);
  }
  function expSaveDeck(mode, members, suggestedName){
    var minN = mode==='adv' ? 8 : 6;
    if(!members || members.length < minN){
      alert('Pick all '+minN+' cards first.');
      return;
    }
    var name = prompt('Deck name?', suggestedName || ('My ' + (mode==='adv'?'Adventure':'Lane Deck')));
    if(!name) return;
    var decks = getExpDecks(mode);
    if(decks.length >= 5){
      if(!confirm('You have 5 saved decks. Replace the oldest?')) return;
      decks.shift();
    }
    decks.push({name:name, members:members.slice(), date:Date.now()});
    setExpDecks(mode, decks);
    if(typeof toast==='function') toast('Deck saved!');
    else if(typeof window.toast==='function') window.toast('Deck saved!');
    else alert('Deck saved!');
    renderExpDeckStrip(mode);
  }
  function expDeleteDeck(mode, idx){
    if(!confirm('Delete this saved deck?')) return;
    var decks = getExpDecks(mode);
    decks.splice(idx, 1);
    setExpDecks(mode, decks);
  }
  function expLoadDeck(mode, idx){
    var decks = getExpDecks(mode);
    var d = decks[idx]; if(!d) return;
    _bridgeRosterBosses(); var ROSTER = window.ROSTER || [];
    if(mode === 'adv'){
      advPickList.length = 0;
      d.members.forEach(function(id){
        var entry = ROSTER.find(function(r){return r.id===id});
        if(entry && entry.isSpell) return; // skip spells in adv decks
        if(entry){
          if(advPickList.length < 8) advPickList.push(id);
        }
      });
      renderAdvPickRefresh();
    } else {
      lanePickList.length = 0;
      d.members.forEach(function(id){
        if(ROSTER.find(function(r){return r.id===id})){
          if(lanePickList.length < 6) lanePickList.push(id);
        }
      });
      renderLanePickRefresh();
    }
    if(typeof toast==='function') toast('Deck loaded!');
  }
  function renderExpDeckStrip(mode){
    var screenId = mode==='adv' ? 'advPick' : 'lanePick';
    var screen = document.getElementById(screenId); if(!screen) return;
    var stripId = 'expDeckStrip_'+mode;
    var strip = document.getElementById(stripId);
    if(!strip){
      strip = document.createElement('div');
      strip.id = stripId;
      strip.className = 'exp-deck-strip';
      var selectBar = screen.querySelector('.select-bar');
      if(selectBar && selectBar.parentNode){
        selectBar.parentNode.insertBefore(strip, selectBar.nextSibling);
      } else {
        var pageBody = screen.querySelector('.page-body');
        if(pageBody) screen.insertBefore(strip, pageBody);
      }
    }
    var decks = getExpDecks(mode);
    _bridgeRosterBosses(); var ROSTER = window.ROSTER || [];
    strip.innerHTML = '';
    if(decks.length === 0){
      var empty = document.createElement('div');
      empty.className = 'exp-deck-strip-empty';
      empty.textContent = 'No saved decks yet — pick cards then tap 💾 SAVE';
      strip.appendChild(empty);
      return;
    }
    decks.forEach(function(d, i){
      var card = document.createElement('div');
      card.className = 'exp-deck-card';
      var preview = d.members.slice(0,3).map(function(id){
        var r = ROSTER.find(function(x){return x.id===id});
        return r ? r.n : id;
      }).join(', ');
      if(d.members.length > 3) preview += ', +' + (d.members.length - 3);
      var nameSafe = String(d.name).replace(/</g,'&lt;').replace(/>/g,'&gt;');
      var prevSafe = String(preview).replace(/</g,'&lt;').replace(/>/g,'&gt;');
      card.innerHTML = '<div class="nm">'+nameSafe+'</div><div class="ct">'+d.members.length+' cards · '+prevSafe+'</div><div class="x" data-mode="'+mode+'" data-idx="'+i+'">✕</div>';
      card.onclick = function(e){
        if(e.target && e.target.classList && e.target.classList.contains('x')){
          e.stopPropagation();
          expDeleteDeck(mode, i);
          renderExpDeckStrip(mode);
          return;
        }
        expLoadDeck(mode, i);
      };
      strip.appendChild(card);
    });
  }
  window.expSaveDeckBtn = function(mode){
    if(mode==='adv') expSaveDeck('adv', advPickList);
    else expSaveDeck('lane', lanePickList);
  };

  // === Feature: Randomize button + Live team stats panel ===
  function expRandomize(mode){
    _bridgeRosterBosses();
    // Adventure rolls foes from ROSTER mid-run, so its deck must exclude spells.
    // Lane Duel deploys spells as deck cards, so keep them in its randomizer pool.
    var roster = mode==='adv' ? nonSpellRoster() : (window.ROSTER || []);
    if(!roster.length){ alert('Roster not loaded yet'); return; }
    var max = mode==='adv' ? 8 : 6;
    var pool = roster.slice();
    for(var i=pool.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=pool[i];pool[i]=pool[j];pool[j]=t; }
    var picks = pool.slice(0, Math.min(max, pool.length)).map(function(c){return c.id});
    if(mode==='adv'){
      advPickList.length = 0;
      picks.forEach(function(id){ advPickList.push(id); });
      renderAdvPickRefresh();
    } else {
      lanePickList.length = 0;
      picks.forEach(function(id){ lanePickList.push(id); });
      renderLanePickRefresh();
    }
    if(typeof tone==='function') {
      tone(523,0.06,'sine',0.08);
      setTimeout(function(){tone(659,0.06,'sine',0.08)},80);
      setTimeout(function(){tone(784,0.08,'sine',0.08)},160);
    }
  }
  window.expRandomize = expRandomize;

  function renderExpTeamStats(mode){
    _bridgeRosterBosses();
    var roster = window.ROSTER || [];
    var screenId = mode==='adv' ? 'advPick' : 'lanePick';
    var screen = document.getElementById(screenId); if(!screen) return;
    var panelId = 'expTeamStats_' + mode;
    var panel = document.getElementById(panelId);
    if(!panel){
      panel = document.createElement('div');
      panel.id = panelId;
      panel.className = 'exp-team-stats';
      var strip = document.getElementById('expDeckStrip_' + mode);
      if(strip && strip.parentNode){
        strip.parentNode.insertBefore(panel, strip.nextSibling);
      } else {
        var pageBody = screen.querySelector('.page-body');
        if(pageBody) screen.insertBefore(panel, pageBody);
      }
    }
    var list = mode==='adv' ? advPickList : lanePickList;
    if(!list || !list.length){ panel.classList.remove('on'); panel.innerHTML=''; return; }
    var totalHp=0, totalAtk=0, totalElixir=0, types={};
    list.forEach(function(id){
      var c = roster.find(function(r){return r.id===id});
      if(!c) return;
      totalHp += (c.hp||0);
      totalAtk += (c.atk||0);
      totalElixir += (c.elixir||0);
      var t = c.t || 'misc';
      types[t] = (types[t]||0) + 1;
    });
    var avgElixir = (totalElixir / list.length).toFixed(1);
    var typeEmoji = {jedi:'🟦',sith:'🖤',bounty:'🎯',droid:'🤖',empire:'⬜',rebel:'🚀',
                     guard:'⚡',forward:'🛡',center:'🏔',star:'⭐',legend:'👑',rookie:'🌱',
                     fire:'🔥',water:'💧',grass:'🌿',electric:'⚡',psychic:'🔮',ice:'❄️',
                     tech:'🤖',mystic:'🔮',cosmic:'🌌',mutant:'🧬',symbiote:'🕷️',soldier:'🛡',
                     speedster:'⚡',flying:'🪽',ground:'🌍',magic:'✨','big':'💪'};
    var typeRows = Object.keys(types).sort(function(a,b){return types[b]-types[a]}).map(function(t){
      return '<span class="exp-team-stats-type">' + (typeEmoji[t]||'') + ' ' + t + ' <b>' + types[t] + '</b></span>';
    }).join('');
    panel.innerHTML = '<div class="exp-team-stats-row">' +
      '<span class="exp-team-stats-stat">❤️ <b>' + totalHp + '</b> HP</span>' +
      '<span class="exp-team-stats-stat">⚔ <b>' + totalAtk + '</b> ATK</span>' +
      '<span class="exp-team-stats-stat">⚡ <b>' + avgElixir + '</b> avg</span>' +
      '<span class="exp-team-stats-stat">📋 <b>' + list.length + '</b> picked</span>' +
    '</div>' + (typeRows ? '<div class="exp-team-stats-types">' + typeRows + '</div>' : '');
    panel.classList.add('on');
  }
  window.renderExpTeamStats = renderExpTeamStats;

  /* === Live deck preview strip — shows currently picked cards as mini-cards above grid === */
  function renderExpPickPreview(mode){
    _bridgeRosterBosses();
    var roster = window.ROSTER || [];
    var screenId = mode==='adv' ? 'advPick' : 'lanePick';
    var screen = document.getElementById(screenId); if(!screen) return;
    var stripId = 'expPickPreview_' + mode;
    var strip = document.getElementById(stripId);
    if(!strip){
      strip = document.createElement('div');
      strip.id = stripId;
      strip.className = 'exp-pick-preview';
      var anchor = document.getElementById('expTeamStats_' + mode) || document.getElementById('expDeckStrip_' + mode);
      if(anchor && anchor.parentNode){
        anchor.parentNode.insertBefore(strip, anchor.nextSibling);
      } else {
        var pageBody = screen.querySelector('.page-body');
        if(pageBody) screen.insertBefore(strip, pageBody);
      }
    }
    var list = mode==='adv' ? advPickList : lanePickList;
    strip.innerHTML = '';
    if(!list || !list.length){
      var empty = document.createElement('div');
      empty.className = 'exp-pick-preview-empty';
      empty.textContent = 'Picks will appear here as you select';
      strip.appendChild(empty);
      return;
    }
    list.forEach(function(id, idx){
      var c = roster.find(function(r){return r.id===id});
      if(!c) return;
      var pick = document.createElement('div');
      pick.className = 'pick';
      var safeFb = (c.fb||'❓').replace(/'/g,'&#39;').replace(/"/g,'&quot;');
      var safeName = (c.n||c.id||'').replace(/'/g,'&#39;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
      var artHtml;
      // Prefer the host's artHTML — it handles each game's override system
      // (POKEMON_OVERRIDES, MARVEL_OVERRIDES, STARWARS_OVERRIDES, NBA_OVERRIDES, dynamic
      // image loaders, SVG fallbacks, etc.). Fall back to roster .art / .fb only if missing.
      if(typeof window.artHTML === 'function'){
        try { artHtml = window.artHTML(c); } catch(e){ artHtml = ''; }
      }
      if(!artHtml){
        if(c.art){
          artHtml = '<img src="' + c.art + '" alt="' + safeName + '" onerror="this.outerHTML=\'<span class=&quot;emoji&quot;>'+safeFb+'</span>\'">';
        } else {
          artHtml = '<span class="emoji">' + (c.fb||'❓') + '</span>';
        }
      }
      pick.innerHTML = '<div class="ex">' + (c.elixir||0) + '</div><div class="pa">' + artHtml + '</div><div class="nm">' + safeName + '</div><div class="x">✕</div>';
      pick.onclick = function(){
        list.splice(idx, 1);
        if(typeof tone==='function') tone(440,0.05,'square',0.07);
        if(mode==='adv'){
          if(typeof renderAdvPickRefresh==='function') renderAdvPickRefresh();
          renderExpPickPreview('adv');
          if(typeof renderExpTeamStats==='function') renderExpTeamStats('adv');
    if(typeof renderExpPickPreview==='function') renderExpPickPreview('adv');
        } else {
          if(typeof renderLanePickRefresh==='function') renderLanePickRefresh();
          renderExpPickPreview('lane');
          if(typeof renderExpTeamStats==='function') renderExpTeamStats('lane');
    if(typeof renderExpPickPreview==='function') renderExpPickPreview('lane');
        }
      };
      strip.appendChild(pick);
    });
  }
  window.renderExpPickPreview = renderExpPickPreview;

  /* === Expansion decks panel — shown on MY DECKS page above original decks list === */
  function renderExpDecksPanel(){
    var decksScreen = document.getElementById('decks');
    if(!decksScreen) return;
    var pageBody = decksScreen.querySelector('.page-body');
    if(!pageBody) return;
    var panelId = 'expDecksPanel';
    var panel = document.getElementById(panelId);
    if(!panel){
      panel = document.createElement('div');
      panel.id = panelId;
      panel.className = 'exp-decks-panel';
      pageBody.insertBefore(panel, pageBody.firstChild);
    }
    function rowsFor(mode){
      var decks = (typeof getExpDecks==='function') ? getExpDecks(mode) : [];
      if(!decks.length){
        return '<div class="exp-decks-panel-empty">No saved decks yet — go to ' + (mode==='adv'?'Adventure Quest':'Lane Duel') + ' to create one</div>';
      }
      return decks.map(function(d, i){
        var nm = (d.name || ('Deck '+(i+1))).replace(/</g,'&lt;');
        return '<div class="exp-decks-panel-row"><div class="nm">' + nm + '</div><div class="ct">' + d.members.length + ' cards</div><button class="load" onclick="window.expLoadDeckFromPanel(\'' + mode + '\',' + i + ')">▶ LOAD</button><button class="del" onclick="window.expDelDeckFromPanel(\'' + mode + '\',' + i + ')">✕</button></div>';
      }).join('');
    }
    panel.innerHTML = '<div class="exp-decks-panel-title">🌟 EXPANSION DECKS</div>' +
      '<div class="exp-decks-panel-section"><div class="exp-decks-panel-subhead">🗺️ Adventure Quest (8-card)</div>' + rowsFor('adv') + '</div>' +
      '<div class="exp-decks-panel-section"><div class="exp-decks-panel-subhead">🛤️ Lane Duel (6-card)</div>' + rowsFor('lane') + '</div>';
  }
  window.renderExpDecksPanel = renderExpDecksPanel;
  window.expLoadDeckFromPanel = function(mode, idx){
    var screen = mode==='adv' ? 'advPick' : 'lanePick';
    if(typeof goScreen === 'function'){
      goScreen(screen);
      setTimeout(function(){ if(typeof expLoadDeck==='function') expLoadDeck(mode, idx); }, 100);
    }
  };
  window.expDelDeckFromPanel = function(mode, idx){
    if(!confirm('Delete this saved deck?')) return;
    var decks = (typeof getExpDecks==='function') ? getExpDecks(mode) : [];
    decks.splice(idx, 1);
    if(typeof setExpDecks==='function') setExpDecks(mode, decks);
    renderExpDecksPanel();
  };

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
      _bridgeRosterBosses(); const BOSSES = window.BOSSES;
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
    const ROSTER=nonSpellRoster();
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
    renderExpDeckStrip('adv');
    if(typeof renderExpTeamStats==='function') renderExpTeamStats('adv');
    if(typeof renderExpPickPreview==='function') renderExpPickPreview('adv');
  };
  function renderAdvPickRefresh(){
    $('advPickB').textContent=advPickList.length;$('advPickCount').textContent=advPickList.length;
    $('advPickStart').disabled=advPickList.length!==8;
    const cards=$('advPickGrid').children;
    const ROSTER=nonSpellRoster();
    ROSTER.forEach((h,i)=>{cards[i]&&cards[i].classList.toggle('selected',advPickList.includes(h.id))});
    if(typeof renderExpTeamStats==='function') renderExpTeamStats('adv');
    if(typeof renderExpPickPreview==='function') renderExpPickPreview('adv');
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
    // If daily mode is active, use seeded RNG to generate a different layout each day.
    if(dailyMode && typeof dailySeededRng === 'function'){
      const rng = dailySeededRng;
      const arr=new Array(25).fill('battle');
      // Index 24 (space 25) is always the boss
      arr[24]='boss';
      // Pool of space types to distribute across spaces 1..24
      const pool=['battle','battle','battle','battle','battle','battle','battle','battle','battle','battle',
                  'power','power','power','power',
                  'heal','heal','heal',
                  'treasure','treasure','treasure',
                  'trap','trap',
                  'skip',
                  'rest'];
      // Shuffle pool with seeded RNG (Fisher-Yates)
      for(let i=pool.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
      for(let i=0;i<24;i++)arr[i]=pool[i];
      return arr;
    }
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
    const ROSTER=nonSpellRoster();
    const party=advPickList.map(id=>{const r=ROSTER.find(x=>x.id===id);if(!r)return null;return{id:r.id,n:r.n,fb:r.fb,pid:r.pid,t:r.t,atk:r.atk,def:r.def,spd:r.spd,hpMax:r.hp,hp:r.hp,xp:0,fainted:false}}).filter(Boolean);
    advState={
      party,space:0,types:buildSpaceTypes(),waypoints:buildBoardWaypoints(),
      inventory:[],shieldNext:false,atkBuffNext:false,log:[],busy:false,pendingSteps:0,rerollAvailable:0,
      isDaily: !!dailyMode, dailySeed: dailyMode?todaySeed():null,
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
      const ROSTER=(_bridgeRosterBosses(),window.ROSTER||[]);
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
    // Track best space reached across all runs
    try{
      const s=loadStore();
      const best=(s.advBestSpace||0);
      if(advState.space>best){s.advBestSpace=advState.space;saveStore(s)}
    }catch(e){}
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
    const ROSTER=nonSpellRoster();
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
    // Save daily challenge result if applicable
    if(advState.isDaily && advState.dailySeed){
      try{
        localStorage.setItem('expDailyClear_'+advState.dailySeed, JSON.stringify({
          cleared: !!won, spacesReached: advState.space, time: Date.now()
        }));
      }catch(e){}
    }
    // Reset daily mode flags
    dailyMode=false; dailySeededRng=null;
    if($('endStats'))$('endStats').innerHTML=`Reached space <b>${advState.space}</b>/25 · Items collected: ${advState.inventory.length}<br>Total runs: ${adv.runs} · Wins: ${adv.wins||0} · Losses: ${adv.losses||0}`;
    if($('endNext')){$('endNext').textContent='▶ NEW QUEST';$('endNext').onclick=()=>{$('endOverlay').classList.remove('on');refreshContinuePill();goScreenInner('advPick')}}
    if($('endOverlay'))$('endOverlay').classList.add('on');
    refreshContinuePill();
    if(typeof window._expRefreshDailyPill==='function')window._expRefreshDailyPill();
  }

  /* ============================== ONE-LANE BATTLE ============================== */
  let lanePickList=[];
  let laneState=null;

  window.renderLanePick = function(){
    lanePickList=[];
    $('lanePickB').textContent=0;$('lanePickCount').textContent=0;$('lanePickStart').disabled=true;
    const grid=$('lanePickGrid');grid.innerHTML='';
    const ROSTER=(_bridgeRosterBosses(),window.ROSTER||[]);
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
    renderExpDeckStrip('lane');
    if(typeof renderExpTeamStats==='function') renderExpTeamStats('lane');
    if(typeof renderExpPickPreview==='function') renderExpPickPreview('lane');
  };
  function renderLanePickRefresh(){
    $('lanePickB').textContent=lanePickList.length;$('lanePickCount').textContent=lanePickList.length;
    $('lanePickStart').disabled=lanePickList.length!==6;
    const cards=$('lanePickGrid').children;
    const ROSTER=(_bridgeRosterBosses(),window.ROSTER||[]);
    ROSTER.forEach((h,i)=>{cards[i]&&cards[i].classList.toggle('selected',lanePickList.includes(h.id))});
    if(typeof renderExpTeamStats==='function') renderExpTeamStats('lane');
    if(typeof renderExpPickPreview==='function') renderExpPickPreview('lane');
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
    const ROSTER=(_bridgeRosterBosses(),window.ROSTER||[]);
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
    const ROSTER=(_bridgeRosterBosses(),window.ROSTER||[]);
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
      // Long-press / right-click card preview
      attachLongPress(el, ()=>showLaneCardPreview(c));
      handEl.appendChild(el);
    });
  }

  // === Lane card long-press preview ===
  function attachLongPress(el, onLongPress){
    let timer=null, fired=false, startX=0, startY=0;
    const TH=8;
    const start=(x,y)=>{
      fired=false; startX=x; startY=y;
      clearTimeout(timer);
      timer=setTimeout(()=>{fired=true; onLongPress();}, 500);
    };
    const cancel=()=>{clearTimeout(timer); timer=null;};
    el.addEventListener('touchstart', e=>{
      const t=e.touches[0]; if(!t)return;
      start(t.clientX, t.clientY);
    }, {passive:true});
    el.addEventListener('touchmove', e=>{
      const t=e.touches[0]; if(!t)return;
      if(Math.abs(t.clientX-startX)>TH || Math.abs(t.clientY-startY)>TH) cancel();
    }, {passive:true});
    el.addEventListener('touchend', ()=>{
      cancel();
      // If long-press fired, suppress the upcoming click by capturing it once
      if(fired){
        const blocker=(ev)=>{ev.preventDefault();ev.stopPropagation();el.removeEventListener('click',blocker,true);};
        el.addEventListener('click', blocker, true);
        setTimeout(()=>{try{el.removeEventListener('click',blocker,true);}catch(e){}}, 600);
      }
    });
    el.addEventListener('touchcancel', cancel);
    el.addEventListener('mousedown', e=>{ if(e.button!==0)return; start(e.clientX, e.clientY); });
    el.addEventListener('mousemove', e=>{ if(timer && (Math.abs(e.clientX-startX)>TH||Math.abs(e.clientY-startY)>TH)) cancel(); });
    el.addEventListener('mouseup', ()=>cancel());
    el.addEventListener('mouseleave', ()=>cancel());
    // Right-click also opens preview on desktop
    el.addEventListener('contextmenu', e=>{e.preventDefault(); onLongPress();});
  }

  function showLaneCardPreview(c){
    let modal=document.getElementById('laneCardPreview');
    if(!modal){
      modal=document.createElement('div');
      modal.id='laneCardPreview';
      modal.className='lane-card-preview';
      modal.innerHTML='<div class="lane-card-preview-card"><div class="nm"></div><div class="pa"></div><div class="stats"></div><div class="moves"></div><button class="lane-card-preview-close">CLOSE</button></div>';
      document.body.appendChild(modal);
      modal.addEventListener('click', e=>{ if(e.target===modal) modal.classList.remove('on'); });
      modal.querySelector('.lane-card-preview-close').onclick=()=>modal.classList.remove('on');
    }
    const card=modal.querySelector('.lane-card-preview-card');
    card.querySelector('.nm').textContent=c.n||'???';
    card.querySelector('.pa').innerHTML=artHTML(c);
    const tName=c.t||'—';
    const ROSTER=(_bridgeRosterBosses(),window.ROSTER||[]);
    const full=ROSTER.find(r=>r.id===c.id)||{};
    const def=c.def||full.def||0;
    const spd=c.spd||full.spd||0;
    const cost=c.cost!=null?c.cost:(full.elixir||3);
    card.querySelector('.stats').innerHTML=
      `<div class="stat"><span>TYPE</span><b>${tName}</b></div>`+
      `<div class="stat"><span>ELIXIR</span><b>${cost}⚡</b></div>`+
      `<div class="stat"><span>HP</span><b>${c.hp}/${c.hpMax}</b></div>`+
      `<div class="stat"><span>ATK</span><b>${c.atk}</b></div>`+
      `<div class="stat"><span>DEF</span><b>${def}</b></div>`+
      `<div class="stat"><span>SPD</span><b>${spd}</b></div>`;
    let movesHtml='';
    const moves=full.moves||c.moves;
    if(Array.isArray(moves) && moves.length){
      movesHtml='<b style="color:var(--gold);letter-spacing:1px;font-size:.7rem">MOVES</b><br>'+moves.map(m=>{
        if(typeof m==='string')return '• '+m;
        return '• '+(m.n||m.name||'?')+(m.dmg?' ('+m.dmg+' dmg)':'')+(m.t?' ['+m.t+']':'');
      }).join('<br>');
    } else {
      movesHtml='<span style="color:var(--soft)">Long-press a card to preview its full stats.</span>';
    }
    card.querySelector('.moves').innerHTML=movesHtml;
    modal.classList.add('on');
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

    // Daily Challenge pill
    const dailyPill = document.createElement('button');
    dailyPill.className = 'exp-daily-pill exp-daily-btn';
    dailyPill.innerHTML = '<span class="ic">🔥</span><span class="info"><div class="nm">DAILY CHALLENGE</div><div class="sm">Loading...</div></span>';
    dailyPill.onclick = startDailyChallenge;

    // Stats button
    const statsBtn = document.createElement('button');
    statsBtn.className = 'menu-btn';
    statsBtn.onclick = () => (window.goScreen||goScreenInner)('expStats');
    statsBtn.innerHTML = '<span class="ico">📊</span><span class="lbl">STATS<span class="sub">Run history & favorite game</span></span><span class="arr">›</span>';

    if(insertAfter){
      home.insertBefore(continuePill, insertAfter);
      home.insertBefore(dailyPill, insertAfter);
      home.insertBefore(advPill, insertAfter);
      home.insertBefore(advBtn, insertAfter);
      home.insertBefore(lanePill, insertAfter);
      home.insertBefore(laneBtn, insertAfter);
      home.insertBefore(statsBtn, insertAfter);
    } else {
      home.appendChild(continuePill);
      home.appendChild(dailyPill);
      home.appendChild(advPill);
      home.appendChild(advBtn);
      home.appendChild(lanePill);
      home.appendChild(laneBtn);
      home.appendChild(statsBtn);
    }
    refreshContinuePill();
    refreshDailyPill();
    addSettingsButton();
    wireSettingsOverlay();
  }

  // === Daily Challenge ===
  function getDailyResult(){
    try{const raw=localStorage.getItem('expDailyClear_'+todaySeed());return raw?JSON.parse(raw):null}catch(e){return null}
  }
  function refreshDailyPill(){
    const home=document.getElementById('home');
    if(!home)return;
    const pill=home.querySelector('.exp-daily-btn');
    if(!pill)return;
    const result=getDailyResult();
    const dateLbl=(new Date()).toISOString().slice(0,10);
    pill.classList.remove('cleared','failed');
    const sm=pill.querySelector('.sm');
    const nm=pill.querySelector('.nm');
    if(result){
      if(result.cleared){
        pill.classList.add('cleared');
        if(nm)nm.textContent='DAILY CHALLENGE ✓';
        if(sm)sm.textContent=dateLbl+' · CLEARED — try tomorrow!';
        pill.disabled=true;
        pill.style.cursor='default';
      } else {
        pill.classList.add('failed');
        if(nm)nm.textContent='DAILY CHALLENGE ✗';
        if(sm)sm.textContent=dateLbl+' · failed at space '+(result.spacesReached||0)+' — try tomorrow!';
        pill.disabled=true;
        pill.style.cursor='default';
      }
    } else {
      if(nm)nm.textContent='🔥 DAILY CHALLENGE';
      if(sm)sm.textContent=dateLbl+' · ▶ START — same board for everyone';
      pill.disabled=false;
      pill.style.cursor='pointer';
    }
  }
  window._expRefreshDailyPill = refreshDailyPill;
  function startDailyChallenge(){
    const result=getDailyResult();
    if(result){toast(result.cleared?'Already cleared today!':'Already attempted today.');return}
    if(hasAdvRun()){
      if(!confirm('Starting Daily Challenge will erase your saved run. Continue?'))return;
      clearAdvRun();
    }
    dailyMode=true;
    dailySeededRng=mulberry32(todaySeed());
    (window.goScreen||goScreenInner)('advPick');
    toast('🔥 Daily Challenge — pick 8 to start');
  }

  // === Settings button + overlay wiring ===
  function addSettingsButton(){
    if(document.getElementById('expSettingsBtn'))return;
    const btn=document.createElement('button');
    btn.id='expSettingsBtn';
    btn.className='exp-settings-btn';
    btn.innerHTML='⚙️';
    btn.title='Settings';
    btn.onclick=()=>{
      // Only show on home screen
      const overlay=document.getElementById('expSettingsOverlay');
      if(!overlay)return;
      // Sync sound toggle state
      const tgl=document.getElementById('expSoundToggle');
      if(tgl)tgl.classList.toggle('on', soundEnabled);
      overlay.classList.add('on');
    };
    // Only show button when home is the active screen
    document.body.appendChild(btn);
    function syncBtnVisibility(){
      const home=document.getElementById('home');
      btn.style.display=(home&&home.classList.contains('on'))?'flex':'none';
    }
    syncBtnVisibility();
    // Re-check visibility periodically (light) and on screen changes via MutationObserver on body
    const mo=new MutationObserver(syncBtnVisibility);
    mo.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
  }
  function wireSettingsOverlay(){
    const overlay=document.getElementById('expSettingsOverlay');
    if(!overlay || overlay._wired)return;
    overlay._wired=true;
    overlay.addEventListener('click', e=>{ if(e.target===overlay) overlay.classList.remove('on'); });
    const tgl=document.getElementById('expSoundToggle');
    if(tgl){
      tgl.classList.toggle('on', soundEnabled);
      tgl.onclick=()=>{
        soundEnabled=!soundEnabled;
        tgl.classList.toggle('on', soundEnabled);
        try{localStorage.setItem('expSoundEnabled', soundEnabled?'1':'0')}catch(e){}
      };
    }
    const closeBtn=document.getElementById('expSettingsCloseBtn');
    if(closeBtn)closeBtn.onclick=()=>overlay.classList.remove('on');
    const clearBtn=document.getElementById('expClearProgressBtn');
    if(clearBtn)clearBtn.onclick=()=>{
      if(!confirm('Clear your saved adventure run? (Stats will be kept.)'))return;
      clearAdvRun();
      refreshContinuePill();
      toast('Adventure run cleared');
    };
    const showTut=document.getElementById('expShowTutorialBtn');
    if(showTut)showTut.onclick=()=>{
      try{localStorage.removeItem('expAdvTutorialSeen')}catch(e){}
      overlay.classList.remove('on');
      showAdventureTutorial();
    };
    // Tutorial OK button
    const tutOk=document.getElementById('expTutorialOk');
    if(tutOk && !tutOk._wired){
      tutOk._wired=true;
      tutOk.onclick=()=>{
        const t=document.getElementById('expTutorial');
        if(t)t.classList.remove('on');
        try{localStorage.setItem('expAdvTutorialSeen','1')}catch(e){}
      };
    }
    const tut=document.getElementById('expTutorial');
    if(tut && !tut._wired){
      tut._wired=true;
      tut.addEventListener('click', e=>{ if(e.target===tut){tut.classList.remove('on');try{localStorage.setItem('expAdvTutorialSeen','1')}catch(_){}} });
    }
  }
  function showAdventureTutorial(){
    const t=document.getElementById('expTutorial');
    if(t)t.classList.add('on');
  }
  function maybeShowAdvTutorial(){
    try{
      if(localStorage.getItem('expAdvTutorialSeen')==='1')return;
    }catch(e){return}
    showAdventureTutorial();
  }

  // === Stats screen renderer ===
  const EXP_GAME_KEYS = [
    {key:'pokemon-arena-full', name:'POKEMON', ico:'⚡'},
    {key:'marvel-arena-full', name:'MARVEL', ico:'🦸'},
    {key:'smash-arena-full', name:'SMASH', ico:'🎮'},
    {key:'clash-arena-full', name:'CLASH', ico:'⚔️'},
    {key:'starwars-arena-full', name:'STAR WARS', ico:'⭐'},
    {key:'nba-arena-full', name:'NBA', ico:'🏀'},
  ];
  function renderExpStats(){
    const body=document.getElementById('expStatsBody');
    if(!body)return;
    // Aggregate from current store
    const adv=getAdventure();
    const lane=getLane();
    const advRuns=adv.runs||0;
    const advWins=adv.wins||0;
    const advLosses=adv.losses||0;
    const advWR=advRuns?Math.round(advWins/advRuns*100):0;
    const laneTotal=(lane.wins||0)+(lane.losses||0);
    const laneWR=laneTotal?Math.round((lane.wins||0)/laneTotal*100):0;
    let bestSpace=0;
    try{bestSpace=loadStore().advBestSpace||0}catch(e){}

    // Per-game breakdown
    const perGame=[];
    let favoriteGame=null;
    let mostActivity=-1;
    EXP_GAME_KEYS.forEach(g=>{
      let s=null;
      try{const raw=localStorage.getItem(g.key);if(raw)s=JSON.parse(raw)}catch(e){}
      if(!s)s={};
      const tb=s.turnBattle||{};
      const bb=s.boardBattle||s.deckBattle||{};
      const a=s.adventure||{};
      const tbW=tb.wins||0, tbL=tb.losses||0;
      const bbW=bb.wins||0, bbL=bb.losses||0;
      const aRuns=a.runs||0, aWins=a.wins||0;
      const activity = tbW+tbL+bbW+bbL+aRuns;
      if(activity>mostActivity){mostActivity=activity; favoriteGame=g.name}
      perGame.push({g,tbW,tbL,bbW,bbL,aRuns,aWins});
    });

    let html='';
    html+='<div class="exp-stats-section">📈 OVERALL</div>';
    html+='<div class="exp-stats-grid">';
    html+=`<div class="exp-stats-card"><span class="v">${advRuns}</span><div class="k">ADV RUNS</div></div>`;
    html+=`<div class="exp-stats-card"><span class="v">${advWins}-${advLosses}</span><div class="k">ADV W-L</div></div>`;
    html+=`<div class="exp-stats-card"><span class="v">${advWR}%</span><div class="k">ADV WIN RATE</div></div>`;
    html+=`<div class="exp-stats-card"><span class="v">${bestSpace}/25</span><div class="k">BEST SPACE</div></div>`;
    html+=`<div class="exp-stats-card"><span class="v">${lane.wins||0}-${lane.losses||0}</span><div class="k">LANE W-L</div></div>`;
    html+=`<div class="exp-stats-card"><span class="v">${laneWR}%</span><div class="k">LANE WIN RATE</div></div>`;
    html+='</div>';

    html+='<div class="exp-stats-section">🏆 FAVORITE GAME</div>';
    html+=`<div class="exp-stats-row"><span class="ico">⭐</span><span class="gn">${favoriteGame||'—'}</span><span class="nums">most active</span></div>`;

    html+='<div class="exp-stats-section">🎯 PER-GAME BREAKDOWN</div>';
    perGame.forEach(p=>{
      const cleared = p.aWins;
      html+=`<div class="exp-stats-row"><span class="ico">${p.g.ico}</span><span class="gn">${p.g.name}</span><span class="nums">⚔️ ${p.tbW}W-${p.tbL}L · 🃏 ${p.bbW}W-${p.bbL}L · 🗺️ ${p.aRuns} runs (${cleared} cleared)</span></div>`;
    });

    body.innerHTML=html;
  }
  window._expRenderStats = renderExpStats;
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
      if(id === 'decks' && typeof window.renderExpDecksPanel === 'function') window.renderExpDecksPanel();
      if(id === 'home'){
        if(typeof window._expRefreshContinuePill === 'function') window._expRefreshContinuePill();
        if(typeof window._expRefreshDailyPill === 'function') window._expRefreshDailyPill();
      }
      if(id === 'expStats' && typeof window._expRenderStats === 'function') window._expRenderStats();
      if(id === 'advPick' || id === 'adventure') maybeShowAdvTutorial();
    };
  }
  patchGoScreen();

  // === Hide spell cards from 1v1 selection (turn battle / story mode) ===
  // Quick Battle and Story / Gym Challenge use selectMode === 'tb'. Spells are deck-only
  // and would appear as standalone fighters there. Quick Board (selectMode === 'bb') keeps spells.
  (function(){
    function tryWrap(){
      if(typeof window.renderSelect !== 'function') return setTimeout(tryWrap, 200);
      if(window._RENDER_SELECT_SPELL_FILTER_WRAPPED) return;
      window._RENDER_SELECT_SPELL_FILTER_WRAPPED = true;
      var orig = window.renderSelect;
      window.renderSelect = function(){
        var ret = orig.apply(this, arguments);
        try {
          var mode = (typeof selectMode !== 'undefined') ? selectMode : (window.selectMode || 'tb');
          if(mode === 'tb'){
            _bridgeRosterBosses();
            var roster = window.ROSTER || [];
            var grid = document.getElementById('selectGrid');
            if(!grid) return ret;
            var cards = grid.querySelectorAll('.hero-card');
            cards.forEach(function(card){
              var nameEl = card.querySelector('.name');
              if(!nameEl) return;
              var rosterEntry = roster.find(function(r){ return r.n === nameEl.textContent; });
              if(rosterEntry && rosterEntry.isSpell){
                card.style.display = 'none';
              }
            });
          }
        } catch(e){}
        return ret;
      };
    }
    tryWrap();
  })();

})();

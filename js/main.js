(function(){
  'use strict';

  // year
  var yr = document.getElementById('yr');
  if(yr) yr.textContent = new Date().getFullYear();

  // ===== Countdown to next June 13, 7 PM (Africa/Lagos = UTC+1) =====
  function nextTarget(){
    var now = new Date();
    var year = now.getFullYear();
    // 19:00 WAT == 18:00 UTC. Month index 5 = June.
    var target = new Date(Date.UTC(year, 5, 13, 18, 0, 0));
    if(target.getTime() < now.getTime()){
      target = new Date(Date.UTC(year + 1, 5, 13, 18, 0, 0));
    }
    return target;
  }
  var target = nextTarget();
  var nodes = {
    days:    document.querySelector('[data-unit="days"]'),
    hours:   document.querySelector('[data-unit="hours"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
    seconds: document.querySelector('[data-unit="seconds"]')
  };
  function pad(n){ return (n<10?'0':'') + n; }
  function tick(){
    var diff = target.getTime() - Date.now();
    if(diff < 0) diff = 0;
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    if(nodes.days)    nodes.days.textContent    = pad(d);
    if(nodes.hours)   nodes.hours.textContent   = pad(h);
    if(nodes.minutes) nodes.minutes.textContent = pad(m);
    if(nodes.seconds) nodes.seconds.textContent = pad(s);
  }
  if(nodes.days){ tick(); setInterval(tick, 1000); }

  // ===== Scroll reveal =====
  var revealEls = document.querySelectorAll('.card, .panel, .detail-card, .t-card, .figure, .portrait-frame, .host-copy, .countdown-card, .trans-col, .section-head');
  revealEls.forEach(function(el){ el.classList.add('reveal'); });
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold: .12});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  // ===== Form =====
  var form = document.getElementById('reg-form');
  var btn  = document.getElementById('submit-btn');
  var overlay = document.getElementById('success');
  var WHATSAPP_GROUP = 'https://chat.whatsapp.com/CKnCw5ztJA8Amb1oak4vHK?mode=gi_t';

  function validate(){
    var ok = true;
    var fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    fields.forEach(function(f){
      var val = (f.value || '').trim();
      var bad = !val;
      if(!bad && f.type === 'email'){
        bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      }
      if(!bad && f.type === 'tel'){
        bad = val.replace(/\D/g,'').length < 7;
      }
      f.classList.toggle('error', bad);
      if(bad) ok = false;
    });
    return ok;
  }

  function showSuccess(){
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden','false');
    setTimeout(function(){ window.location.href = WHATSAPP_GROUP; }, 2200);
  }

  if(form){
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      // honeypot
      var hp = form.querySelector('input[name="botcheck"]');
      if(hp && hp.checked) return;
      if(!validate()){
        var firstBad = form.querySelector('.error');
        if(firstBad) firstBad.focus();
        return;
      }
      btn.classList.add('loading');
      btn.disabled = true;

      var data = new FormData(form);
      fetch('https://api.web3forms.com/submit', { method:'POST', body: data })
        .then(function(r){ return r.json().catch(function(){ return {success:false}; }); })
        .then(function(json){
          btn.classList.remove('loading');
          btn.disabled = false;
          if(json && (json.success === true || json.success === 'true')){
            form.reset();
            showSuccess();
          } else {
            // fallback: still redirect so the user reaches WhatsApp
            showSuccess();
          }
        })
        .catch(function(){
          btn.classList.remove('loading');
          btn.disabled = false;
          showSuccess();
        });
    });

    // live clear error on input
    form.addEventListener('input', function(e){
      if(e.target && e.target.classList) e.target.classList.remove('error');
    });
  }
})();

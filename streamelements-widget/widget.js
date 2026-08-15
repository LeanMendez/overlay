(function () {
  var ACCENT = { seguidor: '#6FE7B7', sub: '#FFD36E', gift: '#FF8A6B', resub: '#6FE7B7', raid: '#A9C7FF' };
  var HERO = { seguidor: true, sub: true, gift: false, resub: false, raid: false };
  var TIER_TAG = { '1000': 'TIER 1', '2000': 'TIER 2', '3000': 'TIER 3' };

  var DISPLAY_MS = 6000;
  var EXIT_MS = 300;

  var stage = document.getElementById('alert-stage');
  var queue = [];
  var showing = false;

  function makeIcon(tipo, cantidad) {
    if (tipo === 'seguidor') {
      var follow = document.createElement('div');
      follow.className = 'alert2-follow';
      return follow;
    }
    if (tipo === 'sub') {
      var star = document.createElement('div');
      star.className = 'alert2-star';
      return star;
    }
    if (tipo === 'gift') {
      var wrap = document.createElement('div');
      wrap.className = 'alert2-gift';
      var body = document.createElement('div');
      body.className = 'body';
      var lid = document.createElement('div');
      lid.className = 'lid';
      wrap.appendChild(body);
      wrap.appendChild(lid);
      return wrap;
    }
    if (tipo === 'resub') {
      var num = document.createElement('div');
      num.className = 'alert2-resub';
      num.textContent = cantidad != null ? cantidad : '';
      return num;
    }
    if (tipo === 'raid') {
      var raidWrap = document.createElement('div');
      raidWrap.className = 'alert2-raid';
      var bars = document.createElement('div');
      bars.className = 'alert2-raid-bars';
      for (var i = 0; i < 6; i++) bars.appendChild(document.createElement('div'));
      raidWrap.appendChild(bars);
      return raidWrap;
    }
    return document.createElement('div');
  }

  function buildCard(alert) {
    var hero = HERO[alert.tipo];
    var card = document.createElement('div');
    card.className = 'alert2-card ' + (hero ? 'hero' : 'compact');
    card.style.setProperty('--accent', ACCENT[alert.tipo]);

    var iconBlock = document.createElement('div');
    iconBlock.className = 'alert2-icon';
    iconBlock.appendChild(makeIcon(alert.tipo, alert.cantidad));
    card.appendChild(iconBlock);

    var text = document.createElement('div');
    text.className = 'alert2-text';

    if (hero) {
      var chip = document.createElement('span');
      chip.className = 'alert2-chip';
      chip.textContent = alert.kicker;

      var name = document.createElement('div');
      name.className = 'alert2-name';
      name.textContent = alert.nombre;

      var sub = document.createElement('div');
      sub.className = 'alert2-sub';
      sub.textContent = alert.detalle;

      text.appendChild(chip);
      text.appendChild(name);
      text.appendChild(sub);
    } else {
      var kicker = document.createElement('span');
      kicker.className = 'alert2-kicker-plain';
      kicker.textContent = alert.kicker;

      var line = document.createElement('div');
      line.className = 'alert2-line';
      var b = document.createElement('b');
      b.textContent = alert.nombre;
      line.appendChild(b);
      line.appendChild(document.createTextNode(' ' + alert.detalle));

      text.appendChild(kicker);
      text.appendChild(line);
    }

    card.appendChild(text);

    if (hero) {
      var bar = document.createElement('div');
      bar.className = 'alert2-bar';
      card.appendChild(bar);
    }

    return card;
  }

  function showNext() {
    var next = queue.shift();
    if (!next) {
      showing = false;
      stage.innerHTML = '';
      return;
    }
    showing = true;
    stage.innerHTML = '';
    var card = buildCard(next);
    stage.appendChild(card);
    setTimeout(function () {
      card.classList.add('exiting');
      setTimeout(showNext, EXIT_MS);
    }, DISPLAY_MS);
  }

  function push(alert) {
    queue.push(alert);
    if (!showing) showNext();
  }

  /** Same 5 alert shapes as the AlertBanner React component — see
   * src/components/overlays/mint/useLiveAlerts.ts for the equivalent mapping
   * against raw Twitch EventSub payloads. */
  function fromStreamElements(listener, event) {
    if (listener === 'follower-latest') {
      return {
        tipo: 'seguidor',
        nombre: event.name,
        kicker: 'NUEVO SEGUIDOR',
        detalle: 'te sigue desde ahora',
      };
    }

    if (listener === 'subscriber-latest') {
      if (event.gifted) {
        var gifter = event.sender || 'Alguien';
        return {
          tipo: 'gift',
          nombre: gifter,
          cantidad: 1,
          kicker: 'SUB REGALADO',
          detalle: 'regala 1 sub a la comu',
        };
      }
      var months = event.amount || 1;
      if (months > 1) {
        return {
          tipo: 'resub',
          nombre: event.name,
          cantidad: months,
          kicker: 'RESUB · ' + months + ' MES' + (months === 1 ? '' : 'ES'),
          detalle: 'sigue en la party',
        };
      }
      var tierTag = TIER_TAG[event.tier];
      return {
        tipo: 'sub',
        nombre: event.name,
        kicker: 'SE HA SUSCRITO' + (tierTag ? ' · ' + tierTag : ''),
        detalle: '¡gracias por el apoyo!',
      };
    }

    if (listener === 'raid-latest') {
      var viewers = event.amount || 0;
      return {
        tipo: 'raid',
        nombre: event.name,
        cantidad: viewers,
        kicker: 'RAID · ' + viewers,
        detalle: 'llega con su gente',
      };
    }

    if (listener === 'cheer-latest') {
      return {
        tipo: 'sub',
        nombre: event.name,
        kicker: 'BITS',
        detalle: (event.amount || 0) + ' BITS · GRACIAS',
      };
    }

    return null;
  }

  window.addEventListener('onEventReceived', function (obj) {
    if (!obj.detail || !obj.detail.event) return;
    var alert = fromStreamElements(obj.detail.listener, obj.detail.event);
    if (alert) push(alert);
  });
})();

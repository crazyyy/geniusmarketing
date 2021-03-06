var like_loading = false,
  like_hide_cb = null,
  first = false,
  next_stats = false;

var WLike = {
  init: function() {
    if (!window.fastXDM) return;

    window.checkbox = ge('checkbox');
    window.mainDiv = ge('main');
    addEvent(mainDiv, 'mouseover', function (e) {
      if (noAuthVal || !Rpc) return;
      if (!window.tooltipInited) {
        window.tooltipInited = true;
        setTimeout(Rpc.callMethod.bind(Rpc, 'initTooltip', counter), 100);
      } else if (counter) {
        setTimeout(Rpc.callMethod.bind(Rpc, 'showTooltip'), 100);
      }
    });

    addEvent(checkbox, 'mouseup mousedown mouseover mouseout click', function (e) {
      if (e.type == 'mouseup' || e.type == 'mousedown') {
        window[e.type == 'mousedown' ? 'addClass' : 'removeClass'](checkbox, 'checkbox_pressed');
        return;
      }
      if (e.type == 'mouseover' || e.type == 'mouseout') {
        var isOver = e.type == 'mouseover';
        window[isOver ? 'addClass' : 'removeClass'](this, 'checkbox_over');
        if (!isOver) removeClass(checkbox, 'checkbox_pressed');
        return;
      }
      if (window.noAuthVal) return WLike.widgetAuth();
      val = !hasClass(checkbox, 'checked');
      if (!WLike.saveLike(val)) return;
      val ? addClass(checkbox, 'checked') : removeClass(checkbox, 'checked');
      return cancelEvent(e);
    });

    window.Rpc = new fastXDM.Client({
      onInit: function() {},
      captcha: function(sid, value) {
        window.onCaptcha(sid, value);
      },
      captchaHide: function () {
        window.onCaptchaHide();
      },
      share: WLike.shareThisPage,
      shared: WLike.sharedThisPage,
      hide: function () {
        if (like_hide_cb) like_hide_cb();
      }
    }, {safe: true});

    setTimeout(function () {
      resizeWidget();
      setStyle('stats_text', 'visibility', 'visible');
      setInterval(resizeWidget, 1000);
    }, 0);
  },

  saveLike: function(val) {
    if (like_loading) return false;
    like_loading = true;

    counter += val ? 1 : -1;

    window.Rpc.callMethod('proxy', val ? 'showUser' : 'hideUser');
    if (val && counter == 1) {
      window.Rpc.callMethod('showTooltip', true);
    } else if (!counter) {
      window.Rpc.callMethod('hideTooltip', true);
    }
    !val && window.Rpc.callMethod('proxy', 'unpublish');

    ajax.post('widget_like.php', {
      act: 'a_like',
      value: val ? 1 : 0,
      hash: likeHash,
      app: _aid,
      pageQuery: _pageQuery,
      s: cur.shorter ? 1 : 0,
      verb: cur.verb
    }, {
      onDone: function(resp) {
        like_loading = false;
        WLike.updateStats(resp, true);
        window.Rpc.callMethod('proxy', 'update', resp);
        next_stats = extend({}, resp, {stats: resp.next_stats});
        window.Rpc.callMethod('publish', (val ? 'widgets.like.liked' : 'widgets.like.unliked'), resp.num);
      },
      onFail: function() {
        like_loading = false;
      },
      hideProgress: function () {
        hide('loading');
      }
    });

    if (hasClass(mainDiv, 'like_dived') && ge('stats_text')) {
      if (like_hide_cb !== null) {
        like_hide_cb = null;
      } else {
        like_hide_cb = function () {
          like_hide_cb = null;
          if (next_stats) {
            WLike.updateStats(next_stats);
            resizeWidget();
          }
          next_stats = false;
        };
      }
      if (!val && like_hide_cb) {
        setTimeout(like_hide_cb, 200);
        like_hide_cb = null;
      }
    }

    return true;
  },

  updateStats: function(stats, noAnim) {
    var statsNum = ge('stats_num');
    statsNum && animateCount(statsNum, (stats.num ? stats.num_text || '' : '+1'), {str: 1, leftOnly: 1, onDone: function() {
      cur.autoWidth && resizeWidget();
    }});
    counter = stats.num;
    if (ge('stats_text') && stripHTML(ge('stats_text').innerHTML).toLowerCase() != stripHTML(stats.stats).toLowerCase()) {
      var el = ge('stats_text');
      if (noAnim) {
        el.innerHTML = stats.stats || '';
        resizeWidget();
        return;
      }
      if (!el.innerHTML) {
        setStyle(el, {opacity: 0});
        el.innerHTML = stats.stats;
        animate(el, {opacity: 1}, 100);
      } else {
        animate(el, {opacity: 0}, 100, function () {
          if (!(el.innerHTML = stats.stats)) return;
          animate(el, {opacity: 1}, 100);
        });
      }
      setTimeout(resizeWidget, 150);
    }
  },

  shareThisPage: function(val, hash) {
    if (hash != shareData.wall_hash) return;

    ajax.post('widget_like.php', {
      act: 'a_recommend',
      hash: shareData.wall_hash,
      description: shareData.description,
      title: shareData.title,
      url: likeURL,
      text: shareData.text,
      val: val ? 1 : 0,
      app: _aid,
      pageQuery: _pageQuery,
      s: cur.shorter ? 1 : 0
    }, {
      onDone: function (text) {
        WLike.sharedThisPage(text, val);
      }
    });
    if (val && !hasClass(checkbox, 'checked')) {
      addClass(checkbox, 'checked');
      counter++;
    }
  },

  sharedThisPage: function(resp, val) {
    if (val && !hasClass(checkbox, 'checked')) {
      addClass(checkbox, 'checked');
      counter++;
    }
    window.Rpc.callMethod('publish', (val ? 'widgets.like.shared' : 'widgets.like.unshared'), resp.num);
  },

  widgetAuth: function() {
    var screenX = typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft,
      screenY = typeof window.screenY != 'undefined' ? window.screenY : window.screenTop,
      outerWidth = typeof window.outerWidth != 'undefined' ? window.outerWidth : document.body.clientWidth,
      outerHeight = typeof window.outerHeight != 'undefined' ? window.outerHeight : (document.body.clientHeight - 22),
      features = 'width=655,height=479,left=' + parseInt(screenX + ((outerWidth - 655) / 2), 10) + ',top=' + parseInt(screenY + ((outerHeight - 479) / 2.5), 10),
      active = this.active = window.open(location.protocol + '//oauth.vk.com/authorize?client_id=-1&redirect_uri=close.html&display=widget', 'vk_openapi', features);

    function checkWnd() {
      active.closed ? window.gotSession(true) : setTimeout(checkWnd, 1000);
    }
    checkWnd();
  },

  showMore: function() {
    if (cur.loadingMore) return false;
    cur.loadingMore = true;

    ajax.post('widget_like.php', {
      act: 'a_stats_box',
      offset: cur.shown,
      app: cur.aid,
      url: cur.url,
      page: cur.page,
      obj: cur.obj,
      from: cur.from,
      tab: cur.tab || '',
      check_hash: cur.likeCheckHash || ''
    }, {
      onDone: function(rows, shown, more) {
        ge('like_users_cont').appendChild(cf(rows));
        cur.shown = shown;
        more ? show('like_more_link') : hide('like_more_link');
        cur.loadingMore = false;
      },
      showProgress: function() {
        lockButton('like_more_link');
        addClass('like_more_link', 'flat_button_loading');
      },
      hideProgress: function() {
        unlockButton('like_more_link');
        removeClass('like_more_link', 'flat_button_loading');
      }
    });
  },

  switchTab: function(tabName, tabEl) {
    if (cur.loadingTab) return false;
    cur.loadingTab = true;

    ajax.post('widget_like.php', {
      act: 'a_stats_box',
      offset: 0,
      app: cur.aid,
      url: cur.url,
      page: cur.page,
      obj: cur.obj,
      from: cur.from,
      tab: tabName,
      check_hash:
      cur.likeCheckHash || ''
    }, {
      onDone: function(rows, shown, more) {
        var cont = ge('like_users_cont');
        cont.innerHTML = '';
        cont.appendChild(cf(rows))
        cur.shown = shown;
        more ? show('like_more_link') : hide('like_more_link');
        cur.loadingTab = false;
        cur.loadingMore = false;
        tabEl && uiTabs.switchTab(tabEl);
        cur.tab = tabName;
      },
      showProgress: function() {
        var box = curBox();
        box && addClass(box.bodyNode, 'box_loading');
      },
      hideProgress: function() {
        var box = curBox();
        box && removeClass(box.bodyNode, 'box_loading');
      }
    });
  }
}

function resizeWidget() {
  if (!window.Rpc) return;
  if (cur.autoWidth && ge('main')) {
    window.Rpc.callMethod('resizeWidget', Math.round(getSize(ge('main'))[0]), cur.height);
  } else if (ge('like_table')) {
    window.Rpc.callMethod('resize', getSize(ge('like_table'))[1]);
  }
}

function openFullList() {
  Rpc.callMethod('statsBox', 'show');
}

function goAway(url) {
  return true;
}

function gotSession(session_data) {
  setTimeout(function () {
    location.reload();
  }, 1000);
  location.href = location.href + '&1';
}

function showCaptchaBox(sid, dif, box, o) {
  var difficulty = intval(dif) ? '' : '&s=1',
    imgSrc = o.imgSrc || '/captcha.php?sid=' + sid + difficulty;
  window.Rpc.callMethod('showBox', '/al_apps.php?' + ajx2q({
    act: 'show_captcha_box',
    sid: sid,
    src: imgSrc,
    need_mobile: window.need_mobile_act == 1 ? 1 : 0,
    widget: 1,
    widget_width: 322
  }), {
    height: window.outerHeight || screen.availHeight || 768,
    width: window.outerWidth || screen.availWidth || 1028,
    base_domain: '//' + location.hostname + '/'
  });
  window.onCaptcha = o.onSubmit;
  window.onCaptchaHide = o.onHide;
}

/* Copy of al/common.js, but without val() */
function animateCount (el, newCount, opts) {
  el = ge(el);
  opts = opts || {};

  if (opts.str) {
    newCount = trim((newCount || '').toString()) || '';
  } else {
    newCount = positive(newCount);
  }
  if (!el) return;
  if (browser.msie6 || browser.mobile && !browser.safari_mobile && !browser.android) {
    el.innerHTML = newCount || '';
    return;
  }

  var curCount = data(el, 'curCount'),
      nextCount = data(el, 'nextCount');

  if (typeof nextCount == 'number' || opts.str && typeof nextCount == 'string') {
    if (newCount != nextCount) {
      data(el, 'nextCount', newCount);
    }
    return;
  }
  if (typeof curCount == 'number' || opts.str && typeof curCount == 'string') {
    if (newCount != curCount) {
      data(el, 'nextCount', newCount);
    }
    return;
  }
  curCount = el.innerHTML;
  if (opts.str) {
    curCount = trim(el.innerHTML.toString()) || '';
  } else {
    curCount = positive(el.innerHTML);
  }
  if (curCount == newCount) {
    return;
  }
  data(el, 'curCount', newCount);
  var incr = opts.str ? curCount.length < newCount.length : curCount < newCount,
      big = (incr ? newCount : curCount).toString(),
      small = (incr ? curCount : newCount).toString(),
      constPart = [],
      constEndPart = [],
      bigPart = '',
      smallPart = '',
      i, l, j;

  if (!opts.str) {
    small = ((new Array(big.length - small.length + 1)).join('0')) + small;
  }
  for (i = 0, l = big.length; i < l; i++) {
    if ((j = big.charAt(i)) !== small.charAt(i)) {
      break;
    }
    constPart.push(j);
  }
  bigPart = big.substr(i);
  smallPart = small.substr(i);

  if (opts.str && !opts.leftOnly) {
    for (i = bigPart.length; i > 0; i--) {
      if ((j = bigPart.charAt(i)) !== smallPart.charAt(i)) {
        break;
      }
      constEndPart.unshift(j);
    }
    if (constEndPart.length) {
      bigPart = bigPart.substr(0, i + 1);
      smallPart = smallPart.substr(0, i + 1);
    }
  }

  constPart = constPart.join('').replace(/\s$/, '&nbsp;');
  constEndPart = constEndPart.join('').replace(/^\s/, '&nbsp;');

  if (!trim(el.innerHTML)) {
    el.innerHTML = '&nbsp;';
  }
  var h = el.clientHeight || el.offsetHeight;
  el.innerHTML = '<div class="counter_wrap inl_bl"></div>';
  var wrapEl = el.firstChild,
      animwrapEl, animEl,
      vert = true;

  if (constPart.length) {
    wrapEl.appendChild(ce('div', {className: 'counter_const inl_bl', innerHTML: constPart}));
  }
  if (!constPart.length) {
    smallPart = smallPart.replace(/^0+/, '');
  }
  if (!smallPart || smallPart == '0') {
    smallPart = '&nbsp;';
    vert = constPart.length ? true : false;
  }

  wrapEl.appendChild(animwrapEl = ce('div', {className: 'counter_anim_wrap inl_bl'}));
  animwrapEl.appendChild(animEl = ce('div', {
    className: 'counter_anim ' + (incr ? 'counter_anim_inc' : 'counter_anim_dec'),
    innerHTML: '<div class="counter_anim_big"><span class="counter_anim_big_c">' + bigPart + '</span></div>' +
               (vert ? '<div class="counter_anim_small"><span class="counter_anim_small_c">' + smallPart + '</span></div>' : '')
  }, vert ? {marginTop: incr ? -h : 0} : {right: 'auto', left: 0}));
  if (opts.str) {
    setStyle(animEl, {textAlign: 'left', right: 'auto', left: 0});
  }

  var bigW = geByClass1('counter_anim_big_c', animEl, 'span').offsetWidth,
      smallW = vert ? (smallPart == '&nbsp;' ? bigW : geByClass1('counter_anim_small_c', animEl, 'span').offsetWidth) : 0;

  if (constEndPart.length) {
    wrapEl.appendChild(ce('div', {className: 'counter_const inl_bl', innerHTML: constEndPart}));
  }

  if (browser.csstransitions === undefined) {
    var b = browser, bv = floatval(b.version);
    browser.csstransitions =
      (b.chrome && bv >= 9.0) ||
     (b.mozilla && bv >= 4.0) ||
     (b.opera && bv >= 10.5) ||
     (b.safari && bv >= 3.2) ||
     (b.safari_mobile) ||
     (b.android);
  }
  var css3 = browser.csstransitions;
  setStyle(animwrapEl, {width: incr ? smallW : bigW});
  // return debugLog(css3, incr, curCount, newCount, animwrapEl, animEl, geByClass1('counter_anim_big_c', animEl, 'span'), geByClass1('counter_anim_small_c', animEl, 'span'), h, bigW, smallW);
  var onDone = function () {
    el.innerHTML = newCount || ' ';
    var next = data(el, 'nextCount');
    data(el, 'curCount', false);
    data(el, 'nextCount', false);
    if (typeof next == 'number' || opts.str && typeof next == 'string') {
      setTimeout(animateCount.pbind(el, next, opts), 0);
    }
    opts.onDone && opts.onDone();
  }, margin = vert ? {marginTop: incr ? 0 : -h} : {marginRight: incr ? -smallW : 0};
  if (css3) {
    getStyle(animwrapEl, 'width');
    addClass(animwrapEl, 'counter_css_anim_wrap');
    if (bigW != smallW) {
      setStyle(animwrapEl, {width: incr ? bigW : smallW});
    }
    if (vert) setStyle(animEl, margin);
    setTimeout(onDone, 300);
  } else {
    if (bigW != smallW) {
      animate(animwrapEl, {width: incr ? bigW : smallW}, {duration: 100});
    }
    if (vert) {
      animate(animEl, margin, {duration: 300, transition: Fx.Transitions.easeOutCirc, onComplete: onDone});
    } else {
      setTimeout(onDone, 300);
    }
  }
}

try{stManager.done('api/widgets/al_like.js');}catch(e){}

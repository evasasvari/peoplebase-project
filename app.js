/* ============================================================================
   HR Platform — shared app shell (sidebar + top header), cross-page navigation
   and snackbar helper. One source of truth so every page stays consistent.
   Each page sets <body data-page="employees"> to mark the active nav item.
   ============================================================================ */
(function () {
  /* Apply the persisted theme as early as possible so dark mode survives
     navigation between pages until the user changes it again. */
  try {
    var _theme = localStorage.getItem('pb-theme');
    if (_theme) document.documentElement.setAttribute('data-theme', _theme);
  } catch (e) {}

  var S = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

  var icons = {
    dashboard: '<svg ' + S + '><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
    employees: '<svg ' + S + '><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    timeoff: '<svg ' + S + '><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    reports: '<svg ' + S + '><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>',
    settings: '<svg ' + S + '><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    bell: '<svg ' + S + '><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    search: '<svg class="search__icon" ' + S + '><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    chevron: '<svg width="16" height="16" ' + S + '><polyline points="6 9 12 15 18 9"/></svg>',
    check: '<svg ' + S + '><polyline points="20 6 9 17 4 12"/></svg>',
    info: '<svg ' + S + '><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    alert: '<svg ' + S + '><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    x: '<svg ' + S + '><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
  };

  var nav = [
    { page: 'dashboard', label: 'Dashboard', href: 'index.html', icon: icons.dashboard },
    { page: 'employees', label: 'Employees', href: 'employees.html', icon: icons.employees },
    { page: 'time-off', label: 'Time Off', href: 'time-off.html', icon: icons.timeoff, badge: '7' },
    { page: 'reports', label: 'Reports', href: 'reports.html', icon: icons.reports },
    { page: 'settings', label: 'Settings', href: 'settings.html', icon: icons.settings }
  ];

  var current = document.body.getAttribute('data-page') || 'dashboard';

  /* ---- Sidebar ---- */
  var sidebar = document.getElementById('app-sidebar');
  if (sidebar) {
    var items = nav.map(function (n) {
      var active = n.page === current ? ' navitem--active' : '';
      var aria = n.page === current ? ' aria-current="page"' : '';
      var badge = n.badge ? '<span class="badge badge--notification navitem__badge">' + n.badge + '</span>' : '';
      return '<a href="' + n.href + '" class="navitem' + active + '"' + aria + '>' +
        '<span class="navitem__icon">' + n.icon + '</span><span>' + n.label + '</span>' + badge + '</a>';
    }).join('');

    var logoSvg =
      '<svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M20 2 L35 10.5 V29.5 L20 38 L5 29.5 V10.5 Z" fill="#2f6bff" stroke="#2f6bff" stroke-width="4.5" stroke-linejoin="round"/>' +
        '<rect x="13" y="11.5" width="6" height="18" rx="3" fill="#ffffff"/>' +
        '<circle cx="22" cy="15.5" r="7.5" fill="#ffffff"/>' +
        '<circle cx="22" cy="15.5" r="3.2" fill="#45c8f0"/>' +
      '</svg>';
    sidebar.innerHTML =
      '<div class="brand">' +
        '<div class="brand__logo">' + logoSvg + '</div>' +
        '<div><div class="brand__name"><span style="color:#2f6bff">People</span><span style="color:#56c4ec">base</span></div><div class="brand__sub">HR Management</div></div>' +
      '</div>' +
      '<nav class="nav" aria-label="Main navigation"><span class="nav__section">Menu</span>' + items + '</nav>' +
      '<div class="sidebar__spacer"></div>' +
      '<div class="sidebar__user avatar-label">' +
        '<span class="avatar avatar--md avatar--a1">OR</span>' +
        '<div style="min-width:0"><div class="avatar-label__name">Olivia Rhye</div><div class="avatar-label__meta">HR Manager</div></div>' +
      '</div>';
  }

  /* ---- Top header ---- */
  var topbar = document.getElementById('app-topbar');
  if (topbar) {
    topbar.innerHTML =
      '<label class="search">' + icons.search +
        '<input type="search" placeholder="Search employees, requests…" aria-label="Search" /></label>' +
      '<div class="topbar__spacer"></div>' +
      '<div class="topbar__actions">' +
        '<button class="notification-bell" aria-label="Notifications, 3 unread">' + icons.bell +
          '<span class="notif-badge">3</span></button>' +
        '<div class="divider-v"></div>' +
        '<button class="avatar-label" style="background:none;border:none;cursor:pointer;padding:2px 4px;">' +
          '<span class="avatar avatar--md avatar--a1">OR</span>' +
          '<span style="text-align:left"><span class="avatar-label__name" style="display:block">Olivia Rhye</span>' +
          '<span class="avatar-label__meta">olivia@peoplebase.co</span></span>' + icons.chevron +
        '</button>' +
      '</div>';

    var _bell = topbar.querySelector('.notification-bell');
    if (_bell) _bell.addEventListener('click', function () { window.showSnackbar({ status: 'default', title: 'Notifications', text: 'Notifications are a placeholder in this MVP.' }); });
    var _prof = topbar.querySelector('.topbar__actions .avatar-label');
    if (_prof) _prof.addEventListener('click', function () { window.showSnackbar({ status: 'default', title: 'Profile menu', text: 'The profile menu is a placeholder in this MVP.' }); });
  }

  /* ---- Placeholder feedback for non-functional controls (MVP) ---- */
  document.addEventListener('click', function (e) {
    var pb = e.target.closest('.page-btn');
    if (pb && !pb.disabled && !pb.classList.contains('page-btn--active')) {
      window.showSnackbar({ status: 'default', title: 'Pagination', text: 'Pagination is a placeholder in this MVP.' });
    }
    var kl = e.target.closest('.kpi__link');
    if (kl) {
      e.preventDefault(); e.stopPropagation();
      window.showSnackbar({ status: 'default', title: 'Detailed view', text: 'This drill-down is a placeholder in this MVP.' });
    }
  });

  /* ---- Generic tab bar selection (filter/range tabs that don't switch panels) ---- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('.tabbar .tabitem');
    if (!t || t.disabled || t.hasAttribute('data-tab')) return; // panel tabs manage themselves
    var bar = t.closest('.tabbar');
    bar.querySelectorAll('.tabitem').forEach(function (x) { x.classList.remove('tabitem--selected'); x.setAttribute('aria-selected', 'false'); });
    t.classList.add('tabitem--selected'); t.setAttribute('aria-selected', 'true');
    bar.dispatchEvent(new CustomEvent('tabchange', { detail: { label: t.textContent.trim() }, bubbles: true }));
  });

  /* ---- Cross-page navigation via [data-nav] ---- */
  var navMap = {
    'dashboard': 'index.html', 'employees': 'employees.html', 'employee': 'employee-details.html',
    'time-off': 'time-off.html', 'reports': 'reports.html', 'settings': 'settings.html'
  };
  function go(el) {
    var dest = navMap[el.getAttribute('data-nav')];
    if (dest) window.location.href = dest;
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-nav]');
    if (t && !e.target.closest('a,button,input,select,label')) go(t);
    else if (t && t.matches('[data-nav]') && (t.tagName === 'A')) { /* native anchor handles it */ }
  });
  document.querySelectorAll('[data-nav][tabindex],[data-nav][role="link"],[data-nav][role="button"]').forEach(function (el) {
    el.addEventListener('click', function () { go(el); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(el); }
    });
  });

  /* ---- Snackbar (transient feedback) ---- */
  window.showSnackbar = function (opts) {
    opts = opts || {};
    var status = opts.status || 'success';
    var iconMap = { success: icons.check, error: icons.alert, warning: icons.alert, accent: icons.info, default: icons.info };
    var host = document.querySelector('.snackbar-host');
    if (!host) { host = document.createElement('div'); host.className = 'snackbar-host'; document.body.appendChild(host); }
    var el = document.createElement('div');
    el.className = 'snackbar snackbar--' + status;
    el.setAttribute('role', 'status');
    el.innerHTML =
      '<span class="snackbar__icon">' + (iconMap[status] || iconMap.default) + '</span>' +
      '<div class="snackbar__body"><div class="snackbar__title">' + (opts.title || 'Done') + '</div>' +
      (opts.text ? '<div class="snackbar__text">' + opts.text + '</div>' : '') + '</div>' +
      '<button class="snackbar__close" aria-label="Dismiss">' + icons.x + '</button>' +
      '<div class="snackbar__progress"></div>';
    host.appendChild(el);
    var remove = function () { el.classList.add('snackbar--leaving'); setTimeout(function () { el.remove(); }, 180); };
    el.querySelector('.snackbar__close').addEventListener('click', remove);
    var dur = opts.duration || 3600;
    el.querySelector('.snackbar__progress').style.animationDuration = dur + 'ms';
    setTimeout(remove, dur);
  };

  window.APP_ICONS = icons;
})();

export const CLOAK_PRESETS = {
  none: {
    name: 'Default (Nexus Arcade)',
    title: 'Nexus Unblocked Games',
    icon: '/favicon.ico'
  },
  'google-docs': {
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
  },
  'google-classroom': {
    name: 'Google Classroom',
    title: 'Classes - Google Classroom',
    icon: 'https://ssl.gstatic.com/classroom/favicon.png'
  },
  'google-drive': {
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    icon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png'
  },
  wikipedia: {
    name: 'Wikipedia',
    title: 'Wikipedia, the free encyclopedia',
    icon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico'
  },
  canvas: {
    name: 'Canvas LMS',
    title: 'Dashboard - Canvas',
    icon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico'
  },
  desmos: {
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    icon: 'https://www.desmos.com/favicon.ico'
  }
};

export function applyCloak(presetKey) {
  const preset = CLOAK_PRESETS[presetKey] || CLOAK_PRESETS.none;
  document.title = preset.title;

  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = preset.icon;
  localStorage.setItem('nexus_cloak_preset', presetKey);
}

export function openInAboutBlank(gameTitle, iframeCode) {
  const win = window.open('about:blank', '_blank');
  if (!win) {
    alert('Popup blocked! Please allow popups for about:blank stealth mode.');
    return;
  }
  win.document.title = 'Classes';
  win.document.body.style.margin = '0';
  win.document.body.style.height = '100vh';
  win.document.body.style.overflow = 'hidden';
  win.document.body.style.background = '#0d1117';

  // Inject game
  const wrapper = win.document.createElement('div');
  wrapper.style.width = '100vw';
  wrapper.style.height = '100vh';
  wrapper.innerHTML = iframeCode;

  const iframe = wrapper.querySelector('iframe');
  if (iframe) {
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
  }
  win.document.body.appendChild(wrapper);
}

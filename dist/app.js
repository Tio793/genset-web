const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  nav.classList.toggle('open', expanded);
});
nav.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    menu.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  }),
);
const tabs = Array.from(document.querySelectorAll('[role=tab]'));
function activate(tab) {
  tabs.forEach((t) => {
    const active = t === tab;
    t.setAttribute('aria-selected', String(active));
    t.tabIndex = active ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !active;
  });
}
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => activate(tab));
  tab.addEventListener('keydown', (e) => {
    let index;
    if (e.key === 'ArrowRight') index = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft') index = (i + tabs.length - 1) % tabs.length;
    if (e.key === 'Home') index = 0;
    if (e.key === 'End') index = tabs.length - 1;
    if (index !== undefined) {
      e.preventDefault();
      activate(tabs[index]);
      tabs[index].focus();
    }
  });
});
const form = document.getElementById('inquiry');
const intent = form.elements.intent;
function updateIntent() {
  document.querySelectorAll('.rental-field').forEach((label) => {
    label.hidden = intent.value !== 'Sewa';
    label.querySelector('input').required = intent.value === 'Sewa';
  });
  document.getElementById('form-result').hidden = true;
}
intent.addEventListener('change', updateIntent);
document.querySelectorAll('[data-intent]').forEach((a) =>
  a.addEventListener('click', () => {
    intent.value = a.dataset.intent;
    updateIntent();
  }),
);
const today = new Date();
form.elements.start.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const d = Object.fromEntries(new FormData(form));
  const lines = [
    `Permintaan ${d.intent} — Supermarket Genset`,
    `Nama: ${d.name.trim()}`,
    `WhatsApp: ${d.phone.trim()}`,
    `Perusahaan: ${d.company.trim() || '-'}`,
    `Lokasi: ${d.location.trim()}`,
    `Kapasitas: ${d.capacity}`,
  ];
  if (d.intent === 'Sewa')
    lines.push(`Tanggal mulai: ${d.start}`, `Durasi: ${d.duration.trim()}`);
  lines.push(`Catatan: ${d.notes.trim() || '-'}`);
  const body = lines.join('\n');
  document.getElementById('summary').value = body;
  document.getElementById('form-result').hidden = false;
  document.getElementById('copy').textContent = 'Salin ringkasan';
  window.location.href = `mailto:sales@supermarketgenset.com?subject=${encodeURIComponent(`Permintaan ${d.intent} — ${d.name}`)}&body=${encodeURIComponent(body)}`;
});
document.getElementById('copy').addEventListener('click', async (e) => {
  try {
    await navigator.clipboard.writeText(
      document.getElementById('summary').value,
    );
    e.target.textContent = 'Ringkasan tersalin';
  } catch {
    document.getElementById('summary').select();
    e.target.textContent = 'Pilih teks lalu salin';
  }
});
updateIntent();

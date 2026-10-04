/*!
 * Universal Signatures — embeddable verification badge.
 * https://github.com/universal-simulation-ltd/Universal_Signatures (AGPL-3.0-or-later)
 *
 * Paste where the badge should appear:
 *
 *   <a class="unisim-sig-badge" data-cert="<certificate id>"
 *      href="https://opensource.unisim.co.uk/signatures/verify/<certificate id>">Verify this signature</a>
 *   <script async src="https://opensource.unisim.co.uk/signatures/badge.js"></script>
 *
 * The script looks the certificate up LIVE, from the visitor's browser, through
 * the same public functions the certificate page uses, and only then shows
 * "✓ Signed and verified". A certificate that doesn't exist (or was removed)
 * shows "Not verified"; if the lookup can't be made the link is left as it is.
 * Without JavaScript the plain link still goes to the certificate page.
 *
 * Nothing about the signer is shown on the host page — not their email, not
 * the document name — only the date. Whoever clicks through sees the full
 * record. The badge draws inside a shadow root, so the host page's CSS can't
 * restyle it and its CSS can't leak out.
 *
 * Self-hosting: point SUPABASE_URL / ANON_KEY at your own project.
 */
(function () {
  'use strict'

  var SUPABASE_URL = 'https://rygfxgalojojppxmhddo.supabase.co'
  // The suite's public (anon) key — the same one the app ships. Row Level
  // Security, not this key, is the boundary; the functions called below are the
  // read-only SECURITY DEFINER lookups the certificate page uses.
  var ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Z2Z4Z2Fsb2pvanBweG1oZGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NTY4MjUsImV4cCI6MjA5NDMzMjgyNX0.hLy_vt9vY_rdPKF3nL32yAuMCD604E3CH5VM7D7CaNE'
  var CERT_RE = /^[0-9a-f]{32}$/i

  // English, plus the languages the app speaks. Picked from the host page's
  // <html lang>, then the browser's.
  var TEXT = {
    en: { ok: 'Signed and verified', bad: 'Not verified', by: 'Universal Signatures', checking: 'Checking signature…' },
    fr: { ok: 'Signé et vérifié', bad: 'Non vérifié', by: 'Universal Signatures', checking: 'Vérification de la signature…' },
    es: { ok: 'Firmado y verificado', bad: 'No verificado', by: 'Universal Signatures', checking: 'Comprobando la firma…' },
    it: { ok: 'Firmato e verificato', bad: 'Non verificato', by: 'Universal Signatures', checking: 'Verifica della firma…' },
    de: { ok: 'Unterschrieben und verifiziert', bad: 'Nicht verifiziert', by: 'Universal Signatures', checking: 'Unterschrift wird geprüft…' },
    'pt-BR': { ok: 'Assinado e verificado', bad: 'Não verificado', by: 'Universal Signatures', checking: 'Verificando a assinatura…' },
    'pt-PT': { ok: 'Assinado e verificado', bad: 'Não verificado', by: 'Universal Signatures', checking: 'A verificar a assinatura…' },
    tr: { ok: 'İmzalandı ve doğrulandı', bad: 'Doğrulanmadı', by: 'Universal Signatures', checking: 'İmza kontrol ediliyor…' },
  }

  function lang() {
    var tags = [document.documentElement.getAttribute('lang') || ''].concat(navigator.languages || [navigator.language || ''])
    for (var i = 0; i < tags.length; i++) {
      var t = String(tags[i] || '').replace('_', '-')
      if (!t) continue
      var l = t.toLowerCase()
      if (l === 'pt-br') return 'pt-BR'
      if (l.indexOf('pt') === 0) return 'pt-PT'
      var base = l.split('-')[0]
      if (TEXT[base]) return base
    }
    return 'en'
  }

  function rpc(name, cert) {
    return fetch(SUPABASE_URL + '/rest/v1/rpc/' + name, {
      method: 'POST',
      headers: { apikey: ANON_KEY, Authorization: 'Bearer ' + ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_cert: cert }),
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status)
      return r.json()
    })
  }

  // → { when: ISO date } for a genuine record, null for none. Throws when the
  // lookup itself failed, which is NOT the same as "no such certificate".
  function lookup(cert) {
    return rpc('verify_signing_event_cert', cert).then(function (rows) {
      var row = Array.isArray(rows) ? rows[0] : rows
      if (row && row.created_at) return { when: row.created_at }
      // A document sent to someone to sign: verified once it's fully signed.
      return rpc('verify_pdf_sign_cert', cert).then(function (c) {
        if (c && c.ok && c.status === 'completed') {
          var signedAt = null
          ;(c.parties || []).forEach(function (p) { if (p.signed_at && (!signedAt || p.signed_at > signedAt)) signedAt = p.signed_at })
          return { when: signedAt || c.created_at }
        }
        if (c && c.ok) return null
        // A saved signature's certificate.
        return rpc('verify_signature_cert', cert).then(function (rows2) {
          var r2 = Array.isArray(rows2) ? rows2[0] : rows2
          return r2 && r2.created_at ? { when: r2.created_at } : null
        })
      })
    })
  }

  var CSS =
    ':host{all:initial;display:inline-block;vertical-align:middle}' +
    'a{display:inline-flex;align-items:center;gap:8px;padding:6px 12px 6px 8px;border-radius:999px;' +
    'font:600 13px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
    'text-decoration:none;border:1px solid;transition:box-shadow .15s}' +
    'a:hover{box-shadow:0 1px 6px rgba(15,23,42,.15)}' +
    'a:focus-visible{outline:2px solid #ea580c;outline-offset:2px}' +
    '.ok{background:#ecfdf5;border-color:#a7f3d0;color:#065f46}' +
    '.bad{background:#fff1f2;border-color:#fecdd3;color:#9f1239}' +
    '.wait{background:#f8fafc;border-color:#e2e8f0;color:#475569}' +
    '.dot{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:999px;font-size:12px;color:#fff;flex:none}' +
    '.ok .dot{background:#059669}.bad .dot{background:#e11d48}.wait .dot{background:#94a3b8}' +
    '.txt{display:flex;flex-direction:column}' +
    '.sub{font-weight:500;font-size:11px;opacity:.8;margin-top:2px}'

  function render(host, href, kind, title, sub) {
    var root = host.__unisimRoot
    if (!root) {
      root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : null
      host.__unisimRoot = root
    }
    if (!root) return false
    root.innerHTML = ''
    var style = document.createElement('style')
    style.textContent = CSS
    var a = document.createElement('a')
    a.href = href
    a.target = '_blank'
    a.rel = 'noopener'
    a.className = kind
    var dot = document.createElement('span')
    dot.className = 'dot'
    dot.setAttribute('aria-hidden', 'true')
    dot.textContent = kind === 'ok' ? '✓' : kind === 'bad' ? '✕' : '…'
    var txt = document.createElement('span')
    txt.className = 'txt'
    var t1 = document.createElement('span')
    t1.textContent = title
    txt.appendChild(t1)
    if (sub) {
      var t2 = document.createElement('span')
      t2.className = 'sub'
      t2.textContent = sub
      txt.appendChild(t2)
    }
    a.appendChild(dot)
    a.appendChild(txt)
    root.appendChild(style)
    root.appendChild(a)
    return true
  }

  function upgrade(link) {
    if (link.__unisimBadge) return
    link.__unisimBadge = true
    var cert = String(link.getAttribute('data-cert') || '').trim()
    if (!CERT_RE.test(cert)) return
    var href = link.getAttribute('href') || ''
    // Only ever link to a certificate page, whatever the host page put in href.
    var m = /^https:\/\/[^/?#]+\/(?:[^?#]*\/)?verify\/([0-9a-f]{32})$/i.exec(href)
    if (!m || m[1].toLowerCase() !== cert.toLowerCase()) {
      href = 'https://opensource.unisim.co.uk/signatures/verify/' + cert
    }
    var T = TEXT[lang()]
    // The shadow root's host: <a> can't host one. A custom element name, not a
    // <span>, so the host page's own `span { … }` rules don't reach it, and an
    // inline reset for anything that targets it anyway.
    var host = document.createElement('unisim-signature-badge')
    host.style.cssText = 'all:initial;display:inline-block;vertical-align:middle'
    host.setAttribute('data-unisim-sig-badge', cert)
    if (!render(host, href, 'wait', T.checking, '')) return
    link.parentNode.insertBefore(host, link)
    link.style.display = 'none'
    lookup(cert.toLowerCase()).then(
      function (rec) {
        if (rec) {
          var d = new Date(rec.when)
          var when = isNaN(d.getTime()) ? '' : d.toLocaleDateString(lang() === 'en' ? undefined : lang(), { day: 'numeric', month: 'short', year: 'numeric' })
          render(host, href, 'ok', T.ok, T.by + (when ? ' · ' + when : ''))
        } else {
          render(host, href, 'bad', T.bad, T.by)
        }
      },
      function () {
        // Couldn't check — leave the plain link rather than claim either way.
        host.parentNode && host.parentNode.removeChild(host)
        link.style.display = ''
      },
    )
  }

  function scan() {
    var links = document.querySelectorAll('a.unisim-sig-badge[data-cert]')
    for (var i = 0; i < links.length; i++) upgrade(links[i])
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan)
  else scan()
  // For pages that add badges later (single-page apps).
  window.UnisimSignatureBadges = { scan: scan }
})()

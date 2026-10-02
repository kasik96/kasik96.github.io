# kasemartin.cz

Personal site and résumé of Martin Kaše. Static HTML and CSS with no framework,
no bundler and no dependencies.

```
index.html    all the content — every word is in the markup
styles.css    tokens, layout, and the print stylesheet the résumé PDF comes from
main.js       progressive enhancement only; the page works fully without it
assets/       avatar, favicons, résumé PDF
scripts/      favicon generation
```

## Running it

```sh
npm run dev     # serves on http://localhost:3000
npm run build   # assembles dist/ (what CI deploys)
```

There is nothing to install. `npm run build` is a file copy.

## What needs JavaScript

Nothing, for reading the page. `main.js` only adds:

- the ticking clock in the header (without it, a static availability line shows)
- the online/offline badge (hidden without it)
- the light/dark toggle (without it, the theme follows `prefers-color-scheme`)
- copy-to-clipboard on the email pill (without it, it stays a `mailto:` link)

Hover-to-expand on the list rows, the badges, and both themes are pure CSS.
Touch devices, which have no hover, get the expanded detail by default.

## The résumé PDF

There is no PDF in the repo right now, and nothing on the page links to one. The
print stylesheet in `styles.css` is finished and waiting, so producing one is:

1. `npm run dev`, then open <http://localhost:3000>
2. `Cmd-P` → Destination **Save as PDF**
3. Margins **Default**, **Background graphics ON** (this keeps the coloured pills)
4. Save as `assets/martin-kase-resume.pdf`

Then add the pill back to the contact row in `index.html`:

```html
<a class="pill" href="/assets/martin-kase-resume.pdf" download>
  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></svg>
  Résumé
</a>
```

The `@media print` block handles the rest: it forces the light palette, drops the
toggle and status badge, expands every hover detail, and prints the static
availability line instead of a clock frozen mid-second.

## Favicons

`npm run icons` re-renders every icon size from the 👨🏻‍💻 emoji using the system
emoji font, then wraps the 32px one in an `.ico` container. Change the `emoji`
constant at the top of `scripts/make-favicons.swift` to swap it.

## Deploying

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds `dist/`
and rsyncs it over SSH to the Rosti app at `/srv/app/public`
(kasemartin-9353.rostiapp.cz). On the server, nginx serves that directory
directly (`/srv/conf/nginx.d/app.conf`); the stock Node process is disabled.

The workflow needs two repository secrets: `ROSTI_SSH_KEY` (private key whose
public half is in `/srv/.ssh/authorized_keys`) and `ROSTI_KNOWN_HOSTS`
(`ssh-keyscan -p 13452 ssh.rosti.cz`).

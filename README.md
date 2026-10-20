# kasemartin.cz

Personal site of Martin Kaše. One typed data file, rendered at build time into a
human page and a set of machine-readable endpoints, so they can never drift apart.

```
src/data/profile.ts    all content: person, facts, work, projects, stack, education
src/render/html.ts     the page (human view + pre-rendered machine view)
src/render/markdown.ts llms.txt, llms-full.txt, cv.md
src/render/jsonld.ts   schema.org ProfilePage / Person / projects graph
src/build.ts           writes dist/, plus robots.txt and sitemap.xml
src/styles.css         inlined into <head> at build time
src/enhance.js         progressive enhancement only
scripts/serve.ts       local preview with production content types
assets/                avatar, self-hosted Geist fonts, favicons
```

## Running it

Needs Node 24+ (it runs the TypeScript directly; nothing to compile).

```sh
npm install         # only TypeScript + @types/node, for the typecheck
npm run build       # → dist/
npm run preview     # serves dist/ on http://localhost:3000
npm run dev         # both
npm run typecheck
```

To change anything on the site, edit `src/data/profile.ts` and rebuild.

## What gets generated

| Path              | Content type                         |                                   |
| ----------------- | ------------------------------------ | --------------------------------- |
| `/`               | `text/html`                          | the page, JSON-LD inlined         |
| `/llms.txt`       | `text/markdown; charset=utf-8`       | llmstxt.org format, concise       |
| `/llms-full.txt`  | `text/markdown; charset=utf-8`       | everything, full descriptions     |
| `/profile.jsonld` | `application/ld+json`                | same graph as the inline JSON-LD  |
| `/cv.md`          | `text/markdown; charset=utf-8`       | markdown CV                       |
| `/sitemap.xml`    | `application/xml`                    |                                   |
| `/robots.txt`     | `text/plain`                         | allows all, AI crawlers by name   |

## What needs JavaScript

Nothing, for reading. `enhance.js` only:

- swaps the human / machine view in place and mirrors it in `?view=machine`
  (without JS, "machine" is a plain link to `/llms.txt`)
- dims the presence dots outside 08:00–16:00 Europe/Prague

## Hosting (Rosti nginx)

Pushing to `master` runs `.github/workflows/deploy.yml`: typecheck, build, then
rsync `dist/` over SSH to `/srv/app/public` on the Rosti app. nginx serves that
directory directly (`/srv/conf/nginx.d/app.conf`).

The `server` block in `app.conf` needs these additions for the endpoints to be
served with the right types, compressed and cached:

```nginx
# Machine-readable endpoints
location ~ ^/llms(-full)?\.txt$ {
    default_type text/markdown;
    types { }
    charset utf-8;
    add_header Cache-Control "public, max-age=3600";
}
location = /cv.md {
    default_type text/markdown;
    types { }
    charset utf-8;
    add_header Cache-Control "public, max-age=3600";
}
location = /profile.jsonld {
    default_type application/ld+json;
    types { }
    charset utf-8;
    add_header Cache-Control "public, max-age=3600";
}

# Fonts never change in place; images might, so a week
location /assets/fonts/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}
location /assets/ {
    add_header Cache-Control "public, max-age=604800";
}

gzip on;
gzip_types text/css text/javascript application/javascript text/markdown
           application/ld+json application/xml text/plain image/svg+xml;
charset utf-8;
charset_types text/html text/plain text/css text/markdown application/ld+json application/xml;
```

Then `supervisorctl signal HUP nginx`. Check with
`curl -sI https://kasemartin.cz/llms.txt | grep -i content-type`.

The workflow needs two repository secrets: `ROSTI_SSH_KEY` (private key whose
public half is in `/srv/.ssh/authorized_keys`) and `ROSTI_KNOWN_HOSTS`
(`ssh-keyscan -p 13452 ssh.rosti.cz`).

## Favicons

`npm run icons` re-renders every icon size from the 👨🏻‍💻 emoji using the system
emoji font, then wraps the 32px one in an `.ico` container. Change the `emoji`
constant at the top of `scripts/make-favicons.swift` to swap it.

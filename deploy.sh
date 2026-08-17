#!/usr/bin/env bash
# Build on this Mac, ship dist/ to the server. Run from the repo root.
#
# The server cannot build this site — the subscription chroot has no node, no
# npm and no git — so the build happens here and only the finished files travel.
# Same shape as daili-web/deploy.sh, and for the same reasons.
#
# NOTE: Plesk's git deployment for this domain is set to MANUAL on purpose
# (`plesk ext git --info -domain daili.app -name daili.git`). It used to be
# `auto`, which checked the repo root out into httpdocs on every push — that
# would overwrite everything rsync puts there. If a future push ever mysteriously
# reverts the live site, that setting is the first thing to check.
set -euo pipefail

HOST=root@46.252.196.20
# Verified against the generated vhost config, not assumed:
#   grep -im1 DocumentRoot /var/www/vhosts/system/daili.app/conf/httpd.conf
# The apex domain has an httpdocs level; the app.daili.app subdomain does not.
DOC=/var/www/vhosts/daili.app/httpdocs
OWNER=daili.app_ntw9dsdjnu:psacln

cd "$(dirname "$0")"

echo "==> build (content check -> build -> output check)"
npm run build

# A build that silently skipped the static copy would deploy a site with no
# redirects, no cache headers and no sitemap, and nothing would say so.
for required in dist/.htaccess dist/sitemap.xml dist/robots.txt dist/index.html dist/404.html; do
  test -f "$required" || { echo "$required missing — the build is wrong"; exit 1; }
done

echo "==> keep the current build as the rollback copy"
# The docroot must already exist: Plesk created it with the ownership Plesk
# expects. rsync would happily create it with the wrong owner and earn us a 403,
# so stop instead.
ssh "$HOST" "test -d $DOC || { echo 'docroot $DOC does not exist'; exit 1; }
             rm -rf $DOC.prev && cp -a $DOC $DOC.prev"

echo "==> upload"
# -rltz, not -a: -a implies -o -g, and the receiving side is root, so every file
# would be stamped with this Mac's uid 501. Content, symlinks and times only;
# the chown below sets the ownership Plesk expects.
rsync -rltz --delete dist/ "$HOST:$DOC/"

echo "==> ownership"
# -mindepth 1 chowns everything INSIDE the document root and never the document
# root itself, which must stay …:psaserv 750 or Apache returns 403.
ssh "$HOST" "find $DOC -mindepth 1 -exec chown $OWNER {} +"

echo "==> smoke"
fail=0
check() { # check <path> <expected-code> [label]
  local code
  code=$(curl -sS -o /dev/null -w '%{http_code}' "https://daili.app$1")
  if [ "$code" != "$2" ]; then
    printf '  FAIL %-34s got %s, want %s %s\n' "$1" "$code" "$2" "${3:-}"
    fail=1
  fi
}

# Every built locale, derived from the config so this list can never fall behind.
for path in $(node -e '
  import("./site.config.mjs").then(c => {
    const out = [];
    for (const loc of c.LOCALES) {
      out.push(c.dirFor(loc));
      out.push(loc === c.DEFAULT_LOCALE ? "/support.html" : c.dirFor(loc) + "support.html");
    }
    console.log(out.join(" "));
  })'); do
  check "$path" 200
done

check /sitemap.xml 200
check /robots.txt  200
check /terms.html  200
check /nutzungsbedingungen.html 200
check /impressum.html 200

# These three are printed in the live App Store and Play Store listings.
# A failure here is not a broken page, it is a broken store listing.
for u in /privacy.html /datenschutz.html /support.html; do
  check "$u" 200 "<-- STORE LISTING URL"
done

# Legacy paths must redirect, not 404.
check /de.html    301
check /index.html 301
check /en/        301

# A junk path must reach the real 404 page, not Plesk's default.
check /this-does-not-exist 404

# The check that catches the Plesk "serve static files directly by nginx"
# regression: if that toggle is ever switched on, every Header rule dies
# silently and this is the only symptom.
css=$(curl -sS https://daili.app/ | grep -o '/assets/style\.[a-f0-9]*\.css' | head -1)
if [ -n "$css" ]; then
  if ! curl -sSI "https://daili.app$css" | grep -qi 'cache-control'; then
    echo "  FAIL no Cache-Control on $css — nginx is serving static files directly,"
    echo "       so every .htaccess Header rule is dead. Fix in Plesk > Apache & nginx Settings."
    fail=1
  fi
fi

if [ "$fail" != 0 ]; then
  echo "SMOKE FAILED — roll back with:"
  echo "  ssh $HOST \"rm -rf $DOC && cp -a $DOC.prev $DOC\""
  exit 1
fi
echo "==> ok"

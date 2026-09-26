/**
 * The public origin the site is served from.
 *
 * Canonical URLs, Open Graph URLs, the sitemap and robots.txt are all built
 * from this one value, so moving the site to another host is a change here and
 * nowhere else in the build. `SITE_ORIGIN` overrides it for a one-off build.
 */
export const SITE_ORIGIN = (process.env.SITE_ORIGIN || 'https://presentations.ebisuda.net').replace(/\/+$/, '')

export const SITE_NAME = 'Ebisuda Presentations'

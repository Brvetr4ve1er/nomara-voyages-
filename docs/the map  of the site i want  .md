Here's the structural report on **ayabooking.biz**, organized so you can lift the patterns directly into your travel agency project.



## Overview



Aya Booking is a **B2B SaaS platform for travel/tourism agencies** (not a consumer booking site). The entire storyline is built around one message: "we are the toolbox that helps tourism agencies serve their clients and make more profit." Everything on the public site funnels toward one conversion goal — **getting an agency to create an account**. The site is a JavaScript single-page application (client-side routing), which is why there is **no server-side `sitemap.xml` or `robots.txt`** — both return the app's 404 fallback. The "sitemap" is effectively the SPA route table, which I've reconstructed below.



## Site Flow / Storyline Architecture



The narrative is a classic B2B funnel arranged top-to-bottom on the homepage:



The flow goes: **Hero (value proposition with rotating slides)** → **"La Plateforme" intro paragraph (who we are)** → **Services grid (the 6–7 offerings)** → **calls-to-action ("Créer un compte" / "En savoir plus")** → **footer (contact, social, map)**. The hero uses a carousel (Previous/Next slide controls) cycling through three core promises: trusted bus-transport partner, "number one bus transport supplier for agencies," and "your toolbox for all your agency's needs." The repeated **"En savoir plus"** and **"Créer un compte"** buttons keep nudging toward signup. The About page reuses the exact same service descriptions as the homepage — a single source of copy reused across the marketing surface.



Importantly, the **actual service pages are gated behind login**. Visiting `/service/bus` (or any service route) while logged out redirects to `/login`. So the public site sells the concept; the functional booking tools live inside the authenticated app.



## Available Services (the part you liked)



The services are modeled as a clean, parallel set — each with a short benefit-oriented blurb framed around the *agency's* success, not the end traveler:



The catalog consists of **Bus ticket reservation** (individual tickets + whole-bus charter, local and to Tunisia), **Bus rental / Location de Bus** (charter as a distinct product), **Organized trips / Voyages Organisés** (packaged flights + hotels + guide), **Oumra** (pilgrimage packages with Mecca/Medina hotels + guide), **Hotel reservation** (rooms across many countries), **Flight reservation** (multi-airline price comparison), and **Visa** (visa application processing assistance). Note the subtle product modeling choice worth copying: "bus tickets" and "bus rental" are split into two separate services even though both are bus-related — granular service separation makes the nav and the catalog feel richer.



## Route / Sitemap Structure (reconstructed from the SPA)



Since there's no XML sitemap, here is the actual client-side route map, which is what you'd want to mirror:



**Public/marketing routes:** `/` (home), `/about` (with in-page anchors `#intro` and `#services`), `/contact` (with `#online` anchor for live assistance), `/terms` (terms of use), `/login`, `/signup`.



**Service routes (auth-gated):** `/service/bus`, `/service/bus-rent`, `/service/trips`, `/service/umrah`, `/service/hotel`, `/service/flights`, `/service/visa`.



The naming convention is clean and worth emulating: a single `/service/{slug}` namespace with short English slugs, while the UI labels are in French. About-page navigation relies on hash anchors (`/about#services`) rather than separate pages, keeping the marketing content consolidated on one route.



## Patterns Worth Stealing for Your Project



A few architectural decisions that make this site work well as a template: the **single reusable service-description block** shared between home and About reduces copy duplication; the **`/service/{slug}` URL pattern** scales cleanly as you add offerings; **auth-gating the functional pages while keeping marketing/services public** is the right SaaS split; and the **persistent dual CTA** ("learn more" + "create account") on every section keeps the conversion path always one click away. The footer doubles as a contact/trust block (phone, email, physical address in Sétif, social links, Google Maps directions).



## One Caveat



For the XML sitemap specifically — there isn't one to extract here; the site is a client-rendered SPA, so search engines and your reference would rely on the route list above rather than a generated `sitemap.xml`. If a proper XML sitemap is a feature you want for *your* project, that's something you'd generate from your own route definitions (I can help you scaffold one based on a route map like the one above).


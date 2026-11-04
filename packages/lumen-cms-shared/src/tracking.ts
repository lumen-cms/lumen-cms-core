import type { GlobalStoryblok, ScriptStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'
import { serializeJsonLd } from './seo'

export function trackingScripts(settings: Partial<GlobalStoryblok>, options: { production: boolean; preview?: boolean; gtmContainer?: string; googleAnalyticsId?: string; deferLibraries?: boolean }) {
 const scripts: ScriptStoryblok[] = []
 const pixels: string[] = []
 if (!options.production || options.preview) return { scripts, pixels }
 const inline = (id: string, script_body: string) => scripts.push({ component: 'script', _uid: id, id, strategy: 'afterInteractive', script_body })
 if (settings.setup_facebook_pixel) {
  pixels.push(...settings.setup_facebook_pixel.split(',').map(id => id.trim()).filter(Boolean))
  inline('fbq-init', `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];${options.deferLibraries ? '' : 't=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)'}}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
${pixels.map(id => `fbq('init',${serializeJsonLd(id)});`).join('\n')}
fbq('track','PageView');`)
  if (options.deferLibraries) scripts.push({ component: 'script', _uid: 'fbq-library', id: 'fbq-library', strategy: 'lazyOnload', url: 'https://connect.facebook.net/en_US/fbevents.js' })
 }
 if (settings.setup_ad_roll_adv_id && settings.setup_ad_roll_pix_id) inline('adroll-init', `
window.adroll_adv_id=${serializeJsonLd(settings.setup_ad_roll_adv_id)};
window.adroll_pix_id=${serializeJsonLd(settings.setup_ad_roll_pix_id)};
window.adroll_version='2.0';
(function(w,d,e,o,a){w.__adroll_loaded=true;w.adroll=w.adroll||[];w.adroll.f=['setProperties','identify','track'];
var roundtripUrl='https://s.adroll.com/j/'+w.adroll_adv_id+'/roundtrip.js';
for(a=0;a<w.adroll.f.length;a++){w.adroll[w.adroll.f[a]]=w.adroll[w.adroll.f[a]]||(function(n){return function(){w.adroll.push([n,arguments])}})(w.adroll.f[a]);}
${options.deferLibraries ? '' : "e=d.createElement('script');o=d.getElementsByTagName('script')[0];e.async=1;e.src=roundtripUrl;o.parentNode.insertBefore(e,o);"}})(window,document);
adroll.track('pageView');`)
 if (options.deferLibraries && settings.setup_ad_roll_adv_id && settings.setup_ad_roll_pix_id) scripts.push({ component: 'script', _uid: 'adroll-library', id: 'adroll-library', strategy: 'lazyOnload', url: `https://s.adroll.com/j/${encodeURIComponent(settings.setup_ad_roll_adv_id)}/roundtrip.js` })
 const googleAnalyticsId = options.googleAnalyticsId?.trim() || settings.setup_google_analytics?.trim()
 if (googleAnalyticsId) {
  scripts.push({ component: 'script', _uid: 'gtag-library', id: 'gtag-library', strategy: options.deferLibraries ? 'lazyOnload' : 'afterInteractive', url: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAnalyticsId)}` })
  inline('gtag-init', `window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};gtag('js',new Date());gtag('config',${serializeJsonLd(googleAnalyticsId)},{page_path:window.location.pathname});`)
 }
 if (options.deferLibraries && options.gtmContainer) inline('gtm-queue', 'window.dataLayer=window.dataLayer||[];')
 if (options.gtmContainer) inline('googletagmanager', `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+encodeURIComponent(i)+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${serializeJsonLd(options.gtmContainer)});`)
 if (options.deferLibraries) {
  const gtm = scripts.find(script => script.id === 'googletagmanager')
  if (gtm) gtm.strategy = 'lazyOnload'
 }
 return { scripts, pixels }
}

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

// Google's own loader, verbatim: it must come before the consent-managed tags read the dataLayer.
const gtmLoader = (id: string) =>
  `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`;

/**
 * Google Tag Manager container. Render it inside <head> right after the Consent Mode defaults
 * (`consentDefaultScript`): the container itself sets no cookies; the tags inside it only fire
 * according to the consent state. Does nothing when NEXT_PUBLIC_GTM_ID is not set.
 */
export function GoogleTagManager() {
  if (!GTM_ID) return null;
  return <script dangerouslySetInnerHTML={{__html: gtmLoader(GTM_ID)}} />;
}

/** The <noscript> fallback Google asks to place right after the opening <body> tag. */
export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{display: 'none', visibility: 'hidden'}}
        title="Google Tag Manager"
      />
    </noscript>
  );
}

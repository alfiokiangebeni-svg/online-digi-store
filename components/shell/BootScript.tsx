/**
 * Script d'amorçage inline (avant le premier rendu) :
 * applique le thème choisi, la devise et le mode données légères sans clignotement,
 * puis enregistre le service worker en production.
 */
const THEME_AND_LITE = `(function(){try{var d=document.documentElement,l=localStorage.getItem("ds-lite"),c=navigator.connection;if(l==="1"||(l===null&&c&&c.saveData))d.setAttribute("data-lite","");if(localStorage.getItem("ds-currency")==="CDF")d.dataset.currency="CDF";var t=localStorage.getItem("ds-theme");if(t==="light"||t==="dark")d.dataset.theme=t}catch(e){}})();`;

const REGISTER_SW = `if("serviceWorker"in navigator)addEventListener("load",function(){navigator.serviceWorker.register("/sw.js").catch(function(){})});`;

export function BootScript() {
  // Pas de service worker dans l'application Android : les fichiers sont déjà sur le téléphone.
  const withSw = process.env.NODE_ENV === "production" && process.env.BUILD_TARGET !== "apk";
  const code = withSw ? THEME_AND_LITE + REGISTER_SW : THEME_AND_LITE;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

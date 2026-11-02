import { apiInitializer } from "discourse/lib/api";
import { i18n } from "discourse-i18n";

const COOKIE_SETTINGS_HREF = "#cookie-settings";

// Google's CMP renders its floating "Privacy and cookie settings" toolbar in a
// shadow root on an anonymous <body> child whose inline styles reset every
// property with !important, so theme CSS can't hide it. Instead, adopt a
// stylesheet into each shadow root as it is created; adopted sheets also
// survive Google re-rendering the root's contents.
const hideToolbarSheet = new CSSStyleSheet();
hideToolbarSheet.replaceSync(
  "#ft-floating-toolbar { display: none !important; }",
);

function adoptHideToolbarSheet(root) {
  if (!root.adoptedStyleSheets.includes(hideToolbarSheet)) {
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, hideToolbarSheet];
  }
}

function hideGoogleFloatingToolbar() {
  [...document.body.children]
    .map((el) => el.shadowRoot)
    .filter(Boolean)
    .forEach(adoptHideToolbarSheet);

  const attachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (init) {
    const root = attachShadow.call(this, init);
    adoptHideToolbarSheet(root);
    return root;
  };
}

function showGoogleConsentSettings() {
  window.googlefc ??= {};
  window.googlefc.callbackQueue ??= [];
  window.googlefc.callbackQueue.push({
    CONSENT_API_READY: () => window.googlefc.showRevocationMessage(),
  });
}

export default apiInitializer("0.8", (api) => {
  const label = i18n(themePrefix("cookie_settings"));
  const header = api.container.lookup("service:header");

  hideGoogleFloatingToolbar();

  // Any link to #cookie-settings opens the dialog: user menu, sidebar, or a
  // link in a post such as the privacy policy.
  document.addEventListener("click", (event) => {
    if (!event.target.closest?.(`a[href="${COOKIE_SETTINGS_HREF}"]`)) {
      return;
    }
    event.preventDefault();
    header.userVisible = false;
    header.hamburgerVisible = false;
    showGoogleConsentSettings();
  });

  api.addQuickAccessProfileItem({
    className: "cookie-settings",
    href: COOKIE_SETTINGS_HREF,
    icon: "shield-halved",
    content: label,
  });

  // Anonymous visitors have no user menu, so also offer it in the sidebar.
  api.addCommunitySectionLink(
    {
      name: "cookie-settings",
      href: COOKIE_SETTINGS_HREF,
      icon: "shield-halved",
      text: label,
      title: label,
    },
    true,
  );
});

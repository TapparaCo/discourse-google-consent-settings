# Google Consent Settings

Discourse theme component for sites using Google's consent management platform (AdSense / Ad Manager Privacy & messaging).

- Hides Google's floating "Privacy and cookie settings" toolbar that appears after the visitor has answered the consent dialog. The initial consent dialog is not affected.
- Adds a "Cookie settings" link to the user menu and to the sidebar "More" links, so anonymous visitors can reach it too.
- Any link to `#cookie-settings`, for example in the privacy policy, reopens Google's consent dialog via `googlefc.showRevocationMessage()`.

Google requires a consent revocation link that is easy to find. Add a `[Privacy and cookie settings](#cookie-settings)` link to your privacy policy as well.

## How it works

Google renders the toolbar (`#ft-floating-toolbar`) in a shadow root on an anonymous `<body>` child whose inline styles reset every property with `!important`, so it can't be hidden with theme CSS. The component adopts a stylesheet into each shadow root as it is created. If Google renames the toolbar element, the floating button will reappear and the selector needs updating.

## Installation

Admin → Customize → Themes → Install → From a git repository, then add the component to your theme.

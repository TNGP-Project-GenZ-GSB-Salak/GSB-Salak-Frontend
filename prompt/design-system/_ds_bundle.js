/* @ds-bundle: {"format":4,"namespace":"MyMoDesignSystem_0a5510","components":[{"name":"AmountText","sourcePath":"components/core/AmountText.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"MYMO_ICONS","sourcePath":"components/core/Icon.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/core/Icon.jsx"},{"name":"SectionHeader","sourcePath":"components/core/SectionHeader.jsx"},{"name":"Chip","sourcePath":"components/forms/Chip.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"PinDots","sourcePath":"components/forms/PinDots.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"BottomTabBar","sourcePath":"components/navigation/BottomTabBar.jsx"},{"name":"ListRow","sourcePath":"components/navigation/ListRow.jsx"},{"name":"TopBar","sourcePath":"components/navigation/TopBar.jsx"}],"sourceHashes":{"components/core/AmountText.jsx":"8b8f83d89046","components/core/Avatar.jsx":"9a2fd38326da","components/core/Badge.jsx":"7199c58ed19c","components/core/Button.jsx":"d0304a1ead65","components/core/Card.jsx":"205c0adc6cb9","components/core/Icon.jsx":"1a739f767f97","components/core/SectionHeader.jsx":"8f266a777806","components/forms/Chip.jsx":"11beeafaaaa0","components/forms/Input.jsx":"df059d3f5410","components/forms/PinDots.jsx":"68ea8e5c606b","components/forms/Switch.jsx":"a54773c86194","components/navigation/BottomTabBar.jsx":"96cff67f4146","components/navigation/ListRow.jsx":"009cd3f7e9b8","components/navigation/TopBar.jsx":"b72e7c5c8749","flows/activation/app.jsx":"0d6235ce2299","flows/activation/parts.jsx":"d25e689f52aa","flows/activation/screens.jsx":"4d4d89b1d94e","flows/activation/tweaks-panel.jsx":"6591467622ed","ui_kits/mymo_app/data.js":"386b992eeefe","ui_kits/mymo_app/mymo-kit.jsx":"cad5b9f7cb23","ui_kits/mymo_app/screen-accounts.jsx":"dd46fc56220b","ui_kits/mymo_app/screen-home.jsx":"cd6852be025f","ui_kits/mymo_app/screen-login.jsx":"4eccc1e51cd7","ui_kits/mymo_app/screen-more.jsx":"81e4ac51eb07","ui_kits/mymo_app/screen-transfer.jsx":"5493922acc8e"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MyMoDesignSystem_0a5510 = window.MyMoDesignSystem_0a5510 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/AmountText.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MyMo AmountText — formats a Thai Baht amount with brand sign coloring.
 * Positive = green (#4CD964), negative = red (#FF3B30), neutral = ink.
 */
function AmountText({
  value,
  showSign = true,
  currency = "฿",
  size = 16,
  weight = "var(--weight-bold)",
  colored = true,
  style,
  ...rest
}) {
  const n = typeof value === "number" ? value : parseFloat(value) || 0;
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  const abs = Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const color = !colored ? "var(--text-primary)" : n > 0 ? "var(--amount-positive)" : n < 0 ? "var(--amount-negative)" : "var(--text-primary)";
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: weight,
      fontSize: size,
      color,
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), showSign && sign, currency, abs);
}
Object.assign(__ds_scope, { AmountText });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/AmountText.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MyMo Avatar — circular profile/initials chip. Pastel-pink fill with
 * brand-colored initials by default; pass src for a photo.
 */
function Avatar({
  name = "",
  src,
  size = 44,
  bg,
  color,
  style,
  ...rest
}) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join("");
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      flex: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: bg || "var(--mymo-pastel-pink)",
      color: color || "var(--color-brand)",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--weight-bold)",
      fontSize: size * 0.4,
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials || "?");
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MyMo Badge / status pill. Tones: success, warning, error, info, neutral, brand.
 * Soft tinted background + saturated text, fully rounded.
 */
function Badge({
  children,
  tone = "neutral",
  solid = false,
  style,
  ...rest
}) {
  const tones = {
    success: {
      c: "var(--mymo-success)",
      bg: "rgba(44,168,124,0.12)"
    },
    warning: {
      c: "var(--mymo-warning)",
      bg: "rgba(255,149,0,0.14)"
    },
    error: {
      c: "var(--mymo-red)",
      bg: "rgba(255,59,48,0.12)"
    },
    info: {
      c: "var(--mymo-link)",
      bg: "rgba(0,122,255,0.12)"
    },
    brand: {
      c: "var(--color-brand)",
      bg: "var(--mymo-pastel-pink)"
    },
    neutral: {
      c: "var(--text-secondary)",
      bg: "var(--mymo-account-row)"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      height: 22,
      padding: "0 10px",
      borderRadius: "var(--radius-pill)",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--weight-semibold)",
      fontSize: "var(--text-12)",
      lineHeight: 1,
      whiteSpace: "nowrap",
      color: solid ? "#fff" : t.c,
      background: solid ? t.c : t.bg,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MyMo Card — white surface, 16px radius, soft cool-gray shadow.
 * Set variant="outline" for the hairline-border style some screens use,
 * or variant="flat" for no elevation.
 */
function Card({
  children,
  variant = "shadow",
  padding = 16,
  style,
  ...rest
}) {
  const variants = {
    shadow: {
      boxShadow: "var(--elevation-card)",
      border: "none"
    },
    outline: {
      boxShadow: "none",
      border: "1px solid var(--mymo-shadow-card)"
    },
    flat: {
      boxShadow: "none",
      border: "none"
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "var(--surface-card)",
      borderRadius: "var(--radius-card)",
      padding,
      boxSizing: "border-box",
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MyMo icon registry — the app's own vector drawables, inlined as SVG
 * so they tint via `color` (currentColor) and render reliably everywhere.
 */
const MYMO_ICONS = {
  "arrow": {
    vb: "0 0 28 15.709",
    p: "<path d=\"M28,7.849a2.005,2.005 0,0 1,-0.77 1.58l-6.53,5.78a2.039,2.039 0,0 1,-1.33 0.5,2 2,0 0,1 -1.32,-3.5l2.67,-2.36L2,9.849a2,2 0,0 1,0 -4h18.71l-2.66,-2.35a2,2 0,1 1,2.65 -3l6.57,5.81a2.076,2.076 0,0 1,0.45 0.53,1.14 1.14,0 0,1 0.1,0.19 1.871,1.871 0,0 1,0.13 0.4,0.467 0.467,0 0,1 0.03,0.17A1.954,1.954 0,0 1,28 7.849Z\" fill=\"currentColor\"></path>"
  },
  "billscan": {
    vb: "0 0 55.999 56.002",
    p: "<path d=\"M53.281,25.184h-50.57a2.83,2.83 0,0 0,0 5.634L53.281,30.818a2.83,2.83 0,0 0,0 -5.634Z\" fill=\"currentColor\"></path><path d=\"M2.816,19.013a2.82,2.82 0,0 0,2.817 -2.817v-6.6a3.961,3.961 0,0 1,3.956 -3.959h10.055a2.817,2.817 0,0 0,0 -5.634L9.589,0.003a9.6,9.6 0,0 0,-9.59 9.593v6.6A2.82,2.82 0,0 0,2.816 19.013Z\" fill=\"currentColor\"></path><path d=\"M36.353,5.634h10.145a3.871,3.871 0,0 1,3.864 3.866v6.7a2.817,2.817 0,1 0,5.634 0v-6.7a9.511,9.511 0,0 0,-9.5 -9.5L36.353,0a2.817,2.817 0,1 0,0 5.634Z\" fill=\"currentColor\"></path><path d=\"M53.182,36.992a2.82,2.82 0,0 0,-2.817 2.817v6.7a3.867,3.867 0,0 1,-3.862 3.864L36.356,50.373a2.817,2.817 0,1 0,0 5.634h10.148a9.507,9.507 0,0 0,9.5 -9.5v-6.7A2.82,2.82 0,0 0,53.182 36.992Z\" fill=\"currentColor\"></path><path d=\"M19.645,50.372h-10.15a3.867,3.867 0,0 1,-3.861 -3.864v-6.7a2.817,2.817 0,1 0,-5.634 0v6.7a9.506,9.506 0,0 0,9.5 9.5h10.15a2.817,2.817 0,0 0,0 -5.634Z\" fill=\"currentColor\"></path>"
  },
  "black_arrow_right": {
    vb: "0 0 20 20",
    p: "<path d=\"M7.287,14.772C7.04,14.493 7.066,14.066 7.345,13.818L11.641,10.016L7.343,6.18C7.065,5.931 7.04,5.504 7.289,5.226C7.537,4.947 7.964,4.923 8.243,5.172L13.108,9.514C13.252,9.642 13.334,9.826 13.333,10.019C13.333,10.212 13.25,10.396 13.106,10.524L8.241,14.83C7.961,15.078 7.534,15.052 7.287,14.772Z\" fill=\"currentColor\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"></path>"
  },
  "book_dstatement": {
    vb: "0 0 12 13",
    p: "<path d=\"M6,0.5L6,0.5A6,6 0,0 1,12 6.5L12,6.5A6,6 0,0 1,6 12.5L6,12.5A6,6 0,0 1,0 6.5L0,6.5A6,6 0,0 1,6 0.5z\" fill=\"#d83153\"></path><path d=\"M7.3224,6.0279H4.5195C4.3587,6.0279 4.2266,5.8922 4.2266,5.7269C4.2266,5.5616 4.3587,5.4258 4.5195,5.4258H7.3224C7.4832,5.4258 7.6153,5.5616 7.6153,5.7269C7.6153,5.8922 7.4832,6.0279 7.3224,6.0279Z\" fill=\"#d83153\"></path><path d=\"M6.6217,7.2291H4.5195C4.3587,7.2291 4.2266,7.0933 4.2266,6.928C4.2266,6.7627 4.3587,6.6269 4.5195,6.6269H6.6217C6.7825,6.6269 6.9146,6.7627 6.9146,6.928C6.9146,7.0933 6.7825,7.2291 6.6217,7.2291Z\" fill=\"#d83153\"></path><path d=\"M5.1599,8.4274H4.5195C4.3587,8.4274 4.2266,8.2916 4.2266,8.1263C4.2266,7.961 4.3587,7.8252 4.5195,7.8252H5.1599C5.3207,7.8252 5.4528,7.961 5.4528,8.1263C5.4528,8.2945 5.3207,8.4274 5.1599,8.4274Z\" fill=\"#d83153\"></path><path d=\"M4.3984,3.0546V3.388C4.3984,3.4481 4.4501,3.5 4.5162,3.5H7.322C7.3851,3.5 7.4397,3.4508 7.4397,3.388V3.0546C7.4397,2.6612 7.1726,2.5519 6.8022,2.4344C6.6298,2.3798 6.5035,2.2268 6.5064,2.0519C6.5092,1.7486 6.2508,1.5 5.932,1.5H5.909C5.5989,1.5 5.3232,1.735 5.3347,2.0273C5.3433,2.2104 5.2198,2.3743 5.0389,2.4344C4.6684,2.5546 4.3984,2.6639 4.3984,3.0546Z\" fill=\"#ffffff\"></path><path d=\"M4.1589,3.2978V3.6717C4.1589,3.7501 4.218,3.8178 4.2935,3.8178H7.501C7.5732,3.8178 7.6356,3.7537 7.6356,3.6717V3.2978H8.3732C8.6317,3.2978 8.8413,3.5104 8.8413,3.776V10.0191C8.8413,10.2848 8.6317,10.5002 8.3732,10.5002H3.4681C3.2096,10.5002 3,10.2848 3,10.0191V3.776C3,3.5104 3.2096,3.2978 3.4681,3.2978H4.1589Z\" fill=\"#ffffff\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"></path><path d=\"M7.3224,6.0279H4.5195C4.3587,6.0279 4.2266,5.8922 4.2266,5.7269C4.2266,5.5616 4.3587,5.4258 4.5195,5.4258H7.3224C7.4832,5.4258 7.6153,5.5616 7.6153,5.7269C7.6153,5.8922 7.4832,6.0279 7.3224,6.0279Z\" fill=\"#d83153\"></path><path d=\"M6.6217,7.2291H4.5195C4.3587,7.2291 4.2266,7.0933 4.2266,6.928C4.2266,6.7627 4.3587,6.6269 4.5195,6.6269H6.6217C6.7825,6.6269 6.9146,6.7627 6.9146,6.928C6.9146,7.0933 6.7825,7.2291 6.6217,7.2291Z\" fill=\"#d83153\"></path><path d=\"M5.1599,8.4283H4.5195C4.3587,8.4283 4.2266,8.2926 4.2266,8.1272C4.2266,7.9619 4.3587,7.8262 4.5195,7.8262H5.1599C5.3207,7.8262 5.4528,7.9619 5.4528,8.1272C5.4528,8.2955 5.3207,8.4283 5.1599,8.4283Z\" fill=\"#d83153\"></path>"
  },
  "calendar_filter": {
    vb: "0 0 20 20",
    p: "<path d=\"M4,0L16,0A4,4 0,0 1,20 4L20,16A4,4 0,0 1,16 20L4,20A4,4 0,0 1,0 16L0,4A4,4 0,0 1,4 0z\" fill=\"#ffffff\"></path><path d=\"M4,0.75L16,0.75A3.25,3.25 0,0 1,19.25 4L19.25,16A3.25,3.25 0,0 1,16 19.25L4,19.25A3.25,3.25 0,0 1,0.75 16L0.75,4A3.25,3.25 0,0 1,4 0.75z\" fill=\"none\" stroke=\"#d83152\" stroke-width=\"1.5\"></path><path d=\"M4,0H16a4,4 0,0 1,4 4V7a0,0 0,0 1,0 0H0A0,0 0,0 1,0 7V4A4,4 0,0 1,4 0Z\" fill=\"#d83152\"></path><path d=\"M3,12h8v5h-8z\" fill=\"#d83152\"></path>"
  },
  "close": {
    vb: "0 0 32 32",
    p: "<path d=\"M16,16m-16,0a16,16 0,1 1,32 0a16,16 0,1 1,-32 0\" fill=\"#ffffff\" fill-opacity=\"0.56\"></path><path d=\"M9,9L23,23\" fill=\"none\" stroke=\"#d63252\" stroke-width=\"2\" stroke-linecap=\"round\"></path><path d=\"M23,9L9,23\" fill=\"none\" stroke=\"#d63252\" stroke-width=\"2\" stroke-linecap=\"round\"></path>"
  },
  "contact_book": {
    vb: "0 0 24 24",
    p: "<path d=\"M19.4531,8.625C19.6641,8.625 19.875,8.4492 19.875,8.2031V6.7969C19.875,6.5859 19.6641,6.375 19.4531,6.375H18.75V4.6875C18.75,3.7734 17.9766,3 17.0625,3H5.8125C4.8633,3 4.125,3.7734 4.125,4.6875V19.3125C4.125,20.2617 4.8633,21 5.8125,21H17.0625C17.9766,21 18.75,20.2617 18.75,19.3125V17.625H19.4531C19.6641,17.625 19.875,17.4492 19.875,17.2031V15.7969C19.875,15.5859 19.6641,15.375 19.4531,15.375H18.75V13.125H19.4531C19.6641,13.125 19.875,12.9492 19.875,12.7031V11.2969C19.875,11.0859 19.6641,10.875 19.4531,10.875H18.75V8.625H19.4531ZM11.4375,7.5C12.668,7.5 13.6875,8.5195 13.6875,9.75C13.6875,11.0156 12.668,12 11.4375,12C10.1719,12 9.1875,11.0156 9.1875,9.75C9.1875,8.5195 10.1719,7.5 11.4375,7.5ZM15.375,15.832C15.375,16.2187 15.0234,16.5 14.5664,16.5H8.2734C7.8516,16.5 7.5,16.2187 7.5,15.832V15.1641C7.5,14.0391 8.5547,13.125 9.8555,13.125H10.0312C10.4531,13.3359 10.9102,13.4062 11.4375,13.4062C11.9297,13.4062 12.3867,13.3359 12.8086,13.125H12.9844C14.2852,13.125 15.375,14.0391 15.375,15.1641V15.832Z\" fill=\"currentColor\"></path>"
  },
  "digitalsalak_deposit": {
    vb: "0 0 26 26",
    p: "<path d=\"M13,0.5A12.5,12.5 0,1 1,0.5 13,12.5 12.5,0 0,1 13,0.5Z\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1\"></path><path d=\"M15.309,15.41a3.808,3.808 0,0 1,0.322 -0.212l0,0h-6.7v-0.828h7.891v0.346a3.7,3.7 0,0 1,2.123 0.147v-8.365a1.9,1.9 0,0 1,-1.782 -2h-8.621a1.9,1.9 0,0 1,-1.782 2,1.714 1.714,0 0,1 -0.257,-0.029v12.39a1.592,1.592 0,0 1,0.257 -0.029,1.9 1.9,0 0,1 1.782,2L14.47,20.83A3.879,3.879 0,0 1,15.309 15.41ZM13.309,6.946 L14.209,6.318h0.728v3.5h-0.725L14.212,6.993h-0.014l-0.892,0.607ZM11.458,8.279h-0.4v-0.522h0.391c0.366,0 0.6,-0.2 0.6,-0.485s-0.2,-0.468 -0.546,-0.468a0.54,0.54 0,0 0,-0.6 0.467l0,0.02h-0.672a1.147,1.147 0,0 1,1.233 -1.055l0.045,0c0.739,0 1.239,0.366 1.239,0.926a0.836,0.836 0,0 1,-0.73 0.82v0.015a0.838,0.838 0,0 1,0.858 0.818v0.019c0,0.635 -0.551,1.057 -1.363,1.057 -0.791,0 -1.33,-0.427 -1.361,-1.07h0.7c0.024,0.286 0.277,0.48 0.662,0.48 0.366,0 0.618,-0.2 0.618,-0.5C12.135,8.467 11.885,8.279 11.46,8.279ZM8.922,11.888h7.891v0.828h-7.891Z\" fill=\"#ffffff\"></path><path d=\"M17.627,15.411a3.1,3.1 0,1 0,0 6.2h0a3.1,3.1 0,1 0,0 -6.2ZM19.005,18.511 L19.005,18.511 19.005,18.511 18.105,17.824v2.2L17.27,20.024v-2.181l-0.827,0.66 0,-0.005 0,0 -0.51,-0.642 1.753,-1.388 0,0 0,0 1.822,1.383Z\" fill=\"#ffffff\"></path>"
  },
  "file_download": {
    vb: "0 0 24.0 24.0",
    p: "<path d=\"M19,9h-4V3H9v6H5l7,7 7,-7zM5,18v2h14v-2H5z\" fill=\"currentColor\"></path>"
  },
  "hamberger": {
    vb: "0 0 16 16",
    p: "<path d=\"M2,3L14,3\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"></path><path d=\"M2,9L14,9\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"></path><path d=\"M2,15L14,15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"></path>"
  },
  "hotkey_payment": {
    vb: "0 0 56 56",
    p: "<path d=\"M28,28m-28,0a28,28 0,1 1,56 0a28,28 0,1 1,-56 0\" fill=\"none\"></path><path d=\"M40.091,27.501L17.222,27.501a1.157,1.157 0,0 0,0 2.314L40.091,29.815a1.157,1.157 0,1 0,0 -2.314Z\" fill=\"currentColor\"></path><path d=\"M17.158,23.808a1.158,1.158 0,0 0,1.157 -1.157L18.315,19.939a1.627,1.627 0,0 1,1.625 -1.626h4.13a1.157,1.157 0,0 0,0 -2.314h-4.13a3.944,3.944 0,0 0,-3.939 3.94v2.712A1.158,1.158 0,0 0,17.158 23.808Z\" fill=\"currentColor\"></path><path d=\"M33.249,18.313h4.167a1.59,1.59 0,0 1,1.587 1.588v2.75a1.157,1.157 0,1 0,2.314 0v-2.75a3.906,3.906 0,0 0,-3.9 -3.9h-4.167a1.157,1.157 0,1 0,0 2.314Z\" fill=\"currentColor\"></path><path d=\"M40.161,33.509a1.158,1.158 0,0 0,-1.157 1.157v2.75a1.588,1.588 0,0 1,-1.586 1.587h-4.168a1.157,1.157 0,1 0,0 2.314h4.168a3.9,3.9 0,0 0,3.9 -3.9v-2.75A1.158,1.158 0,0 0,40.161 33.509Z\" fill=\"currentColor\"></path><path d=\"M24.07,39.003L19.901,39.003a1.588,1.588 0,0 1,-1.586 -1.587v-2.75a1.157,1.157 0,0 0,-2.314 0v2.75a3.9,3.9 0,0 0,3.9 3.9h4.169a1.157,1.157 0,0 0,0 -2.314Z\" fill=\"currentColor\"></path>"
  },
  "info": {
    vb: "0 0 25 25",
    p: "<path d=\"M12.5004,3.5C7.5286,3.5 3.5004,7.5645 3.5004,12.5C3.5004,17.4718 7.5286,21.5 12.5004,21.5C17.4358,21.5 21.5004,17.4718 21.5004,12.5C21.5004,7.5645 17.4358,3.5 12.5004,3.5ZM12.5004,7.4919C13.335,7.4919 14.0246,8.1814 14.0246,9.0161C14.0246,9.8871 13.335,10.5403 12.5004,10.5403C11.6294,10.5403 10.9762,9.8871 10.9762,9.0161C10.9762,8.1814 11.6294,7.4919 12.5004,7.4919ZM14.5326,16.7097C14.5326,16.9637 14.3149,17.1452 14.0971,17.1452H10.9036C10.6496,17.1452 10.4681,16.9637 10.4681,16.7097V15.8387C10.4681,15.621 10.6496,15.4032 10.9036,15.4032H11.3391V13.0806H10.9036C10.6496,13.0806 10.4681,12.8992 10.4681,12.6452V11.7742C10.4681,11.5565 10.6496,11.3387 10.9036,11.3387H13.2262C13.4439,11.3387 13.6617,11.5565 13.6617,11.7742V15.4032H14.0971C14.3149,15.4032 14.5326,15.621 14.5326,15.8387V16.7097Z\" fill=\"currentColor\"></path>"
  },
  "insurance_heart": {
    vb: "0 0 72 72",
    p: "<path d=\"M36,35.999m-36,0a36,36 0,1 1,72 0a36,36 0,1 1,-72 0\" fill=\"#fddfe4\"></path><path d=\"M44.101,19.864a10.434,10.434 0,0 0,-8 3.725l-0.109,0.145 -0.087,-0.145a10.458,10.458 0,0 0,-17.1 11.9l15.459,15.749a3.291,3.291 0,0 0,1.735 0.9,3.286 3.286,0 0,0 1.735,-0.9l15.46,-15.749a10.46,10.46 0,0 0,-9.094 -15.623ZM45.954,36.593L40.34,36.593a1.076,1.076 0,0 1,-1.009 -0.708l-0.422,-1.171 -1.809,5.606a1.067,1.067 0,0 1,-1.018 0.743,1.078 1.078,0 0,1 -1.049,-0.838l-1.879,-8.406 -1.765,4.06a1.073,1.073 0,0 1,-0.984 0.645L25.06,36.524a0.759,0.759 0,1 1,0 -1.519h5.055l2.195,-5.049a1.073,1.073 0,0 1,2.031 0.193l1.82,8.144 1.708,-5.291a1.072,1.072 0,0 1,2.03 -0.033l0.758,2.1h5.3a0.759,0.759 0,1 1,0 1.519Z\" fill=\"#ea0a4e\"></path>"
  },
  "insurance_savings": {
    vb: "0 0 26 26",
    p: "<path d=\"M13,0.5A12.5,12.5 0,1 1,0.5 13,12.5 12.5,0 0,1 13,0.5Z\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1\"></path><path d=\"M19.508,8.071a0.457,0.457 0,0 0,-0.273 -0.387l-6.048,-2.736a0.451,0.451 0,0 0,-0.377 0l-5.989,2.708a0.454,0.454 0,0 0,-0.272 0.387c-0.086,1.317 -0.312,6.987 2.013,9.074l0.03,0.028a15.372,15.372 0,0 0,4.436 3.014l0,0.03a15.377,15.377 0,0 0,4.437 -3.014l0.028,-0.03C19.821,15.058 19.595,9.39 19.508,8.071ZM11.898,15.871 L9.798,13.114 10.992,12.205 12.092,13.649 15.619,10.385 16.638,11.485Z\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"1\"></path>"
  },
  "key": {
    vb: "0 0 14 16",
    p: "<path d=\"M12.5,8H4.75V4.7813C4.75,3.5625 5.7188,2.5313 6.9688,2.5C8.2188,2.5 9.25,3.5313 9.25,4.75V5.25C9.25,5.6875 9.5625,6 10,6H11C11.4062,6 11.75,5.6875 11.75,5.25V4.75C11.75,2.125 9.5938,0 6.9688,0C4.3438,0.0313 2.25,2.1875 2.25,4.8125V8H1.5C0.6563,8 0,8.6875 0,9.5V14.5C0,15.3438 0.6563,16 1.5,16H12.5C13.3125,16 14,15.3438 14,14.5V9.5C14,8.6875 13.3125,8 12.5,8ZM8.25,12.75C8.25,13.4688 7.6875,14 7,14C6.2813,14 5.75,13.4688 5.75,12.75V11.25C5.75,10.5625 6.2813,10 7,10C7.6875,10 8.25,10.5625 8.25,11.25V12.75Z\" fill=\"currentColor\"></path>"
  },
  "mymo_logo": {
    vb: "0 0 159 54.556",
    p: "<path d=\"M64.938,54.555c-0.456,-0.08 -0.91,-0.174 -1.368,-0.236a11.1,11.1 0,0 1,-3.1 -0.927,4.852 4.852,0 0,1 -1.28,-0.8 2.252,2.252 0,0 1,0.292 -3.231,2.356 2.356,0 0,1 2.548,-0.216 11.054,11.054 0,0 0,3.676 0.868,11.321 11.321,0 0,0 6.643,-1.456 8.931,8.931 0,0 0,3.487 -3.634,9.75 9.75,0 0,0 1.227,-3.85c0.115,-1.447 0.026,-2.91 0.026,-4.361 -0.449,0.342 -0.929,0.717 -1.419,1.079a14.528,14.528 0,0 1,-6.269 2.59,16.189 16.189,0 0,1 -11.943,-2.561 13.547,13.547 0,0 1,-4.023 -4.48,17.434 17.434,0 0,1 -1.5,-3.641 10.289,10.289 0,0 1,-0.427 -2.819c-0.051,-4.392 -0.063,-8.785 -0.092,-13.177a7.047,7.047 0,0 0,-0.635 -2.608,10.088 10.088,0 0,0 -2.349,-3.542 9.089,9.089 0,0 0,-4.167 -2.316,13.721 13.721,0 0,0 -3.211,-0.473 10.882,10.882 0,0 0,-6.7 2.071,9.439 9.439,0 0,0 -3.027,3.911 12.766,12.766 0,0 0,-0.948 5.179c0.015,4.065 0,8.129 0.007,12.194a2.377,2.377 0,0 1,-1.6 2.326,2.278 2.278,0 0,1 -2.963,-2.064c0,-4.331 0.026,-8.662 -0.012,-12.993a11.021,11.021 0,0 0,-2.188 -6.708,9.3 9.3,0 0,0 -5.557,-3.532 18.545,18.545 0,0 0,-2.329 -0.324,10.622 10.622,0 0,0 -5.873,1.19 9.1,9.1 0,0 0,-3.815 3.64,10.5 10.5,0 0,0 -1.421,4.31c-0.065,0.695 -0.151,1.391 -0.153,2.087 -0.014,4.1 -0.007,8.209 -0.007,12.314a2.136,2.136 0,0 1,-2.109 2.135,2.284 2.284,0 0,1 -2.37,-1.61L-0.011,14.009c0.078,-0.456 0.175,-0.91 0.232,-1.369a13.507,13.507 0,0 1,1.578 -4.723,14.371 14.371,0 0,1 4.147,-4.809 15.268,15.268 0,0 1,6.14 -2.606,15.426 15.426,0 0,1 4.307,-0.232 16.441,16.441 0,0 1,5.61 1.466,13.394 13.394,0 0,1 4.526,3.279c0.5,0.563 0.919,1.2 1.375,1.81 0.055,0.073 0.119,0.14 0.157,0.185 0.495,-0.629 0.944,-1.289 1.484,-1.865a19.411,19.411 0,0 1,1.986 -1.849,14.617 14.617,0 0,1 5.931,-2.7 15.8,15.8 0,0 1,4.807 -0.325,15.524 15.524,0 0,1 6.032,1.673 13.951,13.951 0,0 1,5.813 5.6,15.933 15.933,0 0,1 1.745,4.664 11.866,11.866 0,0 1,0.26 2.345c0.025,4.065 0.02,8.13 0.006,12.2a7.993,7.993 0,0 0,0.619 2.937,10.06 10.06,0 0,0 2.537,3.75 9.31,9.31 0,0 0,3.827 2.15,11.608 11.608,0 0,0 3.933,0.485 10.767,10.767 0,0 0,6.636 -2.456,9.7 9.7,0 0,0 3.233,-5.719 15.485,15.485 0,0 0,0.244 -2.786c0.028,-3.385 0.036,-6.771 0,-10.156a13.706,13.706 0,0 1,0.489 -4.009,15.714 15.714,0 0,1 2.97,-5.767 14.17,14.17 0,0 1,7.1 -4.551,17.655 17.655,0 0,1 6.023,-0.6 14.685,14.685 0,0 1,3.035 0.558A15.377,15.377 0,0 1,101.226 2.588a13.99,13.99 0,0 1,4.047 4.223,12.747 12.747,0 0,1 2.587,-3.12 14.169,14.169 0,0 1,4.2 -2.556,13.7 13.7,0 0,1 3.842,-1.011 34.848,34.848 0,0 1,3.964 -0.024,12.584 12.584,0 0,1 3.7,0.793 13.709,13.709 0,0 1,4.424 2.459,14.491 14.491,0 0,1 3.955,5.193 13,13 0,0 1,1.206 4.391c0.1,1.225 0.118,2.457 0.166,3.686 0.013,0.332 0,0.664 0,1.033 0.455,-0.352 0.883,-0.682 1.31,-1.014a12.355,12.355 0,0 1,4.324 -2.138,20.686 20.686,0 0,1 3.137,-0.634 16.41,16.41 0,0 1,3.139 -0.08,16.246 16.246,0 0,1 5.106,1.249 13.789,13.789 0,0 1,4.979 3.585,14.289 14.289,0 0,1 2.633,4.38 13.479,13.479 0,0 1,0.96 4.339,35.217 35.217,0 0,1 0.066,3.7 15.181,15.181 0,0 1,-3.037 8.3,13.825 13.825,0 0,1 -5.45,4.334 13.14,13.14 0,0 1,-4.233 1.188,24.28 24.28,0 0,1 -3.763,0.145 15.067,15.067 0,0 1,-5.385 -1.4,14.359 14.359,0 0,1 -3.4,-2.215 14.947,14.947 0,0 1,-3.084 -3.9,13.823 13.823,0 0,1 -1.753,-5.31 34.75,34.75 0,0 1,-0.136 -4.035c-0.006,-3.6 0.02,-7.2 0.031,-10.8 0,-0.88 0.019,-1.76 0,-2.639a10.733,10.733 0,0 0,-1 -4.321,10.353 10.353,0 0,0 -1.884,-2.824 9.427,9.427 0,0 0,-5.02 -2.738,13.464 13.464,0 0,0 -3.008,-0.314 10.8,10.8 0,0 0,-6.247 2.01,9.56 9.56,0 0,0 -3.69,5.8 13.748,13.748 0,0 0,-0.323 2.888c-0.034,4.185 0,8.37 -0.021,12.556a2.217,2.217 0,0 1,-1.632 2.4,2.184 2.184,0 0,1 -2.914,-2.107c-0.016,-4.305 0.026,-8.611 -0.018,-12.915a11.077,11.077 0,0 0,-2.185 -6.711,9.218 9.218,0 0,0 -4.211,-3.136 12.644,12.644 0,0 0,-3.392 -0.737,11.262 11.262,0 0,0 -6.4,1.32 9.208,9.208 0,0 0,-3.5 3.382,11.521 11.521,0 0,0 -1.479,4.012 5.5,5.5 0,0 0,-0.089 0.982c0,8.61 0.017,17.221 -0.02,25.831a15.048,15.048 0,0 1,-4.968 10.842,13.178 13.178,0 0,1 -3.59,2.282 16.228,16.228 0,0 1,-3.272 1.026c-0.512,0.1 -1.032,0.157 -1.548,0.24a1.014,1.014 0,0 0,-0.2 0.078ZM154.58,29.4c-0.129,-1 -0.209,-2.012 -0.4,-3a9.648,9.648 0,0 0,-3.317 -5.761,10.709 10.709,0 0,0 -6.664,-2.372 12.4,12.4 0,0 0,-2.626 0.231,9.554 9.554,0 0,0 -5.627,2.983 9.991,9.991 0,0 0,-2 3.34,9.125 9.125,0 0,0 -0.625,2.936 31.447,31.447 0,0 0,0.019 3.644,9.97 9.97,0 0,0 1.35,4.087 9.565,9.565 0,0 0,3.846 3.794,11.374 11.374,0 0,0 6.787,1.184 10.565,10.565 0,0 0,4.346 -1.438,9.493 9.493,0 0,0 3.269,-3.33A13.37,13.37 0,0 0,154.58 29.401Z\" fill=\"currentColor\"></path>"
  },
  "note": {
    vb: "0 0 22 22.058",
    p: "<path d=\"M17.8017,0.519l3.1982,3.1657 -13.9399,13.7985L2.5954,18.7518 3.8611,14.3168Z\" fill=\"currentColor\"></path><path d=\"M6.561,21.058L20.561,21.058\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"></path><path d=\"M1,21.058L3,21.058\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"></path>"
  },
  "pencil": {
    vb: "0 0 20 20",
    p: "<path d=\"M12.97,4.373L15.498,6.808L7.288,14.466L4.339,14.834L4.76,12.031L12.97,4.373Z\" fill=\"currentColor\"></path><path d=\"M6.619,17.431H17.795\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"></path><path d=\"M2.205,17.431H3.619\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"></path><path d=\"M14.695,2.684L17.241,5.137L15.927,6.534L13.252,3.992L14.695,2.684Z\" fill=\"currentColor\"></path>"
  },
  "plus_white": {
    vb: "0 0 22 22",
    p: "<path d=\"M1.158,12.158h8.684v8.684a1.158,1.158 0,1 0,2.316 0v-8.684h8.684a1.158,1.158 0,1 0,0 -2.316h-8.684L12.158,1.158a1.158,1.158 0,0 0,-2.316 0v8.684L1.158,9.842a1.158,1.158 0,0 0,0 2.316Z\" fill=\"none\"></path>"
  },
  "schedule": {
    vb: "0 0 23 23",
    p: "<path d=\"M4,1L19,1A3,3 0,0 1,22 4L22,19A3,3 0,0 1,19 22L4,22A3,3 0,0 1,1 19L1,4A3,3 0,0 1,4 1z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"></path><path d=\"M4,0H19a4,4 0,0 1,4 4V8a0,0 0,0 1,0 0H0A0,0 0,0 1,0 8V4A4,4 0,0 1,4 0Z\" fill=\"currentColor\"></path><path d=\"M4,14h9v5h-9z\" fill=\"currentColor\"></path>"
  },
  "search": {
    vb: "0 0 24.0 24.0",
    p: "<path d=\"M15.5,14h-0.79l-0.28,-0.27C15.41,12.59 16,11.11 16,9.5 16,5.91 13.09,3 9.5,3S3,5.91 3,9.5 5.91,16 9.5,16c1.61,0 3.09,-0.59 4.23,-1.57l0.27,0.28v0.79l5,4.99L20.49,19l-4.99,-5zM9.5,14C7.01,14 5,11.99 5,9.5S7.01,5 9.5,5 14,7.01 14,9.5 11.99,14 9.5,14z\" fill=\"currentColor\"></path>"
  },
  "setting_gear": {
    vb: "0 0 25 24",
    p: "<path d=\"M20.8922,14.1547L19.3318,13.2837C19.5132,12.4128 19.5132,11.5781 19.3318,10.7072L20.8922,9.8362C21.0737,9.7274 21.1463,9.5096 21.0737,9.3282C20.6745,8.0218 19.985,6.8605 19.114,5.8807C18.9689,5.7355 18.7512,5.6992 18.5697,5.8081L17.0093,6.679C16.356,6.1347 15.6303,5.6992 14.8319,5.4089V3.6307C14.8319,3.4493 14.6867,3.2678 14.469,3.2315C13.1263,2.9049 11.7836,2.9412 10.5134,3.2315C10.2957,3.2678 10.1868,3.4493 10.1868,3.6307V5.4089C9.3522,5.6992 8.6264,6.1347 7.9732,6.7153L6.4127,5.8081C6.2313,5.6992 6.0135,5.7355 5.8684,5.8807C4.9974,6.8605 4.308,8.0218 3.9088,9.3282C3.8362,9.5096 3.9088,9.7274 4.0902,9.8362L5.6507,10.7072C5.5055,11.5781 5.5055,12.4128 5.6507,13.2837L4.0902,14.1547C3.9088,14.2635 3.8362,14.4813 3.9088,14.6627C4.308,15.9691 4.9974,17.1304 5.8684,18.1102C6.0135,18.2554 6.2313,18.2917 6.4127,18.1828L7.9732,17.3119C8.6264,17.8562 9.3522,18.2917 10.1868,18.582V20.3602C10.1868,20.5416 10.332,20.7231 10.5134,20.7956C11.8562,21.086 13.1989,21.0497 14.469,20.7956C14.6867,20.7231 14.8319,20.5416 14.8319,20.3602V18.582C15.6303,18.2917 16.356,17.8562 17.0093,17.3119L18.5697,18.1828C18.7512,18.2917 18.9689,18.2554 19.114,18.1102C20.0213,17.1304 20.6745,15.9691 21.11,14.6627C21.1463,14.4813 21.0737,14.2635 20.8922,14.1547ZM12.5094,14.8805C10.8763,14.8805 9.6062,13.6103 9.6062,11.9773C9.6062,10.3806 10.8763,9.0742 12.5094,9.0742C14.1061,9.0742 15.4125,10.3806 15.4125,11.9773C15.4125,13.6103 14.1061,14.8805 12.5094,14.8805Z\" fill=\"currentColor\"></path>"
  },
  "share": {
    vb: "0 0 24 24",
    p: "<path d=\"M21.7394,9.28C22.0869,8.9325 22.0869,8.4112 21.7394,8.0637L16.735,3.3373C16.2137,2.8508 15.3449,3.1983 15.3449,3.9629V6.465C10.2363,6.465 6.1703,7.4729 6.1703,12.4772C6.1703,14.4581 7.3866,16.439 8.742,17.4468C9.159,17.7596 9.7498,17.3773 9.6108,16.856C8.1859,12.1297 10.3058,10.9134 15.3449,10.9134V13.3808C15.3449,14.1453 16.2137,14.4928 16.735,14.0063L21.7394,9.28ZM15.3449,16.3V18.6631H4.2242V7.5424H5.9618C6.1008,7.5424 6.205,7.5076 6.2745,7.4381C6.7958,6.8821 7.3866,6.465 8.0469,6.1175C8.4292,5.909 8.2902,5.3182 7.8731,5.3182H3.6681C2.7298,5.3182 2,6.0828 2,6.9863V19.2192C2,20.1575 2.7298,20.8873 3.6681,20.8873H15.901C16.8045,20.8873 17.5691,20.1575 17.5691,19.2192V16.161C17.5691,15.8482 17.2563,15.6744 16.9783,15.7439C16.735,15.8482 16.457,15.8829 16.179,15.8829C16.04,15.8829 15.9357,15.8829 15.7967,15.8829C15.5534,15.8482 15.3449,16.022 15.3449,16.3Z\" fill=\"currentColor\"></path>"
  },
  "tab_accounts": {
    vb: "0 0 23.696 24",
    p: "<path d=\"M2,17.814a2.685,2.685 0,0 0,2.561 2.793h14.761a2.685,2.685 0,0 0,2.561 -2.793v-0.494h-19.883Z\" fill=\"currentColor\"></path><path d=\"M19.322,5.648h-14.761a2.794,2.794 0,0 0,-2.561 2.979v7.074h19.883v-7.074A2.794,2.794 0,0 0,19.322 5.648ZM20.222,14.154h-3.984v-1.727h3.984Z\" fill=\"currentColor\"></path>"
  },
  "tab_history": {
    vb: "0 0 24 24",
    p: "<path d=\"M12,4a9,9 0,1 0,9 9A9,9 0,0 0,12 4ZM17.5,14.414h-6v-7h1v6h5Z\" fill=\"currentColor\"></path>"
  },
  "tab_home": {
    vb: "0 0 23.696 24",
    p: "<path d=\"M19.796,6.57l-6.09,-4.349a2.579,2.579 0,0 0,-2.993 0l-6.09,4.349a2.576,2.576 0,0 0,-1.078 2.095v8.022a3.991,3.991 0,0 0,3.991 3.991h1.576v-7.727h6.2L15.312,20.67h1.576a3.992,3.992 0,0 0,3.991 -3.991v-8.022A2.576,2.576 0,0 0,19.796 6.57Z\" fill=\"currentColor\"></path>"
  },
  "tab_more": {
    vb: "0 0 24 24",
    p: "<path d=\"M15.333,17.229L3.84,17.229a1.235,1.235 0,1 0,0 2.47h11.493a1.235,1.235 0,1 0,0 -2.47Z\" fill=\"currentColor\"></path><path d=\"M3.84,6.522h16.434a1.235,1.235 0,0 0,0 -2.47L3.84,4.052a1.235,1.235 0,1 0,0 2.47Z\" fill=\"currentColor\"></path><path d=\"M20.274,10.64L3.84,10.64a1.236,1.236 0,0 0,0 2.471h16.434a1.236,1.236 0,0 0,0 -2.471Z\" fill=\"currentColor\"></path>"
  },
  "tab_payment": {
    vb: "0 0 24 24",
    p: "<path d=\"M17.356,19.493v-6.73h0.01L17.366,3.198a1.358,1.358 0,0 0,-1.48 -1.189L3.474,2.009a1.357,1.357 0,0 0,-1.475 1.189v16.35a2.134,2.134 0,0 0,2.324 1.869L19.714,21.417S17.356,21.415 17.356,19.493ZM7.973,3.216L11.464,3.216a0.445,0.445 0,0 1,0 0.89L7.973,4.106a0.445,0.445 0,0 1,0 -0.89ZM6.058,5.116a2.41,2.41 0,1 1,-2.41 2.41A2.41,2.41 0,0 1,6.058 5.119ZM10.999,18.406L3.946,18.406a0.25,0.25 0,0 1,0 -0.5h7.053a0.25,0.25 0,0 1,0 0.5ZM13.384,15.406L3.946,15.406a0.25,0.25 0,0 1,0 -0.5L13.384,14.906a0.25,0.25 0,0 1,0 0.5ZM14.746,12.406h-10.8a0.25,0.25 0,0 1,0 -0.5h10.8a0.25,0.25 0,0 1,0 0.5ZM14.746,9.387L9.986,9.387a0.25,0.25 0,0 1,0 -0.5h4.761a0.25,0.25 0,0 1,0 0.5ZM14.746,6.387L9.982,6.387a0.25,0.25 0,0 1,0 -0.5h4.765a0.25,0.25 0,0 1,0 0.5Z\" fill=\"currentColor\"></path><path d=\"M20.968,13.954l-1.029,-1.029 -1.155,1.029 -0.9,-1.029v6.553c0,1.68 2.058,1.68 2.058,1.68a2.057,2.057 0,0 0,2.058 -2.058v-6.175Z\" fill=\"currentColor\"></path><path d=\"M5.262,8.937h1.055a1.017,1.017 0,0 0,0.269 -0.033,0.909 0.909,0 0,0 0.224,-0.091 0.784,0.784 0,0 0,0.177 -0.137,0.822 0.822,0 0,0 0.233,-0.573 0.677,0.677 0,0 0,-0.029 -0.2,0.7 0.7,0 0,0 -0.207,-0.322 0.76,0.76 0,0 0,-0.161 -0.109,0.645 0.645,0 0,0 0.115,-0.1 0.636,0.636 0,0 0,0.149 -0.276,0.727 0.727,0 0,0 0.021,-0.174 0.678,0.678 0,0 0,-0.03 -0.2,0.7 0.7,0 0,0 -0.079,-0.169 0.754,0.754 0,0 0,-0.115 -0.137,0.881 0.881,0 0,0 -0.136,-0.1 0.538,0.538 0,0 0,-0.159 -0.065,1.605 1.605,0 0,0 -0.194,-0.033 1.678,1.678 0,0 0,-0.2 -0.012h-0.189l-0.744,0h0a0.228,0.228 0,0 0,-0.223 0.233v2.269h0A0.228,0.228 0,0 0,5.262 8.937ZM6.62,7.937a0.291,0.291 0,0 1,0.039 0.155,0.433 0.433,0 0,1 -0.025,0.147 0.33,0.33 0,0 1,-0.073 0.117,0.335 0.335,0 0,1 -0.119,0.077 0.435,0.435 0,0 1,-0.164 0.028l-0.657,0.005v-0.706h0.591a0.747,0.747 0,0 1,0.163 0.018,0.457 0.457,0 0,1 0.145,0.059A0.341,0.341 0,0 1,6.62 7.94ZM5.61,6.678h0.489a1.233,1.233 0,0 1,0.172 0.012,0.416 0.416,0 0,1 0.142,0.046 0.253,0.253 0,0 1,0.1 0.1,0.329 0.329,0 0,1 0.035,0.16 0.335,0.335 0,0 1,-0.025 0.133,0.25 0.25,0 0,1 -0.079,0.1 0.391,0.391 0,0 1,-0.138 0.066,0.791 0.791,0 0,1 -0.2,0.023h-0.5Z\" fill=\"currentColor\"></path>"
  },
  "tab_scan": {
    vb: "0 0 24 24",
    p: "<path d=\"M4,7.294V4.674C4,4.302 4.302,4 4.674,4H7.222\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M20,7.294V4.674C20,4.302 19.698,4 19.326,4H16.778\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M4,16.706V19.326C4,19.698 4.302,20 4.674,20H7.222\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M20,16.706V19.326C20,19.698 19.698,20 19.326,20H16.778\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M4,12H19.959\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>"
  },
  "transfer_landing": {
    vb: "0 0 25 25",
    p: "<path d=\"M13.137,12.076a1.315,1.315 0,0 0,0.455 -0.2,0.786 0.786,0 0,0 0.262,-0.315 1.032,1.032 0,0 0,0.084 -0.424,1.152 1.152,0 0,0 -0.05,-0.36 0.649,0.649 0,0 0,-0.137 -0.241,0.6 0.6,0 0,0 -0.214,-0.148 1.167,1.167 0,0 0,-0.283 -0.078,2.552 2.552,0 0,0 -0.337,-0.029L10.699,10.281v1.862h1.771A2.933,2.933 0,0 0,13.137 12.076Z\" fill=\"currentColor\"></path><path d=\"M13.756,13.076a1.545,1.545 0,0 0,-0.477 -0.151,3.331 3.331,0 0,0 -0.536,-0.043L10.699,12.882v2.035h2.231a1.97,1.97 0,0 0,0.555 -0.074,1.176 1.176,0 0,0 0.408,-0.211 0.886,0.886 0,0 0,0.25 -0.337,1.171 1.171,0 0,0 0.084,-0.453 0.814,0.814 0,0 0,-0.131 -0.473A0.918,0.918 0,0 0,13.756 13.076Z\" fill=\"currentColor\"></path><path d=\"M12.092,6a6.592,6.592 0,1 0,6.592 6.592A6.592,6.592 0,0 0,12.092 6ZM15.068,14.526a1.733,1.733 0,0 1,-0.413 0.565,2.109 2.109,0 0,1 -0.673,0.4 2.6,2.6 0,0 1,-0.921 0.153h-0.6v0.44a0.438,0.438 0,0 1,-0.438 0.438h0a0.438,0.438 0,0 1,-0.438 -0.438v-0.44h-1.378a0.567,0.567 0,0 1,-0.192 -0.034,0.487 0.487,0 0,1 -0.155,-0.092 0.452,0.452 0,0 1,-0.1 -0.135,0.348 0.348,0 0,1 -0.039,-0.167v-5.247a0.345,0.345 0,0 1,0.039 -0.167,0.428 0.428,0 0,1 0.1,-0.135 0.469,0.469 0,0 1,0.155 -0.092,0.521 0.521,0 0,1 0.192,-0.033h1.4a0.433,0.433 0,0 1,-0.023 -0.118v-0.561a0.438,0.438 0,0 1,0.438 -0.438h0a0.438,0.438 0,0 1,0.438 0.438v0.561a0.434,0.434 0,0 1,-0.024 0.118h0.1a7.422,7.422 0,0 1,1.01 0.06,2.11 2.11,0 0,1 0.742,0.226 1.1,1.1 0,0 1,0.455 0.467,1.733 1.733,0 0,1 0.154,0.781 1.362,1.362 0,0 1,-0.235 0.816,1.574 1.574,0 0,1 -0.717,0.515 1.864,1.864 0,0 1,0.543 0.207,1.452 1.452,0 0,1 0.392,0.328 1.35,1.35 0,0 1,0.239 0.429A1.593,1.593 0,0 1,15.068 14.526Z\" fill=\"currentColor\"></path>"
  },
  "tune": {
    vb: "0 0 24.0 24.0",
    p: "<path d=\"M3,17v2h6v-2L3,17zM3,5v2h10L13,5L3,5zM13,21v-2h8v-2h-8v-2h-2v6h2zM7,9v2L3,11v2h4v2h2L9,9L7,9zM21,13v-2L11,11v2h10zM15,9h2L17,7h4L21,5h-4L17,3h-2v6z\" fill=\"currentColor\"></path>"
  }
};
function Icon({
  name,
  size = 24,
  color,
  title,
  style,
  className,
  ...rest
}) {
  const def = MYMO_ICONS[name];
  if (!def) {
    if (typeof console !== "undefined") console.warn("Icon: unknown name '" + name + "'");
    return null;
  }
  return /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: def.vb,
    width: size,
    height: size,
    className: className,
    role: title ? "img" : "presentation",
    "aria-label": title,
    "aria-hidden": title ? undefined : true,
    style: {
      display: "block",
      flex: "none",
      color,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: def.p
    }
  }, rest));
}
const ICON_NAMES = Object.keys(MYMO_ICONS);
Object.assign(__ds_scope, { MYMO_ICONS, Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MyMo Button — the app's pill-shaped action button.
 * Primary = brand gradient (#FA7C93 → #F14658), Secondary = brand outline,
 * Text = borderless. 48px tall (sm = 32px), 25px pill radius.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  block = false,
  disabled = false,
  iconLeft,
  iconRight,
  style,
  ...rest
}) {
  const height = size === "sm" ? "var(--size-button-sm)" : "var(--size-button)";
  const fontSize = size === "sm" ? "var(--text-16)" : "var(--text-18)";
  const padX = size === "sm" ? "20px" : "32px";
  const base = {
    display: block ? "flex" : "inline-flex",
    width: block ? "100%" : undefined,
    minWidth: size === "sm" ? 96 : 184,
    height,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: `0 ${padX}`,
    borderRadius: "var(--radius-button)",
    fontFamily: "var(--font-sans)",
    fontWeight: "var(--weight-bold)",
    fontSize,
    lineHeight: 1,
    border: "none",
    cursor: disabled ? "default" : "pointer",
    boxSizing: "border-box",
    transition: "filter .15s ease, transform .05s ease, opacity .15s ease",
    WebkitTapHighlightColor: "transparent"
  };
  const variants = {
    primary: {
      color: "var(--text-on-brand)",
      background: "linear-gradient(90deg, var(--mymo-grad-btn-start), var(--mymo-grad-btn-end))",
      boxShadow: disabled ? "none" : "var(--elevation-fab)"
    },
    secondary: {
      color: "var(--color-brand)",
      background: "transparent",
      border: "1px solid var(--color-brand)"
    },
    text: {
      color: "var(--color-brand)",
      background: "transparent",
      minWidth: 0,
      padding: "0 12px"
    }
  };
  const disabledStyle = disabled ? variant === "primary" ? {
    background: "var(--mymo-mid-gray)",
    color: "#fff",
    boxShadow: "none"
  } : {
    color: "var(--text-disabled)",
    borderColor: "var(--border-strong)"
  } : null;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    style: {
      ...base,
      ...variants[variant],
      ...disabledStyle,
      ...style
    },
    onMouseDown: e => !disabled && (e.currentTarget.style.transform = "scale(0.98)"),
    onMouseUp: e => e.currentTarget.style.transform = "",
    onMouseLeave: e => e.currentTarget.style.transform = ""
  }, rest), iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: size === "sm" ? 18 : 20
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: size === "sm" ? 18 : 20
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MyMo SectionHeader — bold section title with an optional trailing action
 * (e.g. "See all"). Used above lists and content groups.
 */
function SectionHeader({
  title,
  action,
  onAction,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "4px 0",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--weight-bold)",
      fontSize: "var(--text-20)",
      color: "var(--text-primary)"
    }
  }, title), action && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAction,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 2,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--weight-medium)",
      fontSize: "var(--text-14)",
      color: "var(--color-brand)",
      padding: 0
    }
  }, action, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "black_arrow_right",
    size: 16
  })));
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/forms/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MyMo Chip — choice/filter chip. 32px tall, 20px radius, 1px border;
 * selected = brand fill + white text (matches the app's ChipChoice style).
 */
function Chip({
  children,
  selected = false,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    style: {
      height: 32,
      padding: "0 16px",
      borderRadius: 20,
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--weight-bold)",
      fontSize: "var(--text-14)",
      lineHeight: 1,
      transition: "all .15s ease",
      color: selected ? "#fff" : "var(--text-primary)",
      background: selected ? "var(--color-brand)" : "transparent",
      border: `1px solid ${selected ? "var(--color-brand)" : "var(--mymo-ink-15)"}`,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Chip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MyMo Input — labelled text field. Outlined (rounded 8px) by default,
 * or variant="underline" for the app's form-row style. Brand focus ring.
 */
function Input({
  label,
  hint,
  error,
  variant = "outline",
  value,
  onChange,
  type = "text",
  style,
  inputStyle,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const borderColor = error ? "var(--mymo-red)" : focused ? "var(--color-brand)" : variant === "outline" ? "var(--border-strong)" : "var(--border-divider)";
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "var(--text-13)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-secondary)",
      marginBottom: 6
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: value,
    onChange: onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      width: "100%",
      height: 48,
      boxSizing: "border-box",
      padding: variant === "outline" ? "0 14px" : "0 2px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-16)",
      color: "var(--text-primary)",
      background: "transparent",
      border: "none",
      borderRadius: variant === "outline" ? "var(--radius-input)" : 0,
      outline: "none",
      ...(variant === "outline" ? {
        border: `1px solid ${borderColor}`
      } : {
        borderBottom: `1.5px solid ${borderColor}`
      }),
      ...inputStyle
    }
  }, rest)), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "var(--text-12)",
      color: error ? "var(--mymo-red)" : "var(--text-tertiary)",
      marginTop: 6
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/PinDots.jsx
try { (() => {
/**
 * MyMo PinDots — the 6-digit passcode indicator used across login,
 * activation and confirm flows. Filled dots = entered digits.
 */
function PinDots({
  length = 6,
  filled = 0,
  error = false,
  dotSize = 16,
  gap = 20,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap,
      alignItems: "center",
      ...style
    }
  }, Array.from({
    length
  }).map((_, i) => {
    const isFilled = i < filled;
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        width: dotSize,
        height: dotSize,
        borderRadius: "50%",
        boxSizing: "border-box",
        transition: "background .15s ease",
        background: isFilled ? error ? "var(--mymo-red)" : "var(--color-brand)" : "transparent",
        border: isFilled ? "none" : `1.5px solid ${error ? "var(--mymo-red)" : "var(--mymo-mid-gray)"}`
      }
    });
  }));
}
Object.assign(__ds_scope, { PinDots });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/PinDots.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MyMo Switch — iOS-style toggle. On = brand crimson track.
 */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    role: "switch",
    "aria-checked": checked,
    disabled: disabled,
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      width: 51,
      height: 31,
      borderRadius: 999,
      border: "none",
      padding: 2,
      cursor: disabled ? "default" : "pointer",
      background: checked ? "var(--color-brand)" : "var(--mymo-mid-gray)",
      opacity: disabled ? 0.5 : 1,
      transition: "background .2s ease",
      display: "inline-flex",
      alignItems: "center",
      boxSizing: "border-box",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 27,
      height: 27,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      transform: checked ? "translateX(20px)" : "translateX(0)",
      transition: "transform .2s ease"
    }
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/BottomTabBar.jsx
try { (() => {
const DEFAULT_TABS = [{
  key: "home",
  label: "Home",
  icon: "tab_home"
}, {
  key: "accounts",
  label: "Accounts",
  icon: "tab_accounts"
}, {
  key: "scan",
  label: "Scan",
  icon: "tab_scan",
  raised: true
}, {
  key: "history",
  label: "History",
  icon: "tab_history"
}, {
  key: "more",
  label: "Settings",
  icon: "tab_more"
}];

/**
 * MyMo BottomTabBar — the fixed 5-tab bottom navigation. The center
 * "Pay by Scan" tab is raised into a brand gradient circle.
 */
function BottomTabBar({
  tabs = DEFAULT_TABS,
  active = "home",
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      height: "var(--size-tabbar)",
      background: "#fff",
      borderTop: "1px solid var(--border-hairline)",
      boxShadow: "0 -2px 12px rgba(150,160,175,0.10)",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, tabs.map(t => {
    const isActive = t.key === active;
    if (t.raised) {
      return /*#__PURE__*/React.createElement("button", {
        key: t.key,
        type: "button",
        onClick: () => onChange && onChange(t.key),
        style: {
          flex: 1,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "6px 0"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          position: "absolute",
          top: -18,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--mymo-grad-btn-start), var(--mymo-grad-btn-end))",
          boxShadow: "var(--elevation-fab)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff"
        }
      }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
        name: t.icon,
        size: 26
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          fontWeight: "var(--weight-medium)",
          color: "var(--text-tertiary)",
          marginTop: 22
        }
      }, t.label));
    }
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      type: "button",
      onClick: () => onChange && onChange(t.key),
      style: {
        flex: 1,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        color: isActive ? "var(--color-brand)" : "var(--text-tertiary)"
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: t.icon,
      size: 24
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: "var(--weight-medium)"
      }
    }, t.label));
  }));
}
Object.assign(__ds_scope, { BottomTabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/BottomTabBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/ListRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * MyMo ListRow — the universal tappable row (accounts, transactions,
 * settings, menus). Leading slot + title/subtitle + trailing slot,
 * with an optional chevron and bottom hairline.
 */
function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  chevron = false,
  divider = true,
  onClick,
  style,
  ...rest
}) {
  const clickable = !!onClick;
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 0",
      cursor: clickable ? "pointer" : "default",
      borderBottom: divider ? "1px solid var(--border-hairline)" : "none",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), leading != null && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      display: "flex"
    }
  }, leading), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-16)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-primary)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, title), subtitle != null && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-13)",
      color: "var(--text-secondary)",
      marginTop: 2,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, subtitle)), trailing != null && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      textAlign: "right"
    }
  }, trailing), chevron && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "black_arrow_right",
    size: 18,
    color: "var(--mymo-mid-gray)"
  }));
}
Object.assign(__ds_scope, { ListRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/ListRow.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TopBar.jsx
try { (() => {
/**
 * MyMo TopBar — the 56px screen header. Plain (white) or variant="gradient"
 * for the pink brand header. Optional back button + trailing action icons.
 */
function TopBar({
  title,
  variant = "plain",
  onBack,
  actions = [],
  style
}) {
  const gradient = variant === "gradient";
  const fg = gradient ? "#fff" : "var(--text-primary)";
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: "var(--size-toolbar)",
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "0 8px",
      boxSizing: "border-box",
      color: fg,
      fontFamily: "var(--font-sans)",
      background: gradient ? "linear-gradient(180deg, var(--mymo-grad-primary-start), var(--mymo-grad-primary-end))" : "#fff",
      ...style
    }
  }, onBack && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onBack,
    "aria-label": "Back",
    style: {
      width: 40,
      height: 40,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      color: fg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: "scaleX(-1)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "black_arrow_right",
    size: 22
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      flex: 1,
      margin: 0,
      padding: onBack ? 0 : "0 8px",
      fontSize: "var(--text-18)",
      fontWeight: "var(--weight-bold)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, actions.map((a, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    onClick: a.onClick,
    "aria-label": a.label,
    style: {
      width: 40,
      height: 40,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      color: fg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: a.icon,
    size: 22
  })))));
}
Object.assign(__ds_scope, { TopBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TopBar.jsx", error: String((e && e.message) || e) }); }

// flows/activation/app.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* MyMo Activation — flow controller, transitions, tweaks */

const STEP_ACCENT = {
  1: "#EA6B7A",
  // Terms
  2: "#D83152",
  // Citizen ID — brand
  3: "#2796E5",
  // Request OTP
  4: "#2796E5",
  // Validate OTP
  5: "#2CA87C",
  // Set passcode
  6: "#FF9500" // Confirm passcode
};
const PHONE_DISPLAY = "08X-XXX-XX42";
const REF_CODE = " MYMO";
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "progress": "dots",
  "perStepAccent": false,
  "motion": "slide"
} /*EDITMODE-END*/;
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [citizenId, setCitizenId] = useState("");
  const [pin, setPin] = useState("");
  const go = next => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };
  const reset = () => {
    setCitizenId("");
    setPin("");
    setDir(-1);
    setStep(0);
  };
  useEffect(() => {
    window.__actGo = n => {
      setDir(n > step ? 1 : -1);
      setStep(n);
    };
    window.__actFill = cid => setCitizenId(cid);
  });
  const accentRaw = STEP_ACCENT[step] || "var(--color-brand)";
  // `accent` drives both the header progress fill and the soft blob behind the
  // title. When the per-step tweak is off we want neither tinted → null falls back
  // to brand inside ActHeader and hides the blob inside Lead.
  const accent = t.perStepAccent ? accentRaw : null;
  const hdr = {
    progressStyle: t.progress,
    accent
  };
  const dark = !(step === 0 || step === 7);
  let scene;
  switch (step) {
    case 0:
      scene = /*#__PURE__*/React.createElement(WelcomeScreen, {
        onStart: () => go(1)
      });
      break;
    case 1:
      scene = /*#__PURE__*/React.createElement(TermsScreen, _extends({
        onBack: () => go(0),
        onAccept: () => go(2)
      }, hdr));
      break;
    case 2:
      scene = /*#__PURE__*/React.createElement(CitizenIdScreen, _extends({
        onBack: () => go(1),
        onNext: () => go(3),
        value: citizenId,
        setValue: setCitizenId
      }, hdr));
      break;
    case 3:
      scene = /*#__PURE__*/React.createElement(RequestOtpScreen, _extends({
        onBack: () => go(2),
        onNext: () => go(4),
        phone: PHONE_DISPLAY
      }, hdr));
      break;
    case 4:
      scene = /*#__PURE__*/React.createElement(ValidateOtpScreen, _extends({
        onBack: () => go(3),
        onNext: () => go(5),
        phone: PHONE_DISPLAY,
        refCode: REF_CODE
      }, hdr));
      break;
    case 5:
      scene = /*#__PURE__*/React.createElement(PasscodeScreen, _extends({
        mode: "set",
        onBack: () => go(4),
        onNext: p => {
          setPin(p);
          go(6);
        }
      }, hdr));
      break;
    case 6:
      scene = /*#__PURE__*/React.createElement(PasscodeScreen, _extends({
        mode: "confirm",
        target: pin,
        onBack: () => {
          setPin("");
          go(5);
        },
        onDone: () => go(7)
      }, hdr));
      break;
    case 7:
      scene = /*#__PURE__*/React.createElement(DoneScreen, {
        onRestart: reset
      });
      break;
    default:
      scene = /*#__PURE__*/React.createElement(WelcomeScreen, {
        onStart: () => go(1)
      });
  }
  const animClass = t.motion === "none" ? "" : step === 0 || step === 7 ? "anim-fade" : dir > 0 ? "anim-fwd" : "anim-back";
  return /*#__PURE__*/React.createElement("div", {
    className: "phone"
  }, /*#__PURE__*/React.createElement("div", {
    className: "notch"
  }), /*#__PURE__*/React.createElement(ActStatusBar, {
    dark: dark
  }), /*#__PURE__*/React.createElement("div", {
    className: "appframe"
  }, /*#__PURE__*/React.createElement("div", {
    key: step,
    className: "scene " + animClass
  }, scene)), /*#__PURE__*/React.createElement("div", {
    className: "home-indicator" + (dark ? "" : " light")
  }), /*#__PURE__*/React.createElement(TweaksPanel, null, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Progress indicator"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Style",
    value: t.progress,
    options: ["dots", "bar", "none"],
    onChange: v => setTweak("progress", v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Theme"
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Accent colour per step",
    value: t.perStepAccent,
    onChange: v => setTweak("perStepAccent", v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Motion"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Transition",
    value: t.motion,
    options: ["slide", "none"],
    onChange: v => setTweak("motion", v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Jump to step"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 6
    }
  }, [["Welcome", 0], ["Terms", 1], ["ID", 2], ["Req OTP", 3], ["OTP", 4], ["Set PIN", 5], ["Confirm", 6], ["Done", 7]].map(([lbl, n]) => /*#__PURE__*/React.createElement("button", {
    key: n,
    onClick: () => go(n),
    style: {
      padding: "7px 4px",
      fontSize: 11,
      borderRadius: 8,
      cursor: "pointer",
      border: "1px solid " + (step === n ? "var(--color-brand)" : "rgba(0,0,0,0.12)"),
      background: step === n ? "var(--mymo-pastel-pink)" : "#fff",
      color: step === n ? "var(--color-brand)" : "var(--text-secondary)",
      fontWeight: step === n ? 700 : 500,
      fontFamily: "var(--font-sans)"
    }
  }, lbl)))));
}
function scaleStage() {
  const phone = document.querySelector(".phone");
  if (!phone) return;
  const pad = 24;
  const s = Math.min(1, (window.innerHeight - pad) / 800, (window.innerWidth - pad) / 390);
  phone.style.transform = `scale(${s})`;
}
window.addEventListener("resize", () => requestAnimationFrame(scaleStage));
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
setTimeout(scaleStage, 60);
})(); } catch (e) { __ds_ns.__errors.push({ path: "flows/activation/app.jsx", error: String((e && e.message) || e) }); }

// flows/activation/parts.jsx
try { (() => {
/* MyMo Activation — shared parts: status bar, progress, keypad, buttons, OTP boxes */
const {
  useState,
  useEffect,
  useRef,
  Fragment
} = React;

/* ---------- Status bar (matches UI kit) ---------- */
function ActStatusBar({
  dark
}) {
  const c = dark ? "var(--text-primary)" : "#fff";
  return /*#__PURE__*/React.createElement("div", {
    className: "statusbar",
    style: {
      color: c
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
    className: "right"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "12",
    viewBox: "0 0 18 12",
    fill: c
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7",
    width: "3",
    height: "5",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "4",
    width: "3",
    height: "8",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "10",
    y: "1.5",
    width: "3",
    height: "10.5",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "15",
    y: "0",
    width: "3",
    height: "12",
    rx: "1",
    opacity: "0.4"
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12",
    fill: c
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 2.5c2.1 0 4 .8 5.4 2.1l1.3-1.4C13.4 1.5 11 .5 8.5.5S3.6 1.5 1.8 3.2l1.3 1.4C4.5 3.3 6.4 2.5 8.5 2.5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6c1.1 0 2.1.4 2.8 1.2l1.3-1.4C11.5 4.7 10.1 4 8.5 4s-3 .7-4.1 1.8l1.3 1.4C6.4 6.4 7.4 6 8.5 6z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "9.5",
    r: "1.8"
  })), /*#__PURE__*/React.createElement("svg", {
    width: "26",
    height: "12",
    viewBox: "0 0 26 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "21",
    height: "11",
    rx: "3",
    stroke: c,
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "16",
    height: "8",
    rx: "1.5",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "23",
    y: "3.5",
    width: "2",
    height: "5",
    rx: "1",
    fill: c,
    opacity: "0.5"
  }))));
}

/* ---------- Activation header: back arrow + step progress ---------- */
function ActHeader({
  onBack,
  step,
  total,
  progressStyle,
  accent
}) {
  const {
    Icon
  } = window.MyMoKit;
  const a = accent || "var(--color-brand)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 50,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 52,
      display: "flex",
      alignItems: "center",
      padding: "0 6px"
    }
  }, onBack ? /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    "aria-label": "Back",
    className: "tap",
    style: {
      width: 44,
      height: 44,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      color: "var(--text-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: "scaleX(-1)",
      borderRadius: "50%"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "black_arrow_right",
    size: 24
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), progressStyle !== "none" && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-tertiary)",
      paddingRight: 16,
      letterSpacing: ".02em"
    }
  }, step, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.5
    }
  }, "/ ", total))), progressStyle === "bar" && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      background: "var(--mymo-border-line)",
      margin: "2px 24px 0",
      borderRadius: 4,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${step / total * 100}%`,
      height: "100%",
      background: a,
      borderRadius: 4,
      transition: "width .4s cubic-bezier(.22,.61,.36,1)"
    }
  })), progressStyle === "dots" && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      justifyContent: "center",
      paddingTop: 4
    }
  }, Array.from({
    length: total
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      height: 6,
      borderRadius: 4,
      transition: "all .35s ease",
      width: i === step - 1 ? 22 : 6,
      background: i < step ? a : "var(--mymo-mid-gray)",
      opacity: i < step ? 1 : 0.5
    }
  }))));
}

/* ---------- Signature activation "Next" pill: gradient border, transparent fill ---------- */
function NextPill({
  label = "Next",
  enabled = true,
  onClick,
  surface = "var(--surface-app)"
}) {
  return /*#__PURE__*/React.createElement("button", {
    disabled: !enabled,
    onClick: () => enabled && onClick && onClick(),
    className: "tap",
    style: {
      height: 48,
      minWidth: 200,
      padding: 2,
      borderRadius: "var(--radius-button)",
      border: "none",
      cursor: enabled ? "pointer" : "default",
      background: enabled ? "linear-gradient(90deg, var(--mymo-grad-btn-start), var(--mymo-grad-btn-end))" : "var(--mymo-mid-gray)",
      boxShadow: enabled ? "0 6px 18px rgba(241,70,88,0.20)" : "none",
      transition: "background .2s ease, box-shadow .2s ease"
    },
    onMouseDown: e => enabled && (e.currentTarget.style.transform = "scale(0.98)"),
    onMouseUp: e => e.currentTarget.style.transform = "",
    onMouseLeave: e => e.currentTarget.style.transform = ""
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      borderRadius: "calc(var(--radius-button) - 2px)",
      padding: "0 38px",
      background: surface,
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--weight-bold)",
      fontSize: "var(--text-18)",
      color: enabled ? "var(--color-brand)" : "rgba(0,0,0,0.26)"
    }
  }, label));
}

/* ---------- Custom in-app numeric keypad (iOS-dialer styling) ---------- */
function NumberPad({
  onKey,
  onDelete,
  disabled
}) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      background: "#fff",
      borderTop: "1px solid var(--border-hairline)",
      padding: "10px 22px calc(10px + env(safe-area-inset-bottom))",
      boxShadow: "0 -3px 18px rgba(150,160,175,0.10)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      rowGap: 4,
      columnGap: 8,
      maxWidth: 320,
      margin: "0 auto"
    }
  }, keys.map((k, i) => k === "" ? /*#__PURE__*/React.createElement("div", {
    key: i
  }) : /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "tap",
    onClick: () => {
      if (disabled) return;
      k === "del" ? onDelete() : onKey(k);
    },
    style: {
      height: 54,
      border: "none",
      background: "transparent",
      borderRadius: 14,
      cursor: disabled ? "default" : "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: k === "del" ? 22 : 28,
      fontWeight: "var(--weight-medium)",
      color: "var(--text-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    onMouseDown: e => !disabled && (e.currentTarget.style.background = "#ECEEF2"),
    onMouseUp: e => e.currentTarget.style.background = "transparent",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, k === "del" ? "⌫" : k))));
}

/* ---------- OTP boxes (5-digit) ---------- */
function OtpBoxes({
  length = 5,
  value = "",
  error = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      justifyContent: "center"
    }
  }, Array.from({
    length
  }).map((_, i) => {
    const ch = value[i];
    const active = i === value.length;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 48,
        height: 60,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
        fontWeight: "var(--weight-bold)",
        color: "var(--text-primary)",
        background: "#fff",
        border: `1.5px solid ${error ? "var(--mymo-red)" : ch ? "var(--color-brand)" : active ? "var(--color-brand)" : "var(--border-strong)"}`,
        boxShadow: active && !ch ? "0 0 0 3px var(--mymo-primary-12)" : "none",
        transition: "border-color .15s ease, box-shadow .15s ease"
      }
    }, ch || "");
  }));
}

/* ---------- Pink concentric-ring background (welcome / done) ---------- */
function RingsBg({
  children,
  tone = "pink"
}) {
  const grad = tone === "pink" ? "linear-gradient(157deg, #FC7C96 0%, #E33A5C 55%, #D2274C 100%)" : "linear-gradient(157deg, #FC7C96 0%, #E33A5C 55%, #D2274C 100%)";
  const ring = s => ({
    position: "absolute",
    borderRadius: "50%",
    border: "solid rgba(255,255,255,0.13)",
    ...s
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: grad,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: ring({
      width: 300,
      height: 300,
      borderWidth: 42,
      top: -120,
      right: -90
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: ring({
      width: 210,
      height: 210,
      borderWidth: 34,
      top: 250,
      right: -120
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: ring({
      width: 340,
      height: 340,
      borderWidth: 50,
      bottom: -160,
      left: -140
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: ring({
      width: 150,
      height: 150,
      borderWidth: 26,
      bottom: 120,
      right: 30,
      opacity: 0.7
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0
    }
  }, children));
}

/* ---------- MyMo wordmark (from kit icon registry) ---------- */
function MyMoLogo({
  width = 132,
  color = "#fff"
}) {
  const {
    Icon
  } = window.MyMoKit;
  const height = width * (54.556 / 159);
  return /*#__PURE__*/React.createElement(Icon, {
    name: "mymo_logo",
    size: width,
    style: {
      width,
      height,
      color
    }
  });
}
Object.assign(window, {
  ActStatusBar,
  ActHeader,
  NextPill,
  NumberPad,
  OtpBoxes,
  RingsBg,
  MyMoLogo
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "flows/activation/parts.jsx", error: String((e && e.message) || e) }); }

// flows/activation/screens.jsx
try { (() => {
/* MyMo Activation — the eight screens */
const ACT_TOTAL = 6; // Terms(1) … Confirm passcode(6); Welcome & Done are uncounted

/* shared title block */
function Lead({
  title,
  subtitle,
  accent,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "10px 30px 0"
    }
  }, accent && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: -26,
      left: 6,
      width: 96,
      height: 96,
      borderRadius: "50%",
      background: accent,
      opacity: 0.22,
      filter: "blur(8px)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      position: "relative",
      margin: 0,
      fontSize: 27,
      lineHeight: 1.18,
      fontWeight: "var(--weight-bold)",
      color: "var(--text-primary)",
      letterSpacing: "-0.01em"
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      position: "relative",
      margin: "10px 0 0",
      fontSize: 15.5,
      lineHeight: 1.5,
      color: "var(--text-secondary)"
    }
  }, subtitle), children);
}
function fmtThaiId(d) {
  const dash = new Set([1, 5, 10, 12]);
  let out = "";
  for (let i = 0; i < d.length; i++) {
    if (dash.has(i)) out += " - ";
    out += d[i];
  }
  return out;
}

/* ============ 0 · WELCOME ============ */
function WelcomeScreen({
  onStart
}) {
  const langBtn = (label, sub, primary) => /*#__PURE__*/React.createElement("button", {
    onClick: onStart,
    className: "tap",
    style: {
      width: "100%",
      height: 60,
      borderRadius: 30,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      border: primary ? "none" : "1.5px solid rgba(255,255,255,0.7)",
      background: primary ? "#fff" : "rgba(255,255,255,0.10)",
      color: primary ? "var(--color-brand)" : "#fff",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--weight-bold)",
      fontSize: 18,
      backdropFilter: primary ? "none" : "blur(2px)"
    },
    onMouseDown: e => e.currentTarget.style.transform = "scale(0.985)",
    onMouseUp: e => e.currentTarget.style.transform = "",
    onMouseLeave: e => e.currentTarget.style.transform = ""
  }, label, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: "var(--weight-regular)",
      opacity: 0.6,
      fontSize: 15
    }
  }, sub));
  return /*#__PURE__*/React.createElement("div", {
    className: "scene"
  }, /*#__PURE__*/React.createElement(RingsBg, null, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "150px 32px 40px",
      boxSizing: "border-box",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 18,
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement(MyMoLogo, {
    width: 158,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: "var(--weight-medium)",
      letterSpacing: ".01em",
      opacity: 0.95,
      whiteSpace: "nowrap",
      lineHeight: 1.3
    }
  }, "Government Savings Bank"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      opacity: 0.7,
      marginTop: 8,
      letterSpacing: ".22em",
      textTransform: "uppercase",
      whiteSpace: "nowrap"
    }
  }, "Mobile Banking"))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontSize: 14,
      opacity: 0.8,
      marginBottom: 2
    }
  }, "Choose your language to begin"), langBtn("English", "", true), langBtn("ภาษาไทย", "Thai", false)))));
}

/* ============ 1 · TERMS & CONDITIONS ============ */
const TERMS_SECTIONS = [["1. Acceptance", "By activating MyMo you agree to use the service in accordance with these terms and the regulations of the Government Savings Bank (GSB). Please read them carefully before continuing."], ["2. Your account", "MyMo links to the deposit and loan accounts registered under your Citizen ID. You are responsible for keeping your device, passcode and one-time passwords confidential at all times."], ["3. Security", "MyMo may verify your identity through OTP, biometric or face recognition. The Bank applies runtime protection and may suspend access if unusual or unsafe activity is detected on your device."], ["4. Personal data (PDPA)", "Your information is collected, used and protected in line with the Personal Data Protection Act B.E. 2562. We use it only to provide and improve MyMo services and never share it without a lawful basis."], ["5. Fees & limits", "Transaction limits and any applicable fees follow the Bank's published schedule. The Bank may adjust limits to protect you against fraud and will notify you of material changes in advance."], ["6. Liability", "The Bank takes reasonable care to keep MyMo available, but is not liable for interruptions beyond its control. Report a lost device or suspected fraud to the GSB Contact Center immediately."]];
function TermsScreen({
  onBack,
  onAccept,
  progressStyle,
  accent
}) {
  const [accepted, setAccepted] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "scene",
    style: {
      background: "var(--surface-app)"
    }
  }, /*#__PURE__*/React.createElement(ActHeader, {
    onBack: onBack,
    step: 1,
    total: ACT_TOTAL,
    progressStyle: progressStyle,
    accent: accent
  }), /*#__PURE__*/React.createElement(Lead, {
    title: "Terms & Conditions",
    subtitle: "Please review and accept to continue activating MyMo.",
    accent: accent
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      margin: "16px 18px 0",
      padding: "18px 18px 14px",
      background: "#fff",
      borderRadius: 16,
      boxShadow: "var(--elevation-card)"
    }
  }, TERMS_SECTIONS.map(([h, b], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: "var(--weight-bold)",
      color: "var(--text-primary)",
      marginBottom: 5
    }
  }, h), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      lineHeight: 1.55,
      color: "var(--text-secondary)"
    }
  }, b)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 24px calc(20px + env(safe-area-inset-bottom))",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setAccepted(!accepted),
    className: "tap",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      width: "100%",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: "4px 0 14px",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      borderRadius: 7,
      flex: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: accepted ? "none" : "1.5px solid var(--border-strong)",
      background: accepted ? "var(--color-brand)" : "transparent",
      transition: "all .15s ease"
    }
  }, accepted && /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 7.5l3 3 6-7",
    stroke: "#fff",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14.5,
      color: "var(--text-primary)",
      fontWeight: "var(--weight-medium)"
    }
  }, "I have read and accept the Terms & Conditions")), /*#__PURE__*/React.createElement("button", {
    onClick: () => accepted && onAccept(),
    disabled: !accepted,
    className: "tap",
    style: {
      width: "100%",
      height: 52,
      borderRadius: 26,
      border: "none",
      cursor: accepted ? "pointer" : "default",
      color: "#fff",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--weight-bold)",
      fontSize: 18,
      background: accepted ? "linear-gradient(90deg, var(--mymo-grad-btn-start), var(--mymo-grad-btn-end))" : "var(--mymo-mid-gray)",
      boxShadow: accepted ? "0 8px 20px rgba(241,70,88,0.22)" : "none",
      transition: "background .2s ease, box-shadow .2s ease"
    }
  }, "Accept & Continue")));
}

/* ============ 2 · CITIZEN ID ============ */
function CitizenIdScreen({
  onBack,
  onNext,
  progressStyle,
  accent,
  value,
  setValue
}) {
  const valid = value.length === 13;
  const key = k => value.length < 13 && setValue(value + k);
  const del = () => setValue(value.slice(0, -1));
  return /*#__PURE__*/React.createElement("div", {
    className: "scene",
    style: {
      background: "var(--surface-app)"
    }
  }, /*#__PURE__*/React.createElement(ActHeader, {
    onBack: onBack,
    step: 2,
    total: ACT_TOTAL,
    progressStyle: progressStyle,
    accent: accent
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(Lead, {
    title: "Please enter your Citizen ID",
    subtitle: "Enter the 13-digit number on your Thai national ID card.",
    accent: accent
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "0 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: value.length > 9 ? 26 : 30,
      fontWeight: "var(--weight-bold)",
      letterSpacing: ".01em",
      color: "var(--text-primary)",
      fontVariantNumeric: "tabular-nums",
      minHeight: 38,
      display: "flex",
      alignItems: "center"
    }
  }, value.length === 0 ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--mymo-mid-gray)",
      fontWeight: "var(--weight-regular)"
    }
  }, "X - XXXX - XXXXX - XX - X") : fmtThaiId(value), value.length > 0 && value.length < 13 && /*#__PURE__*/React.createElement("span", {
    className: "caret",
    style: {
      display: "inline-block",
      width: 2,
      height: 28,
      background: "var(--color-brand)",
      marginLeft: 4
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "min(320px, 80%)",
      height: 1.5,
      background: "var(--border-strong)",
      marginTop: 18
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--text-tertiary)",
      marginTop: 12
    }
  }, value.length, " / 13 digits")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      padding: "6px 0 16px",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(NextPill, {
    label: "Next",
    enabled: valid,
    onClick: onNext
  }))), /*#__PURE__*/React.createElement(NumberPad, {
    onKey: key,
    onDelete: del
  }));
}

/* ============ 3 · REQUEST OTP ============ */
function RequestOtpScreen({
  onBack,
  onNext,
  progressStyle,
  accent,
  phone
}) {
  const {
    Icon
  } = window.MyMoKit;
  return /*#__PURE__*/React.createElement("div", {
    className: "scene",
    style: {
      background: "var(--surface-app)"
    }
  }, /*#__PURE__*/React.createElement(ActHeader, {
    onBack: onBack,
    step: 3,
    total: ACT_TOTAL,
    progressStyle: progressStyle,
    accent: accent
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(Lead, {
    title: "Request OTP",
    subtitle: "We'll send a one-time password to the mobile number registered with your account.",
    accent: accent
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "0 32px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 78,
      height: 78,
      borderRadius: "50%",
      background: "var(--surface-pink-soft)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "hotkey_payment",
    size: 40,
    color: "var(--color-brand)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      letterSpacing: ".16em",
      textTransform: "uppercase",
      color: "var(--text-tertiary)",
      fontWeight: "var(--weight-semibold)"
    }
  }, "Your mobile number"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      fontWeight: "var(--weight-bold)",
      color: "var(--text-primary)",
      marginTop: 8,
      fontVariantNumeric: "tabular-nums"
    }
  }, phone), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: "center",
      fontSize: 13.5,
      color: "var(--text-secondary)",
      lineHeight: 1.5,
      marginTop: 18
    }
  }, "Not your number? Please contact the GSB Contact Center to update your details.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 24px calc(28px + env(safe-area-inset-bottom))",
      flex: "none",
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onNext,
    className: "tap",
    style: {
      width: "100%",
      maxWidth: 320,
      height: 52,
      borderRadius: 26,
      border: "none",
      cursor: "pointer",
      color: "#fff",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--weight-bold)",
      fontSize: 18,
      background: "linear-gradient(90deg, var(--mymo-grad-btn-start), var(--mymo-grad-btn-end))",
      boxShadow: "0 8px 20px rgba(241,70,88,0.22)"
    }
  }, "Send OTP"))));
}

/* ============ 4 · VALIDATE OTP ============ */
function ValidateOtpScreen({
  onBack,
  onNext,
  progressStyle,
  accent,
  phone,
  refCode
}) {
  const [otp, setOtp] = useState("");
  const [remaining, setRemaining] = useState(179);
  const valid = otp.length === 5;
  useEffect(() => {
    if (remaining <= 0) return;
    const t = setInterval(() => setRemaining(r => r > 0 ? r - 1 : 0), 1000);
    return () => clearInterval(t);
  }, [remaining]);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const key = k => otp.length < 5 && setOtp(otp + k);
  const del = () => setOtp(otp.slice(0, -1));
  return /*#__PURE__*/React.createElement("div", {
    className: "scene",
    style: {
      background: "var(--surface-app)"
    }
  }, /*#__PURE__*/React.createElement(ActHeader, {
    onBack: onBack,
    step: 4,
    total: ACT_TOTAL,
    progressStyle: progressStyle,
    accent: accent
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(Lead, {
    title: "Enter OTP",
    accent: accent,
    subtitle: /*#__PURE__*/React.createElement("span", null, "Enter the 5-digit code sent to ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "var(--text-primary)"
      }
    }, phone))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "0 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-tertiary)",
      marginBottom: 22
    }
  }, "Reference code: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--text-secondary)"
    }
  }, refCode)), /*#__PURE__*/React.createElement(OtpBoxes, {
    length: 5,
    value: otp
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26,
      fontSize: 14,
      color: "var(--text-secondary)",
      height: 22
    }
  }, remaining > 0 ? /*#__PURE__*/React.createElement("span", null, "Request again in ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "var(--text-primary)",
      fontVariantNumeric: "tabular-nums"
    }
  }, mm, ":", ss)) : /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setRemaining(179);
      setOtp("");
    },
    style: {
      border: "none",
      background: "transparent",
      color: "var(--color-brand)",
      fontWeight: "var(--weight-bold)",
      fontSize: 15,
      cursor: "pointer"
    }
  }, "Resend OTP"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      padding: "6px 0 16px",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(NextPill, {
    label: "Verify",
    enabled: valid,
    onClick: onNext
  }))), /*#__PURE__*/React.createElement(NumberPad, {
    onKey: key,
    onDelete: del
  }));
}

/* ============ 5/6 · SET & CONFIRM PASSCODE ============ */
function PasscodeScreen({
  mode,
  onBack,
  onNext,
  onDone,
  onMismatch,
  progressStyle,
  accent,
  target
}) {
  const {
    PinDots
  } = window.MyMoKit;
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const isConfirm = mode === "confirm";
  const lockRef = useRef(false);
  const key = k => {
    if (lockRef.current || pin.length >= 6) return;
    const next = pin + k;
    setError(false);
    setPin(next);
    if (next.length === 6) {
      lockRef.current = true;
      setTimeout(() => {
        if (!isConfirm) {
          onNext(next);
        } else if (next === target) {
          onDone();
        } else {
          setError(true);
          setTimeout(() => {
            setPin("");
            setError(false);
            lockRef.current = false;
          }, 650);
          return;
        }
      }, 240);
    }
  };
  const del = () => {
    if (!lockRef.current) {
      setError(false);
      setPin(pin.slice(0, -1));
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "scene",
    style: {
      background: "var(--surface-app)"
    }
  }, /*#__PURE__*/React.createElement(ActHeader, {
    onBack: onBack,
    step: isConfirm ? 6 : 5,
    total: ACT_TOTAL,
    progressStyle: progressStyle,
    accent: accent
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(Lead, {
    accent: accent,
    title: isConfirm ? "Confirm your passcode" : "Set your passcode",
    subtitle: isConfirm ? "Re-enter your 6-digit passcode to confirm." : "Please set a 6-digit passcode you'll use to sign in to MyMo."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "0 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: error ? "act-shake" : ""
  }, /*#__PURE__*/React.createElement(PinDots, {
    length: 6,
    filled: pin.length,
    error: error,
    dotSize: 17,
    gap: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 22,
      marginTop: 22,
      fontSize: 14,
      color: "var(--mymo-red)",
      fontWeight: "var(--weight-medium)"
    }
  }, error ? "Passcode doesn't match. Please try again." : "")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: 24,
      marginBottom: 8,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--text-tertiary)"
    }
  }, "Avoid 123456 or repeated digits"))), /*#__PURE__*/React.createElement(NumberPad, {
    onKey: key,
    onDelete: del,
    disabled: lockRef.current && !error
  }));
}

/* ============ 7 · ALL DONE ============ */
function DoneScreen({
  onRestart
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "scene"
  }, /*#__PURE__*/React.createElement(RingsBg, null, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 36px",
      boxSizing: "border-box",
      color: "#fff",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "act-pop",
    style: {
      width: 108,
      height: 108,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.16)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 78,
      height: 78,
      borderRadius: "50%",
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "42",
    height: "42",
    viewBox: "0 0 42 42",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    className: "act-check",
    d: "M11 21.5l6.5 6.5L31 13",
    stroke: "var(--color-brand)",
    strokeWidth: "4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })))), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 32,
      fontWeight: "var(--weight-bold)"
    }
  }, "All Done!"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "14px 0 0",
      fontSize: 16,
      lineHeight: 1.5,
      opacity: 0.92
    }
  }, "You've activated MyMo successfully\xA0:)", /*#__PURE__*/React.createElement("br", null), "Welcome to the GSB family."), /*#__PURE__*/React.createElement("button", {
    onClick: onRestart,
    className: "tap",
    style: {
      marginTop: 44,
      width: "100%",
      maxWidth: 300,
      height: 56,
      borderRadius: 28,
      border: "none",
      cursor: "pointer",
      background: "#fff",
      color: "var(--color-brand)",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--weight-bold)",
      fontSize: 18
    }
  }, "Start Banking"))));
}
Object.assign(window, {
  WelcomeScreen,
  TermsScreen,
  CitizenIdScreen,
  RequestOtpScreen,
  ValidateOtpScreen,
  PasscodeScreen,
  DoneScreen,
  ACT_TOTAL
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "flows/activation/screens.jsx", error: String((e && e.message) || e) }); }

// flows/activation/tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "flows/activation/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mymo_app/data.js
try { (() => {
/* MyMo UI kit — shared mock data (Thai retail-bank flavoured) */
window.MyMoData = {
  user: {
    name: "Suda Kittirat",
    first: "Suda",
    points: 1280
  },
  accounts: [{
    id: "sav1",
    group: "Savings",
    name: "Everyday Savings",
    no: "020-1-84512-8",
    mask: "••8512",
    balance: 128540.0,
    color: "saving"
  }, {
    id: "sav2",
    group: "Savings",
    name: "Tax Saver",
    no: "020-1-77310-2",
    mask: "••3102",
    balance: 45200.5,
    color: "saving"
  }, {
    id: "cur1",
    group: "Current",
    name: "Current Plus",
    no: "020-9-11234-0",
    mask: "••1234",
    balance: 12890.75,
    color: "fixed"
  }, {
    id: "fix1",
    group: "Fixed Deposit",
    name: "Digital Salak",
    no: "020-3-40021-5",
    mask: "••0021",
    balance: 200000.0,
    color: "salak"
  }, {
    id: "loan1",
    group: "Loan",
    name: "AimJai Loan",
    no: "020-7-22190-9",
    mask: "••1909",
    balance: -85000.0,
    color: "loan"
  }],
  tx: [{
    id: 1,
    who: "Salary — GSB Co., Ltd.",
    note: "Incoming transfer",
    when: "Today, 09:42",
    amount: 38500,
    icon: "transfer_landing",
    status: "Successful"
  }, {
    id: 2,
    who: "Suda Kittirat",
    note: "PromptPay transfer",
    when: "Today, 08:15",
    amount: -1250.5,
    icon: "transfer_landing"
  }, {
    id: 3,
    who: "MEA Electricity",
    note: "Bill Payment",
    when: "Yesterday",
    amount: -540.0,
    icon: "book_dstatement"
  }, {
    id: 4,
    who: "7-Eleven 12345",
    note: "Pay by Scan",
    when: "Yesterday",
    amount: -89.0,
    icon: "billscan"
  }, {
    id: 5,
    who: "AIS 12Call",
    note: "Top Up",
    when: "2 Jun",
    amount: -300.0,
    icon: "hotkey_payment"
  }, {
    id: 6,
    who: "Digital Salak",
    note: "Savings deposit",
    when: "1 Jun",
    amount: -2000.0,
    icon: "digitalsalak_deposit"
  }],
  favorites: [{
    id: "f1",
    name: "Mom",
    mask: "Krungthai ••4521"
  }, {
    id: "f2",
    name: "Nattapong",
    mask: "MyMo ••8830"
  }, {
    id: "f3",
    name: "Rent",
    mask: "GSB ••1190"
  }],
  catColor: {
    saving: ["var(--mymo-cat-saving)", "var(--mymo-cat-saving-grad)"],
    fixed: ["var(--mymo-cat-fixed)", "var(--mymo-cat-fixed-grad)"],
    salak: ["var(--mymo-cat-salak)", "var(--mymo-cat-salak-grad)"],
    loan: ["var(--mymo-cat-loan)", "var(--mymo-cat-loan-grad)"],
    life: ["var(--mymo-cat-life)", "var(--mymo-cat-life-grad)"]
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mymo_app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/mymo_app/mymo-kit.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * MyMo UI Kit — self-contained component library.
 * Mirrors the canonical primitives in /components, bundled here without ES
 * exports so the kit renders standalone (no _ds_bundle dependency).
 * Loaded via <script type="text/babel" src="mymo-kit.jsx">; React must be global.
 */
const {
  useState,
  useRef,
  useEffect,
  Fragment
} = React;

// ===== components/core/Icon.jsx =====

/**
 * MyMo icon registry — the app's own vector drawables, inlined as SVG
 * so they tint via `color` (currentColor) and render reliably everywhere.
 */
const MYMO_ICONS = {
  "arrow": {
    vb: "0 0 28 15.709",
    p: "<path d=\"M28,7.849a2.005,2.005 0,0 1,-0.77 1.58l-6.53,5.78a2.039,2.039 0,0 1,-1.33 0.5,2 2,0 0,1 -1.32,-3.5l2.67,-2.36L2,9.849a2,2 0,0 1,0 -4h18.71l-2.66,-2.35a2,2 0,1 1,2.65 -3l6.57,5.81a2.076,2.076 0,0 1,0.45 0.53,1.14 1.14,0 0,1 0.1,0.19 1.871,1.871 0,0 1,0.13 0.4,0.467 0.467,0 0,1 0.03,0.17A1.954,1.954 0,0 1,28 7.849Z\" fill=\"currentColor\"></path>"
  },
  "billscan": {
    vb: "0 0 55.999 56.002",
    p: "<path d=\"M53.281,25.184h-50.57a2.83,2.83 0,0 0,0 5.634L53.281,30.818a2.83,2.83 0,0 0,0 -5.634Z\" fill=\"currentColor\"></path><path d=\"M2.816,19.013a2.82,2.82 0,0 0,2.817 -2.817v-6.6a3.961,3.961 0,0 1,3.956 -3.959h10.055a2.817,2.817 0,0 0,0 -5.634L9.589,0.003a9.6,9.6 0,0 0,-9.59 9.593v6.6A2.82,2.82 0,0 0,2.816 19.013Z\" fill=\"currentColor\"></path><path d=\"M36.353,5.634h10.145a3.871,3.871 0,0 1,3.864 3.866v6.7a2.817,2.817 0,1 0,5.634 0v-6.7a9.511,9.511 0,0 0,-9.5 -9.5L36.353,0a2.817,2.817 0,1 0,0 5.634Z\" fill=\"currentColor\"></path><path d=\"M53.182,36.992a2.82,2.82 0,0 0,-2.817 2.817v6.7a3.867,3.867 0,0 1,-3.862 3.864L36.356,50.373a2.817,2.817 0,1 0,0 5.634h10.148a9.507,9.507 0,0 0,9.5 -9.5v-6.7A2.82,2.82 0,0 0,53.182 36.992Z\" fill=\"currentColor\"></path><path d=\"M19.645,50.372h-10.15a3.867,3.867 0,0 1,-3.861 -3.864v-6.7a2.817,2.817 0,1 0,-5.634 0v6.7a9.506,9.506 0,0 0,9.5 9.5h10.15a2.817,2.817 0,0 0,0 -5.634Z\" fill=\"currentColor\"></path>"
  },
  "black_arrow_right": {
    vb: "0 0 20 20",
    p: "<path d=\"M7.287,14.772C7.04,14.493 7.066,14.066 7.345,13.818L11.641,10.016L7.343,6.18C7.065,5.931 7.04,5.504 7.289,5.226C7.537,4.947 7.964,4.923 8.243,5.172L13.108,9.514C13.252,9.642 13.334,9.826 13.333,10.019C13.333,10.212 13.25,10.396 13.106,10.524L8.241,14.83C7.961,15.078 7.534,15.052 7.287,14.772Z\" fill=\"currentColor\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"></path>"
  },
  "book_dstatement": {
    vb: "0 0 12 13",
    p: "<path d=\"M6,0.5L6,0.5A6,6 0,0 1,12 6.5L12,6.5A6,6 0,0 1,6 12.5L6,12.5A6,6 0,0 1,0 6.5L0,6.5A6,6 0,0 1,6 0.5z\" fill=\"#d83153\"></path><path d=\"M7.3224,6.0279H4.5195C4.3587,6.0279 4.2266,5.8922 4.2266,5.7269C4.2266,5.5616 4.3587,5.4258 4.5195,5.4258H7.3224C7.4832,5.4258 7.6153,5.5616 7.6153,5.7269C7.6153,5.8922 7.4832,6.0279 7.3224,6.0279Z\" fill=\"#d83153\"></path><path d=\"M6.6217,7.2291H4.5195C4.3587,7.2291 4.2266,7.0933 4.2266,6.928C4.2266,6.7627 4.3587,6.6269 4.5195,6.6269H6.6217C6.7825,6.6269 6.9146,6.7627 6.9146,6.928C6.9146,7.0933 6.7825,7.2291 6.6217,7.2291Z\" fill=\"#d83153\"></path><path d=\"M5.1599,8.4274H4.5195C4.3587,8.4274 4.2266,8.2916 4.2266,8.1263C4.2266,7.961 4.3587,7.8252 4.5195,7.8252H5.1599C5.3207,7.8252 5.4528,7.961 5.4528,8.1263C5.4528,8.2945 5.3207,8.4274 5.1599,8.4274Z\" fill=\"#d83153\"></path><path d=\"M4.3984,3.0546V3.388C4.3984,3.4481 4.4501,3.5 4.5162,3.5H7.322C7.3851,3.5 7.4397,3.4508 7.4397,3.388V3.0546C7.4397,2.6612 7.1726,2.5519 6.8022,2.4344C6.6298,2.3798 6.5035,2.2268 6.5064,2.0519C6.5092,1.7486 6.2508,1.5 5.932,1.5H5.909C5.5989,1.5 5.3232,1.735 5.3347,2.0273C5.3433,2.2104 5.2198,2.3743 5.0389,2.4344C4.6684,2.5546 4.3984,2.6639 4.3984,3.0546Z\" fill=\"#ffffff\"></path><path d=\"M4.1589,3.2978V3.6717C4.1589,3.7501 4.218,3.8178 4.2935,3.8178H7.501C7.5732,3.8178 7.6356,3.7537 7.6356,3.6717V3.2978H8.3732C8.6317,3.2978 8.8413,3.5104 8.8413,3.776V10.0191C8.8413,10.2848 8.6317,10.5002 8.3732,10.5002H3.4681C3.2096,10.5002 3,10.2848 3,10.0191V3.776C3,3.5104 3.2096,3.2978 3.4681,3.2978H4.1589Z\" fill=\"#ffffff\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"></path><path d=\"M7.3224,6.0279H4.5195C4.3587,6.0279 4.2266,5.8922 4.2266,5.7269C4.2266,5.5616 4.3587,5.4258 4.5195,5.4258H7.3224C7.4832,5.4258 7.6153,5.5616 7.6153,5.7269C7.6153,5.8922 7.4832,6.0279 7.3224,6.0279Z\" fill=\"#d83153\"></path><path d=\"M6.6217,7.2291H4.5195C4.3587,7.2291 4.2266,7.0933 4.2266,6.928C4.2266,6.7627 4.3587,6.6269 4.5195,6.6269H6.6217C6.7825,6.6269 6.9146,6.7627 6.9146,6.928C6.9146,7.0933 6.7825,7.2291 6.6217,7.2291Z\" fill=\"#d83153\"></path><path d=\"M5.1599,8.4283H4.5195C4.3587,8.4283 4.2266,8.2926 4.2266,8.1272C4.2266,7.9619 4.3587,7.8262 4.5195,7.8262H5.1599C5.3207,7.8262 5.4528,7.9619 5.4528,8.1272C5.4528,8.2955 5.3207,8.4283 5.1599,8.4283Z\" fill=\"#d83153\"></path>"
  },
  "calendar_filter": {
    vb: "0 0 20 20",
    p: "<path d=\"M4,0L16,0A4,4 0,0 1,20 4L20,16A4,4 0,0 1,16 20L4,20A4,4 0,0 1,0 16L0,4A4,4 0,0 1,4 0z\" fill=\"#ffffff\"></path><path d=\"M4,0.75L16,0.75A3.25,3.25 0,0 1,19.25 4L19.25,16A3.25,3.25 0,0 1,16 19.25L4,19.25A3.25,3.25 0,0 1,0.75 16L0.75,4A3.25,3.25 0,0 1,4 0.75z\" fill=\"none\" stroke=\"#d83152\" stroke-width=\"1.5\"></path><path d=\"M4,0H16a4,4 0,0 1,4 4V7a0,0 0,0 1,0 0H0A0,0 0,0 1,0 7V4A4,4 0,0 1,4 0Z\" fill=\"#d83152\"></path><path d=\"M3,12h8v5h-8z\" fill=\"#d83152\"></path>"
  },
  "close": {
    vb: "0 0 32 32",
    p: "<path d=\"M16,16m-16,0a16,16 0,1 1,32 0a16,16 0,1 1,-32 0\" fill=\"#ffffff\" fill-opacity=\"0.56\"></path><path d=\"M9,9L23,23\" fill=\"none\" stroke=\"#d63252\" stroke-width=\"2\" stroke-linecap=\"round\"></path><path d=\"M23,9L9,23\" fill=\"none\" stroke=\"#d63252\" stroke-width=\"2\" stroke-linecap=\"round\"></path>"
  },
  "contact_book": {
    vb: "0 0 24 24",
    p: "<path d=\"M19.4531,8.625C19.6641,8.625 19.875,8.4492 19.875,8.2031V6.7969C19.875,6.5859 19.6641,6.375 19.4531,6.375H18.75V4.6875C18.75,3.7734 17.9766,3 17.0625,3H5.8125C4.8633,3 4.125,3.7734 4.125,4.6875V19.3125C4.125,20.2617 4.8633,21 5.8125,21H17.0625C17.9766,21 18.75,20.2617 18.75,19.3125V17.625H19.4531C19.6641,17.625 19.875,17.4492 19.875,17.2031V15.7969C19.875,15.5859 19.6641,15.375 19.4531,15.375H18.75V13.125H19.4531C19.6641,13.125 19.875,12.9492 19.875,12.7031V11.2969C19.875,11.0859 19.6641,10.875 19.4531,10.875H18.75V8.625H19.4531ZM11.4375,7.5C12.668,7.5 13.6875,8.5195 13.6875,9.75C13.6875,11.0156 12.668,12 11.4375,12C10.1719,12 9.1875,11.0156 9.1875,9.75C9.1875,8.5195 10.1719,7.5 11.4375,7.5ZM15.375,15.832C15.375,16.2187 15.0234,16.5 14.5664,16.5H8.2734C7.8516,16.5 7.5,16.2187 7.5,15.832V15.1641C7.5,14.0391 8.5547,13.125 9.8555,13.125H10.0312C10.4531,13.3359 10.9102,13.4062 11.4375,13.4062C11.9297,13.4062 12.3867,13.3359 12.8086,13.125H12.9844C14.2852,13.125 15.375,14.0391 15.375,15.1641V15.832Z\" fill=\"currentColor\"></path>"
  },
  "digitalsalak_deposit": {
    vb: "0 0 26 26",
    p: "<path d=\"M13,0.5A12.5,12.5 0,1 1,0.5 13,12.5 12.5,0 0,1 13,0.5Z\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1\"></path><path d=\"M15.309,15.41a3.808,3.808 0,0 1,0.322 -0.212l0,0h-6.7v-0.828h7.891v0.346a3.7,3.7 0,0 1,2.123 0.147v-8.365a1.9,1.9 0,0 1,-1.782 -2h-8.621a1.9,1.9 0,0 1,-1.782 2,1.714 1.714,0 0,1 -0.257,-0.029v12.39a1.592,1.592 0,0 1,0.257 -0.029,1.9 1.9,0 0,1 1.782,2L14.47,20.83A3.879,3.879 0,0 1,15.309 15.41ZM13.309,6.946 L14.209,6.318h0.728v3.5h-0.725L14.212,6.993h-0.014l-0.892,0.607ZM11.458,8.279h-0.4v-0.522h0.391c0.366,0 0.6,-0.2 0.6,-0.485s-0.2,-0.468 -0.546,-0.468a0.54,0.54 0,0 0,-0.6 0.467l0,0.02h-0.672a1.147,1.147 0,0 1,1.233 -1.055l0.045,0c0.739,0 1.239,0.366 1.239,0.926a0.836,0.836 0,0 1,-0.73 0.82v0.015a0.838,0.838 0,0 1,0.858 0.818v0.019c0,0.635 -0.551,1.057 -1.363,1.057 -0.791,0 -1.33,-0.427 -1.361,-1.07h0.7c0.024,0.286 0.277,0.48 0.662,0.48 0.366,0 0.618,-0.2 0.618,-0.5C12.135,8.467 11.885,8.279 11.46,8.279ZM8.922,11.888h7.891v0.828h-7.891Z\" fill=\"#ffffff\"></path><path d=\"M17.627,15.411a3.1,3.1 0,1 0,0 6.2h0a3.1,3.1 0,1 0,0 -6.2ZM19.005,18.511 L19.005,18.511 19.005,18.511 18.105,17.824v2.2L17.27,20.024v-2.181l-0.827,0.66 0,-0.005 0,0 -0.51,-0.642 1.753,-1.388 0,0 0,0 1.822,1.383Z\" fill=\"#ffffff\"></path>"
  },
  "file_download": {
    vb: "0 0 24.0 24.0",
    p: "<path d=\"M19,9h-4V3H9v6H5l7,7 7,-7zM5,18v2h14v-2H5z\" fill=\"currentColor\"></path>"
  },
  "hamberger": {
    vb: "0 0 16 16",
    p: "<path d=\"M2,3L14,3\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"></path><path d=\"M2,9L14,9\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"></path><path d=\"M2,15L14,15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"></path>"
  },
  "hotkey_payment": {
    vb: "0 0 56 56",
    p: "<path d=\"M28,28m-28,0a28,28 0,1 1,56 0a28,28 0,1 1,-56 0\" fill=\"none\"></path><path d=\"M40.091,27.501L17.222,27.501a1.157,1.157 0,0 0,0 2.314L40.091,29.815a1.157,1.157 0,1 0,0 -2.314Z\" fill=\"currentColor\"></path><path d=\"M17.158,23.808a1.158,1.158 0,0 0,1.157 -1.157L18.315,19.939a1.627,1.627 0,0 1,1.625 -1.626h4.13a1.157,1.157 0,0 0,0 -2.314h-4.13a3.944,3.944 0,0 0,-3.939 3.94v2.712A1.158,1.158 0,0 0,17.158 23.808Z\" fill=\"currentColor\"></path><path d=\"M33.249,18.313h4.167a1.59,1.59 0,0 1,1.587 1.588v2.75a1.157,1.157 0,1 0,2.314 0v-2.75a3.906,3.906 0,0 0,-3.9 -3.9h-4.167a1.157,1.157 0,1 0,0 2.314Z\" fill=\"currentColor\"></path><path d=\"M40.161,33.509a1.158,1.158 0,0 0,-1.157 1.157v2.75a1.588,1.588 0,0 1,-1.586 1.587h-4.168a1.157,1.157 0,1 0,0 2.314h4.168a3.9,3.9 0,0 0,3.9 -3.9v-2.75A1.158,1.158 0,0 0,40.161 33.509Z\" fill=\"currentColor\"></path><path d=\"M24.07,39.003L19.901,39.003a1.588,1.588 0,0 1,-1.586 -1.587v-2.75a1.157,1.157 0,0 0,-2.314 0v2.75a3.9,3.9 0,0 0,3.9 3.9h4.169a1.157,1.157 0,0 0,0 -2.314Z\" fill=\"currentColor\"></path>"
  },
  "info": {
    vb: "0 0 25 25",
    p: "<path d=\"M12.5004,3.5C7.5286,3.5 3.5004,7.5645 3.5004,12.5C3.5004,17.4718 7.5286,21.5 12.5004,21.5C17.4358,21.5 21.5004,17.4718 21.5004,12.5C21.5004,7.5645 17.4358,3.5 12.5004,3.5ZM12.5004,7.4919C13.335,7.4919 14.0246,8.1814 14.0246,9.0161C14.0246,9.8871 13.335,10.5403 12.5004,10.5403C11.6294,10.5403 10.9762,9.8871 10.9762,9.0161C10.9762,8.1814 11.6294,7.4919 12.5004,7.4919ZM14.5326,16.7097C14.5326,16.9637 14.3149,17.1452 14.0971,17.1452H10.9036C10.6496,17.1452 10.4681,16.9637 10.4681,16.7097V15.8387C10.4681,15.621 10.6496,15.4032 10.9036,15.4032H11.3391V13.0806H10.9036C10.6496,13.0806 10.4681,12.8992 10.4681,12.6452V11.7742C10.4681,11.5565 10.6496,11.3387 10.9036,11.3387H13.2262C13.4439,11.3387 13.6617,11.5565 13.6617,11.7742V15.4032H14.0971C14.3149,15.4032 14.5326,15.621 14.5326,15.8387V16.7097Z\" fill=\"currentColor\"></path>"
  },
  "insurance_heart": {
    vb: "0 0 72 72",
    p: "<path d=\"M36,35.999m-36,0a36,36 0,1 1,72 0a36,36 0,1 1,-72 0\" fill=\"#fddfe4\"></path><path d=\"M44.101,19.864a10.434,10.434 0,0 0,-8 3.725l-0.109,0.145 -0.087,-0.145a10.458,10.458 0,0 0,-17.1 11.9l15.459,15.749a3.291,3.291 0,0 0,1.735 0.9,3.286 3.286,0 0,0 1.735,-0.9l15.46,-15.749a10.46,10.46 0,0 0,-9.094 -15.623ZM45.954,36.593L40.34,36.593a1.076,1.076 0,0 1,-1.009 -0.708l-0.422,-1.171 -1.809,5.606a1.067,1.067 0,0 1,-1.018 0.743,1.078 1.078,0 0,1 -1.049,-0.838l-1.879,-8.406 -1.765,4.06a1.073,1.073 0,0 1,-0.984 0.645L25.06,36.524a0.759,0.759 0,1 1,0 -1.519h5.055l2.195,-5.049a1.073,1.073 0,0 1,2.031 0.193l1.82,8.144 1.708,-5.291a1.072,1.072 0,0 1,2.03 -0.033l0.758,2.1h5.3a0.759,0.759 0,1 1,0 1.519Z\" fill=\"#ea0a4e\"></path>"
  },
  "insurance_savings": {
    vb: "0 0 26 26",
    p: "<path d=\"M13,0.5A12.5,12.5 0,1 1,0.5 13,12.5 12.5,0 0,1 13,0.5Z\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1\"></path><path d=\"M19.508,8.071a0.457,0.457 0,0 0,-0.273 -0.387l-6.048,-2.736a0.451,0.451 0,0 0,-0.377 0l-5.989,2.708a0.454,0.454 0,0 0,-0.272 0.387c-0.086,1.317 -0.312,6.987 2.013,9.074l0.03,0.028a15.372,15.372 0,0 0,4.436 3.014l0,0.03a15.377,15.377 0,0 0,4.437 -3.014l0.028,-0.03C19.821,15.058 19.595,9.39 19.508,8.071ZM11.898,15.871 L9.798,13.114 10.992,12.205 12.092,13.649 15.619,10.385 16.638,11.485Z\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"1\"></path>"
  },
  "key": {
    vb: "0 0 14 16",
    p: "<path d=\"M12.5,8H4.75V4.7813C4.75,3.5625 5.7188,2.5313 6.9688,2.5C8.2188,2.5 9.25,3.5313 9.25,4.75V5.25C9.25,5.6875 9.5625,6 10,6H11C11.4062,6 11.75,5.6875 11.75,5.25V4.75C11.75,2.125 9.5938,0 6.9688,0C4.3438,0.0313 2.25,2.1875 2.25,4.8125V8H1.5C0.6563,8 0,8.6875 0,9.5V14.5C0,15.3438 0.6563,16 1.5,16H12.5C13.3125,16 14,15.3438 14,14.5V9.5C14,8.6875 13.3125,8 12.5,8ZM8.25,12.75C8.25,13.4688 7.6875,14 7,14C6.2813,14 5.75,13.4688 5.75,12.75V11.25C5.75,10.5625 6.2813,10 7,10C7.6875,10 8.25,10.5625 8.25,11.25V12.75Z\" fill=\"currentColor\"></path>"
  },
  "mymo_logo": {
    vb: "0 0 159 54.556",
    p: "<path d=\"M64.938,54.555c-0.456,-0.08 -0.91,-0.174 -1.368,-0.236a11.1,11.1 0,0 1,-3.1 -0.927,4.852 4.852,0 0,1 -1.28,-0.8 2.252,2.252 0,0 1,0.292 -3.231,2.356 2.356,0 0,1 2.548,-0.216 11.054,11.054 0,0 0,3.676 0.868,11.321 11.321,0 0,0 6.643,-1.456 8.931,8.931 0,0 0,3.487 -3.634,9.75 9.75,0 0,0 1.227,-3.85c0.115,-1.447 0.026,-2.91 0.026,-4.361 -0.449,0.342 -0.929,0.717 -1.419,1.079a14.528,14.528 0,0 1,-6.269 2.59,16.189 16.189,0 0,1 -11.943,-2.561 13.547,13.547 0,0 1,-4.023 -4.48,17.434 17.434,0 0,1 -1.5,-3.641 10.289,10.289 0,0 1,-0.427 -2.819c-0.051,-4.392 -0.063,-8.785 -0.092,-13.177a7.047,7.047 0,0 0,-0.635 -2.608,10.088 10.088,0 0,0 -2.349,-3.542 9.089,9.089 0,0 0,-4.167 -2.316,13.721 13.721,0 0,0 -3.211,-0.473 10.882,10.882 0,0 0,-6.7 2.071,9.439 9.439,0 0,0 -3.027,3.911 12.766,12.766 0,0 0,-0.948 5.179c0.015,4.065 0,8.129 0.007,12.194a2.377,2.377 0,0 1,-1.6 2.326,2.278 2.278,0 0,1 -2.963,-2.064c0,-4.331 0.026,-8.662 -0.012,-12.993a11.021,11.021 0,0 0,-2.188 -6.708,9.3 9.3,0 0,0 -5.557,-3.532 18.545,18.545 0,0 0,-2.329 -0.324,10.622 10.622,0 0,0 -5.873,1.19 9.1,9.1 0,0 0,-3.815 3.64,10.5 10.5,0 0,0 -1.421,4.31c-0.065,0.695 -0.151,1.391 -0.153,2.087 -0.014,4.1 -0.007,8.209 -0.007,12.314a2.136,2.136 0,0 1,-2.109 2.135,2.284 2.284,0 0,1 -2.37,-1.61L-0.011,14.009c0.078,-0.456 0.175,-0.91 0.232,-1.369a13.507,13.507 0,0 1,1.578 -4.723,14.371 14.371,0 0,1 4.147,-4.809 15.268,15.268 0,0 1,6.14 -2.606,15.426 15.426,0 0,1 4.307,-0.232 16.441,16.441 0,0 1,5.61 1.466,13.394 13.394,0 0,1 4.526,3.279c0.5,0.563 0.919,1.2 1.375,1.81 0.055,0.073 0.119,0.14 0.157,0.185 0.495,-0.629 0.944,-1.289 1.484,-1.865a19.411,19.411 0,0 1,1.986 -1.849,14.617 14.617,0 0,1 5.931,-2.7 15.8,15.8 0,0 1,4.807 -0.325,15.524 15.524,0 0,1 6.032,1.673 13.951,13.951 0,0 1,5.813 5.6,15.933 15.933,0 0,1 1.745,4.664 11.866,11.866 0,0 1,0.26 2.345c0.025,4.065 0.02,8.13 0.006,12.2a7.993,7.993 0,0 0,0.619 2.937,10.06 10.06,0 0,0 2.537,3.75 9.31,9.31 0,0 0,3.827 2.15,11.608 11.608,0 0,0 3.933,0.485 10.767,10.767 0,0 0,6.636 -2.456,9.7 9.7,0 0,0 3.233,-5.719 15.485,15.485 0,0 0,0.244 -2.786c0.028,-3.385 0.036,-6.771 0,-10.156a13.706,13.706 0,0 1,0.489 -4.009,15.714 15.714,0 0,1 2.97,-5.767 14.17,14.17 0,0 1,7.1 -4.551,17.655 17.655,0 0,1 6.023,-0.6 14.685,14.685 0,0 1,3.035 0.558A15.377,15.377 0,0 1,101.226 2.588a13.99,13.99 0,0 1,4.047 4.223,12.747 12.747,0 0,1 2.587,-3.12 14.169,14.169 0,0 1,4.2 -2.556,13.7 13.7,0 0,1 3.842,-1.011 34.848,34.848 0,0 1,3.964 -0.024,12.584 12.584,0 0,1 3.7,0.793 13.709,13.709 0,0 1,4.424 2.459,14.491 14.491,0 0,1 3.955,5.193 13,13 0,0 1,1.206 4.391c0.1,1.225 0.118,2.457 0.166,3.686 0.013,0.332 0,0.664 0,1.033 0.455,-0.352 0.883,-0.682 1.31,-1.014a12.355,12.355 0,0 1,4.324 -2.138,20.686 20.686,0 0,1 3.137,-0.634 16.41,16.41 0,0 1,3.139 -0.08,16.246 16.246,0 0,1 5.106,1.249 13.789,13.789 0,0 1,4.979 3.585,14.289 14.289,0 0,1 2.633,4.38 13.479,13.479 0,0 1,0.96 4.339,35.217 35.217,0 0,1 0.066,3.7 15.181,15.181 0,0 1,-3.037 8.3,13.825 13.825,0 0,1 -5.45,4.334 13.14,13.14 0,0 1,-4.233 1.188,24.28 24.28,0 0,1 -3.763,0.145 15.067,15.067 0,0 1,-5.385 -1.4,14.359 14.359,0 0,1 -3.4,-2.215 14.947,14.947 0,0 1,-3.084 -3.9,13.823 13.823,0 0,1 -1.753,-5.31 34.75,34.75 0,0 1,-0.136 -4.035c-0.006,-3.6 0.02,-7.2 0.031,-10.8 0,-0.88 0.019,-1.76 0,-2.639a10.733,10.733 0,0 0,-1 -4.321,10.353 10.353,0 0,0 -1.884,-2.824 9.427,9.427 0,0 0,-5.02 -2.738,13.464 13.464,0 0,0 -3.008,-0.314 10.8,10.8 0,0 0,-6.247 2.01,9.56 9.56,0 0,0 -3.69,5.8 13.748,13.748 0,0 0,-0.323 2.888c-0.034,4.185 0,8.37 -0.021,12.556a2.217,2.217 0,0 1,-1.632 2.4,2.184 2.184,0 0,1 -2.914,-2.107c-0.016,-4.305 0.026,-8.611 -0.018,-12.915a11.077,11.077 0,0 0,-2.185 -6.711,9.218 9.218,0 0,0 -4.211,-3.136 12.644,12.644 0,0 0,-3.392 -0.737,11.262 11.262,0 0,0 -6.4,1.32 9.208,9.208 0,0 0,-3.5 3.382,11.521 11.521,0 0,0 -1.479,4.012 5.5,5.5 0,0 0,-0.089 0.982c0,8.61 0.017,17.221 -0.02,25.831a15.048,15.048 0,0 1,-4.968 10.842,13.178 13.178,0 0,1 -3.59,2.282 16.228,16.228 0,0 1,-3.272 1.026c-0.512,0.1 -1.032,0.157 -1.548,0.24a1.014,1.014 0,0 0,-0.2 0.078ZM154.58,29.4c-0.129,-1 -0.209,-2.012 -0.4,-3a9.648,9.648 0,0 0,-3.317 -5.761,10.709 10.709,0 0,0 -6.664,-2.372 12.4,12.4 0,0 0,-2.626 0.231,9.554 9.554,0 0,0 -5.627,2.983 9.991,9.991 0,0 0,-2 3.34,9.125 9.125,0 0,0 -0.625,2.936 31.447,31.447 0,0 0,0.019 3.644,9.97 9.97,0 0,0 1.35,4.087 9.565,9.565 0,0 0,3.846 3.794,11.374 11.374,0 0,0 6.787,1.184 10.565,10.565 0,0 0,4.346 -1.438,9.493 9.493,0 0,0 3.269,-3.33A13.37,13.37 0,0 0,154.58 29.401Z\" fill=\"currentColor\"></path>"
  },
  "note": {
    vb: "0 0 22 22.058",
    p: "<path d=\"M17.8017,0.519l3.1982,3.1657 -13.9399,13.7985L2.5954,18.7518 3.8611,14.3168Z\" fill=\"currentColor\"></path><path d=\"M6.561,21.058L20.561,21.058\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"></path><path d=\"M1,21.058L3,21.058\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"></path>"
  },
  "pencil": {
    vb: "0 0 20 20",
    p: "<path d=\"M12.97,4.373L15.498,6.808L7.288,14.466L4.339,14.834L4.76,12.031L12.97,4.373Z\" fill=\"currentColor\"></path><path d=\"M6.619,17.431H17.795\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"></path><path d=\"M2.205,17.431H3.619\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"></path><path d=\"M14.695,2.684L17.241,5.137L15.927,6.534L13.252,3.992L14.695,2.684Z\" fill=\"currentColor\"></path>"
  },
  "plus_white": {
    vb: "0 0 22 22",
    p: "<path d=\"M1.158,12.158h8.684v8.684a1.158,1.158 0,1 0,2.316 0v-8.684h8.684a1.158,1.158 0,1 0,0 -2.316h-8.684L12.158,1.158a1.158,1.158 0,0 0,-2.316 0v8.684L1.158,9.842a1.158,1.158 0,0 0,0 2.316Z\" fill=\"none\"></path>"
  },
  "schedule": {
    vb: "0 0 23 23",
    p: "<path d=\"M4,1L19,1A3,3 0,0 1,22 4L22,19A3,3 0,0 1,19 22L4,22A3,3 0,0 1,1 19L1,4A3,3 0,0 1,4 1z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"></path><path d=\"M4,0H19a4,4 0,0 1,4 4V8a0,0 0,0 1,0 0H0A0,0 0,0 1,0 8V4A4,4 0,0 1,4 0Z\" fill=\"currentColor\"></path><path d=\"M4,14h9v5h-9z\" fill=\"currentColor\"></path>"
  },
  "search": {
    vb: "0 0 24.0 24.0",
    p: "<path d=\"M15.5,14h-0.79l-0.28,-0.27C15.41,12.59 16,11.11 16,9.5 16,5.91 13.09,3 9.5,3S3,5.91 3,9.5 5.91,16 9.5,16c1.61,0 3.09,-0.59 4.23,-1.57l0.27,0.28v0.79l5,4.99L20.49,19l-4.99,-5zM9.5,14C7.01,14 5,11.99 5,9.5S7.01,5 9.5,5 14,7.01 14,9.5 11.99,14 9.5,14z\" fill=\"currentColor\"></path>"
  },
  "setting_gear": {
    vb: "0 0 25 24",
    p: "<path d=\"M20.8922,14.1547L19.3318,13.2837C19.5132,12.4128 19.5132,11.5781 19.3318,10.7072L20.8922,9.8362C21.0737,9.7274 21.1463,9.5096 21.0737,9.3282C20.6745,8.0218 19.985,6.8605 19.114,5.8807C18.9689,5.7355 18.7512,5.6992 18.5697,5.8081L17.0093,6.679C16.356,6.1347 15.6303,5.6992 14.8319,5.4089V3.6307C14.8319,3.4493 14.6867,3.2678 14.469,3.2315C13.1263,2.9049 11.7836,2.9412 10.5134,3.2315C10.2957,3.2678 10.1868,3.4493 10.1868,3.6307V5.4089C9.3522,5.6992 8.6264,6.1347 7.9732,6.7153L6.4127,5.8081C6.2313,5.6992 6.0135,5.7355 5.8684,5.8807C4.9974,6.8605 4.308,8.0218 3.9088,9.3282C3.8362,9.5096 3.9088,9.7274 4.0902,9.8362L5.6507,10.7072C5.5055,11.5781 5.5055,12.4128 5.6507,13.2837L4.0902,14.1547C3.9088,14.2635 3.8362,14.4813 3.9088,14.6627C4.308,15.9691 4.9974,17.1304 5.8684,18.1102C6.0135,18.2554 6.2313,18.2917 6.4127,18.1828L7.9732,17.3119C8.6264,17.8562 9.3522,18.2917 10.1868,18.582V20.3602C10.1868,20.5416 10.332,20.7231 10.5134,20.7956C11.8562,21.086 13.1989,21.0497 14.469,20.7956C14.6867,20.7231 14.8319,20.5416 14.8319,20.3602V18.582C15.6303,18.2917 16.356,17.8562 17.0093,17.3119L18.5697,18.1828C18.7512,18.2917 18.9689,18.2554 19.114,18.1102C20.0213,17.1304 20.6745,15.9691 21.11,14.6627C21.1463,14.4813 21.0737,14.2635 20.8922,14.1547ZM12.5094,14.8805C10.8763,14.8805 9.6062,13.6103 9.6062,11.9773C9.6062,10.3806 10.8763,9.0742 12.5094,9.0742C14.1061,9.0742 15.4125,10.3806 15.4125,11.9773C15.4125,13.6103 14.1061,14.8805 12.5094,14.8805Z\" fill=\"currentColor\"></path>"
  },
  "share": {
    vb: "0 0 24 24",
    p: "<path d=\"M21.7394,9.28C22.0869,8.9325 22.0869,8.4112 21.7394,8.0637L16.735,3.3373C16.2137,2.8508 15.3449,3.1983 15.3449,3.9629V6.465C10.2363,6.465 6.1703,7.4729 6.1703,12.4772C6.1703,14.4581 7.3866,16.439 8.742,17.4468C9.159,17.7596 9.7498,17.3773 9.6108,16.856C8.1859,12.1297 10.3058,10.9134 15.3449,10.9134V13.3808C15.3449,14.1453 16.2137,14.4928 16.735,14.0063L21.7394,9.28ZM15.3449,16.3V18.6631H4.2242V7.5424H5.9618C6.1008,7.5424 6.205,7.5076 6.2745,7.4381C6.7958,6.8821 7.3866,6.465 8.0469,6.1175C8.4292,5.909 8.2902,5.3182 7.8731,5.3182H3.6681C2.7298,5.3182 2,6.0828 2,6.9863V19.2192C2,20.1575 2.7298,20.8873 3.6681,20.8873H15.901C16.8045,20.8873 17.5691,20.1575 17.5691,19.2192V16.161C17.5691,15.8482 17.2563,15.6744 16.9783,15.7439C16.735,15.8482 16.457,15.8829 16.179,15.8829C16.04,15.8829 15.9357,15.8829 15.7967,15.8829C15.5534,15.8482 15.3449,16.022 15.3449,16.3Z\" fill=\"currentColor\"></path>"
  },
  "tab_accounts": {
    vb: "0 0 23.696 24",
    p: "<path d=\"M2,17.814a2.685,2.685 0,0 0,2.561 2.793h14.761a2.685,2.685 0,0 0,2.561 -2.793v-0.494h-19.883Z\" fill=\"currentColor\"></path><path d=\"M19.322,5.648h-14.761a2.794,2.794 0,0 0,-2.561 2.979v7.074h19.883v-7.074A2.794,2.794 0,0 0,19.322 5.648ZM20.222,14.154h-3.984v-1.727h3.984Z\" fill=\"currentColor\"></path>"
  },
  "tab_history": {
    vb: "0 0 24 24",
    p: "<path d=\"M12,4a9,9 0,1 0,9 9A9,9 0,0 0,12 4ZM17.5,14.414h-6v-7h1v6h5Z\" fill=\"currentColor\"></path>"
  },
  "tab_home": {
    vb: "0 0 23.696 24",
    p: "<path d=\"M19.796,6.57l-6.09,-4.349a2.579,2.579 0,0 0,-2.993 0l-6.09,4.349a2.576,2.576 0,0 0,-1.078 2.095v8.022a3.991,3.991 0,0 0,3.991 3.991h1.576v-7.727h6.2L15.312,20.67h1.576a3.992,3.992 0,0 0,3.991 -3.991v-8.022A2.576,2.576 0,0 0,19.796 6.57Z\" fill=\"currentColor\"></path>"
  },
  "tab_more": {
    vb: "0 0 24 24",
    p: "<path d=\"M15.333,17.229L3.84,17.229a1.235,1.235 0,1 0,0 2.47h11.493a1.235,1.235 0,1 0,0 -2.47Z\" fill=\"currentColor\"></path><path d=\"M3.84,6.522h16.434a1.235,1.235 0,0 0,0 -2.47L3.84,4.052a1.235,1.235 0,1 0,0 2.47Z\" fill=\"currentColor\"></path><path d=\"M20.274,10.64L3.84,10.64a1.236,1.236 0,0 0,0 2.471h16.434a1.236,1.236 0,0 0,0 -2.471Z\" fill=\"currentColor\"></path>"
  },
  "tab_payment": {
    vb: "0 0 24 24",
    p: "<path d=\"M17.356,19.493v-6.73h0.01L17.366,3.198a1.358,1.358 0,0 0,-1.48 -1.189L3.474,2.009a1.357,1.357 0,0 0,-1.475 1.189v16.35a2.134,2.134 0,0 0,2.324 1.869L19.714,21.417S17.356,21.415 17.356,19.493ZM7.973,3.216L11.464,3.216a0.445,0.445 0,0 1,0 0.89L7.973,4.106a0.445,0.445 0,0 1,0 -0.89ZM6.058,5.116a2.41,2.41 0,1 1,-2.41 2.41A2.41,2.41 0,0 1,6.058 5.119ZM10.999,18.406L3.946,18.406a0.25,0.25 0,0 1,0 -0.5h7.053a0.25,0.25 0,0 1,0 0.5ZM13.384,15.406L3.946,15.406a0.25,0.25 0,0 1,0 -0.5L13.384,14.906a0.25,0.25 0,0 1,0 0.5ZM14.746,12.406h-10.8a0.25,0.25 0,0 1,0 -0.5h10.8a0.25,0.25 0,0 1,0 0.5ZM14.746,9.387L9.986,9.387a0.25,0.25 0,0 1,0 -0.5h4.761a0.25,0.25 0,0 1,0 0.5ZM14.746,6.387L9.982,6.387a0.25,0.25 0,0 1,0 -0.5h4.765a0.25,0.25 0,0 1,0 0.5Z\" fill=\"currentColor\"></path><path d=\"M20.968,13.954l-1.029,-1.029 -1.155,1.029 -0.9,-1.029v6.553c0,1.68 2.058,1.68 2.058,1.68a2.057,2.057 0,0 0,2.058 -2.058v-6.175Z\" fill=\"currentColor\"></path><path d=\"M5.262,8.937h1.055a1.017,1.017 0,0 0,0.269 -0.033,0.909 0.909,0 0,0 0.224,-0.091 0.784,0.784 0,0 0,0.177 -0.137,0.822 0.822,0 0,0 0.233,-0.573 0.677,0.677 0,0 0,-0.029 -0.2,0.7 0.7,0 0,0 -0.207,-0.322 0.76,0.76 0,0 0,-0.161 -0.109,0.645 0.645,0 0,0 0.115,-0.1 0.636,0.636 0,0 0,0.149 -0.276,0.727 0.727,0 0,0 0.021,-0.174 0.678,0.678 0,0 0,-0.03 -0.2,0.7 0.7,0 0,0 -0.079,-0.169 0.754,0.754 0,0 0,-0.115 -0.137,0.881 0.881,0 0,0 -0.136,-0.1 0.538,0.538 0,0 0,-0.159 -0.065,1.605 1.605,0 0,0 -0.194,-0.033 1.678,1.678 0,0 0,-0.2 -0.012h-0.189l-0.744,0h0a0.228,0.228 0,0 0,-0.223 0.233v2.269h0A0.228,0.228 0,0 0,5.262 8.937ZM6.62,7.937a0.291,0.291 0,0 1,0.039 0.155,0.433 0.433,0 0,1 -0.025,0.147 0.33,0.33 0,0 1,-0.073 0.117,0.335 0.335,0 0,1 -0.119,0.077 0.435,0.435 0,0 1,-0.164 0.028l-0.657,0.005v-0.706h0.591a0.747,0.747 0,0 1,0.163 0.018,0.457 0.457,0 0,1 0.145,0.059A0.341,0.341 0,0 1,6.62 7.94ZM5.61,6.678h0.489a1.233,1.233 0,0 1,0.172 0.012,0.416 0.416,0 0,1 0.142,0.046 0.253,0.253 0,0 1,0.1 0.1,0.329 0.329,0 0,1 0.035,0.16 0.335,0.335 0,0 1,-0.025 0.133,0.25 0.25,0 0,1 -0.079,0.1 0.391,0.391 0,0 1,-0.138 0.066,0.791 0.791,0 0,1 -0.2,0.023h-0.5Z\" fill=\"currentColor\"></path>"
  },
  "tab_scan": {
    vb: "0 0 24 24",
    p: "<path d=\"M4,7.294V4.674C4,4.302 4.302,4 4.674,4H7.222\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M20,7.294V4.674C20,4.302 19.698,4 19.326,4H16.778\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M4,16.706V19.326C4,19.698 4.302,20 4.674,20H7.222\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M20,16.706V19.326C20,19.698 19.698,20 19.326,20H16.778\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M4,12H19.959\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>"
  },
  "transfer_landing": {
    vb: "0 0 25 25",
    p: "<path d=\"M13.137,12.076a1.315,1.315 0,0 0,0.455 -0.2,0.786 0.786,0 0,0 0.262,-0.315 1.032,1.032 0,0 0,0.084 -0.424,1.152 1.152,0 0,0 -0.05,-0.36 0.649,0.649 0,0 0,-0.137 -0.241,0.6 0.6,0 0,0 -0.214,-0.148 1.167,1.167 0,0 0,-0.283 -0.078,2.552 2.552,0 0,0 -0.337,-0.029L10.699,10.281v1.862h1.771A2.933,2.933 0,0 0,13.137 12.076Z\" fill=\"currentColor\"></path><path d=\"M13.756,13.076a1.545,1.545 0,0 0,-0.477 -0.151,3.331 3.331,0 0,0 -0.536,-0.043L10.699,12.882v2.035h2.231a1.97,1.97 0,0 0,0.555 -0.074,1.176 1.176,0 0,0 0.408,-0.211 0.886,0.886 0,0 0,0.25 -0.337,1.171 1.171,0 0,0 0.084,-0.453 0.814,0.814 0,0 0,-0.131 -0.473A0.918,0.918 0,0 0,13.756 13.076Z\" fill=\"currentColor\"></path><path d=\"M12.092,6a6.592,6.592 0,1 0,6.592 6.592A6.592,6.592 0,0 0,12.092 6ZM15.068,14.526a1.733,1.733 0,0 1,-0.413 0.565,2.109 2.109,0 0,1 -0.673,0.4 2.6,2.6 0,0 1,-0.921 0.153h-0.6v0.44a0.438,0.438 0,0 1,-0.438 0.438h0a0.438,0.438 0,0 1,-0.438 -0.438v-0.44h-1.378a0.567,0.567 0,0 1,-0.192 -0.034,0.487 0.487,0 0,1 -0.155,-0.092 0.452,0.452 0,0 1,-0.1 -0.135,0.348 0.348,0 0,1 -0.039,-0.167v-5.247a0.345,0.345 0,0 1,0.039 -0.167,0.428 0.428,0 0,1 0.1,-0.135 0.469,0.469 0,0 1,0.155 -0.092,0.521 0.521,0 0,1 0.192,-0.033h1.4a0.433,0.433 0,0 1,-0.023 -0.118v-0.561a0.438,0.438 0,0 1,0.438 -0.438h0a0.438,0.438 0,0 1,0.438 0.438v0.561a0.434,0.434 0,0 1,-0.024 0.118h0.1a7.422,7.422 0,0 1,1.01 0.06,2.11 2.11,0 0,1 0.742,0.226 1.1,1.1 0,0 1,0.455 0.467,1.733 1.733,0 0,1 0.154,0.781 1.362,1.362 0,0 1,-0.235 0.816,1.574 1.574,0 0,1 -0.717,0.515 1.864,1.864 0,0 1,0.543 0.207,1.452 1.452,0 0,1 0.392,0.328 1.35,1.35 0,0 1,0.239 0.429A1.593,1.593 0,0 1,15.068 14.526Z\" fill=\"currentColor\"></path>"
  },
  "tune": {
    vb: "0 0 24.0 24.0",
    p: "<path d=\"M3,17v2h6v-2L3,17zM3,5v2h10L13,5L3,5zM13,21v-2h8v-2h-8v-2h-2v6h2zM7,9v2L3,11v2h4v2h2L9,9L7,9zM21,13v-2L11,11v2h10zM15,9h2L17,7h4L21,5h-4L17,3h-2v6z\" fill=\"currentColor\"></path>"
  }
};
function Icon({
  name,
  size = 24,
  color,
  title,
  style,
  className,
  ...rest
}) {
  const def = MYMO_ICONS[name];
  if (!def) {
    if (typeof console !== "undefined") console.warn("Icon: unknown name '" + name + "'");
    return null;
  }
  return /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: def.vb,
    width: size,
    height: size,
    className: className,
    role: title ? "img" : "presentation",
    "aria-label": title,
    "aria-hidden": title ? undefined : true,
    style: {
      display: "block",
      flex: "none",
      color,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: def.p
    }
  }, rest));
}
const ICON_NAMES = Object.keys(MYMO_ICONS);

// ===== components/core/Button.jsx =====

/**
 * MyMo Button — the app's pill-shaped action button.
 * Primary = brand gradient (#FA7C93 → #F14658), Secondary = brand outline,
 * Text = borderless. 48px tall (sm = 32px), 25px pill radius.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  block = false,
  disabled = false,
  iconLeft,
  iconRight,
  style,
  ...rest
}) {
  const height = size === "sm" ? "var(--size-button-sm)" : "var(--size-button)";
  const fontSize = size === "sm" ? "var(--text-16)" : "var(--text-18)";
  const padX = size === "sm" ? "20px" : "32px";
  const base = {
    display: block ? "flex" : "inline-flex",
    width: block ? "100%" : undefined,
    minWidth: size === "sm" ? 96 : 184,
    height,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: `0 ${padX}`,
    borderRadius: "var(--radius-button)",
    fontFamily: "var(--font-sans)",
    fontWeight: "var(--weight-bold)",
    fontSize,
    lineHeight: 1,
    border: "none",
    cursor: disabled ? "default" : "pointer",
    boxSizing: "border-box",
    transition: "filter .15s ease, transform .05s ease, opacity .15s ease",
    WebkitTapHighlightColor: "transparent"
  };
  const variants = {
    primary: {
      color: "var(--text-on-brand)",
      background: "linear-gradient(90deg, var(--mymo-grad-btn-start), var(--mymo-grad-btn-end))",
      boxShadow: disabled ? "none" : "var(--elevation-fab)"
    },
    secondary: {
      color: "var(--color-brand)",
      background: "transparent",
      border: "1px solid var(--color-brand)"
    },
    text: {
      color: "var(--color-brand)",
      background: "transparent",
      minWidth: 0,
      padding: "0 12px"
    }
  };
  const disabledStyle = disabled ? variant === "primary" ? {
    background: "var(--mymo-mid-gray)",
    color: "#fff",
    boxShadow: "none"
  } : {
    color: "var(--text-disabled)",
    borderColor: "var(--border-strong)"
  } : null;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    style: {
      ...base,
      ...variants[variant],
      ...disabledStyle,
      ...style
    },
    onMouseDown: e => !disabled && (e.currentTarget.style.transform = "scale(0.98)"),
    onMouseUp: e => e.currentTarget.style.transform = "",
    onMouseLeave: e => e.currentTarget.style.transform = ""
  }, rest), iconLeft && /*#__PURE__*/React.createElement(Icon, {
    name: iconLeft,
    size: size === "sm" ? 18 : 20
  }), children, iconRight && /*#__PURE__*/React.createElement(Icon, {
    name: iconRight,
    size: size === "sm" ? 18 : 20
  }));
}

// ===== components/core/Card.jsx =====

/**
 * MyMo Card — white surface, 16px radius, soft cool-gray shadow.
 * Set variant="outline" for the hairline-border style some screens use,
 * or variant="flat" for no elevation.
 */
function Card({
  children,
  variant = "shadow",
  padding = 16,
  style,
  ...rest
}) {
  const variants = {
    shadow: {
      boxShadow: "var(--elevation-card)",
      border: "none"
    },
    outline: {
      boxShadow: "none",
      border: "1px solid var(--mymo-shadow-card)"
    },
    flat: {
      boxShadow: "none",
      border: "none"
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "var(--surface-card)",
      borderRadius: "var(--radius-card)",
      padding,
      boxSizing: "border-box",
      ...variants[variant],
      ...style
    }
  }, rest), children);
}

// ===== components/core/Badge.jsx =====

/**
 * MyMo Badge / status pill. Tones: success, warning, error, info, neutral, brand.
 * Soft tinted background + saturated text, fully rounded.
 */
function Badge({
  children,
  tone = "neutral",
  solid = false,
  style,
  ...rest
}) {
  const tones = {
    success: {
      c: "var(--mymo-success)",
      bg: "rgba(44,168,124,0.12)"
    },
    warning: {
      c: "var(--mymo-warning)",
      bg: "rgba(255,149,0,0.14)"
    },
    error: {
      c: "var(--mymo-red)",
      bg: "rgba(255,59,48,0.12)"
    },
    info: {
      c: "var(--mymo-link)",
      bg: "rgba(0,122,255,0.12)"
    },
    brand: {
      c: "var(--color-brand)",
      bg: "var(--mymo-pastel-pink)"
    },
    neutral: {
      c: "var(--text-secondary)",
      bg: "var(--mymo-account-row)"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      height: 22,
      padding: "0 10px",
      borderRadius: "var(--radius-pill)",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--weight-semibold)",
      fontSize: "var(--text-12)",
      lineHeight: 1,
      whiteSpace: "nowrap",
      color: solid ? "#fff" : t.c,
      background: solid ? t.c : t.bg,
      ...style
    }
  }, rest), children);
}

// ===== components/core/Avatar.jsx =====

/**
 * MyMo Avatar — circular profile/initials chip. Pastel-pink fill with
 * brand-colored initials by default; pass src for a photo.
 */
function Avatar({
  name = "",
  src,
  size = 44,
  bg,
  color,
  style,
  ...rest
}) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join("");
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      flex: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: bg || "var(--mymo-pastel-pink)",
      color: color || "var(--color-brand)",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--weight-bold)",
      fontSize: size * 0.4,
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials || "?");
}

// ===== components/core/AmountText.jsx =====

/**
 * MyMo AmountText — formats a Thai Baht amount with brand sign coloring.
 * Positive = green (#4CD964), negative = red (#FF3B30), neutral = ink.
 */
function AmountText({
  value,
  showSign = true,
  currency = "฿",
  size = 16,
  weight = "var(--weight-bold)",
  colored = true,
  style,
  ...rest
}) {
  const n = typeof value === "number" ? value : parseFloat(value) || 0;
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  const abs = Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const color = !colored ? "var(--text-primary)" : n > 0 ? "var(--amount-positive)" : n < 0 ? "var(--amount-negative)" : "var(--text-primary)";
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: weight,
      fontSize: size,
      color,
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), showSign && sign, currency, abs);
}

// ===== components/core/SectionHeader.jsx =====

/**
 * MyMo SectionHeader — bold section title with an optional trailing action
 * (e.g. "See all"). Used above lists and content groups.
 */
function SectionHeader({
  title,
  action,
  onAction,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "4px 0",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--weight-bold)",
      fontSize: "var(--text-20)",
      color: "var(--text-primary)"
    }
  }, title), action && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAction,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 2,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--weight-medium)",
      fontSize: "var(--text-14)",
      color: "var(--color-brand)",
      padding: 0
    }
  }, action, /*#__PURE__*/React.createElement(Icon, {
    name: "black_arrow_right",
    size: 16
  })));
}

// ===== components/forms/Input.jsx =====

/**
 * MyMo Input — labelled text field. Outlined (rounded 8px) by default,
 * or variant="underline" for the app's form-row style. Brand focus ring.
 */
function Input({
  label,
  hint,
  error,
  variant = "outline",
  value,
  onChange,
  type = "text",
  style,
  inputStyle,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const borderColor = error ? "var(--mymo-red)" : focused ? "var(--color-brand)" : variant === "outline" ? "var(--border-strong)" : "var(--border-divider)";
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "var(--text-13)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-secondary)",
      marginBottom: 6
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: value,
    onChange: onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      width: "100%",
      height: 48,
      boxSizing: "border-box",
      padding: variant === "outline" ? "0 14px" : "0 2px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-16)",
      color: "var(--text-primary)",
      background: "transparent",
      border: "none",
      borderRadius: variant === "outline" ? "var(--radius-input)" : 0,
      outline: "none",
      ...(variant === "outline" ? {
        border: `1px solid ${borderColor}`
      } : {
        borderBottom: `1.5px solid ${borderColor}`
      }),
      ...inputStyle
    }
  }, rest)), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "var(--text-12)",
      color: error ? "var(--mymo-red)" : "var(--text-tertiary)",
      marginTop: 6
    }
  }, error || hint));
}

// ===== components/forms/Switch.jsx =====

/**
 * MyMo Switch — iOS-style toggle. On = brand crimson track.
 */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    role: "switch",
    "aria-checked": checked,
    disabled: disabled,
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      width: 51,
      height: 31,
      borderRadius: 999,
      border: "none",
      padding: 2,
      cursor: disabled ? "default" : "pointer",
      background: checked ? "var(--color-brand)" : "var(--mymo-mid-gray)",
      opacity: disabled ? 0.5 : 1,
      transition: "background .2s ease",
      display: "inline-flex",
      alignItems: "center",
      boxSizing: "border-box",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 27,
      height: 27,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      transform: checked ? "translateX(20px)" : "translateX(0)",
      transition: "transform .2s ease"
    }
  }));
}

// ===== components/forms/Chip.jsx =====

/**
 * MyMo Chip — choice/filter chip. 32px tall, 20px radius, 1px border;
 * selected = brand fill + white text (matches the app's ChipChoice style).
 */
function Chip({
  children,
  selected = false,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    style: {
      height: 32,
      padding: "0 16px",
      borderRadius: 20,
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--weight-bold)",
      fontSize: "var(--text-14)",
      lineHeight: 1,
      transition: "all .15s ease",
      color: selected ? "#fff" : "var(--text-primary)",
      background: selected ? "var(--color-brand)" : "transparent",
      border: `1px solid ${selected ? "var(--color-brand)" : "var(--mymo-ink-15)"}`,
      ...style
    }
  }, rest), children);
}

// ===== components/forms/PinDots.jsx =====

/**
 * MyMo PinDots — the 6-digit passcode indicator used across login,
 * activation and confirm flows. Filled dots = entered digits.
 */
function PinDots({
  length = 6,
  filled = 0,
  error = false,
  dotSize = 16,
  gap = 20,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap,
      alignItems: "center",
      ...style
    }
  }, Array.from({
    length
  }).map((_, i) => {
    const isFilled = i < filled;
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        width: dotSize,
        height: dotSize,
        borderRadius: "50%",
        boxSizing: "border-box",
        transition: "background .15s ease",
        background: isFilled ? error ? "var(--mymo-red)" : "var(--color-brand)" : "transparent",
        border: isFilled ? "none" : `1.5px solid ${error ? "var(--mymo-red)" : "var(--mymo-mid-gray)"}`
      }
    });
  }));
}

// ===== components/navigation/ListRow.jsx =====

/**
 * MyMo ListRow — the universal tappable row (accounts, transactions,
 * settings, menus). Leading slot + title/subtitle + trailing slot,
 * with an optional chevron and bottom hairline.
 */
function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  chevron = false,
  divider = true,
  onClick,
  style,
  ...rest
}) {
  const clickable = !!onClick;
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 0",
      cursor: clickable ? "pointer" : "default",
      borderBottom: divider ? "1px solid var(--border-hairline)" : "none",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), leading != null && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      display: "flex"
    }
  }, leading), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-16)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-primary)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, title), subtitle != null && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-13)",
      color: "var(--text-secondary)",
      marginTop: 2,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, subtitle)), trailing != null && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      textAlign: "right"
    }
  }, trailing), chevron && /*#__PURE__*/React.createElement(Icon, {
    name: "black_arrow_right",
    size: 18,
    color: "var(--mymo-mid-gray)"
  }));
}

// ===== components/navigation/BottomTabBar.jsx =====

const DEFAULT_TABS = [{
  key: "home",
  label: "Home",
  icon: "tab_home"
}, {
  key: "accounts",
  label: "Accounts",
  icon: "tab_accounts"
}, {
  key: "scan",
  label: "Scan",
  icon: "tab_scan",
  raised: true
}, {
  key: "history",
  label: "History",
  icon: "tab_history"
}, {
  key: "more",
  label: "Settings",
  icon: "tab_more"
}];

/**
 * MyMo BottomTabBar — the fixed 5-tab bottom navigation. The center
 * "Pay by Scan" tab is raised into a brand gradient circle.
 */
function BottomTabBar({
  tabs = DEFAULT_TABS,
  active = "home",
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      height: "var(--size-tabbar)",
      background: "#fff",
      borderTop: "1px solid var(--border-hairline)",
      boxShadow: "0 -2px 12px rgba(150,160,175,0.10)",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, tabs.map(t => {
    const isActive = t.key === active;
    if (t.raised) {
      return /*#__PURE__*/React.createElement("button", {
        key: t.key,
        type: "button",
        onClick: () => onChange && onChange(t.key),
        style: {
          flex: 1,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "6px 0"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          position: "absolute",
          top: -18,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--mymo-grad-btn-start), var(--mymo-grad-btn-end))",
          boxShadow: "var(--elevation-fab)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff"
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: t.icon,
        size: 26
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          fontWeight: "var(--weight-medium)",
          color: "var(--text-tertiary)",
          marginTop: 22
        }
      }, t.label));
    }
    return /*#__PURE__*/React.createElement("button", {
      key: t.key,
      type: "button",
      onClick: () => onChange && onChange(t.key),
      style: {
        flex: 1,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        color: isActive ? "var(--color-brand)" : "var(--text-tertiary)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: t.icon,
      size: 24
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: "var(--weight-medium)"
      }
    }, t.label));
  }));
}

// ===== components/navigation/TopBar.jsx =====

/**
 * MyMo TopBar — the 56px screen header. Plain (white) or variant="gradient"
 * for the pink brand header. Optional back button + trailing action icons.
 */
function TopBar({
  title,
  variant = "plain",
  onBack,
  actions = [],
  style
}) {
  const gradient = variant === "gradient";
  const fg = gradient ? "#fff" : "var(--text-primary)";
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: "var(--size-toolbar)",
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "0 8px",
      boxSizing: "border-box",
      color: fg,
      fontFamily: "var(--font-sans)",
      background: gradient ? "linear-gradient(180deg, var(--mymo-grad-primary-start), var(--mymo-grad-primary-end))" : "#fff",
      ...style
    }
  }, onBack && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onBack,
    "aria-label": "Back",
    style: {
      width: 40,
      height: 40,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      color: fg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: "scaleX(-1)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "black_arrow_right",
    size: 22
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      flex: 1,
      margin: 0,
      padding: onBack ? 0 : "0 8px",
      fontSize: "var(--text-18)",
      fontWeight: "var(--weight-bold)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, actions.map((a, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    onClick: a.onClick,
    "aria-label": a.label,
    style: {
      width: 40,
      height: 40,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      color: fg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.icon,
    size: 22
  })))));
}
Object.assign(window, {
  MyMoKit: {
    Icon,
    MYMO_ICONS,
    ICON_NAMES,
    Button,
    Card,
    Badge,
    Avatar,
    AmountText,
    SectionHeader,
    Input,
    Switch,
    Chip,
    PinDots,
    ListRow,
    BottomTabBar,
    TopBar
  }
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mymo_app/mymo-kit.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mymo_app/screen-accounts.jsx
try { (() => {
/* Accounts list + Account detail */
function AccountCard({
  acc,
  onClick
}) {
  const {
    Icon
  } = window.MyMoKit;
  const D = window.MyMoData;
  const [c1, c2] = D.catColor[acc.color];
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      width: "100%",
      textAlign: "left",
      border: "none",
      cursor: "pointer",
      borderRadius: "var(--radius-16)",
      padding: 16,
      marginBottom: 12,
      color: "#fff",
      background: `linear-gradient(135deg, ${c1}, ${c2})`,
      boxShadow: "var(--elevation-card)",
      display: "block",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: "var(--weight-bold)"
    }
  }, acc.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      opacity: 0.9,
      marginTop: 2
    }
  }, acc.no)), /*#__PURE__*/React.createElement(Icon, {
    name: "black_arrow_right",
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      fontSize: 11,
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "0.06em",
      opacity: 0.85
    }
  }, "AVAILABLE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: "var(--weight-bold)",
      fontVariantNumeric: "tabular-nums"
    }
  }, "\u0E3F", Math.abs(acc.balance).toLocaleString("en-US", {
    minimumFractionDigits: 2
  })));
}
function AccountsScreen({
  go
}) {
  const {
    TopBar
  } = window.MyMoKit;
  const D = window.MyMoData;
  const groups = ["Savings", "Current", "Fixed Deposit", "Loan"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-app)",
      minHeight: "100%"
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    title: "My Accounts",
    variant: "gradient",
    actions: [{
      icon: "search"
    }, {
      icon: "setting_gear"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16
    }
  }, groups.map(g => {
    const items = D.accounts.filter(a => a.group === g);
    if (!items.length) return null;
    return /*#__PURE__*/React.createElement("div", {
      key: g,
      style: {
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: "var(--weight-bold)",
        color: "var(--text-secondary)",
        margin: "2px 2px 10px"
      }
    }, g), items.map(a => /*#__PURE__*/React.createElement(AccountCard, {
      key: a.id,
      acc: a,
      onClick: () => go("account", a.id)
    })));
  })));
}
function AccountDetailScreen({
  go,
  params
}) {
  const {
    TopBar,
    Icon,
    AmountText,
    ListRow
  } = window.MyMoKit;
  const D = window.MyMoData;
  const acc = D.accounts.find(a => a.id === params) || D.accounts[0];
  const [c1, c2] = D.catColor[acc.color];
  const detailActions = [{
    label: "QR",
    icon: "billscan"
  }, {
    label: "Transfer",
    icon: "transfer_landing",
    onClick: () => go("transfer")
  }, {
    label: "Statement",
    icon: "book_dstatement"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-app)",
      minHeight: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: `linear-gradient(135deg, ${c1}, ${c2})`,
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    title: acc.name,
    variant: "gradient",
    onBack: () => go("accounts"),
    actions: [{
      icon: "setting_gear"
    }],
    style: {
      background: "transparent"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "4px 24px 22px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      opacity: 0.9
    }
  }, acc.no), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "0.06em",
      opacity: 0.85,
      marginTop: 14
    }
  }, "AVAILABLE BALANCE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 36,
      fontWeight: "var(--weight-bold)",
      fontVariantNumeric: "tabular-nums"
    }
  }, "\u0E3F", Math.abs(acc.balance).toLocaleString("en-US", {
    minimumFractionDigits: 2
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 20
    }
  }, detailActions.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.label,
    onClick: a.onClick,
    style: {
      flex: 1,
      border: "none",
      cursor: "pointer",
      background: "rgba(255,255,255,0.18)",
      color: "#fff",
      borderRadius: 14,
      padding: "12px 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.icon,
    size: 22
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: "var(--weight-semibold)"
    }
  }, a.label)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: "var(--weight-bold)",
      color: "var(--text-secondary)",
      marginBottom: 4
    }
  }, "Transactions"), D.tx.map((t, i, arr) => /*#__PURE__*/React.createElement(ListRow, {
    key: t.id,
    leading: /*#__PURE__*/React.createElement("span", {
      style: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "var(--mymo-account-row)",
        color: "var(--text-secondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: t.icon,
      size: 20
    })),
    title: t.who,
    subtitle: t.when + " · " + t.note,
    trailing: /*#__PURE__*/React.createElement(AmountText, {
      value: t.amount
    }),
    divider: i < arr.length - 1
  }))));
}
window.MyMoKitScreens = Object.assign(window.MyMoKitScreens || {}, {
  AccountsScreen,
  AccountDetailScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mymo_app/screen-accounts.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mymo_app/screen-home.jsx
try { (() => {
/* Home (landing) screen */
function HomeScreen({
  go
}) {
  const {
    Icon,
    AmountText,
    Card,
    SectionHeader,
    ListRow,
    Avatar
  } = window.MyMoKit;
  const D = window.MyMoData;
  const [hidden, setHidden] = useState(false);
  const main = D.accounts[0];
  const actions = [{
    key: "transfer",
    label: "Transfer",
    icon: "transfer_landing",
    onClick: () => go("transfer")
  }, {
    key: "bill",
    label: "Pay Bill",
    icon: "book_dstatement",
    onClick: () => go("transfer")
  }, {
    key: "scan",
    label: "Scan",
    icon: "billscan",
    onClick: () => go("scan")
  }, {
    key: "topup",
    label: "Top Up",
    icon: "hotkey_payment",
    onClick: () => go("transfer")
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-app)",
      minHeight: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(160deg, var(--mymo-grad-primary-start), var(--mymo-grad-primary-end))",
      padding: "14px 20px 60px",
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: D.user.name,
    size: 44,
    bg: "rgba(255,255,255,0.25)",
    color: "#fff"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      opacity: 0.9
    }
  }, "Welcome back"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: "var(--weight-bold)"
    }
  }, "Hi, ", D.user.first, " :)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      background: "rgba(255,255,255,0.18)",
      padding: "6px 12px",
      borderRadius: 999
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "key",
    size: 16
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: "var(--weight-semibold)"
    }
  }, D.user.points.toLocaleString(), " pts"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "0.08em",
      opacity: 0.85
    }
  }, "MAIN BALANCE"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setHidden(!hidden),
    style: {
      border: "none",
      background: "transparent",
      padding: 0,
      cursor: "pointer",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 38,
      fontWeight: "var(--weight-bold)",
      fontVariantNumeric: "tabular-nums"
    }
  }, hidden ? "฿ • • • • • •" : "฿" + main.balance.toLocaleString("en-US", {
    minimumFractionDigits: 2
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "0.06em",
      opacity: 0.85,
      border: "1px solid rgba(255,255,255,0.5)",
      borderRadius: 999,
      padding: "3px 10px"
    }
  }, hidden ? "SHOW" : "HIDE")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      opacity: 0.9,
      marginTop: 2
    }
  }, main.name, " \xB7 ", main.mask))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 16px",
      marginTop: -38
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "16px 10px"
    }
  }, actions.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.key,
    onClick: a.onClick,
    style: {
      flex: 1,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 48,
      height: 48,
      borderRadius: "50%",
      background: "var(--mymo-pastel-pink)",
      color: "var(--color-brand)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.icon,
    size: 24
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: "var(--weight-medium)",
      color: "var(--text-primary)"
    }
  }, a.label))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 16px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: "var(--radius-16)",
      padding: 16,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      gap: 14,
      background: "linear-gradient(135deg, var(--mymo-cat-salak), var(--mymo-cat-salak-grad))"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.25)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "digitalsalak_deposit",
    size: 26
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: "var(--weight-bold)",
      fontSize: 15
    }
  }, "Digital Salak draw is near"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      opacity: 0.95
    }
  }, "Save \u0E3F50 for a chance to win. Don't miss it :)")), /*#__PURE__*/React.createElement(Icon, {
    name: "black_arrow_right",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 16px 16px"
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionHeader, {
    title: "Last Transactions",
    action: "See all",
    onAction: () => go("history")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, D.tx.slice(0, 4).map((t, i, arr) => /*#__PURE__*/React.createElement(ListRow, {
    key: t.id,
    leading: /*#__PURE__*/React.createElement("span", {
      style: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "var(--mymo-account-row)",
        color: "var(--text-secondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: t.icon,
      size: 20
    })),
    title: t.who,
    subtitle: t.when + " · " + t.note,
    trailing: /*#__PURE__*/React.createElement(AmountText, {
      value: t.amount
    }),
    divider: i < arr.length - 1
  }))))));
}
window.MyMoKitScreens = Object.assign(window.MyMoKitScreens || {}, {
  HomeScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mymo_app/screen-home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mymo_app/screen-login.jsx
try { (() => {
/* Login — passcode entry with numeric keypad */
function LoginScreen({
  onSuccess
}) {
  const {
    PinDots,
    Avatar
  } = window.MyMoKit;
  const D = window.MyMoData;
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  function press(n) {
    if (pin.length >= 6) return;
    const next = pin + n;
    setError(false);
    setPin(next);
    if (next.length === 6) {
      setTimeout(() => onSuccess(), 280);
    }
  }
  function back() {
    setPin(pin.slice(0, -1));
    setError(false);
  }
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "60px 28px 28px",
      boxSizing: "border-box",
      background: "linear-gradient(170deg, var(--mymo-grad-primary-start), var(--mymo-grad-primary-end))",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: D.user.name,
    size: 72,
    bg: "rgba(255,255,255,0.25)",
    color: "#fff"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: "var(--weight-bold)"
    }
  }, "Hi, ", D.user.first), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      opacity: 0.9,
      marginTop: 4
    }
  }, "Enter your 6-digit passcode")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(PinDots, {
    filled: pin.length,
    error: error,
    dotSize: 15,
    gap: 18,
    style: {
      filter: "none"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 14,
      maxWidth: 300
    }
  }, keys.map((k, i) => k === "" ? /*#__PURE__*/React.createElement("div", {
    key: i
  }) : /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => k === "del" ? back() : press(k),
    style: {
      height: 60,
      borderRadius: "50%",
      border: "none",
      cursor: "pointer",
      background: k === "del" ? "transparent" : "rgba(255,255,255,0.18)",
      color: "#fff",
      fontSize: k === "del" ? 14 : 26,
      fontWeight: "var(--weight-medium)",
      fontFamily: "var(--font-sans)"
    }
  }, k === "del" ? "⌫" : k))));
}
window.MyMoKitScreens = Object.assign(window.MyMoKitScreens || {}, {
  LoginScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mymo_app/screen-login.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mymo_app/screen-more.jsx
try { (() => {
/* History screen with filter chips */
function HistoryScreen({
  go
}) {
  const {
    TopBar,
    Icon,
    AmountText,
    ListRow,
    Chip,
    Card
  } = window.MyMoKit;
  const D = window.MyMoData;
  const filters = ["All", "Money In", "Money Out", "Bills"];
  const [f, setF] = useState("All");
  const list = D.tx.filter(t => f === "All" ? true : f === "Money In" ? t.amount > 0 : f === "Money Out" ? t.amount < 0 : /Bill|Top Up|Scan/.test(t.note));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-app)",
      minHeight: "100%"
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    title: "History",
    variant: "gradient",
    actions: [{
      icon: "calendar_filter"
    }, {
      icon: "tune"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      padding: "14px 16px",
      overflowX: "auto"
    }
  }, filters.map(c => /*#__PURE__*/React.createElement(Chip, {
    key: c,
    selected: f === c,
    onClick: () => setF(c)
  }, c))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 16px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "0.06em",
      color: "var(--text-tertiary)",
      margin: "4px 2px 8px"
    }
  }, "LAST 12 MONTHS \xB7 ", list.length, " TRANSACTIONS"), /*#__PURE__*/React.createElement(Card, {
    padding: 4
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 12px"
    }
  }, list.map((t, i, arr) => /*#__PURE__*/React.createElement(ListRow, {
    key: t.id,
    leading: /*#__PURE__*/React.createElement("span", {
      style: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "var(--mymo-account-row)",
        color: "var(--text-secondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: t.icon,
      size: 20
    })),
    title: t.who,
    subtitle: t.when + " · " + t.note,
    trailing: /*#__PURE__*/React.createElement(AmountText, {
      value: t.amount
    }),
    divider: i < arr.length - 1
  }))))));
}

/* Settings (More) screen */
function SettingsScreen({
  go
}) {
  const {
    TopBar,
    Icon,
    ListRow,
    Avatar,
    Switch,
    Card
  } = window.MyMoKit;
  const D = window.MyMoData;
  const [bal, setBal] = useState(true);
  const [noti, setNoti] = useState(true);
  const row = (icon, title) => /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: "var(--mymo-pastel-pink)",
      color: "var(--color-brand)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 20
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-app)",
      minHeight: "100%"
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    title: "Settings",
    variant: "gradient"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: D.user.name,
    size: 56
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: "var(--weight-bold)"
    }
  }, D.user.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-secondary)"
    }
  }, "MyMo \u2022\u20228830 \xB7 ", D.user.points.toLocaleString(), " points")), /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: 20,
    color: "var(--mymo-mid-gray)"
  })), /*#__PURE__*/React.createElement(Card, {
    padding: 4,
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 14px"
    }
  }, /*#__PURE__*/React.createElement(ListRow, {
    leading: row("key"),
    title: "Change passcode",
    chevron: true
  }), /*#__PURE__*/React.createElement(ListRow, {
    leading: row("contact_book"),
    title: "My Favorites",
    chevron: true
  }), /*#__PURE__*/React.createElement(ListRow, {
    leading: row("schedule"),
    title: "Scheduled transfers",
    chevron: true,
    divider: false
  }))), /*#__PURE__*/React.createElement(Card, {
    padding: 4,
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 14px"
    }
  }, /*#__PURE__*/React.createElement(ListRow, {
    leading: row("info"),
    title: "Show balance on Home",
    trailing: /*#__PURE__*/React.createElement(Switch, {
      checked: bal,
      onChange: setBal
    })
  }), /*#__PURE__*/React.createElement(ListRow, {
    leading: row("note"),
    title: "Balance change alerts",
    trailing: /*#__PURE__*/React.createElement(Switch, {
      checked: noti,
      onChange: setNoti
    }),
    divider: false
  }))), /*#__PURE__*/React.createElement(Card, {
    padding: 4
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 14px"
    }
  }, /*#__PURE__*/React.createElement(ListRow, {
    leading: row("setting_gear"),
    title: "Account Setting",
    chevron: true
  }), /*#__PURE__*/React.createElement(ListRow, {
    leading: row("share"),
    title: "Refer a friend",
    chevron: true,
    divider: false
  })))));
}
window.MyMoKitScreens = Object.assign(window.MyMoKitScreens || {}, {
  HistoryScreen,
  SettingsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mymo_app/screen-more.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mymo_app/screen-transfer.jsx
try { (() => {
/* Transfer flow (recipient → amount → confirm → e-slip) and Scan success */
function TransferScreen({
  go,
  params
}) {
  const {
    TopBar,
    Icon,
    Avatar,
    Button,
    Card,
    ListRow,
    Input
  } = window.MyMoKit;
  const D = window.MyMoData;
  const isScan = params === "scan";
  const [step, setStep] = useState(isScan ? "amount" : "who");
  const [to, setTo] = useState(isScan ? {
    id: "m",
    name: "7-Eleven",
    mask: "Branch 12345 · PromptPay"
  } : null);
  const [amount, setAmount] = useState(isScan ? "89.00" : "");
  const from = D.accounts[0];
  function pick(fav) {
    setTo(fav);
    setStep("amount");
  }
  const Header = (title, back) => /*#__PURE__*/React.createElement(TopBar, {
    title: title,
    onBack: back
  });
  if (step === "who") {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: "var(--surface-app)",
        minHeight: "100%"
      }
    }, Header("Transfer", () => go("home")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: "var(--weight-bold)",
        color: "var(--text-secondary)",
        marginBottom: 6
      }
    }, "My Favorites"), /*#__PURE__*/React.createElement(Card, {
      padding: 4
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 14px"
      }
    }, D.favorites.map((fv, i, arr) => /*#__PURE__*/React.createElement(ListRow, {
      key: fv.id,
      leading: /*#__PURE__*/React.createElement(Avatar, {
        name: fv.name
      }),
      title: fv.name,
      subtitle: fv.mask,
      chevron: true,
      divider: i < arr.length - 1,
      onClick: () => pick(fv)
    }))))));
  }
  if (step === "amount") {
    const valid = parseFloat(amount) > 0;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: "var(--surface-app)",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column"
      }
    }, Header(isScan ? "Pay by Scan" : "Enter amount", () => isScan ? go("home") : setStep("who")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 20,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Card, {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: to.name
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: "var(--weight-semibold)"
      }
    }, to.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "var(--text-secondary)"
      }
    }, to.mask))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: "var(--weight-semibold)",
        letterSpacing: "0.06em",
        color: "var(--text-tertiary)"
      }
    }, "AMOUNT (THB)"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "baseline",
        justifyContent: "center",
        gap: 6,
        marginTop: 10,
        color: valid ? "var(--text-primary)" : "var(--text-disabled)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 26,
        fontWeight: "var(--weight-bold)"
      }
    }, "\u0E3F"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 44,
        fontWeight: "var(--weight-bold)",
        fontVariantNumeric: "tabular-nums"
      }
    }, amount || "0.00")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "var(--text-secondary)",
        marginTop: 8
      }
    }, "From ", from.name, " \xB7 ", from.mask))), /*#__PURE__*/React.createElement(NumPad, {
      value: amount,
      onChange: setAmount
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 20px 22px",
        background: "#fff"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      block: true,
      disabled: !valid,
      onClick: () => setStep("confirm")
    }, "Next")));
  }
  if (step === "confirm") {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: "var(--surface-app)",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column"
      }
    }, Header("Confirm", () => setStep("amount")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 20,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        paddingBottom: 16,
        borderBottom: "1px solid var(--border-hairline)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: "var(--weight-semibold)",
        letterSpacing: "0.06em",
        color: "var(--text-tertiary)"
      }
    }, "TRANSFER AMOUNT"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 36,
        fontWeight: "var(--weight-bold)",
        marginTop: 6
      }
    }, "\u0E3F", parseFloat(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2
    }))), /*#__PURE__*/React.createElement(Row, {
      label: "To",
      value: to.name,
      sub: to.mask
    }), /*#__PURE__*/React.createElement(Row, {
      label: "From",
      value: from.name,
      sub: from.mask
    }), /*#__PURE__*/React.createElement(Row, {
      label: "Fee",
      value: "\u0E3F0.00"
    }), /*#__PURE__*/React.createElement(Row, {
      label: "Date",
      value: "Today, just now",
      last: true
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 20px 22px",
        background: "#fff"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      block: true,
      onClick: () => setStep("done")
    }, isScan ? "Pay" : "Transfer")));
  }

  /* success e-slip */
  return /*#__PURE__*/React.createElement(EslipSuccess, {
    to: to,
    amount: amount,
    from: from,
    onDone: () => go("home"),
    isScan: isScan
  });
}
function Row({
  label,
  value,
  sub,
  last
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: "12px 0",
      borderBottom: last ? "none" : "1px solid var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: "var(--text-secondary)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: "var(--weight-semibold)",
      display: "block"
    }
  }, value), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: "var(--text-tertiary)"
    }
  }, sub)));
}
function NumPad({
  value,
  onChange
}) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"];
  function press(k) {
    if (k === "del") {
      onChange(value.slice(0, -1));
      return;
    }
    if (k === "." && value.includes(".")) return;
    onChange((value + k).slice(0, 12));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      background: "var(--mymo-light-gray-bg)",
      borderTop: "1px solid var(--border-hairline)"
    }
  }, keys.map(k => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => press(k),
    style: {
      height: 56,
      border: "none",
      borderBottom: "1px solid var(--border-hairline)",
      background: "transparent",
      cursor: "pointer",
      fontSize: k === "del" ? 16 : 22,
      fontWeight: "var(--weight-medium)",
      fontFamily: "var(--font-sans)",
      color: "var(--text-primary)"
    }
  }, k === "del" ? "⌫" : k)));
}
function EslipSuccess({
  to,
  amount,
  from,
  onDone,
  isScan
}) {
  const {
    Icon,
    Button
  } = window.MyMoKit;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-app)",
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "44px 24px 24px",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 76,
      height: 76,
      borderRadius: "50%",
      background: "var(--mymo-success)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      boxShadow: "0 8px 24px rgba(44,168,124,0.35)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "40",
    height: "40",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 13l4 4L19 7"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: "var(--weight-bold)",
      marginTop: 18,
      width: "100%",
      textAlign: "center"
    }
  }, "Transaction Successful"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--text-secondary)",
      marginTop: 4,
      width: "100%",
      textAlign: "center"
    }
  }, "Today, just now"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 42,
      fontWeight: "var(--weight-bold)",
      marginTop: 18,
      width: "100%",
      textAlign: "center"
    }
  }, "\u0E3F", parseFloat(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      borderRadius: "var(--radius-16)",
      width: "100%",
      padding: "4px 18px",
      marginTop: 24,
      boxShadow: "var(--elevation-card)"
    }
  }, /*#__PURE__*/React.createElement(Row, {
    label: "To",
    value: to.name,
    sub: to.mask
  }), /*#__PURE__*/React.createElement(Row, {
    label: "From",
    value: from.name,
    sub: from.mask
  }), /*#__PURE__*/React.createElement(Row, {
    label: "Fee",
    value: "\u0E3F0.00",
    last: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    block: true,
    onClick: onDone
  }, "Done"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    block: true,
    iconLeft: "share"
  }, "Share")));
}
window.MyMoKitScreens = Object.assign(window.MyMoKitScreens || {}, {
  TransferScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mymo_app/screen-transfer.jsx", error: String((e && e.message) || e) }); }

__ds_ns.AmountText = __ds_scope.AmountText;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.MYMO_ICONS = __ds_scope.MYMO_ICONS;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.PinDots = __ds_scope.PinDots;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.BottomTabBar = __ds_scope.BottomTabBar;

__ds_ns.ListRow = __ds_scope.ListRow;

__ds_ns.TopBar = __ds_scope.TopBar;

})();

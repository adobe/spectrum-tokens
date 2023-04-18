function A(u, s) {
  for (var r = 0; r < s.length; r++) {
    const o = s[r];
    if (typeof o != "string" && !Array.isArray(o)) {
      for (const n in o)
        if (n !== "default" && !(n in u)) {
          const i = Object.getOwnPropertyDescriptor(o, n);
          i &&
            Object.defineProperty(
              u,
              n,
              i.get ? i : { enumerable: !0, get: () => o[n] },
            );
        }
    }
  }
  return Object.freeze(
    Object.defineProperty(u, Symbol.toStringTag, { value: "Module" }),
  );
}
var O =
    typeof globalThis < "u"
      ? globalThis
      : typeof window < "u"
      ? window
      : typeof global < "u"
      ? global
      : typeof self < "u"
      ? self
      : {},
  b = { exports: {} };
(function (u, s) {
  (function (r, o) {
    o();
  })(O, function () {
    function r(n) {
      var i = !0,
        d = !1,
        l = null,
        y = {
          text: !0,
          search: !0,
          url: !0,
          tel: !0,
          email: !0,
          password: !0,
          number: !0,
          date: !0,
          month: !0,
          week: !0,
          time: !0,
          datetime: !0,
          "datetime-local": !0,
        };
      function a(e) {
        return !!(
          e &&
          e !== document &&
          e.nodeName !== "HTML" &&
          e.nodeName !== "BODY" &&
          "classList" in e &&
          "contains" in e.classList
        );
      }
      function E(e) {
        var N = e.type,
          v = e.tagName;
        return !!(
          (v === "INPUT" && y[N] && !e.readOnly) ||
          (v === "TEXTAREA" && !e.readOnly) ||
          e.isContentEditable
        );
      }
      function f(e) {
        e.classList.contains("focus-visible") ||
          (e.classList.add("focus-visible"),
          e.setAttribute("data-focus-visible-added", ""));
      }
      function p(e) {
        e.hasAttribute("data-focus-visible-added") &&
          (e.classList.remove("focus-visible"),
          e.removeAttribute("data-focus-visible-added"));
      }
      function L(e) {
        e.metaKey ||
          e.altKey ||
          e.ctrlKey ||
          (a(n.activeElement) && f(n.activeElement), (i = !0));
      }
      function c(e) {
        i = !1;
      }
      function g(e) {
        a(e.target) && (i || E(e.target)) && f(e.target);
      }
      function w(e) {
        a(e.target) &&
          (e.target.classList.contains("focus-visible") ||
            e.target.hasAttribute("data-focus-visible-added")) &&
          ((d = !0),
          window.clearTimeout(l),
          (l = window.setTimeout(function () {
            d = !1;
          }, 100)),
          p(e.target));
      }
      function h(e) {
        document.visibilityState === "hidden" && (d && (i = !0), m());
      }
      function m() {
        document.addEventListener("mousemove", t),
          document.addEventListener("mousedown", t),
          document.addEventListener("mouseup", t),
          document.addEventListener("pointermove", t),
          document.addEventListener("pointerdown", t),
          document.addEventListener("pointerup", t),
          document.addEventListener("touchmove", t),
          document.addEventListener("touchstart", t),
          document.addEventListener("touchend", t);
      }
      function T() {
        document.removeEventListener("mousemove", t),
          document.removeEventListener("mousedown", t),
          document.removeEventListener("mouseup", t),
          document.removeEventListener("pointermove", t),
          document.removeEventListener("pointerdown", t),
          document.removeEventListener("pointerup", t),
          document.removeEventListener("touchmove", t),
          document.removeEventListener("touchstart", t),
          document.removeEventListener("touchend", t);
      }
      function t(e) {
        (e.target.nodeName && e.target.nodeName.toLowerCase() === "html") ||
          ((i = !1), T());
      }
      document.addEventListener("keydown", L, !0),
        document.addEventListener("mousedown", c, !0),
        document.addEventListener("pointerdown", c, !0),
        document.addEventListener("touchstart", c, !0),
        document.addEventListener("visibilitychange", h, !0),
        m(),
        n.addEventListener("focus", g, !0),
        n.addEventListener("blur", w, !0),
        n.nodeType === Node.DOCUMENT_FRAGMENT_NODE && n.host
          ? n.host.setAttribute("data-js-focus-visible", "")
          : n.nodeType === Node.DOCUMENT_NODE &&
            (document.documentElement.classList.add("js-focus-visible"),
            document.documentElement.setAttribute("data-js-focus-visible", ""));
    }
    if (typeof window < "u" && typeof document < "u") {
      window.applyFocusVisiblePolyfill = r;
      var o;
      try {
        o = new CustomEvent("focus-visible-polyfill-ready");
      } catch {
        (o = document.createEvent("CustomEvent")),
          o.initCustomEvent("focus-visible-polyfill-ready", !1, !1, {});
      }
      window.dispatchEvent(o);
    }
    typeof document < "u" && r(document);
  });
})();
const V = b.exports,
  C = A({ __proto__: null, default: V }, [b.exports]);
export { C as f };

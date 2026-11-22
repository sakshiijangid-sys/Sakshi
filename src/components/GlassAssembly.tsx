import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

// @ts-nocheck
/* eslint-disable */
var re = Math.PI * 2,
  U = (e, t, r) => (e < t ? t : e > r ? r : e),
  y = (e, t, r) => e + (t - e) * r,
  Ae = (e, t) => e[0] * t[0] + e[1] * t[1] + e[2] * t[2],
  H = (e) => {
    let t = Math.hypot(e[0], e[1], e[2]) || 1;
    return [e[0] / t, e[1] / t, e[2] / t];
  },
  V = (e, t, r) => [e[0] + t[0] * r, e[1] + t[1] * r, e[2] + t[2] * r],
  qe = (e) => e - re * Math.round(e / re);

function le(e, t, r, n = 1) {
  let l = (r * Math.PI) / 180,
    o = Math.cos(l),
    s = Math.sin(l),
    a = 0,
    b = 0,
    d = 0;
  for (let x = 0; x < 10; x++) {
    let A = t * o,
      v = t * s,
      M = e + 0.3963377774 * A + 0.2158037573 * v,
      u = e - 0.1055613458 * A - 0.0638541728 * v,
      R = e - 0.0894841775 * A - 1.291485548 * v,
      C = M * M * M,
      S = u * u * u,
      i = R * R * R;
    a = 4.0767416621 * C - 3.3077115913 * S + 0.2309699292 * i;
    b = -1.2684380046 * C + 2.6097574011 * S - 0.3413193965 * i;
    d = -0.0041960863 * C - 0.7034186147 * S + 1.707614701 * i;
    let f = Math.min(a, b, d),
      m = Math.max(a, b, d);
    if (f > -0.003 && m < 1.003) break;
    t *= 0.86;
  }
  let h = (x) => {
    x = U(x, 0, 1);
    x = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
    return Math.round(x * 255);
  };
  return `rgba(${h(a)},${h(b)},${h(d)},${n})`;
}

var Ce = (e) => `rgba(255,255,255,${U(e, 0, 1).toFixed(3)})`,
  Ke = (e, t) => (((t - e) % 360) + 540) % 360 - 180;

function Vt(e, t) {
  if (e.length === 0) return 250;
  if (e.length === 1) return e[0];
  let r = U(t, 0, 1) * (e.length - 1),
    n = Math.min(e.length - 2, Math.floor(r)),
    l = r - n,
    o = e[0];
  for (let s = 0; s < n; s++) o += Ke(e[s], e[s + 1]);
  return o + Ke(e[n], e[n + 1]) * (l * l * (3 - 2 * l));
}

function ct(e, t) {
  let r = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(e.trim());
  if (!r) return t;
  let n = r[1].length === 3 ? r[1].split("").map((l) => l + l).join("") : r[1];
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
}

function ut(e, t, r) {
  let n = [],
    l = e.length;
  for (let o = 0; o < l; o++) {
    let s = e[o],
      a = e[(o - 1 + l) % l],
      b = e[(o + 1) % l],
      d = Math.hypot(a[0] - s[0], a[1] - s[1]) || 1,
      h = Math.hypot(b[0] - s[0], b[1] - s[1]) || 1,
      x = [(a[0] - s[0]) / d, (a[1] - s[1]) / d],
      A = [(b[0] - s[0]) / h, (b[1] - s[1]) / h],
      v = Math.acos(U(x[0] * A[0] + x[1] * A[1], -1, 1)),
      M = Math.min(t, ((Math.min(d, h) / 2) * Math.tan(v / 2))),
      u = M / Math.tan(v / 2),
      R = [x[0] + A[0], x[1] + A[1]],
      C = Math.hypot(R[0], R[1]) || 1,
      S = [s[0] + (R[0] / C) * (M / Math.sin(v / 2)), s[1] + (R[1] / C) * (M / Math.sin(v / 2))],
      i = [s[0] + x[0] * u, s[1] + x[1] * u],
      f = [s[0] + A[0] * u, s[1] + A[1] * u],
      m = Math.atan2(i[1] - S[1], i[0] - S[0]),
      G = Math.atan2(f[1] - S[1], f[0] - S[0]),
      I = qe(G - m);
    for (let J = 0; J <= r; J++) {
      let N = m + (I * J) / r;
      n.push([S[0] + Math.cos(N) * M, S[1] + Math.sin(N) * M]);
    }
  }
  return n;
}

function Rt(e) {
  let t = e.slice().sort((o, s) => o[0] - s[0] || o[1] - s[1]),
    r = (o, s, a) => (s[0] - o[0]) * (a[1] - o[1]) - (s[1] - o[1]) * (a[0] - o[0]),
    n = [];
  for (let o of t) {
    for (; n.length >= 2 && r(n[n.length - 2], n[n.length - 1], o) <= 0; ) n.pop();
    n.push(o);
  }
  let l = [];
  for (let o = t.length - 1; o >= 0; o--) {
    let s = t[o];
    for (; l.length >= 2 && r(l[l.length - 2], l[l.length - 1], s) <= 0; ) l.pop();
    l.push(s);
  }
  return n.pop(), l.pop(), n.concat(l);
}

function Je(e, t, r = !1) {
  r || e.beginPath(), e.moveTo(t[0][0], t[0][1]);
  for (let n = 1; n < t.length; n++) e.lineTo(t[n][0], t[n][1]);
  e.closePath();
}

function se(e, t) {
  let r = e[0] * t.cy - e[2] * t.sy,
    n = e[0] * t.sy + e[2] * t.cy,
    l = e[1] * t.cp - n * t.sp,
    o = e[1] * t.sp + n * t.cp;
  return [r, l, o + t.D];
}

function Tt(e, t) {
  let r = e[0] * t.cy - e[2] * t.sy,
    n = e[0] * t.sy + e[2] * t.cy;
  return [r, e[1] * t.cp - n * t.sp, e[1] * t.sp + n * t.cp];
}

var ie = (e, t) => [t.cx + (t.F * e[0]) / e[2], t.cz - (t.F * e[1]) / e[2]],
  pt = (e) => [-e.D * e.cp * e.sy, -e.D * e.sp, -e.D * e.cp * e.cy],
  ce = 0.25;

var Nt = {
  mono: [],
  burgundy: [342, 355, 8, 24, 345],
  aurora: [275, 248, 222, 196, 165, 138, 112],
  sunset: [340, 5, 25, 42, 58, 75],
  candy: [355, 330, 305, 280, 258, 238],
  ocean: [268, 252, 238, 222, 208, 195],
  forest: [190, 172, 155, 140, 125, 108],
  ember: [30, 42, 55, 70, 88, 105]
};

var Lt = {
  theme: "dark",
  shape: "card",
  count: 20,
  speed: 1,
  radius: 1,
  width: 0.5,
  height: 0.72,
  thickness: 0.016,
  corner: 0.08,
  hues: Nt.burgundy,
  chroma: 0.16,
  iridescence: 20,
  prism: !1,
  accent: 345,
  grid: !1,
  background: "#0D090B",
  atmosphere: !0,
  reflection: !0,
  depthOfField: !0,
  pitch: 0.2,
  distance: 3.6,
  parallax: 0.12,
  maxDpr: 2,
  autoSpin: 0.12,
  interactive: !0,
  wheel: !1,
  labels: [],
  labelSize: 0.068,
  font: '"Barlow Semi Condensed", "Geist", Inter, system-ui, sans-serif'
};

function dt(e, t, r, n, l = 8) {
  if (e === "disc") {
    let o = [];
    for (let a = 0; a < 72; a++) {
      let b = (a / 72) * re;
      o.push([(Math.cos(b) * t) / 2, (Math.sin(b) * r) / 2]);
    }
    return o;
  }
  return e === "triangle"
    ? ut([[0, r / 2], [-t / 2, -r / 2], [t / 2, -r / 2]], n, l)
    : ut([[t / 2, r / 2], [-t / 2, r / 2], [-t / 2, -r / 2], [t / 2, -r / 2]], n, 7);
}

var Wt = 5;

function ht(e, t, r, n, l, o) {
  let { cam: s, light: a } = n,
    b = [];
  for (let w of t) {
    let D = o === null ? w : [w[0], 2 * o - w[1], w[2]],
      T = se(D, s);
    if (T[2] < ce) return null;
    b.push(T);
  }
  let d = (b.length - Wt) / 2,
    h = (w) => ie(w, s),
    x = b.slice(0, d),
    A = b.slice(d, d * 2),
    v = x.reduce((w, D) => w + D[2], 0),
    M = A.reduce((w, D) => w + D[2], 0),
    u = (v <= M ? x : A).map(h),
    R = (v <= M ? A : x).map(h),
    C = Rt(u.concat(R)),
    S = b[d * 2],
    i = h(S),
    f = h(b[d * 2 + 1]),
    m = h(b[d * 2 + 2]),
    G = h(b[d * 2 + 3]),
    I = h(b[d * 2 + 4]),
    J = [(G[0] - i[0]) * 10, (G[1] - i[1]) * 10],
    N = [(I[0] - i[0]) * 10, (I[1] - i[1]) * 10],
    ue = o === null ? r : [r[0], -r[1], r[2]],
    ye = H(Tt(ue, s)),
    pe = H(S),
    Ge = Math.abs(Ae(ye, pe)),
    Ie = H([a[0] - pe[0], a[1] - pe[1], a[2] - pe[2]]),
    ze = Math.pow(Math.abs(Ae(ye, Ie)), 8) * (0.5 + 0.5 * n.sweep) + 0.35 * n.lift,
    ke = H(V(a, ye, -Ae(a, ye))),
    de = l.width * 0.6,
    Fe = h(V(S, ke, de)),
    $e = h(V(S, ke, -de)),
    Ee = S[2],
    Be = l.depthOfField ? U((Ee - s.D + 0.15) * 2.4, 0, 6) : 0,
    c = U(S[0] / (l.radius * 1.15), -1, 1),
    g = Vt(l.hues, c * 0.5 + 0.5) + n.drift + l.iridescence * (Ge - 0.5),
    P = Math.hypot(f[0] - m[0], f[1] - m[1]);
  return {
    i: e,
    depth: Ee,
    centre: i,
    front: u,
    hull: C,
    top: f,
    bot: m,
    ex: J,
    ey: N,
    specA: Fe,
    specB: $e,
    spec: ze,
    facing: Ge,
    hue: g,
    fog: Be,
    size: P,
    lift: n.lift
  };
}

function ft(e, t, r, n, l = 1, o = 1, s = 0) {
  let a = r.theme === "dark",
    b = r.hues.length === 0,
    d = b ? 0 : r.chroma * (1 + 0.15 * t.lift),
    h = (i) => y(l, o, U((i - s) / (1 - s), 0, 1)),
    x = h(0.8),
    A = b ? t.hue : t.hue + Ke(t.hue, r.hues[0]) * 0.3,
    v = n * (1 - 0.45 * (t.fog / 6)),
    M = 1 - t.facing,
    u = (i) => {
      let f = e.createLinearGradient(t.top[0], t.top[1], t.bot[0], t.bot[1]);
      for (let m = 0; m <= 4; m++) f.addColorStop(m / 4, i(m / 4));
      return f;
    },
    R = (i) => {
      let f = e.createLinearGradient(t.top[0], t.top[1], t.bot[0], t.bot[1]);
      for (let m = 0; m <= 6; m++) {
        let G = m / 6,
          I = b ? 300 - G * 300 + t.spec * 60 : t.hue + (G - 0.5) * 110;
        f.addColorStop(G, le(a ? 0.84 : 0.72, a ? 0.1 : 0.16, I, i * h(G)));
      }
      return f;
    };
  Je(e, t.hull);
  for (let i = t.front.length - 1; i >= 0; i--)
    i === t.front.length - 1 ? e.moveTo(t.front[i][0], t.front[i][1]) : e.lineTo(t.front[i][0], t.front[i][1]);
  e.closePath();
  e.globalAlpha = v;
  let C = (i, f) => (r.accent !== null && t.lift > 0 ? le(i, 0.08 * t.lift, r.accent, f) : Ce(f));
  if (
    ((e.fillStyle = r.prism
      ? R(a ? 0.9 : 0.95)
      : u(a ? (i) => C(0.9, (0.62 - 0.3 * i + 0.15 * t.lift) * h(i)) : (i) => le(y(0.8, 0.58, i), d * y(0.9, 1.2, i), y(t.hue, A, i), h(i)))),
    e.fill("evenodd"),
    Je(e, t.front),
    a)
  ) {
    e.globalCompositeOperation = "screen";
    let i = 0.06 + 0.1 * M + 0.12 * t.lift;
    (e.globalAlpha = v),
      (e.fillStyle = u((f) =>
        b ? C(0.92, (i * (1 - 0.55 * f) + 0.015) * h(f)) : le(y(0.95, 0.6, f), d * y(0.15, 0.7, f), y(t.hue, A, f), (i * (1 - 0.3 * f) + 0.03) * h(f))
      )),
      e.fill();
  } else
    (e.globalCompositeOperation = "multiply"),
      (e.globalAlpha = 0.95 * v),
      (e.fillStyle = u((i) => le(y(0.99, 0.8, i * i), d * y(0.02, 0.9, i), y(t.hue, A, i), h(i)))),
      e.fill(),
      (e.globalCompositeOperation = "source-over"),
      (e.globalAlpha = v),
      (e.fillStyle = u((i) => Ce((0.26 + 0.2 * M) * Math.max(0, 1 - i * 2.2) * h(i)))),
      e.fill();
  e.globalCompositeOperation = "screen";
  let S = e.createLinearGradient(t.specA[0], t.specA[1], t.specB[0], t.specB[1]);
  if (
    (S.addColorStop(0, Ce((a ? 0.38 : 0.5) * t.spec * x)),
    S.addColorStop(0.36, "rgba(255,255,255,0)"),
    (e.globalAlpha = v),
    (e.fillStyle = S),
    e.fill(),
    (e.globalCompositeOperation = "source-over"),
    (e.lineWidth = 1),
    (e.strokeStyle = r.prism ? R(a ? 0.85 : 0.7) : u((i) => C(0.94, (a ? 0.62 + 0.25 * t.lift : 0.75) * h(i)))),
    (e.globalAlpha = v),
    e.stroke(),
    Je(e, t.hull),
    (e.globalAlpha = (a ? 0.18 : 0.28) * v),
    (e.strokeStyle = a ? Ce(1) : u((i) => le(0.58, d * 1.1, A, h(i)))),
    e.stroke(),
    r.labels.length && n === 1 && t.lift > 0.02 && t.facing > 0.2)
  ) {
    let i = r.labels[t.i % r.labels.length];
    if (i) {
      let [f, m] = t.ex,
        G = -t.ey[0],
        I = -t.ey[1];
      f * I - m * G < 0 && ((f = -f), (m = -m)),
        e.save(),
        e.transform(f / 100, m / 100, G / 100, I / 100, t.centre[0], t.centre[1]),
        (e.font = `500 ${(r.labelSize * 100).toFixed(1)}px ${r.font}`),
        (e.textAlign = "center"),
        (e.textBaseline = "middle"),
        (e.globalAlpha = Math.pow(t.lift, 1.2) * Math.pow((t.facing - 0.2) / 0.8, 1.2) * v),
        (e.fillStyle = a ? Ce(0.94) : le(0.3, d * 0.8, A, 0.92)),
        e.fillText(i, 0, r.shape === "triangle" ? r.height * 0.1 * 100 : r.height * 0.24 * 100),
        e.restore();
    }
  }
  e.globalAlpha = 1;
}

function Gt(e, t, r, n, l, o, s, a, b) {
  let d = l.theme === "dark",
    h = ct(l.background ?? "", d ? [13, 9, 11] : [244, 244, 246]),
    x = (C) => `rgba(${h[0]},${h[1]},${h[2]},${C})`;
  if (((e.globalAlpha = 1), (e.globalCompositeOperation = "source-over"), l.background)) {
    // Rich obsidian & wine radial gradient background:
    let C = e.createRadialGradient(t * 0.5, r * 0.46, 0, t * 0.5, r * 0.5, Math.max(t, r) * 0.85);
    C.addColorStop(0, d ? "#1C1217" : "#ffffff");
    C.addColorStop(0.5, d ? "#140D11" : "#fbf9f5");
    C.addColorStop(1, l.background);
    e.fillStyle = C;
    e.fillRect(0, 0, t, r);
  } else e.clearRect(0, 0, t, r);
  let A = se([0, o, 0], n),
    [v, M] = ie(A, n);
  if (l.grid) {
    e.beginPath();
    let S = (m, G) => {
      let I = se(m, n),
        J = se(G, n);
      if (I[2] < ce || J[2] < ce) return;
      let N = ie(I, n),
        ue = ie(J, n);
      e.moveTo(N[0], N[1]), e.lineTo(ue[0], ue[1]);
    };
    for (let m = -s; m <= s + 1e-6; m += 0.35) S([m, o, -a], [m, o, a]);
    for (let m = -a; m <= a + 1e-6; m += 0.35) S([-s, o, m], [s, o, m]);
    e.lineWidth = 1;
    // Burgundy grid lines matching portfolio branding:
    e.strokeStyle = d ? "rgba(140, 45, 64, 0.16)" : "rgba(107, 29, 47, 0.08)";
    e.stroke();
    let i = Math.max(t, r) * 0.65,
      f = e.createRadialGradient(v, M, i * 0.12, v, M, i);
    f.addColorStop(0, x(0));
    f.addColorStop(1, x(1));
    e.fillStyle = f;
    e.fillRect(0, 0, t, r);
  }
  let u = Math.max(1, b);
  e.save(), e.translate(v, M), e.scale(1, 0.32);
  let R = e.createRadialGradient(0, 0, 0, 0, 0, u);
  R.addColorStop(0, d ? "rgba(192, 66, 94, 0.22)" : "rgba(140, 45, 64, 0.12)");
  R.addColorStop(0.5, d ? "rgba(107, 29, 47, 0.08)" : "rgba(140, 45, 64, 0.04)");
  R.addColorStop(1, d ? "rgba(13, 9, 11, 0)" : "rgba(253, 251, 247, 0)");
  e.fillStyle = R;
  e.fillRect(-u, -u, u * 2, u * 2);
  e.restore();
  return { fx: v, fy: M, bgc: x };
}

// 4 Specific Engineering Pointers from Sakshi's AI-Accelerated Workflow
var Yt = {
  mode: "scroll",
  sides: 4,
  size: 0.62,
  gap: 0.045,
  thickness: 0.07,
  corner: 0.035,
  steps: [
    {
      title: "Rapid AI Scaffolding",
      note: "Generating boilerplate, schema, and layout structures in minutes with AI prompt engineering.",
      tags: ["React 19", "Tailwind CSS", "TypeScript", "Vite", "Component UI", "Scaffold 90%"]
    },
    {
      title: "Prompt-to-Production Pipeline",
      note: "Iterating directly on live prototypes, bridging design and code in tight feedback loops.",
      tags: ["Live Prototype", "Rapid Loops", "HMR", "Design-to-Code", "Adaptive UI", "Feedback"]
    },
    {
      title: "Defensive Code Review",
      note: "Human auditing of all AI-generated logic, enforcing strict type safety and clean architecture.",
      tags: ["Zero Slop", "Strict Types", "Security Audit", "Clean Architecture", "Human Verified"]
    },
    {
      title: "Edge & Real-Time Ready",
      note: "Optimized for distributed edge workers, WebSocket channels, and sub-100ms cold starts.",
      tags: ["Edge Runtime", "Sub-100ms", "Zero Lag", "Optimized Assets", "Production Ready"]
    }
  ],
  wordmark: "SAKSHI",
  wordmarkSide: "center",
  invert: false,
  turns: 1.5,
  accent: 345,
  grid: true,
  reflection: true,
  background: "#0D090B",
  speed: 1,
  duration: 16,
  pitch: 0.26,
  yaw: 0.45,
  distance: 7,
  parallax: 0.1,
  maxDpr: 2,
  interactive: true,
  reducedMotion: false,
  font: '"Barlow Semi Condensed", "Geist", Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Geist Mono", monospace'
};

var Le = (e, t) => [e[1] * t[2] - e[2] * t[1], e[2] * t[0] - e[0] * t[2], e[0] * t[1] - e[1] * t[0]],
  q = (e) => (e <= 0 ? 0 : e >= 1 ? 1 : e * e * (3 - 2 * e)),
  Xt = (e) => 1 - Math.pow(1 - U(e, 0, 1), 3);

function Kt(e) {
  let t = (e * 1664525 + 1013904223) >>> 0;
  return () => {
    t = (t + 1831565813) >>> 0;
    let r = t;
    return (r = Math.imul(r ^ (r >>> 15), r | 1)), (r ^= r + Math.imul(r ^ (r >>> 7), r | 61)), ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// Text word-wrapper for canvas to prevent clipping on mobile screens
function wrapCanvasText(ctx, text, maxWidth) {
  let words = text.split(" ");
  let lines = [];
  let currentLine = words[0] || "";
  for (let i = 1; i < words.length; i++) {
    let word = words[i];
    let width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

function It(e: any, t: any = {}, r: any = {}) {
  let n = { ...Yt, ...t },
    l = e.getContext("2d");
  if (!l) throw new Error("glass assembly needs a 2d canvas context");
  let o = l,
    s = 1,
    a = 1,
    b = 1,
    d = 0,
    h = !1,
    x = -1,
    A = 0,
    v = H([-0.5, 0.8, -0.35]),
    M = { x: 0, y: 0, tx: 0, ty: 0 },
    u = { on: !1, id: -1, x: 0, lastT: 0, vel: 0 },
    R = 0,
    C = 0,
    S = 0,
    i = 0,
    f = -1,
    m = [],
    G = dt("triangle", n.size, (n.size * Math.sqrt(3)) / 2, n.corner, 4);

  function I() {
    h && !d && (d = requestAnimationFrame(Ge));
  }

  function J(c, g) {
    let P = (n.size * Math.sqrt(3)) / 2;
    return {
      ...Lt,
      theme: "dark",
      shape: "triangle",
      width: n.size,
      height: P,
      thickness: g,
      corner: n.corner,
      hues: Nt.burgundy,
      chroma: 0.16,
      prism: !1,
      accent: n.accent,
      radius: n.steps.length * (n.size / 2 + c),
      labels: [],
      depthOfField: !0
    };
  }

  function N() {
    let c = e.getBoundingClientRect();
    (s = Math.max(1, Math.round(c.width))),
      (a = Math.max(1, Math.round(c.height))),
      (b = Math.min(n.maxDpr, window.devicePixelRatio || 1, Math.sqrt((3840 * 2160) / (s * a))));
    let g = Math.round(s * b),
      P = Math.round(a * b);
    (e.width !== g || e.height !== P) && ((e.width = g), (e.height = P)), I();
  }

  function ue() {
    m = [];
    let c = n.steps.length,
      g = 0;
    for (let P = 0; P < c; P++) {
      let w = 2 * (c - P) - 1,
        D = P / Math.max(1, c - 1);
      for (let T = 0; T < n.sides; T++)
        for (let $ = 0; $ < w; $++) {
          let L = Kt(g * 7919 + 17),
            te = y(2.4, 1.1, D),
            B = y(1.5, 0.6, D),
            Me = y(0.05, 2.3, D),
            he = y(1.05, 2.85, D),
            Ve = [(L() * 2 - 1) * te, y(Me, he, L()), (L() * 2 - 1) * B],
            ne = H([L() * 2 - 1, L() * 2 - 1, L() * 2 - 1]),
            fe = H([L() * 2 - 1, L() * 2 - 1, L() * 2 - 1]),
            oe = H(Le(ne, fe));
          fe = Le(oe, ne);
          let De = n.steps[P]?.tags.length ?? 0;
          m.push({
            pos: Ve,
            es: ne,
            ev: fe,
            stagger: L(),
            tag: Math.floor(L() * Math.max(1, De)),
            drift: L() * re,
            tagged: De > 0 && (w * n.sides <= 6 || L() < 6 / (w * n.sides))
          }),
            g++;
        }
    }
  }

  ue();

  function ye(c) {
    let g = n.duration,
      P = g + 5 + 4 + 1.5,
      w = ((c % P) + P) % P;
    return w < g ? q(w / g) : w < g + 5 ? 1 : w < g + 5 + 4 ? 1 - q((w - g - 5) / 4) : 0;
  }

  function pe(c) {
    x < 0 && (x = c);
    let g = Math.min(0.1, Math.max(0.001, (c - A) / 1000));
    A = c;
    let P = ((c - x) / 1000) * n.speed,
      w = 1 - Math.exp(-g * 5);
    (M.x += (M.tx - M.x) * w), (M.y += (M.ty - M.y) * w), u.on || ((R += C * g), (C *= Math.exp(-g * 2.4)));
    let D = n.mode === "auto" ? ye(P) : S;
    i = n.reducedMotion ? D : i + (D - i) * (1 - Math.exp(-g * 7));
    let T = i,
      $ = n.steps.length,
      L = 0.65,
      te = L / $,
      B = q((T - 0.65) / 0.15),
      Me = q((T - 0.72) / 0.10),
      he = q((T - 0.78) / 0.08),
      Ve = n.invert ? q((T - 0.92) / 0.08) : 0,
      ne = T >= L ? $ : Math.min($ - 1, Math.floor(T / te)),
      fe = q(T / 0.06),
      oe = s < a,
      De = oe ? 0 : 0.9 * fe,
      Ft = oe ? 0.62 : U(s / a / 1.5, 0.6, 1);
    ne !== f && ((f = ne), r.onPhase?.(ne));
    let Qe = n.size,
      xe = (Qe * Math.sqrt(3)) / 2,
      Ze = n.gap * (1 - B),
      Oe = Math.max(0.004, n.thickness * (1 - B)),
      mt = Qe / 2 + Ze,
      bt = xe + Ze,
      Se = (2 * $ - 2) * mt + Qe,
      me = Se / (2 * Math.tan(Math.PI / n.sides)),
      gt = ($ - 1) * bt + xe,
      et = Math.sqrt(Math.max(0.01, gt * gt - me * me)),
      yt = -0.05,
      tt = T * n.turns * re + R,
      $t = -Math.PI / 2 - Math.PI / n.sides,
      Mt = y(tt, tt + qe($t - tt), B),
      xt = y(n.yaw + 0.03 * Math.sin(P * 0.1), 0, B) + M.x * n.parallax * (1 - B),
      St = y(n.pitch, 0.02, B) - M.y * n.parallax * 0.5 * (1 - B),
      je = Math.min(s, a) * (oe ? 1.05 : 0.95),
      ve = y(n.distance, n.distance * 1.05, B),
      Ue = (et * je) / (ve - me * 0.2),
      Bt = Ue * 0.86;
    o.font = `500 ${Bt.toFixed(1)}px ${n.font}`;
    let vt = n.wordmark ? o.measureText(n.wordmark).width * 0.97 : 0,
      Pt = Ue * 0.26,
      Dt = n.wordmarkSide === "center" ? Ue * (2 / Math.sqrt(3)) : Ue * (2 / Math.sqrt(3)) + (n.wordmark ? Pt + vt : 0),
      wt = Math.min(1, (s * (oe ? 0.48 : 0.38)) / Math.max(1, Dt), (a * (oe ? 0.25 : 0.28)) / Math.max(1, Ue));
    ve = y(ve, ve / wt, B);
    let Ot = oe ? 0 : s * 0.21,
      be = {
        cy: Math.cos(xt),
        sy: Math.sin(xt),
        cp: Math.cos(-St),
        sp: Math.sin(-St),
        D: ve,
        F: je,
        cx: s / 2 + Ot,
        cz: y(a * (oe ? 0.52 : 0.54), a * (oe ? 0.46 : 0.60), B)
      },
      nt = pt(be),
      He = J(Ze, Oe),
      ot = [],
      rt = [],
      st = [],
      At = [],
      Re = 0;
    for (let p = 0; p < $; p++) {
      let E = 2 * ($ - p) - 1,
        j = p * te,
        W = ne === p ? 1 : 0;
      for (let Y = 0; Y < n.sides; Y++) {
        let O = Mt + (Y * re) / n.sides + Math.PI / n.sides,
          k = [Math.cos(O), 0, Math.sin(O)],
          _ = [-Math.sin(O), 0, Math.cos(O)],
          Ne = [me * k[0], 0, me * k[2]],
          Q = H([-Ne[0], et, -Ne[2]]),
          We = H(Le(Q, _));
        for (let Pe = 0; Pe < E; Pe++) {
          let z = m[Re],
            Ye = Pe % 2 === 1,
            F = Xt((T - j - z.stagger * te * 0.55) / (te * 0.45)),
            it = (Pe - (E - 1) / 2) * mt,
            Xe = p * bt + xe / 2,
            Z = V(V(V(Ne, _, it), Q, Xe), We, Oe / 2),
            jt = [0.08 * Math.sin(P * 0.5 + z.drift), 0.06 * Math.sin(P * 0.7 + z.drift * 2), 0.08 * Math.cos(P * 0.6 + z.drift)],
            Ut = [z.pos[0] * Ft + De, z.pos[1], z.pos[2]],
            at = V(Ut, jt, 1 - F),
            X = [y(at[0], Z[0], F), y(at[1], Z[1], F) + 0.4 * Math.sin(Math.PI * F) * (1 - B), y(at[2], Z[2], F)],
            we = H([y(z.es[0], _[0], F), y(z.es[1], _[1], F), y(z.es[2], _[2], F)]),
            ee = H([y(z.ev[0], Q[0], F), y(z.ev[1], Q[1], F), y(z.ev[2], Q[2], F)]),
            K = H(Le(we, ee));
          !Number.isFinite(K[0]) || Math.hypot(K[0], K[1], K[2]) < 1e-6 ? ((we = _), (ee = Q), (K = We)) : (ee = Le(K, we));
          let Ct = Ye ? [-ee[0], -ee[1], -ee[2]] : ee,
            Te = [];
          for (let [ae, lt] of G) Te.push(V(V(V(X, we, ae), Ct, lt), K, Oe / 2));
          for (let [ae, lt] of G) Te.push(V(V(V(X, we, ae), Ct, lt), K, -Oe / 2));
          Te.push(X, V(X, ee, xe / 2), V(X, ee, -xe / 2), V(X, we, 0.1), V(X, ee, 0.1));
          let kt = {
              cam: be,
              light: v,
              drift: 0,
              lift: W * (1 - F),
              sweep: 0.5 + 0.5 * Math.cos(O - P * 0.6)
            },
            Et = ht(Re, Te, K, kt, He, null);
          if ((Et && ot.push(Et), n.reflection && B < 0.6)) {
            let ae = ht(Re, Te, K, kt, He, yt);
            ae && rt.push(ae);
          }
          let Ht = [nt[0] - X[0], nt[1] - X[1], nt[2] - X[2]],
            _t = Ae(K, Ht) < 0 && F > 0.9;
          if (
            ((st[Re] = (_t ? 0.5 : 1) * (1 - 0.85 * Me * (Y !== 0 ? 1 : 0.4)) * (F > 0.5 || ne === p ? 1 : y(1, 0.42, fe))),
            z.tagged && W > 0 && F < 0.98)
          ) {
            let ae = n.steps[p].tags[z.tag % n.steps[p].tags.length];
            At.push({
              at: V(X, [0, 1, 0], -xe * 0.5 - 0.12),
              text: ae,
              alpha: W * fe * (1 - q(F * 1.4))
            });
          }
          Re++;
        }
      }
    }
    ot.sort((p, E) => E.depth - p.depth),
      rt.sort((p, E) => E.depth - p.depth),
      o.setTransform(b, 0, 0, b, 0, 0),
      Gt(o, s, a, be, { theme: "dark", background: n.background, grid: n.grid }, yt, Se * 0.5 + 2.4, Se * 0.5 + 1.6, (Se * 0.75 * je) / (ve + 0.5)),
      B > 0 && ((o.fillStyle = `rgba(13,9,11,${B.toFixed(3)})`), o.fillRect(0, 0, s, a));
    for (let p of rt) ft(o, p, He, 0.4 * (1 - B) * st[p.i], 0, 0.5, 0.5);
    for (let p of ot) ft(o, p, He, st[p.i]);
    for (let p of At) {
      let E = se(p.at, be);
      if (E[2] < ce || p.alpha <= 0.01) continue;
      let j = ie(E, be),
        W = (0.075 * je) / E[2];
      (o.font = `500 ${Math.max(10, Math.min(13, W)).toFixed(1)}px ${n.mono}`),
        (o.textAlign = "center"),
        (o.textBaseline = "top"),
        (o.globalAlpha = p.alpha * 0.85),
        (o.fillStyle = "#E8A2B0"),
        o.fillText(p.text, j[0], j[1]);
    }
    o.globalAlpha = 1;
    let _e = Math.min(s, a);

    // Scroll reveal of the 4 engineering workflow pointers:
    for (let p = 0; p < $; p++) {
      let E = p * te,
        j = q((T - E - (p === 0 ? 0.03 : -0.02)) / 0.06),
        W = p === $ - 1 ? 1 - q((T - L + 0.02) / 0.06) : 1 - q((T - (E + te)) / 0.06),
        Y = Math.min(j, W);
      if (Y <= 0.01) continue;

      let O = oe ? Math.max(20, s * 0.07) : Math.max(32, s * 0.08),
        k = (oe ? a * 0.22 : a * 0.44) + (1 - j) * 18,
        titleSize = oe ? Math.max(22, Math.min(34, _e * 0.075)) : Math.max(26, Math.min(46, _e * 0.055)),
        noteSize = oe ? Math.max(12, Math.min(15, _e * 0.034)) : Math.max(13, Math.min(17, _e * 0.022)),
        badgeSize = Math.max(11, Math.min(13, Math.round(_e * 0.016))),
        maxTextWidth = Math.max(240, s - O * 2 - (oe ? 0 : s * 0.4));

      o.globalAlpha = Y;
      o.textAlign = "left";
      o.textBaseline = "alphabetic";

      // Phase tag
      o.fillStyle = "#C0425E";
      o.font = `600 ${badgeSize}px ${n.mono}`;
      o.fillText(`PHASE ${String(p + 1).padStart(2, "0")} / ${String($).padStart(2, "0")}`, O, k - titleSize * 1.3);

      // Main pointer title
      o.fillStyle = "#FDFBF7";
      o.font = `700 ${Math.round(titleSize)}px ${n.font}`;
      o.fillText(n.steps[p].title, O, k);

      // Pointer description (with responsive word wrap for mobile)
      o.fillStyle = "rgba(253, 251, 247, 0.74)";
      o.font = `400 ${Math.round(noteSize)}px ${n.font}`;
      let noteLines = wrapCanvasText(o, n.steps[p].note, maxTextWidth);
      let lineSpacing = noteSize * 1.45;
      noteLines.forEach((line, lineIdx) => {
        o.fillText(line, O, k + titleSize * 0.75 + lineIdx * lineSpacing);
      });
    }
    o.globalAlpha = 1;

    // Vertical Burgundy Progress Bar on right
    {
      let p = a * 0.32,
        E = s - Math.max(16, s * 0.02),
        j = a / 2 - p / 2;
      (o.fillStyle = "rgba(140, 45, 64, 0.22)"),
        o.fillRect(E - 1, j, 2, p),
        (o.fillStyle = "#C0425E"),
        o.fillRect(E - 1, j, 2, p * T);
      for (let O = 1; O < $; O++) o.fillRect(E - 4, j + p * O * te - 0.5, 8, 1);
      o.fillRect(E - 4, j + p * L - 0.5, 8, 1);
    }

    // Assembly completion & Brand presentation
    if (Me > 0) {
      let p = Mt + Math.PI / n.sides,
        E = [Math.cos(p), 0, Math.sin(p)],
        j = [-Math.sin(p), 0, Math.cos(p)],
        W = [me * E[0], 0, me * E[2]],
        O = [V(W, j, -Se / 2), V(W, j, Se / 2), [0, et, 0]].map((k) => se(k, be));
      if (O.every((k) => k[2] > ce)) {
        let k = O.map((Z) => ie(Z, be)),
          _ = k[2],
          Q = (k[0][1] + k[1][1]) / 2 - _[1],
          baseWidth = Math.abs(k[1][0] - k[0][0]),
          baseMidX = (k[0][0] + k[1][0]) / 2,
          apexX = _[0],
          apexY = _[1],
          triCenterX = (apexX + baseMidX) / 2,
          // Proportional typography scaled specifically to fit inside the smaller triangle
          z = Math.min(Q * 0.14, baseWidth * 0.11, 24),
          Xe = (Z) => {
            // Fill triangle facet
            o.beginPath();
            o.moveTo(k[0][0], k[0][1]);
            o.lineTo(k[1][0], k[1][1]);
            o.lineTo(k[2][0], k[2][1]);
            o.closePath();
            o.fillStyle = Z;
            o.fill();

            // Bevel stroke on triangle silhouette
            let isLightTri = Z === "#FDFBF7";
            o.lineWidth = Math.max(1.5, Math.min(2.5, Q * 0.012));
            o.strokeStyle = isLightTri ? "rgba(224, 122, 95, 0.65)" : "rgba(253, 251, 247, 0.75)";
            o.stroke();
          };
        (o.globalAlpha = Me), Xe("#FDFBF7"), (o.globalAlpha = 1);
        if (Ve > 0) {
          let Z = s * 1.04 * Ve;
          o.save(),
            o.beginPath(),
            o.rect(-2, -2, Z + 2, a + 4),
            o.clip(),
            (o.fillStyle = "#FDFBF7"),
            o.fillRect(0, 0, s, a),
            (o.globalAlpha = Me),
            Xe("#1C1917"),
            o.restore(),
            (o.globalAlpha = 1);
        }
      }
    }
    o.globalAlpha = 1;
  }

  function Ge(c) {
    (d = 0), pe(c);
    let g = n.mode === "scroll" && (n.reducedMotion || (S === 1 && i > 0.99999));
    h && !g && I();
  }

  function Ie(c) {
    let g = e.getBoundingClientRect();
    return [c.clientX - g.left, c.clientY - g.top];
  }

  function ze(c) {
    let [g, P] = Ie(c);
    if (((M.tx = U((g / s) * 2 - 1, -1, 1)), (M.ty = U((P / a) * 2 - 1, -1, 1)), u.on && c.pointerId === u.id)) {
      let w = g - u.x,
        D = c.timeStamp || performance.now(),
        T = Math.max(1, D - u.lastT) / 1000,
        $ = re / (1.2 * Math.min(s, a));
      (R += w * $), (u.vel = y(u.vel, (w * $) / T, 0.5)), (u.x = g), (u.lastT = D);
    }
  }

  function ke(c) {
    if (c.button !== 0 && c.pointerType === "mouse") return;
    let [g] = Ie(c);
    (u.on = !0),
      (u.id = c.pointerId),
      (u.x = g),
      (u.lastT = c.timeStamp || performance.now()),
      (u.vel = 0),
      (C = 0),
      e.setPointerCapture?.(c.pointerId),
      (e.style.cursor = "grabbing");
  }

  function de(c) {
    if (!u.on || c.pointerId !== u.id) return;
    (u.on = !1),
      e.releasePointerCapture?.(c.pointerId),
      (C = (c.timeStamp || performance.now()) - u.lastT < 80 ? U(u.vel, -6, 6) : 0),
      (e.style.cursor = "grab");
  }

  function Fe() {
    M.tx = M.ty = 0;
  }

  function $e() {
    n.interactive &&
      (e.addEventListener("pointermove", ze),
      e.addEventListener("pointerdown", ke),
      e.addEventListener("pointerup", de),
      e.addEventListener("pointercancel", de),
      e.addEventListener("pointerleave", Fe),
      (e.style.cursor = "grab"));
  }

  function Ee() {
    e.removeEventListener("pointermove", ze),
      e.removeEventListener("pointerdown", ke),
      e.removeEventListener("pointerup", de),
      e.removeEventListener("pointercancel", de),
      e.removeEventListener("pointerleave", Fe),
      (e.style.cursor = "");
  }

  let Be = typeof ResizeObserver > "u" ? null : new ResizeObserver(N);
  return (
    Be?.observe(e),
    N(),
    $e(),
    {
      render: pe,
      start() {
        (h = !0), I();
      },
      stop() {
        (h = !1), cancelAnimationFrame(d), (d = 0);
      },
      resize: N,
      set(c) {
        let g = n.interactive,
          P = c.steps !== void 0 || c.sides !== void 0;
        Object.assign(n, c),
          (c.size !== void 0 || c.corner !== void 0) && (G = dt("triangle", n.size, (n.size * Math.sqrt(3)) / 2, n.corner, 4)),
          P && ue(),
          c.maxDpr !== void 0 && N(),
          g !== n.interactive && (Ee(), $e()),
          I();
      },
      setProgress(c) {
        (S = U(c, 0, 1)), I();
      },
      progress: () => i,
      phase: () => f,
      destroy() {
        (h = !1), cancelAnimationFrame(d), (d = 0), Be?.disconnect(), Ee();
      }
    }
  );
}

export interface GlassAssemblyProps {
  className?: string;
  nextSectionId?: string;
}

export const GlassAssembly: React.FC<GlassAssemblyProps> = ({
  className = "",
  nextSectionId = "education"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const assemblyRef = useRef<any>(null);
  const hasAutoTransitionedRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  const phaseNames = [
    { title: "Scaffolding", short: "01 Scaffolding" },
    { title: "Pipeline", short: "02 Pipeline" },
    { title: "Defensive Review", short: "03 Defensive" },
    { title: "Edge Performance", short: "04 Edge" }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Load custom fonts
    Promise.all([
      (document as any).fonts?.load?.("600 16px 'Barlow Semi Condensed'"),
      (document as any).fonts?.load?.("500 16px 'JetBrains Mono'")
    ]).catch(() => {});

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Initialize 3D Glass Assembly engine
    const instance = It(
      canvas,
      {
        maxDpr: window.innerWidth < 640 ? 1.5 : 2,
        reducedMotion: prefersReducedMotion,
        speed: prefersReducedMotion ? 0 : 1,
        interactive: !prefersReducedMotion,
        background: "#0D090B",
        accent: 345,
        wordmark: "SAKSHI",
        wordmarkSide: "center",
        invert: false
      },
      {
        onPhase: (phaseIdx: number) => {
          setActivePhaseIndex(Math.min(3, Math.max(0, phaseIdx)));
        }
      }
    );

    assemblyRef.current = instance;
    instance.start();

    let rafId = 0;
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const totalScrollable = rect.height - window.innerHeight;
        if (totalScrollable <= 0) return;

        // Current scroll within pinned container
        const currentScroll = -rect.top;
        const p = Math.min(1, Math.max(0, currentScroll / totalScrollable));
        setProgress(p);

        // Active phase (0 to 3, or assembled > 0.65)
        const phase = p >= 0.65 ? 3 : Math.min(3, Math.floor(p / (0.65 / 4)));
        setActivePhaseIndex(phase);

        instance.setProgress(p);

        // When the animation completes at the end of the pinned scroll, glide seamlessly into next section
        if (p >= 0.985 && !hasAutoTransitionedRef.current) {
          hasAutoTransitionedRef.current = true;
          handleScrollToNext();
        } else if (p < 0.90) {
          hasAutoTransitionedRef.current = false;
        }
      });
    };

    const handleResize = () => {
      instance.resize();
      handleScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafId) cancelAnimationFrame(rafId);
      instance.destroy();
    };
  }, []);

  // Jump to specific workflow phase
  const handleJumpToPhase = (phaseIdx: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const currentScrollY = window.scrollY;
    const containerTopY = currentScrollY + rect.top;
    const totalScrollable = rect.height - window.innerHeight;
    const targetP = phaseIdx * (0.65 / 4) + 0.04;

    window.scrollTo({
      top: containerTopY + targetP * totalScrollable,
      behavior: "smooth"
    });
  };

  // Smooth continuation to next section once assembly is complete
  const handleScrollToNext = () => {
    if (!nextSectionId) return;
    const el = document.getElementById(nextSectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className={"relative w-full h-[440vh] " + className}
    >
      {/* Sticky Screen Viewport: Full-bleed edge-to-edge viewport with curvy top & bottom dividers */}
      <div className="sticky top-0 h-screen w-full bg-[#0D090B] overflow-hidden flex flex-col justify-between">
        {/* Canvas for 3D scattered glass pieces converging into mark */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block cursor-grab active:cursor-grabbing touch-pan-y"
          aria-label="Interactive 3D Glass Assembly revealing AI workflow pointers"
        />

        {/* Top Outer Padding Gradient Ambient Overlay */}
        <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#8C2D40]/30 via-[#6B1D2F]/15 to-transparent pointer-events-none z-10" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#6B1D2F]/25 rounded-full blur-3xl pointer-events-none z-10" />
        <div className="absolute top-0 left-1/3 w-[600px] h-[180px] bg-gradient-to-r from-[#8C2D40]/35 via-[#E07A5F]/20 to-[#6B1D2F]/30 rounded-full blur-3xl pointer-events-none z-10" />

        {/* Bottom Outer Padding Gradient Ambient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#8C2D40]/30 via-[#6B1D2F]/15 to-transparent pointer-events-none z-10" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-rose-950/30 rounded-full blur-3xl pointer-events-none z-10" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[180px] bg-gradient-to-r from-[#6B1D2F]/30 via-[#E07A5F]/20 to-[#8C2D40]/35 rounded-full blur-3xl pointer-events-none z-10" />

        {/* Top Wave Curve Divider (Curvy top styling like AI speed + human engineering section) */}
        <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none -translate-y-[1px]">
          <svg
            className="relative block w-full h-[60px] sm:h-[80px] md:h-[110px]"
            viewBox="0 0 1440 130"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="glassTopBlur" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="8" />
              </filter>
              <linearGradient id="glassTopGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8C2D40" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#E07A5F" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#6B1D2F" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="glassTopGrad2" x1="0%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8C2D40" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="glassTopGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6B1D2F" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#3D121B" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Wave Layer Glow Blur */}
            <path
              d="M0,0 L1440,0 L1440,110 C1200,20 960,130 720,70 C480,10 240,110 0,40 Z"
              fill="url(#glassTopGrad1)"
              filter="url(#glassTopBlur)"
            />
            {/* Wave Layer 1 (Accent Burgundy Gradient) */}
            <path
              d="M0,0 L1440,0 L1440,90 C1200,30 960,110 720,60 C480,10 240,90 0,30 Z"
              fill="url(#glassTopGrad1)"
            />
            {/* Wave Layer 2 (Warm Terracotta / Rose Gradient) */}
            <path
              d="M0,0 L1440,0 L1440,65 C1150,120 850,20 550,85 C280,140 120,40 0,75 Z"
              fill="url(#glassTopGrad2)"
            />
            {/* Wave Layer 3 (Deep Rose Glow Gradient) */}
            <path
              d="M0,0 L1440,0 L1440,30 C1100,80 800,10 450,60 C250,90 100,20 0,40 Z"
              fill="url(#glassTopGrad3)"
            />
            {/* Main Top Section Background Cutout (#ffffff) */}
            <path
              d="M0,0 L1440,0 L1440,45 C1100,105 750,15 400,80 C200,115 80,45 0,55 Z"
              fill="#ffffff"
            />
          </svg>
        </div>

        {/* Bottom Wave Curve Divider (Curvy bottom styling like AI speed + human engineering section) */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none translate-y-[1px]">
          <svg
            className="relative block w-full h-[60px] sm:h-[80px] md:h-[110px]"
            viewBox="0 0 1440 130"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="glassBtmBlur" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="8" />
              </filter>
              <linearGradient id="glassBtmGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8C2D40" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#E07A5F" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#6B1D2F" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="glassBtmGrad2" x1="0%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8C2D40" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="glassBtmGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6B1D2F" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#3D121B" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Wave Layer Glow Blur */}
            <path
              d="M0,130 L1440,130 L1440,20 C1200,100 960,-10 720,50 C480,110 240,10 0,70 Z"
              fill="url(#glassBtmGrad1)"
              filter="url(#glassBtmBlur)"
            />
            {/* Wave Layer 1 (Accent Burgundy Gradient) */}
            <path
              d="M0,130 L1440,130 L1440,30 C1200,90 960,10 720,60 C480,110 240,30 0,90 Z"
              fill="url(#glassBtmGrad1)"
            />
            {/* Wave Layer 2 (Warm Terracotta / Rose Gradient) */}
            <path
              d="M0,130 L1440,130 L1440,55 C1150,5 850,100 550,35 C280,-20 120,80 0,45 Z"
              fill="url(#glassBtmGrad2)"
            />
            {/* Wave Layer 3 (Deep Rose Glow Gradient) */}
            <path
              d="M0,130 L1440,130 L1440,85 C1100,40 800,110 450,50 C250,20 100,90 0,70 Z"
              fill="url(#glassBtmGrad3)"
            />
            {/* Main Bottom Section Background Cutout (#ffffff) */}
            <path
              d="M0,130 L1440,130 L1440,75 C1100,15 750,105 400,40 C200,5 80,75 0,65 Z"
              fill="#ffffff"
            />
          </svg>
        </div>

        {/* Top Header Overlays: Floating gracefully below the top wave curve */}
        <div className="relative z-30 pt-16 sm:pt-20 md:pt-24 px-4 sm:px-6 md:px-8 flex items-center justify-between sm:justify-center pointer-events-none">
          {/* Interactive Phase Indicator Tabs (Centered) */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 pointer-events-auto mx-auto backdrop-blur-md bg-stone-950/40 p-1.5 rounded-full border border-stone-800/60 shadow-lg">
            {phaseNames.map((phase, idx) => {
              const isActive = activePhaseIndex === idx && progress < 0.85;
              const isPast = progress >= (idx + 1) * (0.65 / 4);
              return (
                <button
                  key={idx}
                  onClick={() => handleJumpToPhase(idx)}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-mono transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[#8C2D40] text-white border border-[#C0425E] shadow-[0_0_15px_rgba(192,66,94,0.4)]"
                      : isPast
                      ? "bg-stone-900/80 text-stone-300 border border-stone-800 hover:border-stone-700"
                      : "bg-stone-950/60 text-stone-500 border border-stone-900 hover:border-stone-800"
                  }`}
                  title={`Jump to Phase 0${idx + 1}: ${phase.title}`}
                >
                  <span className="hidden md:inline">{phase.short}</span>
                  <span className="md:hidden">0{idx + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Interaction Guide (Subtle, desktop only on far right) */}
          <div className="hidden lg:flex items-center space-x-2 text-stone-400/70 text-xs font-mono bg-stone-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-800 absolute right-4 sm:right-6 md:right-8">
            <span>Drag to Orbit / Scroll to Assemble</span>
          </div>
        </div>

        {/* Assembled Typography: Only "FULL STACK AI ARCHITECTURE" after animation */}
        <div
          className={`absolute z-30 transition-all duration-700 ease-out pointer-events-none ${
            progress >= 0.68
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-8"
          } 
            top-[54%] sm:top-[52%] -translate-y-1/2 inset-x-0 mx-auto px-6 text-center flex flex-col items-center max-w-sm
            md:top-1/2 md:-translate-y-1/2 md:left-12 lg:left-20 xl:left-28 md:right-auto md:mx-0 md:px-0 md:text-left md:items-start md:max-w-md lg:max-w-lg
          `}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-wider text-[#FDFBF7] font-sans leading-tight uppercase drop-shadow-[0_4px_24px_rgba(224,122,95,0.3)]">
            FULL STACK <span className="text-[#E07A5F]">AI ARCHITECTURE</span>
          </h2>
        </div>

        {/* Bottom Overlays: Floating gracefully above the bottom wave curve */}
        <div className="relative z-30 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center pointer-events-none">
          {/* Scroll Hint (Early Phase only) */}
          <div
            className={
              "transition-all duration-500 flex flex-col items-center space-y-2 " +
              (progress > 0.06 ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-80 translate-y-0")
            }
          >
            <span className="text-[#FDFBF7] text-xs font-mono tracking-widest uppercase">
              Scroll down to assemble workflow ↓
            </span>
            <ChevronDown className="text-[#C0425E] animate-bounce" size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassAssembly;

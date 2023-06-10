function br(e, t) {
  const n = /* @__PURE__ */ Object.create(null), r = e.split(",");
  for (let l = 0; l < r.length; l++)
    n[r[l]] = !0;
  return t ? (l) => !!n[l.toLowerCase()] : (l) => !!n[l];
}
const Aa = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Ia = /* @__PURE__ */ br(Aa);
function zs(e) {
  return !!e || e === "";
}
function Er(e) {
  if (j(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const r = e[n], l = he(r) ? va(r) : Er(r);
      if (l)
        for (const s in l)
          t[s] = l[s];
    }
    return t;
  } else {
    if (he(e))
      return e;
    if (ae(e))
      return e;
  }
}
const Ca = /;(?![^(]*\))/g, ya = /:(.+)/;
function va(e) {
  const t = {};
  return e.split(Ca).forEach((n) => {
    if (n) {
      const r = n.split(ya);
      r.length > 1 && (t[r[0].trim()] = r[1].trim());
    }
  }), t;
}
function Tr(e) {
  let t = "";
  if (he(e))
    t = e;
  else if (j(e))
    for (let n = 0; n < e.length; n++) {
      const r = Tr(e[n]);
      r && (t += r + " ");
    }
  else if (ae(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const Na = (e) => he(e) ? e : e == null ? "" : j(e) || ae(e) && (e.toString === rl || !V(e.toString)) ? JSON.stringify(e, el, 2) : String(e), el = (e, t) => t && t.__v_isRef ? el(e, t.value) : St(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce((n, [r, l]) => (n[`${r} =>`] = l, n), {})
} : tl(t) ? {
  [`Set(${t.size})`]: [...t.values()]
} : ae(t) && !j(t) && !sl(t) ? String(t) : t, ne = {}, Mt = [], Ke = () => {
}, Oa = () => !1, Fa = /^on[^a-z]/, In = (e) => Fa.test(e), Lr = (e) => e.startsWith("onUpdate:"), Ee = Object.assign, Ar = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Ra = Object.prototype.hasOwnProperty, q = (e, t) => Ra.call(e, t), j = Array.isArray, St = (e) => Cn(e) === "[object Map]", tl = (e) => Cn(e) === "[object Set]", V = (e) => typeof e == "function", he = (e) => typeof e == "string", Ir = (e) => typeof e == "symbol", ae = (e) => e !== null && typeof e == "object", nl = (e) => ae(e) && V(e.then) && V(e.catch), rl = Object.prototype.toString, Cn = (e) => rl.call(e), ka = (e) => Cn(e).slice(8, -1), sl = (e) => Cn(e) === "[object Object]", Cr = (e) => he(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, mn = /* @__PURE__ */ br(
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), yn = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, Pa = /-(\w)/g, tt = yn((e) => e.replace(Pa, (t, n) => n ? n.toUpperCase() : "")), wa = /\B([A-Z])/g, Kt = yn((e) => e.replace(wa, "-$1").toLowerCase()), vn = yn((e) => e.charAt(0).toUpperCase() + e.slice(1)), Hn = yn((e) => e ? `on${vn(e)}` : ""), zt = (e, t) => !Object.is(e, t), Bn = (e, t) => {
  for (let n = 0; n < e.length; n++)
    e[n](t);
}, pn = (e, t, n) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    value: n
  });
}, Da = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let qr;
const Ma = () => qr || (qr = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
let Ze;
class ll {
  constructor(t = !1) {
    this.active = !0, this.effects = [], this.cleanups = [], !t && Ze && (this.parent = Ze, this.index = (Ze.scopes || (Ze.scopes = [])).push(this) - 1);
  }
  run(t) {
    if (this.active) {
      const n = Ze;
      try {
        return Ze = this, t();
      } finally {
        Ze = n;
      }
    }
  }
  on() {
    Ze = this;
  }
  off() {
    Ze = this.parent;
  }
  stop(t) {
    if (this.active) {
      let n, r;
      for (n = 0, r = this.effects.length; n < r; n++)
        this.effects[n].stop();
      for (n = 0, r = this.cleanups.length; n < r; n++)
        this.cleanups[n]();
      if (this.scopes)
        for (n = 0, r = this.scopes.length; n < r; n++)
          this.scopes[n].stop(!0);
      if (this.parent && !t) {
        const l = this.parent.scopes.pop();
        l && l !== this && (this.parent.scopes[this.index] = l, l.index = this.index);
      }
      this.active = !1;
    }
  }
}
function Sa(e) {
  return new ll(e);
}
function xa(e, t = Ze) {
  t && t.active && t.effects.push(e);
}
const yr = (e) => {
  const t = new Set(e);
  return t.w = 0, t.n = 0, t;
}, al = (e) => (e.w & ht) > 0, ol = (e) => (e.n & ht) > 0, Wa = ({ deps: e }) => {
  if (e.length)
    for (let t = 0; t < e.length; t++)
      e[t].w |= ht;
}, Ua = (e) => {
  const { deps: t } = e;
  if (t.length) {
    let n = 0;
    for (let r = 0; r < t.length; r++) {
      const l = t[r];
      al(l) && !ol(l) ? l.delete(e) : t[n++] = l, l.w &= ~ht, l.n &= ~ht;
    }
    t.length = n;
  }
}, Gn = /* @__PURE__ */ new WeakMap();
let qt = 0, ht = 1;
const Jn = 30;
let Ue;
const Ft = Symbol(""), qn = Symbol("");
class vr {
  constructor(t, n = null, r) {
    this.fn = t, this.scheduler = n, this.active = !0, this.deps = [], this.parent = void 0, xa(this, r);
  }
  run() {
    if (!this.active)
      return this.fn();
    let t = Ue, n = gt;
    for (; t; ) {
      if (t === this)
        return;
      t = t.parent;
    }
    try {
      return this.parent = Ue, Ue = this, gt = !0, ht = 1 << ++qt, qt <= Jn ? Wa(this) : Zr(this), this.fn();
    } finally {
      qt <= Jn && Ua(this), ht = 1 << --qt, Ue = this.parent, gt = n, this.parent = void 0, this.deferStop && this.stop();
    }
  }
  stop() {
    Ue === this ? this.deferStop = !0 : this.active && (Zr(this), this.onStop && this.onStop(), this.active = !1);
  }
}
function Zr(e) {
  const { deps: t } = e;
  if (t.length) {
    for (let n = 0; n < t.length; n++)
      t[n].delete(e);
    t.length = 0;
  }
}
let gt = !0;
const il = [];
function Xt() {
  il.push(gt), gt = !1;
}
function Yt() {
  const e = il.pop();
  gt = e === void 0 ? !0 : e;
}
function Fe(e, t, n) {
  if (gt && Ue) {
    let r = Gn.get(e);
    r || Gn.set(e, r = /* @__PURE__ */ new Map());
    let l = r.get(n);
    l || r.set(n, l = yr()), cl(l);
  }
}
function cl(e, t) {
  let n = !1;
  qt <= Jn ? ol(e) || (e.n |= ht, n = !al(e)) : n = !e.has(Ue), n && (e.add(Ue), Ue.deps.push(e));
}
function ct(e, t, n, r, l, s) {
  const i = Gn.get(e);
  if (!i)
    return;
  let c = [];
  if (t === "clear")
    c = [...i.values()];
  else if (n === "length" && j(e))
    i.forEach((u, d) => {
      (d === "length" || d >= r) && c.push(u);
    });
  else
    switch (n !== void 0 && c.push(i.get(n)), t) {
      case "add":
        j(e) ? Cr(n) && c.push(i.get("length")) : (c.push(i.get(Ft)), St(e) && c.push(i.get(qn)));
        break;
      case "delete":
        j(e) || (c.push(i.get(Ft)), St(e) && c.push(i.get(qn)));
        break;
      case "set":
        St(e) && c.push(i.get(Ft));
        break;
    }
  if (c.length === 1)
    c[0] && Zn(c[0]);
  else {
    const u = [];
    for (const d of c)
      d && u.push(...d);
    Zn(yr(u));
  }
}
function Zn(e, t) {
  const n = j(e) ? e : [...e];
  for (const r of n)
    r.computed && Qr(r);
  for (const r of n)
    r.computed || Qr(r);
}
function Qr(e, t) {
  (e !== Ue || e.allowRecurse) && (e.scheduler ? e.scheduler() : e.run());
}
const Ha = /* @__PURE__ */ br("__proto__,__v_isRef,__isVue"), ul = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Ir)
), Ba = /* @__PURE__ */ Nr(), ja = /* @__PURE__ */ Nr(!1, !0), Va = /* @__PURE__ */ Nr(!0), $r = /* @__PURE__ */ Ka();
function Ka() {
  const e = {};
  return ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
    e[t] = function(...n) {
      const r = $(this);
      for (let s = 0, i = this.length; s < i; s++)
        Fe(r, "get", s + "");
      const l = r[t](...n);
      return l === -1 || l === !1 ? r[t](...n.map($)) : l;
    };
  }), ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
    e[t] = function(...n) {
      Xt();
      const r = $(this)[t].apply(this, n);
      return Yt(), r;
    };
  }), e;
}
function Nr(e = !1, t = !1) {
  return function(r, l, s) {
    if (l === "__v_isReactive")
      return !e;
    if (l === "__v_isReadonly")
      return e;
    if (l === "__v_isShallow")
      return t;
    if (l === "__v_raw" && s === (e ? t ? ao : _l : t ? gl : ml).get(r))
      return r;
    const i = j(r);
    if (!e && i && q($r, l))
      return Reflect.get($r, l, s);
    const c = Reflect.get(r, l, s);
    return (Ir(l) ? ul.has(l) : Ha(l)) || (e || Fe(r, "get", l), t) ? c : _e(c) ? i && Cr(l) ? c : c.value : ae(c) ? e ? hl(c) : Rr(c) : c;
  };
}
const Xa = /* @__PURE__ */ fl(), Ya = /* @__PURE__ */ fl(!0);
function fl(e = !1) {
  return function(n, r, l, s) {
    let i = n[r];
    if (Ht(i) && _e(i) && !_e(l))
      return !1;
    if (!e && (!bn(l) && !Ht(l) && (i = $(i), l = $(l)), !j(n) && _e(i) && !_e(l)))
      return i.value = l, !0;
    const c = j(n) && Cr(r) ? Number(r) < n.length : q(n, r), u = Reflect.set(n, r, l, s);
    return n === $(s) && (c ? zt(l, i) && ct(n, "set", r, l) : ct(n, "add", r, l)), u;
  };
}
function Ga(e, t) {
  const n = q(e, t);
  e[t];
  const r = Reflect.deleteProperty(e, t);
  return r && n && ct(e, "delete", t, void 0), r;
}
function Ja(e, t) {
  const n = Reflect.has(e, t);
  return (!Ir(t) || !ul.has(t)) && Fe(e, "has", t), n;
}
function qa(e) {
  return Fe(e, "iterate", j(e) ? "length" : Ft), Reflect.ownKeys(e);
}
const dl = {
  get: Ba,
  set: Xa,
  deleteProperty: Ga,
  has: Ja,
  ownKeys: qa
}, Za = {
  get: Va,
  set(e, t) {
    return !0;
  },
  deleteProperty(e, t) {
    return !0;
  }
}, Qa = /* @__PURE__ */ Ee({}, dl, {
  get: ja,
  set: Ya
}), Or = (e) => e, Nn = (e) => Reflect.getPrototypeOf(e);
function an(e, t, n = !1, r = !1) {
  e = e.__v_raw;
  const l = $(e), s = $(t);
  n || (t !== s && Fe(l, "get", t), Fe(l, "get", s));
  const { has: i } = Nn(l), c = r ? Or : n ? Pr : en;
  if (i.call(l, t))
    return c(e.get(t));
  if (i.call(l, s))
    return c(e.get(s));
  e !== l && e.get(t);
}
function on(e, t = !1) {
  const n = this.__v_raw, r = $(n), l = $(e);
  return t || (e !== l && Fe(r, "has", e), Fe(r, "has", l)), e === l ? n.has(e) : n.has(e) || n.has(l);
}
function cn(e, t = !1) {
  return e = e.__v_raw, !t && Fe($(e), "iterate", Ft), Reflect.get(e, "size", e);
}
function zr(e) {
  e = $(e);
  const t = $(this);
  return Nn(t).has.call(t, e) || (t.add(e), ct(t, "add", e, e)), this;
}
function es(e, t) {
  t = $(t);
  const n = $(this), { has: r, get: l } = Nn(n);
  let s = r.call(n, e);
  s || (e = $(e), s = r.call(n, e));
  const i = l.call(n, e);
  return n.set(e, t), s ? zt(t, i) && ct(n, "set", e, t) : ct(n, "add", e, t), this;
}
function ts(e) {
  const t = $(this), { has: n, get: r } = Nn(t);
  let l = n.call(t, e);
  l || (e = $(e), l = n.call(t, e)), r && r.call(t, e);
  const s = t.delete(e);
  return l && ct(t, "delete", e, void 0), s;
}
function ns() {
  const e = $(this), t = e.size !== 0, n = e.clear();
  return t && ct(e, "clear", void 0, void 0), n;
}
function un(e, t) {
  return function(r, l) {
    const s = this, i = s.__v_raw, c = $(i), u = t ? Or : e ? Pr : en;
    return !e && Fe(c, "iterate", Ft), i.forEach((d, _) => r.call(l, u(d), u(_), s));
  };
}
function fn(e, t, n) {
  return function(...r) {
    const l = this.__v_raw, s = $(l), i = St(s), c = e === "entries" || e === Symbol.iterator && i, u = e === "keys" && i, d = l[e](...r), _ = n ? Or : t ? Pr : en;
    return !t && Fe(s, "iterate", u ? qn : Ft), {
      next() {
        const { value: b, done: p } = d.next();
        return p ? { value: b, done: p } : {
          value: c ? [_(b[0]), _(b[1])] : _(b),
          done: p
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function ft(e) {
  return function(...t) {
    return e === "delete" ? !1 : this;
  };
}
function $a() {
  const e = {
    get(s) {
      return an(this, s);
    },
    get size() {
      return cn(this);
    },
    has: on,
    add: zr,
    set: es,
    delete: ts,
    clear: ns,
    forEach: un(!1, !1)
  }, t = {
    get(s) {
      return an(this, s, !1, !0);
    },
    get size() {
      return cn(this);
    },
    has: on,
    add: zr,
    set: es,
    delete: ts,
    clear: ns,
    forEach: un(!1, !0)
  }, n = {
    get(s) {
      return an(this, s, !0);
    },
    get size() {
      return cn(this, !0);
    },
    has(s) {
      return on.call(this, s, !0);
    },
    add: ft("add"),
    set: ft("set"),
    delete: ft("delete"),
    clear: ft("clear"),
    forEach: un(!0, !1)
  }, r = {
    get(s) {
      return an(this, s, !0, !0);
    },
    get size() {
      return cn(this, !0);
    },
    has(s) {
      return on.call(this, s, !0);
    },
    add: ft("add"),
    set: ft("set"),
    delete: ft("delete"),
    clear: ft("clear"),
    forEach: un(!0, !0)
  };
  return ["keys", "values", "entries", Symbol.iterator].forEach((s) => {
    e[s] = fn(s, !1, !1), n[s] = fn(s, !0, !1), t[s] = fn(s, !1, !0), r[s] = fn(s, !0, !0);
  }), [
    e,
    n,
    t,
    r
  ];
}
const [za, eo, to, no] = /* @__PURE__ */ $a();
function Fr(e, t) {
  const n = t ? e ? no : to : e ? eo : za;
  return (r, l, s) => l === "__v_isReactive" ? !e : l === "__v_isReadonly" ? e : l === "__v_raw" ? r : Reflect.get(q(n, l) && l in r ? n : r, l, s);
}
const ro = {
  get: /* @__PURE__ */ Fr(!1, !1)
}, so = {
  get: /* @__PURE__ */ Fr(!1, !0)
}, lo = {
  get: /* @__PURE__ */ Fr(!0, !1)
}, ml = /* @__PURE__ */ new WeakMap(), gl = /* @__PURE__ */ new WeakMap(), _l = /* @__PURE__ */ new WeakMap(), ao = /* @__PURE__ */ new WeakMap();
function oo(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function io(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : oo(ka(e));
}
function Rr(e) {
  return Ht(e) ? e : kr(e, !1, dl, ro, ml);
}
function co(e) {
  return kr(e, !1, Qa, so, gl);
}
function hl(e) {
  return kr(e, !0, Za, lo, _l);
}
function kr(e, t, n, r, l) {
  if (!ae(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const s = l.get(e);
  if (s)
    return s;
  const i = io(e);
  if (i === 0)
    return e;
  const c = new Proxy(e, i === 2 ? r : n);
  return l.set(e, c), c;
}
function xt(e) {
  return Ht(e) ? xt(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Ht(e) {
  return !!(e && e.__v_isReadonly);
}
function bn(e) {
  return !!(e && e.__v_isShallow);
}
function pl(e) {
  return xt(e) || Ht(e);
}
function $(e) {
  const t = e && e.__v_raw;
  return t ? $(t) : e;
}
function bl(e) {
  return pn(e, "__v_skip", !0), e;
}
const en = (e) => ae(e) ? Rr(e) : e, Pr = (e) => ae(e) ? hl(e) : e;
function El(e) {
  gt && Ue && (e = $(e), cl(e.dep || (e.dep = yr())));
}
function Tl(e, t) {
  e = $(e), e.dep && Zn(e.dep);
}
function _e(e) {
  return !!(e && e.__v_isRef === !0);
}
function ze(e) {
  return Ll(e, !1);
}
function uo(e) {
  return Ll(e, !0);
}
function Ll(e, t) {
  return _e(e) ? e : new fo(e, t);
}
class fo {
  constructor(t, n) {
    this.__v_isShallow = n, this.dep = void 0, this.__v_isRef = !0, this._rawValue = n ? t : $(t), this._value = n ? t : en(t);
  }
  get value() {
    return El(this), this._value;
  }
  set value(t) {
    const n = this.__v_isShallow || bn(t) || Ht(t);
    t = n ? t : $(t), zt(t, this._rawValue) && (this._rawValue = t, this._value = n ? t : en(t), Tl(this));
  }
}
function mo(e) {
  return _e(e) ? e.value : e;
}
const go = {
  get: (e, t, n) => mo(Reflect.get(e, t, n)),
  set: (e, t, n, r) => {
    const l = e[t];
    return _e(l) && !_e(n) ? (l.value = n, !0) : Reflect.set(e, t, n, r);
  }
};
function Al(e) {
  return xt(e) ? e : new Proxy(e, go);
}
var Il;
class _o {
  constructor(t, n, r, l) {
    this._setter = n, this.dep = void 0, this.__v_isRef = !0, this[Il] = !1, this._dirty = !0, this.effect = new vr(t, () => {
      this._dirty || (this._dirty = !0, Tl(this));
    }), this.effect.computed = this, this.effect.active = this._cacheable = !l, this.__v_isReadonly = r;
  }
  get value() {
    const t = $(this);
    return El(t), (t._dirty || !t._cacheable) && (t._dirty = !1, t._value = t.effect.run()), t._value;
  }
  set value(t) {
    this._setter(t);
  }
}
Il = "__v_isReadonly";
function ho(e, t, n = !1) {
  let r, l;
  const s = V(e);
  return s ? (r = e, l = Ke) : (r = e.get, l = e.set), new _o(r, l, s || !l, n);
}
function _t(e, t, n, r) {
  let l;
  try {
    l = r ? e(...r) : e();
  } catch (s) {
    On(s, t, n);
  }
  return l;
}
function we(e, t, n, r) {
  if (V(e)) {
    const s = _t(e, t, n, r);
    return s && nl(s) && s.catch((i) => {
      On(i, t, n);
    }), s;
  }
  const l = [];
  for (let s = 0; s < e.length; s++)
    l.push(we(e[s], t, n, r));
  return l;
}
function On(e, t, n, r = !0) {
  const l = t ? t.vnode : null;
  if (t) {
    let s = t.parent;
    const i = t.proxy, c = n;
    for (; s; ) {
      const d = s.ec;
      if (d) {
        for (let _ = 0; _ < d.length; _++)
          if (d[_](e, i, c) === !1)
            return;
      }
      s = s.parent;
    }
    const u = t.appContext.config.errorHandler;
    if (u) {
      _t(u, null, 10, [e, i, c]);
      return;
    }
  }
  po(e, n, l, r);
}
function po(e, t, n, r = !0) {
  console.error(e);
}
let En = !1, Qn = !1;
const be = [];
let et = 0;
const Wt = [];
let at = null, vt = 0;
const Cl = /* @__PURE__ */ Promise.resolve();
let wr = null;
function bo(e) {
  const t = wr || Cl;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Eo(e) {
  let t = et + 1, n = be.length;
  for (; t < n; ) {
    const r = t + n >>> 1;
    tn(be[r]) < e ? t = r + 1 : n = r;
  }
  return t;
}
function Dr(e) {
  (!be.length || !be.includes(e, En && e.allowRecurse ? et + 1 : et)) && (e.id == null ? be.push(e) : be.splice(Eo(e.id), 0, e), yl());
}
function yl() {
  !En && !Qn && (Qn = !0, wr = Cl.then(Nl));
}
function To(e) {
  const t = be.indexOf(e);
  t > et && be.splice(t, 1);
}
function Lo(e) {
  j(e) ? Wt.push(...e) : (!at || !at.includes(e, e.allowRecurse ? vt + 1 : vt)) && Wt.push(e), yl();
}
function rs(e, t = et) {
  for (; t < be.length; t++) {
    const n = be[t];
    n && n.pre && (be.splice(t, 1), t--, n());
  }
}
function vl(e) {
  if (Wt.length) {
    const t = [...new Set(Wt)];
    if (Wt.length = 0, at) {
      at.push(...t);
      return;
    }
    for (at = t, at.sort((n, r) => tn(n) - tn(r)), vt = 0; vt < at.length; vt++)
      at[vt]();
    at = null, vt = 0;
  }
}
const tn = (e) => e.id == null ? 1 / 0 : e.id, Ao = (e, t) => {
  const n = tn(e) - tn(t);
  if (n === 0) {
    if (e.pre && !t.pre)
      return -1;
    if (t.pre && !e.pre)
      return 1;
  }
  return n;
};
function Nl(e) {
  Qn = !1, En = !0, be.sort(Ao);
  const t = Ke;
  try {
    for (et = 0; et < be.length; et++) {
      const n = be[et];
      n && n.active !== !1 && _t(n, null, 14);
    }
  } finally {
    et = 0, be.length = 0, vl(), En = !1, wr = null, (be.length || Wt.length) && Nl();
  }
}
function Io(e, t, ...n) {
  if (e.isUnmounted)
    return;
  const r = e.vnode.props || ne;
  let l = n;
  const s = t.startsWith("update:"), i = s && t.slice(7);
  if (i && i in r) {
    const _ = `${i === "modelValue" ? "model" : i}Modifiers`, { number: b, trim: p } = r[_] || ne;
    p && (l = n.map((C) => C.trim())), b && (l = n.map(Da));
  }
  let c, u = r[c = Hn(t)] || r[c = Hn(tt(t))];
  !u && s && (u = r[c = Hn(Kt(t))]), u && we(u, e, 6, l);
  const d = r[c + "Once"];
  if (d) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[c])
      return;
    e.emitted[c] = !0, we(d, e, 6, l);
  }
}
function Ol(e, t, n = !1) {
  const r = t.emitsCache, l = r.get(e);
  if (l !== void 0)
    return l;
  const s = e.emits;
  let i = {}, c = !1;
  if (!V(e)) {
    const u = (d) => {
      const _ = Ol(d, t, !0);
      _ && (c = !0, Ee(i, _));
    };
    !n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
  }
  return !s && !c ? (ae(e) && r.set(e, null), null) : (j(s) ? s.forEach((u) => i[u] = null) : Ee(i, s), ae(e) && r.set(e, i), i);
}
function Fn(e, t) {
  return !e || !In(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), q(e, t[0].toLowerCase() + t.slice(1)) || q(e, Kt(t)) || q(e, t));
}
let Be = null, Rn = null;
function Tn(e) {
  const t = Be;
  return Be = e, Rn = e && e.type.__scopeId || null, t;
}
function Co(e) {
  Rn = e;
}
function yo() {
  Rn = null;
}
function vo(e, t = Be, n) {
  if (!t || e._n)
    return e;
  const r = (...l) => {
    r._d && gs(-1);
    const s = Tn(t), i = e(...l);
    return Tn(s), r._d && gs(1), i;
  };
  return r._n = !0, r._c = !0, r._d = !0, r;
}
function jn(e) {
  const { type: t, vnode: n, proxy: r, withProxy: l, props: s, propsOptions: [i], slots: c, attrs: u, emit: d, render: _, renderCache: b, data: p, setupState: C, ctx: k, inheritAttrs: O } = e;
  let N, g;
  const y = Tn(e);
  try {
    if (n.shapeFlag & 4) {
      const L = l || r;
      N = Qe(_.call(L, L, b, s, C, p, k)), g = u;
    } else {
      const L = t;
      N = Qe(L.length > 1 ? L(s, { attrs: u, slots: c, emit: d }) : L(s, null)), g = t.props ? u : No(u);
    }
  } catch (L) {
    Zt.length = 0, On(L, e, 1), N = ve(it);
  }
  let F = N;
  if (g && O !== !1) {
    const L = Object.keys(g), { shapeFlag: A } = F;
    L.length && A & 7 && (i && L.some(Lr) && (g = Oo(g, i)), F = pt(F, g));
  }
  return n.dirs && (F = pt(F), F.dirs = F.dirs ? F.dirs.concat(n.dirs) : n.dirs), n.transition && (F.transition = n.transition), N = F, Tn(y), N;
}
const No = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || In(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, Oo = (e, t) => {
  const n = {};
  for (const r in e)
    (!Lr(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
  return n;
};
function Fo(e, t, n) {
  const { props: r, children: l, component: s } = e, { props: i, children: c, patchFlag: u } = t, d = s.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && u >= 0) {
    if (u & 1024)
      return !0;
    if (u & 16)
      return r ? ss(r, i, d) : !!i;
    if (u & 8) {
      const _ = t.dynamicProps;
      for (let b = 0; b < _.length; b++) {
        const p = _[b];
        if (i[p] !== r[p] && !Fn(d, p))
          return !0;
      }
    }
  } else
    return (l || c) && (!c || !c.$stable) ? !0 : r === i ? !1 : r ? i ? ss(r, i, d) : !0 : !!i;
  return !1;
}
function ss(e, t, n) {
  const r = Object.keys(t);
  if (r.length !== Object.keys(e).length)
    return !0;
  for (let l = 0; l < r.length; l++) {
    const s = r[l];
    if (t[s] !== e[s] && !Fn(n, s))
      return !0;
  }
  return !1;
}
function Ro({ vnode: e, parent: t }, n) {
  for (; t && t.subTree === e; )
    (e = t.vnode).el = n, t = t.parent;
}
const ko = (e) => e.__isSuspense;
function Po(e, t) {
  t && t.pendingBranch ? j(e) ? t.effects.push(...e) : t.effects.push(e) : Lo(e);
}
function wo(e, t) {
  if (me) {
    let n = me.provides;
    const r = me.parent && me.parent.provides;
    r === n && (n = me.provides = Object.create(r)), n[e] = t;
  }
}
function gn(e, t, n = !1) {
  const r = me || Be;
  if (r) {
    const l = r.parent == null ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides;
    if (l && e in l)
      return l[e];
    if (arguments.length > 1)
      return n && V(t) ? t.call(r.proxy) : t;
  }
}
const ls = {};
function Ut(e, t, n) {
  return Fl(e, t, n);
}
function Fl(e, t, { immediate: n, deep: r, flush: l, onTrack: s, onTrigger: i } = ne) {
  const c = me;
  let u, d = !1, _ = !1;
  if (_e(e) ? (u = () => e.value, d = bn(e)) : xt(e) ? (u = () => e, r = !0) : j(e) ? (_ = !0, d = e.some((g) => xt(g) || bn(g)), u = () => e.map((g) => {
    if (_e(g))
      return g.value;
    if (xt(g))
      return Pt(g);
    if (V(g))
      return _t(g, c, 2);
  })) : V(e) ? t ? u = () => _t(e, c, 2) : u = () => {
    if (!(c && c.isUnmounted))
      return b && b(), we(e, c, 3, [p]);
  } : u = Ke, t && r) {
    const g = u;
    u = () => Pt(g());
  }
  let b, p = (g) => {
    b = N.onStop = () => {
      _t(g, c, 4);
    };
  };
  if (rn)
    return p = Ke, t ? n && we(t, c, 3, [
      u(),
      _ ? [] : void 0,
      p
    ]) : u(), Ke;
  let C = _ ? [] : ls;
  const k = () => {
    if (!!N.active)
      if (t) {
        const g = N.run();
        (r || d || (_ ? g.some((y, F) => zt(y, C[F])) : zt(g, C))) && (b && b(), we(t, c, 3, [
          g,
          C === ls ? void 0 : C,
          p
        ]), C = g);
      } else
        N.run();
  };
  k.allowRecurse = !!t;
  let O;
  l === "sync" ? O = k : l === "post" ? O = () => ye(k, c && c.suspense) : (k.pre = !0, c && (k.id = c.uid), O = () => Dr(k));
  const N = new vr(u, O);
  return t ? n ? k() : C = N.run() : l === "post" ? ye(N.run.bind(N), c && c.suspense) : N.run(), () => {
    N.stop(), c && c.scope && Ar(c.scope.effects, N);
  };
}
function Do(e, t, n) {
  const r = this.proxy, l = he(e) ? e.includes(".") ? Rl(r, e) : () => r[e] : e.bind(r, r);
  let s;
  V(t) ? s = t : (s = t.handler, n = t);
  const i = me;
  jt(this);
  const c = Fl(l, s.bind(r), n);
  return i ? jt(i) : Rt(), c;
}
function Rl(e, t) {
  const n = t.split(".");
  return () => {
    let r = e;
    for (let l = 0; l < n.length && r; l++)
      r = r[n[l]];
    return r;
  };
}
function Pt(e, t) {
  if (!ae(e) || e.__v_skip || (t = t || /* @__PURE__ */ new Set(), t.has(e)))
    return e;
  if (t.add(e), _e(e))
    Pt(e.value, t);
  else if (j(e))
    for (let n = 0; n < e.length; n++)
      Pt(e[n], t);
  else if (tl(e) || St(e))
    e.forEach((n) => {
      Pt(n, t);
    });
  else if (sl(e))
    for (const n in e)
      Pt(e[n], t);
  return e;
}
function Mo() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return wn(() => {
    e.isMounted = !0;
  }), Ml(() => {
    e.isUnmounting = !0;
  }), e;
}
const Pe = [Function, Array], So = {
  name: "BaseTransition",
  props: {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: Pe,
    onEnter: Pe,
    onAfterEnter: Pe,
    onEnterCancelled: Pe,
    onBeforeLeave: Pe,
    onLeave: Pe,
    onAfterLeave: Pe,
    onLeaveCancelled: Pe,
    onBeforeAppear: Pe,
    onAppear: Pe,
    onAfterAppear: Pe,
    onAppearCancelled: Pe
  },
  setup(e, { slots: t }) {
    const n = Bt(), r = Mo();
    let l;
    return () => {
      const s = t.default && Pl(t.default(), !0);
      if (!s || !s.length)
        return;
      let i = s[0];
      if (s.length > 1) {
        for (const O of s)
          if (O.type !== it) {
            i = O;
            break;
          }
      }
      const c = $(e), { mode: u } = c;
      if (r.isLeaving)
        return Vn(i);
      const d = as(i);
      if (!d)
        return Vn(i);
      const _ = $n(d, c, r, n);
      zn(d, _);
      const b = n.subTree, p = b && as(b);
      let C = !1;
      const { getTransitionKey: k } = d.type;
      if (k) {
        const O = k();
        l === void 0 ? l = O : O !== l && (l = O, C = !0);
      }
      if (p && p.type !== it && (!Nt(d, p) || C)) {
        const O = $n(p, c, r, n);
        if (zn(p, O), u === "out-in")
          return r.isLeaving = !0, O.afterLeave = () => {
            r.isLeaving = !1, n.update();
          }, Vn(i);
        u === "in-out" && d.type !== it && (O.delayLeave = (N, g, y) => {
          const F = kl(r, p);
          F[String(p.key)] = p, N._leaveCb = () => {
            g(), N._leaveCb = void 0, delete _.delayedLeave;
          }, _.delayedLeave = y;
        });
      }
      return i;
    };
  }
}, xo = So;
function kl(e, t) {
  const { leavingVNodes: n } = e;
  let r = n.get(t.type);
  return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function $n(e, t, n, r) {
  const { appear: l, mode: s, persisted: i = !1, onBeforeEnter: c, onEnter: u, onAfterEnter: d, onEnterCancelled: _, onBeforeLeave: b, onLeave: p, onAfterLeave: C, onLeaveCancelled: k, onBeforeAppear: O, onAppear: N, onAfterAppear: g, onAppearCancelled: y } = t, F = String(e.key), L = kl(n, e), A = (W, U) => {
    W && we(W, r, 9, U);
  }, D = (W, U) => {
    const X = U[1];
    A(W, U), j(W) ? W.every((z) => z.length <= 1) && X() : W.length <= 1 && X();
  }, x = {
    mode: s,
    persisted: i,
    beforeEnter(W) {
      let U = c;
      if (!n.isMounted)
        if (l)
          U = O || c;
        else
          return;
      W._leaveCb && W._leaveCb(!0);
      const X = L[F];
      X && Nt(e, X) && X.el._leaveCb && X.el._leaveCb(), A(U, [W]);
    },
    enter(W) {
      let U = u, X = d, z = _;
      if (!n.isMounted)
        if (l)
          U = N || u, X = g || d, z = y || _;
        else
          return;
      let oe = !1;
      const ie = W._enterCb = (De) => {
        oe || (oe = !0, De ? A(z, [W]) : A(X, [W]), x.delayedLeave && x.delayedLeave(), W._enterCb = void 0);
      };
      U ? D(U, [W, ie]) : ie();
    },
    leave(W, U) {
      const X = String(e.key);
      if (W._enterCb && W._enterCb(!0), n.isUnmounting)
        return U();
      A(b, [W]);
      let z = !1;
      const oe = W._leaveCb = (ie) => {
        z || (z = !0, U(), ie ? A(k, [W]) : A(C, [W]), W._leaveCb = void 0, L[X] === e && delete L[X]);
      };
      L[X] = e, p ? D(p, [W, oe]) : oe();
    },
    clone(W) {
      return $n(W, t, n, r);
    }
  };
  return x;
}
function Vn(e) {
  if (kn(e))
    return e = pt(e), e.children = null, e;
}
function as(e) {
  return kn(e) ? e.children ? e.children[0] : void 0 : e;
}
function zn(e, t) {
  e.shapeFlag & 6 && e.component ? zn(e.component.subTree, t) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function Pl(e, t = !1, n) {
  let r = [], l = 0;
  for (let s = 0; s < e.length; s++) {
    let i = e[s];
    const c = n == null ? i.key : String(n) + String(i.key != null ? i.key : s);
    i.type === We ? (i.patchFlag & 128 && l++, r = r.concat(Pl(i.children, t, c))) : (t || i.type !== it) && r.push(c != null ? pt(i, { key: c }) : i);
  }
  if (l > 1)
    for (let s = 0; s < r.length; s++)
      r[s].patchFlag = -2;
  return r;
}
function Wo(e) {
  return V(e) ? { setup: e, name: e.name } : e;
}
const _n = (e) => !!e.type.__asyncLoader, kn = (e) => e.type.__isKeepAlive;
function Uo(e, t) {
  wl(e, "a", t);
}
function Ho(e, t) {
  wl(e, "da", t);
}
function wl(e, t, n = me) {
  const r = e.__wdc || (e.__wdc = () => {
    let l = n;
    for (; l; ) {
      if (l.isDeactivated)
        return;
      l = l.parent;
    }
    return e();
  });
  if (Pn(t, r, n), n) {
    let l = n.parent;
    for (; l && l.parent; )
      kn(l.parent.vnode) && Bo(r, t, n, l), l = l.parent;
  }
}
function Bo(e, t, n, r) {
  const l = Pn(t, e, r, !0);
  Mr(() => {
    Ar(r[t], l);
  }, n);
}
function Pn(e, t, n = me, r = !1) {
  if (n) {
    const l = n[e] || (n[e] = []), s = t.__weh || (t.__weh = (...i) => {
      if (n.isUnmounted)
        return;
      Xt(), jt(n);
      const c = we(t, n, e, i);
      return Rt(), Yt(), c;
    });
    return r ? l.unshift(s) : l.push(s), s;
  }
}
const ut = (e) => (t, n = me) => (!rn || e === "sp") && Pn(e, t, n), Dl = ut("bm"), wn = ut("m"), jo = ut("bu"), Vo = ut("u"), Ml = ut("bum"), Mr = ut("um"), Ko = ut("sp"), Xo = ut("rtg"), Yo = ut("rtc");
function Go(e, t = me) {
  Pn("ec", e, t);
}
function It(e, t, n, r) {
  const l = e.dirs, s = t && t.dirs;
  for (let i = 0; i < l.length; i++) {
    const c = l[i];
    s && (c.oldValue = s[i].value);
    let u = c.dir[r];
    u && (Xt(), we(u, n, 8, [
      e.el,
      c,
      e,
      t
    ]), Yt());
  }
}
const Sl = "components";
function Jo(e, t) {
  return Zo(Sl, e, !0, t) || e;
}
const qo = Symbol();
function Zo(e, t, n = !0, r = !1) {
  const l = Be || me;
  if (l) {
    const s = l.type;
    if (e === Sl) {
      const c = vi(s, !1);
      if (c && (c === t || c === tt(t) || c === vn(tt(t))))
        return s;
    }
    const i = os(l[e] || s[e], t) || os(l.appContext[e], t);
    return !i && r ? s : i;
  }
}
function os(e, t) {
  return e && (e[t] || e[tt(t)] || e[vn(tt(t))]);
}
const er = (e) => e ? Zl(e) ? Wr(e) || e.proxy : er(e.parent) : null, Ln = /* @__PURE__ */ Ee(/* @__PURE__ */ Object.create(null), {
  $: (e) => e,
  $el: (e) => e.vnode.el,
  $data: (e) => e.data,
  $props: (e) => e.props,
  $attrs: (e) => e.attrs,
  $slots: (e) => e.slots,
  $refs: (e) => e.refs,
  $parent: (e) => er(e.parent),
  $root: (e) => er(e.root),
  $emit: (e) => e.emit,
  $options: (e) => Wl(e),
  $forceUpdate: (e) => e.f || (e.f = () => Dr(e.update)),
  $nextTick: (e) => e.n || (e.n = bo.bind(e.proxy)),
  $watch: (e) => Do.bind(e)
}), Qo = {
  get({ _: e }, t) {
    const { ctx: n, setupState: r, data: l, props: s, accessCache: i, type: c, appContext: u } = e;
    let d;
    if (t[0] !== "$") {
      const C = i[t];
      if (C !== void 0)
        switch (C) {
          case 1:
            return r[t];
          case 2:
            return l[t];
          case 4:
            return n[t];
          case 3:
            return s[t];
        }
      else {
        if (r !== ne && q(r, t))
          return i[t] = 1, r[t];
        if (l !== ne && q(l, t))
          return i[t] = 2, l[t];
        if ((d = e.propsOptions[0]) && q(d, t))
          return i[t] = 3, s[t];
        if (n !== ne && q(n, t))
          return i[t] = 4, n[t];
        tr && (i[t] = 0);
      }
    }
    const _ = Ln[t];
    let b, p;
    if (_)
      return t === "$attrs" && Fe(e, "get", t), _(e);
    if ((b = c.__cssModules) && (b = b[t]))
      return b;
    if (n !== ne && q(n, t))
      return i[t] = 4, n[t];
    if (p = u.config.globalProperties, q(p, t))
      return p[t];
  },
  set({ _: e }, t, n) {
    const { data: r, setupState: l, ctx: s } = e;
    return l !== ne && q(l, t) ? (l[t] = n, !0) : r !== ne && q(r, t) ? (r[t] = n, !0) : q(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (s[t] = n, !0);
  },
  has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: l, propsOptions: s } }, i) {
    let c;
    return !!n[i] || e !== ne && q(e, i) || t !== ne && q(t, i) || (c = s[0]) && q(c, i) || q(r, i) || q(Ln, i) || q(l.config.globalProperties, i);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : q(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
let tr = !0;
function $o(e) {
  const t = Wl(e), n = e.proxy, r = e.ctx;
  tr = !1, t.beforeCreate && is(t.beforeCreate, e, "bc");
  const {
    data: l,
    computed: s,
    methods: i,
    watch: c,
    provide: u,
    inject: d,
    created: _,
    beforeMount: b,
    mounted: p,
    beforeUpdate: C,
    updated: k,
    activated: O,
    deactivated: N,
    beforeDestroy: g,
    beforeUnmount: y,
    destroyed: F,
    unmounted: L,
    render: A,
    renderTracked: D,
    renderTriggered: x,
    errorCaptured: W,
    serverPrefetch: U,
    expose: X,
    inheritAttrs: z,
    components: oe,
    directives: ie,
    filters: De
  } = t;
  if (d && zo(d, r, null, e.appContext.config.unwrapInjectedRef), i)
    for (const G in i) {
      const Z = i[G];
      V(Z) && (r[G] = Z.bind(n));
    }
  if (l) {
    const G = l.call(n, n);
    ae(G) && (e.data = Rr(G));
  }
  if (tr = !0, s)
    for (const G in s) {
      const Z = s[G], pe = V(Z) ? Z.bind(n, n) : V(Z.get) ? Z.get.bind(n, n) : Ke, rt = !V(Z) && V(Z.set) ? Z.set.bind(n) : Ke, Me = He({
        get: pe,
        set: rt
      });
      Object.defineProperty(r, G, {
        enumerable: !0,
        configurable: !0,
        get: () => Me.value,
        set: (Re) => Me.value = Re
      });
    }
  if (c)
    for (const G in c)
      xl(c[G], r, n, G);
  if (u) {
    const G = V(u) ? u.call(n) : u;
    Reflect.ownKeys(G).forEach((Z) => {
      wo(Z, G[Z]);
    });
  }
  _ && is(_, e, "c");
  function le(G, Z) {
    j(Z) ? Z.forEach((pe) => G(pe.bind(n))) : Z && G(Z.bind(n));
  }
  if (le(Dl, b), le(wn, p), le(jo, C), le(Vo, k), le(Uo, O), le(Ho, N), le(Go, W), le(Yo, D), le(Xo, x), le(Ml, y), le(Mr, L), le(Ko, U), j(X))
    if (X.length) {
      const G = e.exposed || (e.exposed = {});
      X.forEach((Z) => {
        Object.defineProperty(G, Z, {
          get: () => n[Z],
          set: (pe) => n[Z] = pe
        });
      });
    } else
      e.exposed || (e.exposed = {});
  A && e.render === Ke && (e.render = A), z != null && (e.inheritAttrs = z), oe && (e.components = oe), ie && (e.directives = ie);
}
function zo(e, t, n = Ke, r = !1) {
  j(e) && (e = nr(e));
  for (const l in e) {
    const s = e[l];
    let i;
    ae(s) ? "default" in s ? i = gn(s.from || l, s.default, !0) : i = gn(s.from || l) : i = gn(s), _e(i) && r ? Object.defineProperty(t, l, {
      enumerable: !0,
      configurable: !0,
      get: () => i.value,
      set: (c) => i.value = c
    }) : t[l] = i;
  }
}
function is(e, t, n) {
  we(j(e) ? e.map((r) => r.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function xl(e, t, n, r) {
  const l = r.includes(".") ? Rl(n, r) : () => n[r];
  if (he(e)) {
    const s = t[e];
    V(s) && Ut(l, s);
  } else if (V(e))
    Ut(l, e.bind(n));
  else if (ae(e))
    if (j(e))
      e.forEach((s) => xl(s, t, n, r));
    else {
      const s = V(e.handler) ? e.handler.bind(n) : t[e.handler];
      V(s) && Ut(l, s, e);
    }
}
function Wl(e) {
  const t = e.type, { mixins: n, extends: r } = t, { mixins: l, optionsCache: s, config: { optionMergeStrategies: i } } = e.appContext, c = s.get(t);
  let u;
  return c ? u = c : !l.length && !n && !r ? u = t : (u = {}, l.length && l.forEach((d) => An(u, d, i, !0)), An(u, t, i)), ae(t) && s.set(t, u), u;
}
function An(e, t, n, r = !1) {
  const { mixins: l, extends: s } = t;
  s && An(e, s, n, !0), l && l.forEach((i) => An(e, i, n, !0));
  for (const i in t)
    if (!(r && i === "expose")) {
      const c = ei[i] || n && n[i];
      e[i] = c ? c(e[i], t[i]) : t[i];
    }
  return e;
}
const ei = {
  data: cs,
  props: yt,
  emits: yt,
  methods: yt,
  computed: yt,
  beforeCreate: Ae,
  created: Ae,
  beforeMount: Ae,
  mounted: Ae,
  beforeUpdate: Ae,
  updated: Ae,
  beforeDestroy: Ae,
  beforeUnmount: Ae,
  destroyed: Ae,
  unmounted: Ae,
  activated: Ae,
  deactivated: Ae,
  errorCaptured: Ae,
  serverPrefetch: Ae,
  components: yt,
  directives: yt,
  watch: ni,
  provide: cs,
  inject: ti
};
function cs(e, t) {
  return t ? e ? function() {
    return Ee(V(e) ? e.call(this, this) : e, V(t) ? t.call(this, this) : t);
  } : t : e;
}
function ti(e, t) {
  return yt(nr(e), nr(t));
}
function nr(e) {
  if (j(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function Ae(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function yt(e, t) {
  return e ? Ee(Ee(/* @__PURE__ */ Object.create(null), e), t) : t;
}
function ni(e, t) {
  if (!e)
    return t;
  if (!t)
    return e;
  const n = Ee(/* @__PURE__ */ Object.create(null), e);
  for (const r in t)
    n[r] = Ae(e[r], t[r]);
  return n;
}
function ri(e, t, n, r = !1) {
  const l = {}, s = {};
  pn(s, Mn, 1), e.propsDefaults = /* @__PURE__ */ Object.create(null), Ul(e, t, l, s);
  for (const i in e.propsOptions[0])
    i in l || (l[i] = void 0);
  n ? e.props = r ? l : co(l) : e.type.props ? e.props = l : e.props = s, e.attrs = s;
}
function si(e, t, n, r) {
  const { props: l, attrs: s, vnode: { patchFlag: i } } = e, c = $(l), [u] = e.propsOptions;
  let d = !1;
  if ((r || i > 0) && !(i & 16)) {
    if (i & 8) {
      const _ = e.vnode.dynamicProps;
      for (let b = 0; b < _.length; b++) {
        let p = _[b];
        if (Fn(e.emitsOptions, p))
          continue;
        const C = t[p];
        if (u)
          if (q(s, p))
            C !== s[p] && (s[p] = C, d = !0);
          else {
            const k = tt(p);
            l[k] = rr(u, c, k, C, e, !1);
          }
        else
          C !== s[p] && (s[p] = C, d = !0);
      }
    }
  } else {
    Ul(e, t, l, s) && (d = !0);
    let _;
    for (const b in c)
      (!t || !q(t, b) && ((_ = Kt(b)) === b || !q(t, _))) && (u ? n && (n[b] !== void 0 || n[_] !== void 0) && (l[b] = rr(u, c, b, void 0, e, !0)) : delete l[b]);
    if (s !== c)
      for (const b in s)
        (!t || !q(t, b) && !0) && (delete s[b], d = !0);
  }
  d && ct(e, "set", "$attrs");
}
function Ul(e, t, n, r) {
  const [l, s] = e.propsOptions;
  let i = !1, c;
  if (t)
    for (let u in t) {
      if (mn(u))
        continue;
      const d = t[u];
      let _;
      l && q(l, _ = tt(u)) ? !s || !s.includes(_) ? n[_] = d : (c || (c = {}))[_] = d : Fn(e.emitsOptions, u) || (!(u in r) || d !== r[u]) && (r[u] = d, i = !0);
    }
  if (s) {
    const u = $(n), d = c || ne;
    for (let _ = 0; _ < s.length; _++) {
      const b = s[_];
      n[b] = rr(l, u, b, d[b], e, !q(d, b));
    }
  }
  return i;
}
function rr(e, t, n, r, l, s) {
  const i = e[n];
  if (i != null) {
    const c = q(i, "default");
    if (c && r === void 0) {
      const u = i.default;
      if (i.type !== Function && V(u)) {
        const { propsDefaults: d } = l;
        n in d ? r = d[n] : (jt(l), r = d[n] = u.call(null, t), Rt());
      } else
        r = u;
    }
    i[0] && (s && !c ? r = !1 : i[1] && (r === "" || r === Kt(n)) && (r = !0));
  }
  return r;
}
function Hl(e, t, n = !1) {
  const r = t.propsCache, l = r.get(e);
  if (l)
    return l;
  const s = e.props, i = {}, c = [];
  let u = !1;
  if (!V(e)) {
    const _ = (b) => {
      u = !0;
      const [p, C] = Hl(b, t, !0);
      Ee(i, p), C && c.push(...C);
    };
    !n && t.mixins.length && t.mixins.forEach(_), e.extends && _(e.extends), e.mixins && e.mixins.forEach(_);
  }
  if (!s && !u)
    return ae(e) && r.set(e, Mt), Mt;
  if (j(s))
    for (let _ = 0; _ < s.length; _++) {
      const b = tt(s[_]);
      us(b) && (i[b] = ne);
    }
  else if (s)
    for (const _ in s) {
      const b = tt(_);
      if (us(b)) {
        const p = s[_], C = i[b] = j(p) || V(p) ? { type: p } : p;
        if (C) {
          const k = ms(Boolean, C.type), O = ms(String, C.type);
          C[0] = k > -1, C[1] = O < 0 || k < O, (k > -1 || q(C, "default")) && c.push(b);
        }
      }
    }
  const d = [i, c];
  return ae(e) && r.set(e, d), d;
}
function us(e) {
  return e[0] !== "$";
}
function fs(e) {
  const t = e && e.toString().match(/^\s*function (\w+)/);
  return t ? t[1] : e === null ? "null" : "";
}
function ds(e, t) {
  return fs(e) === fs(t);
}
function ms(e, t) {
  return j(t) ? t.findIndex((n) => ds(n, e)) : V(t) && ds(t, e) ? 0 : -1;
}
const Bl = (e) => e[0] === "_" || e === "$stable", Sr = (e) => j(e) ? e.map(Qe) : [Qe(e)], li = (e, t, n) => {
  if (t._n)
    return t;
  const r = vo((...l) => Sr(t(...l)), n);
  return r._c = !1, r;
}, jl = (e, t, n) => {
  const r = e._ctx;
  for (const l in e) {
    if (Bl(l))
      continue;
    const s = e[l];
    if (V(s))
      t[l] = li(l, s, r);
    else if (s != null) {
      const i = Sr(s);
      t[l] = () => i;
    }
  }
}, Vl = (e, t) => {
  const n = Sr(t);
  e.slots.default = () => n;
}, ai = (e, t) => {
  if (e.vnode.shapeFlag & 32) {
    const n = t._;
    n ? (e.slots = $(t), pn(t, "_", n)) : jl(t, e.slots = {});
  } else
    e.slots = {}, t && Vl(e, t);
  pn(e.slots, Mn, 1);
}, oi = (e, t, n) => {
  const { vnode: r, slots: l } = e;
  let s = !0, i = ne;
  if (r.shapeFlag & 32) {
    const c = t._;
    c ? n && c === 1 ? s = !1 : (Ee(l, t), !n && c === 1 && delete l._) : (s = !t.$stable, jl(t, l)), i = t;
  } else
    t && (Vl(e, t), i = { default: 1 });
  if (s)
    for (const c in l)
      !Bl(c) && !(c in i) && delete l[c];
};
function Kl() {
  return {
    app: null,
    config: {
      isNativeTag: Oa,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let ii = 0;
function ci(e, t) {
  return function(r, l = null) {
    V(r) || (r = Object.assign({}, r)), l != null && !ae(l) && (l = null);
    const s = Kl(), i = /* @__PURE__ */ new Set();
    let c = !1;
    const u = s.app = {
      _uid: ii++,
      _component: r,
      _props: l,
      _container: null,
      _context: s,
      _instance: null,
      version: Oi,
      get config() {
        return s.config;
      },
      set config(d) {
      },
      use(d, ..._) {
        return i.has(d) || (d && V(d.install) ? (i.add(d), d.install(u, ..._)) : V(d) && (i.add(d), d(u, ..._))), u;
      },
      mixin(d) {
        return s.mixins.includes(d) || s.mixins.push(d), u;
      },
      component(d, _) {
        return _ ? (s.components[d] = _, u) : s.components[d];
      },
      directive(d, _) {
        return _ ? (s.directives[d] = _, u) : s.directives[d];
      },
      mount(d, _, b) {
        if (!c) {
          const p = ve(r, l);
          return p.appContext = s, _ && t ? t(p, d) : e(p, d, b), c = !0, u._container = d, d.__vue_app__ = u, Wr(p.component) || p.component.proxy;
        }
      },
      unmount() {
        c && (e(null, u._container), delete u._container.__vue_app__);
      },
      provide(d, _) {
        return s.provides[d] = _, u;
      }
    };
    return u;
  };
}
function sr(e, t, n, r, l = !1) {
  if (j(e)) {
    e.forEach((p, C) => sr(p, t && (j(t) ? t[C] : t), n, r, l));
    return;
  }
  if (_n(r) && !l)
    return;
  const s = r.shapeFlag & 4 ? Wr(r.component) || r.component.proxy : r.el, i = l ? null : s, { i: c, r: u } = e, d = t && t.r, _ = c.refs === ne ? c.refs = {} : c.refs, b = c.setupState;
  if (d != null && d !== u && (he(d) ? (_[d] = null, q(b, d) && (b[d] = null)) : _e(d) && (d.value = null)), V(u))
    _t(u, c, 12, [i, _]);
  else {
    const p = he(u), C = _e(u);
    if (p || C) {
      const k = () => {
        if (e.f) {
          const O = p ? _[u] : u.value;
          l ? j(O) && Ar(O, s) : j(O) ? O.includes(s) || O.push(s) : p ? (_[u] = [s], q(b, u) && (b[u] = _[u])) : (u.value = [s], e.k && (_[e.k] = u.value));
        } else
          p ? (_[u] = i, q(b, u) && (b[u] = i)) : C && (u.value = i, e.k && (_[e.k] = i));
      };
      i ? (k.id = -1, ye(k, n)) : k();
    }
  }
}
const ye = Po;
function ui(e) {
  return fi(e);
}
function fi(e, t) {
  const n = Ma();
  n.__VUE__ = !0;
  const { insert: r, remove: l, patchProp: s, createElement: i, createText: c, createComment: u, setText: d, setElementText: _, parentNode: b, nextSibling: p, setScopeId: C = Ke, cloneNode: k, insertStaticContent: O } = e, N = (o, a, f, h = null, E = null, I = null, P = !1, R = null, v = !!a.dynamicChildren) => {
    if (o === a)
      return;
    o && !Nt(o, a) && (h = ke(o), Ne(o, E, I, !0), o = null), a.patchFlag === -2 && (v = !1, a.dynamicChildren = null);
    const { type: m, ref: T, shapeFlag: M } = a;
    switch (m) {
      case Dn:
        g(o, a, f, h);
        break;
      case it:
        y(o, a, f, h);
        break;
      case Kn:
        o == null && F(a, f, h, P);
        break;
      case We:
        ie(o, a, f, h, E, I, P, R, v);
        break;
      default:
        M & 1 ? D(o, a, f, h, E, I, P, R, v) : M & 6 ? De(o, a, f, h, E, I, P, R, v) : (M & 64 || M & 128) && m.process(o, a, f, h, E, I, P, R, v, Le);
    }
    T != null && E && sr(T, o && o.ref, I, a || o, !a);
  }, g = (o, a, f, h) => {
    if (o == null)
      r(a.el = c(a.children), f, h);
    else {
      const E = a.el = o.el;
      a.children !== o.children && d(E, a.children);
    }
  }, y = (o, a, f, h) => {
    o == null ? r(a.el = u(a.children || ""), f, h) : a.el = o.el;
  }, F = (o, a, f, h) => {
    [o.el, o.anchor] = O(o.children, a, f, h, o.el, o.anchor);
  }, L = ({ el: o, anchor: a }, f, h) => {
    let E;
    for (; o && o !== a; )
      E = p(o), r(o, f, h), o = E;
    r(a, f, h);
  }, A = ({ el: o, anchor: a }) => {
    let f;
    for (; o && o !== a; )
      f = p(o), l(o), o = f;
    l(a);
  }, D = (o, a, f, h, E, I, P, R, v) => {
    P = P || a.type === "svg", o == null ? x(a, f, h, E, I, P, R, v) : X(o, a, E, I, P, R, v);
  }, x = (o, a, f, h, E, I, P, R) => {
    let v, m;
    const { type: T, props: M, shapeFlag: S, transition: H, patchFlag: K, dirs: J } = o;
    if (o.el && k !== void 0 && K === -1)
      v = o.el = k(o.el);
    else {
      if (v = o.el = i(o.type, I, M && M.is, M), S & 8 ? _(v, o.children) : S & 16 && U(o.children, v, null, h, E, I && T !== "foreignObject", P, R), J && It(o, null, h, "created"), M) {
        for (const te in M)
          te !== "value" && !mn(te) && s(v, te, null, M[te], I, o.children, h, E, Te);
        "value" in M && s(v, "value", null, M.value), (m = M.onVnodeBeforeMount) && Je(m, h, o);
      }
      W(v, o, o.scopeId, P, h);
    }
    J && It(o, null, h, "beforeMount");
    const ee = (!E || E && !E.pendingBranch) && H && !H.persisted;
    ee && H.beforeEnter(v), r(v, a, f), ((m = M && M.onVnodeMounted) || ee || J) && ye(() => {
      m && Je(m, h, o), ee && H.enter(v), J && It(o, null, h, "mounted");
    }, E);
  }, W = (o, a, f, h, E) => {
    if (f && C(o, f), h)
      for (let I = 0; I < h.length; I++)
        C(o, h[I]);
    if (E) {
      let I = E.subTree;
      if (a === I) {
        const P = E.vnode;
        W(o, P, P.scopeId, P.slotScopeIds, E.parent);
      }
    }
  }, U = (o, a, f, h, E, I, P, R, v = 0) => {
    for (let m = v; m < o.length; m++) {
      const T = o[m] = R ? mt(o[m]) : Qe(o[m]);
      N(null, T, a, f, h, E, I, P, R);
    }
  }, X = (o, a, f, h, E, I, P) => {
    const R = a.el = o.el;
    let { patchFlag: v, dynamicChildren: m, dirs: T } = a;
    v |= o.patchFlag & 16;
    const M = o.props || ne, S = a.props || ne;
    let H;
    f && Ct(f, !1), (H = S.onVnodeBeforeUpdate) && Je(H, f, a, o), T && It(a, o, f, "beforeUpdate"), f && Ct(f, !0);
    const K = E && a.type !== "foreignObject";
    if (m ? z(o.dynamicChildren, m, R, f, h, K, I) : P || pe(o, a, R, null, f, h, K, I, !1), v > 0) {
      if (v & 16)
        oe(R, a, M, S, f, h, E);
      else if (v & 2 && M.class !== S.class && s(R, "class", null, S.class, E), v & 4 && s(R, "style", M.style, S.style, E), v & 8) {
        const J = a.dynamicProps;
        for (let ee = 0; ee < J.length; ee++) {
          const te = J[ee], xe = M[te], kt = S[te];
          (kt !== xe || te === "value") && s(R, te, xe, kt, E, o.children, f, h, Te);
        }
      }
      v & 1 && o.children !== a.children && _(R, a.children);
    } else
      !P && m == null && oe(R, a, M, S, f, h, E);
    ((H = S.onVnodeUpdated) || T) && ye(() => {
      H && Je(H, f, a, o), T && It(a, o, f, "updated");
    }, h);
  }, z = (o, a, f, h, E, I, P) => {
    for (let R = 0; R < a.length; R++) {
      const v = o[R], m = a[R], T = v.el && (v.type === We || !Nt(v, m) || v.shapeFlag & 70) ? b(v.el) : f;
      N(v, m, T, null, h, E, I, P, !0);
    }
  }, oe = (o, a, f, h, E, I, P) => {
    if (f !== h) {
      for (const R in h) {
        if (mn(R))
          continue;
        const v = h[R], m = f[R];
        v !== m && R !== "value" && s(o, R, m, v, P, a.children, E, I, Te);
      }
      if (f !== ne)
        for (const R in f)
          !mn(R) && !(R in h) && s(o, R, f[R], null, P, a.children, E, I, Te);
      "value" in h && s(o, "value", f.value, h.value);
    }
  }, ie = (o, a, f, h, E, I, P, R, v) => {
    const m = a.el = o ? o.el : c(""), T = a.anchor = o ? o.anchor : c("");
    let { patchFlag: M, dynamicChildren: S, slotScopeIds: H } = a;
    H && (R = R ? R.concat(H) : H), o == null ? (r(m, f, h), r(T, f, h), U(a.children, f, T, E, I, P, R, v)) : M > 0 && M & 64 && S && o.dynamicChildren ? (z(o.dynamicChildren, S, f, E, I, P, R), (a.key != null || E && a === E.subTree) && Xl(o, a, !0)) : pe(o, a, f, T, E, I, P, R, v);
  }, De = (o, a, f, h, E, I, P, R, v) => {
    a.slotScopeIds = R, o == null ? a.shapeFlag & 512 ? E.ctx.activate(a, f, h, P, v) : nt(a, f, h, E, I, P, v) : le(o, a, v);
  }, nt = (o, a, f, h, E, I, P) => {
    const R = o.component = Li(o, h, E);
    if (kn(o) && (R.ctx.renderer = Le), Ai(R), R.asyncDep) {
      if (E && E.registerDep(R, G), !o.el) {
        const v = R.subTree = ve(it);
        y(null, v, a, f);
      }
      return;
    }
    G(R, o, a, f, E, I, P);
  }, le = (o, a, f) => {
    const h = a.component = o.component;
    if (Fo(o, a, f))
      if (h.asyncDep && !h.asyncResolved) {
        Z(h, a, f);
        return;
      } else
        h.next = a, To(h.update), h.update();
    else
      a.el = o.el, h.vnode = a;
  }, G = (o, a, f, h, E, I, P) => {
    const R = () => {
      if (o.isMounted) {
        let { next: T, bu: M, u: S, parent: H, vnode: K } = o, J = T, ee;
        Ct(o, !1), T ? (T.el = K.el, Z(o, T, P)) : T = K, M && Bn(M), (ee = T.props && T.props.onVnodeBeforeUpdate) && Je(ee, H, T, K), Ct(o, !0);
        const te = jn(o), xe = o.subTree;
        o.subTree = te, N(
          xe,
          te,
          b(xe.el),
          ke(xe),
          o,
          E,
          I
        ), T.el = te.el, J === null && Ro(o, te.el), S && ye(S, E), (ee = T.props && T.props.onVnodeUpdated) && ye(() => Je(ee, H, T, K), E);
      } else {
        let T;
        const { el: M, props: S } = a, { bm: H, m: K, parent: J } = o, ee = _n(a);
        if (Ct(o, !1), H && Bn(H), !ee && (T = S && S.onVnodeBeforeMount) && Je(T, J, a), Ct(o, !0), M && Ye) {
          const te = () => {
            o.subTree = jn(o), Ye(M, o.subTree, o, E, null);
          };
          ee ? a.type.__asyncLoader().then(
            () => !o.isUnmounted && te()
          ) : te();
        } else {
          const te = o.subTree = jn(o);
          N(null, te, f, h, o, E, I), a.el = te.el;
        }
        if (K && ye(K, E), !ee && (T = S && S.onVnodeMounted)) {
          const te = a;
          ye(() => Je(T, J, te), E);
        }
        (a.shapeFlag & 256 || J && _n(J.vnode) && J.vnode.shapeFlag & 256) && o.a && ye(o.a, E), o.isMounted = !0, a = f = h = null;
      }
    }, v = o.effect = new vr(
      R,
      () => Dr(m),
      o.scope
    ), m = o.update = () => v.run();
    m.id = o.uid, Ct(o, !0), m();
  }, Z = (o, a, f) => {
    a.component = o;
    const h = o.vnode.props;
    o.vnode = a, o.next = null, si(o, a.props, h, f), oi(o, a.children, f), Xt(), rs(), Yt();
  }, pe = (o, a, f, h, E, I, P, R, v = !1) => {
    const m = o && o.children, T = o ? o.shapeFlag : 0, M = a.children, { patchFlag: S, shapeFlag: H } = a;
    if (S > 0) {
      if (S & 128) {
        Me(m, M, f, h, E, I, P, R, v);
        return;
      } else if (S & 256) {
        rt(m, M, f, h, E, I, P, R, v);
        return;
      }
    }
    H & 8 ? (T & 16 && Te(m, E, I), M !== m && _(f, M)) : T & 16 ? H & 16 ? Me(m, M, f, h, E, I, P, R, v) : Te(m, E, I, !0) : (T & 8 && _(f, ""), H & 16 && U(M, f, h, E, I, P, R, v));
  }, rt = (o, a, f, h, E, I, P, R, v) => {
    o = o || Mt, a = a || Mt;
    const m = o.length, T = a.length, M = Math.min(m, T);
    let S;
    for (S = 0; S < M; S++) {
      const H = a[S] = v ? mt(a[S]) : Qe(a[S]);
      N(o[S], H, f, null, E, I, P, R, v);
    }
    m > T ? Te(o, E, I, !0, !1, M) : U(a, f, h, E, I, P, R, v, M);
  }, Me = (o, a, f, h, E, I, P, R, v) => {
    let m = 0;
    const T = a.length;
    let M = o.length - 1, S = T - 1;
    for (; m <= M && m <= S; ) {
      const H = o[m], K = a[m] = v ? mt(a[m]) : Qe(a[m]);
      if (Nt(H, K))
        N(H, K, f, null, E, I, P, R, v);
      else
        break;
      m++;
    }
    for (; m <= M && m <= S; ) {
      const H = o[M], K = a[S] = v ? mt(a[S]) : Qe(a[S]);
      if (Nt(H, K))
        N(H, K, f, null, E, I, P, R, v);
      else
        break;
      M--, S--;
    }
    if (m > M) {
      if (m <= S) {
        const H = S + 1, K = H < T ? a[H].el : h;
        for (; m <= S; )
          N(null, a[m] = v ? mt(a[m]) : Qe(a[m]), f, K, E, I, P, R, v), m++;
      }
    } else if (m > S)
      for (; m <= M; )
        Ne(o[m], E, I, !0), m++;
    else {
      const H = m, K = m, J = /* @__PURE__ */ new Map();
      for (m = K; m <= S; m++) {
        const Oe = a[m] = v ? mt(a[m]) : Qe(a[m]);
        Oe.key != null && J.set(Oe.key, m);
      }
      let ee, te = 0;
      const xe = S - K + 1;
      let kt = !1, Yr = 0;
      const Gt = new Array(xe);
      for (m = 0; m < xe; m++)
        Gt[m] = 0;
      for (m = H; m <= M; m++) {
        const Oe = o[m];
        if (te >= xe) {
          Ne(Oe, E, I, !0);
          continue;
        }
        let Ge;
        if (Oe.key != null)
          Ge = J.get(Oe.key);
        else
          for (ee = K; ee <= S; ee++)
            if (Gt[ee - K] === 0 && Nt(Oe, a[ee])) {
              Ge = ee;
              break;
            }
        Ge === void 0 ? Ne(Oe, E, I, !0) : (Gt[Ge - K] = m + 1, Ge >= Yr ? Yr = Ge : kt = !0, N(Oe, a[Ge], f, null, E, I, P, R, v), te++);
      }
      const Gr = kt ? di(Gt) : Mt;
      for (ee = Gr.length - 1, m = xe - 1; m >= 0; m--) {
        const Oe = K + m, Ge = a[Oe], Jr = Oe + 1 < T ? a[Oe + 1].el : h;
        Gt[m] === 0 ? N(null, Ge, f, Jr, E, I, P, R, v) : kt && (ee < 0 || m !== Gr[ee] ? Re(Ge, f, Jr, 2) : ee--);
      }
    }
  }, Re = (o, a, f, h, E = null) => {
    const { el: I, type: P, transition: R, children: v, shapeFlag: m } = o;
    if (m & 6) {
      Re(o.component.subTree, a, f, h);
      return;
    }
    if (m & 128) {
      o.suspense.move(a, f, h);
      return;
    }
    if (m & 64) {
      P.move(o, a, f, Le);
      return;
    }
    if (P === We) {
      r(I, a, f);
      for (let M = 0; M < v.length; M++)
        Re(v[M], a, f, h);
      r(o.anchor, a, f);
      return;
    }
    if (P === Kn) {
      L(o, a, f);
      return;
    }
    if (h !== 2 && m & 1 && R)
      if (h === 0)
        R.beforeEnter(I), r(I, a, f), ye(() => R.enter(I), E);
      else {
        const { leave: M, delayLeave: S, afterLeave: H } = R, K = () => r(I, a, f), J = () => {
          M(I, () => {
            K(), H && H();
          });
        };
        S ? S(I, K, J) : J();
      }
    else
      r(I, a, f);
  }, Ne = (o, a, f, h = !1, E = !1) => {
    const { type: I, props: P, ref: R, children: v, dynamicChildren: m, shapeFlag: T, patchFlag: M, dirs: S } = o;
    if (R != null && sr(R, null, f, o, !0), T & 256) {
      a.ctx.deactivate(o);
      return;
    }
    const H = T & 1 && S, K = !_n(o);
    let J;
    if (K && (J = P && P.onVnodeBeforeUnmount) && Je(J, a, o), T & 6)
      At(o.component, f, h);
    else {
      if (T & 128) {
        o.suspense.unmount(f, h);
        return;
      }
      H && It(o, null, a, "beforeUnmount"), T & 64 ? o.type.remove(o, a, f, E, Le, h) : m && (I !== We || M > 0 && M & 64) ? Te(m, a, f, !1, !0) : (I === We && M & 384 || !E && T & 16) && Te(v, a, f), h && st(o);
    }
    (K && (J = P && P.onVnodeUnmounted) || H) && ye(() => {
      J && Je(J, a, o), H && It(o, null, a, "unmounted");
    }, f);
  }, st = (o) => {
    const { type: a, el: f, anchor: h, transition: E } = o;
    if (a === We) {
      Lt(f, h);
      return;
    }
    if (a === Kn) {
      A(o);
      return;
    }
    const I = () => {
      l(f), E && !E.persisted && E.afterLeave && E.afterLeave();
    };
    if (o.shapeFlag & 1 && E && !E.persisted) {
      const { leave: P, delayLeave: R } = E, v = () => P(f, I);
      R ? R(o.el, I, v) : v();
    } else
      I();
  }, Lt = (o, a) => {
    let f;
    for (; o !== a; )
      f = p(o), l(o), o = f;
    l(a);
  }, At = (o, a, f) => {
    const { bum: h, scope: E, update: I, subTree: P, um: R } = o;
    h && Bn(h), E.stop(), I && (I.active = !1, Ne(P, o, a, f)), R && ye(R, a), ye(() => {
      o.isUnmounted = !0;
    }, a), a && a.pendingBranch && !a.isUnmounted && o.asyncDep && !o.asyncResolved && o.suspenseId === a.pendingId && (a.deps--, a.deps === 0 && a.resolve());
  }, Te = (o, a, f, h = !1, E = !1, I = 0) => {
    for (let P = I; P < o.length; P++)
      Ne(o[P], a, f, h, E);
  }, ke = (o) => o.shapeFlag & 6 ? ke(o.component.subTree) : o.shapeFlag & 128 ? o.suspense.next() : p(o.anchor || o.el), Xe = (o, a, f) => {
    o == null ? a._vnode && Ne(a._vnode, null, null, !0) : N(a._vnode || null, o, a, null, null, null, f), rs(), vl(), a._vnode = o;
  }, Le = {
    p: N,
    um: Ne,
    m: Re,
    r: st,
    mt: nt,
    mc: U,
    pc: pe,
    pbc: z,
    n: ke,
    o: e
  };
  let Se, Ye;
  return t && ([Se, Ye] = t(Le)), {
    render: Xe,
    hydrate: Se,
    createApp: ci(Xe, Se)
  };
}
function Ct({ effect: e, update: t }, n) {
  e.allowRecurse = t.allowRecurse = n;
}
function Xl(e, t, n = !1) {
  const r = e.children, l = t.children;
  if (j(r) && j(l))
    for (let s = 0; s < r.length; s++) {
      const i = r[s];
      let c = l[s];
      c.shapeFlag & 1 && !c.dynamicChildren && ((c.patchFlag <= 0 || c.patchFlag === 32) && (c = l[s] = mt(l[s]), c.el = i.el), n || Xl(i, c));
    }
}
function di(e) {
  const t = e.slice(), n = [0];
  let r, l, s, i, c;
  const u = e.length;
  for (r = 0; r < u; r++) {
    const d = e[r];
    if (d !== 0) {
      if (l = n[n.length - 1], e[l] < d) {
        t[r] = l, n.push(r);
        continue;
      }
      for (s = 0, i = n.length - 1; s < i; )
        c = s + i >> 1, e[n[c]] < d ? s = c + 1 : i = c;
      d < e[n[s]] && (s > 0 && (t[r] = n[s - 1]), n[s] = r);
    }
  }
  for (s = n.length, i = n[s - 1]; s-- > 0; )
    n[s] = i, i = t[i];
  return n;
}
const mi = (e) => e.__isTeleport, We = Symbol(void 0), Dn = Symbol(void 0), it = Symbol(void 0), Kn = Symbol(void 0), Zt = [];
let je = null;
function Yl(e = !1) {
  Zt.push(je = e ? null : []);
}
function gi() {
  Zt.pop(), je = Zt[Zt.length - 1] || null;
}
let nn = 1;
function gs(e) {
  nn += e;
}
function _i(e) {
  return e.dynamicChildren = nn > 0 ? je || Mt : null, gi(), nn > 0 && je && je.push(e), e;
}
function Gl(e, t, n, r, l, s) {
  return _i(Ve(e, t, n, r, l, s, !0));
}
function lr(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Nt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const Mn = "__vInternal", Jl = ({ key: e }) => e != null ? e : null, hn = ({ ref: e, ref_key: t, ref_for: n }) => e != null ? he(e) || _e(e) || V(e) ? { i: Be, r: e, k: t, f: !!n } : e : null;
function Ve(e, t = null, n = null, r = 0, l = null, s = e === We ? 0 : 1, i = !1, c = !1) {
  const u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Jl(t),
    ref: t && hn(t),
    scopeId: Rn,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: s,
    patchFlag: r,
    dynamicProps: l,
    dynamicChildren: null,
    appContext: null
  };
  return c ? (xr(u, n), s & 128 && e.normalize(u)) : n && (u.shapeFlag |= he(n) ? 8 : 16), nn > 0 && !i && je && (u.patchFlag > 0 || s & 6) && u.patchFlag !== 32 && je.push(u), u;
}
const ve = hi;
function hi(e, t = null, n = null, r = 0, l = null, s = !1) {
  if ((!e || e === qo) && (e = it), lr(e)) {
    const c = pt(e, t, !0);
    return n && xr(c, n), nn > 0 && !s && je && (c.shapeFlag & 6 ? je[je.indexOf(e)] = c : je.push(c)), c.patchFlag |= -2, c;
  }
  if (Ni(e) && (e = e.__vccOpts), t) {
    t = pi(t);
    let { class: c, style: u } = t;
    c && !he(c) && (t.class = Tr(c)), ae(u) && (pl(u) && !j(u) && (u = Ee({}, u)), t.style = Er(u));
  }
  const i = he(e) ? 1 : ko(e) ? 128 : mi(e) ? 64 : ae(e) ? 4 : V(e) ? 2 : 0;
  return Ve(e, t, n, r, l, i, s, !0);
}
function pi(e) {
  return e ? pl(e) || Mn in e ? Ee({}, e) : e : null;
}
function pt(e, t, n = !1) {
  const { props: r, ref: l, patchFlag: s, children: i } = e, c = t ? bi(r || {}, t) : r;
  return {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: c,
    key: c && Jl(c),
    ref: t && t.ref ? n && l ? j(l) ? l.concat(hn(t)) : [l, hn(t)] : hn(t) : l,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: i,
    target: e.target,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    patchFlag: t && e.type !== We ? s === -1 ? 16 : s | 16 : s,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: e.transition,
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && pt(e.ssContent),
    ssFallback: e.ssFallback && pt(e.ssFallback),
    el: e.el,
    anchor: e.anchor
  };
}
function ql(e = " ", t = 0) {
  return ve(Dn, null, e, t);
}
function Qe(e) {
  return e == null || typeof e == "boolean" ? ve(it) : j(e) ? ve(
    We,
    null,
    e.slice()
  ) : typeof e == "object" ? mt(e) : ve(Dn, null, String(e));
}
function mt(e) {
  return e.el === null || e.memo ? e : pt(e);
}
function xr(e, t) {
  let n = 0;
  const { shapeFlag: r } = e;
  if (t == null)
    t = null;
  else if (j(t))
    n = 16;
  else if (typeof t == "object")
    if (r & 65) {
      const l = t.default;
      l && (l._c && (l._d = !1), xr(e, l()), l._c && (l._d = !0));
      return;
    } else {
      n = 32;
      const l = t._;
      !l && !(Mn in t) ? t._ctx = Be : l === 3 && Be && (Be.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else
    V(t) ? (t = { default: t, _ctx: Be }, n = 32) : (t = String(t), r & 64 ? (n = 16, t = [ql(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function bi(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    for (const l in r)
      if (l === "class")
        t.class !== r.class && (t.class = Tr([t.class, r.class]));
      else if (l === "style")
        t.style = Er([t.style, r.style]);
      else if (In(l)) {
        const s = t[l], i = r[l];
        i && s !== i && !(j(s) && s.includes(i)) && (t[l] = s ? [].concat(s, i) : i);
      } else
        l !== "" && (t[l] = r[l]);
  }
  return t;
}
function Je(e, t, n, r = null) {
  we(e, t, 7, [
    n,
    r
  ]);
}
const Ei = Kl();
let Ti = 0;
function Li(e, t, n) {
  const r = e.type, l = (t ? t.appContext : e.appContext) || Ei, s = {
    uid: Ti++,
    vnode: e,
    type: r,
    parent: t,
    appContext: l,
    root: null,
    next: null,
    subTree: null,
    effect: null,
    update: null,
    scope: new ll(!0),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(l.provides),
    accessCache: null,
    renderCache: [],
    components: null,
    directives: null,
    propsOptions: Hl(r, l),
    emitsOptions: Ol(r, l),
    emit: null,
    emitted: null,
    propsDefaults: ne,
    inheritAttrs: r.inheritAttrs,
    ctx: ne,
    data: ne,
    props: ne,
    attrs: ne,
    slots: ne,
    refs: ne,
    setupState: ne,
    setupContext: null,
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return s.ctx = { _: s }, s.root = t ? t.root : s, s.emit = Io.bind(null, s), e.ce && e.ce(s), s;
}
let me = null;
const Bt = () => me || Be, jt = (e) => {
  me = e, e.scope.on();
}, Rt = () => {
  me && me.scope.off(), me = null;
};
function Zl(e) {
  return e.vnode.shapeFlag & 4;
}
let rn = !1;
function Ai(e, t = !1) {
  rn = t;
  const { props: n, children: r } = e.vnode, l = Zl(e);
  ri(e, n, l, t), ai(e, r);
  const s = l ? Ii(e, t) : void 0;
  return rn = !1, s;
}
function Ii(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = bl(new Proxy(e.ctx, Qo));
  const { setup: r } = n;
  if (r) {
    const l = e.setupContext = r.length > 1 ? yi(e) : null;
    jt(e), Xt();
    const s = _t(r, e, 0, [e.props, l]);
    if (Yt(), Rt(), nl(s)) {
      if (s.then(Rt, Rt), t)
        return s.then((i) => {
          _s(e, i, t);
        }).catch((i) => {
          On(i, e, 0);
        });
      e.asyncDep = s;
    } else
      _s(e, s, t);
  } else
    Ql(e, t);
}
function _s(e, t, n) {
  V(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : ae(t) && (e.setupState = Al(t)), Ql(e, n);
}
let hs;
function Ql(e, t, n) {
  const r = e.type;
  if (!e.render) {
    if (!t && hs && !r.render) {
      const l = r.template;
      if (l) {
        const { isCustomElement: s, compilerOptions: i } = e.appContext.config, { delimiters: c, compilerOptions: u } = r, d = Ee(Ee({
          isCustomElement: s,
          delimiters: c
        }, i), u);
        r.render = hs(l, d);
      }
    }
    e.render = r.render || Ke;
  }
  jt(e), Xt(), $o(e), Yt(), Rt();
}
function Ci(e) {
  return new Proxy(e.attrs, {
    get(t, n) {
      return Fe(e, "get", "$attrs"), t[n];
    }
  });
}
function yi(e) {
  const t = (r) => {
    e.exposed = r || {};
  };
  let n;
  return {
    get attrs() {
      return n || (n = Ci(e));
    },
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function Wr(e) {
  if (e.exposed)
    return e.exposeProxy || (e.exposeProxy = new Proxy(Al(bl(e.exposed)), {
      get(t, n) {
        if (n in t)
          return t[n];
        if (n in Ln)
          return Ln[n](e);
      }
    }));
}
function vi(e, t = !0) {
  return V(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Ni(e) {
  return V(e) && "__vccOpts" in e;
}
const He = (e, t) => ho(e, t, rn);
function $l(e, t, n) {
  const r = arguments.length;
  return r === 2 ? ae(t) && !j(t) ? lr(t) ? ve(e, null, [t]) : ve(e, t) : ve(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && lr(n) && (n = [n]), ve(e, t, n));
}
const Oi = "3.2.38", Fi = "http://www.w3.org/2000/svg", Ot = typeof document < "u" ? document : null, ps = Ot && /* @__PURE__ */ Ot.createElement("template"), Ri = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, r) => {
    const l = t ? Ot.createElementNS(Fi, e) : Ot.createElement(e, n ? { is: n } : void 0);
    return e === "select" && r && r.multiple != null && l.setAttribute("multiple", r.multiple), l;
  },
  createText: (e) => Ot.createTextNode(e),
  createComment: (e) => Ot.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => Ot.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  cloneNode(e) {
    const t = e.cloneNode(!0);
    return "_value" in e && (t._value = e._value), t;
  },
  insertStaticContent(e, t, n, r, l, s) {
    const i = n ? n.previousSibling : t.lastChild;
    if (l && (l === s || l.nextSibling))
      for (; t.insertBefore(l.cloneNode(!0), n), !(l === s || !(l = l.nextSibling)); )
        ;
    else {
      ps.innerHTML = r ? `<svg>${e}</svg>` : e;
      const c = ps.content;
      if (r) {
        const u = c.firstChild;
        for (; u.firstChild; )
          c.appendChild(u.firstChild);
        c.removeChild(u);
      }
      t.insertBefore(c, n);
    }
    return [
      i ? i.nextSibling : t.firstChild,
      n ? n.previousSibling : t.lastChild
    ];
  }
};
function ki(e, t, n) {
  const r = e._vtc;
  r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
function Pi(e, t, n) {
  const r = e.style, l = he(n);
  if (n && !l) {
    for (const s in n)
      ar(r, s, n[s]);
    if (t && !he(t))
      for (const s in t)
        n[s] == null && ar(r, s, "");
  } else {
    const s = r.display;
    l ? t !== n && (r.cssText = n) : t && e.removeAttribute("style"), "_vod" in e && (r.display = s);
  }
}
const bs = /\s*!important$/;
function ar(e, t, n) {
  if (j(n))
    n.forEach((r) => ar(e, t, r));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const r = wi(e, t);
    bs.test(n) ? e.setProperty(Kt(r), n.replace(bs, ""), "important") : e[r] = n;
  }
}
const Es = ["Webkit", "Moz", "ms"], Xn = {};
function wi(e, t) {
  const n = Xn[t];
  if (n)
    return n;
  let r = tt(t);
  if (r !== "filter" && r in e)
    return Xn[t] = r;
  r = vn(r);
  for (let l = 0; l < Es.length; l++) {
    const s = Es[l] + r;
    if (s in e)
      return Xn[t] = s;
  }
  return t;
}
const Ts = "http://www.w3.org/1999/xlink";
function Di(e, t, n, r, l) {
  if (r && t.startsWith("xlink:"))
    n == null ? e.removeAttributeNS(Ts, t.slice(6, t.length)) : e.setAttributeNS(Ts, t, n);
  else {
    const s = Ia(t);
    n == null || s && !zs(n) ? e.removeAttribute(t) : e.setAttribute(t, s ? "" : n);
  }
}
function Mi(e, t, n, r, l, s, i) {
  if (t === "innerHTML" || t === "textContent") {
    r && i(r, l, s), e[t] = n == null ? "" : n;
    return;
  }
  if (t === "value" && e.tagName !== "PROGRESS" && !e.tagName.includes("-")) {
    e._value = n;
    const u = n == null ? "" : n;
    (e.value !== u || e.tagName === "OPTION") && (e.value = u), n == null && e.removeAttribute(t);
    return;
  }
  let c = !1;
  if (n === "" || n == null) {
    const u = typeof e[t];
    u === "boolean" ? n = zs(n) : n == null && u === "string" ? (n = "", c = !0) : u === "number" && (n = 0, c = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  c && e.removeAttribute(t);
}
const [zl, Si] = /* @__PURE__ */ (() => {
  let e = Date.now, t = !1;
  if (typeof window < "u") {
    Date.now() > document.createEvent("Event").timeStamp && (e = performance.now.bind(performance));
    const n = navigator.userAgent.match(/firefox\/(\d+)/i);
    t = !!(n && Number(n[1]) <= 53);
  }
  return [e, t];
})();
let or = 0;
const xi = /* @__PURE__ */ Promise.resolve(), Wi = () => {
  or = 0;
}, Ui = () => or || (xi.then(Wi), or = zl());
function Hi(e, t, n, r) {
  e.addEventListener(t, n, r);
}
function Bi(e, t, n, r) {
  e.removeEventListener(t, n, r);
}
function ji(e, t, n, r, l = null) {
  const s = e._vei || (e._vei = {}), i = s[t];
  if (r && i)
    i.value = r;
  else {
    const [c, u] = Vi(t);
    if (r) {
      const d = s[t] = Ki(r, l);
      Hi(e, c, d, u);
    } else
      i && (Bi(e, c, i, u), s[t] = void 0);
  }
}
const Ls = /(?:Once|Passive|Capture)$/;
function Vi(e) {
  let t;
  if (Ls.test(e)) {
    t = {};
    let r;
    for (; r = e.match(Ls); )
      e = e.slice(0, e.length - r[0].length), t[r[0].toLowerCase()] = !0;
  }
  return [e[2] === ":" ? e.slice(3) : Kt(e.slice(2)), t];
}
function Ki(e, t) {
  const n = (r) => {
    const l = r.timeStamp || zl();
    (Si || l >= n.attached - 1) && we(Xi(r, n.value), t, 5, [r]);
  };
  return n.value = e, n.attached = Ui(), n;
}
function Xi(e, t) {
  if (j(t)) {
    const n = e.stopImmediatePropagation;
    return e.stopImmediatePropagation = () => {
      n.call(e), e._stopped = !0;
    }, t.map((r) => (l) => !l._stopped && r && r(l));
  } else
    return t;
}
const As = /^on[a-z]/, Yi = (e, t, n, r, l = !1, s, i, c, u) => {
  t === "class" ? ki(e, r, l) : t === "style" ? Pi(e, n, r) : In(t) ? Lr(t) || ji(e, t, n, r, i) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Gi(e, t, r, l)) ? Mi(e, t, r, s, i, c, u) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Di(e, t, r, l));
};
function Gi(e, t, n, r) {
  return r ? !!(t === "innerHTML" || t === "textContent" || t in e && As.test(t) && V(n)) : t === "spellcheck" || t === "draggable" || t === "translate" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA" || As.test(t) && he(n) ? !1 : t in e;
}
const Ji = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: !0
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
xo.props;
const qi = /* @__PURE__ */ Ee({ patchProp: Yi }, Ri);
let Is;
function Zi() {
  return Is || (Is = ui(qi));
}
const Qi = (...e) => {
  const t = Zi().createApp(...e), { mount: n } = t;
  return t.mount = (r) => {
    const l = $i(r);
    if (!l)
      return;
    const s = t._component;
    !V(s) && !s.render && !s.template && (s.template = l.innerHTML), l.innerHTML = "";
    const i = n(l, !1, l instanceof SVGElement);
    return l instanceof Element && (l.removeAttribute("v-cloak"), l.setAttribute("data-v-app", "")), i;
  }, t;
};
function $i(e) {
  return he(e) ? document.querySelector(e) : e;
}
/*!
  * shared v9.2.2
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const ir = typeof window < "u", zi = typeof Symbol == "function" && typeof Symbol.toStringTag == "symbol", Et = (e) => zi ? Symbol(e) : e, ec = (e, t, n) => tc({ l: e, k: t, s: n }), tc = (e) => JSON.stringify(e).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027"), fe = (e) => typeof e == "number" && isFinite(e), nc = (e) => Hr(e) === "[object Date]", bt = (e) => Hr(e) === "[object RegExp]", Sn = (e) => B(e) && Object.keys(e).length === 0;
function rc(e, t) {
  typeof console < "u" && (console.warn("[intlify] " + e), t && console.warn(t.stack));
}
const ge = Object.assign;
let Cs;
const Qt = () => Cs || (Cs = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function ys(e) {
  return e.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
const sc = Object.prototype.hasOwnProperty;
function Ur(e, t) {
  return sc.call(e, t);
}
const re = Array.isArray, ce = (e) => typeof e == "function", w = (e) => typeof e == "string", Y = (e) => typeof e == "boolean", se = (e) => e !== null && typeof e == "object", ea = Object.prototype.toString, Hr = (e) => ea.call(e), B = (e) => Hr(e) === "[object Object]", lc = (e) => e == null ? "" : re(e) || B(e) && e.toString === ea ? JSON.stringify(e, null, 2) : String(e);
/*!
  * message-compiler v9.2.2
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const Q = {
  EXPECTED_TOKEN: 1,
  INVALID_TOKEN_IN_PLACEHOLDER: 2,
  UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER: 3,
  UNKNOWN_ESCAPE_SEQUENCE: 4,
  INVALID_UNICODE_ESCAPE_SEQUENCE: 5,
  UNBALANCED_CLOSING_BRACE: 6,
  UNTERMINATED_CLOSING_BRACE: 7,
  EMPTY_PLACEHOLDER: 8,
  NOT_ALLOW_NEST_PLACEHOLDER: 9,
  INVALID_LINKED_FORMAT: 10,
  MUST_HAVE_MESSAGES_IN_PLURAL: 11,
  UNEXPECTED_EMPTY_LINKED_MODIFIER: 12,
  UNEXPECTED_EMPTY_LINKED_KEY: 13,
  UNEXPECTED_LEXICAL_ANALYSIS: 14,
  __EXTEND_POINT__: 15
};
function xn(e, t, n = {}) {
  const { domain: r, messages: l, args: s } = n, i = e, c = new SyntaxError(String(i));
  return c.code = e, t && (c.location = t), c.domain = r, c;
}
function ac(e) {
  throw e;
}
function oc(e, t, n) {
  return { line: e, column: t, offset: n };
}
function cr(e, t, n) {
  const r = { start: e, end: t };
  return n != null && (r.source = n), r;
}
const lt = " ", ic = "\r", Ie = `
`, cc = String.fromCharCode(8232), uc = String.fromCharCode(8233);
function fc(e) {
  const t = e;
  let n = 0, r = 1, l = 1, s = 0;
  const i = (x) => t[x] === ic && t[x + 1] === Ie, c = (x) => t[x] === Ie, u = (x) => t[x] === uc, d = (x) => t[x] === cc, _ = (x) => i(x) || c(x) || u(x) || d(x), b = () => n, p = () => r, C = () => l, k = () => s, O = (x) => i(x) || u(x) || d(x) ? Ie : t[x], N = () => O(n), g = () => O(n + s);
  function y() {
    return s = 0, _(n) && (r++, l = 0), i(n) && n++, n++, l++, t[n];
  }
  function F() {
    return i(n + s) && s++, s++, t[n + s];
  }
  function L() {
    n = 0, r = 1, l = 1, s = 0;
  }
  function A(x = 0) {
    s = x;
  }
  function D() {
    const x = n + s;
    for (; x !== n; )
      y();
    s = 0;
  }
  return {
    index: b,
    line: p,
    column: C,
    peekOffset: k,
    charAt: O,
    currentChar: N,
    currentPeek: g,
    next: y,
    peek: F,
    reset: L,
    resetPeek: A,
    skipToPeek: D
  };
}
const dt = void 0, vs = "'", dc = "tokenizer";
function mc(e, t = {}) {
  const n = t.location !== !1, r = fc(e), l = () => r.index(), s = () => oc(r.line(), r.column(), r.index()), i = s(), c = l(), u = {
    currentType: 14,
    offset: c,
    startLoc: i,
    endLoc: i,
    lastType: 14,
    lastOffset: c,
    lastStartLoc: i,
    lastEndLoc: i,
    braceNest: 0,
    inLinked: !1,
    text: ""
  }, d = () => u, { onError: _ } = t;
  function b(o, a, f, ...h) {
    const E = d();
    if (a.column += f, a.offset += f, _) {
      const I = cr(E.startLoc, a), P = xn(o, I, {
        domain: dc,
        args: h
      });
      _(P);
    }
  }
  function p(o, a, f) {
    o.endLoc = s(), o.currentType = a;
    const h = { type: a };
    return n && (h.loc = cr(o.startLoc, o.endLoc)), f != null && (h.value = f), h;
  }
  const C = (o) => p(o, 14);
  function k(o, a) {
    return o.currentChar() === a ? (o.next(), a) : (b(Q.EXPECTED_TOKEN, s(), 0, a), "");
  }
  function O(o) {
    let a = "";
    for (; o.currentPeek() === lt || o.currentPeek() === Ie; )
      a += o.currentPeek(), o.peek();
    return a;
  }
  function N(o) {
    const a = O(o);
    return o.skipToPeek(), a;
  }
  function g(o) {
    if (o === dt)
      return !1;
    const a = o.charCodeAt(0);
    return a >= 97 && a <= 122 || a >= 65 && a <= 90 || a === 95;
  }
  function y(o) {
    if (o === dt)
      return !1;
    const a = o.charCodeAt(0);
    return a >= 48 && a <= 57;
  }
  function F(o, a) {
    const { currentType: f } = a;
    if (f !== 2)
      return !1;
    O(o);
    const h = g(o.currentPeek());
    return o.resetPeek(), h;
  }
  function L(o, a) {
    const { currentType: f } = a;
    if (f !== 2)
      return !1;
    O(o);
    const h = o.currentPeek() === "-" ? o.peek() : o.currentPeek(), E = y(h);
    return o.resetPeek(), E;
  }
  function A(o, a) {
    const { currentType: f } = a;
    if (f !== 2)
      return !1;
    O(o);
    const h = o.currentPeek() === vs;
    return o.resetPeek(), h;
  }
  function D(o, a) {
    const { currentType: f } = a;
    if (f !== 8)
      return !1;
    O(o);
    const h = o.currentPeek() === ".";
    return o.resetPeek(), h;
  }
  function x(o, a) {
    const { currentType: f } = a;
    if (f !== 9)
      return !1;
    O(o);
    const h = g(o.currentPeek());
    return o.resetPeek(), h;
  }
  function W(o, a) {
    const { currentType: f } = a;
    if (!(f === 8 || f === 12))
      return !1;
    O(o);
    const h = o.currentPeek() === ":";
    return o.resetPeek(), h;
  }
  function U(o, a) {
    const { currentType: f } = a;
    if (f !== 10)
      return !1;
    const h = () => {
      const I = o.currentPeek();
      return I === "{" ? g(o.peek()) : I === "@" || I === "%" || I === "|" || I === ":" || I === "." || I === lt || !I ? !1 : I === Ie ? (o.peek(), h()) : g(I);
    }, E = h();
    return o.resetPeek(), E;
  }
  function X(o) {
    O(o);
    const a = o.currentPeek() === "|";
    return o.resetPeek(), a;
  }
  function z(o) {
    const a = O(o), f = o.currentPeek() === "%" && o.peek() === "{";
    return o.resetPeek(), {
      isModulo: f,
      hasSpace: a.length > 0
    };
  }
  function oe(o, a = !0) {
    const f = (E = !1, I = "", P = !1) => {
      const R = o.currentPeek();
      return R === "{" ? I === "%" ? !1 : E : R === "@" || !R ? I === "%" ? !0 : E : R === "%" ? (o.peek(), f(E, "%", !0)) : R === "|" ? I === "%" || P ? !0 : !(I === lt || I === Ie) : R === lt ? (o.peek(), f(!0, lt, P)) : R === Ie ? (o.peek(), f(!0, Ie, P)) : !0;
    }, h = f();
    return a && o.resetPeek(), h;
  }
  function ie(o, a) {
    const f = o.currentChar();
    return f === dt ? dt : a(f) ? (o.next(), f) : null;
  }
  function De(o) {
    return ie(o, (f) => {
      const h = f.charCodeAt(0);
      return h >= 97 && h <= 122 || h >= 65 && h <= 90 || h >= 48 && h <= 57 || h === 95 || h === 36;
    });
  }
  function nt(o) {
    return ie(o, (f) => {
      const h = f.charCodeAt(0);
      return h >= 48 && h <= 57;
    });
  }
  function le(o) {
    return ie(o, (f) => {
      const h = f.charCodeAt(0);
      return h >= 48 && h <= 57 || h >= 65 && h <= 70 || h >= 97 && h <= 102;
    });
  }
  function G(o) {
    let a = "", f = "";
    for (; a = nt(o); )
      f += a;
    return f;
  }
  function Z(o) {
    N(o);
    const a = o.currentChar();
    return a !== "%" && b(Q.EXPECTED_TOKEN, s(), 0, a), o.next(), "%";
  }
  function pe(o) {
    let a = "";
    for (; ; ) {
      const f = o.currentChar();
      if (f === "{" || f === "}" || f === "@" || f === "|" || !f)
        break;
      if (f === "%")
        if (oe(o))
          a += f, o.next();
        else
          break;
      else if (f === lt || f === Ie)
        if (oe(o))
          a += f, o.next();
        else {
          if (X(o))
            break;
          a += f, o.next();
        }
      else
        a += f, o.next();
    }
    return a;
  }
  function rt(o) {
    N(o);
    let a = "", f = "";
    for (; a = De(o); )
      f += a;
    return o.currentChar() === dt && b(Q.UNTERMINATED_CLOSING_BRACE, s(), 0), f;
  }
  function Me(o) {
    N(o);
    let a = "";
    return o.currentChar() === "-" ? (o.next(), a += `-${G(o)}`) : a += G(o), o.currentChar() === dt && b(Q.UNTERMINATED_CLOSING_BRACE, s(), 0), a;
  }
  function Re(o) {
    N(o), k(o, "'");
    let a = "", f = "";
    const h = (I) => I !== vs && I !== Ie;
    for (; a = ie(o, h); )
      a === "\\" ? f += Ne(o) : f += a;
    const E = o.currentChar();
    return E === Ie || E === dt ? (b(Q.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, s(), 0), E === Ie && (o.next(), k(o, "'")), f) : (k(o, "'"), f);
  }
  function Ne(o) {
    const a = o.currentChar();
    switch (a) {
      case "\\":
      case "'":
        return o.next(), `\\${a}`;
      case "u":
        return st(o, a, 4);
      case "U":
        return st(o, a, 6);
      default:
        return b(Q.UNKNOWN_ESCAPE_SEQUENCE, s(), 0, a), "";
    }
  }
  function st(o, a, f) {
    k(o, a);
    let h = "";
    for (let E = 0; E < f; E++) {
      const I = le(o);
      if (!I) {
        b(Q.INVALID_UNICODE_ESCAPE_SEQUENCE, s(), 0, `\\${a}${h}${o.currentChar()}`);
        break;
      }
      h += I;
    }
    return `\\${a}${h}`;
  }
  function Lt(o) {
    N(o);
    let a = "", f = "";
    const h = (E) => E !== "{" && E !== "}" && E !== lt && E !== Ie;
    for (; a = ie(o, h); )
      f += a;
    return f;
  }
  function At(o) {
    let a = "", f = "";
    for (; a = De(o); )
      f += a;
    return f;
  }
  function Te(o) {
    const a = (f = !1, h) => {
      const E = o.currentChar();
      return E === "{" || E === "%" || E === "@" || E === "|" || !E || E === lt ? h : E === Ie ? (h += E, o.next(), a(f, h)) : (h += E, o.next(), a(!0, h));
    };
    return a(!1, "");
  }
  function ke(o) {
    N(o);
    const a = k(o, "|");
    return N(o), a;
  }
  function Xe(o, a) {
    let f = null;
    switch (o.currentChar()) {
      case "{":
        return a.braceNest >= 1 && b(Q.NOT_ALLOW_NEST_PLACEHOLDER, s(), 0), o.next(), f = p(a, 2, "{"), N(o), a.braceNest++, f;
      case "}":
        return a.braceNest > 0 && a.currentType === 2 && b(Q.EMPTY_PLACEHOLDER, s(), 0), o.next(), f = p(a, 3, "}"), a.braceNest--, a.braceNest > 0 && N(o), a.inLinked && a.braceNest === 0 && (a.inLinked = !1), f;
      case "@":
        return a.braceNest > 0 && b(Q.UNTERMINATED_CLOSING_BRACE, s(), 0), f = Le(o, a) || C(a), a.braceNest = 0, f;
      default:
        let E = !0, I = !0, P = !0;
        if (X(o))
          return a.braceNest > 0 && b(Q.UNTERMINATED_CLOSING_BRACE, s(), 0), f = p(a, 1, ke(o)), a.braceNest = 0, a.inLinked = !1, f;
        if (a.braceNest > 0 && (a.currentType === 5 || a.currentType === 6 || a.currentType === 7))
          return b(Q.UNTERMINATED_CLOSING_BRACE, s(), 0), a.braceNest = 0, Se(o, a);
        if (E = F(o, a))
          return f = p(a, 5, rt(o)), N(o), f;
        if (I = L(o, a))
          return f = p(a, 6, Me(o)), N(o), f;
        if (P = A(o, a))
          return f = p(a, 7, Re(o)), N(o), f;
        if (!E && !I && !P)
          return f = p(a, 13, Lt(o)), b(Q.INVALID_TOKEN_IN_PLACEHOLDER, s(), 0, f.value), N(o), f;
        break;
    }
    return f;
  }
  function Le(o, a) {
    const { currentType: f } = a;
    let h = null;
    const E = o.currentChar();
    switch ((f === 8 || f === 9 || f === 12 || f === 10) && (E === Ie || E === lt) && b(Q.INVALID_LINKED_FORMAT, s(), 0), E) {
      case "@":
        return o.next(), h = p(a, 8, "@"), a.inLinked = !0, h;
      case ".":
        return N(o), o.next(), p(a, 9, ".");
      case ":":
        return N(o), o.next(), p(a, 10, ":");
      default:
        return X(o) ? (h = p(a, 1, ke(o)), a.braceNest = 0, a.inLinked = !1, h) : D(o, a) || W(o, a) ? (N(o), Le(o, a)) : x(o, a) ? (N(o), p(a, 12, At(o))) : U(o, a) ? (N(o), E === "{" ? Xe(o, a) || h : p(a, 11, Te(o))) : (f === 8 && b(Q.INVALID_LINKED_FORMAT, s(), 0), a.braceNest = 0, a.inLinked = !1, Se(o, a));
    }
  }
  function Se(o, a) {
    let f = { type: 14 };
    if (a.braceNest > 0)
      return Xe(o, a) || C(a);
    if (a.inLinked)
      return Le(o, a) || C(a);
    switch (o.currentChar()) {
      case "{":
        return Xe(o, a) || C(a);
      case "}":
        return b(Q.UNBALANCED_CLOSING_BRACE, s(), 0), o.next(), p(a, 3, "}");
      case "@":
        return Le(o, a) || C(a);
      default:
        if (X(o))
          return f = p(a, 1, ke(o)), a.braceNest = 0, a.inLinked = !1, f;
        const { isModulo: E, hasSpace: I } = z(o);
        if (E)
          return I ? p(a, 0, pe(o)) : p(a, 4, Z(o));
        if (oe(o))
          return p(a, 0, pe(o));
        break;
    }
    return f;
  }
  function Ye() {
    const { currentType: o, offset: a, startLoc: f, endLoc: h } = u;
    return u.lastType = o, u.lastOffset = a, u.lastStartLoc = f, u.lastEndLoc = h, u.offset = l(), u.startLoc = s(), r.currentChar() === dt ? p(u, 14) : Se(r, u);
  }
  return {
    nextToken: Ye,
    currentOffset: l,
    currentPosition: s,
    context: d
  };
}
const gc = "parser", _c = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;
function hc(e, t, n) {
  switch (e) {
    case "\\\\":
      return "\\";
    case "\\'":
      return "'";
    default: {
      const r = parseInt(t || n, 16);
      return r <= 55295 || r >= 57344 ? String.fromCodePoint(r) : "\uFFFD";
    }
  }
}
function pc(e = {}) {
  const t = e.location !== !1, { onError: n } = e;
  function r(g, y, F, L, ...A) {
    const D = g.currentPosition();
    if (D.offset += L, D.column += L, n) {
      const x = cr(F, D), W = xn(y, x, {
        domain: gc,
        args: A
      });
      n(W);
    }
  }
  function l(g, y, F) {
    const L = {
      type: g,
      start: y,
      end: y
    };
    return t && (L.loc = { start: F, end: F }), L;
  }
  function s(g, y, F, L) {
    g.end = y, L && (g.type = L), t && g.loc && (g.loc.end = F);
  }
  function i(g, y) {
    const F = g.context(), L = l(3, F.offset, F.startLoc);
    return L.value = y, s(L, g.currentOffset(), g.currentPosition()), L;
  }
  function c(g, y) {
    const F = g.context(), { lastOffset: L, lastStartLoc: A } = F, D = l(5, L, A);
    return D.index = parseInt(y, 10), g.nextToken(), s(D, g.currentOffset(), g.currentPosition()), D;
  }
  function u(g, y) {
    const F = g.context(), { lastOffset: L, lastStartLoc: A } = F, D = l(4, L, A);
    return D.key = y, g.nextToken(), s(D, g.currentOffset(), g.currentPosition()), D;
  }
  function d(g, y) {
    const F = g.context(), { lastOffset: L, lastStartLoc: A } = F, D = l(9, L, A);
    return D.value = y.replace(_c, hc), g.nextToken(), s(D, g.currentOffset(), g.currentPosition()), D;
  }
  function _(g) {
    const y = g.nextToken(), F = g.context(), { lastOffset: L, lastStartLoc: A } = F, D = l(8, L, A);
    return y.type !== 12 ? (r(g, Q.UNEXPECTED_EMPTY_LINKED_MODIFIER, F.lastStartLoc, 0), D.value = "", s(D, L, A), {
      nextConsumeToken: y,
      node: D
    }) : (y.value == null && r(g, Q.UNEXPECTED_LEXICAL_ANALYSIS, F.lastStartLoc, 0, qe(y)), D.value = y.value || "", s(D, g.currentOffset(), g.currentPosition()), {
      node: D
    });
  }
  function b(g, y) {
    const F = g.context(), L = l(7, F.offset, F.startLoc);
    return L.value = y, s(L, g.currentOffset(), g.currentPosition()), L;
  }
  function p(g) {
    const y = g.context(), F = l(6, y.offset, y.startLoc);
    let L = g.nextToken();
    if (L.type === 9) {
      const A = _(g);
      F.modifier = A.node, L = A.nextConsumeToken || g.nextToken();
    }
    switch (L.type !== 10 && r(g, Q.UNEXPECTED_LEXICAL_ANALYSIS, y.lastStartLoc, 0, qe(L)), L = g.nextToken(), L.type === 2 && (L = g.nextToken()), L.type) {
      case 11:
        L.value == null && r(g, Q.UNEXPECTED_LEXICAL_ANALYSIS, y.lastStartLoc, 0, qe(L)), F.key = b(g, L.value || "");
        break;
      case 5:
        L.value == null && r(g, Q.UNEXPECTED_LEXICAL_ANALYSIS, y.lastStartLoc, 0, qe(L)), F.key = u(g, L.value || "");
        break;
      case 6:
        L.value == null && r(g, Q.UNEXPECTED_LEXICAL_ANALYSIS, y.lastStartLoc, 0, qe(L)), F.key = c(g, L.value || "");
        break;
      case 7:
        L.value == null && r(g, Q.UNEXPECTED_LEXICAL_ANALYSIS, y.lastStartLoc, 0, qe(L)), F.key = d(g, L.value || "");
        break;
      default:
        r(g, Q.UNEXPECTED_EMPTY_LINKED_KEY, y.lastStartLoc, 0);
        const A = g.context(), D = l(7, A.offset, A.startLoc);
        return D.value = "", s(D, A.offset, A.startLoc), F.key = D, s(F, A.offset, A.startLoc), {
          nextConsumeToken: L,
          node: F
        };
    }
    return s(F, g.currentOffset(), g.currentPosition()), {
      node: F
    };
  }
  function C(g) {
    const y = g.context(), F = y.currentType === 1 ? g.currentOffset() : y.offset, L = y.currentType === 1 ? y.endLoc : y.startLoc, A = l(2, F, L);
    A.items = [];
    let D = null;
    do {
      const U = D || g.nextToken();
      switch (D = null, U.type) {
        case 0:
          U.value == null && r(g, Q.UNEXPECTED_LEXICAL_ANALYSIS, y.lastStartLoc, 0, qe(U)), A.items.push(i(g, U.value || ""));
          break;
        case 6:
          U.value == null && r(g, Q.UNEXPECTED_LEXICAL_ANALYSIS, y.lastStartLoc, 0, qe(U)), A.items.push(c(g, U.value || ""));
          break;
        case 5:
          U.value == null && r(g, Q.UNEXPECTED_LEXICAL_ANALYSIS, y.lastStartLoc, 0, qe(U)), A.items.push(u(g, U.value || ""));
          break;
        case 7:
          U.value == null && r(g, Q.UNEXPECTED_LEXICAL_ANALYSIS, y.lastStartLoc, 0, qe(U)), A.items.push(d(g, U.value || ""));
          break;
        case 8:
          const X = p(g);
          A.items.push(X.node), D = X.nextConsumeToken || null;
          break;
      }
    } while (y.currentType !== 14 && y.currentType !== 1);
    const x = y.currentType === 1 ? y.lastOffset : g.currentOffset(), W = y.currentType === 1 ? y.lastEndLoc : g.currentPosition();
    return s(A, x, W), A;
  }
  function k(g, y, F, L) {
    const A = g.context();
    let D = L.items.length === 0;
    const x = l(1, y, F);
    x.cases = [], x.cases.push(L);
    do {
      const W = C(g);
      D || (D = W.items.length === 0), x.cases.push(W);
    } while (A.currentType !== 14);
    return D && r(g, Q.MUST_HAVE_MESSAGES_IN_PLURAL, F, 0), s(x, g.currentOffset(), g.currentPosition()), x;
  }
  function O(g) {
    const y = g.context(), { offset: F, startLoc: L } = y, A = C(g);
    return y.currentType === 14 ? A : k(g, F, L, A);
  }
  function N(g) {
    const y = mc(g, ge({}, e)), F = y.context(), L = l(0, F.offset, F.startLoc);
    return t && L.loc && (L.loc.source = g), L.body = O(y), F.currentType !== 14 && r(y, Q.UNEXPECTED_LEXICAL_ANALYSIS, F.lastStartLoc, 0, g[F.offset] || ""), s(L, y.currentOffset(), y.currentPosition()), L;
  }
  return { parse: N };
}
function qe(e) {
  if (e.type === 14)
    return "EOF";
  const t = (e.value || "").replace(/\r?\n/gu, "\\n");
  return t.length > 10 ? t.slice(0, 9) + "\u2026" : t;
}
function bc(e, t = {}) {
  const n = {
    ast: e,
    helpers: /* @__PURE__ */ new Set()
  };
  return { context: () => n, helper: (s) => (n.helpers.add(s), s) };
}
function Ns(e, t) {
  for (let n = 0; n < e.length; n++)
    Br(e[n], t);
}
function Br(e, t) {
  switch (e.type) {
    case 1:
      Ns(e.cases, t), t.helper("plural");
      break;
    case 2:
      Ns(e.items, t);
      break;
    case 6:
      Br(e.key, t), t.helper("linked"), t.helper("type");
      break;
    case 5:
      t.helper("interpolate"), t.helper("list");
      break;
    case 4:
      t.helper("interpolate"), t.helper("named");
      break;
  }
}
function Ec(e, t = {}) {
  const n = bc(e);
  n.helper("normalize"), e.body && Br(e.body, n);
  const r = n.context();
  e.helpers = Array.from(r.helpers);
}
function Tc(e, t) {
  const { sourceMap: n, filename: r, breakLineCode: l, needIndent: s } = t, i = {
    source: e.loc.source,
    filename: r,
    code: "",
    column: 1,
    line: 1,
    offset: 0,
    map: void 0,
    breakLineCode: l,
    needIndent: s,
    indentLevel: 0
  }, c = () => i;
  function u(O, N) {
    i.code += O;
  }
  function d(O, N = !0) {
    const g = N ? l : "";
    u(s ? g + "  ".repeat(O) : g);
  }
  function _(O = !0) {
    const N = ++i.indentLevel;
    O && d(N);
  }
  function b(O = !0) {
    const N = --i.indentLevel;
    O && d(N);
  }
  function p() {
    d(i.indentLevel);
  }
  return {
    context: c,
    push: u,
    indent: _,
    deindent: b,
    newline: p,
    helper: (O) => `_${O}`,
    needIndent: () => i.needIndent
  };
}
function Lc(e, t) {
  const { helper: n } = e;
  e.push(`${n("linked")}(`), Vt(e, t.key), t.modifier ? (e.push(", "), Vt(e, t.modifier), e.push(", _type")) : e.push(", undefined, _type"), e.push(")");
}
function Ac(e, t) {
  const { helper: n, needIndent: r } = e;
  e.push(`${n("normalize")}([`), e.indent(r());
  const l = t.items.length;
  for (let s = 0; s < l && (Vt(e, t.items[s]), s !== l - 1); s++)
    e.push(", ");
  e.deindent(r()), e.push("])");
}
function Ic(e, t) {
  const { helper: n, needIndent: r } = e;
  if (t.cases.length > 1) {
    e.push(`${n("plural")}([`), e.indent(r());
    const l = t.cases.length;
    for (let s = 0; s < l && (Vt(e, t.cases[s]), s !== l - 1); s++)
      e.push(", ");
    e.deindent(r()), e.push("])");
  }
}
function Cc(e, t) {
  t.body ? Vt(e, t.body) : e.push("null");
}
function Vt(e, t) {
  const { helper: n } = e;
  switch (t.type) {
    case 0:
      Cc(e, t);
      break;
    case 1:
      Ic(e, t);
      break;
    case 2:
      Ac(e, t);
      break;
    case 6:
      Lc(e, t);
      break;
    case 8:
      e.push(JSON.stringify(t.value), t);
      break;
    case 7:
      e.push(JSON.stringify(t.value), t);
      break;
    case 5:
      e.push(`${n("interpolate")}(${n("list")}(${t.index}))`, t);
      break;
    case 4:
      e.push(`${n("interpolate")}(${n("named")}(${JSON.stringify(t.key)}))`, t);
      break;
    case 9:
      e.push(JSON.stringify(t.value), t);
      break;
    case 3:
      e.push(JSON.stringify(t.value), t);
      break;
  }
}
const yc = (e, t = {}) => {
  const n = w(t.mode) ? t.mode : "normal", r = w(t.filename) ? t.filename : "message.intl", l = !!t.sourceMap, s = t.breakLineCode != null ? t.breakLineCode : n === "arrow" ? ";" : `
`, i = t.needIndent ? t.needIndent : n !== "arrow", c = e.helpers || [], u = Tc(e, {
    mode: n,
    filename: r,
    sourceMap: l,
    breakLineCode: s,
    needIndent: i
  });
  u.push(n === "normal" ? "function __msg__ (ctx) {" : "(ctx) => {"), u.indent(i), c.length > 0 && (u.push(`const { ${c.map((b) => `${b}: _${b}`).join(", ")} } = ctx`), u.newline()), u.push("return "), Vt(u, e), u.deindent(i), u.push("}");
  const { code: d, map: _ } = u.context();
  return {
    ast: e,
    code: d,
    map: _ ? _.toJSON() : void 0
  };
};
function vc(e, t = {}) {
  const n = ge({}, t), l = pc(n).parse(e);
  return Ec(l, n), yc(l, n);
}
/*!
  * devtools-if v9.2.2
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const ta = {
  I18nInit: "i18n:init",
  FunctionTranslate: "function:translate"
};
/*!
  * core-base v9.2.2
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const Tt = [];
Tt[0] = {
  w: [0],
  i: [3, 0],
  ["["]: [4],
  o: [7]
};
Tt[1] = {
  w: [1],
  ["."]: [2],
  ["["]: [4],
  o: [7]
};
Tt[2] = {
  w: [2],
  i: [3, 0],
  [0]: [3, 0]
};
Tt[3] = {
  i: [3, 0],
  [0]: [3, 0],
  w: [1, 1],
  ["."]: [2, 1],
  ["["]: [4, 1],
  o: [7, 1]
};
Tt[4] = {
  ["'"]: [5, 0],
  ['"']: [6, 0],
  ["["]: [
    4,
    2
  ],
  ["]"]: [1, 3],
  o: 8,
  l: [4, 0]
};
Tt[5] = {
  ["'"]: [4, 0],
  o: 8,
  l: [5, 0]
};
Tt[6] = {
  ['"']: [4, 0],
  o: 8,
  l: [6, 0]
};
const Nc = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function Oc(e) {
  return Nc.test(e);
}
function Fc(e) {
  const t = e.charCodeAt(0), n = e.charCodeAt(e.length - 1);
  return t === n && (t === 34 || t === 39) ? e.slice(1, -1) : e;
}
function Rc(e) {
  if (e == null)
    return "o";
  switch (e.charCodeAt(0)) {
    case 91:
    case 93:
    case 46:
    case 34:
    case 39:
      return e;
    case 95:
    case 36:
    case 45:
      return "i";
    case 9:
    case 10:
    case 13:
    case 160:
    case 65279:
    case 8232:
    case 8233:
      return "w";
  }
  return "i";
}
function kc(e) {
  const t = e.trim();
  return e.charAt(0) === "0" && isNaN(parseInt(e)) ? !1 : Oc(t) ? Fc(t) : "*" + t;
}
function Pc(e) {
  const t = [];
  let n = -1, r = 0, l = 0, s, i, c, u, d, _, b;
  const p = [];
  p[0] = () => {
    i === void 0 ? i = c : i += c;
  }, p[1] = () => {
    i !== void 0 && (t.push(i), i = void 0);
  }, p[2] = () => {
    p[0](), l++;
  }, p[3] = () => {
    if (l > 0)
      l--, r = 4, p[0]();
    else {
      if (l = 0, i === void 0 || (i = kc(i), i === !1))
        return !1;
      p[1]();
    }
  };
  function C() {
    const k = e[n + 1];
    if (r === 5 && k === "'" || r === 6 && k === '"')
      return n++, c = "\\" + k, p[0](), !0;
  }
  for (; r !== null; )
    if (n++, s = e[n], !(s === "\\" && C())) {
      if (u = Rc(s), b = Tt[r], d = b[u] || b.l || 8, d === 8 || (r = d[0], d[1] !== void 0 && (_ = p[d[1]], _ && (c = s, _() === !1))))
        return;
      if (r === 7)
        return t;
    }
}
const Os = /* @__PURE__ */ new Map();
function wc(e, t) {
  return se(e) ? e[t] : null;
}
function Dc(e, t) {
  if (!se(e))
    return null;
  let n = Os.get(t);
  if (n || (n = Pc(t), n && Os.set(t, n)), !n)
    return null;
  const r = n.length;
  let l = e, s = 0;
  for (; s < r; ) {
    const i = l[n[s]];
    if (i === void 0)
      return null;
    l = i, s++;
  }
  return l;
}
const Mc = (e) => e, Sc = (e) => "", xc = "text", Wc = (e) => e.length === 0 ? "" : e.join(""), Uc = lc;
function Fs(e, t) {
  return e = Math.abs(e), t === 2 ? e ? e > 1 ? 1 : 0 : 1 : e ? Math.min(e, 2) : 0;
}
function Hc(e) {
  const t = fe(e.pluralIndex) ? e.pluralIndex : -1;
  return e.named && (fe(e.named.count) || fe(e.named.n)) ? fe(e.named.count) ? e.named.count : fe(e.named.n) ? e.named.n : t : t;
}
function Bc(e, t) {
  t.count || (t.count = e), t.n || (t.n = e);
}
function jc(e = {}) {
  const t = e.locale, n = Hc(e), r = se(e.pluralRules) && w(t) && ce(e.pluralRules[t]) ? e.pluralRules[t] : Fs, l = se(e.pluralRules) && w(t) && ce(e.pluralRules[t]) ? Fs : void 0, s = (g) => g[r(n, g.length, l)], i = e.list || [], c = (g) => i[g], u = e.named || {};
  fe(e.pluralIndex) && Bc(n, u);
  const d = (g) => u[g];
  function _(g) {
    const y = ce(e.messages) ? e.messages(g) : se(e.messages) ? e.messages[g] : !1;
    return y || (e.parent ? e.parent.message(g) : Sc);
  }
  const b = (g) => e.modifiers ? e.modifiers[g] : Mc, p = B(e.processor) && ce(e.processor.normalize) ? e.processor.normalize : Wc, C = B(e.processor) && ce(e.processor.interpolate) ? e.processor.interpolate : Uc, k = B(e.processor) && w(e.processor.type) ? e.processor.type : xc, N = {
    list: c,
    named: d,
    plural: s,
    linked: (g, ...y) => {
      const [F, L] = y;
      let A = "text", D = "";
      y.length === 1 ? se(F) ? (D = F.modifier || D, A = F.type || A) : w(F) && (D = F || D) : y.length === 2 && (w(F) && (D = F || D), w(L) && (A = L || A));
      let x = _(g)(N);
      return A === "vnode" && re(x) && D && (x = x[0]), D ? b(D)(x, A) : x;
    },
    message: _,
    type: k,
    interpolate: C,
    normalize: p
  };
  return N;
}
let sn = null;
function Vc(e) {
  sn = e;
}
function Kc(e, t, n) {
  sn && sn.emit(ta.I18nInit, {
    timestamp: Date.now(),
    i18n: e,
    version: t,
    meta: n
  });
}
const Xc = /* @__PURE__ */ Yc(ta.FunctionTranslate);
function Yc(e) {
  return (t) => sn && sn.emit(e, t);
}
const Gc = {
  NOT_FOUND_KEY: 1,
  FALLBACK_TO_TRANSLATE: 2,
  CANNOT_FORMAT_NUMBER: 3,
  FALLBACK_TO_NUMBER_FORMAT: 4,
  CANNOT_FORMAT_DATE: 5,
  FALLBACK_TO_DATE_FORMAT: 6,
  __EXTEND_POINT__: 7
};
function Jc(e, t, n) {
  return [.../* @__PURE__ */ new Set([
    n,
    ...re(t) ? t : se(t) ? Object.keys(t) : w(t) ? [t] : [n]
  ])];
}
function na(e, t, n) {
  const r = w(n) ? n : ln, l = e;
  l.__localeChainCache || (l.__localeChainCache = /* @__PURE__ */ new Map());
  let s = l.__localeChainCache.get(r);
  if (!s) {
    s = [];
    let i = [n];
    for (; re(i); )
      i = Rs(s, i, t);
    const c = re(t) || !B(t) ? t : t.default ? t.default : null;
    i = w(c) ? [c] : c, re(i) && Rs(s, i, !1), l.__localeChainCache.set(r, s);
  }
  return s;
}
function Rs(e, t, n) {
  let r = !0;
  for (let l = 0; l < t.length && Y(r); l++) {
    const s = t[l];
    w(s) && (r = qc(e, t[l], n));
  }
  return r;
}
function qc(e, t, n) {
  let r;
  const l = t.split("-");
  do {
    const s = l.join("-");
    r = Zc(e, s, n), l.splice(-1, 1);
  } while (l.length && r === !0);
  return r;
}
function Zc(e, t, n) {
  let r = !1;
  if (!e.includes(t) && (r = !0, t)) {
    r = t[t.length - 1] !== "!";
    const l = t.replace(/!/g, "");
    e.push(l), (re(n) || B(n)) && n[l] && (r = n[l]);
  }
  return r;
}
const Qc = "9.2.2", Wn = -1, ln = "en-US", ks = "", Ps = (e) => `${e.charAt(0).toLocaleUpperCase()}${e.substr(1)}`;
function $c() {
  return {
    upper: (e, t) => t === "text" && w(e) ? e.toUpperCase() : t === "vnode" && se(e) && "__v_isVNode" in e ? e.children.toUpperCase() : e,
    lower: (e, t) => t === "text" && w(e) ? e.toLowerCase() : t === "vnode" && se(e) && "__v_isVNode" in e ? e.children.toLowerCase() : e,
    capitalize: (e, t) => t === "text" && w(e) ? Ps(e) : t === "vnode" && se(e) && "__v_isVNode" in e ? Ps(e.children) : e
  };
}
let ra;
function zc(e) {
  ra = e;
}
let sa;
function eu(e) {
  sa = e;
}
let la;
function tu(e) {
  la = e;
}
let aa = null;
const ws = (e) => {
  aa = e;
}, nu = () => aa;
let oa = null;
const Ds = (e) => {
  oa = e;
}, ru = () => oa;
let Ms = 0;
function su(e = {}) {
  const t = w(e.version) ? e.version : Qc, n = w(e.locale) ? e.locale : ln, r = re(e.fallbackLocale) || B(e.fallbackLocale) || w(e.fallbackLocale) || e.fallbackLocale === !1 ? e.fallbackLocale : n, l = B(e.messages) ? e.messages : { [n]: {} }, s = B(e.datetimeFormats) ? e.datetimeFormats : { [n]: {} }, i = B(e.numberFormats) ? e.numberFormats : { [n]: {} }, c = ge({}, e.modifiers || {}, $c()), u = e.pluralRules || {}, d = ce(e.missing) ? e.missing : null, _ = Y(e.missingWarn) || bt(e.missingWarn) ? e.missingWarn : !0, b = Y(e.fallbackWarn) || bt(e.fallbackWarn) ? e.fallbackWarn : !0, p = !!e.fallbackFormat, C = !!e.unresolving, k = ce(e.postTranslation) ? e.postTranslation : null, O = B(e.processor) ? e.processor : null, N = Y(e.warnHtmlMessage) ? e.warnHtmlMessage : !0, g = !!e.escapeParameter, y = ce(e.messageCompiler) ? e.messageCompiler : ra, F = ce(e.messageResolver) ? e.messageResolver : sa || wc, L = ce(e.localeFallbacker) ? e.localeFallbacker : la || Jc, A = se(e.fallbackContext) ? e.fallbackContext : void 0, D = ce(e.onWarn) ? e.onWarn : rc, x = e, W = se(x.__datetimeFormatters) ? x.__datetimeFormatters : /* @__PURE__ */ new Map(), U = se(x.__numberFormatters) ? x.__numberFormatters : /* @__PURE__ */ new Map(), X = se(x.__meta) ? x.__meta : {};
  Ms++;
  const z = {
    version: t,
    cid: Ms,
    locale: n,
    fallbackLocale: r,
    messages: l,
    modifiers: c,
    pluralRules: u,
    missing: d,
    missingWarn: _,
    fallbackWarn: b,
    fallbackFormat: p,
    unresolving: C,
    postTranslation: k,
    processor: O,
    warnHtmlMessage: N,
    escapeParameter: g,
    messageCompiler: y,
    messageResolver: F,
    localeFallbacker: L,
    fallbackContext: A,
    onWarn: D,
    __meta: X
  };
  return z.datetimeFormats = s, z.numberFormats = i, z.__datetimeFormatters = W, z.__numberFormatters = U, __INTLIFY_PROD_DEVTOOLS__ && Kc(z, t, X), z;
}
function jr(e, t, n, r, l) {
  const { missing: s, onWarn: i } = e;
  if (s !== null) {
    const c = s(e, n, t, l);
    return w(c) ? c : t;
  } else
    return t;
}
function Jt(e, t, n) {
  const r = e;
  r.__localeChainCache = /* @__PURE__ */ new Map(), e.localeFallbacker(e, n, t);
}
const lu = (e) => e;
let Ss = /* @__PURE__ */ Object.create(null);
function au(e, t = {}) {
  {
    const r = (t.onCacheKey || lu)(e), l = Ss[r];
    if (l)
      return l;
    let s = !1;
    const i = t.onError || ac;
    t.onError = (d) => {
      s = !0, i(d);
    };
    const { code: c } = vc(e, t), u = new Function(`return ${c}`)();
    return s ? u : Ss[r] = u;
  }
}
let ia = Q.__EXTEND_POINT__;
const Yn = () => ++ia, wt = {
  INVALID_ARGUMENT: ia,
  INVALID_DATE_ARGUMENT: Yn(),
  INVALID_ISO_DATE_ARGUMENT: Yn(),
  __EXTEND_POINT__: Yn()
};
function Dt(e) {
  return xn(e, null, void 0);
}
const xs = () => "", $e = (e) => ce(e);
function Ws(e, ...t) {
  const { fallbackFormat: n, postTranslation: r, unresolving: l, messageCompiler: s, fallbackLocale: i, messages: c } = e, [u, d] = ur(...t), _ = Y(d.missingWarn) ? d.missingWarn : e.missingWarn, b = Y(d.fallbackWarn) ? d.fallbackWarn : e.fallbackWarn, p = Y(d.escapeParameter) ? d.escapeParameter : e.escapeParameter, C = !!d.resolvedMessage, k = w(d.default) || Y(d.default) ? Y(d.default) ? s ? u : () => u : d.default : n ? s ? u : () => u : "", O = n || k !== "", N = w(d.locale) ? d.locale : e.locale;
  p && ou(d);
  let [g, y, F] = C ? [
    u,
    N,
    c[N] || {}
  ] : ca(e, u, N, i, b, _), L = g, A = u;
  if (!C && !(w(L) || $e(L)) && O && (L = k, A = L), !C && (!(w(L) || $e(L)) || !w(y)))
    return l ? Wn : u;
  let D = !1;
  const x = () => {
    D = !0;
  }, W = $e(L) ? L : ua(e, u, y, L, A, x);
  if (D)
    return L;
  const U = uu(e, y, F, d), X = jc(U), z = iu(e, W, X), oe = r ? r(z, u) : z;
  if (__INTLIFY_PROD_DEVTOOLS__) {
    const ie = {
      timestamp: Date.now(),
      key: w(u) ? u : $e(L) ? L.key : "",
      locale: y || ($e(L) ? L.locale : ""),
      format: w(L) ? L : $e(L) ? L.source : "",
      message: oe
    };
    ie.meta = ge({}, e.__meta, nu() || {}), Xc(ie);
  }
  return oe;
}
function ou(e) {
  re(e.list) ? e.list = e.list.map((t) => w(t) ? ys(t) : t) : se(e.named) && Object.keys(e.named).forEach((t) => {
    w(e.named[t]) && (e.named[t] = ys(e.named[t]));
  });
}
function ca(e, t, n, r, l, s) {
  const { messages: i, onWarn: c, messageResolver: u, localeFallbacker: d } = e, _ = d(e, r, n);
  let b = {}, p, C = null;
  const k = "translate";
  for (let O = 0; O < _.length && (p = _[O], b = i[p] || {}, (C = u(b, t)) === null && (C = b[t]), !(w(C) || ce(C))); O++) {
    const N = jr(
      e,
      t,
      p,
      s,
      k
    );
    N !== t && (C = N);
  }
  return [C, p, b];
}
function ua(e, t, n, r, l, s) {
  const { messageCompiler: i, warnHtmlMessage: c } = e;
  if ($e(r)) {
    const d = r;
    return d.locale = d.locale || n, d.key = d.key || t, d;
  }
  if (i == null) {
    const d = () => r;
    return d.locale = n, d.key = t, d;
  }
  const u = i(r, cu(e, n, l, r, c, s));
  return u.locale = n, u.key = t, u.source = r, u;
}
function iu(e, t, n) {
  return t(n);
}
function ur(...e) {
  const [t, n, r] = e, l = {};
  if (!w(t) && !fe(t) && !$e(t))
    throw Dt(wt.INVALID_ARGUMENT);
  const s = fe(t) ? String(t) : ($e(t), t);
  return fe(n) ? l.plural = n : w(n) ? l.default = n : B(n) && !Sn(n) ? l.named = n : re(n) && (l.list = n), fe(r) ? l.plural = r : w(r) ? l.default = r : B(r) && ge(l, r), [s, l];
}
function cu(e, t, n, r, l, s) {
  return {
    warnHtmlMessage: l,
    onError: (i) => {
      throw s && s(i), i;
    },
    onCacheKey: (i) => ec(t, n, i)
  };
}
function uu(e, t, n, r) {
  const { modifiers: l, pluralRules: s, messageResolver: i, fallbackLocale: c, fallbackWarn: u, missingWarn: d, fallbackContext: _ } = e, p = {
    locale: t,
    modifiers: l,
    pluralRules: s,
    messages: (C) => {
      let k = i(n, C);
      if (k == null && _) {
        const [, , O] = ca(_, C, t, c, u, d);
        k = i(O, C);
      }
      if (w(k)) {
        let O = !1;
        const g = ua(e, C, t, k, C, () => {
          O = !0;
        });
        return O ? xs : g;
      } else
        return $e(k) ? k : xs;
    }
  };
  return e.processor && (p.processor = e.processor), r.list && (p.list = r.list), r.named && (p.named = r.named), fe(r.plural) && (p.pluralIndex = r.plural), p;
}
function Us(e, ...t) {
  const { datetimeFormats: n, unresolving: r, fallbackLocale: l, onWarn: s, localeFallbacker: i } = e, { __datetimeFormatters: c } = e, [u, d, _, b] = fr(...t), p = Y(_.missingWarn) ? _.missingWarn : e.missingWarn;
  Y(_.fallbackWarn) ? _.fallbackWarn : e.fallbackWarn;
  const C = !!_.part, k = w(_.locale) ? _.locale : e.locale, O = i(
    e,
    l,
    k
  );
  if (!w(u) || u === "")
    return new Intl.DateTimeFormat(k, b).format(d);
  let N = {}, g, y = null;
  const F = "datetime format";
  for (let D = 0; D < O.length && (g = O[D], N = n[g] || {}, y = N[u], !B(y)); D++)
    jr(e, u, g, p, F);
  if (!B(y) || !w(g))
    return r ? Wn : u;
  let L = `${g}__${u}`;
  Sn(b) || (L = `${L}__${JSON.stringify(b)}`);
  let A = c.get(L);
  return A || (A = new Intl.DateTimeFormat(g, ge({}, y, b)), c.set(L, A)), C ? A.formatToParts(d) : A.format(d);
}
const fa = [
  "localeMatcher",
  "weekday",
  "era",
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
  "timeZoneName",
  "formatMatcher",
  "hour12",
  "timeZone",
  "dateStyle",
  "timeStyle",
  "calendar",
  "dayPeriod",
  "numberingSystem",
  "hourCycle",
  "fractionalSecondDigits"
];
function fr(...e) {
  const [t, n, r, l] = e, s = {};
  let i = {}, c;
  if (w(t)) {
    const u = t.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);
    if (!u)
      throw Dt(wt.INVALID_ISO_DATE_ARGUMENT);
    const d = u[3] ? u[3].trim().startsWith("T") ? `${u[1].trim()}${u[3].trim()}` : `${u[1].trim()}T${u[3].trim()}` : u[1].trim();
    c = new Date(d);
    try {
      c.toISOString();
    } catch {
      throw Dt(wt.INVALID_ISO_DATE_ARGUMENT);
    }
  } else if (nc(t)) {
    if (isNaN(t.getTime()))
      throw Dt(wt.INVALID_DATE_ARGUMENT);
    c = t;
  } else if (fe(t))
    c = t;
  else
    throw Dt(wt.INVALID_ARGUMENT);
  return w(n) ? s.key = n : B(n) && Object.keys(n).forEach((u) => {
    fa.includes(u) ? i[u] = n[u] : s[u] = n[u];
  }), w(r) ? s.locale = r : B(r) && (i = r), B(l) && (i = l), [s.key || "", c, s, i];
}
function Hs(e, t, n) {
  const r = e;
  for (const l in n) {
    const s = `${t}__${l}`;
    !r.__datetimeFormatters.has(s) || r.__datetimeFormatters.delete(s);
  }
}
function Bs(e, ...t) {
  const { numberFormats: n, unresolving: r, fallbackLocale: l, onWarn: s, localeFallbacker: i } = e, { __numberFormatters: c } = e, [u, d, _, b] = dr(...t), p = Y(_.missingWarn) ? _.missingWarn : e.missingWarn;
  Y(_.fallbackWarn) ? _.fallbackWarn : e.fallbackWarn;
  const C = !!_.part, k = w(_.locale) ? _.locale : e.locale, O = i(
    e,
    l,
    k
  );
  if (!w(u) || u === "")
    return new Intl.NumberFormat(k, b).format(d);
  let N = {}, g, y = null;
  const F = "number format";
  for (let D = 0; D < O.length && (g = O[D], N = n[g] || {}, y = N[u], !B(y)); D++)
    jr(e, u, g, p, F);
  if (!B(y) || !w(g))
    return r ? Wn : u;
  let L = `${g}__${u}`;
  Sn(b) || (L = `${L}__${JSON.stringify(b)}`);
  let A = c.get(L);
  return A || (A = new Intl.NumberFormat(g, ge({}, y, b)), c.set(L, A)), C ? A.formatToParts(d) : A.format(d);
}
const da = [
  "localeMatcher",
  "style",
  "currency",
  "currencyDisplay",
  "currencySign",
  "useGrouping",
  "minimumIntegerDigits",
  "minimumFractionDigits",
  "maximumFractionDigits",
  "minimumSignificantDigits",
  "maximumSignificantDigits",
  "compactDisplay",
  "notation",
  "signDisplay",
  "unit",
  "unitDisplay",
  "roundingMode",
  "roundingPriority",
  "roundingIncrement",
  "trailingZeroDisplay"
];
function dr(...e) {
  const [t, n, r, l] = e, s = {};
  let i = {};
  if (!fe(t))
    throw Dt(wt.INVALID_ARGUMENT);
  const c = t;
  return w(n) ? s.key = n : B(n) && Object.keys(n).forEach((u) => {
    da.includes(u) ? i[u] = n[u] : s[u] = n[u];
  }), w(r) ? s.locale = r : B(r) && (i = r), B(l) && (i = l), [s.key || "", c, s, i];
}
function js(e, t, n) {
  const r = e;
  for (const l in n) {
    const s = `${t}__${l}`;
    !r.__numberFormatters.has(s) || r.__numberFormatters.delete(s);
  }
}
typeof __INTLIFY_PROD_DEVTOOLS__ != "boolean" && (Qt().__INTLIFY_PROD_DEVTOOLS__ = !1);
/*!
  * vue-i18n v9.2.2
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const fu = "9.2.2";
function du() {
  typeof __VUE_I18N_FULL_INSTALL__ != "boolean" && (Qt().__VUE_I18N_FULL_INSTALL__ = !0), typeof __VUE_I18N_LEGACY_API__ != "boolean" && (Qt().__VUE_I18N_LEGACY_API__ = !0), typeof __INTLIFY_PROD_DEVTOOLS__ != "boolean" && (Qt().__INTLIFY_PROD_DEVTOOLS__ = !1);
}
Gc.__EXTEND_POINT__;
let ma = Q.__EXTEND_POINT__;
const Ce = () => ++ma, ue = {
  UNEXPECTED_RETURN_TYPE: ma,
  INVALID_ARGUMENT: Ce(),
  MUST_BE_CALL_SETUP_TOP: Ce(),
  NOT_INSLALLED: Ce(),
  NOT_AVAILABLE_IN_LEGACY_MODE: Ce(),
  REQUIRED_VALUE: Ce(),
  INVALID_VALUE: Ce(),
  CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN: Ce(),
  NOT_INSLALLED_WITH_PROVIDE: Ce(),
  UNEXPECTED_ERROR: Ce(),
  NOT_COMPATIBLE_LEGACY_VUE_I18N: Ce(),
  BRIDGE_SUPPORT_VUE_2_ONLY: Ce(),
  MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION: Ce(),
  NOT_AVAILABLE_COMPOSITION_IN_LEGACY: Ce(),
  __EXTEND_POINT__: Ce()
};
function de(e, ...t) {
  return xn(e, null, void 0);
}
const mr = /* @__PURE__ */ Et("__transrateVNode"), gr = /* @__PURE__ */ Et("__datetimeParts"), _r = /* @__PURE__ */ Et("__numberParts"), ga = Et("__setPluralRules");
Et("__intlifyMeta");
const _a = /* @__PURE__ */ Et("__injectWithOption");
function hr(e) {
  if (!se(e))
    return e;
  for (const t in e)
    if (!!Ur(e, t))
      if (!t.includes("."))
        se(e[t]) && hr(e[t]);
      else {
        const n = t.split("."), r = n.length - 1;
        let l = e;
        for (let s = 0; s < r; s++)
          n[s] in l || (l[n[s]] = {}), l = l[n[s]];
        l[n[r]] = e[t], delete e[t], se(l[n[r]]) && hr(l[n[r]]);
      }
  return e;
}
function Un(e, t) {
  const { messages: n, __i18n: r, messageResolver: l, flatJson: s } = t, i = B(n) ? n : re(r) ? {} : { [e]: {} };
  if (re(r) && r.forEach((c) => {
    if ("locale" in c && "resource" in c) {
      const { locale: u, resource: d } = c;
      u ? (i[u] = i[u] || {}, $t(d, i[u])) : $t(d, i);
    } else
      w(c) && $t(JSON.parse(c), i);
  }), l == null && s)
    for (const c in i)
      Ur(i, c) && hr(i[c]);
  return i;
}
const dn = (e) => !se(e) || re(e);
function $t(e, t) {
  if (dn(e) || dn(t))
    throw de(ue.INVALID_VALUE);
  for (const n in e)
    Ur(e, n) && (dn(e[n]) || dn(t[n]) ? t[n] = e[n] : $t(e[n], t[n]));
}
function ha(e) {
  return e.type;
}
function pa(e, t, n) {
  let r = se(t.messages) ? t.messages : {};
  "__i18nGlobal" in n && (r = Un(e.locale.value, {
    messages: r,
    __i18n: n.__i18nGlobal
  }));
  const l = Object.keys(r);
  l.length && l.forEach((s) => {
    e.mergeLocaleMessage(s, r[s]);
  });
  {
    if (se(t.datetimeFormats)) {
      const s = Object.keys(t.datetimeFormats);
      s.length && s.forEach((i) => {
        e.mergeDateTimeFormat(i, t.datetimeFormats[i]);
      });
    }
    if (se(t.numberFormats)) {
      const s = Object.keys(t.numberFormats);
      s.length && s.forEach((i) => {
        e.mergeNumberFormat(i, t.numberFormats[i]);
      });
    }
  }
}
function Vs(e) {
  return ve(Dn, null, e, 0);
}
const Ks = "__INTLIFY_META__";
let Xs = 0;
function Ys(e) {
  return (t, n, r, l) => e(n, r, Bt() || void 0, l);
}
const mu = () => {
  const e = Bt();
  let t = null;
  return e && (t = ha(e)[Ks]) ? { [Ks]: t } : null;
};
function Vr(e = {}, t) {
  const { __root: n } = e, r = n === void 0;
  let l = Y(e.inheritLocale) ? e.inheritLocale : !0;
  const s = ze(
    n && l ? n.locale.value : w(e.locale) ? e.locale : ln
  ), i = ze(
    n && l ? n.fallbackLocale.value : w(e.fallbackLocale) || re(e.fallbackLocale) || B(e.fallbackLocale) || e.fallbackLocale === !1 ? e.fallbackLocale : s.value
  ), c = ze(Un(s.value, e)), u = ze(B(e.datetimeFormats) ? e.datetimeFormats : { [s.value]: {} }), d = ze(B(e.numberFormats) ? e.numberFormats : { [s.value]: {} });
  let _ = n ? n.missingWarn : Y(e.missingWarn) || bt(e.missingWarn) ? e.missingWarn : !0, b = n ? n.fallbackWarn : Y(e.fallbackWarn) || bt(e.fallbackWarn) ? e.fallbackWarn : !0, p = n ? n.fallbackRoot : Y(e.fallbackRoot) ? e.fallbackRoot : !0, C = !!e.fallbackFormat, k = ce(e.missing) ? e.missing : null, O = ce(e.missing) ? Ys(e.missing) : null, N = ce(e.postTranslation) ? e.postTranslation : null, g = n ? n.warnHtmlMessage : Y(e.warnHtmlMessage) ? e.warnHtmlMessage : !0, y = !!e.escapeParameter;
  const F = n ? n.modifiers : B(e.modifiers) ? e.modifiers : {};
  let L = e.pluralRules || n && n.pluralRules, A;
  A = (() => {
    r && Ds(null);
    const m = {
      version: fu,
      locale: s.value,
      fallbackLocale: i.value,
      messages: c.value,
      modifiers: F,
      pluralRules: L,
      missing: O === null ? void 0 : O,
      missingWarn: _,
      fallbackWarn: b,
      fallbackFormat: C,
      unresolving: !0,
      postTranslation: N === null ? void 0 : N,
      warnHtmlMessage: g,
      escapeParameter: y,
      messageResolver: e.messageResolver,
      __meta: { framework: "vue" }
    };
    m.datetimeFormats = u.value, m.numberFormats = d.value, m.__datetimeFormatters = B(A) ? A.__datetimeFormatters : void 0, m.__numberFormatters = B(A) ? A.__numberFormatters : void 0;
    const T = su(m);
    return r && Ds(T), T;
  })(), Jt(A, s.value, i.value);
  function x() {
    return [
      s.value,
      i.value,
      c.value,
      u.value,
      d.value
    ];
  }
  const W = He({
    get: () => s.value,
    set: (m) => {
      s.value = m, A.locale = s.value;
    }
  }), U = He({
    get: () => i.value,
    set: (m) => {
      i.value = m, A.fallbackLocale = i.value, Jt(A, s.value, m);
    }
  }), X = He(() => c.value), z = /* @__PURE__ */ He(() => u.value), oe = /* @__PURE__ */ He(() => d.value);
  function ie() {
    return ce(N) ? N : null;
  }
  function De(m) {
    N = m, A.postTranslation = m;
  }
  function nt() {
    return k;
  }
  function le(m) {
    m !== null && (O = Ys(m)), k = m, A.missing = O;
  }
  const G = (m, T, M, S, H, K) => {
    x();
    let J;
    if (__INTLIFY_PROD_DEVTOOLS__)
      try {
        ws(mu()), r || (A.fallbackContext = n ? ru() : void 0), J = m(A);
      } finally {
        ws(null), r || (A.fallbackContext = void 0);
      }
    else
      J = m(A);
    if (fe(J) && J === Wn) {
      const [ee, te] = T();
      return n && p ? S(n) : H(ee);
    } else {
      if (K(J))
        return J;
      throw de(ue.UNEXPECTED_RETURN_TYPE);
    }
  };
  function Z(...m) {
    return G((T) => Reflect.apply(Ws, null, [T, ...m]), () => ur(...m), "translate", (T) => Reflect.apply(T.t, T, [...m]), (T) => T, (T) => w(T));
  }
  function pe(...m) {
    const [T, M, S] = m;
    if (S && !se(S))
      throw de(ue.INVALID_ARGUMENT);
    return Z(T, M, ge({ resolvedMessage: !0 }, S || {}));
  }
  function rt(...m) {
    return G((T) => Reflect.apply(Us, null, [T, ...m]), () => fr(...m), "datetime format", (T) => Reflect.apply(T.d, T, [...m]), () => ks, (T) => w(T));
  }
  function Me(...m) {
    return G((T) => Reflect.apply(Bs, null, [T, ...m]), () => dr(...m), "number format", (T) => Reflect.apply(T.n, T, [...m]), () => ks, (T) => w(T));
  }
  function Re(m) {
    return m.map((T) => w(T) || fe(T) || Y(T) ? Vs(String(T)) : T);
  }
  const st = {
    normalize: Re,
    interpolate: (m) => m,
    type: "vnode"
  };
  function Lt(...m) {
    return G(
      (T) => {
        let M;
        const S = T;
        try {
          S.processor = st, M = Reflect.apply(Ws, null, [S, ...m]);
        } finally {
          S.processor = null;
        }
        return M;
      },
      () => ur(...m),
      "translate",
      (T) => T[mr](...m),
      (T) => [Vs(T)],
      (T) => re(T)
    );
  }
  function At(...m) {
    return G(
      (T) => Reflect.apply(Bs, null, [T, ...m]),
      () => dr(...m),
      "number format",
      (T) => T[_r](...m),
      () => [],
      (T) => w(T) || re(T)
    );
  }
  function Te(...m) {
    return G(
      (T) => Reflect.apply(Us, null, [T, ...m]),
      () => fr(...m),
      "datetime format",
      (T) => T[gr](...m),
      () => [],
      (T) => w(T) || re(T)
    );
  }
  function ke(m) {
    L = m, A.pluralRules = L;
  }
  function Xe(m, T) {
    const M = w(T) ? T : s.value, S = Ye(M);
    return A.messageResolver(S, m) !== null;
  }
  function Le(m) {
    let T = null;
    const M = na(A, i.value, s.value);
    for (let S = 0; S < M.length; S++) {
      const H = c.value[M[S]] || {}, K = A.messageResolver(H, m);
      if (K != null) {
        T = K;
        break;
      }
    }
    return T;
  }
  function Se(m) {
    const T = Le(m);
    return T != null ? T : n ? n.tm(m) || {} : {};
  }
  function Ye(m) {
    return c.value[m] || {};
  }
  function o(m, T) {
    c.value[m] = T, A.messages = c.value;
  }
  function a(m, T) {
    c.value[m] = c.value[m] || {}, $t(T, c.value[m]), A.messages = c.value;
  }
  function f(m) {
    return u.value[m] || {};
  }
  function h(m, T) {
    u.value[m] = T, A.datetimeFormats = u.value, Hs(A, m, T);
  }
  function E(m, T) {
    u.value[m] = ge(u.value[m] || {}, T), A.datetimeFormats = u.value, Hs(A, m, T);
  }
  function I(m) {
    return d.value[m] || {};
  }
  function P(m, T) {
    d.value[m] = T, A.numberFormats = d.value, js(A, m, T);
  }
  function R(m, T) {
    d.value[m] = ge(d.value[m] || {}, T), A.numberFormats = d.value, js(A, m, T);
  }
  Xs++, n && ir && (Ut(n.locale, (m) => {
    l && (s.value = m, A.locale = m, Jt(A, s.value, i.value));
  }), Ut(n.fallbackLocale, (m) => {
    l && (i.value = m, A.fallbackLocale = m, Jt(A, s.value, i.value));
  }));
  const v = {
    id: Xs,
    locale: W,
    fallbackLocale: U,
    get inheritLocale() {
      return l;
    },
    set inheritLocale(m) {
      l = m, m && n && (s.value = n.locale.value, i.value = n.fallbackLocale.value, Jt(A, s.value, i.value));
    },
    get availableLocales() {
      return Object.keys(c.value).sort();
    },
    messages: X,
    get modifiers() {
      return F;
    },
    get pluralRules() {
      return L || {};
    },
    get isGlobal() {
      return r;
    },
    get missingWarn() {
      return _;
    },
    set missingWarn(m) {
      _ = m, A.missingWarn = _;
    },
    get fallbackWarn() {
      return b;
    },
    set fallbackWarn(m) {
      b = m, A.fallbackWarn = b;
    },
    get fallbackRoot() {
      return p;
    },
    set fallbackRoot(m) {
      p = m;
    },
    get fallbackFormat() {
      return C;
    },
    set fallbackFormat(m) {
      C = m, A.fallbackFormat = C;
    },
    get warnHtmlMessage() {
      return g;
    },
    set warnHtmlMessage(m) {
      g = m, A.warnHtmlMessage = m;
    },
    get escapeParameter() {
      return y;
    },
    set escapeParameter(m) {
      y = m, A.escapeParameter = m;
    },
    t: Z,
    getLocaleMessage: Ye,
    setLocaleMessage: o,
    mergeLocaleMessage: a,
    getPostTranslationHandler: ie,
    setPostTranslationHandler: De,
    getMissingHandler: nt,
    setMissingHandler: le,
    [ga]: ke
  };
  return v.datetimeFormats = z, v.numberFormats = oe, v.rt = pe, v.te = Xe, v.tm = Se, v.d = rt, v.n = Me, v.getDateTimeFormat = f, v.setDateTimeFormat = h, v.mergeDateTimeFormat = E, v.getNumberFormat = I, v.setNumberFormat = P, v.mergeNumberFormat = R, v[_a] = e.__injectWithOption, v[mr] = Lt, v[gr] = Te, v[_r] = At, v;
}
function gu(e) {
  const t = w(e.locale) ? e.locale : ln, n = w(e.fallbackLocale) || re(e.fallbackLocale) || B(e.fallbackLocale) || e.fallbackLocale === !1 ? e.fallbackLocale : t, r = ce(e.missing) ? e.missing : void 0, l = Y(e.silentTranslationWarn) || bt(e.silentTranslationWarn) ? !e.silentTranslationWarn : !0, s = Y(e.silentFallbackWarn) || bt(e.silentFallbackWarn) ? !e.silentFallbackWarn : !0, i = Y(e.fallbackRoot) ? e.fallbackRoot : !0, c = !!e.formatFallbackMessages, u = B(e.modifiers) ? e.modifiers : {}, d = e.pluralizationRules, _ = ce(e.postTranslation) ? e.postTranslation : void 0, b = w(e.warnHtmlInMessage) ? e.warnHtmlInMessage !== "off" : !0, p = !!e.escapeParameterHtml, C = Y(e.sync) ? e.sync : !0;
  let k = e.messages;
  if (B(e.sharedMessages)) {
    const A = e.sharedMessages;
    k = Object.keys(A).reduce((x, W) => {
      const U = x[W] || (x[W] = {});
      return ge(U, A[W]), x;
    }, k || {});
  }
  const { __i18n: O, __root: N, __injectWithOption: g } = e, y = e.datetimeFormats, F = e.numberFormats, L = e.flatJson;
  return {
    locale: t,
    fallbackLocale: n,
    messages: k,
    flatJson: L,
    datetimeFormats: y,
    numberFormats: F,
    missing: r,
    missingWarn: l,
    fallbackWarn: s,
    fallbackRoot: i,
    fallbackFormat: c,
    modifiers: u,
    pluralRules: d,
    postTranslation: _,
    warnHtmlMessage: b,
    escapeParameter: p,
    messageResolver: e.messageResolver,
    inheritLocale: C,
    __i18n: O,
    __root: N,
    __injectWithOption: g
  };
}
function pr(e = {}, t) {
  {
    const n = Vr(gu(e)), r = {
      id: n.id,
      get locale() {
        return n.locale.value;
      },
      set locale(l) {
        n.locale.value = l;
      },
      get fallbackLocale() {
        return n.fallbackLocale.value;
      },
      set fallbackLocale(l) {
        n.fallbackLocale.value = l;
      },
      get messages() {
        return n.messages.value;
      },
      get datetimeFormats() {
        return n.datetimeFormats.value;
      },
      get numberFormats() {
        return n.numberFormats.value;
      },
      get availableLocales() {
        return n.availableLocales;
      },
      get formatter() {
        return {
          interpolate() {
            return [];
          }
        };
      },
      set formatter(l) {
      },
      get missing() {
        return n.getMissingHandler();
      },
      set missing(l) {
        n.setMissingHandler(l);
      },
      get silentTranslationWarn() {
        return Y(n.missingWarn) ? !n.missingWarn : n.missingWarn;
      },
      set silentTranslationWarn(l) {
        n.missingWarn = Y(l) ? !l : l;
      },
      get silentFallbackWarn() {
        return Y(n.fallbackWarn) ? !n.fallbackWarn : n.fallbackWarn;
      },
      set silentFallbackWarn(l) {
        n.fallbackWarn = Y(l) ? !l : l;
      },
      get modifiers() {
        return n.modifiers;
      },
      get formatFallbackMessages() {
        return n.fallbackFormat;
      },
      set formatFallbackMessages(l) {
        n.fallbackFormat = l;
      },
      get postTranslation() {
        return n.getPostTranslationHandler();
      },
      set postTranslation(l) {
        n.setPostTranslationHandler(l);
      },
      get sync() {
        return n.inheritLocale;
      },
      set sync(l) {
        n.inheritLocale = l;
      },
      get warnHtmlInMessage() {
        return n.warnHtmlMessage ? "warn" : "off";
      },
      set warnHtmlInMessage(l) {
        n.warnHtmlMessage = l !== "off";
      },
      get escapeParameterHtml() {
        return n.escapeParameter;
      },
      set escapeParameterHtml(l) {
        n.escapeParameter = l;
      },
      get preserveDirectiveContent() {
        return !0;
      },
      set preserveDirectiveContent(l) {
      },
      get pluralizationRules() {
        return n.pluralRules || {};
      },
      __composer: n,
      t(...l) {
        const [s, i, c] = l, u = {};
        let d = null, _ = null;
        if (!w(s))
          throw de(ue.INVALID_ARGUMENT);
        const b = s;
        return w(i) ? u.locale = i : re(i) ? d = i : B(i) && (_ = i), re(c) ? d = c : B(c) && (_ = c), Reflect.apply(n.t, n, [
          b,
          d || _ || {},
          u
        ]);
      },
      rt(...l) {
        return Reflect.apply(n.rt, n, [...l]);
      },
      tc(...l) {
        const [s, i, c] = l, u = { plural: 1 };
        let d = null, _ = null;
        if (!w(s))
          throw de(ue.INVALID_ARGUMENT);
        const b = s;
        return w(i) ? u.locale = i : fe(i) ? u.plural = i : re(i) ? d = i : B(i) && (_ = i), w(c) ? u.locale = c : re(c) ? d = c : B(c) && (_ = c), Reflect.apply(n.t, n, [
          b,
          d || _ || {},
          u
        ]);
      },
      te(l, s) {
        return n.te(l, s);
      },
      tm(l) {
        return n.tm(l);
      },
      getLocaleMessage(l) {
        return n.getLocaleMessage(l);
      },
      setLocaleMessage(l, s) {
        n.setLocaleMessage(l, s);
      },
      mergeLocaleMessage(l, s) {
        n.mergeLocaleMessage(l, s);
      },
      d(...l) {
        return Reflect.apply(n.d, n, [...l]);
      },
      getDateTimeFormat(l) {
        return n.getDateTimeFormat(l);
      },
      setDateTimeFormat(l, s) {
        n.setDateTimeFormat(l, s);
      },
      mergeDateTimeFormat(l, s) {
        n.mergeDateTimeFormat(l, s);
      },
      n(...l) {
        return Reflect.apply(n.n, n, [...l]);
      },
      getNumberFormat(l) {
        return n.getNumberFormat(l);
      },
      setNumberFormat(l, s) {
        n.setNumberFormat(l, s);
      },
      mergeNumberFormat(l, s) {
        n.mergeNumberFormat(l, s);
      },
      getChoiceIndex(l, s) {
        return -1;
      },
      __onComponentInstanceCreated(l) {
        const { componentInstanceCreatedListener: s } = e;
        s && s(l, r);
      }
    };
    return r;
  }
}
const Kr = {
  tag: {
    type: [String, Object]
  },
  locale: {
    type: String
  },
  scope: {
    type: String,
    validator: (e) => e === "parent" || e === "global",
    default: "parent"
  },
  i18n: {
    type: Object
  }
};
function _u({ slots: e }, t) {
  return t.length === 1 && t[0] === "default" ? (e.default ? e.default() : []).reduce((r, l) => r = [
    ...r,
    ...re(l.children) ? l.children : [l]
  ], []) : t.reduce((n, r) => {
    const l = e[r];
    return l && (n[r] = l()), n;
  }, {});
}
function ba(e) {
  return We;
}
const Gs = {
  name: "i18n-t",
  props: ge({
    keypath: {
      type: String,
      required: !0
    },
    plural: {
      type: [Number, String],
      validator: (e) => fe(e) || !isNaN(e)
    }
  }, Kr),
  setup(e, t) {
    const { slots: n, attrs: r } = t, l = e.i18n || Xr({
      useScope: e.scope,
      __useComponent: !0
    });
    return () => {
      const s = Object.keys(n).filter((b) => b !== "_"), i = {};
      e.locale && (i.locale = e.locale), e.plural !== void 0 && (i.plural = w(e.plural) ? +e.plural : e.plural);
      const c = _u(t, s), u = l[mr](e.keypath, c, i), d = ge({}, r), _ = w(e.tag) || se(e.tag) ? e.tag : ba();
      return $l(_, d, u);
    };
  }
};
function hu(e) {
  return re(e) && !w(e[0]);
}
function Ea(e, t, n, r) {
  const { slots: l, attrs: s } = t;
  return () => {
    const i = { part: !0 };
    let c = {};
    e.locale && (i.locale = e.locale), w(e.format) ? i.key = e.format : se(e.format) && (w(e.format.key) && (i.key = e.format.key), c = Object.keys(e.format).reduce((p, C) => n.includes(C) ? ge({}, p, { [C]: e.format[C] }) : p, {}));
    const u = r(e.value, i, c);
    let d = [i.key];
    re(u) ? d = u.map((p, C) => {
      const k = l[p.type], O = k ? k({ [p.type]: p.value, index: C, parts: u }) : [p.value];
      return hu(O) && (O[0].key = `${p.type}-${C}`), O;
    }) : w(u) && (d = [u]);
    const _ = ge({}, s), b = w(e.tag) || se(e.tag) ? e.tag : ba();
    return $l(b, _, d);
  };
}
const Js = {
  name: "i18n-n",
  props: ge({
    value: {
      type: Number,
      required: !0
    },
    format: {
      type: [String, Object]
    }
  }, Kr),
  setup(e, t) {
    const n = e.i18n || Xr({ useScope: "parent", __useComponent: !0 });
    return Ea(e, t, da, (...r) => n[_r](...r));
  }
}, qs = {
  name: "i18n-d",
  props: ge({
    value: {
      type: [Number, Date],
      required: !0
    },
    format: {
      type: [String, Object]
    }
  }, Kr),
  setup(e, t) {
    const n = e.i18n || Xr({ useScope: "parent", __useComponent: !0 });
    return Ea(e, t, fa, (...r) => n[gr](...r));
  }
};
function pu(e, t) {
  const n = e;
  if (e.mode === "composition")
    return n.__getInstance(t) || e.global;
  {
    const r = n.__getInstance(t);
    return r != null ? r.__composer : e.global.__composer;
  }
}
function bu(e) {
  const t = (i) => {
    const { instance: c, modifiers: u, value: d } = i;
    if (!c || !c.$)
      throw de(ue.UNEXPECTED_ERROR);
    const _ = pu(e, c.$), b = Zs(d);
    return [
      Reflect.apply(_.t, _, [...Qs(b)]),
      _
    ];
  };
  return {
    created: (i, c) => {
      const [u, d] = t(c);
      ir && e.global === d && (i.__i18nWatcher = Ut(d.locale, () => {
        c.instance && c.instance.$forceUpdate();
      })), i.__composer = d, i.textContent = u;
    },
    unmounted: (i) => {
      ir && i.__i18nWatcher && (i.__i18nWatcher(), i.__i18nWatcher = void 0, delete i.__i18nWatcher), i.__composer && (i.__composer = void 0, delete i.__composer);
    },
    beforeUpdate: (i, { value: c }) => {
      if (i.__composer) {
        const u = i.__composer, d = Zs(c);
        i.textContent = Reflect.apply(u.t, u, [
          ...Qs(d)
        ]);
      }
    },
    getSSRProps: (i) => {
      const [c] = t(i);
      return { textContent: c };
    }
  };
}
function Zs(e) {
  if (w(e))
    return { path: e };
  if (B(e)) {
    if (!("path" in e))
      throw de(ue.REQUIRED_VALUE, "path");
    return e;
  } else
    throw de(ue.INVALID_VALUE);
}
function Qs(e) {
  const { path: t, locale: n, args: r, choice: l, plural: s } = e, i = {}, c = r || {};
  return w(n) && (i.locale = n), fe(l) && (i.plural = l), fe(s) && (i.plural = s), [t, c, i];
}
function Eu(e, t, ...n) {
  const r = B(n[0]) ? n[0] : {}, l = !!r.useI18nComponentName;
  (Y(r.globalInstall) ? r.globalInstall : !0) && (e.component(l ? "i18n" : Gs.name, Gs), e.component(Js.name, Js), e.component(qs.name, qs)), e.directive("t", bu(t));
}
function Tu(e, t, n) {
  return {
    beforeCreate() {
      const r = Bt();
      if (!r)
        throw de(ue.UNEXPECTED_ERROR);
      const l = this.$options;
      if (l.i18n) {
        const s = l.i18n;
        l.__i18n && (s.__i18n = l.__i18n), s.__root = t, this === this.$root ? this.$i18n = $s(e, s) : (s.__injectWithOption = !0, this.$i18n = pr(s));
      } else
        l.__i18n ? this === this.$root ? this.$i18n = $s(e, l) : this.$i18n = pr({
          __i18n: l.__i18n,
          __injectWithOption: !0,
          __root: t
        }) : this.$i18n = e;
      l.__i18nGlobal && pa(t, l, l), e.__onComponentInstanceCreated(this.$i18n), n.__setInstance(r, this.$i18n), this.$t = (...s) => this.$i18n.t(...s), this.$rt = (...s) => this.$i18n.rt(...s), this.$tc = (...s) => this.$i18n.tc(...s), this.$te = (s, i) => this.$i18n.te(s, i), this.$d = (...s) => this.$i18n.d(...s), this.$n = (...s) => this.$i18n.n(...s), this.$tm = (s) => this.$i18n.tm(s);
    },
    mounted() {
    },
    unmounted() {
      const r = Bt();
      if (!r)
        throw de(ue.UNEXPECTED_ERROR);
      delete this.$t, delete this.$rt, delete this.$tc, delete this.$te, delete this.$d, delete this.$n, delete this.$tm, n.__deleteInstance(r), delete this.$i18n;
    }
  };
}
function $s(e, t) {
  e.locale = t.locale || e.locale, e.fallbackLocale = t.fallbackLocale || e.fallbackLocale, e.missing = t.missing || e.missing, e.silentTranslationWarn = t.silentTranslationWarn || e.silentFallbackWarn, e.silentFallbackWarn = t.silentFallbackWarn || e.silentFallbackWarn, e.formatFallbackMessages = t.formatFallbackMessages || e.formatFallbackMessages, e.postTranslation = t.postTranslation || e.postTranslation, e.warnHtmlInMessage = t.warnHtmlInMessage || e.warnHtmlInMessage, e.escapeParameterHtml = t.escapeParameterHtml || e.escapeParameterHtml, e.sync = t.sync || e.sync, e.__composer[ga](t.pluralizationRules || e.pluralizationRules);
  const n = Un(e.locale, {
    messages: t.messages,
    __i18n: t.__i18n
  });
  return Object.keys(n).forEach((r) => e.mergeLocaleMessage(r, n[r])), t.datetimeFormats && Object.keys(t.datetimeFormats).forEach((r) => e.mergeDateTimeFormat(r, t.datetimeFormats[r])), t.numberFormats && Object.keys(t.numberFormats).forEach((r) => e.mergeNumberFormat(r, t.numberFormats[r])), e;
}
const Lu = /* @__PURE__ */ Et("global-vue-i18n");
function Au(e = {}, t) {
  const n = __VUE_I18N_LEGACY_API__ && Y(e.legacy) ? e.legacy : __VUE_I18N_LEGACY_API__, r = Y(e.globalInjection) ? e.globalInjection : !0, l = __VUE_I18N_LEGACY_API__ && n ? !!e.allowComposition : !0, s = /* @__PURE__ */ new Map(), [i, c] = Iu(e, n), u = Et("");
  function d(p) {
    return s.get(p) || null;
  }
  function _(p, C) {
    s.set(p, C);
  }
  function b(p) {
    s.delete(p);
  }
  {
    const p = {
      get mode() {
        return __VUE_I18N_LEGACY_API__ && n ? "legacy" : "composition";
      },
      get allowComposition() {
        return l;
      },
      async install(C, ...k) {
        C.__VUE_I18N_SYMBOL__ = u, C.provide(C.__VUE_I18N_SYMBOL__, p), !n && r && Pu(C, p.global), __VUE_I18N_FULL_INSTALL__ && Eu(C, p, ...k), __VUE_I18N_LEGACY_API__ && n && C.mixin(Tu(c, c.__composer, p));
        const O = C.unmount;
        C.unmount = () => {
          p.dispose(), O();
        };
      },
      get global() {
        return c;
      },
      dispose() {
        i.stop();
      },
      __instances: s,
      __getInstance: d,
      __setInstance: _,
      __deleteInstance: b
    };
    return p;
  }
}
function Xr(e = {}) {
  const t = Bt();
  if (t == null)
    throw de(ue.MUST_BE_CALL_SETUP_TOP);
  if (!t.isCE && t.appContext.app != null && !t.appContext.app.__VUE_I18N_SYMBOL__)
    throw de(ue.NOT_INSLALLED);
  const n = Cu(t), r = vu(n), l = ha(t), s = yu(e, l);
  if (__VUE_I18N_LEGACY_API__ && n.mode === "legacy" && !e.__useComponent) {
    if (!n.allowComposition)
      throw de(ue.NOT_AVAILABLE_IN_LEGACY_MODE);
    return Fu(t, s, r, e);
  }
  if (s === "global")
    return pa(r, e, l), r;
  if (s === "parent") {
    let u = Nu(n, t, e.__useComponent);
    return u == null && (u = r), u;
  }
  const i = n;
  let c = i.__getInstance(t);
  if (c == null) {
    const u = ge({}, e);
    "__i18n" in l && (u.__i18n = l.__i18n), r && (u.__root = r), c = Vr(u), Ou(i, t), i.__setInstance(t, c);
  }
  return c;
}
function Iu(e, t, n) {
  const r = Sa();
  {
    const l = __VUE_I18N_LEGACY_API__ && t ? r.run(() => pr(e)) : r.run(() => Vr(e));
    if (l == null)
      throw de(ue.UNEXPECTED_ERROR);
    return [r, l];
  }
}
function Cu(e) {
  {
    const t = gn(e.isCE ? Lu : e.appContext.app.__VUE_I18N_SYMBOL__);
    if (!t)
      throw de(e.isCE ? ue.NOT_INSLALLED_WITH_PROVIDE : ue.UNEXPECTED_ERROR);
    return t;
  }
}
function yu(e, t) {
  return Sn(e) ? "__i18n" in t ? "local" : "global" : e.useScope ? e.useScope : "local";
}
function vu(e) {
  return e.mode === "composition" ? e.global : e.global.__composer;
}
function Nu(e, t, n = !1) {
  let r = null;
  const l = t.root;
  let s = t.parent;
  for (; s != null; ) {
    const i = e;
    if (e.mode === "composition")
      r = i.__getInstance(s);
    else if (__VUE_I18N_LEGACY_API__) {
      const c = i.__getInstance(s);
      c != null && (r = c.__composer, n && r && !r[_a] && (r = null));
    }
    if (r != null || l === s)
      break;
    s = s.parent;
  }
  return r;
}
function Ou(e, t, n) {
  wn(() => {
  }, t), Mr(() => {
    e.__deleteInstance(t);
  }, t);
}
function Fu(e, t, n, r = {}) {
  const l = t === "local", s = uo(null);
  if (l && e.proxy && !(e.proxy.$options.i18n || e.proxy.$options.__i18n))
    throw de(ue.MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION);
  const i = Y(r.inheritLocale) ? r.inheritLocale : !0, c = ze(
    l && i ? n.locale.value : w(r.locale) ? r.locale : ln
  ), u = ze(
    l && i ? n.fallbackLocale.value : w(r.fallbackLocale) || re(r.fallbackLocale) || B(r.fallbackLocale) || r.fallbackLocale === !1 ? r.fallbackLocale : c.value
  ), d = ze(Un(c.value, r)), _ = ze(B(r.datetimeFormats) ? r.datetimeFormats : { [c.value]: {} }), b = ze(B(r.numberFormats) ? r.numberFormats : { [c.value]: {} }), p = l ? n.missingWarn : Y(r.missingWarn) || bt(r.missingWarn) ? r.missingWarn : !0, C = l ? n.fallbackWarn : Y(r.fallbackWarn) || bt(r.fallbackWarn) ? r.fallbackWarn : !0, k = l ? n.fallbackRoot : Y(r.fallbackRoot) ? r.fallbackRoot : !0, O = !!r.fallbackFormat, N = ce(r.missing) ? r.missing : null, g = ce(r.postTranslation) ? r.postTranslation : null, y = l ? n.warnHtmlMessage : Y(r.warnHtmlMessage) ? r.warnHtmlMessage : !0, F = !!r.escapeParameter, L = l ? n.modifiers : B(r.modifiers) ? r.modifiers : {}, A = r.pluralRules || l && n.pluralRules;
  function D() {
    return [
      c.value,
      u.value,
      d.value,
      _.value,
      b.value
    ];
  }
  const x = He({
    get: () => s.value ? s.value.locale.value : c.value,
    set: (a) => {
      s.value && (s.value.locale.value = a), c.value = a;
    }
  }), W = He({
    get: () => s.value ? s.value.fallbackLocale.value : u.value,
    set: (a) => {
      s.value && (s.value.fallbackLocale.value = a), u.value = a;
    }
  }), U = He(() => s.value ? s.value.messages.value : d.value), X = He(() => _.value), z = He(() => b.value);
  function oe() {
    return s.value ? s.value.getPostTranslationHandler() : g;
  }
  function ie(a) {
    s.value && s.value.setPostTranslationHandler(a);
  }
  function De() {
    return s.value ? s.value.getMissingHandler() : N;
  }
  function nt(a) {
    s.value && s.value.setMissingHandler(a);
  }
  function le(a) {
    return D(), a();
  }
  function G(...a) {
    return s.value ? le(() => Reflect.apply(s.value.t, null, [...a])) : le(() => "");
  }
  function Z(...a) {
    return s.value ? Reflect.apply(s.value.rt, null, [...a]) : "";
  }
  function pe(...a) {
    return s.value ? le(() => Reflect.apply(s.value.d, null, [...a])) : le(() => "");
  }
  function rt(...a) {
    return s.value ? le(() => Reflect.apply(s.value.n, null, [...a])) : le(() => "");
  }
  function Me(a) {
    return s.value ? s.value.tm(a) : {};
  }
  function Re(a, f) {
    return s.value ? s.value.te(a, f) : !1;
  }
  function Ne(a) {
    return s.value ? s.value.getLocaleMessage(a) : {};
  }
  function st(a, f) {
    s.value && (s.value.setLocaleMessage(a, f), d.value[a] = f);
  }
  function Lt(a, f) {
    s.value && s.value.mergeLocaleMessage(a, f);
  }
  function At(a) {
    return s.value ? s.value.getDateTimeFormat(a) : {};
  }
  function Te(a, f) {
    s.value && (s.value.setDateTimeFormat(a, f), _.value[a] = f);
  }
  function ke(a, f) {
    s.value && s.value.mergeDateTimeFormat(a, f);
  }
  function Xe(a) {
    return s.value ? s.value.getNumberFormat(a) : {};
  }
  function Le(a, f) {
    s.value && (s.value.setNumberFormat(a, f), b.value[a] = f);
  }
  function Se(a, f) {
    s.value && s.value.mergeNumberFormat(a, f);
  }
  const Ye = {
    get id() {
      return s.value ? s.value.id : -1;
    },
    locale: x,
    fallbackLocale: W,
    messages: U,
    datetimeFormats: X,
    numberFormats: z,
    get inheritLocale() {
      return s.value ? s.value.inheritLocale : i;
    },
    set inheritLocale(a) {
      s.value && (s.value.inheritLocale = a);
    },
    get availableLocales() {
      return s.value ? s.value.availableLocales : Object.keys(d.value);
    },
    get modifiers() {
      return s.value ? s.value.modifiers : L;
    },
    get pluralRules() {
      return s.value ? s.value.pluralRules : A;
    },
    get isGlobal() {
      return s.value ? s.value.isGlobal : !1;
    },
    get missingWarn() {
      return s.value ? s.value.missingWarn : p;
    },
    set missingWarn(a) {
      s.value && (s.value.missingWarn = a);
    },
    get fallbackWarn() {
      return s.value ? s.value.fallbackWarn : C;
    },
    set fallbackWarn(a) {
      s.value && (s.value.missingWarn = a);
    },
    get fallbackRoot() {
      return s.value ? s.value.fallbackRoot : k;
    },
    set fallbackRoot(a) {
      s.value && (s.value.fallbackRoot = a);
    },
    get fallbackFormat() {
      return s.value ? s.value.fallbackFormat : O;
    },
    set fallbackFormat(a) {
      s.value && (s.value.fallbackFormat = a);
    },
    get warnHtmlMessage() {
      return s.value ? s.value.warnHtmlMessage : y;
    },
    set warnHtmlMessage(a) {
      s.value && (s.value.warnHtmlMessage = a);
    },
    get escapeParameter() {
      return s.value ? s.value.escapeParameter : F;
    },
    set escapeParameter(a) {
      s.value && (s.value.escapeParameter = a);
    },
    t: G,
    getPostTranslationHandler: oe,
    setPostTranslationHandler: ie,
    getMissingHandler: De,
    setMissingHandler: nt,
    rt: Z,
    d: pe,
    n: rt,
    tm: Me,
    te: Re,
    getLocaleMessage: Ne,
    setLocaleMessage: st,
    mergeLocaleMessage: Lt,
    getDateTimeFormat: At,
    setDateTimeFormat: Te,
    mergeDateTimeFormat: ke,
    getNumberFormat: Xe,
    setNumberFormat: Le,
    mergeNumberFormat: Se
  };
  function o(a) {
    a.locale.value = c.value, a.fallbackLocale.value = u.value, Object.keys(d.value).forEach((f) => {
      a.mergeLocaleMessage(f, d.value[f]);
    }), Object.keys(_.value).forEach((f) => {
      a.mergeDateTimeFormat(f, _.value[f]);
    }), Object.keys(b.value).forEach((f) => {
      a.mergeNumberFormat(f, b.value[f]);
    }), a.escapeParameter = F, a.fallbackFormat = O, a.fallbackRoot = k, a.fallbackWarn = C, a.missingWarn = p, a.warnHtmlMessage = y;
  }
  return Dl(() => {
    if (e.proxy == null || e.proxy.$i18n == null)
      throw de(ue.NOT_AVAILABLE_COMPOSITION_IN_LEGACY);
    const a = s.value = e.proxy.$i18n.__composer;
    t === "global" ? (c.value = a.locale.value, u.value = a.fallbackLocale.value, d.value = a.messages.value, _.value = a.datetimeFormats.value, b.value = a.numberFormats.value) : l && o(a);
  }), Ye;
}
const Ru = [
  "locale",
  "fallbackLocale",
  "availableLocales"
], ku = ["t", "rt", "d", "n", "tm"];
function Pu(e, t) {
  const n = /* @__PURE__ */ Object.create(null);
  Ru.forEach((r) => {
    const l = Object.getOwnPropertyDescriptor(t, r);
    if (!l)
      throw de(ue.UNEXPECTED_ERROR);
    const s = _e(l.value) ? {
      get() {
        return l.value.value;
      },
      set(i) {
        l.value.value = i;
      }
    } : {
      get() {
        return l.get && l.get();
      }
    };
    Object.defineProperty(n, r, s);
  }), e.config.globalProperties.$i18n = n, ku.forEach((r) => {
    const l = Object.getOwnPropertyDescriptor(t, r);
    if (!l || !l.value)
      throw de(ue.UNEXPECTED_ERROR);
    Object.defineProperty(e.config.globalProperties, `$${r}`, l);
  });
}
zc(au);
eu(Dc);
tu(na);
du();
if (__INTLIFY_PROD_DEVTOOLS__) {
  const e = Qt();
  e.__INTLIFY__ = !0, Vc(e.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__);
}
/**
 * 2007-2020 PrestaShop and Contributors
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License 3.0 (AFL-3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2020 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
 * International Registered Trademark & Property of PrestaShop SA
 */
const { storePsAccounts: ot } = window, Ta = ot.context.i18n.isoCode ? ot.context.i18n.isoCode : "", wu = Object.assign(
  ot.context.app === "settings" && ot.settings.translations ? ot.settings.translations : {},
  {
    ...ot.context.app === "dashboard" && ot.dashboard.translations ? ot.dashboard.translations : {}
  }
), La = {};
La[Ta] = {
  currency: {
    style: "currency",
    currency: ot.context.i18n.currencyIsoCode
  }
};
const Du = Au({
  locale: Ta,
  numberFormats: La,
  messages: wu
});
const Mu = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAWqADAAQAAAABAAAAWgAAAABJfIu3AAAbqUlEQVR4Ae1dB3xUVdY/b/qk94QSUoaSBAIEEJBeRFEBlVUESwQXdV3dprvrquuKrqtbcO27H6wKWFBBkJJgQTGE0EkIJZXMZNJ7m5Tp875z32Qm097Me5ME2O/33d8vvFvOOfe+/zvv3HPPvW+g4DpLu2haqFfWJpkNhgkUBRMsAKMEQAfTQAXjUPGPDqBpSovXbgqoHhBAN+YbKBCWWSgoSx+fqJxBUcbr7LaAutYD2qVUhvYZqYW0hV6Co1lE0XQqDSDxd1x4QybkvQJAHaUF1JFAoTxnzbgRLf7KGyq+awL0RxUVMbSJWmexwDrU2hk0avFQ3ZCrHIrCRwdwEW/0C6lY9sm6saNqXGmuRvmqAU1Mgras8i4E9SGg6eV486KrcYNOfVAUWiLIoWhqR0Bq0udrKMrg1D6MhWEH+hxNiy+XVWaCxfIHBHfsMN4LL9H4JtWhrd8cFSbfunLkyD5ezH4QDxvQRIN7y1SPgIV+DscV78fYrg4LBS0I+uaACYo3h1PDhwXoj8orZ5nN5n8BDdOuDlqD7wVtebmQpp58MC358OCluUsYUqC3VVaGUTrz33DGfwRt8ZDKdh/68NTgoHcJQfTrB9MSG4ayhyEDY0eZaia6aF8gwIlDOcBrIouYExA8sD41+buh6n9IgN5erPwNDTRqMoiHamDXWo7VLaRfC0xR/Altt3mw4xkU0GgqZJTO8glq8U8GO5DrlR8nyhxaJrxrQ1JS52DG6DfQxB6D1nIAl7/zBzOA/wpeiroko8TL16WMqfd3vH4B/XGxeoSJMn+LC490fzv+b+NDU6JGsG55KFVR7s/YeQO9U6WKNegsx3HxofCnQz48Rq0WuluaoKe9DYy6PvzTAwabQCyTgTQoCKSBwSAJDARZUDAEhIXzEe0XLYLdLJbAvPsVCoyl8Eu8gP7kSluIydh5FCe+qfy64Ubd3doCzVfKoEVZDi1qFei7NdwYkUoWHALRyWMhKmkscw2JjePMy4cQwa4U0sK5fN0/zkAfukJLm03KbzBCs4jPwHzR6nt7oKYwH9T5Z6GzrtoXOed2ouHJs+dB0swbUfODOPNxIUSwLwZIYMEahaKLCz2h4Qz0thLlp2iT7+Mq2BddX2cHlOV8D5VnT4LFRCKbw5MEQhHET5kGirkLIGL0mCHrBGPhPzyUmnwzgk4CVT4TJ6C3l1Q8ipq8xac0DgRGnQ6KvssG1ak8sJgH7Z5y6HGAJH7qdJi64i6QopkZkkRRL21IVWziIssn0DtKVZPRTz6NfzIuAr3R1FwogMKDe3nZXm/y/GkjE+mk5avQrMwF1EZ/RAzwoDYLKXpZZsrYIwOVnnNeezpYXx/Q2qUtQJMxwTM7t1oaI/yFWV+B8vhRbgxXgSpiTCLMvn/DoL0VNCGNAgk9JXPs2GZvwxZ4a2zVaP80WJAN2j449uG/ryuQyT23V6vhh3dfh47awW24oAcWRxtgszccSRurRn9Urk41m0wXkMbv+AXxgU9s3wrEbbtekwgd4xvWPgijJk0Z1BApkWDh+vHJuWxCWDXaYja9h0x+g9yqqoAjqDHXM8gEFJPRACc//gCUJ4+xYcSt3mT51480zbo95xHo7SXKn6CXsZhbD+5UvW2tcOLj93Elp3NvvE5rCvd/CXVFF/0eHa6UJ1aVKX/OJsAj0Lgz8kc2Bl/1Jr0O8tBcGPqGfRvO11B4taNXBWc+2wHtNVW8+JyIafg9buF5PCrhBvSOEuUKf5fYZLCnd26H7uZGp/45FwQCEAaHgkkaCF0GCzR19UJ1Qws0tGugXWsEoyQABMFhQIn8tmheh2I2GuHEjq3Q19HulY6tEW9/VF+pcr2ndrfJEBcnJ5FhtidiX3UXs/dDee4Pvsjc2oXyQOgzmqGisBAMOjyE5COJJBJITJsE4WFBYOrBg0qDSMSXFgSFgsFoAoFQCEKTDsJi4mDxE0/552dToEpMUUxYTFFOy10n472jRH2jhTb5BXJjWQlvkAUCIeiEYijOO45eJFo5jsmEEbyKwgKGOnnyFIgIDgAzmiy+SSSTQ1V1HTSftcoi/PLgYJg0Q8ZMjmPnLOArEsPzkFxVqroDGfc4MjuZDpo2Zzo2cs2TWMX5/bu5kjN0IgxxKtU1UHTyJC+QXTtRXbwAxZeK0OSEuTZ5LQslUigrvQLN1c42WdvdDeeO5kLxsaOg1XCOGbn0RbvhaAe634jf68LBqViacxiIp8E1EVAunj0Hnc1NXFm80vVpNJCfkwMUmgCuqaWrBzQs/j1ZyV4+fRouZO/jKs6JDl/OW3eW1Uc5VtpNh65URSZB3tFzEpwvz/3RUabXvBDBKMzLQ/+V/cBnWEwsxMXHw4jRoyEkLBSkaJNx8QR9Wh309PRAc309NNXWOj0oYnoKEOxpixYB3eNdE8mEW3Uuxz7OsOgYmD7nRoiJiYbaunq4UlwMjWo1lBWch/FzFwJZrvNMYr1Ftw553rHx2YE20/QaWyWfa8WJXCAuHZckkMqg9MJFN5CJXZwyZw7MvuEGUIwaAXKpRw/JqQtpaDjIaRP8eDYfco/mQfG5s8zDuHj8OGTMnYOTJPumQW2VddktFIlg3caN8Pjau9wmvr0/HIP3/2crXDmZB7P4Aw14tJLgaQea8TpQG6jtpcomNOTRTnfjo0Bsc/Zf/gT6vh4flNbmDp0J1Jcv2WnTZs6EefPnQ0bKOBDjjM8nEaAVUQPhztbObvjq8BHYt/tLDCwIIDF+JE5MFjeRQtz2OpeTC0SL//zKizAd+2ZLanQrP/xsF9x430PMDg4bHUu9URgRFJ4ZF9dL2hmgPylRphtpmveyqO7yBWb5ytKRUzWxy+d+tJqYhNQ0uGfN3ZCSEO9Ew6fQbqJh3oRENxYTxrg/yz4M5y+XgL7N3Z83oo9eln8O3nr3TZg6LtmN37GC9KFWqqCooxdGz5jl2MQpL6SEyzNTk74lxIzpMFOwBLWZd6oqOMuZp1pVCQEhobD24Q0wZ/JEznxshG1N9VAdHQ5jIpwnQBG+GQ+uWg6rlsyEj3fthpIilZOI9uZmeOrZZ3yCbGOSoXlJjQwhnxXwThbasgSZGKAZr8NCwwK+UshudGNZMSc2YWAIBOCu9YsvvTgkIBtw4tN3dUBlg7vG2gYUKJXDCxkVsHZZEoilUqaawoeQlJwMdyyaayPjdA0QUCAy6jnROhFRtB1XRqPRfqTxVejWygrOe30p6ekwf2o6CHGJPRSpvc86+bY1NmAox/OehBD3CklaFauE9JWRsPlYCPTpLfCrjZmch6A3DWy1SXS9YBJbHxhnAYirjVbwI4b2cDJU2Cq4XpuU3I42zF62HBZNmzJkIJPxdaM2k2Tq64U6DdtEPPBQk2Rt8NqSLlixdD6MjnFybxk5bP+0tLXhLMZMYyDmEBpwlYMvXgie6Ioj9YJ6lSoJr7yjNO1Vla5y3crzlt8O031MOG5MPioYs9E5EPRR1Xs2HzTl/I6GCHUwu7kEWr/lpiBkGC2N9dDTr9VSP4AmMrBb5pUTmAzWDKnkk7pbvG6RwfTFS2FKcgIfkZxoO3DR4phaG9B8eEoWg1ttXHwFUG/9CM37StzaXCvMeLy7vbERegxW20xZTCDETQK+yQJmK9A0RcXyZSb7gOTgC1tSTMmA2amMfDYSv+u7uzqBxoWPViAGo1gOJm0vNHUzrqqTTLPZHRShAEOt00JBsvkwNO+97ETvWujCaB5Zimsd4uoCP45HoPlg8BXg4XH8SJJf6u1A28WSwkaMhJtu5O9zsohzqtYYjJCbmwddnX3wxMbHYDG+Nbu/3A8V9e5vl9ngeRkeMMH6ACT/PALNB9g1ux2X+jR6LvregYcoQK3mmwQYQSc8ODXzB9qk9+zqkHjusqVLQDRU3gWaiaa2DmhGM9XRUA9V9U1w6cRxePuNtyAyKABunJQGaemTYdPTv4Xdez6HMOnAVEPrB+y4IzgB8Wh3Qc5USf7xPbQGSiBqqbsvUIyRvYwb5kA9ngEk8BIfxi+N7scXPUSK98E0E57q9JSmzlsAMSEDy2JPNN7q2nq1UFTbAEcLCmFv9iE4nJ0FF08dh0b0cCg0FwRkkgovFzHXbr0Bzp88Ab0Y2tyb9S1TZ/tHYPAMdEG3CTqD+z0SfK+Fr3wDHWfrbGz26+cfbIPJKRMgA13TAlxlkuSPRuPau1+jKUqGAWF7B1wyZpN75G1EYiIsW7IU3TirO8RFjgVXSiUVFXClvIzRWKOXmd1ktthFbsTl+8wFC6C8qAg6iQuGqeDsWXjwgXV2GhHtWRn25vfBnWFhENa/1KNwZ8f8fBZottwHAakjGH4D2mJ1xRXY+PDD0FJXC/ET0yEyLASS4uJhwJDYu/KVkRICEQ0W9lmNRYQEt55c01O/exZS40e5Vvssz8uYCsSTUNc3QGlZKRSeOYUhUGt0zZGZmCXHdCY317EIqelTYKzDIcbGCvfN4Ra9BE4evwALSMDJIQn79GB4eg8kfPcchIwIZ/ROgqvJgv436M7MTHj84Y1wsa0TWlqtPrwDu68sg68I/fEungqNx2CdgZ404wZIGc0fZNsIw+UyCFckQQb+rbvtVtDoDKBG16oMNf0ihj9r8IwIjd5FIGpib6fnT0mW3nKzTRwYzTTIW/PtZVvmP/kyMGLowDywlrE1gahZA6X3vwMZ2c+CWC6Gux9aDzu3bgEBzjePYZ68qVqHlaKd0WeGYuK1qNEkw890kNP2jun+zA22BZRjtd/5EJkEJieOYf7uuXkZ9KK3UdXUDAtvXQHPPvYofu08YEZIJ/c/+jO4adZMe3/tXQ0gd/EQGnRS2J1lBV+CUTRPSVpUBxce3woztj8Bzz/zeyABqltuvx3CA2QMuQ7DwrwTDVaghZgZWNFzEyORB9gJ43AXZGLCGHt5ODKBEjGkoVkif3PyC+Cdd96Gc7ihm4Zm57ZVd8KKhfOd5gZj3Zl+v2JgNC9/D6Dr94nj29kVS/z1Rbj0ehakP70CXnvh+QEBmNP640cLLFag8Uv/Fr4aLcDQIdFqPfqad657AHjMf04D96eQHBsNb7zyZ1ZWE06w8so9Tu3ZVWGQ8/1Rpi4oJAxGtnlXLfPmLKiaPAYSlk12kuOP6RDQwDj5AkosYffanbpxLkQlWn3PWVMznBuucamlVY0BIKsnQoZSr5XBpm2F9lElxPl++yh8WG2/2A6amgE5BOQeXC3yTgIBg6/ggXGja9HAel5GeZFKPspJmpAK0cHOE6MXlqvSRJfvsvdjtAjg5592Qk/nwO2lyphgmp2GLSPEXZXSDf8GC7p/JDX2h2bZ6D3V4+EcWh4exATtmfmXAppbBN9BWkyyAuYsXuJQc+2zbd2dEFRvNRFkNE8cEELZ5TL7wMhm7Aq1dVVor/SSkV6qgcLndjIUDbiY4pvQm6teExPDuHdWR4cC61KLh6SQEaNg6pSpPDiGn1RXPnAOY9OxYDiWc86p04wJGRDT4d0+OzFgQfhRHii/OoMazR9oZLfjatVoi+C0awe+yuTMmnCIPyvz1ae3dg2uKoOVVrPxZn4ofLEnz438jh7nhYobAUtF1+8+BZ2DvWYhc6tGiOy4MkALxZJv3Kg4VJR2DNg+DuTDSqJRof+G6b0L4bDl41y3viaMmwTTVfy02SZE2K2DxJcPAuUQBrC1ebtSAsqOKwM0mRBRQ70HaD1IbMcVXDMuX4cjaVE216RFbyCoZBtsuRgO727LcWMjb99jvVYvya2RY0VgUS2M2Ob+lrCxY5etmeOT7LaLAdpKTNvRZ2P2VD9cWq2sqYGtn37GKd7V1nAJ3i+UwZsf5ngaIsyZOBtSavzTZkeBsZ+eguDCascq1jyuuL/DB2xfwtqBpijRIVYuLw1q3Bzt7XeBvJDxbpo0TgHR0dFwy52r4VThRVZ+EqfZ+ckOeOODAW/DkViCR3MfqY5xrPI/j50l/CULiCnxlVCjnfC0A505IeEoPoFKXwJc28kjO9vU6lo9JOW7br4JHsHYxrqfrIYHn/gFqGrc48bf4YHJt9/7krW/O8bP5+1psArDBnFLN8T/81tvJGTnvCsyRP6VI5Ed6H41/49jI9e8Gvfsanv6uJLzorvntuXw1patkPf1IVgyfx4DeH5RsV3G57u+RPPiOXYRFBoGa4uZcLCdfigyYvRARAg4W8J1yceuv6VnB5owSaTUh3gxsgnwVn+qsRVInGE40qqblsDWjz8BGbqTR77aC6uWLYPlq++G3V9/Cyd+sHobnvpdmjgD5PqhGZNFIoTWyXGQP1UOxU8tAlN0sKcumTqMb2xxbXSLF+KvGOxCFbnHlZBLeVJEGMyIjeBC6heNsroWHtywAapKBjTam6C3R9wFY2v90htGrBl/K6JTEQHNIi001Chx908OIZseB1HCCNZu0TIcX5+qmOdK4KTRpFFIwd+R2C81uNzeCSo8ST9cSTFmNBzOOggLV6z02QXR/lhpKBjDBkK63pgIXY8iCpqnxEHFtEg4M5aGIyI1FKjzobaiGKj4GAj752+9gkzkC4D6m6d+3DSaEA1Gq0nI9JYxIyG2P1juqdOhqNu683PY/OeXobfL86IpZuRouL8zmulKKMKfDETgZbJAoIT4iR26BOh+MQfijXotGPBIgad9UNs4ZXgyNejJtTgTkr1w9sSmzYTDIyeq+R9Rpe/CP4/t7F0B/hQpwJHaRrg9ET+LkPBm9ybaqe3R+9bCmTNn4etdnzvV2wpGo5G8lYwimTHEacYHomd5KDYe1yuFGw6Bj6wG2fK5rk0ey7jr9QePDVjpZjoIIfklLDzB9AEbk696PS5VD1fXQ7fBj/itL+EO7ZHRUQ4l52xXWwvZoCNg+5VESaMg9I3fcQYZtTkrc4Iij60zj0ATYqmUehHfsIHIN5sElvpuXBZnqWuHbYlOuk1LSWHpHd8si4Wqk+l5+5wUmofAB26HsNefBtGYOFb5jg0IshZfnacd61zzrEDfl5zcRFOCx10Z+JSJZn+DH0wO1wR578oVED06nnVIykANt5mwX4JkWiqEvfMHkN97i0977NgpuvHP+fo9PI+ToaMQ/KWDz3BBgDOB/6n5SumlcWCKXHnb7SNFODENZcrDr14z164x6bVatwkBD77T66PSqZAeVn1ihiIeNwbk6+8AyeRx/IdGwdH1KYrFqNVezZRPoHfV1ET0dRuKyC+t8B2FWa/X5L7/XmFbtXo+8lLx+O3gyy883xMdNzqIryxv9JfLKywPP3Cfpa62zg3sMTGRsLpvDAyEd6ySyI8ut+IoNGNCizNeeCZaEhhkdVG8deTShiJ6aEqYviE1Se3S5Fb0CTTh2F6uWoDLvsP4yCRuElgqai7knz39+Uej0Q2xe/cSsbBr5VxF4LhJM0VTZt0MwaFDu7g5lJ0N27Ztg+KSUjxxisd7+5fmk/DbxZu64kAYIAJRtAxUFl1rldQUZbQ9FgHVPvnWO0vGL1jMzb3Ae+7X4HtwcbKHBQKnak5AE44dJRUPoeu23YnbUwE/KM/9zzt5zcqKha7N4+MjTqQrIueQegq/BUzCraUps5aZwyJjh9aeoPze3j4oxi9geztb9A01pdK+lmrAI9VMqmrQ5Jwra1pkLQ38GxoTd/ymXz8zHT8qsp6YGWhyyyHQzyHIr7k1sFRwBprwo71+FbXkWRZZYNT2dX77+qtKXbdmuieam2cmnggOEDNA29q1OuOpRkPk7EULF+IeZAZERITbmvy+GtHjKThfAEeP5oBMX3csOEBATJc9GUzmwoN5Ko8bniKZtPiWp5+PkIeEsZtKSrBjQ2ryertADhleQCPIFJkcUe69rrLxx1Aqv3/z75TZbEp0bSNldBVNqxeO70XX1unDwOKq9rySyrZ5FrMFv4FvvTRy1Cjp9GnTk5csWWIeN25cdFRUFJ5/8z7MTjxOUF9f333y5EmqqOhy1YULF7okEvEEoVgUGR8bkj8zNdbpweNYzFnHVBqdyezxqVICQdOCR59si04am+Z2LxT+Jzopybfy/Y8XvN+BWy/4A/j4v1H0lai24+T4gK1Z09ykPvzGa3L8FCHWVud6HRUdfH72xLgM53rK8tnXhSeUqmpKr9NNwwcpd2jPxfwCfEVRyyOAAB4ZGcnkDfjBfi+ekurGc9E1uBPT0dFBloBncA6ZaeNHPqNYIskfOWoEvXH1rEn4gJ3CbZcrW4+XVXV4s8mahT/7Za0j2DiUbwKCpKvXxMfz3hK3TQe28fm8kp9hR0Ae2lGq7MO55tHutubq7954VYqTHivIRKhiVChzBs2xA73eUFRUVOYW6WJoiBHHDrAvaMMz0OTPW8KVrIjQ2xLyiQ16/Wy1Sg3tnWknI8KCbrS1kWtibKgAgXascs2HHN3y7sglj/+qNCIhKQUf5L6AFMW9fDXZJpS3RtsY8Uao906deeWbv/0lkzabRtvqXa8BEqFKES1vCpRLUCEQPIdkNBktfVqDU52tGTXSgn14bLPROF690ctlEotELHaSRYTr9EZa3aoL7tIZJzrKcsqjR7L0yd/uzLhp0W8Wu/x8jxOdj4LfQNvkrlx5+08tQL+HZamtzvE6PjYwJ1QuWuRYdz3ltQZz3uX6Ho9vFT48M65D/nhw/6G/DnbMvE2Ha4cHD2Z/sGrVqgsW2rwHX3S3E4R4gJvRpITE+BMRUeHs62VXwSxlTVdXkU7Xw66BLHyu1QaDqaWlqWsaHjTvd/qcKfDta8VFzbqs/Ye+d27xrzRooEm3Bw4cOLdy3crp0Gv5N76RdzsOBTcSGKBDQkOjpDLZoIGW6vuURqNw0HJkMgFzOhPH574Io6jvKangp1m7D1Y73stg8k52azCCDn52sDXrQPY9+K0J/pwLNBBZalVljoCyunMSqcSjKzWYPgfDiy5jOI7ThDHk6PKS8lxi49EJ7UDX7uHsA9nLDg4hyGScQwa07aYP7ju4TyyQpDXU1b/U0d45XyoWjcK2LrFExDuWYJM5HFd0UIhNq0LTMdKg191QqVS/HiCj07L2Z20bjv6GxHS4Dmzfvn2dWLcpISHhC9SSV0UiUSKWPa7EXHmvZhm3uJpok0UdFx3+zOmCS/noaw5b94P2OriM7JN3nkmPjh3xK/Ry16GvyytG7Cpf09We09OtWeRaz6eME50Bf11qL/5q5JuPPbf1NB9ef2mvCtC2wf341RthBgOVieWfoYeSaqvncx0M0GiH1WgytooCRB9kPr65mU+/g6W9qkA7DvaHPe9OM1lMt+Gu3q2o6bNQ0zlF8PgAjSskFE2dRw0+hD/G//WGX4acoqhNOOld/XTNgHa81W92vR9BQc8yrJuO0ExEb2ASuoluPjnh8QF0Pd5QEfq/l1F7z4NEfHjDE/9odOzrWuWvC6A93Xze/g+CdabuFJOZisRvIUPMJOongJCezk6jpqdTggdVNGgGNOg+dlksgg6JXFJ2/8//6jV44amf/6/7P4bA/wLMeyTwqmrFpQAAAABJRU5ErkJggg==";
const Su = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [r, l] of t)
    n[r] = l;
  return n;
}, xu = {}, Wu = (e) => (Co("data-v-dd766988"), e = e(), yo(), e), Uu = { class: "config-information" }, Hu = /* @__PURE__ */ Wu(() => /* @__PURE__ */ Ve("div", { class: "titleWrapper" }, [
  /* @__PURE__ */ Ve("img", {
    src: Mu,
    class: "logo"
  }),
  /* @__PURE__ */ Ve("h1", { class: "title" }, [
    /* @__PURE__ */ ql(" PrestaShop "),
    /* @__PURE__ */ Ve("span", {
      class: "font-normal",
      style: { color: "#6b868f" }
    }, "Account")
  ])
], -1)), Bu = { class: "description" }, ju = { class: "text" };
function Vu(e, t) {
  return Yl(), Gl("aside", Uu, [
    Hu,
    Ve("div", Bu, [
      Ve("h2", ju, Na(e.$t("configure.incentivePanel.howTo")), 1)
    ])
  ]);
}
const Ku = /* @__PURE__ */ Su(xu, [["render", Vu], ["__scopeId", "data-v-dd766988"]]), Xu = { id: "settingsApp" }, Yu = { class: "onboarding" }, Gu = { class: "onboarding-header" }, Ju = { class: "onboarding-content" }, qu = /* @__PURE__ */ Wo({
  __name: "App",
  setup(e) {
    return wn(async () => {
      var n;
      if (window != null && window.psaccountsVue)
        return (n = window == null ? void 0 : window.psaccountsVue) == null ? void 0 : n.init();
      (await import("./chunk-vendors.6.1.4.js").then((r) => r.p)).default.init();
    }), (t, n) => {
      const r = Jo("prestashop-accounts");
      return Yl(), Gl("div", Xu, [
        Ve("div", Yu, [
          Ve("section", Gu, [
            ve(Ku)
          ]),
          Ve("section", Ju, [
            ve(r)
          ])
        ])
      ]);
    };
  }
});
/**
 * 2007-2020 PrestaShop and Contributors
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License 3.0 (AFL-3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2020 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
 * International Registered Trademark & Property of PrestaShop SA
 */
(async () => {
  const e = Qi(qu);
  e.use(Du), e.mount("#app");
})();

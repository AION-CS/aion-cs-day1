/**
 * A small recursive-descent arithmetic parser for the Calculator widget.
 * No eval, no Function. Grammar:
 *
 *   expr   := term (('+' | '-') term)*
 *   term   := unary (('*' | '/') unary)*
 *   unary  := ('-' | '+') unary | power
 *   power  := atom ('^' unary)?
 *   atom   := number ('%')? | '(' expr ')'
 *
 * "×", "x" and "÷" are accepted as multiply / divide. A comma is read as a
 * decimal point inside a number only when there is no dot in it.
 */

type Token = { t: "num"; v: number } | { t: "op"; v: string };

function tokenise(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (/[\d.,]/.test(c)) {
      let j = i;
      while (j < src.length && /[\d.,]/.test(src[j])) j++;
      let raw = src.slice(i, j);
      if (raw.includes(",") && !raw.includes(".")) raw = raw.replace(",", ".");
      raw = raw.replace(/,/g, "");
      const v = Number(raw);
      if (!Number.isFinite(v)) throw new Error("bad number");
      out.push({ t: "num", v });
      i = j;
      continue;
    }
    if ("+-*/^()%".includes(c)) {
      out.push({ t: "op", v: c });
      i++;
      continue;
    }
    if (c === "×" || c === "x" || c === "X") {
      out.push({ t: "op", v: "*" });
      i++;
      continue;
    }
    if (c === "÷") {
      out.push({ t: "op", v: "/" });
      i++;
      continue;
    }
    if (c === "−") {
      out.push({ t: "op", v: "-" });
      i++;
      continue;
    }
    if (c === "€") {
      i++;
      continue;
    }
    throw new Error(`unexpected "${c}"`);
  }
  return out;
}

export function safeCalc(src: string): { ok: true; value: number } | { ok: false; error: string } {
  try {
    const toks = tokenise(src);
    if (toks.length === 0) return { ok: false, error: "empty" };
    let p = 0;
    const peek = () => toks[p];
    const isOp = (v: string) => {
      const t = peek();
      return !!t && t.t === "op" && t.v === v;
    };

    const atom = (): number => {
      const t = peek();
      if (!t) throw new Error("unfinished");
      if (t.t === "num") {
        p++;
        let v = t.v;
        while (isOp("%")) {
          p++;
          v /= 100;
        }
        return v;
      }
      if (isOp("(")) {
        p++;
        const v = expr();
        if (!isOp(")")) throw new Error("missing )");
        p++;
        return v;
      }
      throw new Error(`unexpected "${t.v}"`);
    };
    const power = (): number => {
      const base = atom();
      if (isOp("^")) {
        p++;
        return Math.pow(base, unary());
      }
      return base;
    };
    const unary = (): number => {
      if (isOp("-")) {
        p++;
        return -unary();
      }
      if (isOp("+")) {
        p++;
        return unary();
      }
      return power();
    };
    const term = (): number => {
      let v = unary();
      while (isOp("*") || isOp("/")) {
        const op = (peek() as { v: string }).v;
        p++;
        const r = unary();
        if (op === "/" && r === 0) throw new Error("divide by zero");
        v = op === "*" ? v * r : v / r;
      }
      return v;
    };
    const expr = (): number => {
      let v = term();
      while (isOp("+") || isOp("-")) {
        const op = (peek() as { v: string }).v;
        p++;
        const r = term();
        v = op === "+" ? v + r : v - r;
      }
      return v;
    };

    const value = expr();
    if (p < toks.length) throw new Error("unexpected input");
    if (!Number.isFinite(value)) throw new Error("not a number");
    return { ok: true, value };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "error" };
  }
}

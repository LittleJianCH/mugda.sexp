import { lookupValueInEnv } from "../env"
import * as Exps from "../exp"
import { Exp } from "../exp"
import { Mod } from "../mod"
import { Pattern } from "../pattern"
import * as Orders from "./Order"
import { Order } from "./Order"

export function compareExpWithPatten(
  mod: Mod,
  exp: Exp,
  pattern: Pattern,
): Order {
  if (pattern.kind === "Inaccessible") {
    return compareExpWithPatten(mod, exp, pattern.pattern)
  }

  if (exp.kind === "Var") {
    if (!isCtorName(mod, exp.name)) {
      return compareVarWithPatten(mod, exp.name, pattern)
    } else if (pattern.kind === "Ctor" && pattern.name === exp.name) {
      return Orders.Neutral
    }
  }

  if (exp.kind === "Ap" || exp.kind === "ApUnfolded") {
    const unfolded = Exps.unfoldAp(exp)
    exp = Exps.ApUnfolded(unfolded.target, unfolded.args)
  }

  if (exp.kind === "ApUnfolded") {
    const unfolded = Exps.unfoldAp(exp)
    if (exp.target.kind === "Var") {
      if (!isCtorName(mod, exp.target.name)) {
        return compareVarWithPatten(mod, exp.target.name, pattern)
      } else if (
        pattern.kind === "Ctor" &&
        exp.target.name === pattern.name &&
        exp.args.length === pattern.args.length
      ) {
        return Orders.minOrders(
          exp.args.map((arg, i) =>
            compareExpWithPatten(mod, arg, pattern.args[i]),
          ),
        )
      }
    }
  }

  return Orders.LargerOrNotComparable
}

function isCtorName(mod: Mod, name: string): boolean {
  const value = lookupValueInEnv(mod.env, name)
  if (value === undefined) return false

  return value.kind === "Ctor" || value.kind === "Coctor"
}

function compareVarWithPatten(mod: Mod, name: string, pattern: Pattern): Order {
  switch (pattern.kind) {
    case "Var": {
      if (pattern.name === name) {
        return Orders.Neutral
      } else {
        return Orders.LargerOrNotComparable
      }
    }

    case "Ctor": {
      return Orders.mulOrder(
        Orders.Difference(-1),
        Orders.maxOrders(
          pattern.args.map((arg) => compareVarWithPatten(mod, name, arg)),
        ),
      )
    }

    case "Inaccessible": {
      return compareVarWithPatten(mod, name, pattern.pattern)
    }
  }
}

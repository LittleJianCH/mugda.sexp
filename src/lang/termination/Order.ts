export type Order = Smaller | Difference | Neutral | LargerOrNotComparable

export type Smaller = {
  kind: "Smaller"
}
export type Difference = {
  kind: "Difference"
  r: number
}
export type Neutral = {
  kind: "Neutral"
}
export type LargerOrNotComparable = {
  kind: "LargerOrNotComparable"
}

export const Smaller: Smaller = { kind: "Smaller" }
export function Difference(r: number): Difference {
  return { kind: "Difference", r }
}
export const Neutral: Neutral = { kind: "Neutral" }
export const LargerOrNotComparable: LargerOrNotComparable = {
  kind: "LargerOrNotComparable",
}

export function checkSmaller(order: Order): boolean {
  return (
    order.kind === "Smaller" || (order.kind === "Difference" && order.r < 0)
  )
}

export function checkNeutral(order: Order): boolean {
  return (
    order.kind === "Neutral" ||
    order.kind === "Smaller" ||
    (order.kind === "Difference" && order.r <= 0)
  )
}

export function equalOrder(x: Order, y: Order): boolean {
  return x === y
}

export function mulOrder(x: Order, y: Order): Order {
  if (x.kind === "Difference" && y.kind === "Difference") {
    return Difference(x.r + y.r)
  }
  if (checkSmaller(x) && checkNeutral(y)) return Smaller
  if (checkNeutral(x) && checkSmaller(y)) return Smaller
  if (checkNeutral(x) && checkNeutral(y)) return Neutral
  return LargerOrNotComparable
}

export function addOrder(x: Order, y: Order): Order {
  if (x.kind === "Difference" && y.kind === "Difference") {
    return Difference(x.r < y.r ? x.r : y.r)
  }
  if (checkSmaller(x)) return x
  if (checkSmaller(y)) return y
  if (checkNeutral(x)) return x
  if (checkNeutral(y)) return y
  return LargerOrNotComparable
}

export function maxOrders(xs: Array<Order>): Order {
  return xs.reduce((result, x) => addOrder(result, x), LargerOrNotComparable)
}

export function minOrders(xs: Array<Order>): Order {
  return xs.reduce((result, x) => mulOrder(result, x), Neutral)
}

export type Order = Smaller | Neutral | LargerOrNotComparable

export type Smaller = {
  kind: "Smaller"
}
export type Neutral = {
  kind: "Neutral"
}
export type LargerOrNotComparable = {
  kind: "LargerOrNotComparable"
}

const Smaller: Smaller = { kind: "Smaller" }
const Neutral: Neutral = { kind: "Neutral" }
const LargerOrNotComparable: LargerOrNotComparable = {
  kind: "LargerOrNotComparable",
}

export function equalOrder(x: Order, y: Order): boolean {
  return x === y
}

export function mulOrder(x: Order, y: Order): Order {
  if (x === Smaller && y === Smaller) return Smaller
  if (x === Smaller && y === Neutral) return Smaller
  if (x === Neutral && y === Smaller) return Smaller
  if (x === Neutral && y === Neutral) return Neutral
  return LargerOrNotComparable
}

export function addOrder(x: Order, y: Order): Order {
  if (x === Smaller && y === Smaller) return Smaller
  if (x === Smaller && y === Neutral) return Smaller
  if (x === Neutral && y === Smaller) return Smaller
  if (x === Neutral && y === Neutral) return Neutral
  if (x === LargerOrNotComparable) return y
  if (y === LargerOrNotComparable) return x
  return LargerOrNotComparable
}

export function minOrder(x: Order, y: Order): Order {
  if (x === Smaller && y === Smaller) return Smaller
  if (x === Smaller && y === Neutral) return Neutral
  if (x === Neutral && y === Smaller) return Neutral
  if (x === Neutral && y === Neutral) return Neutral
  return LargerOrNotComparable
}

export function maxOrders(xs: Array<Order>): Order {
  return xs.reduce((result, x) => addOrder(result, x), LargerOrNotComparable)
}

export function minOrders(xs: Array<Order>): Order {
  return xs.reduce((result, x) => mulOrder(result, x), Neutral)
}

// TODO Why the paper uses minOrder the following definition?

export function minOrdersFromThePaper(xs: Array<Order>): Order {
  return xs.reduce((result, x) => minOrder(result, x), Smaller)
}

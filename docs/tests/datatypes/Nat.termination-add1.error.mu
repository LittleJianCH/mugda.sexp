(data Nat () ()
  (zero () Nat)
  (add1 ([prev Nat]) Nat))

(fn add (-> Nat Nat Nat)
  [(x (zero)) x]
  [(x (add1 y)) (add1 (add x (add1 y)))])
/* Basic Rules */
/* Z is the type under investigation, except in normal/2 where it is Y */

resist_four(X, Y, Z) :- (X \= Y, resist(X, Z), resist(Y, Z) ).

resist_two(X, Y, Z) :- (X = Y, resist(X, Z) ) ; (resist(X, Z), normal(Y, Z) ) ; (resist(Y, Z), normal(X, Z) ).

normal(X, Y) :- (\+ weak(X, Y), \+ resist(X, Y), \+ immune(X, Y) ).

weak_four(X, Y, Z) :- (X \= Y, weak(X, Z), weak(Y, Z) ).

weak_two(X, Y, Z) :- (X = Y, weak(X, Z) ) ; (weak(X, Z), normal(Y, Z) ) ; (weak(Y, Z), normal(X, Z) ).

immune(X, Y, Z) :- (immune(X, Z) ; immune(Y, Z) ).

type(bug).
type(dark).
type(dragon).
type(electric).
type(fairy).
type(fighting).
type(fire).
type(flying).
type(ghost).
type(grass).
type(ground).
type(ice).
type(normal).
type(poison).
type(psychic).
type(rock).
type(steel).
type(water).

/* Complicated rules */
/* unresisted_pair(X, Y): there doesn't exist a team member with types W, Z such that W, Z resists both X and Y */
/* weak_pair(X, Y): all team members are weak to X or Y */
/* pair refers to two types. The implementation interprets dual types of the same type properly (it works when W = Z) */

/* unresisted_two(X, Y) :- \+ (team_member(W, Z), (resist_two(W, Z, X) ; resist_two(W, Z, Y) ; resist_four(W, Z, X) ; resist_four(W, Z, Y) ; immune(W, Z, X) ; immune(W, Z, Y))). */
/* unresisted_two(X) :- type(X), \+ (team_member(W, Z), immune(W, Z, X)). */
/* @< this operator instead of inequality (\=) to ignore symmetrical solutions */
unresisted_single(X) :- type(X), forall(team_member(W, Z), (\+ resist_two(W, Z, X), \+ resist_four(W, Z, X), \+ immune(W, Z, X))).
unresisted_pair(X, Y) :- type(X), type(Y), X @< Y, forall(team_member(W, Z), (\+ resist_two(W, Z, X), \+ resist_four(W, Z, X), \+ immune(W, Z, X) ; (\+ resist_two(W, Z, Y), \+ resist_four(W, Z, Y), \+ immune(W, Z, Y)))).

weak_single(X) :- type(X), forall(team_member(W, Z), (weak_two(W, Z, X) ; weak_four(W, Z, X))).
weak_pair(X, Y) :- type(X), type(Y), X @< Y, forall(team_member(W, Z), (weak_two(W, Z, X) ; weak_four(W, Z, X) ; weak_two(W, Z, Y) ; weak_four(W, Z, Y))).

/* Predicates for each type alphabetically, as per convention */

immune(dark, psychic).
immune(fairy, dragon).
immune(flying, ground).
immune(ghost, fighting).
immune(ghost, normal).
immune(ground, electric).
immune(normal, ghost).
immune(steel, poison).

/* ----------------------- */

resist(bug, fighting).
resist(bug, grass).
resist(bug, ground).
resist(dark, dark).
resist(dark, ghost).
resist(dragon, electric).
resist(dragon, fire).
resist(dragon, grass).
resist(dragon, water).
resist(electric, electric).
resist(electric, flying).
resist(electric, steel).
resist(fairy, bug).
resist(fairy, dark).
resist(fairy, fighting).
resist(fighting, bug).
resist(fighting, dark).
resist(fighting, rock).
resist(fire, bug).
resist(fire, fairy).
resist(fire, fire).
resist(fire, grass).
resist(fire, ice).
resist(fire, steel).
resist(flying, bug).
resist(flying, fighting).
resist(flying, grass).
resist(ghost, bug).
resist(ghost, poison).
resist(grass, electric).
resist(grass, grass).
resist(grass, ground).
resist(grass, water).
resist(ground, poison).
resist(ground, rock).
resist(ice, ice).
resist(poison, bug).
resist(poison, fairy).
resist(poison, fighting).
resist(poison, grass).
resist(poison, poison).
resist(psychic, fighting).
resist(psychic, psychic).
resist(rock, fire).
resist(rock, flying).
resist(rock, normal).
resist(rock, poison).
resist(steel, bug).
resist(steel, dragon).
resist(steel, fairy).
resist(steel, flying).
resist(steel, grass).
resist(steel, ice).
resist(steel, normal).
resist(steel, psychic).
resist(steel, rock).
resist(steel, steel).
resist(water, fire).
resist(water, ice).
resist(water, steel).
resist(water, water).

/* ----------------------- */

weak(bug, fire).
weak(bug, flying).
weak(bug, rock).
weak(dark, bug).
weak(dark, fairy).
weak(dark, fighting).
weak(dragon, dragon).
weak(dragon, fairy).
weak(dragon, ice).
weak(electric, ground).
weak(fairy, poison).
weak(fairy, steel).
weak(fighting, fairy).
weak(fighting, flying).
weak(fighting, psychic).
weak(fire, ground).
weak(fire, rock).
weak(fire, water).
weak(flying, electric).
weak(flying, ice).
weak(flying, rock).
weak(ghost, dark).
weak(ghost, ghost).
weak(grass, bug).
weak(grass, fire).
weak(grass, flying).
weak(grass, ice).
weak(grass, poison).
weak(ground, grass).
weak(ground, ice).
weak(ground, water).
weak(ice, fighting).
weak(ice, fire).
weak(ice, rock).
weak(ice, steel).
weak(normal, fighting).
weak(poison, ground).
weak(poison, psychic).
weak(rock, fighting).
weak(rock, grass).
weak(rock, ground).
weak(rock, steel).
weak(rock, water).
weak(steel, fighting).
weak(steel, fire).
weak(steel, ground).
weak(water, electric).
weak(water, grass).

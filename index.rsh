"reach 0.1";
const [ isOutcome, WINNER, LOSER] = makeEnum(2);
const result = (x, specialNumber) => {
  if(x == specialNumber){
    return  WINNNER;
  }
  else return LOSER;
}
assert(result(1,1) == WIN )
assert(result(1,0) == LOST )
export const main = Reach.App(() => {
  const Alice = Participant('Alice', {
    ...hasRandom,
    shpTickets: Fun([],UInt),
    getShp: Fun([], Token),
    winningNumber: Fun([UInt], UInt),
    getHash:Fun([Digest], Null),
    showNumber:Fun([UInt], Null),
    luckyParticipant: Fun([UInt,Address], Null),
    seeAliceBalance:Fun([], Null)
  });

  const Bob = API('Bob', {
    pick: Fun([UInt],  Bool),
  });
  init();

 Alice.only(() => {
    const tickets = declassify(interact.shpTickets());
    const shp = declassify(interact.getShp());
    const _getWinningNumber = interact.winningNumber(tickets);
   const [_commitAlice, _saltAlice] = makeCommitment(interact, _getWinningNumber);
   const commitAlice = declassify(_commitAlice);
  });
  Alice.publish(tickets, shp, commitAlice);
  Alice.interact.getHash(commitAlice);
  commit();
  Alice.pay([[1, shp]]);
  const participants = new Map(Address, UInt);
  commit();
  Alice.only(() => {
    const saltAlice = declassify(_saltAlice);
    const specialNumber = declassify(_getWinningNumber);
   });
  Alice.publish(saltAlice, specialNumber); 
 
  const [Bobs] =
    parallelReduce([0])
    .invariant(balance() == balance())
    .while( Bobs < tickets )
    .api_(Bob.pick, (x) => {
      return [ 0, (k) => {
        participants[this] = x
        if (x == specialNumber ){
          transfer(balance(shp), shp ).to(this)
          const y = (specialNumber == x ? 1 :  0)
          Alice.interact.luckyParticipant(y, this)
          k(true);
          return [Bobs + 1];
        }
        else {
          k(false);
          const y = (specialNumber == x ? 1 :  0)
          Alice.interact.luckyParticipant(y, this)
          return [Bobs + 1];
        }
      }]
    })
  Alice.interact.showNumber(specialNumber)
  Alice.interact.seeAliceBalance()
  transfer(balance(shp), shp).to(Alice);
  transfer(balance()).to(Alice);
  commit();
  exit();
});

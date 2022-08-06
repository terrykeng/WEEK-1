import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

const stdlib = loadStdlib({ REACH_NO_WARN: 'Y' });
const sbal = stdlib.parseCurrency(100);
const accAlice = await stdlib.newTestAccount(sbal);
const fmt = (x) => stdlib.formatCurrency(x, 4);

const ctcAlice = accAlice.contract(backend);

const players = await stdlib.newTestAccounts(5, sbal);
const ctcWho = (whoi) =>
  players[whoi].contract(backend, ctcAlice.getInfo());

const tId = await stdlib.launchToken(accAlice, "Shaolin Punk", "SHP", { supply: 1});
  console.log('SHAOLIN PUNK LIMITED NFT HAS BEEN MINTED AND IS READY FOR THE RAFFLE');
  console.log(`Opt-ing in to SHAOLIN PUNK`);
  await players[0].tokenAccept(tId.id);
  await players[1].tokenAccept(tId.id);
  await players[2].tokenAccept(tId.id);
  await players[3].tokenAccept(tId.id);
  await players[4].tokenAccept(tId.id);

const getPick = async (whoi) => {
  const num = (Math.floor(Math.random() * 5) + 1)
  const who = players[whoi];
  const ctc = ctcWho(whoi);
  const y = await ctc.apis.Bob.pick(num);
  console.log(`${stdlib.formatAddress(who)} ticket number is ${num}`);
  if(y){
    console.log(stdlib.formatAddress(who), 'sees you won the Raffle')
  }
  else console.log(stdlib.formatAddress(who), ' sees you did not win the raffle')
};

const getBalance = async () => {
  const x = fmt(await stdlib.balanceOf(accAlice, tId.id));
  console.log('Alice sees her NFT balance is ', x, tId.sym);
}

await Promise.all([
  backend.Alice(ctcAlice, {
    ...stdlib.hasRandom,
    shpTickets: () =>{
      const x = 5;
      console.log('The Number of Tickets: ',  x)
      return x;
      
    },
    getShp : () => {
        console.log('NFT PARAMETERS SENT TO THE BACKEND');
        return tId.id;
    },
    winningNumber : (X) => {
      const num = (Math.floor(Math.random() * X) + 1);
      return num;
    },
    getHash : (hash) => {
      console.log('WINNING NUMBER HASH: ', hash);
    },
    showNumber : (x) => {
      console.log(`WINNING NUMBER: ${x}`)
    },
    luckyParticipant : (x, y) => {
     if(x == 1){
      console.log(`Alice sees ${stdlib.formatAddress(y)} Won the raffle `)
     }
    },
    seeAliceBalance: () => {
      getBalance()
    }
  }),

await getPick(0),
await getPick(1),
await getPick(2),
await getPick(3),
await getPick(4),
]);
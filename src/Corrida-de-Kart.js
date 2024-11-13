const p = {
  "players": [
    {
      "id": 1,
      "nome": "Mario",
      "velocidade": 4,
      "manobrabilidade": 3,
      "poder": 3,
      "pontos_rodada": 0,
      "pontos": 0
    },
    {
      "id": 2,
      "nome": "Princess Peach",
      "velocidade": 3,
      "manobrabilidade": 4,
      "poder": 2,
      "pontos_rodada": 0,
      "pontos": 0
    },
    {
      "id": 3,
      "nome": "Yoshi",
      "velocidade": 2,
      "manobrabilidade": 4,
      "poder": 3,
      "pontos_rodada": 0,
      "pontos": 0
    },
    {"id": 4, 
      "nome": "Bowser", 
      "velocidade": 5, 
      "manobrabilidade": 2, 
      "poder": 5, 
      "pontos_rodada": 0,
      "pontos": 0
    },
    {
      "id": 5,
      "nome": "Luigi",
      "velocidade": 3,
      "manobrabilidade": 4,
      "poder": 4,
      "pontos_rodada": 0,
      "pontos": 0
    },
    {
      "id": 6,
      "nome": "Donkey Kong",
      "velocidade": 2,
      "manobrabilidade": 2,
      "poder": 5,
      "pontos_rodada": 0,
      "pontos": 0
    }
  ]
}

/*
Simulador de Corridas do Mario Kart com Noked.js
*/
class Corrida {
  #player1;
  #player2;
  #constants;

  constructor(player1, player2) {
    this.#player1 = this.getPlayer();
    this.#player2 = this.getPlayer();

    // Ensure player1 and player2 are not the same
    while (this.#player2.id === this.#player1.id) {
      this.#player2 = this.getPlayer();
    }

    // Freeze #constants for race configuration
    this.#constants = Object.freeze({
        sides: 6,
        players: p.players.length, // Ensure correct count of players
        blocks: 3,
    });
  }

  getPlayer() {
    let randomIndex = Math.floor(Math.random() * p.players.length);

    return p.players[randomIndex];
  }
  
  get player1(){
    return this.#player1;
  }

  get player2(){
    return this.#player2;
  }

  // Log the result of a dice roll
  async logRollResult(playerName, block, diceResult, attribute){
    console.log(`${playerName}🎲Rolou um dado de ${block} ${diceResult} ${attribute} = ${diceResult + attribute}`);
  }

  async getRandomBlock() {
    let randomNumber = Math.floor(Math.random() * this.#constants.blocks) + 1;
    let result;

    switch (randomNumber) {
      case 1:
          result = "RETA";
          break;
      case 2:
          result = "CURVA";
          break
      default:
          result = "CONFRONTO"
    }

    return result
  }

  async rollDice() {
    let randomNumber = Math.floor(Math.random() * this.#constants.sides) + 1;
    return randomNumber;
  }

  async playRaceEngine(player1, player2) {
    for(let round = 1; round <= 5; round ++) {
      console.log(`🏁Rodada ${round}`);

      // block draw
      let block = await this.getRandomBlock()
      console.log(`Bloco: ${block}`)

      // roll the dice
      player1.pontos_rodada = await this.rollDice();
      player2.pontos_rodada = await this.rollDice();

      switch(block) {
        case "RETA":
          await this.logRollResult(
            player1.nome,
            "velocidade",
            player1.pontos_rodada,
            player1.velocidade
          )
  
          await this.logRollResult(
            player2.nome,
            "velocidade",
            player2.pontos_rodada,
            player2.velocidade
          )

          player1.pontos_rodada += player1.velocidade;
          player2.pontos_rodada += player2.velocidade;  
          break;

        case "CURVA":
          await this.logRollResult(
            player1.nome,
            "manobrabilidade",
            player1.pontos_rodada,
            player1.manobrabilidade
          )
  
          await this.logRollResult(
            player2.nome,
            "manobrabilidade",
            player2.pontos_rodada,
            player2.manobrabilidade
          )

          player1.pontos_rodada +=  player1.manobrabilidade;
          player2.pontos_rodada +=  player2.manobrabilidade;
          break;

        case "CONFRONTO":  
          console.log(`${player1.nome} confrontou com ${player2.nome}!🤼‍♂️🦾`);
  
          await this.logRollResult(
            player1.nome,
            "poder",
            player1.pontos_rodada,
            player1.poder
          )
  
          await this.logRollResult(
            player2.nome,
            "poder",
            player2.pontos_rodada,
            player2.poder
          );

          player1.pontos_rodada += player1.poder;
          player2.pontos_rodada += player2.poder;

          // verifying a round winner
          if(player1.pontos_rodada > player2.pontos_rodada){
            let mensagem = `${player1.nome} venceu o confronto!`;

            if(player2.pontos > 0) {
              mensagem += ` ${player2.nome} perdeu 1 ponto🐢`;
              player2.pontos--;
            }

            console.log(mensagem);
          }
  
          if(player2.pontos_rodada > player1.pontos_rodada){
            let mensagem = `${player2.nome} venceu o confronto!`;

            if(player1.pontos > 0) {
              mensagem += ` ${player1.nome} perdeu 1 ponto🐢`;
              player1.pontos--;
            }

            console.log(mensagem);
          }
  
          if(player2.pontos_rodada === player1.pontos_rodada) console.log("Embate empatado! Nenhum ponto foi perdido")
  
          break;
      }

      // verifying a round winner
      if(block != "CONFRONTO") {
        if(player1.pontos_rodada > player2.pontos_rodada) {
            console.log(`${player1.nome} marcou um ponto`);
            player1.pontos++;
        } else if(player2.pontos_rodada > player1.pontos_rodada) {
            console.log(`${player2.nome} marcou um ponto`);
            player2.pontos++;
        }
      }

      console.log("_____________")
    }
  }

  async declareWinner(player1, player2) {
    console.log("Resultado final:")
    console.log (`${player1.nome}: ${player1.pontos} ponto(s)`)
    console.log (`${player2.nome}: ${player2.pontos} ponto(s)`)

    if(player1.pontos > player2.pontos){
        console.log(`\n${player1.nome} venceu a corrida! Parabéns 🏆`)
    } else if (player2.pontos > player1.pontos){
        console.log(`\n${player2.nome} venceu a corrida! Parabéns 🏆`)
    } else {
        console.log("A corrida terminou em empate");
    }
  }
}

(async function main() {
  const corrida = new Corrida();

  console.log(
      `🏁🚨Corrida entre ${corrida.player1.nome} e ${corrida.player2.nome} começando...\n`
  );

  await corrida.playRaceEngine(corrida.player1, corrida.player2);
  await corrida.declareWinner(corrida.player1, corrida.player2);
})();

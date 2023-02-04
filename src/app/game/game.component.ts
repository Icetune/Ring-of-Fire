import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {


  game: Game;
  pickCardAnimation = false;
  currentCard: string = '';
  gameId: string;


  constructor(private router: ActivatedRoute, private firestore: AngularFirestore, public dialog: MatDialog) { }


  newGame() {
    this.game = new Game;
  }


  ngOnInit(): void {
    this.newGame();    

    this.router.params.subscribe((param) => {
      console.log('Game ID: ', param['id']);
      this.gameId = param['id'];

      this
        .firestore
        .collection("games")
        .doc(this.gameId)
        .valueChanges()
        .subscribe((game: any) => {
          console.log('Game Update', game);
          this.game.currentPlayer = game.currentPlayer;
          this.game.playedCards = game.playedCards;
          this.game.players = game.players;
          this.game.stack = game.stack;

          console.log(this.game);
          console.log(this.game.players);

        })
    });
  }


  takeCard() {
    if (this.game.players.length > 0) {
      if (!this.pickCardAnimation) {
        this.currentCard = this.game.stack.pop();
        this.pickCardAnimation = true;

        this.game.currentPlayer++;
        this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

        setTimeout(() => {
          this.game.playedCards.push(this.currentCard);
          this.pickCardAnimation = false;
        }, 1000)
      }
    } else {
      alert('Please ensert at least one player!');
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0 && name.length < 12) {

        console.log(this.game);
        console.log(this.game.players);

        this.game.players.push(name);


        this.saveGame()
      }
    });
  }


  saveGame() {
    this
    .firestore
    .collection("games")
    .doc(this.gameId)
    .update(this.game.toJSON());
  }


}
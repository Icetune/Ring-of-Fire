import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  game: Game;
  gameId: string;
  gameOver = false;


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
          this.game.player_images = game.player_images,
          this.game.stack = game.stack;
          this.game.pickCardAnimation = game.pickCardAnimation;
          this.game.currentCard = game.currentCard;

        })
    });
  }


  takeCard() {

    if(this.game.stack.length == 0) {
      this.gameOver = true;
    } else  if (this.game.players.length > 0) {
      if (!this.game.pickCardAnimation) {
        this.game.currentCard = this.game.stack.pop();
        this.game.pickCardAnimation = true;
        this.game.currentPlayer++;
        this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
        this.saveGame();
        setTimeout(() => {
          this.game.playedCards.push(this.game.currentCard);
          this.game.pickCardAnimation = false;
          this.saveGame();
        }, 1000)
      }
    } else {
      alert('Please ensert at least one player!');
    }
  }


  editPlayer(playerID: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if(change === 'DELETE') {
          this.game.players.splice(playerID, 1);
          this.game.player_images.splice(playerID, 1);
        } else {
          this.game.player_images[playerID] = change;
          this.saveGame();
        }
      }
    });
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.player_images.push('1.webp');
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
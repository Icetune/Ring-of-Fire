import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

import { Firestore, collectionData, collection, addDoc, setDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  game: Game;
  pickCardAnimation = false;
  currentCard: string = '';

  games$: Observable<any>;  //Observable ist eine Veriable, die sich updated

  constructor(private firestore: Firestore, public dialog: MatDialog) {

    const coll = collection(this.firestore, 'games');
    this.games$ = collectionData(coll);
    this.games$.subscribe((game) => {
      console.log('Game Update', game);
    });

  }



  ngOnInit(): void {
    this.newGame();
  }


  async newGame() {
    this.game = new Game;

    const coll = collection(this.firestore, 'games');
    // console.log('Document written with ID:', coll);

    await addDoc(coll, this.game.toJSON() );
    
    // let gameInfo = await addDoc(coll, { game: this.game.toJSON() });
    // console.log(gameInfo);
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
        this.game.players.push(name);
      }
    });
  }
}










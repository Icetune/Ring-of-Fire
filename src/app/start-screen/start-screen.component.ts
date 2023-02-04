import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { addDoc, collection } from 'firebase/firestore';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {

  constructor(private firestore: Firestore, private router: Router,) {

  }

  async newGame() {
    //Start Game
    let game = new Game();
    const coll = collection(this.firestore, 'games');
    const gameInfo = await addDoc(coll, game.toJSON() );
    this.router.navigateByUrl('/game/' + gameInfo.id);
  }

}

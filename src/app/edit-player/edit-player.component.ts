import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent {

  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>) { }

  allProfilePics = ['1.webp','2.png','pinguin.svg','monkey.png','winkboy.svg','serious-woman.svg'];

}
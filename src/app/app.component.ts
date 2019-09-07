import { Component } from '@angular/core';
import { PathFinder } from './logic/pathFinder';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'project';

  /**
   *
   */
  constructor() {
    //super();
    
    let d = new PathFinder();
  }
}

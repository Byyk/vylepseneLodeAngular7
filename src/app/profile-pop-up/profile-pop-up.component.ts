import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {LoginService} from "../services/login.service";
import {faCog, faCoins} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile-pop-up',
  templateUrl: './profile-pop-up.component.html',
  styleUrls: ['./profile-pop-up.component.scss']
})
export class ProfilePopUpComponent implements OnInit {
    faConsfig = faCog;
    faGolds = faCoins;
    _opened = false;
    _justOpened = false;

    @Output()
    public closed = new EventEmitter();

    @Input()  get opened() {return this._opened;}
    @Output() openedChange = new EventEmitter();

    set opened(val) {
        this._opened = val;
        this._justOpened = val;
        this.openedChange.emit(val);
    }

    @HostListener('document:click', ['$event'])
    clickout(event) {
        if(!this.er.nativeElement.contains(event.target)) {
            if(this._justOpened)
                return this._justOpened = false;
            if(this.opened) this.opened = false;
        }
    }

    constructor(
        public ls: LoginService,
        private er: ElementRef
    ) {}

    ngOnInit() {
    }

}

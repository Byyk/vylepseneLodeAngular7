import {Observable} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {map} from "rxjs/operators";

export class Breakpointy {
    constructor(public breakpointObserver: BreakpointObserver) {}
    mapuj = result => result.matches;

    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(map(this.mapuj));
    isSmall$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Small)
        .pipe(map(this.mapuj));
    isMedium$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Medium)
        .pipe(map(this.mapuj));
    isLarge$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Large)
        .pipe(map(this.mapuj));
    isWeb$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Web)
        .pipe(map(this.mapuj));

}

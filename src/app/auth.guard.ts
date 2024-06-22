import { Injectable, inject } from "@angular/core";
import {
    CanActivateFn,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from "@angular/router";
import { map, catchError } from "rxjs";
import { CurrentuserService } from "./currentuser.service";

@Injectable({
    providedIn: "root",
})
export class AuthGuard {
    constructor(
        authService: CurrentuserService,
        private router: Router,
    ) {
        console.log(authService.isLoggedIn);
    }
}

export const canActivateGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
) => {
    if (inject(CurrentuserService).isLoggedIn) {
        // inject(Router).navigate(['']);
        console.log("user is logged in");
        return true;
    } else {
        // inject(Router).navigate(['login']);
        return false;
    }
};

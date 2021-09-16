import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ErrorService } from "./error.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private snackBar: MatSnackBar, private zone: NgZone) {}

  handleError(error: Error) {

    /*this.zone.run(() =>
      this.errorService.PostError(
        error.message || "Undefined client error"
    ));*/

    this.zone.run(() => {
      console.error("Error from global error handler", error);
      this.snackBar.open(error.message, "Errore", {
        duration: 2000
      });
    });
  }
}

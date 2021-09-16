import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  constructor() { }

  firstName(): Validators {
    return Validators.pattern(/^([A-Za-z][-a-zÀ-ÿ']*[ ]*)+$/);
  }

  lastName(): Validators {
    return Validators.pattern(/^([A-Za-z][-a-zÀ-ÿ']*[ ]*)+$/);
  }

  userName(): Validators {
    return Validators.pattern(/^(?!.*\.\.)(?!.*\_\_)(?!.*\-\-)(?!.*^\d+$)[^\W][\w.-]{0,}$/);
  }

  password(): Validators {
    return Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?\-_&.])[A-Za-z\d$@$!%*\-_?&.].{7,}/);
  }

  codiceFiscale(): Validators {
    return Validators.pattern(/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i);
  }

  indirizzoIp(): Validators {
    return Validators.pattern(/([0-9]{1,3}\.){3}[0-9]{1,3}/);
  }
}

/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Action} from '@ngrx/store';
import * as securityActions from '../security.actions';

@Injectable()
export class SecurityRouteEffects {

  @Effect({ dispatch: false })
  loginSuccess$: Observable<Action> = this.actions$
    .ofType(securityActions.LOGIN_SUCCESS).pipe(
    tap((payload) => this.router.navigate(['/'])));

  @Effect({ dispatch: false })
  logoutSuccess$: Observable<Action> = this.actions$
    .ofType(securityActions.LOGOUT_SUCCESS).pipe(
    tap((payload) => this.router.navigate(['/login'])));

  @Effect({ dispatch: false })
  passwordChangeSuccess$: Observable<Action> = this.actions$
    .ofType(securityActions.CHANGE_PASSWORD_SUCCESS).pipe(
    tap((payload) => this.router.navigate(['/'])));

  constructor(private actions$: Actions, private router: Router) { }
}

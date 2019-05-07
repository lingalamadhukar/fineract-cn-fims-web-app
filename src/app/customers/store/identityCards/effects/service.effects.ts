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
import { of, Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { CustomerService } from '../../../../services/customer/customer.service';
import { Injectable } from '@angular/core';
import * as identificationCards from '../identity-cards.actions';
import { map, debounceTime, takeUntil, skip, switchMap, mergeMap, catchError } from 'rxjs/operators';

@Injectable()
export class CustomerIdentificationCardApiEffects {

  @Effect()
  loadAll$: Observable<Action> = this.actions$
    .ofType(identificationCards.LOAD_ALL)
    .pipe(
      debounceTime(300),
      map((action: identificationCards.LoadAllAction) => action.payload),
      switchMap(id => {
        const nextSearch$ = this.actions$.ofType(identificationCards.LOAD_ALL).pipe(skip(1));

        return this.customerService.fetchIdentificationCards(id)
          .pipe(
            takeUntil(nextSearch$),
            map(identifications => new identificationCards.LoadAllCompleteAction(identifications)),
            catchError(() => of(new identificationCards.LoadAllCompleteAction([]))));
      }));

  @Effect()
  createIdentificationCard$: Observable<Action> = this.actions$
    .ofType(identificationCards.CREATE).pipe(
      map((action: identificationCards.CreateIdentityCardAction) => action.payload),
      mergeMap(payload =>
        this.customerService.createIdentificationCard(payload.customerId, payload.identificationCard).pipe(
          map(() => new identificationCards.CreateIdentityCardSuccessAction({
            resource: payload.identificationCard,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new identificationCards.CreateIdentityCardFailAction(error))))
      ));

  @Effect()
  updateIdentificationCard$: Observable<Action> = this.actions$
    .ofType(identificationCards.UPDATE).pipe(
      map((action: identificationCards.UpdateIdentityCardAction) => action.payload),
      mergeMap(payload =>
        this.customerService.updateIdentificationCard(payload.customerId, payload.identificationCard).pipe(
          map(() => new identificationCards.UpdateIdentityCardSuccessAction({
            resource: payload.identificationCard,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new identificationCards.UpdateIdentityCardFailAction(error))))
      ));

  @Effect()
  deleteIdentificationCard$: Observable<Action> = this.actions$
    .ofType(identificationCards.DELETE).pipe(
      map((action: identificationCards.DeleteIdentityCardAction) => action.payload),
      mergeMap(payload =>
        this.customerService.deleteIdentificationCard(payload.customerId, payload.identificationCard.number).pipe(
          map(() => new identificationCards.DeleteIdentityCardSuccessAction({
            resource: payload.identificationCard,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new identificationCards.DeleteIdentityCardFailAction(error))))
      ));

  constructor(private actions$: Actions, private customerService: CustomerService) { }

}

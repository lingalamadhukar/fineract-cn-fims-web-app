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
import * as definitionActions from '../product.actions';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { DepositAccountService } from '../../../services/depositAccount/deposit-account.service';
import { emptySearchResult } from '../../../common/store/search.reducer';
import { map, debounceTime, switchMap, mergeMap, catchError, skip, takeUntil } from 'rxjs/operators';

@Injectable()
export class DepositProductDefinitionApiEffects {

  @Effect()
  search$: Observable<Action> = this.actions$
    .ofType(definitionActions.SEARCH)
    .pipe(
      debounceTime(300),
      switchMap(() => {
        const nextSearch$ = this.actions$.ofType(definitionActions.SEARCH).pipe(skip(1));

        return this.depositService.fetchProductDefinitions()
          .pipe(
            takeUntil(nextSearch$),
            map(products => new definitionActions.SearchCompleteAction({
              elements: products,
              totalElements: products.length,
              totalPages: 1
            })),
            catchError(() => of(new definitionActions.SearchCompleteAction(emptySearchResult()))));
      }));

  @Effect()
  createProduct$: Observable<Action> = this.actions$
    .ofType(definitionActions.CREATE).pipe(
      map((action: definitionActions.CreateProductDefinitionAction) => action.payload),
      mergeMap(payload =>
        this.depositService.createProductDefinition(payload.productDefinition).pipe(
          map(() => new definitionActions.CreateProductDefinitionSuccessAction({
            resource: payload.productDefinition,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new definitionActions.CreateProductDefinitionFailAction(error))))
      ));

  @Effect()
  updateProduct$: Observable<Action> = this.actions$
    .ofType(definitionActions.UPDATE).pipe(
      map((action: definitionActions.UpdateProductDefinitionAction) => action.payload),
      mergeMap(payload =>
        this.depositService.updateProductDefinition(payload.productDefinition).pipe(
          map(() => new definitionActions.UpdateProductDefinitionSuccessAction({
            resource: payload.productDefinition,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new definitionActions.UpdateProductDefinitionFailAction(error))))
      ));

  @Effect()
  deleteProduct$: Observable<Action> = this.actions$
    .ofType(definitionActions.DELETE).pipe(
      map((action: definitionActions.DeleteProductDefinitionAction) => action.payload),
      mergeMap(payload =>
        this.depositService.deleteProductDefinition(payload.productDefinition.identifier).pipe(
          map(() => new definitionActions.DeleteProductDefinitionSuccessAction({
            resource: payload.productDefinition,
            activatedRoute: payload.activatedRoute
          })),
          catchError((error) => of(new definitionActions.DeleteProductDefinitionFailAction(error))))
      ));

  @Effect()
  executeCommand$: Observable<Action> = this.actions$
    .ofType(definitionActions.EXECUTE_COMMAND).pipe(
      map((action: definitionActions.ExecuteCommandAction) => action.payload),
      mergeMap(payload =>
        this.depositService.processCommand(payload.definitionId, payload.command).pipe(
          map(() => new definitionActions.ExecuteCommandSuccessAction(payload)),
          catchError((error) => of(new definitionActions.ExecuteCommandFailAction(error))))
      ));

  constructor(private actions$: Actions, private depositService: DepositAccountService) { }
}

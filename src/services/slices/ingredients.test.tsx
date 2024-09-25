import { describe, expect, test } from '@jest/globals';
import {
  getIngredients,
  getIngredientsList,
  getIngredientsLoadingState,
  getIngredientsState,
  ingredientsSlice,
  initialState
} from './ingredients';

import { ingredientsMockData } from './testData';
import { configureStore } from '@reduxjs/toolkit';

describe('ingredientsSlice tests', () => {
  test('selectors test: getIngredientsState, getIngredientsLoadingState, getIngredients', () => {
    const store = configureStore({
      reducer: {
        ingredients: ingredientsSlice.reducer
      },
      preloadedState: {
        ingredients: ingredientsMockData
      }
    });
    const ingredientsState = getIngredientsState(store.getState());
    const loading = getIngredientsLoadingState(store.getState());
    const ingredients = getIngredients(store.getState());
    expect(ingredientsState).toEqual(ingredientsMockData);
    expect(loading).toEqual(ingredientsMockData.loading);
    expect(ingredients).toEqual(ingredientsMockData.ingredients);
  });

  test('Reducer tests: getIngredientsList, fulfilled', () => {
    const action = {
      type: getIngredientsList.fulfilled.type,
      payload: ingredientsMockData.ingredients
    };
    const stateReceived = ingredientsSlice.reducer(initialState, action);
    expect(stateReceived).toEqual(ingredientsMockData);
    expect(stateReceived.loading).toEqual(false);
  });

  test('Reducer tests: getIngredientsList, rejected', () => {
    const stateReceived = ingredientsSlice.reducer(
      initialState,
      getIngredientsList.rejected(new Error('error'), 'Testing error')
    );
    expect(stateReceived.ingredients).toEqual([]);
    expect(stateReceived.loading).toEqual(false);
    expect(stateReceived.error).toEqual('error');
  });

  test('Reducer tests: getIngredientsList, pending', () => {
    const stateReceived = ingredientsSlice.reducer(
      initialState,
      getIngredientsList.pending('')
    );
    expect(stateReceived.loading).toEqual(true);
  });
});

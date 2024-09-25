import {
  constructorSlice,
  addItem,
  deleteItem,
  clearAll,
  updateAll,
  initialState,
  TConstructorState,
  swapIngredient,
  constructorSelector
} from './constructor';
import {
  allIngredientsWithDeletedIngredient,
  singleBunIngredientWId,
  singleBunIngredientWOId,
  singleNonBunIngredientWId,
  singleNonBunIngredientWOId,
  allNonBunIngredientsWId,
  orderedIngredientsWId,
  orderedIngredientsWOId,
  allNonBunIngredientsWOIdSwap1to2,
  allNonBunIngredientsWOIdSwap1to0
} from './testData';

import { TConstructorIngredient, TIngredient } from '@utils-types';

function deleteId(obj: TConstructorIngredient) {
  return (({ id, ...params }) => params)(obj);
}

function deleteIdFromTheArray(array: TConstructorIngredient[]) {
  const ingredientsWithoutId: TIngredient[] = [];
  array.forEach((ingredient) => {
    ingredientsWithoutId.push(deleteId(ingredient));
  });
  return ingredientsWithoutId;
}

describe('constructorSlice tests', () => {
  test('add ingredient: non-bun', () => {
    const newState = constructorSlice.reducer(
      initialState,
      addItem(singleNonBunIngredientWId)
    );

    const { ingredients, bun } = newState;

    const ingredientsWithoutId = deleteIdFromTheArray(ingredients);

    expect(null).toEqual(bun);
    expect([singleNonBunIngredientWOId]).toEqual(ingredientsWithoutId);
  });
  test('add ingredient: bun', () => {
    const newState = constructorSlice.reducer(
      initialState,
      addItem(singleBunIngredientWId)
    );

    const { ingredients, bun } = newState;

    let bunWithoutId = null;
    if (bun?.id) {
      bunWithoutId = deleteId(bun);
    }

    expect(singleBunIngredientWOId).toEqual(bunWithoutId);
    expect(ingredients).toEqual([]);
  });
  test('remove ingredient', () => {
    const initialStateFromConstants: TConstructorState = {
      bun: null,
      ingredients: allNonBunIngredientsWId
    };
    const newState = constructorSlice.reducer(
      initialStateFromConstants,
      deleteItem(singleNonBunIngredientWId)
    );

    const { ingredients } = newState;

    const ingredientsWithoutId = deleteIdFromTheArray(ingredients);

    expect(allIngredientsWithDeletedIngredient).toEqual(ingredientsWithoutId);
  });

  test('clear ingredients', () => {
    const initialStateFromConstants: TConstructorState = {
      bun: singleBunIngredientWId,
      ingredients: allNonBunIngredientsWId
    };
    const newState = constructorSlice.reducer(
      initialStateFromConstants,
      clearAll()
    );

    const { ingredients, bun } = newState;

    expect(ingredients).toEqual([]);
    expect(bun).toEqual(null);
  });
  test('update ingredients', () => {
    const initialStateFromConstants: TConstructorState = {
      bun: singleBunIngredientWId,
      ingredients: allNonBunIngredientsWId
    };
    const newState = constructorSlice.reducer(
      initialStateFromConstants,
      updateAll(orderedIngredientsWId)
    );

    const { ingredients } = newState;

    const ingredientsWithoutId = deleteIdFromTheArray(ingredients);

    expect(ingredientsWithoutId).toEqual(orderedIngredientsWOId);
  });
  test('move ingredient down', () => {
    const initialStateFromConstants: TConstructorState = {
      bun: singleBunIngredientWId,
      ingredients: allNonBunIngredientsWId
    };
    const newState = constructorSlice.reducer(
      initialStateFromConstants,
      swapIngredient({ index: 1, step: 1 })
    );

    const { ingredients } = newState;

    const ingredientsWithoutId = deleteIdFromTheArray(ingredients);

    expect(ingredientsWithoutId).toEqual(allNonBunIngredientsWOIdSwap1to2);
  });
  test('move ingredient up', () => {
    const initialStateFromConstants: TConstructorState = {
      bun: singleBunIngredientWId,
      ingredients: allNonBunIngredientsWId
    };
    const newState = constructorSlice.reducer(
      initialStateFromConstants,
      swapIngredient({ index: 1, step: -1 })
    );

    const { ingredients } = newState;

    const ingredientsWithoutId = deleteIdFromTheArray(ingredients);

    expect(ingredientsWithoutId).toEqual(allNonBunIngredientsWOIdSwap1to0);
  });

  test('selectItems returns state', () => {
    const newState = {
      constructorIngredient: {
        bun: singleBunIngredientWId,
        ingredients: allNonBunIngredientsWId
      }
    };
    const receivedState = constructorSelector.selectItems(newState);
    expect(receivedState).toEqual(newState.constructorIngredient);
  });
});

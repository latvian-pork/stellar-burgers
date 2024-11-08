const modalSelector = '#modals';
const bodySelector = 'body';
const overlaySelector = '#overlay';

describe('main page and modals test', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.visit('/');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('add ingredient', () => {
    cy.get(`[data-cy=${'buns'}]`).as('buns');
    cy.get('[data-cy=mains]').as('mains');
    cy.get('[data-cy=sauces]').as('sauces');

    cy.get('@buns').contains('Добавить').click();
    cy.get('@mains').contains('Добавить').click();
    cy.get('@sauces').contains('Добавить').click();

    cy.get('.constructor-element_pos_top').as('constructorUp');
    cy.get('@constructorUp').contains('Краторная булка N-200i (верх)');
    cy.get('.constructor-element').as('constructorMiddle');
    cy.get('@constructorMiddle').contains('Биокотлета из марсианской Магнолии');
    cy.get('.constructor-element_pos_bottom').as('constructorDown');
    cy.get('@constructorDown').contains('Краторная булка N-200i (низ)');

    cy.get('.move_button').as('moveButtons');
    cy.get('@moveButtons').then((buttons) => {
      const moveDownButton = buttons[1];
      moveDownButton.click();
      cy.get('.constructor-element').as('constructorMiddle');
      cy.get('@constructorMiddle').contains('Соус Spicy-X');
    });
  });

  it('modal:closed test', () => {
    cy.get(modalSelector).children().should('have.length', 0);
  });

  it('modal:open test', () => {
    cy.contains('Соус фирменный Space Sauce').click();
    cy.get(modalSelector).children().should('have.length', 2);
    cy.get(modalSelector).contains('Соус фирменный Space Sauce');
  });

  it('modal: button close', () => {
    cy.contains('Соус фирменный Space Sauce').click();
    cy.get(modalSelector).find('button').click();
    cy.get(modalSelector).children().should('have.length', 0);
  });

  it('modal: esc button close test', () => {
    cy.contains('Соус фирменный Space Sauce').click();
    cy.get(bodySelector).type('{esc}');
    cy.get(modalSelector).children().should('have.length', 0);
  });

  it('modal: overlay click close test', () => {
    cy.contains('Соус фирменный Space Sauce').click();
    cy.get(overlaySelector).click({ force: true });
    cy.get(modalSelector).children().should('have.length', 0);
  });
});

describe('order tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('POST', '/api/auth/login', { fixture: 'user.json' });
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' });
    cy.visit('/');
    cy.setCookie('accessToken', 'accessToken');
    window.localStorage.setItem('refreshToken', 'refreshToken');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('order placing test', () => {
    cy.get(`[data-cy=${'buns'}]`).as('buns');
    cy.get('[data-cy=mains]').as('mains');
    cy.get('[data-cy=sauces]').as('sauces');

    cy.get('@buns').contains('Добавить').click();
    cy.get('@mains').contains('Добавить').click();
    cy.get('@sauces').contains('Добавить').click();

    cy.contains('Оформить заказ').click();
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' });
    cy.get(modalSelector).children().should('have.length', 2);
    cy.get(modalSelector).find('h2').contains(41975);
    cy.get(bodySelector).type('{esc}');
    cy.get(modalSelector).children().should('have.length', 0);

    cy.get('.text_type_main-default').contains('Выберите булки');
    cy.get('.text_type_main-default').contains('Выберите начинку');
  });
});

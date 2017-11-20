import { MiniCalculatorPage } from './app.po';

describe('mini-calculator App', () => {
  let page: MiniCalculatorPage;

  beforeEach(() => {
    page = new MiniCalculatorPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

import { validateUser } from '../../services/authService';

describe('Auth Service', () => {
  it('returns true for correct credentials', () => {
    expect(validateUser('test@domain.com', '123456')).toBe(true);
  });

  it('returns false for incorrect credentials', () => {
    expect(validateUser('wrong@domain.com', 'wrong')).toBe(false);
  });
});

import { calculateTotalIncentive } from '../../services/claimUtils';

describe('Claim Calculation', () => {
  it('should return the correct total', () => {
    const result = calculateTotalIncentive([{ money: 100 }, { money: 200 }]);
    expect(result).toBe(300);
  });
});

// utils/claimUtils.ts
export const calculateTotalIncentive = (rows: { money: number }[]) => {
    return rows.reduce((sum, row) => sum + Number(row.money), 0);
  };
  
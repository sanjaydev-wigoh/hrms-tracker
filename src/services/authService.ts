// services/authService.ts
export const validateUser = (email: string, password: string): boolean => {
    return email === "test@domain.com" && password === "123456";
  };
  
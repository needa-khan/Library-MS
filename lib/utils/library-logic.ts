import { differenceInCalendarDays, isAfter } from "date-fns";

/**
 * Calculates the fine based on the due date.
 * Rule: 10 INR per day after the deadline.
 */
export const calculateFine = (dueDate: Date): { fine: number; daysOverdue: number } => {
  const today = new Date();

  // If today is not after the due date, fine is 0
  if (!isAfter(today, dueDate)) {
    return { fine: 0, daysOverdue: 0 };
  }

  const daysOverdue = differenceInCalendarDays(today, dueDate);
  const fineAmount = daysOverdue * 10;

  return {
    fine: fineAmount,
    daysOverdue: daysOverdue,
  };
};

/**
 * Format currency to INR
 */
export const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
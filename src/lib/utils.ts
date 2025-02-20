
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Response } from "@/pages/Index";
import { QUESTIONS } from "@/components/SurveyForm";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateScore(responses: Response[]): number {
  if (responses.length === 0) return 0;

  let favorableCount = 0;
  let totalResponses = 0;

  responses.forEach((response) => {
    Object.values(response.ratings).forEach((rating) => {
      if (rating !== 9) {
        totalResponses++;
        if (rating >= 4) {
          favorableCount++;
        }
      }
    });
  });

  return totalResponses === 0 ? 0 : Math.round((favorableCount / totalResponses) * 100);
}

export function generateRandomResponses(count: number): Response[] {
  return Array.from({ length: count }, () => ({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ratings: Object.keys(QUESTIONS).reduce(
      (acc, key) => ({
        ...acc,
        [key]: Math.random() < 0.1 ? 9 : Math.floor(Math.random() * 5) + 1,
      }),
      {}
    ),
  }));
}

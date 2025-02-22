import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Response } from "@/pages/Index";
import { QUESTIONS, type CustomQuestion, type EffectivenessQuestion, type Question } from "@/lib/questions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ScoreResult {
  speed: number;
  quality: number;
  impact: number;
  effectiveness: number;
  overall: number;
}

export function calculateSpeedScore(responses: Response[]): number {
  let total = 0;
  let count = 0;

  responses.forEach(response => {
    const rating = response.ratings['prThroughput'];
    if (rating === -1) return; // Skip N/A responses

    const question = QUESTIONS['prThroughput'] as CustomQuestion;
    const option = question.options.find(opt => opt.value === rating);
    
    if (option && option.value !== -1) {
      total += option.value;
      count++;
    }
  });

  return count === 0 ? 0 : total / count;
}

export function calculateQualityScore(responses: Response[]): number {
  let total = 0;
  let count = 0;

  responses.forEach(response => {
    const rating = response.ratings['changeFailureRate'];
    if (rating === -1) return; // Skip N/A responses

    const question = QUESTIONS['changeFailureRate'] as CustomQuestion;
    const option = question.options.find(opt => opt.value === rating);
    
    if (option && option.value !== -1) {
      total += option.value;
      count++;
    }
  });

  return count === 0 ? 0 : total / count;
}

export function calculateImpactScore(responses: Response[]): number {
  let total = 0;
  let count = 0;

  responses.forEach(response => {
    const rating = response.ratings['timeAllocation'];
    if (rating === -1) return; // Skip N/A responses

    // Convert the 1-5 scale to percentage of new features
    let percentage = 0;
    if (rating === 5) percentage = 90;      // 80-100%
    else if (rating === 4) percentage = 70;  // 60-80%
    else if (rating === 3) percentage = 50;  // 40-60%
    else if (rating === 2) percentage = 30;  // 20-40%
    else if (rating === 1) percentage = 10;  // 0-20%
    
    total += percentage;
    count++;
  });

  return count === 0 ? 0 : total / count;
}

function isEffectivenessQuestion(question: Question): question is EffectivenessQuestion {
  return question.type === 'effectiveness';
}

const getEffectivenessQuestions = () => {
  const dxiQuestion = QUESTIONS.developerExperience;
  return isEffectivenessQuestion(dxiQuestion) ? dxiQuestion.subQuestions : {};
};

export function calculateEffectivenessScore(responses: Response[]): number {
  let favorable = 0;
  let total = 0;

  responses.forEach((response) => {
    const dxiQuestion = QUESTIONS.developerExperience;
    if (!isEffectivenessQuestion(dxiQuestion)) return;
    
    Object.keys(dxiQuestion.subQuestions).forEach((key) => {
      const rating = response.ratings[key];
      if (rating !== -1 && rating !== 9) {
        if (rating >= 4) favorable++;  // Count ratings of 4 or 5 as favorable
        total++;  // Count all non-N/A responses
      }
    });
  });

  return total === 0 ? 0 : Math.round((favorable / total) * 100);
}

export function calculatePercentage(favorable: number, total: number) {
  return total === 0 ? 0 : Math.round((favorable / total) * 100);
}

export function calculateScore(responses: Response[]): ScoreResult {
  if (responses.length === 0) {
    return { speed: 0, quality: 0, impact: 0, effectiveness: 0, overall: 0 };
  }

  const scores = {
    speed: { favorable: 0, total: 0 },
    quality: { favorable: 0, total: 0 },
    impact: { favorable: 0, total: 0 },
    effectiveness: { favorable: 0, total: 0 }
  };

  responses.forEach((response) => {
    Object.entries(response.ratings).forEach(([key, rating]) => {
      const question = QUESTIONS[key];
      if (!question || rating === -1) return;

      scores[question.type].total++;
      
      if (question.type === 'effectiveness') {
        if (rating >= 4) scores.effectiveness.favorable++;
      } else if (question.type === 'speed') {
        if (rating >= 3.5) scores.speed.favorable++; // 3-4 times per week or more
      } else if (question.type === 'quality') {
        if (rating >= 4) scores.quality.favorable++; // 0-10% failure rate
      } else if (question.type === 'impact') {
        if (rating >= 4) scores.impact.favorable++; // 60%+ new features
      }
    });
  });

  const result = {
    speed: calculateSpeedScore(responses),
    quality: calculateQualityScore(responses),
    impact: calculateImpactScore(responses),
    effectiveness: calculateEffectivenessScore(responses),
    overall: 0
  };

  // Calculate overall score as average of all areas
  const totalFavorable = Object.values(scores).reduce((sum, score) => sum + score.favorable, 0);
  const totalResponses = Object.values(scores).reduce((sum, score) => sum + score.total, 0);
  result.overall = calculatePercentage(totalFavorable, totalResponses);

  return result;
}

export function generateRandomResponses(count: number): Response[] {
  return Array.from({ length: count }, () => ({
    id: crypto.randomUUID(),
    survey_id: crypto.randomUUID(),
    team_name: 'Generated Team',
    response_number: 0,
    ratings: Object.entries(QUESTIONS).reduce(
      (acc, [key, question]) => {
        if (question.type === 'effectiveness') {
          // Generate values for all subquestions
          const effectivenessQuestion = question as EffectivenessQuestion;
          Object.keys(effectivenessQuestion.subQuestions).forEach(subKey => {
            acc[subKey] = Math.random() < 0.1 ? 9 : Math.floor(Math.random() * 5) + 1;
          });
        } else {
          const options = question.options.filter(opt => opt.value !== -1);
          const randomOption = options[Math.floor(Math.random() * options.length)];
          acc[key] = randomOption.value;
        }
        return acc;
      },
      {} as Record<string, number>
    ),
    created_at: new Date().toISOString()
  }));
}
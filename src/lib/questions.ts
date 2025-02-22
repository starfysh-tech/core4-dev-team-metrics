// src/lib/questions.ts

export interface QuestionOption {
  value: number;
  label: string;
}

// Base interface without benchmarks
export interface BaseQuestionFields {
  title: string;
  description: string;
  type: 'speed' | 'quality' | 'impact' | 'effectiveness';
}

// Add benchmarks at this level
export interface BaseQuestion extends BaseQuestionFields {
  benchmarks: {
    p90: number;
    p75: number;
    p50: number;
  };
}

export interface CustomQuestion extends BaseQuestion {
  type: 'speed' | 'quality' | 'impact';
  options: QuestionOption[];
}

// Sub-questions don't need benchmarks
export interface EffectivenessSubQuestion extends BaseQuestionFields {
  type: 'effectiveness';
}

export interface EffectivenessQuestion extends BaseQuestion {
  type: 'effectiveness';
  options: QuestionOption[];
  subQuestions: Record<string, EffectivenessSubQuestion>;
}

export type Question = CustomQuestion | EffectivenessQuestion;

export const QUESTIONS: Record<string, Question> = {
  // Speed
  prThroughput: {
    title: "PR Throughput",
    description: "In the past month, how frequently have you merged new changes (PRs, MRs) that you were the author of?",
    type: "speed" as const,
    benchmarks: {
      p90: 4.3,
      p75: 4.0,
      p50: 3.5
    },
    options: [
      { value: 0.5, label: "Less than once per week" },
      { value: 1.5, label: "1-2 times per week" },
      { value: 3.5, label: "3-4 times per week" },
      { value: 5.5, label: "5-6 times per week" },
      { value: 7.5, label: "7-8 times per week" },
      { value: 9.0, label: "9+ times per week" },
      { value: -1, label: "I don't know/Not applicable" }
    ]
  },
  
  // Quality
  changeFailureRate: {
    title: "Change Failure Rate",
    description: "For the primary application or service you work on, approximately what percentage of changes to production result in degraded service and require remediation?",
    type: "quality" as const,
    benchmarks: {
      p90: 3.0,
      p75: 3.4,
      p50: 4.0
    },
    options: [
      { value: 5, label: "0-5%" },
      { value: 4, label: "5-10%" },
      { value: 3, label: "10-15%" },
      { value: 2, label: "16-20%" },
      { value: 1, label: "21%+" },
      { value: -1, label: "I don't know/Not applicable" }
    ]
  },
  
  // Impact
  timeAllocation: {
    title: "Time Allocation",
    description: "In the last three months, what percentage of your time was spent on new features vs. maintenance?",
    type: "impact" as const,
    benchmarks: {
      p90: 66.1,
      p75: 61.6,
      p50: 59.2
    },
    options: [
      { value: 5, label: "80-100% new features" },
      { value: 4, label: "60-80% new features" },
      { value: 3, label: "40-60% new features" },
      { value: 2, label: "20-40% new features" },
      { value: 1, label: "0-20% new features" },
      { value: -1, label: "I don't know/Not applicable" }
    ]
  },

  // Effectiveness
  developerExperience: {
    title: "Developer Experience Index (DXI)",
    description: "A measure of the overall developer experience and team effectiveness",
    type: "effectiveness" as const,
    benchmarks: {
      p90: 78,
      p75: 71,
      p50: 60
    },
    options: [
      { value: 5, label: "Excellent" },
      { value: 4, label: "Good" },
      { value: 3, label: "Fair" },
      { value: 2, label: "Poor" },
      { value: 1, label: "Very Poor" },
      { value: -1, label: "N/A" }
    ],
    subQuestions: {
      documentation: {
        title: "Documentation quality and accessibility",
        description: "How well documented and accessible is the codebase?",
        type: "effectiveness" as const
      },
      focus: {
        title: "Deep work and focus time",
        description: "Can you maintain focus without frequent interruptions?",
        type: "effectiveness" as const
      },
      buildTest: {
        title: "Build and test processes",
        description: "How efficient are the build and testing workflows?",
        type: "effectiveness" as const
      },
      confidence: {
        title: "Confidence in making changes",
        description: "How confident are you in making codebase changes?",
        type: "effectiveness" as const
      },
      incidents: {
        title: "Incident response effectiveness",
        description: "How well does the team handle and resolve incidents?",
        type: "effectiveness" as const
      },
      localDev: {
        title: "Local development experience",
        description: "How smooth is the local development process?",
        type: "effectiveness" as const
      },
      planning: {
        title: "Planning processes",
        description: "How effective is the team's planning process?",
        type: "effectiveness" as const
      },
      dependencies: {
        title: "Cross-team dependencies management",
        description: "How well are dependencies between teams managed?",
        type: "effectiveness" as const
      },
      releases: {
        title: "Ease of release process",
        description: "How smooth is the release deployment process?",
        type: "effectiveness" as const
      },
      maintainability: {
        title: "Code maintainability",
        description: "How maintainable and clean is the codebase?",
        type: "effectiveness" as const
      }
    }
  }
}; 
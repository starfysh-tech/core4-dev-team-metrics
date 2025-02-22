import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { QUESTIONS, type CustomQuestion, type EffectivenessQuestion } from "@/lib/questions";
import { type Question } from "@/lib/questions";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface SurveyFormProps {
  onSubmit: (ratings: Record<string, number>) => void;
  onGenerate: () => void;
  teamName?: string;
}

const RATING_LABELS = {
  1: "Unhappy",
  2: "Dissatisfied",
  3: "Neutral",
  4: "Satisfied",
  5: "Happy",
  9: "N/A",
};

const SurveyForm = ({ onSubmit, onGenerate, teamName }: SurveyFormProps) => {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [impactAllocation, setImpactAllocation] = useState({
    features: 33,
    ktlo: 33,
    other: 34,
  });
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const requiredQuestions = Object.keys(QUESTIONS).reduce((acc, key) => {
    const question = QUESTIONS[key];
    if (question.type === 'effectiveness') {
      return [...acc, ...Object.keys((question as EffectivenessQuestion).subQuestions).map(sq => `${key}_${sq}`)];
    }
    return [...acc, key];
  }, [] as string[]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = requiredQuestions.filter(q => !ratings[q]);

    if (missing.length > 0) {
      setMissingFields(missing);
      toast.error("Please complete all required fields");
      
      // Find the first missing field and scroll to it
      const firstMissingField = document.querySelector(`[data-question-id="${missing[0]}"]`);
      if (firstMissingField) {
        firstMissingField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      // If we get here, all fields are filled
      onSubmit(ratings);
      toast.success("Survey submitted successfully!");
      
      // Only clear form after successful submission
      setRatings({});
      setImpactAllocation({ features: 33, ktlo: 33, other: 34 });
      setMissingFields([]);
    } catch (error) {
      toast.error("Failed to submit survey. Please try again.");
    }
  };

  const handleRatingClick = (question: string, rating: number | { value: number; label: string }) => {
    setRatings((prev) => ({
      ...prev,
      [question]: typeof rating === 'number' ? rating : rating.value,
    }));
    setMissingFields(prev => prev.filter(f => f !== question));
  };

  const handleImpactChange = (type: 'features' | 'ktlo' | 'other', value: number) => {
    const others = Object.entries(impactAllocation).filter(([key]) => key !== type);
    const remaining = 100 - value;
    const newAllocation = {
      ...impactAllocation,
      [type]: value,
      [others[0][0]]: Math.round(remaining * (others[0][1] / (others[0][1] + others[1][1]))),
      [others[1][0]]: Math.round(remaining * (others[1][1] / (others[0][1] + others[1][1]))),
    };
    setImpactAllocation(newAllocation);
    // Map to the original 1-5 scale for the API
    const scaledValue = Math.floor((value / 20)) + 1;
    handleRatingClick('timeAllocation', scaledValue);
  };

  const renderQuestionOptions = (key: string, question: Question) => {
    const isMissing = missingFields.includes(key);
    const questionClasses = cn(
      "space-y-3 p-4 rounded-lg",
      isMissing ? "bg-red-900/20 border-2 border-red-500/50" : "bg-gray-800/50"
    );

    if (question.type === 'effectiveness') {
      const effectivenessQ = question as EffectivenessQuestion;
      return (
        <div className="space-y-6">
          <div className="space-y-4 pl-4 border-l-2 border-green-400/20">
            {Object.entries(effectivenessQ.subQuestions).map(([subKey, subQ]) => {
              const subQuestionKey = `${key}_${subKey}`;
              const isSubMissing = missingFields.includes(subQuestionKey);
              return (
                <div 
                  key={subKey} 
                  className={cn(
                    "space-y-2 p-2 rounded",
                    isSubMissing ? "bg-red-900/20 border border-red-500/50" : ""
                  )}
                  data-question-id={subQuestionKey}
                >
                  <div className="space-y-1">
                    <label className="text-sm font-mono text-green-400">
                      {`> ${subQ.title}`}
                    </label>
                    <span className="block text-xs font-mono text-green-400/60">
                      {subQ.description}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {[1, 2, 3, 4, 5, 9].map((rating) => (
                      <Button
                        key={rating}
                        type="button"
                        variant={ratings[subQuestionKey] === rating ? "default" : "outline"}
                        onClick={() => handleRatingClick(subQuestionKey, rating)}
                        className={`
                          h-auto py-2 px-3 font-mono text-xs sm:text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2
                          ${ratings[subQuestionKey] === rating
                            ? rating === 9
                              ? "bg-gray-500 text-white hover:bg-gray-600"
                              : `bg-gradient-to-r ${
                                rating === 1
                                  ? "from-red-500 to-red-400"
                                  : rating === 2
                                  ? "from-orange-500 to-orange-400"
                                  : rating === 3
                                  ? "from-yellow-500 to-yellow-400"
                                  : rating === 4
                                  ? "from-blue-400 to-blue-300"
                                  : "from-blue-600 to-blue-500"
                              } ${rating <= 2 ? "text-white" : "text-black"}`
                            : isSubMissing
                              ? "border-red-500/50 text-red-400/80 hover:bg-red-400/10"
                              : "border-green-400/50 text-green-400/80 hover:bg-green-400/10"
                          }
                        `}
                      >
                        {rating === 9 ? "N/A" : rating}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (key === 'prThroughput') {
      const value = ratings[key] || 0.5;
      return (
        <div className="space-y-4" data-question-id={key}>
          <Slider
            value={[value]}
            min={0.5}
            max={9.0}
            step={0.5}
            onValueChange={([val]) => handleRatingClick(key, val)}
            className={cn(
              "w-full",
              isMissing ? "bg-red-500/20" : ""
            )}
          />
          <div className="flex justify-between text-xs font-mono text-green-400/60">
            <span>&lt;1/week</span>
            <span>3-4/week</span>
            <span>7-8/week</span>
            <span>9+/week</span>
          </div>
          <div className="text-center text-sm font-mono text-green-400">
            {value < 1 ? "Less than once per week" :
             value < 2 ? "1-2 times per week" :
             value < 4 ? "3-4 times per week" :
             value < 6 ? "5-6 times per week" :
             value < 8 ? "7-8 times per week" :
             "9+ times per week"}
          </div>
        </div>
      );
    }

    if (key === 'changeFailureRate') {
      const value = ratings[key] || 5;
      const percentage = value === 5 ? 0 :
                        value === 4 ? 7.5 :
                        value === 3 ? 12.5 :
                        value === 2 ? 18 :
                        value === 1 ? 25 : 0;
      
      return (
        <div className="space-y-4" data-question-id={key}>
          <Slider
            value={[percentage]}
            min={0}
            max={25}
            step={2.5}
            onValueChange={([val]) => {
              const rating = val <= 5 ? 5 :
                           val <= 10 ? 4 :
                           val <= 15 ? 3 :
                           val <= 20 ? 2 : 1;
              handleRatingClick(key, rating);
            }}
            className={cn(
              "w-full",
              isMissing ? "bg-red-500/20" : ""
            )}
          />
          <div className="text-center text-sm font-mono text-green-400">
            {`${percentage}% Change Failure Rate`}
          </div>
        </div>
      );
    }

    if (key === 'timeAllocation') {
      return (
        <div className="space-y-6" data-question-id={key}>
          <div className="grid grid-cols-1 gap-4">
            {[
              { 
                key: 'features', 
                label: 'New Features', 
                description: 'Time spent developing new features and capabilities',
                color: 'bg-blue-500' 
              },
              { 
                key: 'ktlo', 
                label: 'KTLO', 
                description: 'Keep the lights on: incidents, bug fixes, support, maintenance',
                color: 'bg-green-500' 
              },
              { 
                key: 'other', 
                label: 'Other', 
                description: 'Other activities not covered by features or KTLO',
                color: 'bg-purple-500' 
              }
            ].map(({ key: type, label, description, color }) => (
              <div key={type} className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-green-400">{label}</span>
                    <span className="text-green-400/60">{impactAllocation[type as keyof typeof impactAllocation]}%</span>
                  </div>
                  <span className="block text-xs font-mono text-green-400/60">
                    {description}
                  </span>
                </div>
                <Slider
                  value={[impactAllocation[type as keyof typeof impactAllocation]]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([val]) => handleImpactChange(type as 'features' | 'ktlo' | 'other', val)}
                  className={cn(
                    "w-full",
                    isMissing ? "bg-red-500/20" : ""
                  )}
                />
              </div>
            ))}
          </div>
          <div className="text-center text-xs font-mono text-green-400/60">
            Total: {Object.values(impactAllocation).reduce((sum, val) => sum + val, 0)}%
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2" data-question-id={key}>
        {(question as CustomQuestion).options.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={ratings[key] === option.value ? "default" : "outline"}
            onClick={() => handleRatingClick(key, option)}
            className={`
              h-auto py-2 px-3 font-mono text-xs sm:text-sm transition-all duration-200
              ${ratings[key] === option.value
                ? option.value === -1
                  ? "bg-gray-500 text-white hover:bg-gray-600"
                  : `bg-gradient-to-r ${
                    question.type === 'speed'
                      ? "from-blue-600 to-blue-500"
                      : question.type === 'quality'
                      ? option.value >= 4
                        ? "from-green-500 to-green-400"
                        : "from-red-500 to-red-400"
                      : option.value >= 4
                      ? "from-green-500 to-green-400"
                      : "from-yellow-500 to-yellow-400"
                  } ${option.value <= 2 ? "text-white" : "text-black"}`
                : isMissing
                  ? "border-red-500/50 text-red-400/80 hover:bg-red-400/10"
                  : "border-green-400/50 text-green-400/80 hover:bg-green-400/10"
              }
            `}
          >
            {option.label}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <Card className="terminal-card bg-gray-900 border-green-400">
      <CardHeader className="border-b border-green-400/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-mono text-green-400">
            {"// TEAM_SURVEY_FORM"}
          </CardTitle>
          {teamName?.toLowerCase() === 'demo' && (
            <Button
              onClick={onGenerate}
              variant="outline"
              className="font-mono border-orange-400 text-orange-400 hover:bg-orange-400/10 focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
              aria-label="Generate test data"
            >
              GENERATE_TEST_DATA &gt;
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form 
          role="form" 
          aria-label="Team Survey Form" 
          noValidate 
          ref={formRef} 
          onSubmit={handleSubmit} 
          className="space-y-6 py-4"
        >
          <div className="grid gap-8">
          {Object.entries(QUESTIONS).map(([key, question]) => (
            <div key={key} className={cn(
              "space-y-3 p-4 rounded-lg",
              question.type === 'effectiveness' ? "bg-gray-800/50" :
              missingFields.includes(key) ? "bg-red-900/20 border-2 border-red-500/50" : "bg-gray-800/50"
            )}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase text-green-400/60">
                    {question.type}
                  </span>
                  <label className="text-sm font-mono text-green-400">
                    {`> ${question.title}`}
                  </label>
                </div>
                <span className="text-xs font-mono text-green-400/60 pl-4">
                  {question.description}
                </span>
              </div>
              {renderQuestionOptions(key, question)}
            </div>
          ))}
          </div>
          <Button 
            type="submit"
            className="w-full font-mono bg-green-400 text-gray-900 hover:bg-green-500 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2"
          >
            SUBMIT_RESPONSE &gt;
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SurveyForm;

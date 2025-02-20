import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SurveyFormProps {
  onSubmit: (ratings: Record<string, number>) => void;
  onGenerate: () => void;
}

export const QUESTIONS = {
  documentation: {
    title: "Documentation quality and accessibility",
    description: "How well documented and accessible is the codebase?"
  },
  focus: {
    title: "Deep work and focus time",
    description: "Can you maintain focus without frequent interruptions?"
  },
  buildTest: {
    title: "Build and test processes",
    description: "How efficient are the build and testing workflows?"
  },
  confidence: {
    title: "Confidence in making changes",
    description: "How confident are you in making codebase changes?"
  },
  incidents: {
    title: "Incident response effectiveness",
    description: "How well does the team handle and resolve incidents?"
  },
  localDev: {
    title: "Local development experience",
    description: "How smooth is the local development process?"
  },
  planning: {
    title: "Planning processes",
    description: "How effective is the team's planning process?"
  },
  dependencies: {
    title: "Cross-team dependencies management",
    description: "How well are dependencies between teams managed?"
  },
  releases: {
    title: "Ease of release process",
    description: "How smooth is the release deployment process?"
  },
  maintainability: {
    title: "Code maintainability",
    description: "How maintainable and clean is the codebase?"
  }
};

const RATING_LABELS = {
  1: "Very dissatisfied",
  2: "Dissatisfied",
  3: "Neutral",
  4: "Satisfied",
  5: "Very satisfied",
  9: "N/A",
};

const SurveyForm = ({ onSubmit, onGenerate }: SurveyFormProps) => {
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(ratings).length < Object.keys(QUESTIONS).length) {
      toast.error("ERROR: All fields required");
      return;
    }
    onSubmit(ratings);
    setRatings({});
  };

  const handleRatingClick = (question: string, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [question]: rating,
    }));
  };

  return (
    <Card className="terminal-card bg-gray-900 border-green-400">
      <CardHeader className="border-b border-green-400/20">
        <CardTitle className="text-xl font-mono text-green-400">
          {"// TEAM_SURVEY_FORM"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid gap-8">
          {Object.entries(QUESTIONS).map(([key, { title, description }]) => (
          <div key={key} className="space-y-3 p-4 rounded-lg bg-gray-800/50">
            <div className="space-y-1">
              <label className="text-sm font-mono text-green-400">
                {`> ${title}`}
              </label>
              <span className="text-xs font-mono text-green-400/60 pl-4">
                {description}
              </span>
            </div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 9].map((rating) => (
                    <Button
                      key={rating}
                      type="button"
                      variant={ratings[key] === rating ? "default" : "outline"}
                      onClick={() => handleRatingClick(key, rating)}
                      className={`
                        h-auto py-2 px-3 font-mono text-xs sm:text-sm transition-all duration-200
                        ${ratings[key] === rating
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
                          : "border-green-400/50 text-green-400/80 hover:bg-green-400/10"
                        }
                      `}
                    >
                      {rating === 9 ? "N/A" : rating}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t border-green-400/20 flex gap-4">
        <Button 
          type="submit" 
          onClick={handleSubmit}
          className="flex-1 font-mono bg-green-400 text-gray-900 hover:bg-green-500 transition-colors duration-200"
        >
          SUBMIT_RESPONSE &gt;
        </Button>
        <Button
          onClick={onGenerate}
          variant="outline"
          className="flex-1 font-mono border-orange-400 text-orange-400 hover:bg-orange-400/10"
        >
          GENERATE_TEST_DATA &gt;
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SurveyForm;

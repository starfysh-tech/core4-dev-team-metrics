
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

export const QUESTIONS = {
  documentation: "Documentation quality and accessibility",
  focus: "Deep work and focus time",
  buildTest: "Build and test processes",
  confidence: "Confidence in making changes",
  incidents: "Incident response effectiveness",
  localDev: "Local development experience",
  planning: "Planning processes",
  dependencies: "Cross-team dependencies management",
  releases: "Ease of release process",
  maintainability: "Code maintainability",
};

interface SurveyFormProps {
  onSubmit: (ratings: Record<string, number>) => void;
}

const RATING_LABELS = {
  1: "Very dissatisfied",
  2: "Dissatisfied",
  3: "Neutral",
  4: "Satisfied",
  5: "Very satisfied",
  9: "N/A",
};

const SurveyForm = ({ onSubmit }: SurveyFormProps) => {
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
            {Object.entries(QUESTIONS).map(([key, question]) => (
              <div key={key} className="space-y-3 p-4 rounded-lg bg-gray-800/50">
                <label className="text-sm font-mono text-green-400 block">
                  {`> ${question}`}
                </label>
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
      <CardFooter className="border-t border-green-400/20">
        <Button 
          type="submit" 
          onClick={handleSubmit}
          className="w-full font-mono bg-green-400 text-gray-900 hover:bg-green-500 transition-colors duration-200"
        >
          SUBMIT_RESPONSE &gt;
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SurveyForm;

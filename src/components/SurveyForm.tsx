
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
    toast.success("Response processed successfully");
  };

  const handleRatingClick = (question: string, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [question]: rating,
    }));
  };

  return (
    <Card className="terminal-card">
      <CardHeader>
        <CardTitle className="text-xl font-mono text-green-400">
          {"// TEAM_SURVEY_FORM"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-8">
            {Object.entries(QUESTIONS).map(([key, question]) => (
              <div key={key} className="space-y-3">
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
                      className={`h-auto py-2 px-3 font-mono text-xs sm:text-sm ${
                        ratings[key] === rating
                          ? "bg-green-400 text-gray-900 hover:bg-green-500"
                          : "border-green-400 text-green-400 hover:bg-green-400/10"
                      }`}
                    >
                      {rating === 9 ? "N/A" : rating}
                      <span className="hidden md:inline ml-1">
                        {rating !== 9 && `-${RATING_LABELS[rating as keyof typeof RATING_LABELS]}`}
                      </span>
                    </Button>
                  ))}
                </div>
                {ratings[key] && (
                  <p className="text-xs font-mono text-green-600">
                    Selected: {RATING_LABELS[ratings[key] as keyof typeof RATING_LABELS]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          onClick={handleSubmit}
          className="w-full font-mono bg-green-400 text-gray-900 hover:bg-green-500"
        >
          SUBMIT_RESPONSE &gt;
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SurveyForm;

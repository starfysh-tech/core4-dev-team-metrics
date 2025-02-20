import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  return (
    <Card className="terminal-card">
      <CardHeader>
        <CardTitle className="text-xl font-mono text-green-400">
          {"// TEAM_SURVEY_FORM"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {Object.entries(QUESTIONS).map(([key, question]) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-mono text-green-400">
                  {`> ${question}`}
                </label>
                <Select
                  value={ratings[key]?.toString()}
                  onValueChange={(value) =>
                    setRatings((prev) => ({
                      ...prev,
                      [key]: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger className="font-mono bg-gray-900 border-green-400 text-green-400">
                    <SelectValue placeholder="SELECT RATING" />
                  </SelectTrigger>
                  <SelectContent className="font-mono bg-gray-900 border-green-400">
                    <SelectItem value="1">1 - Very dissatisfied</SelectItem>
                    <SelectItem value="2">2 - Dissatisfied</SelectItem>
                    <SelectItem value="3">3 - Neutral</SelectItem>
                    <SelectItem value="4">4 - Satisfied</SelectItem>
                    <SelectItem value="5">5 - Very satisfied</SelectItem>
                    <SelectItem value="9">N/A</SelectItem>
                  </SelectContent>
                </Select>
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

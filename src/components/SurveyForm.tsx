
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
  onGenerate: () => void;
}

const SurveyForm = ({ onSubmit, onGenerate }: SurveyFormProps) => {
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(ratings).length < Object.keys(QUESTIONS).length) {
      toast.error("Please rate all categories");
      return;
    }
    onSubmit(ratings);
    setRatings({});
    toast.success("Response submitted successfully");
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Team Survey</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(QUESTIONS).map(([key, question]) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {question}
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
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
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
        </form>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button type="submit" onClick={handleSubmit}>
          Submit Response
        </Button>
        <Button variant="outline" onClick={onGenerate}>
          Generate 10 Random Responses
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SurveyForm;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateScore } from "@/lib/utils";
import { type Response } from "@/pages/Index";

interface ScoreCardProps {
  responses: Response[];
}

const ScoreCard = ({ responses }: ScoreCardProps) => {
  const score = calculateScore(responses);

  return (
    <Card className="glass overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">
          Team Effectiveness Score
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="animate-score">
          <span className="text-6xl font-bold text-primary">
            {score}%
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Based on {responses.length} responses
        </p>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;

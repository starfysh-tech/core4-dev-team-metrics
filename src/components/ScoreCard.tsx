
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateScore } from "@/lib/utils";
import { type Response } from "@/pages/Index";

interface ScoreCardProps {
  responses: Response[];
}

const ScoreCard = ({ responses }: ScoreCardProps) => {
  const score = calculateScore(responses);

  return (
    <Card className="terminal-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-mono text-green-400">
          {"// EFFECTIVENESS_SCORE"}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="animate-score font-mono">
          <span className="text-6xl font-bold text-green-400">
            {score}%
          </span>
        </div>
        <p className="text-sm text-green-600 font-mono">
          {`> ${responses.length} responses processed`}
        </p>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;

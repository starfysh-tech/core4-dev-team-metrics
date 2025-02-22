import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateScore } from "@/lib/utils";
import { type Response } from "@/pages/Index";
import { QUESTIONS } from "@/lib/questions";

interface ScoreCardProps {
  responses: Response[];
}

const formatScore = (type: string, score: number) => {
  switch (type) {
    case 'Speed':
      return `${score.toFixed(1)} PR's/w`;
    case 'Quality':
    case 'Impact':
      return `${score.toFixed(1)}%`;
    case 'Effectiveness':
      return score.toString();
    default:
      return `${score}%`;
  }
};

const getScoreColor = (type: string, score: number, benchmarks: { p90: number; p75: number; p50: number; } | null) => {
  if (!benchmarks) return "gray";
  
  // For Quality (Change Failure Rate), lower is better
  if (type === 'Quality') {
    if (score <= benchmarks.p90) return "green";
    if (score <= benchmarks.p75) return "yellow";
    if (score <= benchmarks.p50) return "orange";
    return "red";
  }
  
  // For all other metrics, higher is better
  if (score >= benchmarks.p90) return "green";
  if (score >= benchmarks.p75) return "yellow";
  if (score >= benchmarks.p50) return "orange";
  return "red";
};

const getBenchmarks = (type: string) => {
  // Convert type to lowercase for comparison
  const questionKey = type.toLowerCase() === 'speed' ? 'prThroughput' :
                     type.toLowerCase() === 'quality' ? 'changeFailureRate' :
                     type.toLowerCase() === 'impact' ? 'timeAllocation' :
                     type.toLowerCase() === 'effectiveness' ? 'developerExperience' : null;
                     
  if (!questionKey) return null;
  
  const question = QUESTIONS[questionKey];
  return question?.benchmarks || null;
};

const ScoreCard = ({ responses }: ScoreCardProps) => {
  const scores = calculateScore(responses);

  const scoreItems = [
    { 
      label: "Speed",
      subLabel: "PR Throughput",
      score: scores.speed 
    },
    { 
      label: "Quality",
      subLabel: "Change Failure Rate",
      score: scores.quality 
    },
    { 
      label: "Impact",
      subLabel: "% of time on new capabilities",
      score: scores.impact 
    },
    { 
      label: "Effectiveness",
      subLabel: "Developer Experience Index (DXI)",
      score: scores.effectiveness 
    }
  ];

  return (
    <Card className="terminal-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-mono text-green-400">
          {"// CORE_4_SCORES"}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scoreItems.map(({ label, subLabel, score }) => {
            const benchmarks = getBenchmarks(label);
            const formattedScore = formatScore(label, score);
            const color = getScoreColor(label, score, benchmarks);
            
            return (
              <div key={label} className="space-y-2">
                <div>
                  <div className="text-2xl font-mono text-green-400">{label}</div>
                  <div className="text-sm font-mono text-green-400/60">{subLabel}</div>
                </div>
                <div className={`text-2xl font-mono ${
                  color === 'green' ? 'text-green-400' :
                  color === 'yellow' ? 'text-yellow-400' :
                  color === 'orange' ? 'text-orange-400' :
                  color === 'red' ? 'text-red-400' :
                  'text-gray-400'
                }`}>
                  {formattedScore}
                </div>
                {benchmarks && (
                <div className="text-xs font-mono space-y-0.5">
                  <div className="text-green-400/80">p90: {formatScore(label, benchmarks.p90)}</div>
                  <div className="text-yellow-400/80">p75: {formatScore(label, benchmarks.p75)}</div>
                  <div className="text-orange-400/80">p50: {formatScore(label, benchmarks.p50)}</div>
                </div>
              )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QUESTIONS } from "./SurveyForm";
import { type Response } from "@/pages/Index";

const COLORS = {
  1: "#ef4444", // Red
  2: "#f97316", // Orange
  3: "#eab308", // Yellow
  4: "#22c55e", // Green
  5: "#3b82f6", // Blue
  9: "#4b5563", // Gray
};

const ResponseChart = ({ responses }: { responses: Response[] }) => {
  const data = Object.entries(QUESTIONS).map(([key, question]) => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 9: 0 };
    responses.forEach((response) => {
      const rating = response.ratings[key];
      counts[rating as keyof typeof counts]++;
    });
    return {
      category: question,
      ...counts,
    };
  });

  return (
    <Card className="terminal-card">
      <CardHeader>
        <CardTitle className="text-xl font-mono text-green-400">
          {"// RESPONSE_DISTRIBUTION"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] md:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
            >
              <XAxis type="number" stroke="#4ade80" />
              <YAxis
                type="category"
                dataKey="category"
                width={140}
                tick={{ fontSize: 11, fill: "#4ade80" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "2px solid #4ade80",
                  borderRadius: "0",
                  color: "#4ade80",
                  fontFamily: "IBM Plex Mono",
                }}
              />
              <Legend
                wrapperStyle={{
                  fontFamily: "IBM Plex Mono",
                  color: "#4ade80",
                }}
              />
              {[1, 2, 3, 4, 5].map((rating) => (
                <Bar
                  key={rating}
                  dataKey={rating}
                  stackId="stack"
                  fill={COLORS[rating as keyof typeof COLORS]}
                  name={`${rating} - ${
                    rating === 1
                      ? "Very dissatisfied"
                      : rating === 2
                      ? "Dissatisfied"
                      : rating === 3
                      ? "Neutral"
                      : rating === 4
                      ? "Satisfied"
                      : "Very satisfied"
                  }`}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponseChart;

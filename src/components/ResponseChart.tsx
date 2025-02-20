
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

interface ResponseChartProps {
  responses: Response[];
}

const COLORS = {
  1: "#ef4444", // Red
  2: "#f97316", // Orange
  3: "#eab308", // Yellow
  4: "#22c55e", // Green
  5: "#3b82f6", // Blue
  9: "#9ca3af", // Gray
};

const ResponseChart = ({ responses }: ResponseChartProps) => {
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
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Response Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 200, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="category"
                width={180}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend />
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

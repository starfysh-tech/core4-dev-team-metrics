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
  const data = Object.entries(QUESTIONS).map(([key, { title }]) => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 9: 0 };
    responses.forEach((response) => {
      const rating = response.ratings[key];
      counts[rating as keyof typeof counts]++;
    });
    return {
      category: title,
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
        <div className="h-[600px] md:h-[700px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 40, left: 60, bottom: 40 }}
              barSize={40}
            >
              <XAxis 
                type="number" 
                stroke="#4ade80"
                tickMargin={8}
              />
              <YAxis
                type="category"
                dataKey="category"
                width={220}
                tick={{ 
                  fontSize: 18, 
                  fill: "#4ade80", 
                  fontFamily: "IBM Plex Mono", 
                  letterSpacing: "0.1em" 
                }}
                tickMargin={4}
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
                  paddingTop: "20px",
                  marginLeft: "16px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "center"
                }}
                iconSize={30}
                formatter={(value) => <span style={{ paddingLeft: "12px", paddingRight: "32px" }}>{value}</span>}
              />
              {[1, 2, 3, 4, 5].map((rating) => (
                <Bar
                  key={rating}
                  dataKey={rating}
                  stackId="stack"
                  fill={COLORS[rating as keyof typeof COLORS]}
                  name={`${rating} - ${
                    rating === 1
                      ? "Unhappy"
                      : rating === 2
                      ? "Dissatisfied"
                      : rating === 3
                      ? "Neutral"
                      : rating === 4
                      ? "Satisfied"
                      : "Happy"
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

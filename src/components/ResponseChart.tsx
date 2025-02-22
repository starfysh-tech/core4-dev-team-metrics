// src/components/ResponseChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Response } from "@/pages/Index";
import { 
  QUESTIONS, 
  type Question,
  type EffectivenessQuestion
} from "@/lib/questions";

const RATING_LABELS = {
  effectiveness: {
    1: "1 - Unhappy",
    2: "2 - Dissatisfied",
    3: "3 - Neutral",
    4: "4 - Satisfied",
    5: "5 - Happy",
    "-1": "N/A"
  },
  speed: {
    1: "< 2 PRs/week",
    2: "1-2 PRs/week",
    3: "3-4 PRs/week",
    4: "5-6 PRs/week",
    5: "7+ PRs/week",
    "-1": "N/A"
  },
  quality: {
    1: "21%+",
    2: "16-20%",
    3: "10-15%",
    4: "5-10%",
    5: "0-5%",
    "-1": "N/A"
  },
  impact: {
    1: "0-20%",
    2: "20-40%",
    3: "40-60%",
    4: "60-80%",
    5: "80-100%",
    "-1": "N/A"
  }
} as const;

const COLORS = {
  1: "#ef4444", // Red
  2: "#f97316", // Orange
  3: "#eab308", // Yellow
  4: "#22c55e", // Green
  5: "#3b82f6", // Blue
  "-1": "#4b5563", // Gray for N/A
} as const;

// Add type guard function
function isEffectivenessQuestion(question: Question): question is EffectivenessQuestion {
  return question.type === 'effectiveness';
}

const ResponseChart = ({ responses }: { responses: Response[] }) => {
  const data = Object.entries(QUESTIONS).map(([key, question]) => {
    if (isEffectivenessQuestion(question)) {
      // Get all sub-questions and their responses
      return Object.entries(question.subQuestions).map(([subKey, subQuestion]) => {
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, "-1": 0 };
        responses.forEach((response) => {
          const rating = response.ratings[subKey];
          if (rating === -1 || rating === 9) counts["-1"]++;
          else counts[rating]++;
        });
        return {
          category: subQuestion.title,
          type: question.type,
          ...counts,
        };
      });
    } else if (question.type === 'speed') {
      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, "-1": 0 };
      responses.forEach((response) => {
        const value = response.ratings[key];
        if (value === -1) {
          counts["-1"]++;
        } else {
          // Map PR throughput values to 1-5 scale
          let rating = 1;
          if (value <= 1.5) rating = 1;      // Less than 2 times per week
          else if (value <= 3.5) rating = 2;  // 1-2 times per week
          else if (value <= 5.5) rating = 3;  // 3-4 times per week
          else if (value <= 7.5) rating = 4;  // 5-6 times per week
          else rating = 5;                    // 7+ times per week
          counts[rating]++;
        }
      });
      
      return [{
        category: question.title,
        type: question.type,
        questionKey: key,
        ...counts,
      }];
    } else if (question.type === 'quality') {
      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, "-1": 0 };
      responses.forEach((response) => {
        const value = response.ratings[key];
        if (value === -1) {
          counts["-1"]++;
        } else {
          counts[value]++;  // Quality already uses 1-5 scale
        }
      });
      
      return [{
        category: question.title,
        type: question.type,
        questionKey: key,
        ...counts,
      }];
    } else if (question.type === 'impact') {
      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, "-1": 0 };
      responses.forEach((response) => {
        const value = response.ratings[key];
        if (value === -1) {
          counts["-1"]++;
        } else {
          counts[value]++;  // Impact already uses 1-5 scale
        }
      });
      
      return [{
        category: question.title,
        type: question.type,
        questionKey: key,
        ...counts,
      }];
    } else {
      const counts: Record<string, number> = {};
      question.options.forEach((opt) => {
        counts[opt.label] = 0;
      });
      
      responses.forEach((response) => {
        const value = response.ratings[key];
        const option = question.options.find(opt => opt.value === value);
        if (option) {
          counts[option.label]++;
        }
      });
      
      return [{
        category: question.title,
        type: question.type,
        questionKey: key,  // Add this for benchmark lookup
        ...counts,
      }];
    }
  }).flat();

  // Group data by type
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, typeof data>);

  return (
    <Card className="terminal-card">
      <CardHeader>
        <CardTitle className="text-xl font-mono text-green-400">
          {"// RESPONSE_DISTRIBUTION"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {Object.entries(groupedData).map(([type, items]) => (
            <div key={type} className="space-y-2">
              <h3 className="text-lg font-mono text-green-400 capitalize">{type}</h3>
              <p className="text-sm font-mono text-green-400/60">
                {type === 'speed' ? QUESTIONS.prThroughput.description :
                 type === 'quality' ? QUESTIONS.changeFailureRate.description :
                 type === 'impact' ? QUESTIONS.timeAllocation.description :
                 type === 'effectiveness' ? "Team effectiveness across key development areas" : ""}
              </p>
              <div className={type === 'effectiveness' ? 'h-[600px]' : 'h-[200px]'}>
                <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={items}
                  layout="vertical"
                  margin={{ top: 0, right: 60, left: 80, bottom: 60 }}
                  barSize={20}
                  barGap={40}
                >
                    <XAxis type="number" stroke="#4ade80" />
                    <YAxis
                      type="category"
                      dataKey="category"
                      width={240}
                      tick={{
                        fill: "#4ade80",
                        fontSize: 18,
                        fontFamily: "IBM Plex Mono",
                      }}
                      tickFormatter={(value) => `${value}`}
                      textAnchor="end"
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
                        marginLeft: "40px",
                        display: "flex",
                        alignItems: "center"
                      }}
                      iconSize={20}
                      formatter={(value) => <span style={{ paddingLeft: "12px", paddingRight: "32px" }}>{value}</span>}
                    />
                    {type === 'effectiveness' || type === 'speed' || type === 'quality' || type === 'impact' ? (
                      [1, 2, 3, 4, 5].map((rating) => (
                        <Bar
                          key={rating}
                          dataKey={rating}
                          stackId="stack"
                          fill={COLORS[rating as keyof typeof COLORS]}
                          name={RATING_LABELS[type as keyof typeof RATING_LABELS][rating as keyof (typeof RATING_LABELS)['effectiveness']]}
                        />
                      ))
                    ) : (
                      <Bar
                        dataKey={Object.keys(items[0] || {})
                          .filter(key => key !== 'category' && key !== 'type' && key !== 'questionKey')[0]}
                        fill={Object.values(COLORS)[0]}
                        name="Score"
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponseChart;
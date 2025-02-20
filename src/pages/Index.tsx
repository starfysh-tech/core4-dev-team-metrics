
import { useState } from "react";
import SurveyForm from "@/components/SurveyForm";
import ScoreCard from "@/components/ScoreCard";
import ResponseChart from "@/components/ResponseChart";
import ResponseTable from "@/components/ResponseTable";
import { generateRandomResponses } from "@/lib/utils";

export interface Response {
  id: string;
  timestamp: string;
  ratings: Record<string, number>;
}

const Index = () => {
  const [responses, setResponses] = useState<Response[]>([]);

  const handleSubmit = (ratings: Record<string, number>) => {
    const newResponse = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ratings,
    };
    setResponses((prev) => [...prev, newResponse]);
  };

  const handleGenerateRandom = () => {
    const randomResponses = generateRandomResponses(10);
    setResponses((prev) => [...prev, ...randomResponses]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
            Developer Team Effectiveness
          </h1>
          <p className="text-gray-600">
            Track and analyze your team's performance metrics
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <ScoreCard responses={responses} />
            <ResponseChart responses={responses} />
          </div>
          <div>
            <SurveyForm onSubmit={handleSubmit} onGenerate={handleGenerateRandom} />
          </div>
        </div>

        <ResponseTable responses={responses} />
      </div>
    </div>
  );
};

export default Index;

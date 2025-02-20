
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import SurveyForm from "@/components/SurveyForm";
import ScoreCard from "@/components/ScoreCard";
import ResponseChart from "@/components/ResponseChart";
import ResponseTable from "@/components/ResponseTable";
import TeamPrompt from "@/components/TeamPrompt";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export interface Response {
  id: string;
  timestamp: string;
  ratings: Record<string, number>;
}

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [teamName, setTeamName] = useState<string | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const team = searchParams.get("team");
    if (team) {
      setTeamName(team);
      fetchResponses(team);
    }
    setLoading(false);
  }, [searchParams]);

  const fetchResponses = async (team: string) => {
    const { data } = await supabase
      .from("responses")
      .select("*")
      .eq("team", team);
    
    if (data) {
      setResponses(data);
    }
  };

  const handleTeamSubmit = (name: string) => {
    setTeamName(name);
    setSearchParams({ team: name });
  };

  const handleSubmit = async (ratings: Record<string, number>) => {
    if (!teamName) return;

    const newResponse = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      team: teamName,
      ratings,
    };

    const { error } = await supabase
      .from("responses")
      .insert(newResponse);

    if (!error) {
      setResponses((prev) => [...prev, newResponse]);
      setShowForm(false);
    }
  };

  if (loading) {
    return null;
  }

  if (!teamName) {
    return <TeamPrompt onSubmit={handleTeamSubmit} />;
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="text-center">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-green-400 font-mono mb-2">
            {`> TEAM "${teamName}" EFFECTIVENESS_`}
          </h1>
          <p className="text-green-600 font-mono">
            {"// System ready for input"}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          {showForm ? (
            <div className="lg:col-span-2">
              <SurveyForm onSubmit={handleSubmit} />
            </div>
          ) : (
            <>
              <div className="space-y-8">
                <ScoreCard responses={responses} />
                <ResponseChart responses={responses} />
              </div>
              <div className="space-y-4">
                <Button 
                  onClick={() => setShowForm(true)}
                  className="w-full font-mono"
                >
                  Submit New Response
                </Button>
                <Button
                  onClick={() => setShowHistory(!showHistory)}
                  variant="outline"
                  className="w-full font-mono flex items-center gap-2"
                >
                  {showHistory ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Hide Response History
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show Response History
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>

        {showHistory && !showForm && (
          <ResponseTable responses={responses} />
        )}
      </div>
    </div>
  );
};

export default Index;

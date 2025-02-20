
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SurveyForm from "@/components/SurveyForm";
import ScoreCard from "@/components/ScoreCard";
import ResponseChart from "@/components/ResponseChart";
import ResponseTable from "@/components/ResponseTable";
import TeamPrompt from "@/components/TeamPrompt";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { generateRandomResponses } from "@/lib/utils";
import { toast } from "sonner";

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
    const initializeTeam = async () => {
      const team = searchParams.get("team");
      if (team) {
        setTeamName(team);
        const { data, error } = await supabase
          .from("responses")
          .select("*")
          .eq("team", team);
        
        if (error) {
          console.error("Error fetching responses:", error);
          toast.error("Failed to fetch responses");
          return;
        }
        
        if (data) {
          setResponses(data);
          // If there's data, show the results view by default
          if (data.length > 0) {
            setShowForm(false);
          }
        }
      }
      setLoading(false);
    };

    initializeTeam();
  }, [searchParams]);

  const handleTeamSubmit = (name: string) => {
    setTeamName(name);
    const params = new URLSearchParams();
    params.set("team", name);
    setSearchParams(params, { replace: true });
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

    if (error) {
      console.error("Error submitting response:", error);
      toast.error("Failed to submit response");
      return;
    }

    setResponses((prev) => [...prev, newResponse]);
    setShowForm(false);
    toast.success("Response submitted successfully");
  };

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("team", teamName || "");
    navigator.clipboard.writeText(url.toString())
      .then(() => toast.success("Share link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy share link"));
  };

  const handleGenerateResponses = async () => {
    if (!teamName) return;

    const newResponses = generateRandomResponses(5).map(response => ({
      ...response,
      team: teamName
    }));

    const { error } = await supabase
      .from("responses")
      .insert(newResponses);

    if (error) {
      console.error("Error generating responses:", error);
      toast.error("Failed to generate responses");
      return;
    }

    setResponses((prev) => [...prev, ...newResponses]);
    toast.success("Generated 5 random responses");
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
                  className="w-full font-mono bg-green-400 text-gray-900 hover:bg-green-500"
                >
                  Submit New Response
                </Button>
                <Button
                  onClick={() => setShowHistory(!showHistory)}
                  variant="outline"
                  className="w-full font-mono flex items-center gap-2 border-green-400 text-green-400 hover:bg-green-400/10"
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
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full font-mono flex items-center gap-2 border-blue-400 text-blue-400 hover:bg-blue-400/10"
                >
                  <Share2 className="w-4 h-4" />
                  Share Team Results
                </Button>
                <Button
                  onClick={handleGenerateResponses}
                  variant="outline"
                  className="w-full font-mono border-orange-400 text-orange-400 hover:bg-orange-400/10"
                >
                  Generate Test Responses
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

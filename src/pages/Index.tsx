import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import SurveyForm, { QUESTIONS } from "@/components/SurveyForm";
import ScoreCard from "@/components/ScoreCard";
import ResponseChart from "@/components/ResponseChart";
import ResponseTable from "@/components/ResponseTable";
import TeamPrompt from "@/components/TeamPrompt";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { generateRandomResponses } from "@/lib/utils";
import { toast } from "sonner";
import Cookies from 'js-cookie';
import TeamResults from "@/components/TeamResults";

export interface Response {
  id: string;
  survey_id: string;
  team_name: string;
  response_number: number;
  ratings: Record<string, number>;
  created_at: string;
}

const validateRatings = (ratings: Record<string, number>): boolean => {
  // Check if all required questions are answered
  const hasAllQuestions = Object.keys(QUESTIONS).every(key => key in ratings);
  if (!hasAllQuestions) {
    toast.error("Please answer all questions");
    return false;
  }

  // Check if all ratings are valid (1-5 or 9)
  const hasValidRatings = Object.values(ratings).every(
    rating => rating === 9 || (rating >= 1 && rating <= 5)
  );
  if (!hasValidRatings) {
    toast.error("Invalid rating values detected");
    return false;
  }

  return true;
};

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [surveyId, setSurveyId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);

  const topRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  
  const handleHistoryToggle = () => {
    setShowHistory(!showHistory);
    setTimeout(() => {
      if (!showHistory) {
        historyRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        topRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  useEffect(() => {
    const initializeSurvey = async () => {
      const id = searchParams.get("id");
      if (id) {
        setSurveyId(id);
        try {
          const { data, error } = await supabase
            .from("responses")
            .select("*")
            .eq("survey_id", id)
            .order("response_number", { ascending: true });
          
          if (error) throw error;
          
          if (data && data.length > 0) {
            setResponses(data);
            setTeamName(data[0].team_name);
            
            // Check if user has submitted
            const hasSubmitted = Cookies.get(`survey_${id}_submitted`);
            setShowForm(!hasSubmitted);
          }
        } catch (error) {
          console.error("Error fetching responses:", error);
          toast.error("Failed to fetch responses");
        }
      }
      setLoading(false);
    };
  
    initializeSurvey();
  }, [searchParams]);

  const handleTeamSubmit = async (name: string) => {
    try {
      // Generate a new survey ID
      const newSurveyId = crypto.randomUUID();
      setSurveyId(newSurveyId);
      setTeamName(name);
      
      // Update URL with the survey ID
      const params = new URLSearchParams(window.location.search);
      params.set("id", newSurveyId);
      setSearchParams(params);
    } catch (error) {
      console.error("Error creating new survey:", error);
      toast.error("Failed to create new survey");
    }
  };

  const handleSubmit = async (ratings: Record<string, number>) => {
    if (!teamName || !surveyId) return;
  
    // Validate ratings
    if (!validateRatings(ratings)) return;
  
    try {
      // Get the next response number
      const nextResponseNumber = responses.length + 1;
  
      const newResponse = {
        survey_id: surveyId,
        team_name: teamName,
        response_number: nextResponseNumber,
        ratings,
      };
  
      const { error } = await supabase
        .from("responses")
        .insert(newResponse);
  
      if (error) throw error;
  
      // Fetch the inserted response to get the generated ID and timestamp
      const { data: insertedResponse, error: fetchError } = await supabase
        .from("responses")
        .select("*")
        .eq("survey_id", surveyId)
        .eq("response_number", nextResponseNumber)
        .single();
  
      if (fetchError) throw fetchError;
  
      if (insertedResponse) {
        Cookies.set(`survey_${surveyId}_submitted`, 'true', { expires: 365 });
        setResponses((prev) => [...prev, insertedResponse]);
        setShowForm(false);
        toast.success("Response submitted successfully");
      }
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Failed to submit response");
    }
  };

  const handleShare = () => {
    if (!surveyId) return;
    
    const url = new URL(window.location.href);
    url.searchParams.set("id", surveyId);
    navigator.clipboard.writeText(url.toString())
      .then(() => toast.success("Share link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy share link"));
  };

  const handleGenerateResponses = async () => {
    if (!teamName || !surveyId) return;
  
    try {
      const startingNumber = responses.length + 1;
      const newResponses = generateRandomResponses(10).map((response, index) => ({  // Changed to 10
        survey_id: surveyId,
        team_name: teamName,
        response_number: startingNumber + index,
        ratings: response.ratings,
      }));
  
      const { error } = await supabase
        .from("responses")
        .insert(newResponses);
  
      if (error) throw error;
  
      // Fetch the newly inserted responses
      const { data: insertedResponses, error: fetchError } = await supabase
        .from("responses")
        .select("*")
        .eq("survey_id", surveyId)
        .gte("response_number", startingNumber)
        .lte("response_number", startingNumber + 9)  // Changed to +9
        .order("response_number", { ascending: true });
  
      if (fetchError) throw fetchError;
  
      if (insertedResponses) {
        // Add this line to set the cookie
        Cookies.set(`survey_${surveyId}_submitted`, 'true', { expires: 365 });
        setResponses((prev) => [...prev, ...insertedResponses]);
        setShowForm(false);
        toast.success("Generated 10 random responses");
      }
    } catch (error) {
      console.error("Error generating responses:", error);
      toast.error("Failed to generate responses");
    }
  };

  const handleDownloadCSV = () => {
    if (!responses.length) return;
  
    const headers = ['Response #', ...Object.values(QUESTIONS).map(q => q.title), 'Date'];
    const csvContent = [
      headers.join(','),
      ...responses.map(response => {
        const row = [
          response.response_number,
          ...Object.keys(QUESTIONS).map(key => 
            response.ratings[key] === 9 ? 'N/A' : response.ratings[key]
          ),
          new Date(response.created_at).toLocaleDateString()
        ];
        return row.join(',');
      })
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${teamName}-responses.csv`;
    link.click();
  };

  if (loading) {
    return null;
  }

  if (!teamName) {
    return <TeamPrompt onSubmit={handleTeamSubmit} />;
  }

  const handleStartNewReport = () => {
    if (surveyId) {
      Cookies.remove(`survey_${surveyId}_submitted`);
    }
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="text-center" ref={topRef}>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-green-400 font-mono mb-2">
            {`> TEAM "${teamName}" EFFECTIVENESS_`}
          </h1>
          <p className="text-green-600 font-mono">
            {"// System ready for input"}
          </p>
        </header>

        <div className="space-y-8">
        {showForm ? (
          <SurveyForm 
            onSubmit={handleSubmit} 
            onGenerate={handleGenerateResponses} 
          />
        ) : (
          <>
            <TeamResults 
              responses={responses} 
              teamName={teamName || ""} 
            />
            <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
              <Button 
                onClick={handleStartNewReport}
                className="w-full font-mono bg-green-400 text-gray-900 hover:bg-green-500"
              >
                Start a New Report
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="w-full font-mono flex items-center gap-2 border-blue-400 text-blue-400 hover:bg-blue-400/10"
              >
                <Share2 className="w-4 h-4" />
                Share with Team Members
              </Button>
              <Button
                onClick={handleHistoryToggle}
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
                onClick={handleDownloadCSV}
                variant="outline"
                className="w-full font-mono flex items-center gap-2 border-green-400 text-green-400 hover:bg-green-400/10"
              >
                DOWNLOAD_CSV &gt;
              </Button>
            </div>
          </>
        )}

        {showHistory && !showForm && (
          <div ref={historyRef} className="mt-8 bg-gray-900/80 backdrop-blur-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-mono text-green-400">Response History</h3>
            </div>
            <ResponseTable responses={responses} />
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Index;

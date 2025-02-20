import { Button } from "@/components/ui/button";
import { Response } from "@/pages/Index";
import ScoreCard from "@/components/ScoreCard";
import ResponseChart from "@/components/ResponseChart";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { QUESTIONS } from "./SurveyForm";

interface TeamResultsProps {
  responses: Response[];
  teamName: string;
  questions: typeof QUESTIONS;
}

const TeamResults = ({ responses, teamName, questions }: TeamResultsProps) => {
    const handleExport = async () => {
      const element = document.getElementById('team-results');
      if (!element) return;
      
      try {
        const canvas = await html2canvas(element);
        const link = document.createElement('a');
        link.download = `${teamName}-team-effectiveness.png`;
        link.href = canvas.toDataURL();
        link.click();
      } catch (error) {
        toast.error('Failed to export image');
      }
    };
  
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6">
        <div id="team-results" className="space-y-8">
          <h2 className="text-xl font-mono text-green-400 mb-4">
            {`> TEAM "${teamName}" EFFECTIVENESS_REPORT`}
          </h2>
          <ScoreCard responses={responses} />
          <div className="w-full">
            <ResponseChart responses={responses} />
          </div>
          <div className="space-y-4">
            {Object.entries(questions).map(([key, { title, description }]) => (
              <div key={key} className="border-t border-green-400/20 pt-4">
                <h3 className="text-sm font-mono text-green-400">{title}</h3>
                <p className="text-xs font-mono text-green-400/60">{description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-green-400/20">
          <Button
            onClick={handleExport}
            variant="outline"
            className="w-full font-mono border-blue-400 text-blue-400 hover:bg-blue-400/10"
          >
            EXPORT_AS_IMAGE &gt;
          </Button>
        </div>
      </div>
    );
  };

export default TeamResults;
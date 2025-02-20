import { Button } from "@/components/ui/button";
import { Response } from "@/pages/Index";
import ScoreCard from "@/components/ScoreCard";
import ResponseChart from "@/components/ResponseChart";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface TeamResultsProps {
  responses: Response[];
  teamName: string;
}

const TeamResults = ({ responses, teamName }: TeamResultsProps) => {
  const handleExport = async () => {
    const element = document.getElementById('team-results');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: 'rgb(17, 24, 39)', // dark background
        useCORS: true,
        scale: 2 // for better quality
      });
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
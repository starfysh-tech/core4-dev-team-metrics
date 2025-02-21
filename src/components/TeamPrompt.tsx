import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TeamPromptProps {
  onSubmit: (teamName: string) => void;
}

const TeamPrompt = ({ onSubmit }: TeamPromptProps) => {
  const [teamName, setTeamName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName.trim()) {
      onSubmit(teamName.trim());
    }
  };

  return (
    <Card className="terminal-card max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle className="text-xl font-mono text-green-400">
          // TEAM IDENTIFICATION REQUIRED
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
            className="font-mono bg-gray-900 border-green-400 text-green-400 placeholder:text-green-700"
          />
          <Button 
            type="submit" 
            className="w-full font-mono bg-green-400 text-gray-900 hover:bg-green-500"
          >
            PROCEED &gt;
          </Button>
        </form>
        <div className="mt-6 font-mono text-green-600/80 text-sm">
          {"// Inspired on the Core 4, the best way to measure and improve your product velocity"}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamPrompt;

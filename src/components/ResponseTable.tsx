
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QUESTIONS, type Question, type EffectivenessQuestion } from "@/lib/questions";
import { type Response } from "@/pages/Index";

interface ResponseTableProps {
  responses: Response[];
}

function isEffectivenessQuestion(question: Question): question is EffectivenessQuestion {
  return question.type === 'effectiveness';
}

const ResponseTable = ({ responses }: ResponseTableProps) => {
  // Get all question keys including effectiveness sub-questions
  const allQuestions = Object.entries(QUESTIONS).reduce((acc, [key, question]) => {
    if (isEffectivenessQuestion(question)) {
      // Add all sub-questions
      Object.entries(question.subQuestions).forEach(([subKey, subQuestion]) => {
        acc.push({ key: subKey, title: subQuestion.title });
      });
    } else {
      acc.push({ key, title: question.title });
    }
    return acc;
  }, [] as { key: string; title: string }[]);

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Response #</TableHead>
              {allQuestions.map(({ key, title }) => (
                <TableHead key={key}>{title}</TableHead>
              ))}
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((response, index) => (
              <TableRow 
                key={response.id}
                className={index % 2 === 0 ? "bg-gray-900/50" : "bg-gray-800/50"}
              >
                <TableCell className="font-mono">{response.response_number}</TableCell>
                {allQuestions.map(({ key }) => (
                  <TableCell key={key} className="font-mono text-center">
                    {response.ratings[key] === 9 ? 'N/A' : response.ratings[key]}
                  </TableCell>
                ))}
                <TableCell className="font-mono">
                  {new Date(response.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ResponseTable;

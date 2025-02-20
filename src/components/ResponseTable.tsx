
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
import { QUESTIONS } from "./SurveyForm";
import { type Response } from "@/pages/Index";

interface ResponseTableProps {
  responses: Response[];
}

const ResponseTable = ({ responses }: ResponseTableProps) => {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Response #</TableHead>
              {Object.entries(QUESTIONS).map(([key, { title }]) => (
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
                  {Object.keys(QUESTIONS).map((key) => (
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

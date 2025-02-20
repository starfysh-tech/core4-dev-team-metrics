
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
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Response History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">#</TableHead>
                {Object.values(QUESTIONS).map((question) => (
                  <TableHead key={question}>{question}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((response, index) => (
                <TableRow key={response.id}>
                  <TableCell>{index + 1}</TableCell>
                  {Object.keys(QUESTIONS).map((key) => (
                    <TableCell key={key}>
                      {response.ratings[key] === 9 ? "N/A" : response.ratings[key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponseTable;

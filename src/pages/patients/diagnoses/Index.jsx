import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Pick a readable diagnosis label for the list.
const pickDiagnosisLabel = (diagnosis) => {
  return diagnosis?.condition || `Diagnosis #${diagnosis?.id ?? ""}`;
};

// Format diagnosis dates for display.
const formatDiagnosisDate = (diagnosis) => {
  const value =
    diagnosis?.diagnosis_date || diagnosis?.date || diagnosis?.createdAt;
  if (!value) return "";
  const numericValue = Number(value);
  if (!Number.isNaN(numericValue)) {
    const ms = numericValue < 1000000000000 ? numericValue * 1000 : numericValue;
    return new Date(ms).toLocaleDateString();
  }
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  return new Date(parsed).toLocaleDateString();
};

export default function DiagnosesIndex() {
  const { id } = useParams();
  const { token } = useAuth();
  const [diagnoses, setDiagnoses] = useState([]);

  // Page controller for the diagnoses table and actions.
  // Load diagnoses linked to the patient.
  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const response = await axios.request({
          method: "GET",
          url: "/diagnoses",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const patientDiagnoses = response.data.filter(
          (diagnosis) => String(diagnosis.patient_id) === String(id)
        );
        setDiagnoses(patientDiagnoses);
      } catch (err) {
        console.log(err);
      }
    };

    if (token) {
      fetchDiagnoses();
    }
  }, [id, token]);

  // Update UI after deleting a diagnosis.
  const onDeleteCallback = (diagnosisId) => {
    setDiagnoses((current) =>
      current.filter((diagnosis) => diagnosis.id !== diagnosisId)
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Diagnoses</h1>
          <p className="text-sm text-muted-foreground">
            Diagnoses for this patient.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to={`/patients/${id}`}>Back</Link>
          </Button>
          <Button asChild>
            <Link to={`/patients/${id}/diagnoses/create`}>
              Create Diagnosis
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableCaption className="text-muted-foreground">
            Diagnosis entries for this patient.
          </TableCaption>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Diagnosis</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[140px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {diagnoses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-24 text-center text-muted-foreground"
                >
                  No diagnoses found.
                </TableCell>
              </TableRow>
            ) : (
              diagnoses.map((diagnosis) => (
                <TableRow key={diagnosis.id} className="hover:bg-muted/40">
                  <TableCell className="font-medium">
                    {pickDiagnosisLabel(diagnosis)}
                  </TableCell>
                  <TableCell>{formatDiagnosisDate(diagnosis)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        asChild
                        className="cursor-pointer"
                        variant="outline"
                        size="icon"
                      >
                        <Link
                          to={`/patients/${id}/diagnoses/${diagnosis.id}/edit`}
                        >
                          <Pencil />
                        </Link>
                      </Button>
                      <DeleteBtn
                        resource="diagnoses"
                        id={diagnosis.id}
                        onDeleteCallback={onDeleteCallback}
                        // Remove linked prescriptions when a diagnosis is deleted.
                        cascade={[
                          { resource: "prescriptions", matchField: "diagnosis_id" },
                        ]}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

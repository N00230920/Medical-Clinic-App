import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { useAuth } from "@/hooks/useAuth";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

// Page: list all patients.
const formatDateOfBirth = (dateOfBirth) => {
  if (!dateOfBirth) return "";
  if (typeof dateOfBirth === "number") {
    const ms = dateOfBirth < 1000000000000 ? dateOfBirth * 1000 : dateOfBirth;
    return new Date(ms).toLocaleDateString();
  }
  const numericValue = Number(dateOfBirth);
  if (!Number.isNaN(numericValue)) {
    const ms = numericValue < 1000000000000 ? numericValue * 1000 : numericValue;
    return new Date(ms).toLocaleDateString();
  }
  const parsed = Date.parse(dateOfBirth);
  if (Number.isNaN(parsed)) return dateOfBirth;
  const date = new Date(parsed);
  return date.toLocaleDateString();
};

export default function Index() {
  const [patients, setPatients] = useState([]);

  const navigate = useNavigate();
  const { token } = useAuth();

  // Load patients for the table.
  useEffect(() => {
    const fetchPatients = async () => {
      const options = {
        method: "GET",
        url: "/patients",
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setPatients(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPatients();
  }, []);

  // Update UI after a patient is deleted.
  const onDeleteCallback = (id) => {
    toast.success("Patient deleted successfully");
    setPatients(patients.filter((patient) => patient.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Patients</h1>
          <p className="text-sm text-muted-foreground">
            Keep patient records accurate and easy to access.
          </p>
        </div>
        {token && (
          <Button asChild variant="outline" className="w-fit">
            <Link size="sm" to="/patients/create">
              Create New Patient
            </Link>
          </Button>
        )}
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableCaption className="text-muted-foreground">
            A list of patients.
          </TableCaption>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="w-[140px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No patients found.
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <TableRow
                  key={patient.id}
                  className="hover:bg-muted/40"
                >
                  <TableCell className="font-medium">
                    {patient.first_name} {patient.last_name}
                  </TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {patient.email}
                  </TableCell>
                  <TableCell>{formatDateOfBirth(patient.date_of_birth)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {patient.address}
                  </TableCell>
                  <TableCell className="text-right">
                    {token && (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/patients/${patient.id}`)}
                        >
                          <Eye />
                        </Button>
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/patients/${patient.id}/edit`)}
                        >
                          <Pencil />
                        </Button>
                        <DeleteBtn
                          onDeleteCallback={onDeleteCallback}
                          resource="patients"
                          id={patient.id}
                          // Cascade delete related records tied to this patient.
                          cascade={[
                            { resource: "prescriptions", matchField: "patient_id" },
                            { resource: "diagnoses", matchField: "patient_id" },
                            { resource: "appointments", matchField: "patient_id" },
                          ]}
                        />
                      </div>
                    )}
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

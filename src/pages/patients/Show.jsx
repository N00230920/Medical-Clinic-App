import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Format DOB values for display.
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
  return new Date(parsed).toLocaleDateString();
};

export default function Show() {
  const [patient, setPatient] = useState([]);
  const { id } = useParams();
  const { token } = useAuth();

  // Load patient profile details.
  useEffect(() => {
    const fetchPatient = async () => {
      const options = {
        method: "GET",
        url: `/patients/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setPatient(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPatient();
  }, [id, token]);



  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
        <CardTitle>
          {patient.first_name} {patient.last_name}
        </CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link to="/patients">Back</Link>
          </Button>
        </div>
        <CardDescription>{patient.email}</CardDescription>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to={`/patients/${id}/diagnoses`}>View Diagnoses</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={`/patients/${id}/prescriptions`}>View Prescriptions</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
        <p>Phone: {patient.phone}</p>
        <p>Date of Birth: {formatDateOfBirth(patient.date_of_birth)}</p>
        <p>Address: {patient.address}</p>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2"></CardFooter>
    </Card>
  );
}

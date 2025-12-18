import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Prescription details page for a specific patient and prescription.
const formatFieldValue = (field, value) => {
  if (value === null || value === undefined) return "N/A";
  if (field.toLowerCase().includes("date")) {
    const numericValue = Number(value);
    if (!Number.isNaN(numericValue)) {
      const ms = numericValue < 1000000000000 ? numericValue * 1000 : numericValue;
      return new Date(ms).toLocaleDateString();
    }
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toLocaleDateString();
    }
  }
  return String(value);
};

export default function PrescriptionsShow() {
  const { id, prescriptionId } = useParams();
  const { token } = useAuth();
  const [prescription, setPrescription] = useState(null);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const response = await axios.request({
          method: "GET",
          url: `/prescriptions/${prescriptionId}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPrescription(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (token) {
      fetchPrescription();
    }
  }, [prescriptionId, token]);

  return (
    <div className="flex w-full justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Prescription Details</CardTitle>
            <CardDescription>
              {prescription?.medication ||
                prescription?.drug ||
                prescription?.name ||
                `Prescription for patient #${id}`}
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to={`/patients/${id}/prescriptions`}>Back</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {prescription ? (
            Object.entries(prescription).map(([field, value]) => (
              <div key={field}>
                <p className="text-xs uppercase text-muted-foreground">
                  {field.replace(/_/g, " ")}
                </p>
                <p className="font-medium">{formatFieldValue(field, value)}</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">Loading...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Prescription Details</h1>
          <p className="text-sm text-muted-foreground">
            Prescription for patient #{id}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/patients/${id}/prescriptions`}>Back</Link>
        </Button>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Prescription</CardTitle>
          <CardDescription>
            {prescription?.medication ||
              prescription?.drug ||
              prescription?.name ||
              "Details"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {prescription ? (
            Object.entries(prescription).map(([field, value]) => (
              <p key={field}>
                <span className="font-medium capitalize">
                  {field.replace(/_/g, " ")}:
                </span>{" "}
                {formatFieldValue(field, value)}
              </p>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";

const pickPrescriptionLabel = (prescription) => {
  return (
    prescription?.medication ||
    prescription?.drug ||
    prescription?.name ||
    `Prescription #${prescription?.id ?? ""}` // Fallback to ID if no name available
  );
};

// Prescription list page for a specific patient.
const formatPrescriptionDate = (prescription) => {
  const value =
    prescription?.prescription_date || prescription?.date || prescription?.createdAt;
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

export default function PrescriptionsIndex() {
  const { id } = useParams();
  const { token } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.request({
          method: "GET",
          url: "/prescriptions",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const patientPrescriptions = response.data.filter(
          (prescription) => String(prescription.patient_id) === String(id)
        );
        setPrescriptions(patientPrescriptions);
      } catch (err) {
        console.log(err);
      }
    };

    if (token) {
      fetchPrescriptions();
    }
  }, [id, token]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.request({
          method: "GET",
          url: "/doctors",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctors(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (token) {
      fetchDoctors();
    }
  }, [token]);

  // Memoized map of doctor IDs to names for quick lookup
  const doctorMap = useMemo(() => {
    return doctors.reduce((acc, doctor) => {
      acc[String(doctor.id)] = `${doctor.first_name} ${doctor.last_name}`.trim();
      return acc;
    }, {});
  }, [doctors]);

  // Callback to remove deleted prescription from state
  const onDeleteCallback = (prescriptionId) => {
    setPrescriptions((current) =>
      current.filter((prescription) => prescription.id !== prescriptionId)
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Prescriptions</h1>
          <p className="text-sm text-muted-foreground">
            Prescriptions for this patient.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to={`/patients/${id}`}>Back</Link>
          </Button>
          <Button asChild>
            <Link to={`/patients/${id}/prescriptions/create`}>
              Create Prescription
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        {prescriptions.length === 0 ? (
          <p className="px-6 py-8 text-sm text-muted-foreground">
            No prescriptions found.
          </p>
        ) : (
          <div className="space-y-3 p-4">
            {prescriptions.map((prescription) => (
              <details
                key={prescription.id}
                className="rounded-lg border bg-background p-4"
              >
                <summary className="cursor-pointer list-none">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">
                      {pickPrescriptionLabel(prescription)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatPrescriptionDate(prescription)}
                    </span>
                  </div>
                </summary>
                <div className="mt-3 space-y-2 text-sm">
                  <p>
                    Doctor:{" "}
                    {doctorMap[String(prescription.doctor_id)] ||
                      prescription.doctor_id ||
                      "N/A"}
                  </p>
                  <p>
                    Dosage: {prescription.dosage || prescription.dose || "N/A"}
                  </p>
                  <p>
                    Start Date:{" "}
                    {formatPrescriptionDate({
                      prescription_date:
                        prescription.start_date || prescription.startDate,
                    }) || "N/A"}
                  </p>
                  <p>
                    End Date:{" "}
                    {formatPrescriptionDate({
                      prescription_date:
                        prescription.end_date || prescription.endDate,
                    }) || "N/A"}
                  </p>
                  <div className="flex gap-2 pt-2">
                    <Button
                      asChild
                      className="cursor-pointer"
                      variant="outline"
                      size="icon"
                    >
                      <Link to={`/patients/${id}/prescriptions/${prescription.id}`}>
                        <Eye />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="cursor-pointer"
                      variant="outline"
                      size="icon"
                    >
                      <Link
                        to={`/patients/${id}/prescriptions/${prescription.id}/edit`}
                      >
                        <Pencil />
                      </Link>
                    </Button>
                    <DeleteBtn
                      resource="prescriptions"
                      id={prescription.id}
                      onDeleteCallback={onDeleteCallback}
                    />
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

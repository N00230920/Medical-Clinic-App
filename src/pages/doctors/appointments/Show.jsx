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

// Format appointment timestamps for display.
const formatAppointmentDate = (value) => {
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

export default function DoctorAppointmentsShow() {
  const { id, appointmentId } = useParams();
  const { token } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [patient, setPatient] = useState(null);
  const [appointment, setAppointment] = useState(null);

  // Load doctor info for header context.
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.request({
          method: "GET",
          url: `/doctors/${id}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctor(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (token) {
      fetchDoctor();
    }
  }, [id, token]);

  // Load appointment details and related patient info.
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.request({
          method: "GET",
          url: `/appointments/${appointmentId}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointment(response.data);

        if (response.data?.patient_id) {
          const patientResponse = await axios.request({
            method: "GET",
            url: `/patients/${response.data.patient_id}`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setPatient(patientResponse.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (token) {
      fetchAppointment();
    }
  }, [appointmentId, token]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Appointment Details</h1>
          <p className="text-sm text-muted-foreground">
            {doctor
              ? `For ${doctor.first_name} ${doctor.last_name}`
              : "For selected doctor"}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/doctors/${id}/appointments`}>Back</Link>
        </Button>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Appointment</CardTitle>
          <CardDescription>
            {appointment
              ? formatAppointmentDate(appointment.appointment_date)
              : "Loading..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Patient:{" "}
            {patient
              ? `${patient.first_name} ${patient.last_name}`
              : appointment?.patient_id || "Unknown"}
          </p>
          <Button asChild variant="outline">
          <Link to={`/patients/${appointment?.patient_id || "Unknown"}`}>Patient Info</Link>
        </Button>
        </CardContent>
      </Card>
    </div>
  );
}

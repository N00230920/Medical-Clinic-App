import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Format appointment timestamps for display.
const formatAppointmentDate = (value) => {
  if (!value) return "";
  const numericValue = Number(value);
  if (!Number.isNaN(numericValue)) {
    const ms = numericValue < 1000000000000 ? numericValue * 1000 : numericValue;
    return new Date(ms).toLocaleString();
  }
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  return new Date(parsed).toLocaleString();
};

export default function DoctorAppointments() {
  const { id } = useParams();
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  // Load appointments and patients for the selected doctor.
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [appointmentsResponse, patientsResponse] = await Promise.all([
          axios.request({
            method: "GET",
            url: "/appointments",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.request({
            method: "GET",
            url: "/patients",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const doctorAppointments = appointmentsResponse.data.filter(
          (appointment) => String(appointment.doctor_id) === String(id)
        );
        setAppointments(doctorAppointments);
        setPatients(patientsResponse.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id, token]);

  // Map patient id to display name for quick lookup in the table.
  const patientMap = useMemo(() => {
    return patients.reduce((acc, patient) => {
      acc[String(patient.id)] = `${patient.first_name} ${patient.last_name}`.trim();
      return acc;
    }, {});
  }, [patients]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Doctor Appointments</h1>
        <Button asChild variant="outline">
          <Link to={`/doctors/${id}`}>Back to Doctor</Link>
        </Button>
      </div>
      <Table>
        <TableCaption>Appointments for this doctor.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Appointment Date</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Patient ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3}>No appointments found.</TableCell>
            </TableRow>
          ) : (
            appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  {formatAppointmentDate(appointment.appointment_date)}
                </TableCell>
                <TableCell>
                  {patientMap[String(appointment.patient_id)] || "Unknown"}
                </TableCell>
                <TableCell>{appointment.patient_id}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

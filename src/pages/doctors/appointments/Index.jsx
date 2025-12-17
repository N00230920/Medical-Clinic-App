import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
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

export default function DoctorAppointmentsIndex() {
  const { id } = useParams();
  const { token } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  // Load doctor details for header context.
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

  // Load appointments and patients for this doctor.
  useEffect(() => {
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

    if (token) {
      fetchData();
    }
  }, [id, token]);

  // Map patient id to display name for quick lookup.
  const patientMap = useMemo(() => {
    return patients.reduce((acc, patient) => {
      acc[String(patient.id)] = `${patient.first_name} ${patient.last_name}`.trim();
      return acc;
    }, {});
  }, [patients]);

  // Update UI after deleting an appointment.
  const onDeleteCallback = (appointmentId) => {
    setAppointments((current) =>
      current.filter((appointment) => appointment.id !== appointmentId)
    );
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Doctor Appointments</h1>
          <p className="text-sm text-muted-foreground">
            {doctor
              ? `Appointments for ${doctor.first_name} ${doctor.last_name}`
              : "Appointments for this doctor"}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/doctors/${id}/`}>
            Back to Doctor
          </Link>
        </Button>
      </div>

      <Table className="mt-4">
        <TableCaption>Appointments for this doctor.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>No appointments found.</TableCell>
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
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      className="cursor-pointer hover:border-blue-500"
                      variant="outline"
                      size="icon"
                    >
                      <Link
                        to={`/doctors/${id}/appointments/${appointment.id}`}
                      >
                        <Eye />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="cursor-pointer hover:border-blue-500"
                      variant="outline"
                      size="icon"
                    >
                      <Link
                        to={`/doctors/${id}/appointments/${appointment.id}/edit`}
                      >
                        <Pencil />
                      </Link>
                    </Button>
                    <DeleteBtn
                      resource="appointments"
                      id={appointment.id}
                      onDeleteCallback={onDeleteCallback}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Format incoming appointment dates for date input.
const formatDateForInput = (value) => {
  if (!value) return "";
  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }
  const numericValue = Number(value);
  if (!Number.isNaN(numericValue)) {
    const ms = numericValue < 1000000000000 ? numericValue * 1000 : numericValue;
    return new Date(ms).toISOString().split("T")[0];
  }
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return "";
  return new Date(parsed).toISOString().split("T")[0];
};

export default function DoctorAppointmentsEdit() {
  const { id, appointmentId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");

  // Load doctor info for context.
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

  // Load patients for selection.
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.request({
          method: "GET",
          url: "/patients",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatients(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (token) {
      fetchPatients();
    }
  }, [token]);

  // Load appointment data to edit.
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
        setPatientId(String(response.data.patient_id));
        setAppointmentDate(formatDateForInput(response.data.appointment_date));
      } catch (err) {
        console.log(err);
      }
    };

    if (token) {
      fetchAppointment();
    }
  }, [appointmentId, token]);

  // Submit appointment updates.
  const submitForm = async (e) => {
    e.preventDefault();
    if (!patientId || !appointmentDate) {
      console.log("Patient and date are required.");
      return;
    }

    const payload = {
      doctor_id: Number(id),
      patient_id: Number(patientId),
      appointment_date: appointmentDate,
    };

    try {
      let response = await axios.request({
        method: "PATCH",
        url: `/appointments/${appointmentId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: payload,
      });
      console.log(response.data);
      navigate(`/doctors/${id}/appointments`, {
        state: {
          type: "success",
          message: "Appointment updated successfully",
        },
      });
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Edit Appointment</h1>
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

      <form onSubmit={submitForm} className="max-w-md space-y-4">
        <Field>
          <FieldLabel>Patient</FieldLabel>
          <Select value={patientId} onValueChange={setPatientId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={String(patient.id)}>
                  {patient.first_name} {patient.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription>Select the patient for this appointment.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel>Appointment Date</FieldLabel>
          <Input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
          />
          <FieldDescription>Select the appointment date.</FieldDescription>
        </Field>

        <Button type="submit" variant="outline">
          Update Appointment
        </Button>
      </form>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";

// Appointment creation form with doctor filtering and date selection.
const parseAppointmentDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const numericValue = Number(value);
  if (!Number.isNaN(numericValue)) { // Check if value is numeric
    const ms = numericValue < 1000000000000 ? numericValue * 1000 : numericValue; // Convert to milliseconds if in seconds
    return new Date(ms); 
  }
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return null; // Invalid date string
  return new Date(parsed);
};

export default function CreateAppoinment() {
  const location = useLocation();
  const { token, user } = useAuth();
  const [dateWindowOpen, setDateWindowOpen] = useState(false); // Popover state for date picker
  const [appointmentDate, setAppointmentDate] = useState(() => // Initial date state
    parseAppointmentDate(location.state?.appointmentDate)
  );
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [specialisation, setSpecialisation] = useState("");
  const [doctorId, setDoctorId] = useState(
    location.state?.doctorId ? String(location.state.doctorId) : "" // Initial doctor ID state
  );
  const [patientId, setPatientId] = useState(
    user?.id ? String(user.id) : ""
  );

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("/doctors");
        setDoctors(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("/patients");
        setPatients(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    if (!location.state) return;
    if (location.state.doctorId) {
      setDoctorId(String(location.state.doctorId));
    }
    if (location.state.appointmentDate) {
      setAppointmentDate(parseAppointmentDate(location.state.appointmentDate)); // Parse and set appointment date
    }
  }, [location.state]);

  // Auto-set specialisation based on selected doctor
  useEffect(() => {
    if (!doctorId) return;
    const selectedDoctor = doctors.find(
      (doctor) => String(doctor.id) === String(doctorId)
    );
    if (selectedDoctor?.specialisation) {
      setSpecialisation(selectedDoctor.specialisation);
    }
  }, [doctors, doctorId]);

  const filteredDoctors = useMemo(() => {
    if (!specialisation) return [];
    return doctors.filter(
      (doctor) => doctor.specialisation === specialisation
    );
  }, [doctors, specialisation]);

  const submitForm = (e) => {
    e.preventDefault();
    if (!doctorId || !patientId || !appointmentDate) {
      console.log("Doctor, patient, and date are required.");
      return;
    }

    const appointmentDateValue = appointmentDate
      ? appointmentDate.toISOString().split("T")[0] // Format as YYYY-MM-DD
      : "";

    const payload = {
      doctor_id: Number(doctorId),
      patient_id: Number(patientId),
      appointment_date: appointmentDateValue,
    };

    const options = {
      method: "POST",
      url: "/appointments",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    };

    axios
      .request(options)
      .then((response) => {
        console.log(response.data);
        toast.success("Appointment created successfully");
      })
      .catch((err) => {
        console.log(err.response?.data || err);
      });
  };

  return (
    <div className="flex w-full max-w-screen items-center justify-center px-4">
    <Card className="w-full max-w-md mt-4">
      <CardHeader>
      </CardHeader>
      <CardContent>
        <form id="form-demo-2" onSubmit={submitForm}>
          <div className="flex flex-col gap-6">
            <Field>
              <FieldLabel>Specialisation</FieldLabel>
              <Select
                value={specialisation}
                onValueChange={(value) => {
                  setSpecialisation(value);
                  setDoctorId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose specialisation" />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                      <SelectItem value="General Practitioner">General Practitioner</SelectItem>
                      <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                      <SelectItem value="Podiatrist">Podiatrist</SelectItem>
                      <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>

                </SelectContent>
              </Select>
              <FieldDescription>
                Select a specialisation to filter doctors.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Select Doctor</FieldLabel>
              <Select
                value={doctorId}
                onValueChange={setDoctorId}
                disabled={!specialisation} // Disable if no specialisation selected
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      specialisation
                        ? "Choose doctor"
                        : "Pick a specialisation first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredDoctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={String(doctor.id)}>
                      {doctor.first_name} {doctor.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>Select a doctor.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Select Patient</FieldLabel>
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
              <FieldDescription>Select a patient.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Date of Appointment</FieldLabel>
              <Popover open={dateWindowOpen} onOpenChange={setDateWindowOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-48 justify-between font-normal"
                  >
                    {appointmentDate
                      ? appointmentDate.toLocaleDateString()
                      : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={appointmentDate}
                    captionLayout="dropdown"
                    onSelect={(selectedDate) => {
                      setAppointmentDate(selectedDate);
                      setDateWindowOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FieldDescription>Select your appointment date.</FieldDescription>
            </Field>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => {}}>
            Reset
          </Button>
          <Button type="submit" form="form-demo-2">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
    </div>
  );
}

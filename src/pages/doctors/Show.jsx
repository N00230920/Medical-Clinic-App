import { useEffect, useMemo, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate, useParams } from 'react-router';
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

// Page: doctor detail view with availability calendar.
export default function Show() {
  const [doctor, setDoctor] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  // Load doctor profile details.
  useEffect(() => {
    const fetchDoctor = async () => {
      const options = {
        method: "GET",
        url: `/doctors/${id}`,
        headers: {
            Authorization: `Bearer ${token}`
        }
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setDoctor(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctor();
  }, []);

  // Load appointments to mark booked dates.
  useEffect(() => {
    const fetchAppointments = async () => {
      const options = {
        method: "GET",
        url: "/appointments",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        let response = await axios.request(options);
        const doctorAppointments = response.data.filter(
          (appointment) => String(appointment.doctor_id) === String(id)
        );
        setAppointments(doctorAppointments);
      } catch (err) {
        console.log(err);
      }
    };

    if (token) {
      fetchAppointments();
    }
  }, [id, token]);

  // Convert appointment timestamps to Date objects for the calendar.
  const bookedDates = useMemo(() => {
    return appointments
      .map((appointment) => {
        const value = Number(appointment.appointment_date);
        if (Number.isNaN(value)) return null;
        const ms = value < 1000000000000 ? value * 1000 : value;
        return new Date(ms);
      })
      .filter(Boolean);
  }, [appointments]);

  return (
    <div className="flex w-full justify-center">
      <Card className="w-full max-w-5xl">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-2xl">
              {doctor.first_name} {doctor.last_name}
            </CardTitle>
            <CardDescription>{doctor.specialisation}</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/doctors">Back</Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border bg-muted/20">
              {doctor.image_path ? (
                <img
                  src={doctor.image_path}
                  alt={`${doctor.first_name || "Doctor"} profile`}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                  No photo available
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase text-muted-foreground">
                Contacts
              </h2>
              <div className="mt-2 space-y-1 text-sm">
                <p>Email: {doctor.email || "N/A"}</p>
                <p>Phone: {doctor.phone || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xs font-semibold uppercase text-muted-foreground">
                Availability
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Booked dates are highlighted.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-3">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={bookedDates}
                modifiers={{ booked: bookedDates }}
                modifiersClassNames={{
                  booked: "bg-destructive/10 text-destructive line-through",
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                disabled={!selectedDate}
                onClick={() =>
                  navigate(`/doctors/${id}/appointments/create`, {
                    state: {
                      doctorId: id,
                      appointmentDate: selectedDate?.toISOString(),
                    },
                  })
                }
              >
                Make an Appointment
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/doctors/${id}/appointments`)}
              >
                Appointments
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  );
}

import CreateAppoinment from "@/components/forms/CreateAppoinment";

// Page: appointment creation entry point.
export default function Appointments() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header + appointment form */}
      <div>
        <h1 className="text-2xl font-semibold">Make an Appointment</h1>
        <p className="text-sm text-muted-foreground">
          Use the form below to create a new appointment.
        </p>
      </div>
      <CreateAppoinment />
    </div>
  );
}

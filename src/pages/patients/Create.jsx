import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

// Page: create a new patient.
export default function Create() {
  const [dobWindowOpen, setDobWindowOpen] = useState(false);
  const [dobDate, setDobDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    phone: "",
    email: "",
    address: "",
  });
  const navigate = useNavigate();
  const { token } = useAuth();

  // Sync input changes into form state.
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Submit the patient to the API.
  const createPatient = async () => {
    const options = {
      method: "POST",
      url: "/patients",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: form,
    };

    try {
      let response = await axios.request(options);
      console.log(response.data);
      setErrorMessage("");
      const fullName = `${response.data.first_name ?? ""} ${
        response.data.last_name ?? ""
      }`.trim();
      navigate("/patients", {
        state: {
          type: "success",
          message: `${
            fullName ? `Patient "${fullName}"` : "Patient"
          } created successfully`,
        },
      });
    } catch (err) {
      console.log(err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        "Failed to create patient. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    }
  };

  // Handle form submit.
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    createPatient();
  };

  return (
    <div className="flex w-full justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Create Patient</CardTitle>
            <CardDescription>Add a new patient record.</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/patients">Back</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                type="text"
                placeholder="First Name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                type="text"
                placeholder="Last Name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Date of Birth</Label>
              <Popover open={dobWindowOpen} onOpenChange={setDobWindowOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-full justify-between font-normal sm:w-56"
                  >
                    {dobDate ? dobDate.toLocaleDateString() : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={dobDate}
                    captionLayout="dropdown"
                    onSelect={(selectedDate) => {
                      setDobDate(selectedDate);
                      setDobWindowOpen(false);
                      setForm((current) => ({
                        ...current,
                        date_of_birth: selectedDate
                          ? selectedDate.toISOString().split("T")[0]
                          : "",
                      }));
                    }}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Select the patient date of birth.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="text"
                placeholder="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </div>
            {errorMessage && (
              <p className="sm:col-span-2 text-sm text-red-600">
                {errorMessage}
              </p>
            )}
            <div className="sm:col-span-2">
              <Button className="cursor-pointer" variant="outline" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

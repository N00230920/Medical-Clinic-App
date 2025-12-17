import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "@/config/api";
import { useNavigate } from "react-router";
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
    <>
      <h1>Create a new Patient</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="First Name"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="text"
          placeholder="Last Name"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
        />
        <div className="mt-2">
          {/* Date-of-birth picker */}
          <label className="block text-sm font-medium">Date of Birth</label>
          <Popover open={dobWindowOpen} onOpenChange={setDobWindowOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="mt-1 w-48 justify-between font-normal"
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
          <p className="text-xs text-muted-foreground mt-1">
            Select your date of birth.
          </p>
        </div>
        <Input
          className="mt-2"
          type="text"
          placeholder="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          className="mt-2"
          type="text"
          placeholder="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
        />
        {errorMessage && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}
        <Button className="mt-4 cursor-pointer" variant="outline" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}

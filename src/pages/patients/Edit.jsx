import { useState, useEffect } from "react";
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
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";

// Normalize stored DOB values for a date input.
const formatDateForInput = (dateOfBirth) => {
  if (!dateOfBirth) return "";
  if (typeof dateOfBirth === "number") {
    const ms = dateOfBirth < 1000000000000 ? dateOfBirth * 1000 : dateOfBirth;
    return new Date(ms).toISOString().split("T")[0];
  }
  const numericValue = Number(dateOfBirth);
  if (!Number.isNaN(numericValue)) {
    const ms = numericValue < 1000000000000 ? numericValue * 1000 : numericValue;
    return new Date(ms).toISOString().split("T")[0];
  }
  const parsed = Date.parse(dateOfBirth);
  if (Number.isNaN(parsed)) return dateOfBirth;
  return new Date(parsed).toISOString().split("T")[0];
};

export default function Edit() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    phone: "",
    email: "",
    address: "",
  });

  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // Load patient details for the edit form.
  useEffect(() => {
    const fetchPatient = async () => {
      const options = {
        method: "GET",
        url: `/patients/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        let patient = response.data;
        setForm({
          first_name: patient.first_name,
          last_name: patient.last_name,
          date_of_birth: formatDateForInput(patient.date_of_birth),
          phone: patient.phone,
          email: patient.email,
          address: patient.address,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchPatient();
  }, []);

  // Sync input changes into form state.
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Submit the updated patient to the API.
  const updatePatient = async () => {
    const options = {
      method: "PATCH",
      url: `/patients/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: form,
    };

    try {
      let response = await axios.request(options);
      console.log(response.data);
      navigate("/patients");
    } catch (err) {
      console.log(err);
    }
  };

  // Handle form submit.
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    updatePatient();
  };

  return (
    <div className="flex w-full justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Edit Patient</CardTitle>
            <CardDescription>Update patient profile details.</CardDescription>
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
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
              />
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
            <div className="sm:col-span-2">
              <Button className="cursor-pointer" variant="outline" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

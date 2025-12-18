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

// Page: edit existing doctor details.
export default function Edit() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    specialization: "",
    phone: "",
    email: "",
  });

  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // Load doctor details for the edit form.
  useEffect(() => {
    const fetchDoctor = async () => {
      const options = {
        method: "GET",
        url: `/doctors/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        let doctor = response.data;
        setForm({
            first_name: doctor.first_name,
            last_name: doctor.last_name,
            specialisation: doctor.specialisation,
            phone: doctor.phone,
            email: doctor.email,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctor();
  }, []);

  // Sync input changes into form state.
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Submit the updated doctor to the API.
  const updateDoctor = async () => {
    const options = {
      method: "PATCH",
      url: `/doctors/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: form,
    };

    try {
      let response = await axios.request(options);
      console.log(response.data);
      navigate("/doctors");
    } catch (err) {
      console.log(err);
    }
  };

  // Handle form submit.
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    updateDoctor();
  };

  return (
    <div className="flex w-full justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Edit Doctor</CardTitle>
            <CardDescription>Update doctor profile details.</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/doctors">Back</Link>
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
              <Label htmlFor="specialisation">Specialisation</Label>
              <Input
                id="specialisation"
                type="text"
                placeholder="Specialisation"
                name="specialisation"
                value={form.specialisation}
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

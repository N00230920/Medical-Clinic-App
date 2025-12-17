import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
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
    <>
      <h1>Update Patient</h1>
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
        <Input
          className="mt-2"
          type="date"
          placeholder="Date of Birth"
          name="date_of_birth"
          value={form.date_of_birth}
          onChange={handleChange}
        />
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
        <Button className="mt-4 cursor-pointer" variant="outline" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}

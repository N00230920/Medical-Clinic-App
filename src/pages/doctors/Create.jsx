import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import axios from "@/config/api";
import { useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";

// Page: create a new doctor.
export default function Create() {
    // Form state for doctor details.
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        specialisation: "",
        phone: "",
        email: ""
    });
    const navigate = useNavigate();
    const { token } = useAuth();

    // Sync input changes into form state.
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        });
    };

    // Submit the doctor to the API.
    const createDoctor = async () => {

        const options = {
            method: "POST",
            url: `/doctors`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: form
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate('/doctors', { state: { 
                type: 'success',
                message: `Doctor "${response.data.name}" created successfully` 
            }});
        } catch (err) {
            console.log(err);
        }

    };

    // Handle form submit.
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        createDoctor();
    };

  return (
    <>
        <h1>Create a new Doctor</h1>
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
            <Select
                value={form.specialisation}
                onValueChange={(value) => {
                    setForm({
                        ...form,
                        specialisation: value
                    });
                }}
            >
                <SelectTrigger className="mt-2">
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
            <Button 
                className="mt-4 cursor-pointer" 
                variant="outline" 
                type="submit" 
            >Submit</Button>
        </form>
    </>
  );
}

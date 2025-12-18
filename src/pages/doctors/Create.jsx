import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import axios from "@/config/api";
import { Link, useNavigate } from 'react-router';
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
            [e.target.name]: e.target.value
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
            navigate('/doctors', {
                state: {
                    type: 'success',
                    message: `Doctor "${response.data.name}" created successfully`
                }
            });
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
        <div className="flex w-full justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Create Doctor</CardTitle>
                        <CardDescription>Add a new doctor profile.</CardDescription>
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
                            <Select
                                value={form.specialisation}
                                onValueChange={(value) => {
                                    setForm({
                                        ...form,
                                        specialisation: value
                                    });
                                }}
                            >
                                <SelectTrigger id="specialisation">
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
                            <Button
                                className="cursor-pointer"
                                variant="outline"
                                type="submit"
                            >
                                Submit
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

import { useEffect, useState } from "react";
import axios from "@/config/api";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import DeleteBtn from "@/components/DeleteBtn";
import { useAuth } from "@/hooks/useAuth";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

// Page: list all doctors.
export default function Index() {
  const [doctors, setDoctors] = useState([]);

  const navigate = useNavigate();
  const { token } = useAuth();
  

  // Load doctors for the table.
  useEffect(() => {
    const fetchDoctors = async () => {
      const options = {
        method: "GET",
        url: "/doctors",
      };

      try {
        let response = await axios.request(options);
        console.log(response.data);
        setDoctors(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctors();
  }, []);

  // Update UI after a doctor is deleted.
  const onDeleteCallback = (id) => {
    toast.success("Doctor deleted successfully");
    setDoctors(doctors.filter(doctor => doctor.id !== id));
  
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Doctors</h1>
          <p className="text-sm text-muted-foreground">
            Manage clinician profiles and contact details.
          </p>
        </div>
        {token && (
          <Button asChild variant="outline" className="w-fit">
            <Link size="sm" to="/doctors/create">
              Create New Doctor
            </Link>
          </Button>
        )}
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableCaption className="text-muted-foreground">
            A list of doctors.
          </TableCaption>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialisation</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-[140px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No doctors found.
                </TableCell>
              </TableRow>
            ) : (
              doctors.map((doctor) => (
                <TableRow
                  key={doctor.id}
                  className="hover:bg-muted/40"
                >
                  <TableCell className="font-medium">
                    {doctor.first_name} {doctor.last_name}
                  </TableCell>
                  <TableCell>{doctor.specialisation}</TableCell>
                  <TableCell>{doctor.phone}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {doctor.email}
                  </TableCell>
                  <TableCell className="text-right">
                    {token && (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/doctors/${doctor.id}`)}
                        >
                          <Eye />
                        </Button>
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/doctors/${doctor.id}/edit`)}
                        >
                          <Pencil />
                        </Button>
                        <DeleteBtn
                          onDeleteCallback={onDeleteCallback}
                          resource="doctors"
                          id={doctor.id}
                          cascade={[
                            { resource: "prescriptions", matchField: "doctor_id" },
                            { resource: "appointments", matchField: "doctor_id" },
                          ]}
                        />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

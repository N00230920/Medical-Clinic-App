import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const buildFieldsFromSample = (sample) => {
  if (!sample) return [];
  return Object.keys(sample).filter(
    (key) => !["id", "createdAt", "updatedAt"].includes(key)
  );
};

const getInputType = (field) => {
  if (field.toLowerCase().includes("date")) return "date";
  if (field.toLowerCase().endsWith("_id")) return "number";
  return "text";
};

const normalizePayload = (form) => {
  const payload = { ...form };
  Object.keys(payload).forEach((key) => {
    if (key.endsWith("_id") && payload[key] !== "") {
      payload[key] = Number(payload[key]);
    }
  });
  return payload;
};

export default function PrescriptionsCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [fields, setFields] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [form, setForm] = useState({ patient_id: id });

  useEffect(() => {
    const fetchSample = async () => {
      try {
        const response = await axios.request({
          method: "GET",
          url: "/prescriptions",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sample = response.data?.[0];
        const sampleFields = buildFieldsFromSample(sample);
        const withPatient = sampleFields.includes("patient_id")
          ? sampleFields
          : ["patient_id", ...sampleFields];
        setFields(withPatient);
        setForm((current) => ({
          ...current,
          ...withPatient.reduce((acc, field) => {
            if (field === "patient_id") return acc;
            acc[field] = "";
            return acc;
          }, {}),
        }));
      } catch (err) {
        console.log(err);
        const fallback = ["patient_id", "doctor_id", "medication", "notes"];
        setFields(fallback);
        setForm((current) => ({
          ...current,
          doctor_id: "",
          medication: "",
          notes: "",
        }));
      }
    };

    if (token) {
      fetchSample();
    }
  }, [id, token]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.request({
          method: "GET",
          url: "/doctors",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctors(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (token) {
      fetchDoctors();
    }
  }, [token]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const response = await axios.request({
          method: "GET",
          url: "/diagnoses",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const patientDiagnoses = response.data.filter(
          (diagnosis) => String(diagnosis.patient_id) === String(id)
        );
        setDiagnoses(patientDiagnoses);
      } catch (err) {
        console.log(err);
      }
    };

    if (token) {
      fetchDiagnoses();
    }
  }, [id, token]);

  const onChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.request({
        method: "POST",
        url: "/prescriptions",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: normalizePayload(form),
      });
      console.log(response.data);
      navigate(`/patients/${id}/prescriptions`, {
        state: { type: "success", message: "Prescription created successfully" },
      });
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  const orderedFields = useMemo(() => {
    if (fields.includes("patient_id")) {
      return ["patient_id", ...fields.filter((field) => field !== "patient_id")];
    }
    return fields;
  }, [fields]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create Prescription</h1>
        <Button asChild variant="outline">
          <Link to={`/patients/${id}/prescriptions`}>Back</Link>
        </Button>
      </div>

      <form onSubmit={submitForm} className="max-w-md space-y-4">
        {orderedFields.map((field) => (
          <Field key={field}>
            <FieldLabel className="capitalize">
              {field.replace(/_/g, " ")}
            </FieldLabel>
            {field === "doctor_id" ? (
              <Select
                value={form[field] || ""}
                onValueChange={(value) => onChange(field, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={String(doctor.id)}>
                      {doctor.first_name} {doctor.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field === "diagnosis_id" ? (
              <Select
                value={form[field] || ""}
                onValueChange={(value) => onChange(field, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose diagnosis" />
                </SelectTrigger>
                <SelectContent>
                  {diagnoses.map((diagnosis) => (
                    <SelectItem key={diagnosis.id} value={String(diagnosis.id)}>
                      {diagnosis.condition || diagnosis.diagnosis || `Diagnosis ${diagnosis.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field === "diagnosis" ? (
              <Select
                value={form[field] || ""}
                onValueChange={(value) => onChange(field, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose diagnosis" />
                </SelectTrigger>
                <SelectContent>
                  {diagnoses.map((diagnosis) => (
                    <SelectItem
                      key={diagnosis.id}
                      value={diagnosis.condition || diagnosis.diagnosis || ""}
                      disabled={!diagnosis.condition && !diagnosis.diagnosis}
                    >
                      {diagnosis.condition || diagnosis.diagnosis || `Diagnosis ${diagnosis.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type={getInputType(field)}
                value={field === "patient_id" ? id : form[field] || ""}
                onChange={(e) => onChange(field, e.target.value)}
                disabled={field === "patient_id"}
              />
            )}
            <FieldDescription>
              {field === "patient_id"
                ? "Patient is locked to this record."
                : field === "doctor_id"
                  ? "Select the prescribing doctor."
                  : field === "diagnosis_id" || field === "diagnosis"
                    ? "Select a diagnosis for this prescription."
                  : `Enter ${field.replace(/_/g, " ")}.`}
            </FieldDescription>
          </Field>
        ))}
        <Button type="submit" variant="outline">
          Create Prescription
        </Button>
      </form>
    </div>
  );
}

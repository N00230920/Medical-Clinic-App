import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

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

export default function DiagnosesCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState({ patient_id: id, condition: "" });

  useEffect(() => {
    const fetchSample = async () => {
      try {
        const response = await axios.request({
          method: "GET",
          url: "/diagnoses",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sample = response.data?.[0];
        const sampleFields = buildFieldsFromSample(sample);
        const withPatient = sampleFields.includes("patient_id")
          ? sampleFields
          : ["patient_id", ...sampleFields];
        const withCondition = withPatient.includes("condition")
          ? withPatient
          : ["condition", ...withPatient];
        setFields(withCondition);
        setForm((current) => ({
          ...current,
          ...withCondition.reduce((acc, field) => {
            if (field === "patient_id") return acc;
            acc[field] = "";
            return acc;
          }, {}),
        }));
      } catch (err) {
        console.log(err);
        const fallback = ["condition", "patient_id", "doctor_id", "notes"];
        setFields(fallback);
        setForm((current) => ({
          ...current,
          condition: "",
          doctor_id: "",
          notes: "",
        }));
      }
    };

    if (token) {
      fetchSample();
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
        url: "/diagnoses",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: normalizePayload(form),
      });
      console.log(response.data);
      navigate(`/patients/${id}/diagnoses`, {
        state: { type: "success", message: "Diagnosis created successfully" },
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
        <h1 className="text-2xl font-semibold">Create Diagnosis</h1>
        <Button asChild variant="outline">
          <Link to={`/patients/${id}/diagnoses`}>Back</Link>
        </Button>
      </div>

      <form onSubmit={submitForm} className="max-w-md space-y-4">
        {orderedFields.map((field) => (
          <Field key={field}>
            <FieldLabel className="capitalize">
              {field === "condition" ? "Diagnosis" : field.replace(/_/g, " ")}
            </FieldLabel>
            <Input
              type={getInputType(field)}
              value={field === "patient_id" ? id : form[field] || ""}
              onChange={(e) => onChange(field, e.target.value)}
              disabled={field === "patient_id"}
            />
            <FieldDescription>
              {field === "patient_id"
                ? "Patient is locked to this record."
                : `Enter ${field.replace(/_/g, " ")}.`}
            </FieldDescription>
          </Field>
        ))}
        <Button type="submit" variant="outline">
          Create Diagnosis
        </Button>
      </form>
    </div>
  );
}

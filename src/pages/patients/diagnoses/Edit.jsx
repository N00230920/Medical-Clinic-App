import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const getInputType = (field) => {
  if (field.toLowerCase().includes("date")) return "date";
  if (field.toLowerCase().endsWith("_id")) return "number";
  return "text";
};

const formatDateField = (field, value) => {
  if (!value) return "";
  if (!field.toLowerCase().includes("date")) return value;
  const numericValue = Number(value);
  if (!Number.isNaN(numericValue)) {
    const ms = numericValue < 1000000000000 ? numericValue * 1000 : numericValue;
    return new Date(ms).toISOString().split("T")[0];
  }
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  return new Date(parsed).toISOString().split("T")[0];
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

export default function DiagnosesEdit() {
  const { id, diagnosisId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const response = await axios.request({
          method: "GET",
          url: `/diagnoses/${diagnosisId}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        const entryFields = Object.keys(data).filter(
          (key) => !["id", "createdAt", "updatedAt"].includes(key)
        );
        const withCondition = entryFields.includes("condition")
          ? entryFields
          : ["condition", ...entryFields];
        setFields(withCondition);
        setForm(
          withCondition.reduce((acc, field) => {
            acc[field] = formatDateField(field, data[field]);
            return acc;
          }, {})
        );
      } catch (err) {
        console.log(err);
      }
    };

    if (token) {
      fetchDiagnosis();
    }
  }, [diagnosisId, token]);

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
        method: "PATCH",
        url: `/diagnoses/${diagnosisId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: normalizePayload(form),
      });
      console.log(response.data);
      navigate(`/patients/${id}/diagnoses`, {
        state: { type: "success", message: "Diagnosis updated successfully" },
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
        <h1 className="text-2xl font-semibold">Edit Diagnosis</h1>
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
              value={form[field] || ""}
              onChange={(e) => onChange(field, e.target.value)}
              disabled={field === "patient_id"}
            />
            <FieldDescription>
              {field === "patient_id"
                ? "Patient is locked to this record."
                : `Update ${field.replace(/_/g, " ")}.`}
            </FieldDescription>
          </Field>
        ))}
        <Button type="submit" variant="outline">
          Update Diagnosis
        </Button>
      </form>
    </div>
  );
}

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";

export default function MoreFormExamples() {
  const [dobWindowOpen, setDobWindowOpen] = useState(false);
  const [dob, setDob] = useState(null);

  const submitForm = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <Card className="w-full max-w-md mt-4">
      <CardHeader>
        <CardTitle>Various Form Examples</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="form-demo-2" onSubmit={submitForm}>
          <div className="flex flex-col gap-6">
            <Field>
              <FieldLabel>Department (Enums)</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="support">Customer Support</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                Select your department or area of work.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Select Performer (API data)</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose performer" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value=""></SelectItem> */}
                </SelectContent>
              </Select>
              <FieldDescription>Select your performer.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Date of Birth</FieldLabel>
              <Popover open={dobWindowOpen} onOpenChange={setDobWindowOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-48 justify-between font-normal"
                  >
                    {dob ? dob.toLocaleDateString() : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={dob}
                    captionLayout="dropdown"
                    onSelect={(selectedDate) => {
                      setDob(selectedDate);
                      setDobWindowOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FieldDescription>Select your dob.</FieldDescription>
            </Field>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => {}}>
            Reset
          </Button>
          <Button type="submit" form="form-demo-2">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}

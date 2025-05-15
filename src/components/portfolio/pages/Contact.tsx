"use client";
import React from "react";
import Button from "@/components/common/Button";
import ResumeDownload from "@/components/portfolio/ResumeDownload";
import { useAlert } from "@/components/alerts/AlertProvider";
import { sendEmail } from "@/components/utils/EmailUtils";
import { AxiosError, AxiosResponse } from "axios";

const formFields = [
  {
    name: "fullName",
    label: "Full Name:",
    type: "text",
    optional: false,
    placeholder: "John Doe",
    fieldType: "text",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    optional: false,
    placeholder: "john.doe@email.com",
    fieldType: "text",
  },
  {
    name: "company",
    label: "Company",
    type: "text",
    optional: true,
    placeholder: "Company Inc.",
    fieldType: "text",
  },
  {
    name: "message",
    label: "Message",
    type: "text",
    optional: false,
    placeholder: "Your message here...",
    fieldType: "textarea",
  },
];
const Contact = () => {
  const [form, setForm] = React.useState({
    fullName: "",
    email: "",
    company: "",
    message: "",
  });
  const { alert } = useAlert();

  const handleChange = (e: React.ChangeEvent<any>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() !== "success") {
      alert("Error", "Please fill in all required fields", "error").then(() => {
        return;
      });
      return;
    }
    sendEmail(form.email, form.fullName, form.message, form.company)
      .then((res: AxiosResponse<any>) => {
        alert("Success", `${res.data.message} :]`, "success").then(() => {
          return;
        });
      })
      .catch((err: AxiosError<any>) => {
        alert("Error", `${err.response?.data.error} :[`, "error").then(() => {
          return;
        });
      });
  };

  const validateForm = (): string => {
    if (form.fullName == "" || form.email == "" || form.message == "")
      return "Please fill in all required fields";
    // check using regex if email is valid
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email))
      return "Please enter a valid email address";
    return "success";
  };

  return (
    <div>
      <h2>Reach me out!</h2>
      <p>
        I&apos;m always open to new opportunities and collaborations. Feel free
        to reach out to me through the form below or directly at{" "}
        <a href="mailto:ismail.feham64@gmail.com">
          <b>ismail.feham64@gmail.com</b>
        </a>
      </p>
      <br />
      <form className={"-mt-2 mb-10"} onSubmit={handleSubmit}>
        {formFields.map((field, index) => (
          <FieldInput
            name={field.name}
            key={`field-${index}`}
            label={field.label}
            type={field.type}
            optional={field.optional}
            placeholder={field.placeholder}
            fieldType={field.fieldType as "text" | "textarea"}
            value={form[field.name as keyof typeof form]}
            onChange={handleChange}
          />
        ))}
        <div className={"mt-10 w-[200px]"}>
          <Button label="Submit" disabled={false} onClick={handleSubmit} form />
        </div>
      </form>
      <ResumeDownload margin={20} />
    </div>
  );
};

interface FieldInputProps {
  name: string;
  label: string;
  type: string;
  optional?: boolean;
  placeholder: string;
  fieldType: "text" | "textarea";
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
}

const FieldInput = (props: FieldInputProps) => {
  const fieldClasses =
    "focus:outline-retro-dark focus:outline focus:outline-1 border-2 border-retro-dark rounded-sm px-2 py-1";

  return (
    <div className="flex flex-col mt-3">
      <label>
        {!props.optional && (
          <span className={"text-red-700 font-normal"}>* </span>
        )}
        {props.label}
      </label>
      {props.fieldType === "text" ? (
        <input
          className={fieldClasses + " border-retro"}
          type={props.type}
          placeholder={props.placeholder}
          value={props.value}
          name={props.name}
          onChange={props.onChange}
        />
      ) : (
        <textarea
          className={fieldClasses + " height-[200px]"}
          placeholder={props.placeholder}
          rows={5}
          value={props.value}
          name={props.name}
          onChange={props.onChange}
        />
      )}
    </div>
  );
};
export default Contact;

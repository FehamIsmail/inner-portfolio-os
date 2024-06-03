import axios from "axios";

export const sendEmail = async (email: string, subject: string, message: string, company?: string) => {
    return axios.post("/api/sendEmail", {
        from: email,
        name: subject,
        message,
        company
    });
};
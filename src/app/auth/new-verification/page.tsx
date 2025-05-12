import { Metadata } from "next"
import { NewVerificationForm } from "./NewVerificationForm"

export const metadata: Metadata = {
    title: "New Verification",
    description: "New Verification",
}

export default function NewVerificationPage() {
    return <NewVerificationForm />
}
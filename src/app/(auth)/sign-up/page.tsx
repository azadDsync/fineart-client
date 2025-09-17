
import SignUpForm from "@/components/auth/SignUpForm";
import { GuestOnly } from "@/components/auth/GuestOnly";

export default function SignUpPage() {
  return (
    <GuestOnly>
      <SignUpForm />
    </GuestOnly>
  );
}

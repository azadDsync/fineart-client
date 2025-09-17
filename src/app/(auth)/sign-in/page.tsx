import SignInForm from "@/components/auth/SignInForm";
import { GuestOnly } from "@/components/auth/GuestOnly";

export default function SignInPage() {
  return (
    <GuestOnly>
      <SignInForm />
    </GuestOnly>
  );
}

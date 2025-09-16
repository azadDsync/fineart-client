import ForgotPassword from "@/components/auth/forgot-password";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export default async function page() {
  const session =await  authClient.getSession({
    fetchOptions:{
      headers:await headers()
    }
  })
  if (!session.data?.user) {
    return redirect('/sign-in');
  }
  return (
    <ForgotPassword/>
  )
}

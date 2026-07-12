import { Suspense } from "react";
import ResetPassword from "../../views/ResetPassword";

export const metadata = {
  title: "Reset Password | MOMENTRY",
};

export default function Page() {
  return <Suspense><ResetPassword /></Suspense>;
}

import Profile from "../../views/Profile";
import RequireAuth from "../../components/RequireAuth";

export const metadata = {
  title: "My Profile | MOMENTRY",
};

export default function Page() {
  return <RequireAuth><Profile /></RequireAuth>;
}

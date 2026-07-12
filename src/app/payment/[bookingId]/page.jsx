import Payment from "../../../views/Payment";
import RequireAuth from "../../../components/RequireAuth";

export const metadata = {
  title: "Payment | MOMENTRY",
};

export default function Page() {
  return <RequireAuth><Payment /></RequireAuth>;
}

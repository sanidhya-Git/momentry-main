import MyBookings from "../../views/MyBookings";
import RequireAuth from "../../components/RequireAuth";

export const metadata = {
  title: "My Bookings | MOMENTRY",
};

export default function Page() {
  return <RequireAuth><MyBookings /></RequireAuth>;
}

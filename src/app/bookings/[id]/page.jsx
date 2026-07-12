import BookingDetail from "../../../views/BookingDetail";
import RequireAuth from "../../../components/RequireAuth";

export const metadata = {
  title: "Booking Details | MOMENTRY",
};

export default function Page() {
  return <RequireAuth><BookingDetail /></RequireAuth>;
}

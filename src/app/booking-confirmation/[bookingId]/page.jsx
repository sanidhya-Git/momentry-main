import BookingConfirmation from "../../../views/BookingConfirmation";
import RequireAuth from "../../../components/RequireAuth";

export const metadata = {
  title: "Booking Confirmation | MOMENTRY",
};

export default function Page() {
  return <RequireAuth><BookingConfirmation /></RequireAuth>;
}

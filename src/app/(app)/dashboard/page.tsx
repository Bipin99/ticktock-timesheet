import { Footer } from "@/components/layout/footer";
import { TimesheetTable } from "@/components/timesheet/timesheet-table";

export default function DashboardPage() {
  return (
    <>
      <TimesheetTable />
      <Footer />
    </>
  );
}

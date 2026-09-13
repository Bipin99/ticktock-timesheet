import { Footer } from "@/components/layout/footer";
import { WeekDetail } from "@/components/timesheet/week-detail";

export default async function TimesheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <WeekDetail timesheetId={id} />
      <Footer />
    </>
  );
}

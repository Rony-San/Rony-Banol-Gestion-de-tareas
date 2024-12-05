import AdminLayout from "@/layouts/_layout";
import useMiddleware from "@/hooks/useMiddleware";
import { Role } from "@/types/users";
import { IsLoading } from "@/molecules/isLoading";
import { BarData } from "@/molecules/diagramData";
import { DonutData } from "@/molecules/cakeData";

const Chart = () => {
  const user = useMiddleware(Role.ADMIN);

  if (!user) {
    return <IsLoading />;
  }

  return (
    <AdminLayout user={user}>
      <div className="w-full flex justify-center  mt-10 flex-col md:flex-row gap-4">
        <BarData />
        <DonutData />
      </div>
    </AdminLayout>
  );
};

export default Chart;

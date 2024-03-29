import { ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";
import AlertModal from "../modals/alertModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, SearchCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import privateClient from "@/api/config/private.client";
import { format } from "date-fns";
import OrderModal from "../modals/orderModal";

export type OrderColumn = {
  id: number;
  stt:number;
  name:string;
  phone: number;
  address: string;
  payment_method: string;
  delivery_by: string;
  products: Array<any>
  total: string | number;
  created_date:string;
};

export const Columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "stt",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Customer Name",
  },
  // {
  //   accessorKey: "products",
  //   header: "Products",
  // },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "total",
    header: "Total Price",
  },
  {
    accessorKey: "delivery_by",
    header: "Delivery",
  },
  {
    accessorKey: "payment_method",
    header: "Payment Method",
  },
  {
    accessorKey: "created_date",
    header: "Created Date",
    cell: ({ row }) => format(new Date(row.original.created_date), 'dd/MM/yyyy'),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
interface ICellAction {
  data: OrderColumn;
}
export const CellAction = ({ data }: ICellAction) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenOrderDetail, setIsOpenOrderDetail] = useState(false);
  const onDelete = async () => {
    try {
      setIsLoading(true);
      await privateClient.delete(`order/delete-order/${data.id}`);
      window.location.reload()
      toast.success("Order deleted!");
    } catch (error) {
      toast.error("Failed to delete Order");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <OrderModal
      isLoading={isLoading}
      isOpen={isOpenOrderDetail}
      onClose={() => setIsOpenOrderDetail(false)}
      data={data}
      />
      <AlertModal
        isLoading={isLoading}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-5 w-5 " />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => setIsOpenOrderDetail(true)}
            className="cursor-pointer"
          >
            <SearchCheck className="mr-2 h-4 w-4" />
            View Order Detail
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsOpen(true)}
            className="cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

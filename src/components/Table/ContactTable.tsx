"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Calendar, ChevronDown, FilePlus, Globe, MoreHorizontal, Phone, Plus, Tag, User } from "lucide-react"
import { TableMeta } from "@tanstack/react-table";
import Papa from "papaparse";
declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    deleteContact?: deleteContact;
  }
}
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ContactForm } from "@/components/Contact/Create"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "../ui/badge"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import WhatsAppEditor from "../Editor/Editor"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { storedb } from "@/config/config";

export type Payment = {
  createdAt: any
  tags: any
  countryCode: string
  phoneNumber: string
  name: string
  category: string
  component: any
  source: string
  id: string
  language: string
  status: string
  parameter_format: string
}

export type deleteContact = (phoneNumber: string) => Promise<void>;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
}

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="capitalize p-0">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Number",
    cell: ({ row }) => {
      const countryCode = row.original.countryCode || ""; // Access from the original row data
      const phoneNumber = row.original.phoneNumber || ""; // Access from the original row data
      return (
        <div className="capitalize p-0">
          {countryCode} {phoneNumber}
        </div>
      );
    },
  },

  {
    accessorKey: "tags",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tags
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[] | undefined; // Explicitly type as string[] or undefined
      return tags && tags.length > 0 ? (
        <div className="flex gap-2">
          {tags.map((tag, index) => (
            <Badge key={index}>{tag}</Badge>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">-</div>
      );
    },

  },
  {
    accessorKey: "source",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Source
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const source = row.getValue("source") || "-";
      return <div className="capitalize">{source as string}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const timestamp = row.getValue("createdAt");
      const formattedDate = timestamp
        ? new Date(timestamp as number).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })
        : "-";
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const payment = row.original
      const deleteContact = table.options.meta?.deleteContact;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(JSON.stringify(payment, null, 2))}
            >
              Copy JSON
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem
              onClick={() => {
                if (deleteContact) {
                  deleteContact(payment.phoneNumber).catch((err) =>
                    console.error("Error deleting contact:", err)
                  );
                }
              }}
            >
              Delete Contact
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button>Send Message</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="p-4">
                    <DrawerTitle>Send a Message</DrawerTitle>
                    <DrawerDescription>
                      Fill out the form below to send a message.
                    </DrawerDescription>
                  </div>
                  <div className="p-4 gap-4 flex">
                    <Card className="w-full max-w-2xl mx-auto flex-1">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold">Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-5 h-5 text-muted-foreground" />
                          <span className="text-lg font-medium">{payment.name}</span>
                        </div>

                        <Separator />

                        <div className="flex items-center space-x-2">
                          <Phone className="w-5 h-5 text-muted-foreground" />
                          <span>{payment.countryCode} {payment.phoneNumber}</span>
                        </div>

                        <Separator />

                        <div className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          <span>{formatDate(payment.createdAt)}</span>
                        </div>

                        <Separator />

                        <div className="flex items-center space-x-2">
                          <Tag className="w-5 h-5 text-muted-foreground" />
                          <div className="space-x-2">
                            {payment && payment.tags.map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        <div className="flex items-center space-x-2">
                          <Globe className="w-5 h-5 text-muted-foreground" />
                          <span>{payment && payment.source as string}</span>
                        </div>
                      </CardContent>
                    </Card>
                    <WhatsAppEditor data={payment} />
                  </div>
                  <DrawerFooter className="flex justify-end gap-2 flex-1">
                    <DrawerClose asChild>
                      <div className="absolute bottom-4 right-4">
                        <p className="text-sm text-muted-foreground">Powered by Team Alpha. </p>
                      </div>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </DropdownMenuItem>


            {/* <DropdownMenuItem>View payment details</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function ContactTable({ data, deleteContact }: { data: Payment[], deleteContact: deleteContact }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      deleteContact, // Pass deleteContact function here
    },
  })

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const {user} = useAuth();
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No file selected",
      });
      return;
    }
  
    // Parse CSV file using PapaParse
    Papa.parse(file, {
      header: true, // Assume the first row contains headers
      skipEmptyLines: true, // Skip empty rows
      complete: async (results: { data: { name: string; number: string | number; }[]; }) => {
        const rows = results.data as { name: string; number: string | number }[];
  
        if (!rows || rows.length === 0) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "CSV file is empty or invalid",
          });
          return;
        }
  
        // Initialize an array to hold valid contacts
        const validContacts = rows.filter(
          (row) => row.name && row.number // Only include rows with name and number
        );
  
        if (validContacts.length === 0) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "No valid rows found in the CSV file",
          });
          return;
        }
  
        try {
          const timestamp = new Date().toISOString();
  
          if (!user?.uid) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "User not authenticated",
            });
            return;
          }
  
          const userDocRef = doc(storedb, "Contacts", user.uid);
  
          // Save contacts to Firestore
          await setDoc(
            userDocRef,
            {
              contacts: arrayUnion(
                ...validContacts.map((contact) => ({
                  ...contact,
                  createdAt: timestamp,
                }))
              ),
            },
            { merge: true }
          );
  
          toast({
            title: "Success",
            description: `${validContacts.length} contact(s) added successfully`,
          });
        } catch (error) {
          console.error("Error uploading contacts:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "There was an error uploading the contacts",
          });
        }
      },
      error: (error: any) => {
        console.error("Error parsing CSV file:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was an error processing the CSV file",
        });
      },
    });
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Filter Contacts..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={triggerFileInput}
                className="flex items-center gap-2"
              >
                <FilePlus className="w-5 h-5" />
                Upload CSV
              </Button>
            </div>
            <Popover >
              <PopoverTrigger asChild>
                <Button ><Plus size={48} strokeWidth={3} /> </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <ContactForm />
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize "
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}


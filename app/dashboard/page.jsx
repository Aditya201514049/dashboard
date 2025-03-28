"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Protected from "@/components/Protected";

export default function Dashboard() {
  const [date, setDate] = useState(new Date()); // Calendar state

  return (
    <Protected>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Main Container */}
        <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
          {/* Card 1 */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-800">1,245</p>
              <Button className="mt-4">View Details</Button>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-800">$12,340</p>
              <Button className="mt-4">View Details</Button>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-800">340</p>
              <Button className="mt-4">View Details</Button>
            </CardContent>
          </Card>
        </div>

        {/* Dropdown Menu */}
        <div className="mt-6">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="bg-blue-500 text-white py-2 px-4 rounded-lg">
              Open Menu
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-white border rounded-lg p-2 shadow-lg">
              <DropdownMenu.Item className="p-2 hover:bg-gray-200">Option 1</DropdownMenu.Item>
              <DropdownMenu.Item className="p-2 hover:bg-gray-200">Option 2</DropdownMenu.Item>
              <DropdownMenu.Item className="p-2 hover:bg-gray-200">Option 3</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>

        {/* Calendar */}
        <div className="mt-6">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Select a Date</h2>
          </div>
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </div>

        {/* Table */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800">Recent Transactions</h2>
          <table className="min-w-full mt-4 table-auto border-collapse">
            <thead>
              <tr>
                <th className="border-b p-4 text-left">Date</th>
                <th className="border-b p-4 text-left">Description</th>
                <th className="border-b p-4 text-left">Amount</th>
                <th className="border-b p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b p-4">02/20/2025</td>
                <td className="border-b p-4">Payment Received</td>
                <td className="border-b p-4">$200</td>
                <td className="border-b p-4 text-green-500">Completed</td>
              </tr>
              <tr>
                <td className="border-b p-4">02/21/2025</td>
                <td className="border-b p-4">Invoice Paid</td>
                <td className="border-b p-4">$150</td>
                <td className="border-b p-4 text-yellow-500">Pending</td>
              </tr>
              <tr>
                <td className="border-b p-4">02/22/2025</td>
                <td className="border-b p-4">Subscription Fee</td>
                <td className="border-b p-4">$50</td>
                <td className="border-b p-4 text-red-500">Failed</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Dialog */}
        <Dialog.Root>
          <Dialog.Trigger className="mt-8 bg-green-500 text-white py-2 px-4 rounded-lg">
            Open Dialog
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
            <Dialog.Content className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg w-96">
              <Dialog.Title className="text-xl font-bold">Dialog Title</Dialog.Title>
              <Dialog.Description className="mt-4 text-gray-700">
                This is a modal dialog where you can put more content.
              </Dialog.Description>
              <div className="mt-4 flex justify-end">
                <Dialog.Close className="bg-red-500 text-white py-2 px-4 rounded-lg">
                  Close
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </Protected>
  );
}

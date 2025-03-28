"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Protected from "@/components/Protected";
import { Users, DollarSign, ShoppingCart, Calendar as CalendarIcon } from "lucide-react";

export default function Dashboard() {
  const [date, setDate] = useState(new Date()); // Calendar state

  return (
    <Protected>
      <div className="min-h-screen bg-base-200 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left mb-2">Dashboard Overview</h1>
          <p className="text-sm md:text-base text-gray-500 text-center md:text-left">Welcome back! Here's what's happening with your business today.</p>
        </div>
        
        {/* Main Container */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <Card className="bg-white shadow-xl border-l-4 border-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-800">1,245</p>
              <p className="text-xs text-gray-500 mb-3">↑ 12% from last month</p>
              <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600">View Details</Button>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="bg-white shadow-xl border-l-4 border-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-800">$12,340</p>
              <p className="text-xs text-gray-500 mb-3">↑ 8% from last month</p>
              <Button size="sm" className="w-full bg-green-500 hover:bg-green-600">View Details</Button>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="bg-white shadow-xl border-l-4 border-purple-500 md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-purple-500" />
                Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-800">340</p>
              <p className="text-xs text-gray-500 mb-3">↑ 5% from last month</p>
              <Button size="sm" className="w-full bg-purple-500 hover:bg-purple-600">View Details</Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Table */}
            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Date</th>
                        <th className="text-left">Description</th>
                        <th className="text-left">Amount</th>
                        <th className="text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-sm">02/20/2025</td>
                        <td className="text-sm">Payment Received</td>
                        <td className="text-sm">$200</td>
                        <td><span className="badge badge-success text-xs">Completed</span></td>
                      </tr>
                      <tr>
                        <td className="text-sm">02/21/2025</td>
                        <td className="text-sm">Invoice Paid</td>
                        <td className="text-sm">$150</td>
                        <td><span className="badge badge-warning text-xs">Pending</span></td>
                      </tr>
                      <tr>
                        <td className="text-sm">02/22/2025</td>
                        <td className="text-sm">Subscription Fee</td>
                        <td className="text-sm">$50</td>
                        <td><span className="badge badge-error text-xs">Failed</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-center mt-4">
                  <Button variant="outline" size="sm">View All Transactions</Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Dialog Example */}
            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Dialog.Root>
                  <Dialog.Trigger className="btn btn-success btn-sm">
                    New Sale
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-md">
                      <Dialog.Title className="text-xl font-bold">Add New Sale</Dialog.Title>
                      <Dialog.Description className="mt-4 text-gray-700">
                        Fill in the details to record a new sale transaction.
                      </Dialog.Description>
                      <div className="mt-4 space-y-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Product</span>
                          </label>
                          <input type="text" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Amount</span>
                          </label>
                          <input type="number" className="input input-bordered" />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Dialog.Close className="btn btn-sm">
                          Cancel
                        </Dialog.Close>
                        <Dialog.Close className="btn btn-primary btn-sm">
                          Save
                        </Dialog.Close>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog.Root>
                
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger className="btn btn-primary btn-sm">
                    Reports
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className="bg-white border rounded-lg p-2 shadow-lg">
                    <DropdownMenu.Item className="btn btn-ghost btn-sm w-full justify-start">Daily Report</DropdownMenu.Item>
                    <DropdownMenu.Item className="btn btn-ghost btn-sm w-full justify-start">Weekly Report</DropdownMenu.Item>
                    <DropdownMenu.Item className="btn btn-ghost btn-sm w-full justify-start">Monthly Report</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
                
                <button className="btn btn-warning btn-sm">Inventory</button>
                <button className="btn btn-info btn-sm">Customers</button>
                <button className="btn btn-secondary btn-sm">Settings</button>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Calendar Card */}
            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Select a Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar 
                  mode="single" 
                  selected={date} 
                  onSelect={setDate}
                  className="mx-auto"
                />
              </CardContent>
            </Card>
            
            {/* Recent Activity */}
            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex gap-2 items-start">
                    <div className="badge badge-primary">New</div>
                    <span className="text-sm">John added 3 new products</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <div className="badge badge-secondary">Update</div>
                    <span className="text-sm">Price change for SKU-123456</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <div className="badge badge-accent">Restock</div>
                    <span className="text-sm">20 units of Product XYZ added to inventory</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Protected>
  );
}

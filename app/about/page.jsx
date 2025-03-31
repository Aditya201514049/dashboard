"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HelpCircle,
  LifeBuoy,
  Mail,
  MessageCircle,
  Phone,
  FileText,
  Book,
  RefreshCw,
  ShoppingBag,
  Package,
  BarChart2,
  Users,
  ArrowLeft
} from "lucide-react";

export default function HelpAndSupportPage() {
  const [activeTab, setActiveTab] = useState("faq");

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Help & Support</h1>
          <p className="text-gray-600 mt-1">Get assistance and learn more about our platform</p>
        </div>

        <Tabs defaultValue="faq" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="faq" onClick={() => setActiveTab("faq")}>
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="guides" onClick={() => setActiveTab("guides")}>
              <Book className="h-4 w-4 mr-2" />
              User Guides
            </TabsTrigger>
            <TabsTrigger value="contact" onClick={() => setActiveTab("contact")}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Us
            </TabsTrigger>
          </TabsList>

          {/* FAQ Section */}
          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-blue-500" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Find answers to common questions about our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I create a shop?</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">To create a shop:</p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Sign in to your account</li>
                        <li>Navigate to the Admin page</li>
                        <li>Click on "Add Shop"</li>
                        <li>Fill in the required details (shop name, location, etc.)</li>
                        <li>Click "Create Shop"</li>
                      </ol>
                      <p className="mt-2">Your new shop will appear in the list and you can start adding products to it.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I add products to my shop?</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">To add products to your shop:</p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Go to the Admin page</li>
                        <li>Select your shop from the list</li>
                        <li>Click on "Add Product"</li>
                        <li>Enter the product details (name, price, stock, etc.)</li>
                        <li>Click "Add Product"</li>
                      </ol>
                      <p className="mt-2">The product will be added to your shop inventory and be available for sales.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>How do I record a sale?</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">To record a sale:</p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Navigate to the Admin page</li>
                        <li>Select your shop</li>
                        <li>Select the product you want to sell</li>
                        <li>Click "Add Sale"</li>
                        <li>Enter the quantity and select the date</li>
                        <li>Click "Record Sale"</li>
                      </ol>
                      <p className="mt-2">The system will automatically update inventory and record the transaction in your sales history.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>How can I view my sales analytics?</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">To view your sales analytics:</p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Go to the Admin Dashboard page</li>
                        <li>Here you'll find various charts and metrics including:
                          <ul className="list-disc pl-5 mt-1">
                            <li>Sales trends over time</li>
                            <li>Top selling products</li>
                            <li>Performance insights</li>
                            <li>Recent sales</li>
                          </ul>
                        </li>
                        <li>Use the date filter to adjust the time period</li>
                        <li>If you have multiple shops, use the shop selector to switch between them</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>How do I delete a shop, product, or sale?</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-2">To delete an item:</p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Go to the Admin page</li>
                        <li>Find the item you want to delete</li>
                        <li>Click the delete icon (trash can) next to the item</li>
                        <li>Confirm the deletion when prompted</li>
                      </ol>
                      <p className="mt-2 text-amber-600">Note: Deleting a shop will also delete all associated products and sales. This action cannot be undone.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Guides Section */}
          <TabsContent value="guides" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="h-5 w-5 mr-2 text-blue-500" />
                  User Guides
                </CardTitle>
                <CardDescription>
                  Step-by-step instructions to make the most of our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-2 text-blue-500" />
                        Shop Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">Learn how to create and manage your shops effectively.</p>
                      <ul className="text-sm space-y-2">
                        <li>• Creating your first shop</li>
                        <li>• Managing multiple shops</li>
                        <li>• Shop settings and customization</li>
                      </ul>
                      <Button variant="link" className="px-0 mt-2 h-8">
                        <FileText className="h-4 w-4 mr-1" /> Read Guide
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Package className="h-4 w-4 mr-2 text-green-500" />
                        Inventory Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">Master product management and stock keeping.</p>
                      <ul className="text-sm space-y-2">
                        <li>• Adding and editing products</li>
                        <li>• Stock management best practices</li>
                        <li>• Bulk product operations</li>
                      </ul>
                      <Button variant="link" className="px-0 mt-2 h-8">
                        <FileText className="h-4 w-4 mr-1" /> Read Guide
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <RefreshCw className="h-4 w-4 mr-2 text-amber-500" />
                        Sales Processing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">Streamline your sales recording process.</p>
                      <ul className="text-sm space-y-2">
                        <li>• Recording sales quickly</li>
                        <li>• Managing historical sales data</li>
                        <li>• Sales receipt management</li>
                      </ul>
                      <Button variant="link" className="px-0 mt-2 h-8">
                        <FileText className="h-4 w-4 mr-1" /> Read Guide
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <BarChart2 className="h-4 w-4 mr-2 text-purple-500" />
                        Analytics Deep Dive
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">Get the most from your business data.</p>
                      <ul className="text-sm space-y-2">
                        <li>• Understanding performance metrics</li>
                        <li>• Sales trend analysis</li>
                        <li>• Generating custom reports</li>
                      </ul>
                      <Button variant="link" className="px-0 mt-2 h-8">
                        <FileText className="h-4 w-4 mr-1" /> Read Guide
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Us Section */}
          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
                  Contact Us
                </CardTitle>
                <CardDescription>
                  Need additional help? Reach out to our support team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <LifeBuoy className="h-5 w-5 mr-2 text-red-500" />
                        Customer Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Mail className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Email</p>
                            <p className="text-sm text-gray-600">support@dashboardapp.com</p>
                            <p className="text-xs text-gray-500">Response time: 24 hours</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Phone className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Phone</p>
                            <p className="text-sm text-gray-600">+880 1234 567890</p>
                            <p className="text-xs text-gray-500">Available: 9 AM - 6 PM (BD)</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <MessageCircle className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Live Chat</p>
                            <p className="text-sm text-gray-600">Available on weekdays</p>
                            <p className="text-xs text-gray-500">Hours: 10 AM - 5 PM (BD)</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Users className="h-5 w-5 mr-2 text-indigo-500" />
                        Business Inquiries
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        For partnerships, enterprise solutions, or business development inquiries, please contact our team:
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Mail className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Email</p>
                            <p className="text-sm text-gray-600">business@dashboardapp.com</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Phone className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Phone</p>
                            <p className="text-sm text-gray-600">+880 1234 567891</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-800 mb-3">We're Here to Help</h3>
                  <p className="text-blue-700 mb-4">
                    Our dedicated support team is committed to helping you get the most out of your dashboard experience. If you can't find what you need in our FAQs or guides, please don't hesitate to reach out.
                  </p>
                  <p className="text-sm text-blue-600">
                    Average response time: Within 24 hours
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

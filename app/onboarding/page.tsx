// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const steps = [
//   {
//     title: "Basic Information",
//     description: "Let's start with your barbershop's name and location",
//   },
//   {
//     title: "Contact Details",
//     description: "How can your customers reach you?",
//   },
//   { title: "Business Hours", description: "When are you open for business?" },
//   { title: "Services", description: "What services do you offer?" },
// ];

// export default function Onboarding() {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [notification, setNotification] = useState({ message: "", type: "" });
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     additionalInfo: "",
//     phone: "",
//     email: "",
//     website: "",
//     description: "",
//     openingTime: "",
//     closingTime: "",
//     services: [""],
//   });

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleServiceChange = (index: number, value: string) => {
//     const newServices = [...formData.services];
//     newServices[index] = value;
//     setFormData((prev) => ({ ...prev, services: newServices }));
//   };

//   const addService = () => {
//     setFormData((prev) => ({ ...prev, services: [...prev.services, ""] }));
//   };

//   const handleNext = async () => {
//     if (currentStep < steps.length - 1) {
//       setCurrentStep((prev) => prev + 1);
//     } else {
//       try {
//         const response = await fetch("/barbershops", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             accept: "*/*",
//           },
//           body: JSON.stringify({
//             name: formData.name,
//             address: formData.address,
//             city: formData.city,
//             state: formData.state,
//             zipCode: formData.zipCode,
//             additionalInfo: formData.additionalInfo,
//           }),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to create barbershop");
//         }

//         const data = await response.json();
//         console.log("Barbershop created:", data);
//         setNotification({
//           message: "Your barbershop has been created successfully!",
//           type: "success",
//         });
//         setTimeout(() => router.push("/dashboard"), 2000);
//       } catch (error) {
//         console.error("Error creating barbershop:", error);
//         setNotification({
//           message: "Failed to create barbershop. Please try again.",
//           type: "error",
//         });
//       }
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 0) {
//       setCurrentStep((prev) => prev - 1);
//     }
//   };

//   const renderStep = () => {
//     switch (currentStep) {
//       case 0:
//         return (
//           <>
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="name">Barbershop Name</Label>
//                 <Input
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="address">Address</Label>
//                 <Input
//                   id="address"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="city">City</Label>
//                   <Input
//                     id="city"
//                     name="city"
//                     value={formData.city}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="state">State</Label>
//                   <Input
//                     id="state"
//                     name="state"
//                     value={formData.state}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <Label htmlFor="zipCode">Zip Code</Label>
//                 <Input
//                   id="zipCode"
//                   name="zipCode"
//                   value={formData.zipCode}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="additionalInfo">Additional Information</Label>
//                 <Textarea
//                   id="additionalInfo"
//                   name="additionalInfo"
//                   value={formData.additionalInfo}
//                   onChange={handleInputChange}
//                 />
//               </div>
//             </div>
//           </>
//         );
//       case 1:
//         return (
//           <>
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="phone">Phone Number</Label>
//                 <Input
//                   id="phone"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="email">Email Address</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="website">Website (optional)</Label>
//                 <Input
//                   id="website"
//                   name="website"
//                   value={formData.website}
//                   onChange={handleInputChange}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                 />
//               </div>
//             </div>
//           </>
//         );
//       case 2:
//         return (
//           <>
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="openingTime">Opening Time</Label>
//                 <Select
//                   onValueChange={(value) =>
//                     handleSelectChange("openingTime", value)
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select opening time" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
//                       <SelectItem
//                         key={hour}
//                         value={`${hour.toString().padStart(2, "0")}:00`}
//                       >
//                         {`${hour.toString().padStart(2, "0")}:00`}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label htmlFor="closingTime">Closing Time</Label>
//                 <Select
//                   onValueChange={(value) =>
//                     handleSelectChange("closingTime", value)
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select closing time" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
//                       <SelectItem
//                         key={hour}
//                         value={`${hour.toString().padStart(2, "0")}:00`}
//                       >
//                         {`${hour.toString().padStart(2, "0")}:00`}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </>
//         );
//       case 3:
//         return (
//           <>
//             <div className="space-y-4">
//               {formData.services.map((service, index) => (
//                 <div key={index}>
//                   <Label htmlFor={`service-${index}`}>
//                     Service {index + 1}
//                   </Label>
//                   <Input
//                     id={`service-${index}`}
//                     value={service}
//                     onChange={(e) => handleServiceChange(index, e.target.value)}
//                   />
//                 </div>
//               ))}
//               <Button type="button" onClick={addService}>
//                 Add Another Service
//               </Button>
//             </div>
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="container mx-auto py-10">
//       <Card className="max-w-2xl mx-auto">
//         <CardHeader>
//           <CardTitle>{steps[currentStep].title}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-sm text-muted-foreground mb-4">
//             {steps[currentStep].description}
//           </p>
//           {renderStep()}
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <Button onClick={handleBack} disabled={currentStep === 0}>
//             Back
//           </Button>
//           <Button onClick={handleNext}>
//             {currentStep === steps.length - 1 ? "Finish" : "Next"}
//           </Button>
//         </CardFooter>
//       </Card>
//       {notification.message && (
//         <div
//           className={`mt-4 p-4 rounded ${
//             notification.type === "success"
//               ? "bg-green-100 text-green-700"
//               : "bg-red-100 text-red-700"
//           }`}
//         >
//           {notification.message}
//         </div>
//       )}
//     </div>
//   );
// }

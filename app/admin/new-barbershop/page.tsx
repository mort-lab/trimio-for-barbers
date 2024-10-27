"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  X,
  Upload,
  Phone,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";

const NewBarbershop = () => {
  const router = useRouter();
  const { createOrUpdateBarbershop } = useAuthStore();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    countryCode: "+34",
    phoneNumber: "",
    additionalInfo: "",
    barbershopImages: null as File | null,
  });

  const totalSteps = 3;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        barbershopImages: e.target.files![0],
      }));
    }
  };

  const handleNext = () => {
    if (step < totalSteps) setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === totalSteps) {
      setIsLoading(true);
      const barbershopData = new FormData();

      const supportedFields = [
        "name",
        "address",
        "city",
        "state",
        "zipCode",
        "countryCode",
        "phoneNumber",
        "additionalInfo",
        "barbershopImages",
      ];
      supportedFields.forEach((field) => {
        if (formData[field] !== null && formData[field] !== undefined) {
          barbershopData.append(field, formData[field]);
        }
      });

      try {
        const barbershop = await createOrUpdateBarbershop(barbershopData);
        console.log("Barbershop created:", barbershop);
        toast({
          title: "Barbería creada con éxito",
          description: "Tu barbería ha sido registrada correctamente.",
          duration: 5000,
        });
        setTimeout(() => router.push("/admin"), 2000);
      } catch (error) {
        console.error("Error creating barbershop:", error);
        toast({
          title: "Error",
          description:
            "Hubo un problema al crear la barbería. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      handleNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Configura tu Barbería</h1>
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <X className="h-6 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mb-8 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <Info className="mr-2" /> Información Básica
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre de la Barbería</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ingresa el nombre de tu barbería"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Ingresa la dirección de tu barbería"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Ciudad</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Ciudad"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">Provincia</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="Provincia"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Código Postal</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="Código Postal"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <Phone className="mr-2" /> Información de Contacto
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="countryCode">Código de País</Label>
                        <Input
                          id="countryCode"
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleInputChange}
                          placeholder="+34"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="phoneNumber">Teléfono</Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="123456789"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="additionalInfo">
                        Información Adicional
                      </Label>
                      <Textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        placeholder="Información adicional sobre tu barbería"
                        rows={4}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <Upload className="mr-2" /> Imagen de la Barbería
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="barbershopImages">
                        Imagen de la Barbería
                      </Label>
                      <Input
                        id="barbershopImages"
                        name="barbershopImages"
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        required
                      />
                    </div>
                    <Alert>
                      <AlertTitle>Recomendación</AlertTitle>
                      <AlertDescription>
                        Una buena imagen puede atraer más clientes. Asegúrate de
                        que la foto sea clara, bien iluminada y represente bien
                        tu barbería.
                      </AlertDescription>
                    </Alert>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex justify-between">
              <Button
                type="button"
                onClick={handlePrev}
                disabled={step === 1 || isLoading}
                variant="outline"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
              </Button>
              <Button type="submit" disabled={isLoading}>
                {step < totalSteps
                  ? "Siguiente"
                  : isLoading
                  ? "Creando..."
                  : "Finalizar"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default NewBarbershop;

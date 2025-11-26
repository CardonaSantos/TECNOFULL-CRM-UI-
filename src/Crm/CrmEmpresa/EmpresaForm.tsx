"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle,
  CreditCard,
  Globe,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PageTransitionCrm } from "@/components/Layout/page-transition";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

interface EmpresaFormState {
  nombre: string;
  direccion: string;
  telefono: string;
  pbx: string;
  correo: string;
  sitioWeb: string;
  nit: string;
}

const initialEmpresa: EmpresaFormState = {
  nombre: "",
  direccion: "",
  telefono: "",
  pbx: "",
  correo: "",
  sitioWeb: "",
  nit: "",
};

const EmpresaForm: React.FC = () => {
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;

  const [empresa, setEmpresa] = useState<EmpresaFormState>(initialEmpresa);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange =
    (field: keyof EmpresaFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmpresa((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const fetchEmpresa = async () => {
    if (!empresaId) {
      setIsLoading(false);
      setIsEditing(false);
      return;
    }

    try {
      const { data } = await axios.get(
        `${VITE_CRM_API_URL}/empresa/${empresaId}`
      );

      if (data) {
        // Solo mantenemos las propiedades que nos interesan
        setEmpresa({
          nombre: data.nombre ?? "",
          direccion: data.direccion ?? "",
          telefono: data.telefono ?? "",
          pbx: data.pbx ?? "",
          correo: data.correo ?? "",
          sitioWeb: data.sitioWeb ?? "",
          nit: data.nit ?? "",
        });
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error al obtener la empresa:", error);
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresa();
  }, [empresaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const method = isEditing ? "PATCH" : "POST";
    const url = isEditing
      ? `${VITE_CRM_API_URL}/empresa/${empresaId}`
      : `${VITE_CRM_API_URL}/empresa`;

    try {
      const { status } = await axios({
        method,
        url,
        headers: {
          "Content-Type": "application/json",
        },
        data: empresa,
      });

      if (status === 200 || status === 201) {
        toast.success(
          isEditing
            ? "Empresa actualizada correctamente"
            : "Empresa creada correctamente"
        );
        if (!isEditing) {
          setIsEditing(true);
        }
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      toast.error("Hubo un error al guardar la información de la empresa");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-10">
        <span className="text-sm text-muted-foreground">
          Cargando información de la empresa...
        </span>
      </div>
    );
  }

  return (
    <PageTransitionCrm
      titleHeader="Empresa"
      subtitle={`Datos de la empresa`}
      variant="fade-pure"
    >
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-md bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base md:text-lg">
                Configuración de Empresa
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Define los datos generales y de facturación que se usarán en
                todo el CRM.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Información principal */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                Información principal
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nombre">
                    Nombre <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nombre"
                      value={empresa.nombre}
                      onChange={handleChange("nombre")}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="direccion">Dirección</Label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="direccion"
                      value={empresa.direccion}
                      onChange={handleChange("direccion")}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contacto */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" />
                Información de contacto
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="telefono"
                      value={empresa.telefono}
                      onChange={handleChange("telefono")}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pbx">PBX</Label>
                  <div className="relative">
                    <PhoneCall className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pbx"
                      value={empresa.pbx}
                      onChange={handleChange("pbx")}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="correo">Correo electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="correo"
                      type="email"
                      value={empresa.correo}
                      onChange={handleChange("correo")}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="sitioWeb">Sitio web</Label>
                  <div className="relative">
                    <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="sitioWeb"
                      type="url"
                      value={empresa.sitioWeb}
                      onChange={handleChange("sitioWeb")}
                      className="pl-8"
                      placeholder="https://tusitio.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Información fiscal */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <CreditCard className="h-3 w-3" />
                Información fiscal
              </p>

              <div className="max-w-sm space-y-1.5">
                <Label htmlFor="nit">NIT</Label>
                <div className="relative">
                  <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nit"
                    value={empresa.nit}
                    onChange={handleChange("nit")}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[180px] bg-zinc-900 hover:bg-zinc-800"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin border-2 border-t-transparent rounded-full" />
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {isEditing ? "Actualizar empresa" : "Crear empresa"}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </PageTransitionCrm>
  );
};

export default EmpresaForm;

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Upload, X, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDropzone } from "react-dropzone";
import useAuthStore from "@/store/authStore";
import { toast } from "@/hooks/use-toast";

interface ImageData {
  imageUrl: string;
}

interface UploadImagesProps {
  barbershopId: string;
  initialImages: ImageData[];
  onImagesUpdate: (updatedImages: ImageData[]) => void;
}

export default function UploadImages({
  barbershopId,
  initialImages = [],
  onImagesUpdate,
}: UploadImagesProps) {
  const [images, setImages] = useState<ImageData[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const { createOrUpdateBarbershop } = useAuthStore();

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true);
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append("barbershopImages", file);
      });

      try {
        const updatedBarbershop = await createOrUpdateBarbershop(
          formData,
          barbershopId
        );
        const updatedImages = updatedBarbershop.barbershopImages.map(
          (url: string) => ({ imageUrl: url })
        );
        setImages(updatedImages);
        onImagesUpdate(updatedImages);
        toast({
          title: "Success",
          description: "Images uploaded successfully",
        });
      } catch (error) {
        console.error("Error uploading images:", error);
        toast({
          title: "Error",
          description: "Failed to upload images. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [barbershopId, createOrUpdateBarbershop, onImagesUpdate]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDeleteImage = async (imageUrl: string) => {
    const updatedImages = images.filter((img) => img.imageUrl !== imageUrl);
    const formData = new FormData();
    updatedImages.forEach((image) => {
      formData.append("barbershopImages", image.imageUrl);
    });

    try {
      const updatedBarbershop = await createOrUpdateBarbershop(
        formData,
        barbershopId
      );
      const newImages = updatedBarbershop.barbershopImages.map(
        (url: string) => ({ imageUrl: url })
      );
      setImages(newImages);
      onImagesUpdate(newImages);
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.error("Image failed to load:", e.currentTarget.src);
  };

  return (
    <Card>
      <CardContent>
        <div className="space-y-4 pt-6">
          {images.length > 0 ? (
            <>
              <div className="aspect-video w-full relative">
                <Image
                  src={images[0].imageUrl}
                  alt="Main barbershop image"
                  fill
                  className="rounded-lg object-cover"
                  onError={handleImageError}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => handleDeleteImage(images[0].imageUrl)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1).map((image, index) => (
                  <div key={index} className="relative h-24">
                    <Image
                      src={image.imageUrl}
                      alt={`Barbershop image ${index + 2}`}
                      fill
                      className="rounded-md object-cover"
                      onError={handleImageError}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 z-10"
                      onClick={() => handleDeleteImage(image.imageUrl)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-gray-300 rounded-md p-2 flex items-center justify-center cursor-pointer h-24"
                >
                  <input {...getInputProps()} />
                  <Edit2 className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            </>
          ) : (
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {isDragActive
                  ? "Drop the images here..."
                  : "Drag 'n' drop some images here, or click to select files"}
              </p>
            </div>
          )}
        </div>
        {isUploading && (
          <p className="text-sm text-gray-500 mt-2">Uploading images...</p>
        )}
      </CardContent>
    </Card>
  );
}

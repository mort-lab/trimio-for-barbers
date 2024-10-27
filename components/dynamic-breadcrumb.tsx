"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import Link from "next/link";

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/admin" as={Link}>
            Trimio4Barbers
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.slice(1).map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 2).join("/")}`;
          const isLast = index === pathSegments.length - 2;

          return (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                    {segment === "admin"
                      ? "Overview"
                      : segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href} as={Link}>
                    {segment === "admin"
                      ? "Overview"
                      : segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

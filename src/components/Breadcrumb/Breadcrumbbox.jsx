"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Breadcrumbbox = () => {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter((part) => part);

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          {pathParts.map((part, index) => {
            const href = `/${pathParts.slice(0, index + 1).join("/")}`;
            const label = part.charAt(0).toUpperCase() + part.slice(1);
            const isLast = index === pathParts.length - 1;

            return (
              <BreadcrumbItem key={index}>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbbox;

"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User } from "@prisma/client";
import { updateAddress } from "@/lib/user-action";

export default function AddressesPage({ user }: { user: User | null }) {
  const [formData, setFormData] = useState({
    fullName: user?.name ?? "",
    phone: user?.phone ?? "",
    province: user?.province ?? "",
    district: user?.district ?? "",
    ward: user?.ward ?? "",
    addressLine1: user?.addressLine1 ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await updateAddress(formData);
      if (res.success) toast.success("Address updated successfully!");
      else toast.error("Failed to update address");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Full name</Label>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>

          <div>
            <Label>Phone number</Label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your phone"
            />
          </div>

          <div>
            <Label>Province / City</Label>
            <Input
              name="province"
              value={formData.province}
              onChange={handleChange}
              placeholder="e.g. Ho Chi Minh City"
            />
          </div>

          <div>
            <Label>District</Label>
            <Input
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="e.g. District 1"
            />
          </div>

          <div>
            <Label>Ward</Label>
            <Input
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              placeholder="e.g. Ben Nghe"
            />
          </div>

          <div className="md:col-span-2">
            <Label>Detailed address</Label>
            <Input
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder="e.g. 123 Le Loi Street, Ward 7"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleSubmit} className="w-full md:w-auto">
            Save changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

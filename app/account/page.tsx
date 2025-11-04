"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import { User } from "@prisma/client";

export default function AccountProfile({ user }: { user: User | null }) {
  const [formData, setFormData] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    addressLine1: user?.addressLine1 ?? "",
  });
  const [avatar, setAvatar] = useState(
    user?.avatarUrl || "/default-avatar.png"
  );
  const [preview, setPreview] = useState<string | null>(null);

  // preview ảnh tạm
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setAvatar(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("phone", formData.phone);
      form.append("addressLine1", formData.addressLine1);
      if (avatar instanceof File) form.append("avatar", avatar);

      const res = await updateProfile(form);
      if (res.success) toast.success("Profile updated successfully!");
      else toast.error(res.error || "Update failed");
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile");
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Profile</h2>

        <div className="flex items-center gap-6">
          <div className="relative">
            <Image
              src={preview || avatar}
              alt="Avatar"
              width={100}
              height={100}
              className="rounded-full border object-cover w-24 h-24"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-white border rounded-full p-1 cursor-pointer hover:bg-muted transition"
            >
              <Camera className="w-4 h-4 text-gray-700" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                />
              </div>

              <div className="md:col-span-2">
                <Label>Address</Label>
                <Input
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="Your address"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button className="w-full md:w-auto" onClick={handleSave}>
            Save changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

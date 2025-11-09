"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import { uploadAvatar, updateProfile } from "@/lib/user-action";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function AccountProfile() {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [formData, setFormData] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    addressLine1: user?.addressLine1 ?? "",
  });

  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatarUrl || "/default-avatar.png"
  );

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name ?? "",
        phone: session.user.phone ?? "",
        addressLine1: session.user.addressLine1 ?? "",
      });
      setAvatarPreview(session.user.avatarUrl || "/default-avatar.png");
    }
  }, [session]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);

    const form = new FormData();
    form.append("avatar", file);

    const res = await uploadAvatar(form);

    if (res.success) {
      toast.success("Avatar updated!");
      await update({});
    } else {
      toast.error(res.error || "Upload failed");
    }

    URL.revokeObjectURL(localUrl);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("phone", formData.phone);
    form.append("addressLine1", formData.addressLine1);

    const res = await updateProfile(form);

    if (res.success) {
      toast.success("Profile updated!");
      await update({});
    } else {
      toast.error(res.error || "Update failed");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-900 dark:text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 p-4 md:p-8">
      <Card className="max-w-4xl mx-auto bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-slate-700/50 shadow-xl">
        <CardContent className="p-6 md:p-8 space-y-6 md:space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Profile
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Avatar */}
            <div className="relative w-28 h-28 md:w-32 md:h-32">
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover border-4 border-gray-200 dark:border-slate-700 shadow-xl"
              />
              <label className="absolute bottom-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full p-2.5 cursor-pointer hover:scale-110 transition-transform duration-300 border-3 border-white dark:border-slate-800 shadow-lg hover:shadow-orange-500/50">
                <Camera className="w-5 h-5 text-white" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Form fields */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <Label className="text-gray-700 dark:text-slate-300 text-sm font-medium mb-2 block">
                    Name
                  </Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="h-11 bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-orange-500 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 dark:text-slate-300 text-sm font-medium mb-2 block">
                    Phone
                  </Label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone"
                    className="h-11 bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-orange-500 focus:ring-orange-500/20"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="text-gray-700 dark:text-slate-300 text-sm font-medium mb-2 block">
                    Address
                  </Label>
                  <Input
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="Your address"
                    className="h-11 bg-gray-50 dark:bg-slate-900 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:border-orange-500 focus:ring-orange-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all duration-300"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

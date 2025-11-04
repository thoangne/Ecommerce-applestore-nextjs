"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function ShippingPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    weight: 500, // gram
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ fee?: number; days?: number } | null>(
    null
  );

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const estimateShipping = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/shipping/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_district_id: 1450, // Gò Vấp (ví dụ)
          to_district_id: 1442, // Quận 1
          to_ward_code: "20113", // Bến Nghé
          weight: form.weight,
          length: 20,
          width: 15,
          height: 10,
        }),
      });

      const data = await res.json();
      if (data.shippingFee) {
        setResult({ fee: data.shippingFee, days: data.estimatedDays });
      } else {
        throw new Error(data.error || "Không thể tính phí.");
      }
    } catch (err) {
      alert("Lỗi khi tính phí giao hàng.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F5F7] via-[#E8E8ED] to-[#D2D2D7] dark:from-[#0A0A0A] dark:via-[#1C1C1E] dark:to-[#2C2C2E] p-8 transition-colors">
      <Card className="w-full max-w-3xl p-8 shadow-xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md rounded-3xl border border-neutral-300 dark:border-neutral-700">
        <h1 className="text-3xl font-semibold mb-8 text-center text-neutral-900 dark:text-white">
          Thông tin giao hàng (GHN)
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Họ tên người nhận</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nguyễn Văn A"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Số điện thoại</Label>
            <Input
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="0123 456 789"
              className="mt-1"
            />
          </div>

          <div className="md:col-span-2">
            <Label>Địa chỉ</Label>
            <Input
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="123 Nguyễn Trãi, Quận 1"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Tỉnh / Thành phố</Label>
            <Input
              value={form.province}
              onChange={(e) => handleChange("province", e.target.value)}
              placeholder="TP. Hồ Chí Minh"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Quận / Huyện</Label>
            <Input
              value={form.district}
              onChange={(e) => handleChange("district", e.target.value)}
              placeholder="Quận 1"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Phường / Xã</Label>
            <Input
              value={form.ward}
              onChange={(e) => handleChange("ward", e.target.value)}
              placeholder="Phường Bến Nghé"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Khối lượng (gram)</Label>
            <Input
              type="number"
              value={form.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <Button
          onClick={estimateShipping}
          disabled={loading}
          className="w-full mt-8 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition"
        >
          {loading ? "Đang tính phí..." : "Tính phí giao hàng"}
        </Button>

        {result && (
          <div className="mt-6 text-center text-lg font-medium text-neutral-800 dark:text-white">
            <p>
              Phí vận chuyển dự kiến:{" "}
              <span className="font-semibold">
                {result.fee?.toLocaleString()}₫
              </span>
            </p>
            <p>
              Thời gian giao hàng: khoảng{" "}
              <span className="font-semibold">{result.days} ngày</span>
            </p>
          </div>
        )}
      </Card>
    </main>
  );
}

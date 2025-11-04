import { Order } from "@prisma/client";
import axios from "axios";

export async function calculateShippingFee(order: Order | null) {
  if (!order?.shippingDetailId) return 0;

  try {
    const res = await axios.post(
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
      {
        from_district_id: 1444,
        service_id: 53320,
        to_district_id: 1451,
        to_ward_code: "21009",
        height: 10,
        length: 20,
        weight: 200,
        width: 20,
      },
      {
        headers: {
          Token: process.env.GHN_TOKEN,
          ShopId: process.env.GHN_SHOP_ID,
        },
      }
    );
    return res.data.data.total || 0;
  } catch (e) {
    console.error("GHN fee error:", e);
    return 0;
  }
}

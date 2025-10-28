"use client";

import { useState } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
  ChevronDown,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleNewsletterSubmit = () => {
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const quickLinks = [
    { name: "Giới thiệu", href: "/about" },
    { name: "Sản phẩm", href: "/products" },
    { name: "Tin tức", href: "/news" },
    { name: "Liên hệ", href: "/contact" },
  ];

  const supportLinks = [
    { name: "Chính sách bảo mật", href: "/privacy" },
    { name: "Điều khoản sử dụng", href: "/terms" },
    { name: "Chính sách đổi trả", href: "/return-policy" },
    { name: "Hỗ trợ", href: "/support" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "Youtube" },
  ];

  return (
    <footer className="border-t bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <style jsx>{`
        .hover-lift {
          transition: transform 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
        }
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }
        .accordion-content.open {
          max-height: 300px; /* Tăng chiều cao để chứa đủ link */
        }
        /* ĐÃ XÓA MEDIA QUERY Ở ĐÂY - logic này ngăn accordion
           hoạt động trên desktop. Bằng cách xóa nó đi,
           nút bấm sẽ hoạt động trên mọi kích thước màn hình. */
      `}</style>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Map Section */}
        <div className="mb-12 rounded-2xl overflow-hidden border border-border/50 shadow-lg hover-lift">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h4 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Vị trí của chúng tôi
                </h4>
                <p className="text-muted-foreground text-sm">
                  123 Đường ABC, Quận 1, TP. Hồ Chí Minh
                </p>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm font-medium hover:underline"
              >
                Xem trên Google Maps →
              </a>
            </div>
          </div>
          <div className="relative h-80 bg-muted">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6306960332544!2d106.69522831531677!3d10.762622692328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38f9ed887b%3A0x14aded5703768989!2sNh%C3%A0%20th%E1%BB%9D%20%C4%90%E1%BB%A9c%20B%C3%A0!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ địa điểm"
              className="grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </div>

        {/* Footer Links Section */}
        <div className="flex flex-col md:flex-row gap-8 flex-wrap justify-between">
          {/* Company Info */}
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-xl font-bold mb-4">ICorner</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Mang đến giải pháp tốt nhất cho khách hàng với chất lượng hàng
              đầu.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-primary" />
                <a
                  href="tel:+84123456789"
                  className="hover:text-primary transition-colors"
                >
                  +84 123 456 789
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-primary" />
                <a
                  href="mailto:info@ICorner.com"
                  className="hover:text-primary transition-colors"
                >
                  info@ICorner.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links - Accordion */}
          <div className="flex-1 min-w-[150px] ml-[100px]">
            <button
              onClick={() => toggleSection("quick")}
              className="flex items-center justify-between gap-5  mb-3"
            >
              <h4 className="font-semibold text-base">Liên kết nhanh</h4>
              <ChevronDown
                className={`w-5 h-5 cursor-pointer transition-transform duration-300 ${
                  openSection === "quick" ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`accordion-content ${
                openSection === "quick" ? "open" : ""
              }`}
            >
              <ul className="space-y-2 text-sm text-muted-foreground">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="hover:text-primary transition-colors block py-1"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Support Links - Accordion */}
          <div className="flex-1 min-w-[150px] ml-[100px]">
            <button
              onClick={() => toggleSection("support")}
              className="flex items-center justify-between gap-5  mb-3"
            >
              <h4 className="font-semibold text-base">Hỗ trợ</h4>
              <ChevronDown
                className={`w-5 h-5 cursor-pointer transition-transform duration-300 ${
                  openSection === "support" ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`accordion-content ${
                openSection === "support" ? "open" : ""
              }`}
            >
              <ul className="space-y-2 text-sm text-muted-foreground">
                {supportLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="hover:text-primary transition-colors block py-1"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* KHỐI BỊ LẶP ĐÃ ĐƯỢC XÓA BỎ TỪ ĐÂY */}

          {/* Newsletter & Social */}
          <div className="flex-1 min-w-[250px]">
            <h4 className="font-semibold mb-3 text-base">Đăng ký nhận tin</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Nhận thông tin mới nhất về sản phẩm và ưu đãi đặc biệt.
            </p>
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleNewsletterSubmit();
                    }
                  }}
                  placeholder="Email của bạn"
                  className="flex-1 px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <button
                  onClick={handleNewsletterSubmit}
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-1 font-medium"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <div className="flex gap-2">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all hover-lift"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border mt-8">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-muted-foreground">
            <div className="cursor-pointer">
              © {new Date().getFullYear()}{" "}
              <span className="text-primary font-semibold ">ICorner</span>. All
              rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span className="cursor-pointer">
                GPKD:{" "}
                <span className="text-foreground font-mono">0123456789</span>
              </span>
              <span className="cursor-pointer hidden sm:inline">•</span>
              <span className="cursor-pointer">Đã đăng ký bản quyền</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

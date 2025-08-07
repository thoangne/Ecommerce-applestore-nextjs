import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-border  text-muted-foreground">
      <div className="container mx-auto flex flex-col items-center justify-center text-sm">
        <p className="mb-1">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-medium">Your Company Name</span>. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

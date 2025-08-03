import React from "react";

export default function Footer() {
  return (
    <footer className=" mx-auto border-t border-dashed  text-muted-foreground">
      <div className="container mx-auto text-center text-sm text-muted-foreground ">
        &copy; {new Date().getFullYear()} Your Company Name. All rights
        reserved.
      </div>
    </footer>
  );
}

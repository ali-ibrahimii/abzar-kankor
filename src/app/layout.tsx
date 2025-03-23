import "../style/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black">
        <main className="container mx-auto">{children}</main>
      </body>
    </html>
  );
}

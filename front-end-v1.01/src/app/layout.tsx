import "./globals.css"; // Ensure you have a global CSS file with Tailwind imports

export const metadata = {
  title: "Your Business Name",
  description: "Manage your sales, purchases, and stock efficiently.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

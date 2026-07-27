import "./globals.css";

export const metadata = {
  title: "BookFlow AI – Autonomous AI Scheduling for US Market",
  description: "The #1 AI Scheduling Platform in America.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import Providers from "./providers";
import Layout from "../components/Layout";
import "../styles/global.css";

export const metadata = {
  title: "MOMENTRY - Budget Travel Adventures in India",
  description:
    "Budget travel adventures across India for backpackers and explorers.",
  icons: {
    icon: "/momentry-logo.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MOMENTRY",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#A8D5E2",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}

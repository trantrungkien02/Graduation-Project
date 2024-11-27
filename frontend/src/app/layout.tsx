import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
const dotenv = require('dotenv');
import 'antd/dist/antd.css';
import './globals.css';
import { StoreProvider } from '~/redux/store/storeProvider';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-quill/dist/quill.snow.css';
config.autoAddCss = true;
dotenv.config();
export const metadata: Metadata = {
    title: 'KTGroup Learning',
    description: 'Produced by Tran Trung Kien',
};
const plus_jakarta_sans = Plus_Jakarta_Sans({
    subsets: ['vietnamese'],
    display: 'swap',
    variable: '--font-plus-jakarta-sans',
});

const clientId = process.env.GOOGLE_CLIENT_ID;
console.log(clientId);
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <StoreProvider>
            <GoogleOAuthProvider clientId={clientId || ''}>
                <html lang="en" className={`${plus_jakarta_sans.variable}`}>
                    <body>{children}</body>
                </html>
            </GoogleOAuthProvider>
        </StoreProvider>
    );
}

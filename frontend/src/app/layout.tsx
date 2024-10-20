import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import 'antd/dist/antd.css';
import './globals.css';
import { StoreProvider } from '~/redux/store/storeProvider';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = true;

export const metadata: Metadata = {
    title: 'KTGroup',
    description: 'Produced by Tran Trung Kien',
};
const plus_jakarta_sans = Plus_Jakarta_Sans({
    subsets: ['vietnamese'],
    display: 'swap',
    variable: '--font-plus-jakarta-sans',
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <StoreProvider>
            <html lang="en" className={`${plus_jakarta_sans.variable}`}>
                <body>{children}</body>
            </html>
        </StoreProvider>
    );
}

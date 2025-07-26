import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import 'highlight.js/styles/github-dark.css'; // Example: Dark theme
import Head from "next/head";
import Script from "next/script";
// or
const App = ({ Component, pageProps }) => {
  return (
    

    <>

    <Head>
      <title>Ufuk Çakır</title>
      <link rel="icon" href="/images/letter-u.png"/>
    </Head> 
    
     {/* 2. Add the Google Analytics scripts using the next/script component */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-MDDGW0LMCD"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-MDDGW0LMCD');
        `}
      </Script>


    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Component {...pageProps} />
    </ThemeProvider>

    </>
  );
};

export default App;

import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import 'highlight.js/styles/github-dark.css'; // Example: Dark theme
import Head from "next/head";
// or
const App = ({ Component, pageProps }) => {
  return (
    

    <>

    <Head>
      <title>Ufuk Çakır</title>
      <link rel="icon" href="/images/letter-u.png"/>

      <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-MDDGW0LMCD"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-MDDGW0LMCD');
</script>
    </Head>



    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Component {...pageProps} />
    </ThemeProvider>

    </>
  );
};

export default App;

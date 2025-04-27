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
    </Head>

    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>

    </>
  );
};

export default App;

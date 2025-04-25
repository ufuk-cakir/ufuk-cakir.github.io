import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import 'highlight.js/styles/github-dark.css'; // Example: Dark theme
// or
const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default App;

import React from "react";
import "@styles/globals.css";
import moment from "moment";
import { ThemeProvider } from "@material-ui/core/";
import theme from "ui/theme/theme";
import Head from "next/head";
import Header from "ui/components/Header/Header";
import Footer from "ui/components/Footer/Footer";
import { AppContainer } from "ui/styles/pagesStyle/_app.syile";

function MyApp({ Component, pageProps }) {
  moment.locale("pt-br");
  return (
    <>
      <Head>
        <title>TARGET</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          rel="stylesheet"
        ></link>
      </Head>
      <ThemeProvider theme={theme}>
        <AppContainer>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </AppContainer>
      </ThemeProvider>
    </>
  );
}

export default MyApp;

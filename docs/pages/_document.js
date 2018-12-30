import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import JssProvider from 'react-jss/lib/JssProvider';
import getPageContext from '../utils/getPageContext';

class MyDocument extends Document {
  render() {
    return (
      <html lang="en" dir="ltr">
        <Head>
          <title>Material-UI DataTables</title>

          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

          <meta
            name="description"
            content={'MUI-Datatables is a data tables component built for React Material-UI V1'}
          />
          <meta
            name="keywords"
            content={
              'material-ui, data tables, datatables, material-ui, material-ui-datables, react tables, react data tables'
            }
          />
          <meta name="robots" content="index,follow,noodp" />
          <meta name="author" content="Gregory Nowakowski" />
          <meta name="googlebot" content="noarchive" />

          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
          <link rel="shortcut icon" href="/static/favicon.ico" />
          <style>
            {`
              body {   
                margin: 0px;
                padding: 0px;
                height: 100%;
                font-size: 16px;
                min-height: min-content;
                font-family: Roboto, Helvetica, Arial, sans-serif;
              }
              a {
                color: #0366d6;
                text-decoration: none;
              }
              p {
                line-height: 1.6;
              }
              .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string {
                background: none !important;
              }
            `}
          </style>

          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-116686642-1" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-116686642-1');
          `,
            }}
          />
        </Head>
        <body>
          {this.props.customValue}
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

MyDocument.getInitialProps = ctx => {
  const pageContext = getPageContext();
  const page = ctx.renderPage(Component => props => (
    <JssProvider registry={pageContext.sheetsRegistry} generateClassName={pageContext.generateClassName}>
      <Component pageContext={pageContext} {...props} />
    </JssProvider>
  ));

  return {
    ...page,
    pageContext,
    styles: (
      <style
        id="jss-server-side"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: pageContext.sheetsRegistry.toString() }}
      />
    ),
  };
};

export default MyDocument;

import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta charSet="UTF-8" />
                    <link rel="icon" href="/search.svg" />
                </Head>
                <body >
                    <div>
                        <Main />
                        <NextScript />
                    </div>
                </body>
            </Html>
        );
    }
}

export default MyDocument;

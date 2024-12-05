import '@/styles/globals.css';
import type { AppProps } from 'next/app'
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../../lib/apollo";
import { ToastContainer } from 'react-toastify';


function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={apolloClient}>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
            />
            <Component {...pageProps} />
        </ApolloProvider>
    )
}

export default MyApp

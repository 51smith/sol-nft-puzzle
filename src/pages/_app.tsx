import {AppProps} from 'next/app';
import Head from 'next/head';
import {FC} from 'react';
import {ContextProvider} from '../contexts/ContextProvider';
import {AppBar} from '../components/AppBar';
import {ContentContainer} from '../components/ContentContainer';
import {Footer} from '../components/Footer';
import Notifications from '../components/Notification'

require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');
require('./puzzle/puzzle.css');

const App: FC<AppProps> = ({Component, pageProps}) => {
    return (
        <>
            <Head>
            <title>Solana Scaffold Lite</title>
          </Head>

          <ContextProvider>
            <div className="flex flex-col ">
                <Notifications/>
                <AppBar/>
                <ContentContainer>
                    <Component {...pageProps} />
                </ContentContainer>
                <Footer/>
            </div>
          </ContextProvider>
        </>
    );
};

export default App;

import Head from 'next/head';
import dynamic from 'next/dynamic';

const ClientApp = dynamic(() => import('../src/client-app'), {
  ssr: false,
  loading: () => null
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Gbajs3</title>
      </Head>
      <div id="root">
        <ClientApp />
      </div>
    </>
  );
}

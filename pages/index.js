import Layout from "../components/Layout";

import clientConfig from "../client-config";

import fetch from "isomorphic-unfetch";
const Index = (props) => {
  console.warn(props);
  return <Layout>Helloword</Layout>;
};

Index.getInitialProps = async () => {
  const res = await fetch(`${clientConfig.siteUrl}/getProducts`);
  const productsData = await res.json();

  return {
    products: productsData,
  };
};

export default Index;

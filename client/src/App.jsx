import "./App.css";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const client = new ApolloClient({
  // Provide required constructor fields
  cache: new InMemoryCache(),
  uri: "http://localhost:3001/",
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
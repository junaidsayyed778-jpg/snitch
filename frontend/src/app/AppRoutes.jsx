import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "../features/products/pages/Dashboard";
import CreateProduct from "../features/products/pages/createProduct";
import Home from "../features/products/pages/Home";
import Layout from "./components/Layout";
import ProductDetails from "../features/products/pages/ProductDetails";
import Cart from "../features/products/pages/Cart";
import Profile from "../features/auth/pages/Profile";
import SellerProductDetails from "../features/products/pages/SellerProductDetails";
import UpdateVariant from "../features/products/pages/UpdateVariant";
import MyOrders from "../features/orders/pages/MyOrders";
import SellerOrders from "../features/orders/pages/SellerOrders";
import SellerLayout from "./components/SellerLayout";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: (
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        ),
      },
      {
        path: "/product/:productId",
        element: <ProductDetails />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/orders",
        element: <MyOrders />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/seller",
        element: (
          <ProtectedRoute role="seller">
            <SellerLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "/seller/create-product",
            element: <CreateProduct />,
          },
          {
            path: "/seller/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/seller/orders",
            element: <SellerOrders />,
          },
          {
            path: "/seller/product/:productId",
            element: <SellerProductDetails />,
          },
          {
            path: "/seller/product/:productId/variant/:variantId",
            element: <UpdateVariant />,
          },
        ],
      },
    ],
  },
]);

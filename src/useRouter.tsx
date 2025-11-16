import { lazy, Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { ProtectedRoute, RejectedRoute } from "./components/Helper/Helper";
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "./constants/path";
import AppLayout from "./layouts/MainLayout";

/** Pages */
const Login = lazy(() => import("@/pages/Login"));
const Google = lazy(() => import("@/pages/Google"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Wallet = lazy(() => import("@/pages/Wallet"));
const Category = lazy(() => import("@/pages/Category"));
const Transaction = lazy(() => import("@/pages/Transaction"));
const TransactionStatement = lazy(() => import("@/pages/TransactionStatement"));

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: "",
      element: <RejectedRoute />,
      children: [
        {
          path: PUBLIC_ROUTES.login,
          element: (
            <Suspense>
              <Login />
            </Suspense>
          ),
        },
        {
          path: "",
          element: (
            <Suspense>
              <Login />
            </Suspense>
          ),
        },
        {
          path: PUBLIC_ROUTES.oauthGoogleCallback,
          element: <Google />,
        },
      ],
    },
    {
      path: "",
      element: (
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          path: PRIVATE_ROUTES.dashboard,
          element: (
            <Suspense>
              <Wallet />
            </Suspense>
          ),
        },

        {
          path: PRIVATE_ROUTES.categories,
          element: (
            <Suspense>
              <Category />
            </Suspense>
          ),
        },
        {
          path: PRIVATE_ROUTES.transactions,
          element: (
            <Suspense>
              <Transaction />
            </Suspense>
          ),
        },

        {
          path: PRIVATE_ROUTES.report,
          element: (
            <Suspense>
              <TransactionStatement />
            </Suspense>
          ),
        },

        // {
        //   path: `${privateRoutes.wallets}/:id`,
        //   element: (
        //     <Suspense>
        //       <WalletDetail />
        //     </Suspense>
        //   ),
        // },
        // {
        //   path: privateRoutes.transactions,
        //   element: (
        //     <Suspense>
        //       <TransactionList />
        //     </Suspense>
        //   ),
        // },
        // {
        //   path: privateRoutes.report,
        //   element: (
        //     <Suspense>
        //       <Report />
        //     </Suspense>
        //   ),
        // },
        // {
        //   path: privateRoutes.settings,
        //   element: (
        //     <Suspense>
        //       <Settings />
        //     </Suspense>
        //   ),
        // },
      ],
    },

    // /** ============================
    //  *        NOT FOUND
    //  * ============================ */
    {
      path: "*",
      element: (
        <Suspense>
          <NotFound />
        </Suspense>
      ),
    },
  ]);

  return routeElements;
}

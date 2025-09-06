import React, { Suspense } from "react";
import Spinner from "../../../../pages/admin/spinner/Spinner";

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<Spinner />}>
      <Component {...props} />
    </Suspense>
  );

export default Loadable;

import React, { Suspense } from "react";

const Hero = React.lazy(() => import("@/src/page-section/error/Hero"));

export default function ErrorPage() {
  return (
    <div>
      <Suspense>
        <Hero />
      </Suspense>
    </div>
  )
}

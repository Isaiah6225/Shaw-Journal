"use client";

import Container from "../../components/ui/Container";
import PrivateRoutes from "../../components/PrivateRoutes";

export default function HomePage() {
  return (
    <PrivateRoutes>
      <Container>
	<div>
	hello
	</div>

      </Container>
    </PrivateRoutes>
  );
}

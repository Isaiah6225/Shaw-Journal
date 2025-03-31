"use client";

import { auth } from "../../firebase.ts";
import PrivateRoutes from "../../components/PrivateRoutes";
import Container from "../../components/ui/Container";
export default function ProfielPage(){
	return(
		<PrivateRoutes>
			<Container>
				<div>Hello </div>
			</Container>
		</PrivateRoutes>
	);
};

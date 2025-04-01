import Container from "../../components/ui/Container";
import PrivateRoutes from "../../components/PrivateRoutes";

export default function EditPosts(){
    return (

	<PrivateRoutes> 
		<Container>           
			<div> Hello </div>
		</Container>
	</PrivateRoutes>
    );
}


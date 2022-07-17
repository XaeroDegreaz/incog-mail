import {FrontendStack} from "./FrontendStack";
import {BackendStack} from "./BackendStack";
import {App} from "@serverless-stack/resources";

export default function ( app: App ) {
  app.setDefaultFunctionProps( {
    runtime: "nodejs16.x",
    srcPath: "services",
    bundle: {
      format: "esm",
    },
  } );
  app.stack( BackendStack ).stack( FrontendStack );
}

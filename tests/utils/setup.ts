import { testConn } from "./testConn";

testConn(true)
	.then(() => process.exit(0))
	.catch((err) => console.log(err));

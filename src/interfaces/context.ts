import { Request, Response } from "express";
/**
 * IContext is the custom context object.
 * It is passed in the graphql request.
 */
export interface IContext {
	req: Request;
	res: Response;
	payload?: { userId: string };
}

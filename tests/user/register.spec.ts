import { Connection } from "typeorm";
import { faker } from "@faker-js/faker";
import request from "supertest";

import { IServer } from "../../src/interfaces/server";
import { startServer } from "../utils/startServer";

let conn: Connection;
let server: IServer;

beforeAll(async () => {
	({ conn, server } = await startServer());
	server.httpServer.listen(0, () => {});
});

afterAll(async () => {
	await conn.close();
	await server.apolloServer.stop();
	server.httpServer.close();
});

const firstName = faker.name.firstName();
const lastName = faker.name.lastName();
const email = faker.internet.email();
const password = faker.internet.password();

describe("Register", () => {
	it("Successfully create a user", async () => {
		const registerQuery = `mutation {
			registerUser(data: { firstName: "${firstName}", lastName: "${lastName}", email: "${email}", password: "${password}"}) {
				id
				firstName
				lastName
				email
				createdAt
				accessToken
			}
		}`;
		const response = await request(server.app)
			.post("/graphql")
			.send({ query: registerQuery })
			.then((resp) => resp.body.data.registerUser);

		expect(response.firstName).toEqual(firstName);
		expect(response.lastName).toEqual(lastName);
		expect(response.email).toEqual(email);
		expect(response.id).not.toBeUndefined();
		expect(response.createdAt).not.toBeUndefined();
		expect(response.accessToken).not.toBeUndefined();
	});

	it("Successfully create a user when lastname is not provided", async () => {
		const firstName = faker.name.firstName();
		const email = faker.internet.email();
		const password = faker.internet.password();
		const registerQuery = `mutation {
			registerUser(data: { firstName: "${firstName}", email: "${email}", password: "${password}"}) {
				id
				firstName
				email
				createdAt
				accessToken
			}
		}`;
		const response = await request(server.app)
			.post("/graphql")
			.send({ query: registerQuery })
			.then((resp) => resp.body.data.registerUser);

		expect(response.firstName).toEqual(firstName);
		expect(response.email).toEqual(email);
		expect(response.id).not.toBeUndefined();
		expect(response.createdAt).not.toBeUndefined();
		expect(response.accessToken).not.toBeUndefined();
	});

	it("Should result in error for not providing email", async () => {
		const registerQuery = `mutation {
			registerUser(data: { firstName: "${firstName}", lastName: "${lastName}", password: "${password}"}) {
				id
				firstName
				lastName
				email
				createdAt
				accessToken
			}
		}`;
		const response = await request(server.app)
			.post("/graphql")
			.send({ query: registerQuery });
		expect(response.badRequest).toBe(true);
	});

	it("Should result in error for not providing firstname", async () => {
		const registerQuery = `mutation {
			registerUser(data: { lastName: "${lastName}", email: "${email}", password: "${password}"}) {
				id
				firstName
				lastName
				email
				createdAt
				accessToken
			}
		}`;
		const response = await request(server.app)
			.post("/graphql")
			.send({ query: registerQuery });
		expect(response.badRequest).toBe(true);
	});

	it("Should result in error for not providing password", async () => {
		const registerQuery = `mutation {
			registerUser(data: { lastName: "${lastName}", email: "${email}"}) {
				id
				firstName
				lastName
				email
				createdAt
				accessToken
			}
		}`;
		const response = await request(server.app)
			.post("/graphql")
			.send({ query: registerQuery });
		expect(response.badRequest).toBe(true);
	});
});

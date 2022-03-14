import { Connection } from "typeorm";
import { faker } from "@faker-js/faker";
import request from "supertest";

import { IServer } from "../../src/interfaces/server";
import { startServer } from "../utils/startServer";
import { Shortcut } from "../../src/entities/Shortcut";

let conn: Connection;
let server: IServer;
let shortcut: Shortcut;

const firstName = faker.name.firstName();
const lastName = faker.name.lastName();
const email = faker.internet.email();
const password = faker.internet.password();
let token: string;

beforeAll(async () => {
	({ conn, server } = await startServer());
	server.httpServer.listen(0, () => {});
});

afterAll(async () => {
	await conn.close();
	await server.apolloServer.stop();
	server.httpServer.close();
});

const shortLink = faker.random.word();
const description = faker.random.word();
const sourceURL = faker.internet.url();

describe("Create Shortcut", () => {
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

		token = response.accessToken;
	});

	it("Successfully create shortcut", async () => {
		const query = `
			mutation {
  createShortcut(data:{shortLink:"${shortLink}", description:"${description}", sourceURL: "${sourceURL}"}) {
    id
    user {
      id
    }
    shortLink
    description
    sourceURL
    tags
  }
}
		`;
		const headers = {
			Authorization: `Bearer ${token}`
		};
		shortcut = await request(server.app)
			.post("/graphql")
			.set(headers)
			.send({ query: query })
			.then((resp) => resp.body.data.createShortcut);
	});

	it("Successfully delete shortcut", async () => {
		const query = `mutation {
  		deleteShortcut(data: "${shortcut.id}")
		}
		`;
		const headers = {
			Authorization: `Bearer ${token}`
		};
		const response = await request(server.app)
			.post("/graphql")
			.set(headers)
			.send({ query: query })
			.then((resp) => resp.body.data.deleteShortcut);
		expect(response).toEqual(shortcut.id);
	});
});

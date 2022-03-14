import { Connection } from "typeorm";
import { faker } from "@faker-js/faker";
import request from "supertest";

import { IServer } from "../../src/interfaces/server";
import { startServer } from "../utils/startServer";

let conn: Connection;
let server: IServer;
let userId: string;

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
		userId = response.id;
		expect(response.firstName).toEqual(firstName);
		expect(response.lastName).toEqual(lastName);
		expect(response.email).toEqual(email);
		expect(response.id).not.toBeUndefined();
		expect(response.createdAt).not.toBeUndefined();
		expect(response.accessToken).not.toBeUndefined();
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
		const response = await request(server.app)
			.post("/graphql")
			.set(headers)
			.send({ query: query })
			.then((resp) => resp.body.data.createShortcut);

		expect(response.id).not.toBeUndefined();
		expect(response.user.id).toEqual(userId);
		expect(response.shortLink).toEqual(shortLink);
		expect(response.description).toEqual(description);
		expect(response.sourceURL).toEqual(sourceURL);
	});

	it("Should result in an error for not providing shortlink", async () => {
		const query = `
			mutation {
  createShortcut(data:{description:"${description}", sourceURL: "${sourceURL}"}) {
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
		const response = await request(server.app)
			.post("/graphql")
			.set(headers)
			.send({ query: query });
		expect(response.badRequest).toEqual(true);
	});

	it("Should result in an error for not providing description", async () => {
		const query = `
			mutation {
  createShortcut(data:{shortLink:"${shortLink}", sourceURL: "${sourceURL}"}) {
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
		const response = await request(server.app)
			.post("/graphql")
			.set(headers)
			.send({ query: query });
		expect(response.badRequest).toEqual(true);
	});

	it("Should result in an error for not providing sourceURL", async () => {
		const query = `
			mutation {
  createShortcut(data:{shortLink:"${shortLink}", description:"${description}""}) {
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
		const response = await request(server.app)
			.post("/graphql")
			.set(headers)
			.send({ query: query });
		expect(response.badRequest).toEqual(true);
	});
});

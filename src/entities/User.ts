import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn
} from "typeorm";
import { Field, ID, InputType, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field()
	@Column({ length: "32" })
	firstName: string;

	@Field({ nullable: true })
	@Column({ length: "32", nullable: true })
	lastName?: string;

	@Field()
	@Column({ length: "32", unique: true })
	email: string;

	@Field()
	@Column()
	password: string;

	@Field()
	@CreateDateColumn()
	createdAt: Date;
}

@InputType()
export class UserRegInput implements Partial<User> {
	@Field()
	firstName: string;

	@Field({ nullable: true })
	lastName?: string;

	@Field()
	email: string;

	@Field()
	password: string;
}

@InputType()
export class UserLoginInput implements Partial<User> {
	@Field()
	email: string;

	@Field()
	password: string;
}

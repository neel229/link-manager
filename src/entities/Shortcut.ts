import { IsNotEmpty, IsUrl } from "class-validator";
import {
	Field,
	ID,
	InputType,
	ObjectType,
	registerEnumType
} from "type-graphql";
import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	ManyToOne,
	PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Shortcut {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Field(() => User)
	@ManyToOne(() => User, (user) => user.shortcuts)
	user: User;

	@Field()
	@Column({ name: "short_link", unique: true })
	@Index()
	shortLink: string;

	@Field()
	@Column()
	@Index()
	description: string;

	@Field()
	@Column({ name: "source_url" })
	sourceURL: string;

	@Field(() => [String], { nullable: true })
	@Column("simple-array", { nullable: true })
	tags?: string[];

	@CreateDateColumn({ name: "created_at" })
	createdAt: Date;
}

@InputType()
export class NewShortcutInput implements Partial<Shortcut> {
	@Field()
	@IsNotEmpty()
	shortLink: string;

	@Field()
	@IsNotEmpty()
	description: string;

	@Field()
	@IsUrl()
	sourceURL: string;

	@Field(() => [String], { nullable: true })
	tags?: string[];
}

export enum SortableField {
	shortLink,
	description,
	createdAt
}

registerEnumType(SortableField, {
	name: "SortableField",
	description: "Fields on which sorting needs to be applied"
});

export enum SortOrder {
	ASC = "ASC",
	DESC = "DESC"
}

registerEnumType(SortOrder, {
	name: "SortOrder",
	description:
		"The order in which sorting needs to be done. Can be either ascending or descending"
});

@InputType()
export class SortInput {
	@Field(() => SortableField, {
		nullable: true
	})
	field?: SortableField;

	@Field(() => SortOrder, {
		nullable: true,
		defaultValue: "ASC"
	})
	order?: SortOrder;
}

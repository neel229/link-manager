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
	@Column({ unique: true })
	@Index()
	shortLink: string;

	@Field()
	@Column()
	@Index()
	description: string;

	@Field()
	@Column()
	sourceURL: string;

	@Field(() => [String], { nullable: true })
	@Column("simple-array", { nullable: true })
	tags?: string[];

	@CreateDateColumn()
	createdAt: Date;
}

@InputType()
export class NewShortcutInput implements Partial<Shortcut> {
	@Field()
	shortLink: string;

	@Field()
	description: string;

	@Field()
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

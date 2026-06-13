import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  AllowNull,
  Default
} from "sequelize-typescript";
import Company from "./Company";
import Ticket from "./Ticket";
import Contact from "./Contact";

@Table
class Comment extends Model<Comment> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @ForeignKey(() => Ticket)
  @Column
  ticketId: number;

  @BelongsTo(() => Ticket)
  ticket: Ticket;

  @ForeignKey(() => Contact)
  @Column
  contactId: number;

  @BelongsTo(() => Contact)
  contact: Contact;

  @AllowNull(false)
  @Column
  channelType: string;

  @AllowNull(false)
  @Column
  externalCommentId: string;

  @Column
  postId: string;

  @Column
  authorName: string;

  @Column
  authorUsername: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  body: string;

  @Column
  mediaUrl: string;

  @Default(0)
  @Column
  likeCount: number;

  @Default(0)
  @Column
  replyCount: number;

  @Default(false)
  @Column
  isSpam: boolean;

  @Default(false)
  @Column
  isReplied: boolean;

  @Column(DataType.DATE)
  repliedAt: Date;

  @Column(DataType.DATE)
  externalCreatedAt: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Comment;

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
  AllowNull
} from "sequelize-typescript";
import Company from "./Company";

@Table
class InstagramAccount extends Model<InstagramAccount> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Company)
  @Column
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @AllowNull(false)
  @Column
  igUserId: string;

  @AllowNull(false)
  @Column
  igUsername: string;

  @Column
  pageId: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  accessToken: string;

  @Column(DataType.DATE)
  tokenExpiresAt: Date;

  @Column({ defaultValue: "connected" })
  status: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default InstagramAccount;

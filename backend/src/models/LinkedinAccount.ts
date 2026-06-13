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
class LinkedinAccount extends Model<LinkedinAccount> {
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
  liOrganizationId: string;

  @AllowNull(false)
  @Column
  liOrganizationName: string;

  @Column
  liOrganizationLogo: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  accessToken: string;

  @Column(DataType.TEXT)
  refreshToken: string;

  @Column(DataType.DATE)
  tokenExpiresAt: Date;

  @Column(DataType.DATE)
  lastPollAt: Date;

  @Column({ defaultValue: "connected" })
  status: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default LinkedinAccount;

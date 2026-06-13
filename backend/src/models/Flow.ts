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

@Table
class Flow extends Model<Flow> {
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
  name: string;

  @Column
  description: string;

  @AllowNull(false)
  @Column({ defaultValue: "first_contact" })
  triggerType: string;

  @Column
  triggerValue: string;

  @AllowNull(false)
  @Column({ defaultValue: "all" })
  channelType: string;

  @Default(false)
  @Column
  isActive: boolean;

  @Default([])
  @Column(DataType.JSONB)
  nodes: object[];

  @Default([])
  @Column(DataType.JSONB)
  edges: object[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Flow;

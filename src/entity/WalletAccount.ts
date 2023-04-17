import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
@Entity("wallet_account")
export class WalletAccount {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "account_number", nullable: true })
    accountNumber: string;

    @Column("varchar", { name: "account_balance", nullable: true })
    accountBalance: number;

    @Column("int", { name: "last_deposit", nullable: true })
    lastDeposit: number;

    @Column("int", { name: "last_service_charge", nullable: true })
    lastServiceCharge: number;

    @Column("varchar", { name: "last_payment_method", nullable: true })
    lastPaymentMethod: string;

    @OneToOne(() => User, user => user.walletAccountId) // specify inverse side as a second parameter
    user: User;

}
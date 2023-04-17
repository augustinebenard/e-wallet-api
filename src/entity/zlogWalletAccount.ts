import { WalletAccount } from './WalletAccount';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from './User';

@Entity("zlog_wallet_account")
export class ZlogWalletAccount {
    @PrimaryGeneratedColumn('increment', { type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "service", length: 199 })
    service: string;

    @Column("int", { name: "amount", nullable: true })
    amount: number;
    @Column("varchar", { name: "description", nullable: true })
    description: string;

    @Column("int", { name: "current_account_balance", nullable: true })
    currentAccountBalance: number;

    @Column("varchar", { name: "transaction_charge", nullable: true })
    transactionCharge: number;


    @Column("varchar", { name: "status" })
    status: string;

    @Column({ type: 'date', name: "date_created" })
    date: Date | null;
y
    @ManyToOne(() => User, user => user.id, { eager: true },) // specify inverse side as a second parameter
    @JoinColumn()
    userId: User;


}
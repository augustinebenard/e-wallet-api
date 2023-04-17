import { WalletAccount } from './WalletAccount';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class User {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "firstName", length: 199 })
    firstName: string;

    @Column("varchar", { name: "lastName", length: 199 })
    lastName: string;

    @Column("varchar", { name: "username" })
    username: string;

    @Column("varchar", { name: "email" })
    email: string;

    @Column("varchar", { name: "phone" })
    phone: string;

    @Column("varchar", { name: "address", nullable: true })
    address: string;

    @Column("varchar", { name: "transactionPin", nullable: true })
    transactionPin: string;

    @Column("varchar", { name: "account_no", nullable: true })
    accountNo: string;

    @Column("varchar", { name: "profilePic" })
    profilePic: string;

    @Column("varchar", { name: "password", length: 199 })
    password: string;

    @Column("varchar", { name: "plainPassword", length: 199 })
    plainPassword: string;

    @Column({ type: 'date', name: "date_created" })
    dateCreated: Date | null;

    // Foreign Entity
    // @OneToOne(() => WalletAccount)
    // @JoinColumn()
    // walletAccountId: WalletAccount;
    @OneToOne(() => WalletAccount, walletAccountId => walletAccountId.user, { cascade: true, eager: true },) // specify inverse side as a second parameter
    @JoinColumn()
    walletAccountId: WalletAccount;


}

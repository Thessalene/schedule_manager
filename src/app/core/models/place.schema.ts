import { JoinColumn, JoinTable, OneToMany, Column, PrimaryGeneratedColumn, Entity } from "typeorm";
import { Evenement } from "./evenement.schema";

@Entity("place")
export class Place {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    label: string;

    @Column({ nullable : true})
    postCode: number;

    @Column({ nullable : true})
    country: string;

    @OneToMany(type => Evenement, event => event.startPoint)
    @JoinTable()
    eventsFrom: Evenement[];

    @OneToMany(type => Evenement, event => event.endPoint, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinTable()
    eventsTo: Evenement[];

}
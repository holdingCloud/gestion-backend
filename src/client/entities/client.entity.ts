export class ClientEntity {
	id: number;
	fullname: string;
	city: string;
	address: string;
	zone: string;
	phone: string;
	email: string;
	available: boolean;
	createdAt: Date;
	updatedAt: Date;

	constructor(partial: Partial<ClientEntity>) {
		Object.assign(this, partial);
	}
}

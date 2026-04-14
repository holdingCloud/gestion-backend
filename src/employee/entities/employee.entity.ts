import { typePosition } from '@prisma/client';

export class EmployeeEntity {
	id: number;
	rut: string;
	fullname: string;
	email: string;
	salary: number;
	hireDate: string;
	city: string;
	address: string;
	available: boolean;
	type: typePosition;
	createdAt: Date;
	updatedAt: Date;

	constructor(partial: Partial<EmployeeEntity>) {
		Object.assign(this, partial);
	}
}

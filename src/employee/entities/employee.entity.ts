import { typePosition } from '@prisma/client';
import { DireccionEntity } from 'src/direcciones/entities/direccion.entity';

export class EmployeeEntity {
	id: number;
	rut: string;
	fullname: string;
	email: string;
	salary: number;
	hireDate: string;
	available: boolean;
	type: typePosition;
	direccionId?: number | null;
	direccion?: DireccionEntity | null;
	createdAt: Date;
	updatedAt: Date;

	constructor(partial: Partial<EmployeeEntity>) {
		Object.assign(this, partial);
	}
}

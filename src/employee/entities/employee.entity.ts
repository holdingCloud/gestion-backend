import { EstadoCivil, typePosition } from '@prisma/client';
import { DireccionEntity } from 'src/direcciones/entities/direccion.entity';

export class EmployeeEntity {
	id: number;
	rut: string;
	fullname: string;
	email: string;
	salary: number;
	hireDate: Date;
	available: boolean;
	type: typePosition;
	fechaNacimiento?: Date | null;
	estadoCivil?: EstadoCivil | null;
	cargoId?: number | null;
	departamentoId?: number | null;
	afpId?: number | null;
	sistemasSaludId?: number | null;
	mutualId?: number | null;
	jefeId?: number | null;
	direccionId?: number | null;
	direccion?: DireccionEntity | null;
	createdAt: Date;
	updatedAt: Date;

	constructor(partial: Partial<EmployeeEntity>) {
		Object.assign(this, partial);
	}
}

export class ProductEntity {
	id: number;
	name: string;
	description: string;
	quantity: number;
	available: boolean;
	img: string;
	code: string;
	createdAt: Date;
	updatedAt: Date;

	constructor(partial: Partial<ProductEntity>) {
		Object.assign(this, partial);
	}
}

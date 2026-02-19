import { Injectable } from "@nestjs/common";;
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserRepository {
constructor(private prisma: PrismaService) {}


create(data: CreateUserDto) {
const { rol, ...rest } = data;

console.log(data)

return this.prisma.users.create({ 
  data: {
	...rest,
	rol: {
	  connect: { id: rol }
	}
  }
});
}


findAll() {
return this.prisma.users.findMany();
}


findOne(id: number) {
return this.prisma.users.findUnique({ where: { id } });
}


update(data: UpdateUserDto) {
const { id, rol, ...rest } = data;
return this.prisma.users.update({ 
  where: { id }, 
  data: {
	...rest,
	...(rol && { rol: { connect: { id: rol } } })
  }
});
}


remove(id: number) {
return this.prisma.users.delete({ where: { id } });
}

async findByEmail(email:string){
return this.prisma.users.findUnique({ 
  where: { email },
  include: { rol: true }
});
}

}
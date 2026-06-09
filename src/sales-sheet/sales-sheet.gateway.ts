import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SalesSheetService } from './sales-sheet.service';
import { DetailsSalesSheetService } from 'src/details-sales-sheet/details-sales-sheet.service';
import { WsSalesSheetRoomDto } from './dto/ws-sales-sheet-room.dto';
import { WsSalesSheetDetailDto } from './dto/ws-sales-sheet-detail.dto';
import { WsAddSalesSheetDetailDto } from './dto/ws-add-sales-sheet-detail.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'sales-sheet',
})
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)

export class SalesSheetGateway implements OnGatewayConnection, OnGatewayDisconnect {
 
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(SalesSheetGateway.name);
  private readonly roomDetailsBuffer = new Map<number, WsSalesSheetDetailDto[]>();
  // Rooms activos en memoria
  private readonly activeRooms = new Set<string>();

  handleConnection(client: Socket) {
    this.logger.log(`New client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: WsSalesSheetRoomDto) {
    const roomName = `sales-sheet-${data.salesSheetId}`;

  // Esto crea el room si no existe y une al cliente
  client.join(roomName);
    this.activeRooms.add(roomName);

    this.logger.log(`Client ${client.id} joined room: ${roomName}`);

    const bufferedDetails = this.roomDetailsBuffer.get(data.salesSheetId) ?? [];

  // Emite solo a los que están en ese room
  this.server.to(roomName).emit('room-joined', {
    salesSheetId: data.salesSheetId,
    message: 'Te uniste al room correctamente',
    bufferedDetails,
  });
  }

  @SubscribeMessage('add-detail')
  handleAddDetail(@MessageBody() data: WsAddSalesSheetDetailDto) {
    const roomName = `sales-sheet-${data.salesSheetId}`;
    const roomExists = this.activeRooms.has(roomName);

    if (!roomExists) {
      return { event: 'error', message: `El room ${roomName} no existe. Debes hacer join-room primero.` };
    }

     const existingBuffer = this.roomDetailsBuffer.get(data.salesSheetId) ?? [];
    const nextDetail: WsSalesSheetDetailDto = {
      clientsId: data.clientsId,
      productsId: data.productsId,
      quantity: data.quantity,
      discount: data.discount,
    };

    const updatedBuffer = [...existingBuffer, nextDetail];
    this.roomDetailsBuffer.set(data.salesSheetId, updatedBuffer);

    this.logger.log(`Detail added to room ${roomName}: ${JSON.stringify(nextDetail)}`);
    // Emite a todos en el room incluyendo al emisor
    this.server.to(roomName).emit('detail-added', {
      salesSheetId: data.salesSheetId,
      detail: nextDetail,
      bufferedDetails: updatedBuffer,
    });

    return { event: 'detail-added', detail: nextDetail };
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() data: WsSalesSheetRoomDto) {
    const roomName = `sales-sheet-${data.salesSheetId}`;
    

    
    client.leave(roomName);
    this.roomDetailsBuffer.delete(data.salesSheetId);
    this.activeRooms.delete(roomName);

    this.logger.log(`Client ${client.id} left room: ${roomName}`);
    return { event: 'left-room', message: `Saliste del room ${roomName}` };
  }
}

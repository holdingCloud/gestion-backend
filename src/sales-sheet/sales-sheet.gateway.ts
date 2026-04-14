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
  server: Server;

  private readonly logger = new Logger(SalesSheetGateway.name);
  private readonly roomDetailsBuffer = new Map<number, WsSalesSheetDetailDto[]>();

  constructor(
    private readonly salesSheetService: SalesSheetService,
    private readonly detailsSalesSheetService: DetailsSalesSheetService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: WsSalesSheetRoomDto,
  ) {
  
    await this.salesSheetService.findOne(body.salesSheetId);

    const roomName = this.getRoomName(body.salesSheetId);
    await client.join(roomName);

    const bufferedDetails = this.roomDetailsBuffer.get(body.salesSheetId) ?? [];

    this.logger.log(`Client ${client.id} joined room ${roomName}. Buffered details count: ${bufferedDetails.length}`);

    return {
      dato: 'este-dato-es-para-el-join-room',
      event: 'room-joined',
      salesSheetId: body.salesSheetId,
      bufferedDetails,
    };
  }

  @SubscribeMessage('add-detail')
  async addDetailToRoom(
    @MessageBody() body: WsAddSalesSheetDetailDto,
  ) {
    await this.salesSheetService.findOne(body.salesSheetId);

    const existingBuffer = this.roomDetailsBuffer.get(body.salesSheetId) ?? [];
    const nextDetail: WsSalesSheetDetailDto = {
      clientsId: body.clientsId,
      productsId: body.productsId,
      quantity: body.quantity,
      discount: body.discount,
    };

    const updatedBuffer = [...existingBuffer, nextDetail];
    this.roomDetailsBuffer.set(body.salesSheetId, updatedBuffer);

    this.logger.log(`Detail added to room ${this.getRoomName(body.salesSheetId)}. Buffered details count: ${updatedBuffer.length}`);

    this.server.to(this.getRoomName(body.salesSheetId)).emit('buffer-updated', {
      salesSheetId: body.salesSheetId,
      bufferedDetails: updatedBuffer,
    });

    return {
      event: 'detail-buffered',
      salesSheetId: body.salesSheetId,
      bufferedCount: updatedBuffer.length,
      detail: nextDetail,
    };
  }

  @SubscribeMessage('get-buffer')
  async getRoomBuffer(@MessageBody() body: WsSalesSheetRoomDto) {
    await this.salesSheetService.findOne(body.salesSheetId);

    const bufferedDetails = this.roomDetailsBuffer.get(body.salesSheetId) ?? [];

    return {
      salesSheetId: body.salesSheetId,
      bufferedDetails,
    };
  }

  @SubscribeMessage('close-room')
  async closeRoom(@MessageBody() body: WsSalesSheetRoomDto) {
    await this.salesSheetService.findOne(body.salesSheetId);

    const bufferedDetails = this.roomDetailsBuffer.get(body.salesSheetId) ?? [];

    if (bufferedDetails.length === 0) {
      this.roomDetailsBuffer.delete(body.salesSheetId);

      this.server.to(this.getRoomName(body.salesSheetId)).emit('room-closed', {
        salesSheetId: body.salesSheetId,
        persistedCount: 0,
      });

      return {
        event: 'room-closed',
        salesSheetId: body.salesSheetId,
        persistedCount: 0,
      };
    }

    const persistedDetails = await Promise.all(
      bufferedDetails.map((detail) =>
        this.detailsSalesSheetService.create({
          ...detail,
          salesSheetId: body.salesSheetId,
        }),
      ),
    );

    this.roomDetailsBuffer.delete(body.salesSheetId);

    this.server.to(this.getRoomName(body.salesSheetId)).emit('room-closed', {
      salesSheetId: body.salesSheetId,
      persistedCount: persistedDetails.length,
    });

    return {
      event: 'room-closed',
      salesSheetId: body.salesSheetId,
      persistedCount: persistedDetails.length,
      persistedDetails,
    };
  }

  private getRoomName(salesSheetId: number): string {
    return `sales-sheet-${salesSheetId}`;
  }
}

import io from 'socket.io';
import ActiveRooms from '../../common/room-store';
import MessageService from '../../api/services/MessageService';
import Message from '../../api/models/Message';

type IChatMessage = {
  room: string;
  user: string;
  msg: string;
}

export default class SocketIOService {
  private _service: MessageService;

  constructor(service: MessageService) {
    this._service = service;
  }

  client(socket: io.Socket, rooms: ActiveRooms) {
    socket.on('create_room', (chatUuid: string) => {
      socket.join(chatUuid);
      rooms.addRoom(chatUuid);
      socket.emit('room', { room: chatUuid });
    });

    socket.on('leave', (chatUuid: string) => {
      rooms.deleteRoom(chatUuid);
      socket.emit('list', rooms.rooms);
      socket.leave(chatUuid);
    });

    socket.on('message', async (data: IChatMessage) => {
      await this._service.create({
        userUuid: data.user,
        chatUuid: data.room,
        message: data.msg
      });
      socket.to(`${data.room}`).emit('message', data.msg);
    });
  }

  support(socket: io.Socket, rooms: ActiveRooms) {
    socket.on('list', () => {
      socket.emit('list', rooms.rooms);
    });

    socket.on('join', async (chatUuid: string) => {
      if (socket.adapter.rooms[chatUuid].length === 2) {
        socket.emit('fault', { error: 'too much' });
      } else {
        const messages: Array<Message> | null = await this._service.findByChat(
          chatUuid
        );
        socket.join(chatUuid);
        socket.to(chatUuid).emit('messages', messages);
      }
    });

    socket.on('message', async (data: IChatMessage) => {
      await this._service.create({
        userUuid: data.user,
        chatUuid: data.room,
        message: data.msg
      });
      socket.to(`${data.room}`).emit('message', data.msg);
    });
  }
}

import { Server, Socket } from "socket.io";
import { Types } from "mongoose";
import { SOCKET_EVENTS, TYPING_TIMEOUT } from "./../modules/chat/chat.constant";
import { onlineUserStore } from "./socket.utils";
import { ChatService } from "./../modules/chat/chat.service";
import { NotificationService } from "./../modules/notifications/notification.service";
import { AISupportService } from "./../modules/ai-support/ai.support.service";

import {
  IDeleteMessagePayload,
  IJoinChatPayload,
  ILeaveChatPayload,
  ILoadOlderMessagesPayload,
  IMessageDeliveredPayload,
  IMessagesReadPayload,
  ISendMessagePayload,
  ITypingPayload,
  IUpdateMessagePayload,
} from "./../modules/chat/chat.interface";

export function registerChatHandlers(io: Server, socket: Socket): void {
  const userId = socket.data.userId as string;
  const userObjectId = new Types.ObjectId(userId);

  const emitError = (message: string) =>
    socket.emit(SOCKET_EVENTS.ERROR, { message });

  const toUser = (targetId: string, event: string, data: unknown) => {
    const sid = onlineUserStore.getSocketId(targetId);
    if (sid) io.to(sid).emit(event, data);
  };

  const pushChatList = async (targetUserId: string) => {
    try {
      const chats = await ChatService.getUserChats(
        new Types.ObjectId(targetUserId),
      );
      const sid = onlineUserStore.getSocketId(targetUserId);
      if (sid) io.to(sid).emit(SOCKET_EVENTS.CHAT_LIST, chats);
    } catch {
      // Non-critical
    }
  };

  //  unread notification count to a specific user
  const pushNotificationCount = async (targetUserId: string) => {
    try {
      const count =
        await NotificationService.getUnreadNotificationCount(targetUserId);
      const sid = onlineUserStore.getSocketId(targetUserId);
      if (sid) io.to(sid).emit(SOCKET_EVENTS.NOTIFICATION_COUNT, { count });
    } catch {
      // Non-critical
    }
  };

  // shared message count to a specific user
  const pushSharedMessageCount = async (targetUserId: string) => {
    try {
      const count = await AISupportService.getSharedMessageCount(
        new Types.ObjectId(targetUserId),
      );
      const sid = onlineUserStore.getSocketId(targetUserId);
      if (sid) io.to(sid).emit(SOCKET_EVENTS.SHARED_MESSAGE_COUNT, { count });
    } catch {
      // Non-critical
    }
  };

  // On Connect
  onlineUserStore.add(userId, socket.id);

  io.emit(SOCKET_EVENTS.USER_STATUS, {
    userId,
    isOnline: true,
    lastSeen: new Date(),
  });

  socket.emit(SOCKET_EVENTS.ONLINE_USERS_LIST, {
    userIds: onlineUserStore.onlineUserIds(),
  });

  // Hydrate sidebar on connect
  ChatService.getUserChats(userObjectId)
    .then((chats) => socket.emit(SOCKET_EVENTS.CHAT_LIST, chats))
    .catch((err) => emitError(err.message));


  pushNotificationCount(userId);
  pushSharedMessageCount(userId);

  // join chat
  socket.on(SOCKET_EVENTS.JOIN_CHAT, async (payload: IJoinChatPayload) => {
    try {
      const chatId = new Types.ObjectId(payload.chatId);
      await socket.join(payload.chatId);
      const messages = await ChatService.getChatMessages(chatId, userObjectId);
      socket.emit(SOCKET_EVENTS.CHAT_MESSAGES, {
        chatId: payload.chatId,
        messages,
      });
      await ChatService.markChatRead(chatId, userObjectId);
    } catch (err: any) {
      emitError(err.message);
    }
  });

  // leave chat
  socket.on(SOCKET_EVENTS.LEAVE_CHAT, (payload: ILeaveChatPayload) => {
    socket.leave(payload.chatId);
  });

  // load older messages
  socket.on(
    SOCKET_EVENTS.LOAD_OLDER_MESSAGES,
    async (payload: ILoadOlderMessagesPayload) => {
      try {
        const messages = await ChatService.loadOlderMessages(
          payload,
          userObjectId,
        );
        socket.emit(SOCKET_EVENTS.OLDER_MESSAGES_LOADED, {
          chatId: payload.chatId,
          messages,
          offset: payload.offset,
        });
      } catch (err: any) {
        emitError(err.message);
      }
    },
  );

  // send message
  socket.on(
    SOCKET_EVENTS.SEND_MESSAGE,
    async (payload: ISendMessagePayload) => {
      try {
        const message = await ChatService.sendMessage(payload, userObjectId);
        const chatId = (message.chatId as Types.ObjectId).toString();

        io.to(chatId).emit(SOCKET_EVENTS.MESSAGE_NEW, message);

        const receiverSocketId = onlineUserStore.getSocketId(
          payload.receiverId,
        );

        if (receiverSocketId) {
          const roomSockets = io.sockets.adapter.rooms.get(chatId);
          if (!roomSockets?.has(receiverSocketId)) {
            io.to(receiverSocketId).emit(SOCKET_EVENTS.MESSAGE_NEW, message);
          }
          await ChatService.markDelivered(
            message._id as Types.ObjectId,
            new Types.ObjectId(payload.receiverId),
          );
          socket.emit(SOCKET_EVENTS.MESSAGE_DELIVERED, {
            messageId: message._id,
            chatId,
          });
        }

        await Promise.all([
          pushChatList(userId),
          pushChatList(payload.receiverId),
        ]);
      } catch (err: any) {
        emitError(err.message);
      }
    },
  );

  // update message
  socket.on(
    SOCKET_EVENTS.UPDATE_MESSAGE,
    async (payload: IUpdateMessagePayload) => {
      try {
        const message = await ChatService.updateMessage(payload, userObjectId);
        io.to(payload.chatId).emit(SOCKET_EVENTS.MESSAGE_UPDATED, message);
      } catch (err: any) {
        emitError(err.message);
      }
    },
  );

  // delete message
  socket.on(
    SOCKET_EVENTS.DELETE_MESSAGE,
    async (payload: IDeleteMessagePayload) => {
      try {
        const message = await ChatService.deleteMessage(payload, userObjectId);
        io.to(payload.chatId).emit(SOCKET_EVENTS.MESSAGE_DELETED, {
          messageId: message._id,
          chatId: payload.chatId,
          deletedBy: userId,
        });
      } catch (err: any) {
        emitError(err.message);
      }
    },
  );

  // message delivered
  socket.on(
    SOCKET_EVENTS.MESSAGE_DELIVERED,
    async (payload: IMessageDeliveredPayload) => {
      try {
        await ChatService.markDelivered(
          new Types.ObjectId(payload.messageId),
          userObjectId,
        );
        io.to(payload.chatId).emit(SOCKET_EVENTS.MESSAGE_DELIVERED, payload);
      } catch (err: any) {
        emitError(err.message);
      }
    },
  );

  // messages read
  socket.on(
    SOCKET_EVENTS.MESSAGES_READ,
    async (payload: IMessagesReadPayload) => {
      try {
        await ChatService.markChatRead(
          new Types.ObjectId(payload.chatId),
          userObjectId,
        );
        toUser(payload.senderId, SOCKET_EVENTS.MESSAGES_READ, {
          chatId: payload.chatId,
          readBy: userId,
        });
      } catch (err: any) {
        emitError(err.message);
      }
    },
  );

  // typing
  const typingTimers = new Map<string, ReturnType<typeof setTimeout>>();

  socket.on(SOCKET_EVENTS.USER_TYPING, (payload: ITypingPayload) => {
    toUser(payload.receiverId, SOCKET_EVENTS.USER_TYPING, {
      chatId: payload.chatId,
      userId,
    });
    const key = `${userId}:${payload.chatId}`;
    if (typingTimers.has(key)) clearTimeout(typingTimers.get(key)!);
    typingTimers.set(
      key,
      setTimeout(() => {
        toUser(payload.receiverId, SOCKET_EVENTS.USER_STOPPED_TYPING, {
          chatId: payload.chatId,
          userId,
        });
        typingTimers.delete(key);
      }, TYPING_TIMEOUT),
    );
  });

  socket.on(SOCKET_EVENTS.USER_STOPPED_TYPING, (payload: ITypingPayload) => {
    const key = `${userId}:${payload.chatId}`;
    if (typingTimers.has(key)) {
      clearTimeout(typingTimers.get(key)!);
      typingTimers.delete(key);
    }
    toUser(payload.receiverId, SOCKET_EVENTS.USER_STOPPED_TYPING, {
      chatId: payload.chatId,
      userId,
    });
  });

  // disconnect
  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    typingTimers.forEach((t) => clearTimeout(t));
    typingTimers.clear();
    const disconnectedId = onlineUserStore.removeBySocket(socket.id);
    if (disconnectedId) {
      const userInfo = onlineUserStore.getUser(disconnectedId);
      io.emit(SOCKET_EVENTS.USER_STATUS, {
        userId: disconnectedId,
        isOnline: false,
        lastSeen: userInfo?.lastSeen ?? new Date(),
      });
    }
  });
}

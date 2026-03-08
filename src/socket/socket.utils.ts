import { IOnlineUser } from "../modules/chat/chat.interface";

class OnlineUserStore {
  private users = new Map<string, IOnlineUser>();
  private socketIndex = new Map<string, string>();

  add(userId: string, socketId: string): void {
    const entry: IOnlineUser = {
      userId,
      socketId,
      lastSeen: new Date(),
      isOnline: true,
    };
    this.users.set(userId, entry);
    this.socketIndex.set(socketId, userId);
  }

  removeBySocket(socketId: string): string | undefined {
    const userId = this.socketIndex.get(socketId);
    if (!userId) return undefined;

    this.socketIndex.delete(socketId);
    const user = this.users.get(userId);
    if (user) {
      user.isOnline = false;
      user.lastSeen = new Date();
    }
    return userId;
  }

  getSocketId(userId: string): string | undefined {
    const user = this.users.get(userId);
    return user?.isOnline ? user.socketId : undefined;
  }

  getUser(userId: string): IOnlineUser | undefined {
    return this.users.get(userId);
  }

  onlineUserIds(): string[] {
    return Array.from(this.users.values())
      .filter((u) => u.isOnline)
      .map((u) => u.userId);
  }
}

export const onlineUserStore = new OnlineUserStore();

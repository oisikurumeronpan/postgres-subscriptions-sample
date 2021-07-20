import { Resolvers, Room, TextMessage } from './generated/gql-types';
import { pubsub } from './pubsub';
import * as uuid from 'uuid';

let rooms: Room[] = [
  { id: 'test-1', name: 'test 1', messages: [] },
  { id: 'test-2', name: 'test 2', messages: [] },
];

export const resolvers: Resolvers = {
  Query: {
    room: (_, { id }) => rooms.find(r => r.id === id) ?? null,
  },
  Mutation: {
    createRoom: (_, { input }) => {
      const newRoom: Room = { id: uuid.v4(), name: input.name };
      rooms = [...rooms, newRoom];
      return newRoom;
    },
    sendTextMessage: (_, { input }) => {
      const index = rooms.findIndex(r => r.id === input.roomId);

      if (index < 0) {
        return null;
      }

      const room = rooms[index];

      const newMessage: TextMessage = { __typename: 'TextMessage', id: uuid.v4(), publisher: input.publisher, body: input.body, createdAt: new Date() };

      room.messages = [...(room.messages ?? []), newMessage];

      rooms[index] = room;

      pubsub.publish(`onSendedMessage:${input.roomId}`, { sendedMessage: newMessage });
      return newMessage;
    },
  },
  Subscription: {
    sendedMessage: {
      subscribe: (_, { roomId }) => pubsub.asyncIterator(`onSendedMessage:${roomId}`),
    },
  },
};

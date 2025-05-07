# Threadlet API

The Threadlet API package provides a robust interface for interacting with the Threadlet backend. It includes utilities for managing forums, posts, messages, and users, as well as real-time event handling through WebSocket connections.

## Features

- **Forum Management**: Create, retrieve, and manage forums and their associated tags.
- **Post Management**: Create, retrieve, and manage posts within forums.
- **Message Management**: Send and retrieve messages within posts.
- **User Management**: Fetch user details and manage sessions.
- **Real-Time Events**: Listen to events such as message creation, post updates, and forum changes via WebSocket.
- **Validation**: Built-in schema validation using `zod`.

## Installation

To install the package, use [jsr](https://jsr.io/@j0code/threadlet-api):

```bash
npx jsr add @j0code/threadlet-api
```

## Usage

### Initialization

```typescript
import ThreadletAPI from "@j0code/threadlet-api/v0"

const api = new ThreadletAPI("your-access-token")

// Example: Fetch all forums
const forums = await api.getForums()
console.log(forums)
```

### Real-Time Event Handling

```typescript
api.on("messageCreate", (message) => {
  console.log("New message created:", message)
})
```

### API Methods

> [!TIP]
> For full API docs, see https://jsr.io/@j0code/threadlet-api/doc

#### Forums

- `getForums()`: Retrieve all forums.
- `getForum(forumId: string)`: Retrieve a specific forum by ID.
- `createForum(forum: ForumOptions)`: Create a new forum.

#### Posts

- `getPosts(forumId: string)`: Retrieve all posts in a forum.
- `getPost(forumId: string, postId: string)`: Retrieve a specific post by ID.
- `createPost(forumId: string, post: PostOptions)`: Create a new post in a forum.

#### Messages

- `getMessages(forumId: string, postId: string)`: Retrieve all messages in a post.
- `createMessage(forumId: string, postId: string, msg: MessageOptions)`: Create a new message in a post.

#### Users

- `getUser(userId: string)`: Retrieve user details by ID.

## Configuration

The API package uses default endpoints for the Threadlet backend. You can override these by providing custom options during initialization:

```typescript
const api = new ThreadletAPI("your-access-token", {
  API_ROOT: "https://your-custom-api-root",
  GATEWAY: "wss://your-custom-gateway",
});
```

## Error Handling

The package provides detailed error information through `ThreadletAPIError` and `ThreadletZodError`. These include metadata such as the route, HTTP status, and validation errors.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the terms of the [GNU General Public License 3 or later](./LICENSE).

## Support

For issues or questions, please open an issue on the [GitHub repository](https://github.com/j0code/threadlet).

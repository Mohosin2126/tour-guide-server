# tour-guide-server
 - Express Framework:

 Utilized Express for building a web server to handle HTTP requests and responses.
 
CORS Middleware:

- Incorporated the CORS middleware to enable cross-origin resource sharing.
Environment Variables:

- Employed the dotenv package to manage and access environment variables securely.
JSON Web Tokens (JWT):

- Implemented JWT for user authentication, generating and validating tokens for secure access to protected routes.
MongoDB Connection:

 Established a connection to a MongoDB database using the mongodb and mongoose libraries.
  
- API Routes:

  Defined various API routes for different functionalities, including data retrieval, user management, authentication, and handling bookings.
  
- Middleware Functions:

  Created middleware functions for JWT verification, admin role verification, and guide role verification to ensure secure access to specific routes.

- Collections in MongoDB:

  Utilized MongoDB collections for storing data related to tours (dataCollection), tour categories (categoryCollection), tour guides (guideCollection), wishlists (wishlistCollection), bookings (bookingCollection), users (userCollection), stories (storyCollection), and comments (commentCollection).

- User Role Management:

Implemented functionality to assign roles (admin or guide) to users and verified their roles using middleware.

- Express Routes:

 Created routes for handling user authentication, admin functionalities, guide functionalities, wishlists, bookings, and story sections.
Server Deployment:

  Configured the server to run on the specified port, defaulting to 5000 if no port is provided.
  
- Listening to Requests:

Configured the server to listen for incoming requests and respond with appropriate messages.

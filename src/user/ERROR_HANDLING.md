# User Module - Error Handling Documentation

## Overview

The User module implements comprehensive error handling following clean code principles and NestJS best practices. This includes custom exceptions, exception filters, interceptors, and structured logging.

## Architecture

### 1. **Custom Exceptions** (`exceptions/`)

Custom domain-specific exceptions that provide clear, meaningful error messages:

- **`UserNotFoundException`**: Thrown when a user is not found by ID or email
- **`UserAlreadyExistsException`**: Thrown when attempting to create a user with a duplicate email
- **`InvalidRoleException`**: Thrown when an invalid role ID is provided

**Usage Example:**
```typescript
if (!user) {
  throw new UserNotFoundException(userId);
}
```

### 2. **Exception Filters** (`filters/`)

#### PrismaExceptionFilter
Catches Prisma database errors and transforms them into user-friendly HTTP responses.

**Handled Error Codes:**
- `P2002`: Unique constraint violation → 409 Conflict
- `P2025`: Record not found → 404 Not Found
- `P2003`: Foreign key constraint → 400 Bad Request
- `P2014`: Relation constraint violation → 400 Bad Request
- `P2000`: Value too long → 400 Bad Request
- `P2001`: Record does not exist → 404 Not Found

#### HttpExceptionFilter
Catches standard HTTP exceptions and formats responses consistently.

**Response Format:**
```json
{
  "statusCode": 404,
  "timestamp": "2026-02-23T10:30:00.000Z",
  "message": "User with identifier '5' was not found",
  "error": "Not Found"
}
```

### 3. **Interceptors** (`interceptors/`)

#### LoggingInterceptor
Logs all incoming requests and their responses with timing information.

**Log Format:**
```
[LoggingInterceptor] GET /users/5 200 - 45ms
```

### 4. **Repository Layer Error Handling**

The repository implements:
- **Try-catch blocks** around all database operations
- **Validation** of foreign key relationships before operations
- **Custom exception throwing** for specific error cases
- **Structured logging** with context

**Example:**
```typescript
async create(data: CreateUserDto) {
  try {
    // Validate role exists
    const roleExists = await this.prisma.roles.findUnique({
      where: { id: data.rol },
    });

    if (!roleExists) {
      throw new InvalidRoleException(data.rol);
    }

    return await this.prisma.users.create({...});
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new UserAlreadyExistsException(data.email);
      }
    }
    this.logger.error(`Error creating user`, error.stack);
    throw error;
  }
}
```

### 5. **Service Layer Error Handling**

The service layer:
- **Validates** entity existence before operations
- **Transforms** repository responses to entities
- **Logs** significant operations (create, update, delete)
- **Re-throws** custom exceptions for controller handling

**Example:**
```typescript
async findOne(id: number): Promise<UserEntity> {
  try {
    const user = await this.repo.findOne(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return new UserEntity({...});
  } catch (error) {
    if (error instanceof UserNotFoundException) {
      throw error; // Pass custom exceptions through
    }
    this.logger.error(`Failed to fetch user`, error.stack);
    throw error;
  }
}
```

### 6. **Controller Layer**

The controller uses:
- **`@UseFilters`**: Applies exception filters
- **`@UseInterceptors`**: Applies logging interceptor
- **`ParseIntPipe`**: Validates route parameters
- **`@HttpCode`**: Sets explicit status codes

**Example:**
```typescript
@Controller('users')
@UseFilters(PrismaExceptionFilter, HttpExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class UserController {
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
```

## Error Flow

1. **Request** → Controller validates input with pipes
2. **Service** → Validates business logic and entity existence
3. **Repository** → Validates database constraints and relationships
4. **Prisma Error** → Caught by repository try-catch
5. **Custom Exception** → Thrown with meaningful message
6. **Exception Filter** → Transforms to HTTP response
7. **Logging Interceptor** → Logs the complete request/response cycle

## Benefits

### Clean Code Principles
- **Single Responsibility**: Each layer handles specific concerns
- **Separation of Concerns**: Errors separated by domain and technical concerns
- **DRY**: Reusable exception classes and filters
- **KISS**: Simple, readable error handling flow

### Production Benefits
- **Consistent API responses** across all endpoints
- **Detailed logging** for debugging
- **Security**: No sensitive database errors exposed to clients
- **Observability**: Request timing and error tracking
- **Maintainability**: Easy to extend with new error types

## Usage in Other Modules

To apply this pattern to other modules (client, employee, product):

1. Create `exceptions/` folder with domain-specific exceptions
2. Create `filters/` folder and copy the filters (or use global filters)
3. Create `interceptors/` folder and copy the logging interceptor
4. Update repository with try-catch and custom exceptions
5. Update service with validation and error re-throwing
6. Update controller with decorators

**Quick Setup:**
```typescript
// In your module controller
@Controller('your-resource')
@UseFilters(PrismaExceptionFilter, HttpExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class YourController {
  // ... endpoints
}
```

## Testing Error Scenarios

### Test duplicate email:
```bash
POST /users
{ "email": "existing@example.com", ... }
# Response: 409 Conflict
```

### Test invalid user ID:
```bash
GET /users/99999
# Response: 404 Not Found
```

### Test invalid role ID:
```bash
POST /users
{ "rol": 99999, ... }
# Response: 400 Bad Request
```

### Test invalid input:
```bash
GET /users/abc
# Response: 400 Bad Request (ParseIntPipe)
```

## Monitoring & Logging

All errors are logged with:
- **Timestamp**
- **Context** (which operation failed)
- **Error message**
- **Stack trace** (for 5xx errors)
- **Request timing**

Example log output:
```
[UserRepository] Error creating user: User with email 'test@example.com' already exists
[LoggingInterceptor] POST /users 409 - 123ms
```
